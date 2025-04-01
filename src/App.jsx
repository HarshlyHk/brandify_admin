import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "./config/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductPage from "./pages/ProductPage";
import AddProduct from "./components/AddProduct/AddProduct";
import ViewProduct from "./components/ViewProduct/ViewProduct";
import { Toaster } from "@/components/ui/sonner"


function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<ViewProduct />} />
          </Route>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
