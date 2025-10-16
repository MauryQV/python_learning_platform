import prisma from "../../config/prismaClient.js";

/**
 * Actualiza o asigna un rol a un usuario y devuelve el usuario con el rol.
 * @param {number} userId 
 * @param {string} roleName 
 */
export const updateUserRoleRepository = async (userId, roleName) => {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error(`El rol '${roleName}' no existe.`);
  }

  const existingUserRole = await prisma.userRole.findFirst({
    where: { userId },
  });

  if (existingUserRole) {
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
    await prisma.userRole.create({
      data: {
        userId,
        roleId: role.roleId,
      },
    });
  }

  const userWithRole = await prisma.user.findUnique({
    where: { userId },
    include: {
      roles: {
        include: { role: true },
      },
    },
  });

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

/**
 * Actualiza el estado (active o blocked) de un usuario y devuelve el usuario con su rol.
 * @param {number} userId 
 * @param {string} status 
 */
export const updateUserStatusRepository = async (userId, status) => {
  const user = await prisma.user.findUnique({
    where: { userId },
    include: {
      roles: {
        include: { role: true },
      },
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const updatedUser = await prisma.user.update({
    where: { userId },
    data: { status },
  });

  const formattedRole = user.roles.length > 0
    ? user.roles[0].role.name
    : null;

  return {
    id: updatedUser.userId,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    role: formattedRole,
    status: updatedUser.status,
    registeredAt: updatedUser.registeredAt,
  };
};

export const findAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      // Filtra usuarios que NO tengan relación con el rol "admin"
      roles: {
        none: {
          role: {
            name: "admin",
          },
        },
      },
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
    orderBy: {
      userId: "asc",
    },
  });

  // Mapeo para simplificar respuesta
  return users.map(u => ({
    id: u.userId,
    firstName: `${u.firstName} ${u.lastName}`,
    email: u.email,
    role: u.roles.length > 0 ? u.roles[0].role.name : "Sin rol",
    estatus: u.status,
  }));
};
