import React, { createContext, useState,useContext, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/auth/me", { withCredentials: true })
      .then(res => setUser(res.data))
      .finally(() => setLoading(false));
  }, []);
  
  const login = async () => {
    try {
      const res = await axios.get("http://localhost:3000/auth/me", { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true })
      .then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => useContext(AuthContext);