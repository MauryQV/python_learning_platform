// File: src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/axiosInstance.js";
import {
  loginUser as apiLoginUser,
  loginWithGoogle as apiLoginWithGoogle,
} from "../api/auth";
import { AUTH_STORAGE_KEYS } from "./auth.constants";
import { decodeJwt } from "../utils/decodeJwt"; // adjust path if needed

const AuthContext = createContext(null);

// 🔧 Normaliza el rol desde `role` o `roles[]`, a minúsculas
const normalizeRole = (u) =>
  (u?.role || (Array.isArray(u?.roles) ? u.roles[0] : "") || "")
    .toString()
    .toLowerCase();

// 🧩 Deriva un usuario mínimo a partir del JWT
const userFromJwt = (token) => {
  try {
    const p = decodeJwt(token) || {};
    const role = normalizeRole(p);
    const email = p?.email || p?.sub || "";
    const name = p?.name || "";
    const id = p?.id || p?.uid || p?.user_id || null;
    // Permite extender con más claims si vienen en tu backend
    return { id, email, name, role };
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem(AUTH_STORAGE_KEYS.token)
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEYS.user);
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return { ...parsed, role: normalizeRole(parsed) };
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      if (!user) {
        const minimal = userFromJwt(token);
        if (minimal) {
          setUser(minimal);
          localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(minimal));
        }
      }
    } else {
      delete api.defaults.headers.common.Authorization;
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) logout();
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiLoginUser(email, password);
      if (res?.token) {
        const { token: newToken, user: userData } = res;

        const role = normalizeRole(userData || userFromJwt(newToken) || {});
        const mergedUser =
          userData ? { ...userData, role } : { ...(userFromJwt(newToken) || {}), role };

        setToken(newToken);
        setUser(mergedUser);

        localStorage.setItem(AUTH_STORAGE_KEYS.token, newToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(mergedUser));

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        return { success: true, user: mergedUser, role: mergedUser.role };
      }
      return { success: false, error: res?.message || "No se pudo iniciar sesión" };
    } catch (error) {
      return { success: false, error: error?.message || "Error al iniciar sesión" };
    }
  };

  const loginWithGoogle = async (idToken) => {
    try {
      const res = await apiLoginWithGoogle(idToken);
      if (res?.success && res?.token) {
        const role = normalizeRole(res.user || userFromJwt(res.token) || {});
        const mergedUser =
          res.user ? { ...res.user, role } : { ...(userFromJwt(res.token) || {}), role };

        setToken(res.token);
        setUser(mergedUser);

        localStorage.setItem(AUTH_STORAGE_KEYS.token, res.token);
        localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(mergedUser));

        api.defaults.headers.common.Authorization = `Bearer ${res.token}`;
        return { success: true, user: mergedUser, role: mergedUser.role };
      }
      return {
        success: false,
        error: res?.message || "No se pudo iniciar sesión con Google",
      };
    } catch (error) {
      return { success: false, error: error?.message || "Error con Google Login" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEYS.token);
    localStorage.removeItem(AUTH_STORAGE_KEYS.user);
    delete api.defaults.headers.common.Authorization;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token, 
      setUser,
      setToken,
      login,
      loginWithGoogle,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
