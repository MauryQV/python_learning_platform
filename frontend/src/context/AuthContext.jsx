// File: src/context/AuthContext.jsx 
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/axiosInstance.js";
import {
  loginUser as apiLoginUser,
  loginWithGoogle as apiLoginWithGoogle,
} from "../api/auth";
import { AUTH_STORAGE_KEYS } from "./auth.constants";
import { decodeJwt } from "../utils/decodeJwt";

// =======================================================
// 🔥 CREA EL CONTEXTO (ESTO FALTABA SI TE DIO EL ERROR)
// =======================================================
const AuthContext = createContext(null);

// =======================================================
// 🛠 NORMALIZACIÓN ROBUSTA DEL ROL
// =======================================================
const normalizeRole = (u) => {
  if (!u) return "";

  if (u.role) return u.role.toString().toLowerCase();
  if (Array.isArray(u.roles) && u.roles.length > 0)
    return u.roles[0].toString().toLowerCase();
  if (u?.payload?.role) return u.payload.role.toString().toLowerCase();

  return "";
};

// =======================================================
// 🛠 OBTENER USER DESDE JWT
// =======================================================
const userFromJwt = (token) => {
  try {
    const p = decodeJwt(token) || {};
    return {
      id: p.userId || p.id || null,
      email: p.email || "",
      name: p.name || "",
      role: p.role ? p.role.toLowerCase() : "",
    };
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
    const saved = localStorage.getItem(AUTH_STORAGE_KEYS.user);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return { ...parsed, role: normalizeRole(parsed) };
  });

  const [loading, setLoading] = useState(true);

  // =======================================================
  // 🔁 RESTAURAR SESIÓN DESDE TOKEN
  // =======================================================
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

  // =======================================================
  // 🛑 AUTO LOGOUT EN 401
  // =======================================================
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error?.response?.status === 401) logout();
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  // =======================================================
  // 🔑 LOGIN NORMAL
  // =======================================================
  const login = async (email, password) => {
    try {
      const res = await apiLoginUser(email, password);

      if (res?.token) {
        const newToken = res.token;
        const backendUser = res.user;

        const mergedUser = backendUser || userFromJwt(newToken) || {};
        mergedUser.role = normalizeRole(mergedUser);

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

  // =======================================================
  // 🔑 LOGIN GOOGLE
  // =======================================================
  const loginWithGoogle = async (idToken) => {
    try {
      const res = await apiLoginWithGoogle(idToken);

      if (res?.success && res?.token) {
        const backendUser = res.user || userFromJwt(res.token) || {};
        backendUser.role = normalizeRole(backendUser);

        setToken(res.token);
        setUser(backendUser);

        localStorage.setItem(AUTH_STORAGE_KEYS.token, res.token);
        localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(backendUser));

        api.defaults.headers.common.Authorization = `Bearer ${res.token}`;

        return { success: true, user: backendUser, role: backendUser.role };
      }

      return {
        success: false,
        error: res?.message || "No se pudo iniciar sesión con Google",
      };
    } catch (error) {
      return { success: false, error: error?.message || "Error con Google Login" };
    }
  };

  // =======================================================
  // 🚪 LOGOUT
  // =======================================================
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
