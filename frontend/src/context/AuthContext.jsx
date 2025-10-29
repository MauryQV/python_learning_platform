import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axiosInstance.js";
import { loginUser as apiLoginUser, loginWithGoogle as apiLoginWithGoogle } from "../api/auth";
import { AUTH_STORAGE_KEYS } from "./auth.constants";

const AuthContext = createContext(null);

// 🔧 Normaliza el rol desde `role` o `roles[]`
const normalizeRole = (u) =>
  (u?.role || (Array.isArray(u?.roles) ? u.roles[0] : "") || "")
    .toString()
    .toLowerCase();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  // ⬇️ Al leer del storage ya dejamos el role normalizado
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEYS.user);
    if (!savedUser) return null;
    const parsed = JSON.parse(savedUser);
    const role = normalizeRole(parsed);
    return { ...parsed, role };
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem(AUTH_STORAGE_KEYS.token)
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await apiLoginUser(email, password);
      if (res?.token) {
        const { token: newToken, user: userData } = res;

        const role = normalizeRole(userData || {});
        const mergedUser = userData ? { ...userData, role } : null;

        setToken(newToken);
        setUser(mergedUser);

        localStorage.setItem(AUTH_STORAGE_KEYS.token, newToken);
        if (mergedUser) {
          localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(mergedUser));
        }

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        return { success: true, user: mergedUser };
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
        const role = normalizeRole(res.user || {});
        const mergedUser = res.user ? { ...res.user, role } : null;

        setToken(res.token);
        setUser(mergedUser);

        localStorage.setItem(AUTH_STORAGE_KEYS.token, res.token);
        if (mergedUser) {
          localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(mergedUser));
        }

        api.defaults.headers.common.Authorization = `Bearer ${res.token}`;
        return { success: true, user: mergedUser };
      }
      return { success: false, error: res?.message || "No se pudo iniciar sesión con Google" };
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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user, // si prefieres: !!token
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
