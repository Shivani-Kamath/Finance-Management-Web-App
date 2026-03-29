/**
 * Global Error Handling Middleware
 * Should be placed at the end of all route definitions
 */

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${statusCode} - ${message}`, err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      details: errors,
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      details: `A record with this ${field} already exists in the database`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      details: "The provided token is invalid or malformed",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
      details: "Your session has expired. Please log in again.",
    });
  }

  // Default error response
  res.status(statusCode).json({
    success: false,
    message,
    details: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = errorHandler;
