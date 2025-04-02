import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  categories: [],
  loading: false,
  taskLoading: false,
  error: null,
};

// Thunks

// Create Category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/category/admin/add",
        categoryData
      );
      toast.success("Category created successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Get Categories
export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/category/get-category");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch categories.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Update Category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ( {id, formData }, { rejectWithValue }) => {
     console.log(id, formData);
    try {
      const { data } = await axiosInstance.put(
        `/category/admin/update/${id}`,
        formData
      );
      toast.success("Category updated successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/category/admin/delete/${categoryId}`);
      toast.success("Category deleted successfully!");
      return categoryId;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category.");
      return rejectWithValue(err.response?.data);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.categories.push(action.payload.data);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.taskLoading = false;
        const index = state.categories.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;