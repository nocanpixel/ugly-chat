import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const COOKIES_STATE = {
    API: import.meta.env.VITE_API_URL,
    COOKIE_NAME: import.meta.env.VITE_LOGGED_COOKIE 
}
const axiosInstance = axios.create({
    baseURL: COOKIES_STATE.API,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error)
        if(error.response?.status===401){
            console.warn('Error : Token expired!')
            cookies.set(COOKIES_STATE.COOKIE_NAME,0,{secure:true});
        }
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.request.clear();

export default axiosInstance;