import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "./config/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductPage from "./pages/ProductPage";
import AddProduct from "./components/AddProduct/AddProduct";
import ViewProduct from "./components/ViewProduct/ViewProduct";
import { Toaster } from "@/components/ui/sonner";
import Category from "./components/Category/Category";
import Tag from "./components/Category/Tags";
import OrderPage from "./pages/OrderPage";
import EditOrder from "./components/Orders/ViewOrder";
import AbandonedCartPage from "./pages/AbandonedCartPage";
import Traffic from "./components/Traffic/Traffic";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./utils/ThemeProvider";
import Collabos from "./components/Collabos/Collabos";
import CollabosOrderUpdate from "./components/Collabos/CollaboOrder";
import CategoryPriorityEditor from "./components/Products/CategoryPriorityEditor";
import FailedOrders from "./components/FailedOrders/FailedOrders";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products/:page" element={<ProductPage />} />
              <Route path="/order/:page" element={<OrderPage />} />
              <Route path="/orders/:id" element={<EditOrder />} />
              <Route path="/failed-orders/:page" element={<FailedOrders />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<ViewProduct />} />
              <Route
                path="/products/priority"
                element={<CategoryPriorityEditor />}
              />
              <Route
                path="/abandoned-cart/:page"
                element={<AbandonedCartPage />}
              />
              <Route path="/category" element={<Category />} />
              <Route path="/tag" element={<Tag />} />
              <Route path="/traffic" element={<Traffic />} />
              <Route path="/collabos" element={<Collabos />} />
              <Route path="collabo-order" element={<CollabosOrderUpdate />} />
            </Route>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
