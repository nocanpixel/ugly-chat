import express from "express";
const router = express.Router();
import {
  register,
  logout,
  getUserAuthentication,
  sendFriendRequest,
  getFriendRequests,
  updateFriendRequest,
  getFriends,
  onSuccess,
  onError,
} from "../controllers/userController.js";
import { checkToken } from "../middlewares/checkToken.js";
import { validateCredentials } from "../middlewares/registerValidator.js";
import passport from "passport";


  export const userRoutes =({io,sqldb})=>{
    router.post('/login', passport.authenticate("json"), onSuccess, onError);
    router.post("/register", validateCredentials, register);
    router.post("/logout", logout({io,sqldb}));
    router.get("/get-auth", checkToken, getUserAuthentication);
    router.post("/friend-request", checkToken, sendFriendRequest);
    router.get("/get-friend-request", checkToken, getFriendRequests);
    router.put("/update-friend-request", checkToken, updateFriendRequest);
    router.get("/get-friends", checkToken, getFriends);
    return router;
  }
  