import axiosInstance from "@/services/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  // Add other fields as required
}

interface AdminProductsState {
  isLoading: boolean;
  productList: Product[];
}

const initialState: AdminProductsState = {
  isLoading: false,
  productList: [],
};

// Async thunk for adding a new product
export const addNewProduct = createAsyncThunk(
  "products/addNewProduct",
  async (formData: Record<string, any>) => {
    console.log(formData);

    const response = await axiosInstance.post("/admin/products", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }
);

// Async thunk for fetching all products
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    const response = await axiosInstance.get("/admin/products");
    return response.data;
  }
);

// Async thunk for editing a product
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, formData }: { id: string; formData: Record<string, any> }) => {
    const response = await axios.patch(
      `http://localhost:8000/api/v1/admin/products/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
);

// Async thunk for deleting a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string) => {
    const response = await axiosInstance.delete(`/admin/products/${id}`);

    return response.data;
  }
);

// AdminProducts slice definition
const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAllProducts.fulfilled,
        (state, action: PayloadAction<{ data: Product[] }>) => {
          state.isLoading = false;
          state.productList = action.payload.data;
        }
      )
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

// Export the reducer to be used in the store
export default AdminProductsSlice.reducer;
