import { Sequelize, where } from "sequelize";
import { enumsFriends } from "./userController.js";
import { messageDate } from "../utils.js";

export class DB {
  constructor(Users, Friendship, UserFriendship, Subscribers, Messages) {
    this.Users = Users;
    this.Friendship = Friendship;
    this.UserFriendship = UserFriendship;
    this.Subscribers = Subscribers;
    this.Messages = Messages;
  }

  async setUserIsConnected(userId) {
    try {
      const response = await this.Users.update(
        { is_online: true },
        { where: { id: userId } }
      );
      return response;
    } catch (_) {
      ({ error: "Error connecting user" });
    }
  }

  async setUserIsDisconnected(userId) {
    try {
      const response = await this.Users.update(
        { is_online: false },
        { where: { id: userId } }
      );
      return response;
    } catch (_) {
      ({ error: "Error Disconnecting user" });
    }
  }

  async getFriends(userId) {
    try {
      const response = await this.UserFriendship.findAll({
        attributes: ["friendship_id"],
        where: {
          user_id: userId,
        },
        raw: true,
      });

      const myFriendshipId = response.map((friends) => friends.friendship_id);

      const friends = await this.UserFriendship.findAll({
        where: {
          friendship_id: { [Sequelize.Op.in]: myFriendshipId },
          user_id: { [Sequelize.Op.ne]: userId },
        },
        attributes: [],
        include: [
          {
            model: this.Friendship,
            where: { status: enumsFriends.accepted },
          },
          {
            model: this.Users,
            attributes: ["id"],
          },
        ],
      });

      return friends.map((friend) => friend.User.dataValues.id);
    } catch (_) {
      ({ error: "Couldn't find frents" });
    }
  }
  
  async sendMessage(socket, chatId, context) {
    const userId = socket.userId;
    try {
      const checkSubscription = await this.Subscribers.findOne({
        where: { user_id: userId, chat_id: chatId },
        include:[
          {
            model:this.Messages,
            attributes:['id']
          }
        ]
      });
      
      
      if (!checkSubscription) throw new Error("Subscription not found");
      
      
      const send = await this.Messages.create({
        from_user: userId,
        chat_id: chatId,
        message_offset: true,
        seen: false,
        context: context,
      });
      
      const formatResponse = {
        id: send.dataValues.id,
        userId: userId,
        first: checkSubscription.Message===null?true:undefined,
        context: context,
        seen: send.dataValues.seen,
        createdAt: messageDate(send.dataValues.createdAt),
      };
      
      
      await this.Subscribers.update(
        {message_id: send.dataValues.id},
        {where: {
          chat_id: send.dataValues.chat_id,
        }}
      )

      return formatResponse;
    } catch (_) {
      return { error: `${_}` };
    }
  }

  async findUserTarget(socket, chatId) {
    const userId = socket.userId;
    try {
      const checkSubscription = await this.Subscribers.findOne({
        where: {
          chat_id: chatId,
          user_id: { [Sequelize.Op.ne]: userId },
        },
        attributes: ["user_id"],
      });

      return checkSubscription;
    } catch (_) {
      return { error: "ERROR", _ };
    }
  }

  async searchUser({ socket, userId, tag }) {
    const tagSession = socket.request.user.tag;
    const getUserDetails = await this.Users.findOne({
      where: {
        [Sequelize.Op.and]: [{ tag: { [Sequelize.Op.ne]: tagSession } }, { tag: tag }],
      },
      attributes: ["id"],
    });

    if(!getUserDetails) return {qStatus:"ERROR", info: `Uhm... sorry. Could you please double check the username seems to be incorrect.`}
    
    const targetId = getUserDetails.id;

    const existingRequest = await this.Friendship.findOne({
      where: {
        [Sequelize.Op.or]: [
          { user_1: userId, user_2: targetId },
          { user_1: targetId, user_2: userId },
        ],
      },
      attributes:['status']
    });

    const existingStatus = existingRequest?.dataValues?.status;

    if(existingStatus===enumsFriends.accepted)return {qStatus:"ERROR", info: `${tag} is already your friend!`}
    if (existingStatus===enumsFriends.pending) return {qStatus:"ERROR", info:`Yo already sent a friend request to ${tag}`};

    const sendRequest = await this.Friendship.create({
      user_1: userId,
      user_2: targetId,
    });

    if(!sendRequest) return{qStatus:"ERROR", info:`Couldn't create Friendship`};

    
    await this.UserFriendship.bulkCreate(
      [
        {friendship_id: sendRequest.dataValues.id, user_id: userId},
        {friendship_id: sendRequest.dataValues.id, user_id: targetId},
      ],
      { returning: true }
    );
    
    if(sendRequest) return{qStatus:"SUCCESS",data:targetId, info:`Your friend request to ${tag} was sent.`}
  }


  async findUserByEmail(email){
    const res = await this.Users.findOne({
      where: { email }
    })
    return res;
  }


  async updateSeenMessage({socket, chatId,listener}){

    try{
      if(!listener)return;

      const target = await this.findUserTarget(socket,chatId);
      const userTarget = target.dataValues.user_id;

      this.updateOffset({userTarget,listener});

      const checkExistingMessages = await this.Messages.findAll({
        where:{
          from_user: userTarget,
          seen: false,
        }
      })

      if(checkExistingMessages.length<=0)return;

      await this.Messages.update(
        {seen: true},
        {where:{
          seen: false,
          from_user: userTarget,
        },
      },
      );

      const messagedUpdated =  checkExistingMessages.map(ele=> ({
        userId: ele.from_user,
        messageId:ele.id,
      }))

      return messagedUpdated;

    }catch(_){
      return {status:"ERRROR",error:_}
    }
  }

  async updateOffset({userTarget}){
    if(!userTarget)return;
    
    const checkExistingOffset = await this.Messages.findAll({
      where: {
        message_offset:true,
        from_user:userTarget,
      }
    })

    if(checkExistingOffset.length<0)return;

    await this.Messages.update(
      {message_offset: false},
      {
        where: {
          message_offset: true,
          from_user:userTarget
        }
      }
    )
    
  }


  async getChatList(socket,chatId) {
    const res = await this.findUserTarget(socket, chatId);
    const target = res.dataValues.user_id;
    
    const query = await this.Subscribers.findAll({
      where:{
        user_id: target,
      },
      attributes:["chat_id"],
      include:[{
        model:this.Messages
      }]
    });

    const allMyChats = query.map((chat)=>chat.dataValues.Message.chat_id);

    const openChats = await this.Subscribers.findAll({
      where: {
        chat_id: {[Sequelize.Op.in]: allMyChats},
        user_id: {[Sequelize.Op.ne]: target}
      },
      order:[["updatedAt","DESC"]],
      attributes:[],
      include: [
        {
          model:this.Users,
          attributes: ["id","username"]
        },
        {
          model:this.Messages,
          attributes:{
            include:[
              [
                Sequelize.literal(
                  `(SELECT COUNT(*) FROM Messages WHERE Messages.message_offset=1 AND Messages.from_user = User.id)`
                ),
                "n_message_offset"
              ],
              "id","from_user"
            ]
          }
        },
      ]
    });

    return openChats.map((chat) => {
      const message = chat.dataValues.Message.dataValues;
      const user = chat.dataValues.User.dataValues;

      return {
        id:message.id,
        user_id:user.id,
        chat_id:message.chat_id,
        username:user.username,
        from_user:message.from_user,
        context:message.context,
        time: messageDate(message.createdAt),
        n_message_offset: message.n_message_offset,
        seen: message.seen,
      }
    })


  }

}
