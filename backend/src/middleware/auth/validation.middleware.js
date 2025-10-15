import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "any.required": "The email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "The password must be at least 6 characters long",
    "any.required": "The password is required",
  }),
});

// Middleware de validación de login
export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "validation error",
      details: error.details.map((err) => err.message),
    });
  }
  next();
};

// Esquema para registro
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "The name must be at least 2 characters long",
    "string.max": "The first name must be at most 50 characters long",
    "any.required": "The name is required",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "The last name must be at least 2 characters long",
    "string.max": "The last name must be at most 50 characters long",
    "any.required": "The last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "invalid email",
    "any.required": "The email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "The passord must be at least 6 chracters long",
    "any.required": "The password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "The passwords does not match",
    "any.required": "The confirm passord is required",
  }),
});

// Middleware de validación de registro
export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "validation error",
      details: error.details.map((err) => err.message),
    });
  }
  next();
};
