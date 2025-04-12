import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  orders: [],
  order: null,
  totalOrders: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  taskLoading: false,
  error: null,
};

// Thunks

// Create Order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    toast.info("Creating order...");
    try {
      const { data } = await axiosInstance.post("/orders", orderData);
      toast.success("Order created successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Get All Orders (User)
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/orders");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Get All Orders (Admin)
export const getAllOrdersAdmin = createAsyncThunk(
  "order/getAllOrdersAdmin",
  async ({ page, items }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/orders/admin/get-order?page=" + page + "&items=" + items
      );
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch admin orders."
      );
      return rejectWithValue(err.response?.data);
    }
  }
);

// Get Single Order
export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (orderId, { rejectWithValue }) => {
    toast.info("Fetching order...");
    try {
      const { data } = await axiosInstance.get(
        `/orders/admin/get-single-order/${orderId}`
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch order.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Update Order
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ orderId, updatedData }, { rejectWithValue }) => {
    toast.info("Updating order...");
    try {
      const { data } = await axiosInstance.put(
        `/orders/${orderId}`,
        updatedData
      );
      toast.success("Order updated successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Send Tracking ID

export const sendTrackingId = createAsyncThunk(
  "order/sendTrackingId",
  async (
    { orderId, trackingId, deliveryServiceName, deliveryServiceUrl, email, name },
    { rejectWithValue }
  ) => {
    toast.info("Sending tracking ID...");
    try {
      const { data } = await axiosInstance.put(
        `/orders/admin/send-tracking-id/${orderId}`,
        { trackingId, deliveryServiceName, deliveryServiceUrl, email, name }
      );
      toast.success("Tracking ID sent successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send tracking ID.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete Order
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    toast.info("Deleting order...");
    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      toast.success("Order deleted successfully!");
      return orderId;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete order.");
      return rejectWithValue(err.response?.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.orders.push(action.payload.data);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Get All Orders (User)
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data.data;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Orders (Admin)
      .addCase(getAllOrdersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrdersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data.orders;
        state.totalOrders = action.payload.data.pagination.totalOrders;
        state.totalPages = action.payload.data.pagination.totalPages;
      })
      .addCase(getAllOrdersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single Order
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.data;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.taskLoading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.data._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload.data;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
