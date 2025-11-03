// src/repositories/userPermission.repository.js
import prisma from "../../config/prismaClient.js";

export const getUserPermissions = async (userId) => {
  return prisma.userPermission.findMany({
    where: { userId },
    select: { permission: true }
  });
};

export const addPermission = async (userId, permission) => {
  return prisma.userPermission.upsert({
    where: { userId_permission: { userId, permission } },
    update: {},
    create: { userId, permission }
  });
};

export const removePermission = async (userId, permission) => {
  return prisma.userPermission.delete({
    where: { userId_permission: { userId, permission } }
  });
};

export const hasRole = async (userId, roleName) => {
  const userRole = await prisma.userRole.findFirst({
    where: {
      userId,
      role: { name: roleName }
    }
  });
  return !!userRole;
};

