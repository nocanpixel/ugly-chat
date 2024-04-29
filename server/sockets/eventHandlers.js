import chalk from "chalk";
import { userRoom, userState } from "../utils.js";
import { emitMessage } from "../events/emitMessage.js";
import { searchUser } from "../events/searchUser.js";
import { logger } from "../config/db-config.js";
import { emitSeen } from "../events/emitSeen.js";

function initEventHandlers({ io, sqldb }) {

  io.use(async (socket, next) => {
    socket.userId = socket.request.user.id;
    socket.join(userRoom(socket.userId));

    next();
  });

  io.on("connection", async (socket) => {

    socket.on("message:send", emitMessage({ socket, sqldb }));
    socket.on("message:status", emitSeen({ socket, sqldb }))
    socket.on("user:search", searchUser({ socket, sqldb }));
    


    socket.on("disconnect", async () => {
      logger.info(chalk.bgRedBright(` -- DISCONNECTED -- ${socket.id}`))
      setTimeout(async () => {
        const sockets = await io.in(userRoom(socket.userId)).fetchSockets();
        const isPresent = sockets.length > 0;
        if (!isPresent) {
          await sqldb.setUserIsDisconnected(socket.userId);
          const response = await sqldb.getFriends(socket.userId);
          response.forEach((friend) => {
            io.to(userRoom(friend)).emit("user:disconnected", socket.userId);
          });
        }
      }, 10000);
    });

    //HANDLE CONNECTION
    logger.info(chalk.bgGreenBright(` -- CONNECTED -- ${socket.userId}`))
    await sqldb.setUserIsConnected(socket.userId);
    const response = await sqldb.getFriends(socket.userId);
    response.forEach((friend) => {
      io.to(userRoom(friend)).emit("user:connected", socket.userId);
    });
  });
}

export default initEventHandlers;
