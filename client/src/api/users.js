import axiosInstance from './axiosInstance';

const usersApi = {
    getAll: () => {
        return axiosInstance.get('/user/get-all', { withCredentials: true });
    },
    logout: () => {
        return Promise.all([
            axiosInstance.post('/user/logout', {}, { withCredentials: true }),
        ]);
    },
    putFriendRequest: (formData) => {
        return axiosInstance.put('/user/update-friend-request', formData, { withCredentials: true })
    },
    myFriends: () => {
        return axiosInstance.get('/user/get-friends', { withCredentials: true });
    },
    getFriendRequest: () => {
        return axiosInstance.get('/user/get-friend-request', { withCredentials: true });
    },
}

export default usersApi;