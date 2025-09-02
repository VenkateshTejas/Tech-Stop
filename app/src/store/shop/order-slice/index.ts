import axiosInstance from "@/services/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for the data structure

interface Order {
  _id: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  cartItems: CartItem[];
  addressInfo: AddressInfo;
}

interface CartItem {
  title: string;
  quantity: number;
  price: number;
}

interface AddressInfo {
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes?: string;
}

interface CreateOrderResponse {
  approvalURL: string;
  orderId: string;
}

interface OrderDetailsResponse {
  data: Order;
}

interface GetOrdersResponse {
  data: Order[];
}

interface ShoppingOrderState {
  approvalURL: string | null;
  isLoading: boolean;
  orderId: string | null;
  orderList: Order[];
  orderDetails: Order | null;
}

// Initial state
const initialState: ShoppingOrderState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

// Create async thunks for each API call
export const createNewOrder = createAsyncThunk<CreateOrderResponse, any>(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axiosInstance.post("/shop/order/create", orderData);
    return response.data;
  }
);

export const capturePayment = createAsyncThunk<
  any,
  { paymentId: string; payerId: string; orderId: string }
>("/order/capturePayment", async ({ paymentId, payerId, orderId }) => {
  const response = await axiosInstance.post("/shop/order/capture", {
    paymentId,
    payerId,
    orderId,
  });
  return response.data;
});

export const getAllOrdersByUserId = createAsyncThunk<GetOrdersResponse, string>(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axiosInstance.get(`/shop/order/list/${userId}`);
    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk<OrderDetailsResponse, string>(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axiosInstance.get(`/shop/order/details/${id}`);
    return response.data;
  }
);

// Create slice
const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle create new order actions
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createNewOrder.fulfilled,
        (state, action: PayloadAction<CreateOrderResponse>) => {
          state.isLoading = false;
          state.approvalURL = action.payload.approvalURL;
          state.orderId = action.payload.orderId;
          sessionStorage.setItem(
            "currentOrderId",
            JSON.stringify(action.payload.orderId)
          );
        }
      )
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      // Handle fetch all orders by user ID actions
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllOrdersByUserId.fulfilled,
        (state, action: PayloadAction<GetOrdersResponse>) => {
          state.isLoading = false;
          state.orderList = action.payload.data;
        }
      )
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      // Handle get order details actions
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getOrderDetails.fulfilled,
        (state, action: PayloadAction<OrderDetailsResponse>) => {
          state.isLoading = false;
          state.orderDetails = action.payload.data;
        }
      )
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
