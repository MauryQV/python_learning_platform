import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js";

const SECRET = process.env.JWT_SECRET;

export const registerUserService = async ({ firstName, lastName, email, password }) => {
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
