import React, { useCallback, useEffect, useState } from 'react'
import authApi from '../api/auth';
import {useCookies} from 'react-cookie';


const COOKIE_NAME = import.meta.env.VITE_LOGGED_COOKIE;

export const useAuth = () => {
    const [state, setState] = useState({user:null,isLoading:true})
    const [, setCookies] = useCookies([COOKIE_NAME]);


    const checkSession = useCallback(async () => {
        try {
          const user = await authApi.getAuth();
          setState((previous) => ({ ...previous, user:user.data }));
          setCookies(COOKIE_NAME,1,{secure:true});
        } catch (error) {
          setState((previous) => ({ ...previous, error: error }));
          setCookies(COOKIE_NAME,0,{secure:true});
        }
      }, []);

      useEffect(()=>{
          if(state.user)return;
          (async ()=>{
            await checkSession();
            setState((previous) => ({ ...previous, isLoading: false }));
        })()
    },[state.user])

    const { user, error, isLoading  } = state;


    return { user, error, isLoading, checkSession }
}
