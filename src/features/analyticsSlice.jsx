import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  analytics: null,
  dashboardAnalytics: null,
  loading: false,
  error: null,
  dateRange: 30,
  lastFetch: null,
  cacheExpiry: 30 * 60 * 1000, // 30 minutes in milliseconds
};

// Thunk to fetch legacy analytics data
export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/analytics");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch analytics.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Thunk to fetch new dashboard analytics data with cache check
export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/fetchDashboardAnalytics",
  async (days = 30, { rejectWithValue, getState }) => {
    try {
      const state = getState().analytics;
      const now = Date.now();
      
      // Check if we have cached data that's still valid
      if (
        state.dashboardAnalytics && 
        state.lastFetch && 
        state.dateRange === days &&
        (now - state.lastFetch < state.cacheExpiry)
      ) {
        console.log('Using cached dashboard analytics');
        return { 
          data: state.dashboardAnalytics, 
          fromCache: true,
          cacheAge: now - state.lastFetch
        };
      }
      
      console.log('Fetching fresh dashboard analytics');
      const { data } = await axiosInstance.get(`/analytics/dashboard?days=${days}`);
      return { ...data, fromCache: false, fetchTime: now };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch dashboard analytics.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Thunk to fetch analytics for date range
export const fetchAnalyticsRange = createAsyncThunk(
  "analytics/fetchAnalyticsRange",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/analytics/range?startDate=${startDate}&endDate=${endDate}`
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch analytics range.");
      return rejectWithValue(err.response?.data);
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
      // Clear cache when date range changes
      state.lastFetch = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCache: (state) => {
      state.dashboardAnalytics = null;
      state.lastFetch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Legacy analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Dashboard analytics
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.fromCache) {
          // Data came from frontend cache, don't update lastFetch
          state.dashboardAnalytics = action.payload.data;
        } else {
          // Fresh data from server
          state.dashboardAnalytics = action.payload.data;
          state.lastFetch = action.payload.fetchTime || Date.now();
        }
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Analytics range
      .addCase(fetchAnalyticsRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsRange.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardAnalytics = action.payload.data;
      })
      .addCase(fetchAnalyticsRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setDateRange, clearError, clearCache } = analyticsSlice.actions;
export default analyticsSlice.reducer;