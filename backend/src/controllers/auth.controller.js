import { registerUser, loginUser } from "../services/auth.service.js"

export const registerController = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const user = await registerUser({ nombre, apellido, email, password });
    res.status(201).json({ message: "Usuario registrado", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser({ email, password });
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
