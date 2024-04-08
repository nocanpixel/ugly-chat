import {create} from 'zustand';

const initialState = false;
export const useUserStore = create((set)=>({
    isAuthenticated: initialState,
    setAuthentication: (value) => set({isAuthenticated:value})
}))