import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";

const initialState = {
  abandonedCarts: [], // List of all abandoned carts
  singleAbandonedCart: null, // Data for a single abandoned cart
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  totalItems: 0, // Total number of abandoned carts
  totalPages: 0, // Total number of pages for pagination
};

// Thunk to fetch all abandoned carts
export const fetchAbandonedCarts = createAsyncThunk(
  "abandonedCarts/fetchAbandonedCarts",
  async ({ page, items }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/abandoned-carts?page=" + page + "&limit=" + items
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk to delete an abandoned cart by ID
export const deleteAbandonedCart = createAsyncThunk(
  "abandonedCarts/deleteAbandonedCart",
  async (cartId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/abandoned-carts/${cartId}`);
      return cartId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const abandonedCartSlice = createSlice({
  name: "abandonedCarts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all abandoned carts
      .addCase(fetchAbandonedCarts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAbandonedCarts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.abandonedCarts = action.payload.data; // Set the list of abandoned carts
        state.totalItems = action.payload.totalItems; // Set the total number of items
        state.totalPages = action.payload.totalPages; // Set the total number of pages
    })
      .addCase(fetchAbandonedCarts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete abandoned cart
      .addCase(deleteAbandonedCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAbandonedCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.abandonedCarts = state.abandonedCarts.filter(
          (cart) => cart._id !== action.payload
        );
      })
      .addCase(deleteAbandonedCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default abandonedCartSlice.reducer;
