import axios from "axios";

// URL base del backend (podés ponerla en .env)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2999/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


