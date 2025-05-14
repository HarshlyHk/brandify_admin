import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  returnRefunds: [],
  returnRefund: null,
  totalRequests: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  taskLoading: false,
  error: null,
};

// Thunks

// Create Return/Refund Request
export const createReturnRefund = createAsyncThunk(
  "returnRefund/createReturnRefund",
  async (requestData, { rejectWithValue }) => {
    toast.info("Creating return/refund request...");
    try {
      const { data } = await axiosInstance.post(
        "/support/return-exchange",
        requestData
      );
      toast.success("Return/Refund request created successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create request.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Get All Return/Refund Requests
export const getAllReturnRefunds = createAsyncThunk(
  "returnRefund/getAllReturnRefunds",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/support/return-exchange?page=${page}&limit=${limit}`
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch requests.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Get Single Return/Refund Request
export const getReturnRefundById = createAsyncThunk(
  "returnRefund/getReturnRefundById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/support/return-exchange/${id}`
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch request.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Update Return/Refund Request
export const updateReturnRefund = createAsyncThunk(
  "returnRefund/updateReturnRefund",
  async ({ id, updates }, { rejectWithValue }) => {
    toast.info("Updating return/refund request...");
    try {
      const { data } = await axiosInstance.put(
        `/support/return-exchange/${id}`,
        updates
      );
      toast.success("Return/Refund request updated successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update request.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete Return/Refund Request
export const deleteReturnRefund = createAsyncThunk(
  "returnRefund/deleteReturnRefund",
  async (id, { rejectWithValue }) => {
    toast.info("Deleting return/refund request...");
    try {
      await axiosInstance.delete(`/support/return-exchange/${id}`);
      toast.success("Return/Refund request deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete request.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Slice
const returnRefundSlice = createSlice({
  name: "returnRefund",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Return/Refund Request
      .addCase(createReturnRefund.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(createReturnRefund.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.returnRefunds.push(action.payload.data);
      })
      .addCase(createReturnRefund.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Get All Return/Refund Requests
      .addCase(getAllReturnRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReturnRefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.returnRefunds = action.payload.data.returnRefunds;
        state.totalRequests = action.payload.data.total;
        state.totalPages = Math.ceil(
          action.payload.data.total / action.payload.data.limit
        );
        state.currentPage = action.payload.data.page;
      })
      .addCase(getAllReturnRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single Return/Refund Request
      .addCase(getReturnRefundById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReturnRefundById.fulfilled, (state, action) => {
        state.loading = false;
        state.returnRefund = action.payload.data;
      })
      .addCase(getReturnRefundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Return/Refund Request
      .addCase(updateReturnRefund.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(updateReturnRefund.fulfilled, (state, action) => {
        state.taskLoading = false;
        const index = state.returnRefunds.findIndex(
          (request) => request._id === action.payload.data._id
        );
        if (index !== -1) {
          state.returnRefunds[index] = action.payload.data;
        }
      })
      .addCase(updateReturnRefund.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Delete Return/Refund Request
      .addCase(deleteReturnRefund.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(deleteReturnRefund.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.returnRefunds = state.returnRefunds.filter(
          (request) => request._id !== action.payload
        );
      })
      .addCase(deleteReturnRefund.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      });
  },
});

export default returnRefundSlice.reducer;
