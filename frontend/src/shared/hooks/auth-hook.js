import { useState, useEffect, useCallback } from "react";

let logoutTimer;
export const useAuth = () => {
  const [expirationDate, setExpirationDate] = useState();
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && expirationDate) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, expirationDate]);

  useEffect(() => {
    const Data = JSON.parse(localStorage.getItem("userData"));
    if (Data && Data.token && new Date(Data.expiration) > new Date()) {
      login(Data.userId, Data.token, new Date(Data.expiration));
    }
  }, [login]);

  return { token, login, logout, userId };
};
