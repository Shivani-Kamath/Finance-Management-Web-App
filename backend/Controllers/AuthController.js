const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const Joi = require("joi");

// =======================
// Validation Schemas
// =======================
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// =======================
// Signup Controller
// =======================
const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, please login",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({ name, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      success: true,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// =======================
// Login Controller
// =======================
const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid email or password", success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(403)
        .json({ message: "Invalid email or password", success: false });
    }

    // JWT Access Token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // short-lived for better security
    );

    // JWT Refresh Token
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// =======================
// Get Profile Controller
// =======================
const getProfile = async (req, res) => {
  try {
    // ensureAuthenticated middleware should attach req.user
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    console.error("GetProfile Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// =======================
// Logout Controller
// =======================
const logout = async (req, res) => {
  try {
    // If using refresh tokens stored in DB → remove them here
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ========================
// Refresh Token Controller
// ========================
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        accessToken: newAccessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
        details: jwtErr.message,
      });
    }
  } catch (err) {
    console.error("Refresh Token Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = { signup, login, getProfile, logout, refreshAccessToken };
