import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance"; // Assuming you have a configured axios instance

// Define the types
interface AddressFormData {
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes: string;
}

interface AddressWithUserId extends AddressFormData {
  userId: string; // Add userId to AddressFormData
}

interface Address {
  _id: string;
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes: string;
}

interface AddressState {
  isLoading: boolean;
  addressList: Address[];
}

const initialState: AddressState = {
  isLoading: false,
  addressList: [],
};

// Create the async thunk
export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData: AddressWithUserId) => {
    const response = await axiosInstance.post("/shop/address", formData);
    return response.data;
  }
);

// Example of other async thunks for fetching, editing, and deleting
export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId: string) => {
    const response = await axiosInstance.get(`/shop/address/${userId}`);
    return response.data;
  }
);

export const editAddress = createAsyncThunk(
  "/addresses/editAddress",
  async ({
    userId,
    addressId,
    formData,
  }: {
    userId: string;
    addressId: string;
    formData: AddressFormData;
  }) => {
    const response = await axiosInstance.put(
      `/shop/address/${userId}/${addressId}`,
      formData
    );
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }: { userId: string; addressId: string }) => {
    const response = await axiosInstance.delete(
      `/shop/address/${userId}/${addressId}`
    );
    return response.data;
  }
);

// Create slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAllAddresses.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.addressList = action.payload.data;
        }
      )
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
