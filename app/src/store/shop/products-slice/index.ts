import { Product } from "@/models/shop";
import axiosInstance from "@/services/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the API response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Define the state for the slice
interface ProductsState {
  isLoading: boolean;
  productList: Product[];
  productDetails: Product | null;
}

const initialState: ProductsState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

// Define parameters for the fetchAllFilteredProducts thunk
interface FetchAllFilteredProductsParams {
  filterParams: { [key: string]: string | string[] };
  sortParams: string;
}

// Thunk for fetching all filtered products as well as by default when there are no filters passed, at that time fetch all the products
export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllFilteredProducts",
  async ({ filterParams, sortParams }: FetchAllFilteredProductsParams) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axiosInstance.get<ApiResponse<Product[]>>(
      `/shop/products?${query}`
    );

    return result.data;
  }
);

// Thunk for fetching product details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id: string) => {
    const result = await axiosInstance.get<ApiResponse<Product>>(
      `/shop/products/${id}`
    );

    return result.data;
  }
);

// Create the slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAllFilteredProducts.fulfilled,
        (state, action: PayloadAction<ApiResponse<Product[]>>) => {
          state.isLoading = false;
          state.productList = action.payload.data;
        }
      )
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchProductDetails.fulfilled,
        (state, action: PayloadAction<ApiResponse<Product>>) => {
          state.isLoading = false;
          state.productDetails = action.payload.data;
        }
      )
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

// Export actions and reducer
export const { setProductDetails } = productsSlice.actions;

export default productsSlice.reducer;
