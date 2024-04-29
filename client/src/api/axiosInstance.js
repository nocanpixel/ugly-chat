import axios from "axios";
import { Cookie } from "../utils/tools";

const cookie = new Cookie();

const COOKIES_STATE = {
  API: import.meta.env.VITE_API_URL,
  NAME: import.meta.env.VITE_LOGGED_COOKIE,
  ERROR: import.meta.env.VITE_CLIENT_ERRORS,
};
const axiosInstance = axios.create({
  baseURL: COOKIES_STATE.API,
  timeout: 10_000,

  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED"){
        return Promise.reject(error);
    }
    cookie.authCookies(0);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.clear();

export default axiosInstance;
