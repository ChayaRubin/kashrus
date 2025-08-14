import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api'; // Assuming api is a utility for making API requests

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    return token && email ? { token, email } : null;
  });

  function login(email) {
    return api('/api/login', { method: 'POST', body: JSON.stringify({ email }) })
      .then((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', res.user.email);
        setUser({ token: res.token, email: res.user.email });
      });
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
  }

  const value = { user, login, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }
