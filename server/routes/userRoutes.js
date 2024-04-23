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


  export const userRoutes =({io,sqldb})=>{
    router.post("/login", login({io,sqldb}));
    router.post("/register", validateCredentials, register);
    router.post("/logout", logout({io,sqldb}));
    router.get("/get-auth", checkToken({io}), getUserAuthentication);
    router.post("/friend-request", checkToken({io}), sendFriendRequest);
    router.get("/get-friend-request", checkToken({io}), getFriendRequests);
    router.put("/update-friend-request", checkToken({io}), updateFriendRequest);
    router.get("/get-friends", checkToken({io}), getFriends);
    return router;
  }
  