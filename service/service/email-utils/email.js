import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { transporter } from "./config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: '"Tech Stop" <dhyeyrabadia1@gmail.com>',
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"Tech Stop" <dhyeyrabadia1@gmail.com>',
      to: email,
      subject: "Welcome to Tech Stop",
      html: WELCOME_EMAIL_TEMPLATE.replace("{user}", name),
      category: "Welcome Email",
    });
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: '"Tech Stop" <dhyeyrabadia1@gmail.com>',
      to: email,
      subject: "Reset account password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Reset Password",
    });
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendSuccessMailOnResetPassword = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: '"Tech Stop" <dhyeyrabadia1@gmail.com>',
      to: email,
      subject: "Password Reset Successfull",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};
