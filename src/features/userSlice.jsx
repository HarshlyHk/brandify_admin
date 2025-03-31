import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  user: null,
  token: localStorage.getItem("drip_access_token") || null,
};


// Thunks

export const loginWithCredentials = createAsyncThunk(
  "user/loginWithCredentials",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/auth/admin/login",
        credentials
      );
      console.log("Login response:", data);
      toast.success("Login successful! Welcome Back " + data.data.user.name);
      return data;
    } catch (err) {
      toast.error(
        err.response.data.message || "Login failed. Please try again."
      );
      return rejectWithValue(err.response.data);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/admin/check-auth");
      toast.success("Welcome Back " + data.data.user.name);
      return data;
    } catch (err) {
      toast.error(err.response.data.message || "Authentication check failed.");
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("drip_access_token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("drip_access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithCredentials.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem("drip_access_token", action.payload.data.token);
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem("drip_access_token", action.payload.data.token);
      })
      .addCase(loginWithCredentials.rejected, (state, action) => {
        console.error("Normal login failed:", action.payload);
      })
      .addCase(checkAuth.rejected, (state, action) => {
        console.error("Check auth failed:", action.payload);
      });
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
