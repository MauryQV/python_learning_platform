import { api } from "../api/axiosInstance.js"


export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Error"  };
  }
};

export const registerUser = async (firstName, lastName, email, password, confirmPassword) => {
  try {
    const response = await api.post(
      "/auth/register",
      { firstName, lastName, email, password, confirmPassword },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Error al registrar usuario" };
  }
};