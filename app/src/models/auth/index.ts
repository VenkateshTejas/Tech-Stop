// Define types for the form data

// Interface for Registration
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

// Interface for login
export interface LoginFormData {
  email: string;
  password: string;
}

// Interface for Email Verification
export interface VerifyEmailData {
  code: string
}

// Interface for Reset Password Request
export interface ResetPasswordRequestData {
  email: string
}

// Interface for Reset Password 
export interface ResetPasswordData {
  password: string
}

// Define the structure of the user object
export interface User {
  id: string;
  name: string;
  email: string;
  role: string
  // Add other fields as needed
}

// User Interface for Auth
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  errorMsg: string | null;
  successMsg: string | null;
}
