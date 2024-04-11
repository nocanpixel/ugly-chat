import express from "express";
const app = express();
import userRoutes from "./userRoutes.js";
import chatRoutes from "./chatRoutes.js";

app.use("/user", userRoutes);
app.use("/c", chatRoutes);

export default app;