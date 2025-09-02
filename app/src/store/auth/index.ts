import { AuthState, User } from "@/models/auth";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";

// Initial state for the auth slice
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  errorMsg: null,
  successMsg: null,
};

// Async thunk to check authentication
export const checkAuth = createAsyncThunk(
  "/auth/checkauth", // Action type string
  async () => {
    const response = await axiosInstance.get("auth/check-auth", {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });

    // console.log(response); // Log the response (for debugging)
    return response.data; // Return the data from the API
  }
);

// Auth slice definition
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true; // Set isAuthenticated to true if user exists
      } else {
        state.isAuthenticated = false; // Set isAuthenticated to false if user is null
        state.user = null; // Clear user data
      }
    },
    setErrorMsg: (state, action: PayloadAction<string | null>) => {
      state.errorMsg = action.payload;
    },
    setSuccessMsg: (state, action: PayloadAction<string | null>) => {
      state.successMsg = action.payload;
    },
    clearMessages: (state) => {
      state.errorMsg = null;
      state.successMsg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true; // Set isLoading to true when the async action is pending
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false; // Set isLoading to false when the async action is fulfilled
        state.user = action.payload.user; // Assuming your API response contains user data
        state.isAuthenticated = true; // Set isAuthenticated to true when user data is received
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false; // Set isLoading to false when the async action fails
        // state.errorMsg = action.error.message || "Failed to check authentication"; // Set error message
        state.isAuthenticated = false; // Make sure isAuthenticated is false when the action fails
        state.user = null; // Ensure the user is cleared if authentication fails
      });
  },
});

// Export actions to be used in components
export const {
  setLoading,
  setUser,
  clearMessages,
  setErrorMsg,
  setSuccessMsg,
} = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;
