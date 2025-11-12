import prisma from "../../config/prismaClient.js";

export const getAllStudents = async () => {
  const students = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: "student",
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
            name: "student", // Solo trae el rol de teacher
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

  return students.map((t) => ({
    id: t.userId,
    name: `${t.firstName} ${t.lastName}`,
    email: t.email,
    role: t.roles[0]?.role.name || "student",
    permissions: t.UserPermission.map((p) => p.permission),
    status: t.status,
  }));
};
