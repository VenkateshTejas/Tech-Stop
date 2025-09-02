import axios, { AxiosResponse } from "axios";
import axiosInstance from "../axiosInstance";
import {
  LoginFormData,
  RegisterFormData,
  ResetPasswordData,
  ResetPasswordRequestData,
  VerifyEmailData,
} from "@/models/auth";

const SIGN_UP = "/auth/signup";
const VERIFY_EMAIL = "/auth/verify-email";
const LOGIN_USER = "/auth/login";
const RESET_PASSWORD_REQUEST = "/auth/reset-password";
const RESET_PASSWORD = "/auth/reset-password";
const LOGOUT = "/auth/logout";

// To register a user
export const registerUser = async (
  formData: RegisterFormData
): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.post(
      SIGN_UP,
      formData,
      {
        withCredentials: true,
      }
    );
    return response; // returns AxiosResponse from the API call
  } catch (error: unknown) {
    // Since 'error' is of type 'unknown', we assert its type here
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>; // Assert as AxiosResponse
    }
    return error as Error; // If not an AxiosError, return as generic Error
  }
};

// User login API call
export const loginUser = async (
  formData: LoginFormData
): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.post(
      LOGIN_USER,
      formData,
      {
        withCredentials: true,
      }
    );
    return response; // returns AxiosResponse from the API call
  } catch (error: unknown) {
    // Since 'error' is of type 'unknown', we assert its type here
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>; // Assert as AxiosResponse
    }
    return error as Error; // If not an AxiosError, return as generic Error
  }
};

// User login API call
export const verifyEmail = async (
  formData: VerifyEmailData
): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.post(
      VERIFY_EMAIL,
      formData,
      {
        withCredentials: true,
      }
    );
    return response; // returns AxiosResponse from the API call
  } catch (error: unknown) {
    // Since 'error' is of type 'unknown', we assert its type here
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>; // Assert as AxiosResponse
    }
    return error as Error; // If not an AxiosError, return as generic Error
  }
};

// User Reset-Password-Request API call
export const resetPasswordRequest = async (
  formData: ResetPasswordRequestData
): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.post(
      RESET_PASSWORD_REQUEST,
      formData,
      {
        withCredentials: true,
      }
    );
    return response; // returns AxiosResponse from the API call
  } catch (error: unknown) {
    // Since 'error' is of type 'unknown', we assert its type here
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>; // Assert as AxiosResponse
    }
    return error as Error; // If not an AxiosError, return as generic Error
  }
};

// User Reset-Password API call
export const resetPassword = async (
  formData: ResetPasswordData,
  resetToken: string | undefined
): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.put(
      `${RESET_PASSWORD}/${resetToken}`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response; // returns AxiosResponse from the API call
  } catch (error: unknown) {
    // Since 'error' is of type 'unknown', we assert its type here
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>; // Assert as AxiosResponse
    }
    return error as Error; // If not an AxiosError, return as generic Error
  }
};

// User Reset-Password API call
export const logout = async (): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.post(
      LOGOUT,
      {},
      {
        withCredentials: true,
      }
    );
    return response; // returns AxiosResponse from the API call
  } catch (error: unknown) {
    // Since 'error' is of type 'unknown', we assert its type here
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>; // Assert as AxiosResponse
    }
    return error as Error; // If not an AxiosError, return as generic Error
  }
};
