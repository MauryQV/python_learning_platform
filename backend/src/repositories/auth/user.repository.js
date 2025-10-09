// src/repositories/user.repository.js
import prisma from "../../../config/prismaClient.js";

class UserRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(userId) {
    return prisma.user.findUnique({
      where: { userId },
    });
  }

  async create({ email, passwordHash, firstName, lastName }) {
    return prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
      },
    });
  }
}

export default new UserRepository();
