import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  combos: [],
  loading: false,
  taskLoading: false,
  error: null,
};

// Thunks

// Fetch all combos
export const fetchCombos = createAsyncThunk(
  "combo/fetchCombos",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/combo/get");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch combos.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Create a new combo
export const createCombo = createAsyncThunk(
  "combo/createCombo",
  async (comboData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/combo/add", comboData);
      toast.success("Combo created successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create combo.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Update an existing combo
export const updateCombo = createAsyncThunk(
  "combo/updateCombo",
  async ({ id, comboData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/combo/update/${id}`, comboData);
      toast.success("Combo updated successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update combo.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete a combo
export const deleteCombo = createAsyncThunk(
  "combo/deleteCombo",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/combo/delete/${id}`);
      toast.success("Combo deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete combo.");
      return rejectWithValue(err.response?.data);
    }
  }
);

const comboSlice = createSlice({
  name: "combo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Combos
      .addCase(fetchCombos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCombos.fulfilled, (state, action) => {
        state.loading = false;
        state.combos = action.payload.data;
      })
      .addCase(fetchCombos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Combo
      .addCase(createCombo.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(createCombo.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.combos.push(action.payload.data);
      })
      .addCase(createCombo.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Update Combo
      .addCase(updateCombo.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(updateCombo.fulfilled, (state, action) => {
        state.taskLoading = false;
        const index = state.combos.findIndex(
          (combo) => combo._id === action.payload.data._id
        );
        if (index !== -1) {
          state.combos[index] = action.payload.data;
        }
      })
      .addCase(updateCombo.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Delete Combo
      .addCase(deleteCombo.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(deleteCombo.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.combos = state.combos.filter((combo) => combo._id !== action.payload);
      })
      .addCase(deleteCombo.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      });
  },
});

export default comboSlice.reducer;