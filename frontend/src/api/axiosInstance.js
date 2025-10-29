import axios from "axios";

// 🔹 1. Base URL del backend
// Usa variable de entorno o deja por defecto localhost:2999
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:2999";

// 🔹 2. Crea la instancia global de Axios
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Cambia a true si usas cookies/sesión
});

// 🔹 3. Interceptor de REQUEST → añade token en cada request automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // o AUTH_STORAGE_KEYS.token si usas constante
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 4. Interceptor de RESPONSE opcional → manejar 401 globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("⚠️ Sesión expirada o token inválido, cerrando sesión...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Redirige automáticamente
    }
    return Promise.reject(error);
  }
);

