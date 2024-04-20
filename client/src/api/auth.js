import axiosInstance from './axiosInstance';

const authApi = {
    register: (formData) => {
        return axiosInstance.post('/user/register',formData, {withCredentials:true})
    },
    login: (formData) => {
        return axiosInstance.post('/user/login',formData, {withCredentials:true})
    },
    getAuth: () => {
        return axiosInstance.get('/user/get-auth',{withCredentials:true});
    },
}

export default authApi;