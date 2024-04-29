import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useCookies } from "react-cookie";
import { Cookie } from "../utils/tools";
import { NotFound404 } from "../components/404";

const defaultOnRedirecting = () => <Loader />;

const onError = () => <NotFound404 />;

const COOKIE_NAME = import.meta.env.VITE_LOGGED_COOKIE;
const mycookie = new Cookie();

export const withAuthentication = (Component) => {
  return () => {
    const navigate = useNavigate();
    let { user, isLoading, error } = useAuth();
    const [cookies, setCookie] = useCookies([COOKIE_NAME]);

    useEffect(() => {
      if ((cookies[COOKIE_NAME] === 1 && !error) || isLoading) return;
      navigate('/login')

      if (!cookies[COOKIE_NAME]) {
        navigate('/login')
      }
    }, [user, error, isLoading, cookies[COOKIE_NAME]]);

   
    if (error) return onError();
    if (cookies[COOKIE_NAME] === 1 && user?.res)
      return <Component user={user} />;
    return defaultOnRedirecting();
  };
};
