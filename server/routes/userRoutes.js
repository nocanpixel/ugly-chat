import { Router } from "express";
const router = Router();
import { login, register, getAll, logout, getUserAuthentication } from "../controllers/userController.js";
import {checkToken} from "../middlewares/checkToken.js";

router.post("/login", login);
router.post("/register", register);
router.get("/getAll", checkToken, getAll);
router.post("/logout", logout)
router.get("/getAuth", checkToken, getUserAuthentication)

export default router;