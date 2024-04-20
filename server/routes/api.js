import express from "express";
const router = express.Router();
import { userRoutes } from "./userRoutes.js";
import { chatRoutes } from "./chatRoutes.js";

// router.use("/user", userRoutes);
// router.use("/c", chatRoutes());
// export default router;

export const api = (io) => {
  router.use("/user", userRoutes(io));
  router.use("/c", chatRoutes());
  return router;
};
