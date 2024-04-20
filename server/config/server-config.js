import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./db-config.js";
import chalk from "chalk";
import session from "express-session";
import storeBuilder from "connect-session-sequelize";
import { api } from "../routes/api.js";
import { handle404 } from "../middlewares/404.js";
import { Server } from "socket.io";
import helmet from "helmet";
import initEventHandlers from "../sockets/eventHandlers.js";
import { DB } from "../controllers/queries.js";
import Users from "../models/Users.js";
import Friendship from "../models/Friendship.js";
import UserFriendship from "../models/UserFriendship.js";

const _1_HOUR = 1000 * 60 * 60;

const SequelizeStore = storeBuilder(session.Store);

async function createApp(httpServer, config) {
  const app = createExpressApp();
  httpServer.on("request", app);
  app.use(cors(config.cors));

  const sqldb = new DB(Users,Friendship,UserFriendship);
  
  const io = new Server(httpServer, {
    cors: config.cors,
  });
  
  setupSession({ app, io });
  initRoutes({ app, io });
  initEventHandlers({io,sqldb});

}

function setupSession({ app, io }) {
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET_KEY,
    name: "sid",
    credentials: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: _1_HOUR,
      sameSite: "lax",
    },
    store: new SequelizeStore({
      db,
      tableName: "sessions",
    }),
  });

  app.use(sessionMiddleware);
  io.engine.use(sessionMiddleware);
}

function createExpressApp() {
  const app = express();
  app.use(helmet());
  app.use(cookieParser());
  app.use(json());

  return app;
}

function initRoutes({ app, io }) {
  app.use("/api", api(io));
  app.use(handle404);

  return app;
}

export default createApp;
