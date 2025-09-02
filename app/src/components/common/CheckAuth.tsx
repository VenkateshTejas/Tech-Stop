import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { User } from "@/models/auth"; // Adjust the import path as needed

// Define the prop types
interface CheckAuthProps {
  user: User | null;
  isAuthenticated: boolean;
  children?: React.ReactNode;
}

const CheckAuth: React.FC<CheckAuthProps> = ({
  user,
  isAuthenticated,
  children,
}) => {
  const location = useLocation();

  //   Index page of our page, check for the user authentication, if not navigate to login screen else redirect the user according to the user role
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // If user is not authenticated and tries to access any routes except the auth/routes, then navigate to login screen
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/verify-email") ||
      location.pathname.includes("/reset-password") ||
      location.pathname.includes("/reset-password/:resetToken")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  // if user is authenticated and tries to access the auth routes then redirect user back to admin panel or shop panel based on the authenticity of the role of the user
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // If user is authenticated normal user(customer) and tries to access admin route then redirect the user to unathenticated route
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Default: render children if all checks pass
  return <>{children}</>;
};

export default CheckAuth;
