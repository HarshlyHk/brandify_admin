import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  products: [],
  totalProducts: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  taskLoading: false,
  error: null,
};

// Thunks

// Create Product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    toast.info("Creating product...");
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
  async ({ page = 1, items = 12 }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/product/get-product?page=${page}&items=${items}`
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch products.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// get single product

export const getSingleProduct = createAsyncThunk(
  "product/getSingleProduct",
  async (productId, { rejectWithValue }) => {
    toast.info("Fetching product...");
    try {
      const { data } = await axiosInstance.get(
        `/product/get-product/${productId}`
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch product.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    toast.info("Deleting product...");
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
    toast.info("Updating product...");
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

// Duplicate Product

export const duplicateProduct = createAsyncThunk(
  "product/duplicateProduct",
  async (productId, { rejectWithValue }) => {
    toast.info("Duplicating product...");
    try {
      const { data } = await axiosInstance.post(`/product/admin/duplicate`, {
        _id : productId,
      });
      toast.success("Product duplicated successfully!");
      return data;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to duplicate product."
      );
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
        state.products.push(action.payload.data.product);
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
        state.totalProducts = action.payload.data.pagination.totalProducts;
        state.currentPage = action.payload.data.pagination.currentPage;
        state.totalPages = action.payload.data.pagination.totalPages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.taskLoading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload.data._id
        );
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })
      .addCase(duplicateProduct.pending, (state) => {
        state.taskLoading = true;
        state.error = null;
      })
      .addCase(duplicateProduct.fulfilled, (state, action) => {
        state.taskLoading = false;
        state.products.push(action.payload.data.duplicatedProduct);
      })
      .addCase(duplicateProduct.rejected, (state, action) => {
        state.taskLoading = false;
        state.error = action.payload;
      })
      // Get Single Product
      .addCase(getSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload.data.product._id
        );
        if (index !== -1) {
          state.products[index] = action.payload.data.product;
        } else {
          state.products.push(action.payload.data.product);
        }
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
