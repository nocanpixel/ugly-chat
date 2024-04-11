import React, { useEffect } from 'react'
import SignUpForm from '../../components/auth/SignUpForm'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const COOKIE_NAME = import.meta.env.VITE_LOGGED_COOKIE;
export const Signup = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies([COOKIE_NAME]);


    useEffect(() => {
        if (cookies[COOKIE_NAME] === 1) {
            navigate('/')
        }
    }, [cookies]);

    return (
        <SignUpForm />
    )
}
