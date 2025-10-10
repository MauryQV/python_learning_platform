// src/repositories/admin/admin.repository.js
import prisma from "../../../config/prismaClient.js";

/**
 * Actualiza o asigna un rol a un usuario y devuelve el usuario con el rol.
 * @param {number} userId 
 * @param {string} roleName 
 */
export const updateUserRoleRepository = async (userId, roleName) => {
  // Verificar que el rol existe
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`El rol '${roleName}' no existe.`);
  }

  // Verificar si el usuario ya tiene un rol asignado
  const existingUserRole = await prisma.userRole.findFirst({
    where: { userId },
  });

  if (existingUserRole) {
    // Actualizar el rol existente
    await prisma.userRole.update({
      where: {
        userId_roleId: {
          userId: userId,
          roleId: existingUserRole.roleId,
        },
      },
      data: {
        roleId: role.roleId,
        assignedAt: new Date(),
      },
    });
  } else {
    // Crear un nuevo rol para el usuario
    await prisma.userRole.create({
      data: {
        userId,
        roleId: role.roleId,
      },
    });
  }

  // Traer el usuario con su rol actualizado
  const userWithRole = await prisma.user.findUnique({
    where: { userId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  // Formatear el rol para que sea solo el nombre
  const formattedRole = userWithRole.roles.length > 0
    ? userWithRole.roles[0].role.name
    : null;

  return {
    id: userWithRole.userId,
    email: userWithRole.email,
    firstName: userWithRole.firstName,
    lastName: userWithRole.lastName,
    role: formattedRole,
    status: userWithRole.status,
    registeredAt: userWithRole.registeredAt,
  };
};
