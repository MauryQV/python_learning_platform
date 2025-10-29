import prisma from "../../config/prismaClient.js";

export const getRoles = async () => {
  const roles = await prisma.role.findMany();
  return roles;
};
