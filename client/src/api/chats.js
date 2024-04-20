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
    }
}

export default chatApi;