const express = require('express');
const {
  signup,
  login,
  getProfile,
  logout,
  refreshAccessToken,
} = require('../Controllers/AuthController');
const {
  signupValidation,
  loginValidation,
} = require('../Middlewares/AuthValidation');
const ensureAuthenticated = require('../Middlewares/Auth');

const router = express.Router();

// ✅ Signup new user
router.post('/signup', signupValidation, signup);

// ✅ Login user
router.post('/login', loginValidation, login);

// ✅ Refresh access token (requires refresh token in body)
router.post('/refresh', refreshAccessToken);

// ✅ Get logged in user's profile
router.get('/me', ensureAuthenticated, getProfile);

// ✅ Logout (optional if JWT handled client-side, clears cookie if used)
router.post('/logout', ensureAuthenticated, logout);

module.exports = router;
