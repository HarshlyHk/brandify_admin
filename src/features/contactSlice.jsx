import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { toast } from "sonner";

const initialState = {
  contactUs: [],
  contact: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 0,
};

// Get All Contacts
export const getAllContacts = createAsyncThunk(
  "contact/getAllContacts",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/contact-us/get?page=" + page + "&limit=" + limit
      );
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch contacts.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete Contact
export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (id, { rejectWithValue }) => {
    toast.info("Deleting contact...");
    try {
      await axiosInstance.delete(`/contact-us/${id}`);
      toast.success("Contact deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete contact.");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Slice
const contactSlice = createSlice({
  name: "contact-us",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contactUs = action.payload.data.contactUsQueries;
        state.total = action.payload.data.pagination.total;
        state.page = action.payload.data.pagination.page;
        state.totalPages = action.payload.data.pagination.totalPages;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contactUs = state.contactUs.filter(
          (contact) => contact._id !== action.payload
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
