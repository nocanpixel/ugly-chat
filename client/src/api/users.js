import axiosInstance from './axiosInstance';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const COOKIE_NAME = import.meta.env.VITE_LOGGED_COOKIE;

const usersApi = {
    getAll: () => {
        return axiosInstance.get('/user/get-all', { withCredentials: true });
    },
    logout: () => {
        return Promise.all([
            axiosInstance.post('/user/logout', {}, { withCredentials: true }),
            cookies.set(COOKIE_NAME, 0, { secure: true })
        ]);
    }
}

export default usersApi;