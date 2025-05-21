import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  users: [],
  total: 0,
  totalPages: 0,
  loading: false,
  error: null,
  page: 1,
  limit: 20,
};

// Thunk to fetch users with pagination
export const fetchUsers = createAsyncThunk(
  "manageUser/fetchUsers",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/user/admin/get-users?page=${page}&limit=${limit}`
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users.");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const manageUserSlice = createSlice({
  name: "manageUser",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.users || [];
        state.total = action.payload.data.totalUsers || 0;
        state.totalPages = action.payload.data.totalPages || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users.";
      });
  },
});

export const { setPage, setLimit } = manageUserSlice.actions;
export default manageUserSlice.reducer;
