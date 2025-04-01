import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import productReducer from "../features/productSlice";
import analyticsReducer from "../features/analyticsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    analytics: analyticsReducer,
  },
});

export default store;
