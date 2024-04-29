import express from "express";
const router = express.Router();
import { checkToken } from "../middlewares/checkToken.js";
import {
  chatList,
  createRoom,
  findChat,
  getConversation,
  inChatUserDetails,
} from "../controllers/chatController.js";
import checkConversation from "../middlewares/checkConvo.js";

export const chatRoutes = ({ io }) => {
  router.get("/chat-list", checkToken, chatList);
  router.post("/create", checkToken, createRoom);
  router.get(
    "/:chatId",
    checkToken,
    checkConversation,
    getConversation
  );
  router.post("/check-chats", checkToken, findChat);
  router.get("/user-in-chat/:chatId", checkToken,checkConversation, inChatUserDetails);
  return router;
};
