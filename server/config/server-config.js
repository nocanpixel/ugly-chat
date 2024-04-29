import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./db-config.js";
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
import Subscribers from "../models/Subscribers.js";
import Messages from "../models/Messages.js";
import passport from "passport";
import { Strategy as JsonStrategy } from "passport-json";
import bcrypt from "bcrypt";

const _1_HOUR = 60 * 60 * 1000;

const SequelizeStore = storeBuilder(session.Store);

async function createApp(httpServer, config) {
  const app = createExpressApp();
  httpServer.on("request", app);
  app.use(cors(config.cors));

  const sqldb = new DB(
    Users,
    Friendship,
    UserFriendship,
    Subscribers,
    Messages
  );

  const io = new Server(httpServer, {
    cors: config.cors,
  });

  setupSession({ app, io });
  initPassport({ app, io, sqldb });
  initRoutes({ app, io, sqldb });
  initEventHandlers({ io, sqldb });
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

function initPassport({ app, io, sqldb }) {
  passport.use(
    new JsonStrategy(
      {
        usernameProp: "email",
      },
      async (email, password, done) => {
        const user = await sqldb.findUserByEmail(email);

        if (!user) {
          return done(new Error("invalid credentials"));
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return done(new Error("invalid credentials"));
        }

        done(null, {
          id: user.id,
          username: user.username,
          tag: user.tag,
          is_online: user.is_online
        });
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, { 
      id: user.id, 
      username: user.username,
      tag: user.tag,
      is_online: user.is_online,
    });
  });

  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  io.engine.use(passport.initialize());
  io.engine.use(passport.session());

  io.engine.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.writeHead(401);
      res.end();
    }
  });

}

function initRoutes({ app, io, sqldb }) {
  app.use("/api", api({ io, sqldb }));
  app.use(handle404);

  return app;
}

export default createApp;
