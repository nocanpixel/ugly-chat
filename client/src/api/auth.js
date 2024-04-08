import axiosInstance from './axiosInstance';

const authApi = {
    login: (formData) => {
        return axiosInstance.post('/user/login',formData,{withCredentials:true})
    },
    getAuth: () => {
        return axiosInstance.get('/user/getAuth',{withCredentials:true})
    }
}

export default authApi;