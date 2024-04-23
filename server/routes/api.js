import express from "express";
const router = express.Router();
import { userRoutes } from "./userRoutes.js";
import { chatRoutes } from "./chatRoutes.js";

// router.use("/user", userRoutes);
// router.use("/c", chatRoutes());
// export default router;

export const api = ({io, sqldb}) => {
  router.use("/user", userRoutes({io,sqldb}));
  router.use("/c", chatRoutes({io}));
  return router;
};
