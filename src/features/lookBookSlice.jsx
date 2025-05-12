import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  lookBooks: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchLookBooks = createAsyncThunk(
  "lookBook/fetchLookBooks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/lookbooks/get");
      return data.data.lookBooks;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createLookBook = createAsyncThunk(
  "lookBook/createLookBook",
  async (lookBookData, { rejectWithValue }) => {
    toast.info("Creating LookBook...");
    try {
      const { data } = await axiosInstance.post(
        "/lookbooks/admin/add",
        lookBookData
      );
      toast.success("LookBook created successfully!");
      return data.data.lookBook;
    } catch (err) {
      toast.error(err.response.data.message || "Failed to create LookBook.");
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateLookBook = createAsyncThunk(
  "lookBook/updateLookBook",
  async ({ id, lookBookData }, { rejectWithValue }) => {
    try {
      toast.info("Updating LookBook...");
      const { data } = await axiosInstance.put(
        `/lookbooks/admin/update/${id}`,
        lookBookData
      );
      toast.success("LookBook updated successfully!");
      return data.data.lookBook;
    } catch (err) {
      toast.error(err.response.data.message || "Failed to update LookBook.");
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteLookBook = createAsyncThunk(
  "lookBook/deleteLookBook",
  async (id, { rejectWithValue }) => {
    try {
      toast.info("Deleting LookBook...");
      await axiosInstance.delete(`/lookbooks/admin/delete/${id}`);
      toast.success("LookBook deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.response.data.message || "Failed to delete LookBook.");
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleLookBookStatus = createAsyncThunk(
  "lookBook/toggleLookBookStatus",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/lookbooks/${id}/toggle-status`
      );
      toast.success("LookBook status updated successfully!");
      return data.data.lookBook;
    } catch (err) {
      toast.error(err.response.data.message || "Failed to update status.");
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateLookBookOrder = createAsyncThunk(
  "lookBook/updateOrder",
  async (orderedLookBooks, { rejectWithValue }) => {
    try {
      toast.info("Updating LookBook order...");
      const response = await axiosInstance.put("/lookbooks/update-order", {
        orderedLookBooks,
      });
      toast.success("LookBook order updated successfully!");
      return response.data.lookBooks;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const lookBookSlice = createSlice({
  name: "lookBook",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLookBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLookBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.lookBooks = action.payload;
      })
      .addCase(fetchLookBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createLookBook.fulfilled, (state, action) => {
        state.lookBooks.unshift(action.payload);
      })
      .addCase(updateLookBook.fulfilled, (state, action) => {
        const index = state.lookBooks.findIndex(
          (lb) => lb._id === action.payload._id
        );
        if (index !== -1) state.lookBooks[index] = action.payload;
      })
      .addCase(deleteLookBook.fulfilled, (state, action) => {
        state.lookBooks = state.lookBooks.filter(
          (lb) => lb._id !== action.payload
        );
      })
      .addCase(toggleLookBookStatus.fulfilled, (state, action) => {
        const index = state.lookBooks.findIndex(
          (lb) => lb._id === action.payload._id
        );
        if (index !== -1) state.lookBooks[index] = action.payload;
      })
      .addCase(updateLookBookOrder.fulfilled, (state, action) => {
        state.lookBooks = action.payload;
      })
      .addCase(updateLookBookOrder.rejected, (state, action) => {
        console.error("Failed to update order:", action.payload);
      });
  },
});

export default lookBookSlice.reducer;
