import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const _COOKIE_AUTH = import.meta.env.VITE_LOGGED_COOKIE;
const _COOKIE_CLIENT_ERRORS = import.meta.env.VITE_CLIENT_ERRORS;


export class Cookie {
    authCookies(val){
        return cookies.set(_COOKIE_AUTH,val,{secure:false,path:'/',maxAge:60*60});
    }

    setErrorCookie(val){
        return cookies.set(_COOKIE_CLIENT_ERRORS, val, {secure:false, path:'/', maxAge:60*60})
    }
    
    delErrorCookie(){
        return cookies.remove(_COOKIE_CLIENT_ERRORS,{secure:false, path:'/'});
    }
}