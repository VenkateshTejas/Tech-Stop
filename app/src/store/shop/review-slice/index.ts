import axiosInstance from "@/services/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define types for the state and review data
interface Review {
  userName: string;
  reviewValue: number;
  reviewMessage: string;
}

interface ReviewState {
  isLoading: boolean;
  reviews: Review[];
}

const initialState: ReviewState = {
  isLoading: false,
  reviews: [],
};

// Thunk to add a review
export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata: {
    productId: string;
    userId: string;
    userName: string;
    reviewMessage: string;
    reviewValue: number;
  }) => {
    const response = await axiosInstance.post(`/shop/review/add`, formdata);

    return response.data;
  }
);

// Thunk to get reviews for a product
export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async (id: string) => {
    const response = await axiosInstance.get(`/shop/review/${id}`);

    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getReviews.fulfilled,
        (state, action: PayloadAction<{ data: Review[] }>) => {
          state.isLoading = false;
          state.reviews = action.payload.data;
        }
      )
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
