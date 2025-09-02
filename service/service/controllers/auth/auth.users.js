import {
  signUpUser,
  verifyUserEmail,
  loginUser,
  requestPasswordReset,
  resetUserPassword,
  logOutUser,
} from "../../services/auth/authService.js";
import { generateTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie.js";
import { BadRequest } from "../../errors/index.js";

// Sign up Controller
export const signUp = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !name || !password) {
    throw new BadRequest("Please provide name, email, and password.");
  }

  const user = await signUpUser({ email, password, name });
  generateTokenAndSetCookie(res, user._id);

  res
    .status(201)
    .json({ success: true, msg: "User Created Successfully", user });
};

// Email Verification Controller
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    throw new BadRequest("Please provide the verification code");
  }
  const user = await verifyUserEmail(code);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    user: { ...user._doc, password: undefined },
  });
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser({ email, password });

  generateTokenAndSetCookie(res, {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  res.status(200).json({
    success: true,
    message: "Logged in Successfully",
    user: { ...user._doc, password: undefined },
  });
};

// Authentication Checker
export const checkAuth = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated Successfully",
    user: user.userId,
  });
};

// Forgot Password Request Controller
export const forgotPasswordRequest = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequest("Please Provide email");
  }

  await requestPasswordReset(email);

  res.status(200).json({
    success: true,
    message: "Reset Password link sent to your email",
  });
};

// Controller to reset the password
export const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new BadRequest("Password cannot be empty");
  }

  const user = await resetUserPassword(resetToken, password);
  console.log(user);

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// Contoller to logout the user by clearing the cookie
export const logOut = (req, res) => {
  res.clearCookie("token");
  const { message } = logOutUser();
  res.status(200).json({ success: true, message });
};
