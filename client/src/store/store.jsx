import { create } from "zustand";
import chatApi from "../api/chats";

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
  data: null,
  fetchData: async () => {
    try {
      const response = await chatApi.myChats();
      set(response);
    } catch (error) {
      console.error(error);
    }
  },
  updateUseStatus: (userId, newStatus) => {
    set((state) => ({
      data: state.data?.map(user =>   user.user_id === userId ? { ...user, is_online: newStatus } : user)
    }));
  },
}));