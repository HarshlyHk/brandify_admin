import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import productReducer from "../features/productSlice";
import analyticsReducer from "../features/analyticsSlice";
import categoryReducer from "../features/categorySlics";
import tagReducer from "../features/tagSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    analytics: analyticsReducer,
    category: categoryReducer,
    tags: tagReducer,
  },
});

export default store;
