import Chats from "../models/Chats.js";
import Subscribers from "../models/Subscribers.js";
import { Sequelize } from "sequelize";
import Users from "../models/Users.js";
import Friendship from "../models/Friendship.js";
import Messages from "../models/Messages.js";
import UserFriendship from "../models/UserFriendship.js";
import { enumsFriends } from "./userController.js";

export const createRoom = async (req, res, next) => {
  const { id } = req.user;
  const { target_user } = req.body;

  try {
    const checkFriendship = await Friendship.findOne({
      where: {
        [Sequelize.Op.or]: [
          { user_1: id, user_2: target_user },
          { user_1: target_user, user_2: id },
        ],
      },
    });

    if (!checkFriendship)
      return res
        .status(201)
        .send(`Can't initiate a chat without being friends first`);

    const findChat = await Subscribers.findOne({
      where: {
        [Sequelize.Op.and]: [
          {
            [Sequelize.Op.or]: [{ user_id: id }, { user_id: target_user }],
          },
        ],
        chat_id: Sequelize.literal(`
            (SELECT chat_id FROM subscribers WHERE user_id = '${id}')
            IN
            (SELECT chat_id FROM subscribers WHERE user_id = '${target_user}')
          `),
      },
    });

    if (findChat) return res.status(201).send("This chat already exists");

    const create = await Chats.create();

    const room_id = create.dataValues.id;

    const respond = await Subscribers.bulkCreate(
      [
        { user_id: id, chat_id: room_id },
        { user_id: target_user, chat_id: room_id },
      ],
      { returning: true }
    );

    return res.status(201).json({ res: respond });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const chatList = async (req, res) => {
  const { id } = req.user;
  
  try {
    const query = await UserFriendship.findAll({
      where: {
        user_id: { [Sequelize.Op.ne]: id },
      },
      attributes: [],
      include: [
        {
          model: Friendship,
          where: { status: enumsFriends.accepted },
          attributes: [],
        },
        {
          model: Users,
          attributes: ["username", "id"],
        },
      ],
    });

    const formatQuery = query.map((q) => q.dataValues.User.id);

    const result = await Subscribers.findAll({
      where: {
        user_id: { [Sequelize.Op.in]: formatQuery },
      },
      attributes: ["chat_id"],
      include: [
        {
          model: Users,
          attributes: ["username", "is_online","id"],
        },
      ],
    });

    const findUserInChat = await Subscribers.findOne({
      where: {
        user_id: id,
      },
      attributes: ["chat_id"],
    });

    if(!findUserInChat)return res.status(201).send([])

    const { chat_id } = findUserInChat.dataValues;

    const getMessages = await Messages.findOne({
      where: { chat_id: chat_id },
      order: [["createdAt", "DESC"]],
    });


    const formatResult = result.map((r) => ({
      user_id: r.dataValues.User.id,
      chat_id: r.dataValues.chat_id,
      username: r.dataValues.User.username,
      context: getMessages?.dataValues.context||false,
      is_online: r.dataValues.User.is_online,
    }));

    return res.status(201).send(formatResult);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getConversation = async (req, res) => {
  const { chatId } = req.params;

  try {
    const query = await Messages.findAll({
      where: { chat_id: chatId },
      attributes: ["context","createdAt"],
      order:[["createdAt","ASC"]],
      include: [
        {
          model: Users,
          attributes: ["username", "is_online", "id"],
        },
      ],
    });

    const formatQuery = query.map(element=> ({
      userId: element.User.dataValues.id,
      username: element.User.dataValues.username,
      isOnline: element.User.dataValues.is_online,
      context: element.dataValues.context,
      createdAt: element.dataValues.createdAt,
    }))

    return res.status(201).send(formatQuery);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }

  return res.status(201).send(chatId);
};

export const sendMessage = async (req, res) => {
  const { chatId, context } = req.body;
  const { id } = req.user;

  try {
    const checkSubscription = await Subscribers.findOne({
      where: { user_id: id, chat_id: chatId },
    });

    if (!checkSubscription)
      return res.status(201).json({ message: "Subscription not found!" });

    const send = await Messages.create({
      from_user: id,
      chat_id: chatId,
      context: context,
    });

    if (send) {
      await Subscribers.update(
        { message_id: send.dataValues.id },
        {
          where: {
            chat_id: chatId,
            user_id: id,
          },
        }
      );
    }

    const getLast = await Messages.findOne({
      where:{id:send.dataValues.id},
      attributes:['context','createdAt'],
      include:[{
        model:Users,
        attributes:['username']
      }]
    })

    const formatedData = {
      userId: id,
      username: getLast.User.dataValues.username,
      context: getLast.dataValues.context,
      createdAt: getLast.dataValues.createdAt,
    }
    res.status(201).json(formatedData);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
