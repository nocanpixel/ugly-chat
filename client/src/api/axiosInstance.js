import axios from 'axios';
import { Cookie } from '../utils/tools';

const cookie = new Cookie();

const COOKIES_STATE = {
    API: import.meta.env.VITE_API_URL,
}
const axiosInstance = axios.create({
    baseURL: COOKIES_STATE.API,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        cookie.authCookies(0)
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.request.clear();

export default axiosInstance;