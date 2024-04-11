import { Router } from "express";
const router = Router();
import { checkToken } from "../middlewares/checkToken.js";
import { createChat } from "../controllers/chatController.js";

router.post("/create", createChat);

export default router;