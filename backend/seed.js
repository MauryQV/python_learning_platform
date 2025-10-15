import prisma from "./config/prismaClient.js"

async function main() {
  // Roles
  const [student, teacher, admin] = await Promise.all([
    prisma.role.upsert({
      where: { name: "student" },
      update: {},
      create: { name: "student", description: "Alumno regular" },
    }),
    prisma.role.upsert({
      where: { name: "teacher" },
      update: {},
      create: { name: "teacher", description: "Docente" },
    }),
    prisma.role.upsert({
      where: { name: "admin" },
      update: {},
      create: { name: "admin", description: "Administrador del sistema" },
    }),
  ]);

  // Permisos de cada rol
  await prisma.rolePermission.createMany({
    data: [
      { roleId: student.roleId, permission: "VIEW_COURSES" },
      { roleId: student.roleId, permission: "SUBMIT_ASSIGNMENT" },
      { roleId: teacher.roleId, permission: "EDIT_TOPICS" },
      { roleId: teacher.roleId, permission: "EXECUTE_CODE" },
      { roleId: teacher.roleId, permission: "GRADE_TASKS" },
      { roleId: admin.roleId, permission: "*" },
    ],
    skipDuplicates: true,
  });

  // Crear un usuario estudiante
  const user = await prisma.user.upsert({
    where: { email: "juan@student.com" },
    update: {},
    create: {
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan@student.com",
      passwordHash: "hashed123",
      roles: { create: [{ roleId: student.roleId }] },
    },
  });

  console.log("✅ Seed completado:", user);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
