import axiosInstance from "@/services/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the type for a feature image
export interface FeatureImage {
  _id: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Define the response type for the addFeatureImage API
interface AddFeatureImageResponse {
  success: boolean;
  data: FeatureImage; // A single feature image object
}

// Define the types for the state
interface CommonState {
  isLoading: boolean;
  featureImageList: FeatureImage[]; // Updated to an array of objects with metadata
  error: string | null; // Added for error handling
}

// Initial state
const initialState: CommonState = {
  isLoading: false,
  featureImageList: [],
  error: null,
};

// Async thunk to get feature images
export const getFeatureImages = createAsyncThunk<
  FeatureImage[],
  void,
  { rejectValue: string }
>("common/getFeatureImages", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/common/feature/get");
    // Accessing the `data` property from the response and returning it
    return response.data.data as FeatureImage[];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch feature images"
    );
  }
});

// Async thunk to add a feature image
export const addFeatureImage = createAsyncThunk<
  AddFeatureImageResponse,
  string,
  { rejectValue: string }
>("common/addFeatureImage", async (image: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/common/feature/add", { image });
    return response.data as AddFeatureImageResponse; // Match the structure of the API response
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add feature image"
    );
  }
});

// Slice definition
const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Feature Images
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getFeatureImages.fulfilled,
        (state, action: PayloadAction<FeatureImage[]>) => {
          state.isLoading = false;
          state.featureImageList = action.payload; // Directly using action.payload
        }
      )
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Add Feature Image
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        addFeatureImage.fulfilled,
        (state, action: PayloadAction<AddFeatureImageResponse>) => {
          state.isLoading = false;

          // Add the new image to the list
          if (action.payload.success) {
            state.featureImageList = [
              ...state.featureImageList,
              action.payload.data,
            ];
          }
        }
      )
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError } = commonSlice.actions;

// Export the reducer
export default commonSlice.reducer;
