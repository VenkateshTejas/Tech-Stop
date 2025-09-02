import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/models/shop";
import axiosInstance from "@/services/axiosInstance";

// Define the shape of the entire cart state
// Define the shape of the entire cart state
interface ShoppingCartState {
  cartItems: {
    items: CartItem[]; // Array of cart items,
    userID: string;
    _id: string;
  };
  isLoading: boolean; // Loading state
}

const initialState: ShoppingCartState = {
  cartItems: {
    items: [],
    userID: "",
    _id: "",
  },
  isLoading: false,
};

// Async thunk to add item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({
    userId,
    productId,
    quantity,
  }: {
    userId: string;
    productId: string;
    quantity: number;
  }) => {
    const response = await axiosInstance.post("/shop/cart", {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }
);

// Async thunk to fetch cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId: string) => {
    const response = await axiosInstance.get(`/shop/cart/${userId}`);
    return response.data;
  }
);

// Async thunk to delete an item from the cart
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }: { userId: string; productId: string }) => {
    const response = await axiosInstance.delete(
      `/shop/cart/${userId}/${productId}`
    );
    return response.data;
  }
);

// Async thunk to update the quantity of an item in the cart
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({
    userId,
    productId,
    quantity,
  }: {
    userId: string;
    productId: string;
    quantity: number;
  }) => {
    const response = await axiosInstance.put("/shop/cart", {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle the addToCart actions
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        // Update cart items with the newly fetched data after adding the item
        state.cartItems.items = action.payload.data.items;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        // Optionally, you can keep previous state instead of resetting
        // state.cartItems = {
        //   items: [],
        //   userID: "",
        //   cartId: "",
        // };
      })

      // Handle the fetchCartItems actions
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchCartItems.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.cartItems = action.payload.data; // Keep the entire structure
        }
      )
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        // Do not reset cart state if fetch fails, this is just a fallback
        // state.cartItems = {
        //   items: [],
        //   userID: "",
        //   cartId: "",
        // };
      })

      // Handle the updateCartQuantity actions
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        updateCartQuantity.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          // Update the cart items directly
          const updatedCart = action.payload.data;
          state.cartItems.items = updatedCart;
        }
      )
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        // You might want to leave cart state intact even on error
        // state.cartItems = {
        //   items: [],
        //   userID: "",
        //   cartId: "",
        // };
      })

      // Handle the deleteCartItem actions
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        deleteCartItem.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          // Only update the cart items, avoid overwriting the whole cart
          const updatedCart = action.payload.data;
          state.cartItems.items = updatedCart;
        }
      )
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        // Again, retain the previous state instead of resetting
        // state.cartItems = {
        //   items: [],
        //   userID: "",
        //   cartId: "",
        // };
      });
  },
});

export default shoppingCartSlice.reducer;
