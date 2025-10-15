import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axiosInstance.js";
import {
  loginUser as apiLoginUser,
  loginWithGoogle as apiLoginWithGoogle,
} from "../api/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await apiLoginUser(email, password);
      if (res?.token) {
        const { token: newToken, user: userData } = res;

        setToken(newToken);
        setUser(userData);

        localStorage.setItem("token", newToken);
        if (userData) localStorage.setItem("user", JSON.stringify(userData));

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        return { success: true, user: userData };
      }
      return { success: false, error: res?.message || "No se pudo iniciar sesión" };
    } catch (error) {
      return {
        success: false,
        error: error?.message || "Error al iniciar sesión",
      };
    }
  };

  const loginWithGoogle = async (idToken) => {
    try {
      const res = await apiLoginWithGoogle(idToken);
      if (res?.success && res?.token) {
        setToken(res.token);
        if (res.user) setUser(res.user);

        localStorage.setItem("token", res.token);
        if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

        api.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
        return { success: true, user: res.user };
      }
      return { success: false, error: res?.message || "No se pudo iniciar sesión con Google" };
    } catch (error) {
      return {
        success: false,
        error: error?.message || "Error con Google Login",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        setUser,
        setToken,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
