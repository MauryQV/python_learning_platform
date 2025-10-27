export const userRepositoryMock = {
  findByEmail: jest.fn(),
  createWithDefaultRole: jest.fn(),
  findById: jest.fn(),
  findByEmailWithRoles: jest.fn(),
  createUserWithGoogle: jest.fn(),
  updateRole: jest.fn(),
};
