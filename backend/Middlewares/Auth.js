const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  // Expecting format: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded payload (id, email, etc.)
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);

    let message = "Unauthorized: Invalid token";
    if (err.name === "TokenExpiredError") {
      message = "Unauthorized: Token expired, please log in again";
    }

    return res.status(403).json({
      success: false,
      message,
    });
  }
};

module.exports = ensureAuthenticated;
