import prisma from "../../config/prismaClient.js";

export const getAllTeachers = async () => {
  const teachers = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: "teacher",
          },
        },
      },
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
      roles: {
        where: {
          role: {
            name: "teacher", // Solo trae el rol de teacher
          },
        },
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
      UserPermission: {
        select: {
          permission: true, // Solo el campo que necesitas
        },
      },
    },
  });

  return teachers.map((t) => ({
    id: t.userId,
    name: `${t.firstName} ${t.lastName}`,
    email: t.email,
    role: t.roles[0]?.role.name || "teacher",
    permissions: t.UserPermission.map((p) => p.permission),
    status: t.status,
  }));
};
