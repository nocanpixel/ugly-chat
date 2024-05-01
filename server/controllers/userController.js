import Users from "../models/Users.js";
import memoryCache from "memory-cache";
import Friendship from "../models/Friendship.js";
import { Sequelize } from "sequelize";
import UserFriendship from "../models/UserFriendship.js";
import { generateIdentifier } from "../utils.js";
import argon2 from "argon2";
import { logger } from "../config/db-config.js";
import chalk from "chalk";

const signupLimit = 2;
const signupWindow = 60 * 60 * 1000;

export const enumsFriends = {
  accepted: "accepted",
  pending: "pending",
  rejected: "rejected",
};

function hasExceededLimit(ip) {
  const count = memoryCache.get(ip) || 0;
  return count >= signupLimit;
}

// const createSession = async ({ userId, username, tag, req, res }) => {
//   try {

//     if (!userId || !username || !tag)return res.status(500).send("Something missing!");
//     req.user = { id: userId, name: username.username, tag: tag };
//     res.status(200).json("Logged");
//   } catch (error) {
//     return { error: "Internal server error" };
//   }
// };

const register = async (req, res) => {
  try {
    const ip = req.ip;
    if (hasExceededLimit(ip)) {
      return res.status(429).send("Too many signups from this IP address.");
    }
    memoryCache.put(ip, (memoryCache.get(ip) || 0) + 1, signupWindow);
    const { username, email, password } = req.body;
    const hashedPassword = await argon2.hash(password);
    const tag = generateIdentifier(username, email);

    const insertUser = await Users.create({
      username,
      tag,
      email,
      password: hashedPassword,
      is_online: true,
    });

    if (!insertUser) throw new Error("Something went wrong");

    req.login(insertUser, (err)=>{
      if (err) {
        return next(err);
      }
      return res.status(201).json({ message: 'User registered successfully', user: insertUser });
    })


  } catch (error) {
    res.status(500).json({
      error: "This account already exists",
    });
  }
};

// const login = (io) => async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userAuth = req.cookies.auth;

//     if (userAuth) return res.status(200).send("Already logged In");
//     const user = await Users.findOne({ where: { email } });
//     if (!user) throw new Error("Email or password is incorrect");
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) throw credentialsError;
//     const userId = user.id;
//     const tag = user.tag;
//     const username = user.username
//     createSession({ userId, username, tag, req, res });
//   } catch (error) {
//     res.status(400).json({
//       error: error.message,
//     });
//   }
// };

const logout =
  ({ io, sqldb }) =>
  async (req, res, next) => {
    try {
      const id = req.user.id;
      req.session.destroy(async (err) => {

        if (err) {
          return next(err);
        }
        res.clearCookie("sid");
        res.status(204).end();
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

const getUserAuthentication = async (req, res) => {
  try {
    const userAuth = req.user;
    res.status(200).json({
      status: res.statusCode,
      res: {
        id: userAuth.id,
        name: userAuth.email,
        tag: userAuth.tag,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const { user_2 } = req.body;
    const id = req.user.id;
    if (user_2 === id)
      return res
        .status(500)
        .json({ message: `Can't send a friend request to yourself!` });
    const existingRequest = await Friendship.findOne({
      where: {
        [Sequelize.Op.or]: [
          { user_1: id, user_2: user_2 },
          { user_1: user_2, user_2: id },
        ],
      },
    });

    if (existingRequest)
      return res.status(400).json({ error: "Duplicate request" });

    const sendRequest = await Friendship.create({
      user_1: id,
      user_2: user_2,
    });

    if (!sendRequest) throw new Error("Something went wrong");

    await UserFriendship.bulkCreate(
      [
        { friendship_id: sendRequest.dataValues.id, user_id: id },
        { friendship_id: sendRequest.dataValues.id, user_id: user_2 },
      ],
      { returning: true }
    );

    return res.status(200).send(sendRequest);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const id = req.user.id;
    const myRequests = await UserFriendship.findAll({
      attributes: ["friendship_id"],
      where: {
        user_id: id,
      },
      raw: true,
    });

    const myFriendshipId = myRequests.map((request) => request.friendship_id);

    const onPending = await UserFriendship.findAll({
      where: {
        friendship_id: myFriendshipId,
        user_id: { [Sequelize.Op.ne]: id },
      },
      attributes: [],
      include: [
        {
          model: Friendship,
          where: {
            [Sequelize.Op.and]: [
              { user_1: { [Sequelize.Op.ne]: id } },
              { status: enumsFriends.pending },
            ],
          },
          attributes: ["id"],
        },
        {
          model: Users,
          attributes: ["username"],
        },
      ],
    });

    const format = onPending.map((pending) => ({
      user: pending.dataValues.User.dataValues.username,
      friendship_id: pending.dataValues.Friendship.dataValues.id,
    }));

    return res.status(200).json(format);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const updateFriendRequest = async (req, res) => {
  try {
    const { request_id, response } = req.body;
    const findRequest = await Friendship.findOne({
      where: { id: request_id, status: enumsFriends.pending },
    });

    const query = await UserFriendship.findAll({
      where: { friendship_id: request_id },
    });

    if (!findRequest) return res.status(200).send(`Friend request foundn't`);

    const updateFriendship = await Friendship.update(
      { status: response },
      {
        where: { id: request_id },
      }
    );

    if (!updateFriendship) return res.status(500).send(`Something went wrong`);

    if (response === enumsFriends.rejected) {
      await Friendship.destroy({
        where: { id: request_id },
      });
      await UserFriendship.destroy({
        where: { friendship_id: request_id },
      });
    }

    return res.status(200).send(`Friend request: ${response}`);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getFriends = async (req, res) => {
  try {
    const id = req.user.id;
    const myRequests = await UserFriendship.findAll({
      attributes: ["friendship_id"],
      where: {
        user_id: id,
      },
      raw: true,
    });

    const myFriendshipId = myRequests.map((request) => request.friendship_id);

    const friends = await UserFriendship.findAll({
      where: {
        friendship_id: { [Sequelize.Op.in]: myFriendshipId },
        user_id: { [Sequelize.Op.ne]: id },
      },
      attributes: [],
      include: [
        {
          model: Friendship,
          where: { status: enumsFriends.accepted },
        },
        {
          model: Users,
          attributes: ["id", "username"],
        },
      ],
    });

    const response = friends.map((ele) => ele.User.dataValues);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};


export const  onSuccess  = (req,res) => {
  logger.info(chalk.bgCyan(` ${req.user.username} has just logged in `))
  res.status(200).send(req.user);
}

export const onError = (_err, _req, res, _next) => {
  res.status(400).send({
    message: "invalid credentials",
  });
}

export {
  register,
  logout,
  getUserAuthentication,
  sendFriendRequest,
  getFriendRequests,
  updateFriendRequest,
  getFriends,
};
