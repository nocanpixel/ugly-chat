import chalk from "chalk";
import { userRoom } from "../utils.js";

function initEventHandlers({ io, sqldb }) {
  io.use((socket, next) => {
    if (socket.request.session.user) {
      socket.userId = socket.request.session.user.id;
    } else {
      console.log("No logeado");
    }

    socket.join(userRoom(socket.userId)); 

    next();
  });

  io.on("connection", async (socket) => {
    console.log(`User ${socket.userId} joined room ${userRoom(socket.userId)}`);
    // ... your event handling logic here
    if (socket.userId) {
      console.log(chalk.bgGreenBright(` -- CONNECTED -- ${socket.userId}`));
      await sqldb.setUserIsConnected(socket.userId);
      const response = await sqldb.getFriends(socket.userId);
      console.log(response);
      response.forEach((friend) => {
        io.to(userRoom(friend)).emit("user:connected", socket.userId);
      });
    }

    socket.on("disconnect", async () => {
      console.log(chalk.bgRedBright(` -- DISCONNECTED -- ${socket.userId}`));
      setTimeout(async()=>{
        const sockets = await io.in(userRoom(socket.userId)).fetchSockets();
        const isPresent = sockets.length > 0;
        if (socket.userId && !isPresent) {
          console.log("working");
          await sqldb.setUserIsDisconnected(socket.userId);
          const response = await sqldb.getFriends(socket.userId);
          response.forEach((friend) => {
            io.to(userRoom(friend)).emit("user:disconnected", socket.userId);
          });
        }
      },10000)
    });
  });
}

export default initEventHandlers;
