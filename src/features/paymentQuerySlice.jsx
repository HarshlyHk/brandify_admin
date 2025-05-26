import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  paymentQueries: [],
  paymentQuery: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 0,
};

// Thunks

// Get All Payment Queries
export const getAllPaymentQueries = createAsyncThunk(
  "paymentQuery/getAllPaymentQueries",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/payment-query/get?page=" + page + "&limit=" + limit
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch queries.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete Payment Query
export const deletePaymentQuery = createAsyncThunk(
  "paymentQuery/deletePaymentQuery",
  async (id, { rejectWithValue }) => {
    toast.info("Deleting payment query...");
    try {
      await axiosInstance.delete(`/payment-query/${id}`);
      toast.success("Payment query deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete query.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Slice
const paymentQuerySlice = createSlice({
  name: "paymentQuery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllPaymentQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPaymentQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentQueries = action.payload.data.paymentQueries;
        state.total = action.payload.data.pagination.total;
        state.page = action.payload.data.pagination.page;
        state.totalPages = action.payload.data.pagination.totalPages;
      })
      .addCase(getAllPaymentQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePaymentQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePaymentQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentQueries = state.paymentQueries.filter(
          (query) => query._id !== action.payload
        );
      })
      .addCase(deletePaymentQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentQuerySlice.reducer;
