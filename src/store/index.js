import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import productReducer from "../features/productSlice";
import analyticsReducer from "../features/analyticsSlice";
import categoryReducer from "../features/categorySlics";
import tagReducer from "../features/tagSlice";
import orderReducer from "../features/orderSlice";
import abandonedCartReducer from "../features/abandonedCart";
import Collabos from "../features/collaboSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    analytics: analyticsReducer,
    category: categoryReducer,
    tags: tagReducer,
    order: orderReducer,
    abandonedCart: abandonedCartReducer,
    collabo: Collabos,
  },
});

export default store;
