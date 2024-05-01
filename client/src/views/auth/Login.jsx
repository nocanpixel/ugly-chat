import React, { useEffect } from 'react'
import LoginForm from '../../components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
 
const COOKIE_NAME = import.meta.env.VITE_LOGGED_COOKIE;
const _COOKIE_CLIENT_ERRORS = import.meta.env.VITE_CLIENT_ERRORS;
export const Login = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies([COOKIE_NAME]);
  
  useEffect(()=>{
    if(cookies[COOKIE_NAME]===1){
      navigate('/')
    }
  },[cookies])

  return (
    <LoginForm/>
  )
}
