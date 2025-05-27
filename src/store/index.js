import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import productReducer from "../features/productSlice";
import analyticsReducer from "../features/analyticsSlice";
import categoryReducer from "../features/categorySlics";
import tagReducer from "../features/tagSlice";
import orderReducer from "../features/orderSlice";
import abandonedCartReducer from "../features/abandonedCart";
import Collabos from "../features/collaboSlice";
import LookBook from "../features/lookBookSlice";
import returnRefund from "../features/returnRefundSlice";
import manageUser from "../features/manageUser";
import contactUs from "../features/contactSlice";
import paymentQuery from "../features/paymentQuerySlice";
import combo from "../features/comboSlice";
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
    lookBook: LookBook,
    returnRefund: returnRefund,
    manageUser: manageUser,
    contactUs: contactUs,
    paymentQuery: paymentQuery,
    combo : combo,
  },
});

export default store;
