import axiosInstance from './axiosInstance';

const chatApi = {
    myChats: () => {
        return axiosInstance.get('/c/chat-list', {withCredentials:true});
    },
    createChat: (formData) => {
        return axiosInstance.post('/c/create', formData, {withCredentials:true});
    },
    getMessages: (url) => {
        return axiosInstance.get(`/c/${url}`, {withCredentials:true})
    },
    sendMessage: (content) => {
        return axiosInstance.post(`/c/send-message`, content, {withCredentials:true})
    },
    checkChat: (chatId) => {
        return axiosInstance.post(`/c/check-chats`, chatId, {withCredentials:true});
    },
    userInChat: (chatId) => {
        return axiosInstance.get(`/c/user-in-chat/${chatId}`, {withCredentials:true});
    }
}

export default chatApi;