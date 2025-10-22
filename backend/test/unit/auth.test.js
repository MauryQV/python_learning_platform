import * as AuthService from "../../src/services/auth.service.js";
import bcrypt from "bcrypt";

// mock de los modulos
jest.mock("../../src/repositories/user.repository.js", () => ({
  findByEmail: jest.fn(),
  createWithDefaultRole: jest.fn(),
  findById: jest.fn(),
  findByEmailWithRoles: jest.fn(),
  createUserWithGoogle: jest.fn(),
  updateRole: jest.fn(),
}));

jest.mock("../../src/auth/tokenService.js", () => ({
  __esModule: true,
  default: {
    generateToken: jest.fn(),
  },
}));

jest.mock("../../src/auth/verifyGoogleToken.js", () => ({
  verifyGoogleToken: jest.fn(),
}));

jest.mock("bcrypt");

describe("AuthService", () => {
  let userRepo;
  let tokenService;
  let verifyGoogleToken;

  beforeEach(() => {
    // Obtener referencias a los mocks
    userRepo = require("../../src/repositories/user.repository.js");
    
    // obtenemos el servicio de token
    const tokenServiceModule = require("../../src/auth/tokenService.js");
    tokenService = tokenServiceModule.default;
    
    verifyGoogleToken = require("../../src/auth/verifyGoogleToken.js").verifyGoogleToken;
    
    jest.clearAllMocks();
  });

  //prueba para registrarse
  describe("register", () => {
    it("debería registrar un usuario y devolver los campos email, firstName, lastName y el token", async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.createWithDefaultRole.mockResolvedValue({
        userId: 1,
        email: "testDeltest@test.com",
        firstName: "juancito",
        lastName: "pinto",
        roles: [{ role: { name: "estudiante" } }],
      });
      tokenService.generateToken.mockReturnValue("fake-token");
      bcrypt.hash.mockResolvedValue("hashed-password");

      const result = await AuthService.register({
        firstName: "Juan",
        lastName: "Pérez",
        email: "test@test.com",
        password: "123456",
      });

      expect(userRepo.findByEmail).toHaveBeenCalledWith("test@test.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(userRepo.createWithDefaultRole).toHaveBeenCalledWith({
        email: "testDeltest@test.com",
        passwordHash: "hashed-password",
        firstName: "juancito",
        lastName: "pinto",
      });
      expect(result.token).toBe("fake-token");
      expect(result.user.email).toBe("test@test.com");
    });

    it("debería lanzar error 409 si el email ya está registrado", async () => {
      userRepo.findByEmail.mockResolvedValue({ 
        userId: 1, 
        email: "test@test.com" 
      });

      await expect(
        AuthService.register({
          firstName: "Ana",
          lastName: "López",
          email: "test@test.com",
          password: "123456",
        })
      ).rejects.toMatchObject({
        message: "The email is already registered",
        statusCode: 409,
      });
    });
  });

  // loguarse
  describe("login", () => {
    it("debería hacer login correctamente con rol estudiante", async () => {
      const mockUser = {
        userId: 1,
        email: "test@test.com",
        firstName: "chente",
        lastName: "vargas",
        isVerified: true,
        profileImage: null,
        roles: [
          { role: { name: "estudiante" } }
        ],
      };

      userRepo.findByEmailWithRoles.mockResolvedValue(mockUser);
      tokenService.generateToken.mockReturnValue("login-token");

      const result = await AuthService.login("test@test.com");

      expect(userRepo.findByEmailWithRoles).toHaveBeenCalledWith("test@test.com");
      expect(tokenService.generateToken).toHaveBeenCalledWith(mockUser);
      expect(result.token).toBe("login-token");
      expect(result.user.email).toBe("test@test.com");
      expect(result.user.role).toBe("estudiante");
      expect(result.user.roles).toEqual(["estudiante"]);
    });

    it("debería lanzar error 401 si el usuario no existe", async () => {
      userRepo.findByEmailWithRoles.mockResolvedValue(null);

      await expect(
        AuthService.login("noexiste@test.com")
      ).rejects.toMatchObject({
        message: "Incorrect credentials",
        statusCode: 401,
      });
    });
  });

 //login con google, simulado
  describe("loginWithGoogle", () => {
    it("debería hacer login con Google correctamente", async () => {
      const mockGoogleData = {
        email: "google@test.com",
        googleId: "google-id-123",
      };

      const mockUser = {
        userId: 3,
        email: "google@test.com",
        googleId: "google-id-123",
        firstName: "google",
        lastName: "usuario",
      };

      verifyGoogleToken.mockResolvedValue(mockGoogleData);
      userRepo.findByEmail.mockResolvedValue(mockUser);
      tokenService.generateToken.mockReturnValue("google-token");

      const result = await AuthService.loginWithGoogle("fake-google-token");

      expect(verifyGoogleToken).toHaveBeenCalledWith("fake-google-token");
      expect(userRepo.findByEmail).toHaveBeenCalledWith("google@test.com");
      expect(result.token).toBe("google-token");
      expect(result.user.email).toBe("google@test.com");
    });

    it("debería lanzar error si el usuario no existe", async () => {
      verifyGoogleToken.mockResolvedValue({
        email: "noexiste@test.com",
        googleId: "google-id-456",
      });
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(
        AuthService.loginWithGoogle("fake-token")
      ).rejects.toThrow("User not found. Please register first.");
    });

    it("debería lanzar error si el googleId no coincide", async () => {
      verifyGoogleToken.mockResolvedValue({
        email: "test@test.com",
        googleId: "google-id-diferente",
      });
      
      userRepo.findByEmail.mockResolvedValue({
        userId: 1,
        email: "test@test.com",
        googleId: "google-id-original",
      });

      await expect(
        AuthService.loginWithGoogle("fake-token")
      ).rejects.toThrow("This email is registered with a different method");
    });

    it("debería lanzar error si el usuario no tiene googleId", async () => {
      verifyGoogleToken.mockResolvedValue({
        email: "test@test.com",
        googleId: "google-id-123",
      });
      
      userRepo.findByEmail.mockResolvedValue({
        userId: 1,
        email: "test@test.com",
        googleId: null, // Usuario registrado con password
      });

      await expect(
        AuthService.loginWithGoogle("fake-token")
      ).rejects.toThrow("This email is registered with a different method");
    });
  });

  // registrarse con google
  describe("registerWithGoogle", () => {
    it("debería registrar un usuario con Google correctamente", async () => {
      const mockGoogleData = {
        email: "newgoogle@test.com",
        name: "New Google User",
        picture: "https://picture.url",
        googleId: "google-new-123",
      };

      const mockCreatedUser = {
        userId: 4,
        email: "newgoogle@test.com",
        googleId: "google-new-123",
        firstName: "New",
        lastName: "Google User",
        profileImage: "https://picture.url",
      };

      verifyGoogleToken.mockResolvedValue(mockGoogleData);
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.createUserWithGoogle.mockResolvedValue(mockCreatedUser);
      tokenService.generateToken.mockReturnValue("new-google-token");

      const result = await AuthService.registerWithGoogle("fake-google-token");

      expect(verifyGoogleToken).toHaveBeenCalledWith("fake-google-token");
      expect(userRepo.findByEmail).toHaveBeenCalledWith("newgoogle@test.com");
      expect(userRepo.createUserWithGoogle).toHaveBeenCalledWith({
        email: "newgoogle@test.com",
        googleId: "google-new-123",
        name: "New Google User",
        picture: "https://picture.url",
      });
      expect(result.token).toBe("new-google-token");
      expect(result.user.email).toBe("newgoogle@test.com");
    });

    it("debería lanzar error si el email ya está registrado", async () => {
      verifyGoogleToken.mockResolvedValue({
        email: "existing@test.com",
        googleId: "google-id",
        name: "Test",
        picture: "url",
      });
      
      userRepo.findByEmail.mockResolvedValue({
        userId: 1,
        email: "existing@test.com",
      });

      await expect(
        AuthService.registerWithGoogle("fake-token")
      ).rejects.toThrow("User already registered with this email");
    });
  });

  // verificamos l existencia del un usuario
  describe("verifyUser", () => {
    it("debería verificar un usuario existente", async () => {
      const mockUser = {
        userId: 5,
        email: "verify@test.com",
        firstName: "Verify",
        lastName: "Test",
        roles: [{ role: { name: "estudiante" } }],
      };

      userRepo.findById.mockResolvedValue(mockUser);

      const result = await AuthService.verifyUser(5);

      expect(userRepo.findById).toHaveBeenCalledWith(5);
      expect(result).toBeDefined();
    });

    it("debería lanzar error 404 si el usuario no existe", async () => {
      userRepo.findById.mockResolvedValue(null);

      await expect(
        AuthService.verifyUser(999)
      ).rejects.toMatchObject({
        message: "User not found",
        statusCode: 404,
      });
    });
  });

  // actualizar el rol de un usuario
  describe("updateUserRole", () => {
    it("debería actualizar el rol de un usuario", async () => {
      const mockUpdatedUser = {
        userId: 6,
        email: "update@test.com",
        roles: [{ role: { name: "profesor" } }],
      };

      userRepo.updateRole.mockResolvedValue(mockUpdatedUser);

      const result = await AuthService.updateUserRole(6, "profesor");

      expect(userRepo.updateRole).toHaveBeenCalledWith(6, "profesor");
      expect(result.roles[0].role.name).toBe("profesor");
    });

    it("debería lanzar error si el usuario no existe", async () => {
      userRepo.updateRole.mockResolvedValue(null);

      await expect(
        AuthService.updateUserRole(999, "admin")
      ).rejects.toThrow("User not found");
    });
  });
});