import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { User } from "../../models/User.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendSuccessMailOnResetPassword,
} from "../../email-utils/email.js";
import BadRequest from "../../errors/bad-request.js";

export const signUpUser = async ({ email, password, name }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequest("User already exists. Please login.");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  await sendVerificationEmail(user.email, verificationToken);
  return user;
};

export const verifyUserEmail = async (code) => {
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequest("Invalid or expired verification code.");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  await sendWelcomeEmail(user.email, user.name);
  return user;
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequest("Please provide email and a password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequest("User doesn't exist.");
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequest("Password is incorrect.");
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequest("This email doesn't exist.");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // one hor later the token expires
  await user.save();

  await sendResetPasswordEmail(
    user.email,
    `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`
  );
  return resetToken;
};

export const resetUserPassword = async (resetToken, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequest("Unauthorized access or expired token.");
  }

  user.password = await bcryptjs.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  await sendSuccessMailOnResetPassword(user.email);
  return user;
};

export const logOutUser = () => {
  return { message: "Logged out successfully." };
};
