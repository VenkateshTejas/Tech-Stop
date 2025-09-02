import axiosInstance from "@/services/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for the search state
interface SearchState {
  isLoading: boolean;
  searchResults: any[]; // You can replace `any` with a more specific type if you know the shape of the search result data
}

// Define types for the async thunk
interface SearchResponse {
  data: any[]; // You can replace `any[]` with a more specific type if you know the structure of the search results
}

// Initial state of the slice
const initialState: SearchState = {
  isLoading: false,
  searchResults: [],
};

// Async thunk for fetching search results
export const getSearchResults = createAsyncThunk<SearchResponse, string>(
  "/order/getSearchResults",
  async (keyword: string) => {
    const response = await axiosInstance.get(`/shop/search/${keyword}`);

    return response.data; // TypeScript will infer the return type as SearchResponse
  }
);

// Create slice with types
const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getSearchResults.fulfilled,
        (state, action: PayloadAction<SearchResponse>) => {
          state.isLoading = false;
          state.searchResults = action.payload.data; // Here, the action payload will be typed correctly
        }
      )
      .addCase(getSearchResults.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
