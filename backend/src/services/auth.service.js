import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js"; 

const SECRET = process.env.JWT_SECRET; 

export const registerUser = async ({ nombre, apellido, email, password }) => {
  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    throw new Error("El correo ya está registrado");
  }

  // hash
  const passwordHash = await bcrypt.hash(password, 10);

  // crear
  const user = await prisma.usuario.create({
    data: { nombre, apellido, email, passwordHash },
  });

  return user;
};


export const loginUser = async ({ email, password }) => {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error("no se encontro al usuario");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("La contraseña es incorrecta");

  // generar token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};