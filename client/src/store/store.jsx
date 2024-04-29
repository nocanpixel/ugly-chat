import { create } from "zustand";
import chatApi from "../api/chats";
import usersApi from "../api/users";

const initialState = false;
export const useStore = create((set) => ({
  isAuthenticated: initialState,
  setAuthentication: (value) => set({ isAuthenticated: value }),
}));

export const usePopoverStatus = create((set) => ({
  isPopoverOpen: false,
  setPopover: (value) => set({ isPopoverOpen: value }),
}));

export const useChatList = create((set) => ({
  data: [],
  fetchData: async () => {
    try {
      const response = await chatApi.myChats();
      set(response);
    } catch (error) {
      console.error(error);
    }
  },
  updateUserStatus: (userId, newStatus) => {
    set((state) => ({
      data: state.data?.map((user) =>
        user.user_id === userId ? { ...user, is_online: newStatus } : user
      ),
    }));
  },
  
  updateUserOffset: (response) => set({data:response}),

  updateOnSeen: (chatIds) => {
    set((state)=> ({
      data: state.data?.map(message => {
        if(chatIds.includes(message.id)){
          return {...message, seen:true }
        }else{
          return message;
        }
      })
    }))
  }
}));

export const useUserInChat = create((set) => ({
  data: null,
  fetchData: async (chatId) => {
    try {
      const response = await chatApi.userInChat(chatId);
      set(response);
    } catch (_) {
      return { status: "ERROR", error: _ };
    }
  },
  updateUserStatus: (val) => {
    set((state) => ({
      data: val === null ? null : { ...state.data, is_online: val },
    }));
  },
}));

export const useFriendRequestStatus = create((set)=>({
  data:false,
  fetchData: async () => {
    try {
      const response = await usersApi.getFriendRequest();
      set({data:!response.data.length<=0?true:false});
    } catch (_) {
      return {status:"ERROR",error:_}
    }
  },
  updateStatus: (value) => set({data:value})
}))