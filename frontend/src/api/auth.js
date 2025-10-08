import api from "../api/axiosInstance.js"

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Error"  };
  }
};

export const registerUser = async (firstName, lastName, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
      //hay que añadir confirmPassworf
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Error" };
  }
};