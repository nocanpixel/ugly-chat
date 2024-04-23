import { Sequelize } from "sequelize";
import { enumsFriends } from "./userController.js";

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
      });

      if (!checkSubscription) throw new Error("Subscription not found");

      const send = await this.Messages.create({
        from_user: userId,
        chat_id: chatId,
        context: context,
      });

      const formatResponse = {
        userId: userId,
        username: socket.request.session.user.name,
        context: context,
        createdAt: send.dataValues.createdAt,
      };

      return formatResponse;
    } catch (_) {
      return { error: `${_}` };
    }
  }

  async findUserTarget(socket, chatId) {
    try {
      const checkSubscription = await this.Subscribers.findOne({
        where: {
          chat_id: chatId,
          user_id:{[Sequelize.Op.ne]:socket.userId}
        },
        attributes:['user_id'],
      });

      return checkSubscription
    } catch (_) {
      return { error: "ERROR", _ };
    }
  }
}
