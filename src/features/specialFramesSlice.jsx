import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  specialFrames: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchSpecialFrames = createAsyncThunk(
  "specialFrames/fetchSpecialFrames",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/special-frames/get");
      return data.data.specialFrames;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createSpecialFrame = createAsyncThunk(
  "specialFrames/createSpecialFrame",
  async (specialFrameData, { rejectWithValue }) => {
    toast.info("Creating Special Frame...");
    try {
      const { data } = await axiosInstance.post(
        "/special-frames/admin/add",
        specialFrameData
      );
      toast.success("Special Frame created successfully!");
      return data.data.specialFrames;
    } catch (err) {
      toast.error(err.response.data.message || "Failed to create Special Frame.");
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateSpecialFrame = createAsyncThunk(
  "specialFrames/updateSpecialFrame",
  async ({ id, specialFrameData }, { rejectWithValue }) => {
    try {
      toast.info("Updating Special Frame...");
      const { data } = await axiosInstance.put(
        `/special-frames/admin/update/${id}`,
        specialFrameData
      );
      toast.success("Special Frame updated successfully!");
      return data.data.specialFrames;
    } catch (err) {
      toast.error(err.response.data.message || "Failed to update Special Frame.");
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteSpecialFrame = createAsyncThunk(
  "specialFrames/deleteSpecialFrame",
  async (id, { rejectWithValue }) => {
    try {
      toast.info("Deleting Special Frame...");
      await axiosInstance.delete(`/special-frames/admin/delete/${id}`);
      toast.success("Special Frame deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.response.data.message || "Failed to delete Special Frame.");
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleSpecialFrameStatus = createAsyncThunk(
  "specialFrames/toggleSpecialFrameStatus",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/special-frames/${id}/toggle-status`
      );
      toast.success("Special Frame status updated successfully!");
      return data.data.specialFrames;
    } catch (err) {
      toast.error(err.response.data.message || "Failed to update status.");
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateSpecialFrameOrder = createAsyncThunk(
  "specialFrames/updateOrder",
  async (orderedSpecialFrames, { rejectWithValue }) => {
    try {
      toast.info("Updating Special Frame order...");
      const response = await axiosInstance.put("/special-frames/update-order", {
        orderedSpecialFrames,
      });
      toast.success("Special Frame order updated successfully!");
      return response.data.specialFrames;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const specialFramesSlice = createSlice({
  name: "specialFrames",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialFrames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialFrames.fulfilled, (state, action) => {
        state.loading = false;
        state.specialFrames = action.payload;
      })
      .addCase(fetchSpecialFrames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSpecialFrame.fulfilled, (state, action) => {
        state.specialFrames.unshift(action.payload);
      })
      .addCase(updateSpecialFrame.fulfilled, (state, action) => {
        const index = state.specialFrames.findIndex(
          (sf) => sf._id === action.payload._id
        );
        if (index !== -1) state.specialFrames[index] = action.payload;
      })
      .addCase(deleteSpecialFrame.fulfilled, (state, action) => {
        state.specialFrames = state.specialFrames.filter(
          (sf) => sf._id !== action.payload
        );
      })
      .addCase(toggleSpecialFrameStatus.fulfilled, (state, action) => {
        const index = state.specialFrames.findIndex(
          (sf) => sf._id === action.payload._id
        );
        if (index !== -1) state.specialFrames[index] = action.payload;
      })
      .addCase(updateSpecialFrameOrder.fulfilled, (state, action) => {
        state.specialFrames = action.payload;
      })
      .addCase(updateSpecialFrameOrder.rejected, (state, action) => {
        console.error("Failed to update order:", action.payload);
      });
  },
});

export default specialFramesSlice.reducer;
