import React, { useCallback, useEffect, useState } from "react";
import authApi from "../api/auth";
import { Cookie } from "../utils/tools";

const COOKIE_NAME = import.meta.env.VITE_LOGGED_COOKIE;
const cookie = new Cookie();

export const useAuth = () => {
  const [state, setState] = useState({
    user: null,
    isLoading: true,
    is_online: false,
  });
  const checkSession = useCallback(async () => {
    try {
      const user = await authApi.getAuth();
      setState((previous) => ({ ...previous, user: user.data, isLoading:false }));
    } catch (error) {
      setState((previous) => ({ ...previous, error: error, isLoading:false }));
    }
  }, []);

  useEffect(() => {
    if (state.user) return;
    (async () => {
      await checkSession();
    })();
  }, [state.user]);

  let { user, error, isLoading } = state;

  return { user, error, isLoading, checkSession };
};
