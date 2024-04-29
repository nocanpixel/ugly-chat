import Chats from "../models/Chats.js";
import Subscribers from "../models/Subscribers.js";
import { Sequelize } from "sequelize";
import Users from "../models/Users.js";
import Friendship from "../models/Friendship.js";
import Messages from "../models/Messages.js";
import { messageDate } from "../utils.js";

const findDuplicates = (arr) => {
  return arr.reduce(
    (acc, element) => {
      if (acc[element]) {
        acc.duplicates.push(element);
      } else {
        acc[element] = true;
      }
      return acc;
    },
    { duplicates: [] }
  ).duplicates;
};

export const createRoom = async (req, res, next) => {
  const id = req.user.id;
  const { target_user } = req.body;

  const users = [id, target_user];

  const checkIfRoomExists = await Subscribers.findAll({
    where: {
      user_id: { [Sequelize.Op.in]: users },
    },
    attributes: ["chat_id"],
  });

  const roomsArr = checkIfRoomExists.map((ele) => ele.dataValues.chat_id);

  const exists = findDuplicates(roomsArr);

  if (exists.length > 0) return res.status(200).send(exists);

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
        .status(200)
        .send(`Can't initiate a chat without being friends first`);

    const create = await Chats.create();

    const room_id = create.dataValues.id;

    const respond = await Subscribers.bulkCreate(
      [
        { user_id: id, chat_id: room_id },
        { user_id: target_user, chat_id: room_id },
      ],
      {returning:true}
    );
    return res.status(200).json(respond[0].dataValues.chat_id);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const findChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const resp = await Chats.findOne({
      where: {
        id: chatId,
      },
    });
    return res.status(200).send("Ok");
  } catch (_) {
    return res.status(500).send(_);
  }
};

export const inChatUserDetails = async (req, res) => {
  try {
    const { _openChat } = req.user;
    res.status(200).json(_openChat);
  } catch (_) {
    return { status: "ERROR", _ };
  }
};

export const chatList = async (req, res) => {
  try {
    const id = req.user.id;

    const query = await Subscribers.findAll({
      where: {
        user_id: id,
      },
      attributes: ["chat_id"]
    });

    const allMyChats = query.map((chat) => chat.dataValues.chat_id);

    const openChats = await Subscribers.findAll({
      where: {
        chat_id: { [Sequelize.Op.in]: allMyChats },
        user_id: {[Sequelize.Op.ne]: id}
      },
      include: [
        {
          model: Users,
          attributes: ["id", "username"],
        },
        {
          model: Messages,
          attributes: {
            include: [
              //[Sequelize.fn("COUNT", Sequelize.literal("CASE WHEN message_offset = 1 THEN 1 ELSE NULL END")), "n_message_offset"],
              [
                Sequelize.literal(
                  `(SELECT COUNT(*) FROM Messages WHERE Messages.message_offset = 1 AND Messages.from_user = User.id)`
                ),
                "n_message_offset",
              ],
            "id","from_user"],
          },
        },
      ],
    });

    const formatResults = openChats.map((r) => {
      const lastMessage = r.dataValues.Message;
      const user = r.dataValues.User.dataValues;

      if (!lastMessage) {
        return {
          id:false,
          user_id: user.id,
          chat_id: r.dataValues.chat_id,
          username: user.username,
          context: false,
          from_user:false,
          time: false,
          n_message_offset: false,
          seen: false,
        };
      }

      return {
        id: lastMessage.dataValues.id,
        user_id: user.id,
        chat_id: r.dataValues.chat_id,
        username: user.username,
        from_user: lastMessage.dataValues.from_user,
        context: lastMessage.dataValues.context,
        time: messageDate(lastMessage.dataValues.createdAt),
        n_message_offset: lastMessage.dataValues.n_message_offset,
        seen: lastMessage.dataValues.seen,
      };
    });

    return res.status(200).send(formatResults);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getConversation = async (req, res) => {
  const { chatId } = req.params;
  const id = req.user.id;

  try {
    const query = await Messages.findAll({
      where: { chat_id: chatId },
      attributes: ["context", "createdAt","seen","id"],
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: Users,
          attributes: ["username", "is_online", "id"],
        },
      ],
    });

    const formatQuery = query.map((element) => ({
      id: element.dataValues.id,
      userId: element.User.dataValues.id,
      context: element.dataValues.context,
      seen: element.dataValues.seen,
      createdAt: element.dataValues.createdAt,
    }));

    return res.status(200).send(formatQuery);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }

  return res.status(200).send(chatId);
};
