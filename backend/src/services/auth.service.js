import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js";
import Joi from "joi";

const SECRET = process.env.JWT_SECRET;
// esquema de validacion para el registro
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Esquema de validación para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerUserService = async ({ firstName, lastName, email, password }) => {
   // Validar datos
  const { error } = registerSchema.validate({ firstName, lastName, email, password });
  if (error) throw new Error(error.details[0].message);

  //console.log(firstName, lastName, email, password);
  const existing = await prisma.user.findUnique({ where: { email} });
  if (existing) {
    throw new Error("El correo ya está registrado");
  }
  // hash
  const passwordHash = await bcrypt.hash(password, 10);
  // crear
  const user = await prisma.user.create({
    data: { firstName, lastName, email, passwordHash },
  });
  return user;
};


export const loginUserService = async ({ email, password }) => {
  //validar datos 
  const { error } = loginSchema.validate({ email, password });
  if (error) throw new Error(error.details[0].message);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("The user does not exist");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("The password is not correct");

  // generar token
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "1h",
  });

  return { token, user };
};
