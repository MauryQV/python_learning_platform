import prisma from "../../config/prismaClient.js";

class UserRepository {
  // Buscar usuario por email
  async findByEmail(email) {
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
  }

  // Buscar usuario por ID
  async findById(userId) {
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
  }


  async updateRole(userId, newRoleName) {
    const role = await prisma.role.findUnique({ where: { name: newRoleName } });
    if (!role) throw new Error(`Role "${newRoleName}" does not exist`);

    // Reemplazar roles actuales
    await prisma.userRole.deleteMany({ where: { userId } });
    await prisma.userRole.create({ data: { userId, roleId: role.roleId } });

    return this.findById(userId);
  }

async createUserWithGoogle({ email, googleId, name, picture }) {
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
}


async createWithDefaultRole({ email, passwordHash, firstName, lastName }) {
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
}


}

export default new UserRepository();
