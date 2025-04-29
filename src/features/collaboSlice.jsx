import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  collabos: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchCollabos = createAsyncThunk(
  "collabo/fetchCollabos",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/collabos/get");
      return data.data.collabos;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createCollabo = createAsyncThunk(
  "collabo/createCollabo",
  async (collaboData, { rejectWithValue }) => {
    toast.info("Creating collaboration...");
    try {
      const { data } = await axiosInstance.post(
        "/collabos/admin/add",
        collaboData
      );
      toast.success("Collaboration created successfully!");
      return data.data.collabo;
    } catch (err) {
      toast.error(
        err.response.data.message || "Failed to create collaboration."
      );
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateCollabo = createAsyncThunk(
  "collabo/updateCollabo",
  async ({ id, collaboData }, { rejectWithValue }) => {
    try {
      toast.info("Updating collaboration...");
      const { data } = await axiosInstance.put(
        `/collabos/admin/update${id}`,
        collaboData
      );
      toast.success("Collaboration updated successfully!");
      return data.data.collabo;
    } catch (err) {
      toast.error(
        err.response.data.message || "Failed to update collaboration."
      );
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteCollabo = createAsyncThunk(
  "collabo/deleteCollabo",
  async (id, { rejectWithValue }) => {
    try {
      toast.info("Deleting collaboration...");
      await axiosInstance.delete(`/collabos/admin/delete/${id}`);
      toast.success("Collaboration deleted successfully!");
      return id;
    } catch (err) {
      toast.error(
        err.response.data.message || "Failed to delete collaboration."
      );
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleCollaboStatus = createAsyncThunk(
  "collabo/toggleCollaboStatus",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/collabos/${id}/toggle-status`
      );
      toast.success("Collaboration status updated successfully!");
      return data.data.collabo;
    } catch (err) {
      toast.error(err.response.data.message || "Failed to update status.");
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateCollaboOrder = createAsyncThunk(
  "collabo/updateOrder",
  async (orderedCollabos, { rejectWithValue }) => {
    try {
      toast.info("Updating collaboration order...");
      const response = await axiosInstance.put("/collabos/update-order", {
        orderedCollabos,
      });
      toast.success("Collaboration order updated successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const collaboSlice = createSlice({
  name: "collabo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollabos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollabos.fulfilled, (state, action) => {
        state.loading = false;
        state.collabos = action.payload;
      })
      .addCase(fetchCollabos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCollabo.fulfilled, (state, action) => {
        state.collabos.unshift(action.payload);
      })
      .addCase(updateCollabo.fulfilled, (state, action) => {
        const index = state.collabos.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.collabos[index] = action.payload;
      })
      .addCase(deleteCollabo.fulfilled, (state, action) => {
        state.collabos = state.collabos.filter((c) => c._id !== action.payload);
      })
      .addCase(toggleCollaboStatus.fulfilled, (state, action) => {
        const index = state.collabos.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.collabos[index] = action.payload;
      })
      .addCase(updateCollaboOrder.pending, (state, action) => {})
      .addCase(updateCollaboOrder.fulfilled, (state, action) => {
        state.collabos = orderedCollabos;
      })
      .addCase(updateCollaboOrder.rejected, (state, action) => {
        console.error("Failed to update order:", action.payload);
      });
  },
});

export default collaboSlice.reducer;
