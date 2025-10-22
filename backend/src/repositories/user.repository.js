import prisma from "../../config/prismaClient.js";

// Buscar usuario por email
export const findByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email }, // SIN include de roles
  });

  if (!user) return null;

  // Traer roles separados
  const userRoles = await prisma.userRole.findMany({
    where: { userId: user.userId },
    include: { role: true },
  });

  user.roles = userRoles;
  return user;
};

// Buscar usuario por ID
export const findById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { userId }, // SIN include de roles
  });

  if (!user) return null;

  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });

  user.roles = userRoles;
  return user;
};

export const updateRole = async (userId, newRoleName) => {
  const role = await prisma.role.findUnique({ where: { name: newRoleName } });
  if (!role) throw new Error(`Role "${newRoleName}" does not exist`);

  // Reemplazar roles actuales
  await prisma.userRole.deleteMany({ where: { userId } });
  await prisma.userRole.create({ data: { userId, roleId: role.roleId } });

  return this.findById(userId);
};

export const createUserWithGoogle = async ({
  email,
  googleId,
  name,
  picture,
}) => {
  const [firstName, ...lastNameParts] = name.split(" ");
  const lastName = lastNameParts.join(" ");

  return await prisma.user.create({
    data: {
      email,
      googleId,
      firstName,
      lastName,
      profileImage: picture,
      isVerified: true,
      passwordHash: null,
    },
    include: { roles: true },
  });
};

export const createWithDefaultRole = async ({
  email,
  passwordHash,
  firstName,
  lastName,
}) => {
  const DEFAULT_ROLE_ID = 3;

  // Crear el usuario y asignarle el rol por defecto en una sola transacción
  return await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      roles: {
        create: {
          roleId: DEFAULT_ROLE_ID,
        },
      },
    },
    include: {
      roles: {
        include: { role: true },
      },
    },
  });
};

export const findByEmailWithRoles = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });
};
