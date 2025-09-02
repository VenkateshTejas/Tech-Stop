import axiosInstance from "@/services/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for Order schema
interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: string;
  quantity: number;
}

interface AddressInfo {
  addressId: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes: string;
}

export interface OrderItem {
  _id: string;
  userId: string;
  cartId: string;
  cartItems: CartItem[];
  addressInfo: AddressInfo;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  orderDate: string;
  orderUpdateDate?: string; // Optional if not always set
  paymentId?: string; // Optional if not paid
  payerId?: string; // Optional if not paid
}

export interface OrderDetails extends OrderItem {}

// Define the state type
interface AdminOrderState {
  orderList: OrderItem[];
  orderDetails: OrderDetails | null;
  isLoading: boolean;
}

// Initial state
const initialState: AdminOrderState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
};

// Async thunk to get all orders
export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axiosInstance.get(`/admin/orders`);
    return response.data;
  }
);

// Async thunk to get order details
export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id: string) => {
    const response = await axiosInstance.get(`/admin/orders/details/${id}`);
    return response.data;
  }
);

// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }: { id: string; orderStatus: string }) => {
    const response = await axiosInstance.put(`/admin/orders/update/${id}`, {
      orderStatus,
    });
    return response.data;
  }
);

// Create the slice
const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllOrdersForAdmin
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllOrdersForAdmin.fulfilled,
        (state, action: PayloadAction<{ data: OrderItem[] }>) => {
          state.isLoading = false;
          state.orderList = action.payload.data;
        }
      )
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      // Handle getOrderDetailsForAdmin
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getOrderDetailsForAdmin.fulfilled,
        (state, action: PayloadAction<{ data: OrderDetails }>) => {
          state.isLoading = false;
          state.orderDetails = action.payload.data;
        }
      )
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })

      // Handle updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Export actions
export const { resetOrderDetails } = adminOrderSlice.actions;

// Export the reducer
export default adminOrderSlice.reducer;
