import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useCookies } from 'react-cookie';

const defaultOnRedirecting = () => <Loader/>

const COOKIE_NAME = import.meta.env.VITE_LOGGED_COOKIE;

export const withAuthentication = (Component) => {
    return () => {
        const navigate = useNavigate();
        const { user, isLoading, error } = useAuth();
        const [cookies] = useCookies([COOKIE_NAME]) 

        useEffect(()=>{
            if(cookies[COOKIE_NAME]===0){
                navigate('/login')
            }
            if ((cookies[COOKIE_NAME]===1 && !error) || isLoading) return;
            navigate('/login')
        },[user,error,isLoading,cookies[COOKIE_NAME]])

        if(error)return;
        if((cookies[COOKIE_NAME]===1)&&user?.res)return <Component user={user} />;
        return defaultOnRedirecting();
    }
}
