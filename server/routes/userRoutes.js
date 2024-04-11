import { Router } from "express";
const router = Router();
import { login, register, logout, getUserAuthentication, sendFriendRequest, getFriendRequests, updateFriendRequest } from "../controllers/userController.js";
import {checkToken} from "../middlewares/checkToken.js";
import { validateCredentials } from "../middlewares/registerValidator.js";

router.post("/login", login);
router.post("/register",validateCredentials, register);
router.post("/logout", logout);
router.get("/get-auth", checkToken, getUserAuthentication);
router.post("/friend-request", sendFriendRequest);
router.get("/get-friend-request/:userId/:type", getFriendRequests);
router.put("/update-friend-request", updateFriendRequest);

export default router;