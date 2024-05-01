import { createContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useChatList, useUserInChat } from "../store/store";



export const socket = new io(import.meta.env.VITE_SOCKET_SERVER, {
  autoConnect:false,
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  randomizationFactor: 0.5,
  path:'/socket.io/'
});

export const SocketContext = createContext(socket);

export const SocketProvider = (props) => {
  const updateData = useChatList((state)=> state.updateUserStatus);
  const updateUserStatus = useUserInChat((state)=> state.updateUserStatus);

  useEffect(() => {

    socket.connect();
    socket.on('user:disconnected', (userId)=>{
      console.log('Emmiting disconnection')
      updateData(userId, false);
      updateUserStatus(false);
    })

    socket.on('user:connected',(userId)=>{
      console.log(`Your friend ${userId} have been connected`)
      updateData(userId, true);
      updateUserStatus(true);
    })

    socket.on('user:status', (data) => {
      console.log(data)
    })

    return () => {
      socket.off('user:disconnected');
      socket.off('user:connected');
      socket.off('user:status');
      socket.disconnect();
    };
  }, [updateData]);


  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
