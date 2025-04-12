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

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products/:page" element={<ProductPage />} />
            <Route path="/order/:page" element={<OrderPage />} />
            <Route path="/orders/:id" element={<EditOrder />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<ViewProduct />} />
            <Route path="/abandoned-cart/:page" element={<AbandonedCartPage />} />
            <Route path="/category" element={<Category />} />
            <Route path="/tag" element={<Tag />} />
          </Route>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
