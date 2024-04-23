import express from "express";
const router = express.Router();
import { checkToken } from "../middlewares/checkToken.js";
import {
  chatList,
  createRoom,
  getConversation,
} from "../controllers/chatController.js";
import checkConversation from "../middlewares/checkConvo.js";

export const chatRoutes = ({io}) => {
  router.get("/chat-list", checkToken({io}), chatList);
  router.post("/create", checkToken({io}), createRoom);
  router.get("/:chatId", checkToken({io}), checkConversation, getConversation);
  return router;
};
