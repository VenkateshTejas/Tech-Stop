import express from "express";
import {
  logOut,
  verifyEmail,
  signUp,
  login,
  forgotPasswordRequest,
  resetPassword,
  checkAuth,
} from "../../controllers/auth/auth.users.js";
import authMiddleware from "../../middleware/auth.js";
const router = express.Router();

// Sign Up route
router.route("/signup").post(signUp);

// Login Route
router.route("/login").post(login);

// Sign in route
router.route("/verify-email").post(verifyEmail);

// Check Authentication Route
router.route("/check-auth").get(authMiddleware, checkAuth);

// Logout Route
router.route("/logout").post(logOut);

// Reset Password Request
router.route("/reset-password").post(forgotPasswordRequest);

// Reset Password Route
router.route("/reset-password/:resetToken").put(resetPassword);

export default router;
