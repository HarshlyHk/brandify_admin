import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  tags: [],
  loading: false,
  taskLoading: false,
  error: null,
};

// Thunks

// Create Tag
export const createTag = createAsyncThunk(
  "tag/createTag",
  async (tagData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/tag/admin/add", tagData);
      toast.success("Tag created successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create tag.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Get Tags
export const getTags = createAsyncThunk(
  "tag/getTags",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/tag/get-tags");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tags.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Update Tag
export const updateTag = createAsyncThunk(
  "tag/updateTag",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/tag/admin/update/${id}`, formData);
      toast.success("Tag updated successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update tag.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete Tag
export const deleteTag = createAsyncThunk(
  "tag/deleteTag",
  async (tagId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tag/admin/delete/${tagId}`);
      toast.success("Tag deleted successfully!");
      return tagId;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete tag.");
      return rejectWithValue(err.response?.data);
    }
  }
);

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Tag
      .addCase(createTag.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.tags.push(action.payload.data);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Get Tags
      .addCase(getTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.data;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Tag
      .addCase(updateTag.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.taskLoading = false;
        const index = state.tags.findIndex(
          (tag) => tag._id === action.payload.data._id
        );
        if (index !== -1) {
          state.tags[index] = action.payload.data;
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Delete Tag
      .addCase(deleteTag.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.tags = state.tags.filter((tag) => tag._id !== action.payload);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      });
  },
});

export default tagSlice.reducer;