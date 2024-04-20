import express from "express";
const router = express.Router();
import { checkToken } from "../middlewares/checkToken.js";
import {
  chatList,
  createRoom,
  getConversation,
  sendMessage,
} from "../controllers/chatController.js";
import checkConversation from "../middlewares/checkConvo.js";

export const chatRoutes = () => {
  router.get("/chat-list", checkToken, chatList);
  router.post("/create", checkToken, createRoom);
  router.get("/:chatId", checkToken, checkConversation, getConversation);
  router.post("/send-message", checkToken, sendMessage);
  return router;
};
