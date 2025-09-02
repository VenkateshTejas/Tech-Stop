import { setUser, setLoading } from "../../store/auth";
import axiosInstance from "@/services/axiosInstance";
import { useCallback } from "react";
import { User } from "@/models/auth"; // Import or define the User model
import { useAppDispatch } from "../redux-helper";

const useCheckAuth = () => {
  const dispatch = useAppDispatch() // Ensure the dispatch type is AppDispatch for proper typing

  const verifySession = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<{ user: User }>("/auth/check-auth", {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });

      // Dispatch the user data
      dispatch(setUser(response.data.user))
    } catch (error) {
      // console.error("Error verifying session:", error);

      // Set the user as null in case of an error
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { verifySession };
};

export default useCheckAuth;
