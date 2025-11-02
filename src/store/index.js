import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import productReducer from "../features/productSlice";
import categoryReducer from "../features/categorySlics";
import tagReducer from "../features/tagSlice";
import orderReducer from "../features/orderSlice";
import manageUser from "../features/manageUser";
import contactUs from "../features/contactSlice";
import paymentQuery from "../features/paymentQuerySlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    tags: tagReducer,
    order: orderReducer,
    manageUser: manageUser,
    contactUs: contactUs,
    paymentQuery: paymentQuery,
  },
});

export default store;
