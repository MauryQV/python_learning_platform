import { registerUserService, loginUserService } from "../services/auth.service.js";

export const registerUserController = async (req, res) => {
  try {
    const { firstName , lastName, email, password, confirmPassword } = req.body;
    const user = await registerUserService({ firstName, lastName, email, password, confirmPassword });
    res.status(201).json({
       message: "User created successfully",
       user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUserService({ email, password });
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
