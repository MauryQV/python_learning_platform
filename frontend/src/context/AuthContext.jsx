import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configurar axios para incluir el token en todas las peticiones
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      // Opcional: verificar si el token es válido
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Verificar token al cargar la app
  const verifyToken = async (tkn) => {
    try {
      const response = await axios.get(
        "http://localhost:2999/api/auth/verify",
        {
          headers: { Authorization: `Bearer ${tkn}` },
        }
      );

      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Token inválido:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:2999/api/auth/login",
        { email, password }
      );

      if (response.data.token) {
        const { token: newToken, user: userData } = response.data;

        setToken(newToken);
        setUser(userData);
        localStorage.setItem("token", newToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        return { success: true, user: userData };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Interceptor para manejar errores 401 (token expirado)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
