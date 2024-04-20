import express from "express";
const router = express.Router();
import {
  login,
  register,
  logout,
  getUserAuthentication,
  sendFriendRequest,
  getFriendRequests,
  updateFriendRequest,
  getFriends,
} from "../controllers/userController.js";
import { checkToken } from "../middlewares/checkToken.js";
import { validateCredentials } from "../middlewares/registerValidator.js";


  // router.post("/login", login);
  // router.post("/register", validateCredentials, register);
  // router.post("/logout", logout);
  // router.get("/get-auth", checkToken, getUserAuthentication);
  // router.post("/friend-request", checkToken, sendFriendRequest);
  // router.get("/get-friend-request", checkToken, getFriendRequests);
  // router.put("/update-friend-request", checkToken, updateFriendRequest);
  // router.get("/get-friends", checkToken, getFriends);
  // export default router;


  export const userRoutes =(io)=>{
    router.post("/login", login(io));
    router.post("/register", validateCredentials, register);
    router.post("/logout", logout(io));
    router.get("/get-auth", checkToken, getUserAuthentication);
    router.post("/friend-request", checkToken, sendFriendRequest);
    router.get("/get-friend-request", checkToken, getFriendRequests);
    router.put("/update-friend-request", checkToken, updateFriendRequest);
    router.get("/get-friends", checkToken, getFriends);
    return router;
  }
  