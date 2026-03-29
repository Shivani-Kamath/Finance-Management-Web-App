const Joi = require("joi");

// Common reusable helper
const validateRequest = (schema, req, res, next) => {
  const options = {
    abortEarly: false, // return all errors, not just the first one
    allowUnknown: false, // reject extra fields not in schema
    stripUnknown: true, // remove unknown fields automatically
  };

  const { error, value } = schema.validate(req.body, options);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  req.body = value; // sanitized & validated input
  next();
};

// Signup schema
const signupSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should be at least 3 characters",
    "string.max": "Name should not exceed 100 characters",
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password should be at least 6 characters",
    "string.max": "Password should not exceed 100 characters",
  }),
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password should be at least 6 characters",
    "string.max": "Password should not exceed 100 characters",
  }),
});

// Exported middlewares
const signupValidation = (req, res, next) =>
  validateRequest(signupSchema, req, res, next);

const loginValidation = (req, res, next) =>
  validateRequest(loginSchema, req, res, next);

module.exports = {
  signupValidation,
  loginValidation,
};
