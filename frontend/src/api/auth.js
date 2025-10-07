import axios from "axios";

const API_URL = "http://localhost:2999/api/auth"; 

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } } 
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Error al iniciar sesión" };
  }
};

export const registerUser = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      { firstName, lastName, email, password },
      { headers: { "Content-Type": "application/json" } } 
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Error al registrar usuario" };
  }
};

