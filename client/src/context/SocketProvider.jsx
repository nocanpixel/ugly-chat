import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useChatList } from "../store/store";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = new io(URL, {
  autoConnect: false,
  withCredentials: true,
});

export const SocketContext = createContext(socket);

export const SocketProvider = (props) => {
  const updateData = useChatList((state)=> state.updateUseStatus);

  useEffect(() => {
    // Function to handle connection and reconnection attempts
    socket.connect();
    socket.on('user:disconnected', (userId)=>{
      console.log('Emmiting disconnection')
      updateData(userId, false);
    })

    socket.on('user:connected',(userId)=>{
      console.log('=>')
      updateData(userId, true);
    })

    return () => {
      socket.off('user:disconnected');
      socket.off('user:connected');
    };
  }, [updateData]);


  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
