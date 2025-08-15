import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  reviews: [],
  myreview: null,
  total: 0,
  totalPages: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  sort: "newest",
  productDetail: null
};

export const getProductReviews = createAsyncThunk(
  "review/getProductReviews",
  async ({ productId, page, limit, sort }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/review/admin/${productId}?page=${page}&limit=${limit}&sort=${sort}`
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch reviews.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Add fake review thunk
export const addFakeReview = createAsyncThunk(
  "review/addFakeReview",
  async ({ productId, name, comment, rating, title }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/review/fake", {
        productId,
        name,
        comment,
        title,
        rating,
      });
      toast.success("Fake review added!");
      return data.review;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add fake review.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Admin edit review thunk
export const adminEditReview = createAsyncThunk(
  "review/adminEditReview",
  async ({ productId, reviewId, rating, comment, name, title, certifiedBuyer }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/review/admin/${productId}/${reviewId}`,
        { rating, comment, name, title, certifiedBuyer }
      );
      toast.success("Review updated!");
      return { reviewId, review: data.review };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update review.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Admin delete review thunk
export const adminDeleteReview = createAsyncThunk(
  "review/adminDeleteReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/review/admin/${productId}/${reviewId}`);
      toast.success("Review deleted!");
      return reviewId;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review.");
      return rejectWithValue(err.response?.data);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.myreview = action.payload.myreview;
        state.productDetail = action.payload.product;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add fake review: append to reviews
      .addCase(addFakeReview.fulfilled, (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
        state.total += 1;
      })
      // Admin edit review: update review in state
      .addCase(adminEditReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.map(r =>
          r._id === action.payload.reviewId ? action.payload.review : r
        );
      })
      // Admin delete review: remove from state
      .addCase(adminDeleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { setPage, setLimit, setSort } = reviewSlice.actions;
export default reviewSlice.reducer;
