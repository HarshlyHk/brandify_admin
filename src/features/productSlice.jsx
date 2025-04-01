import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  products: [],
  totalProducts: 0,
  loading: false,
  error: null,
};

// Thunks

// Create Product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/product/admin/add",
        productData, // Use productData here
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product created successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product.");
      return rejectWithValue(err.response?.data);
    }
  }
);
// Get Products
export const getProducts = createAsyncThunk(
  "product/getProducts",
  async ({ page = 1, items = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/product/admin/get-product?page=${page}&items=${items}`
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch products.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/product/admin/delete/${productId}`);
      toast.success("Product deleted successfully!");
      return productId;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/product/admin/update/${productId}`,
        updatedData
      );
      toast.success("Product updated successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product.");
      return rejectWithValue(err.response?.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.data);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.totalProducts = action.payload.data.total;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload.data._id
        );
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
