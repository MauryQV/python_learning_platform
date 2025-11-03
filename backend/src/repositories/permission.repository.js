import prisma from "../../config/prismaClient.js";

export const permissionRepository = {
  async listAll(roleName = null) {
    const where = roleName
      ? { role: { name: roleName } }
      : {}; 

    const result = await prisma.rolePermission.findMany({
      where,
      select: {
        permission: true,
        role: { select: { name: true } }
      },
      orderBy: { permission: "asc" }
    });

    return result.map(r => ({
      role: r.role.name,
      permission: r.permission
    }));
  }
};
