// frontend/src/App.js - Version mới, đã modernize
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";    // ✅ Context providers
import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

// User pages
import HomePage from "./pages/HomePage";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";

// Admin pages - ✅ Complete admin system
import ProductListAdminPage from "./pages/admin/ProductListAdminPage";
import ProductEditAdminPage from "./pages/admin/ProductEditAdminPage";
import OrderListAdminPage from "./pages/admin/OrderListAdminPage";
import UserListAdminPage from "./pages/admin/UserListAdminPage";

function App() {
  return (
    <AuthProvider>        {/* ✅ Authentication context */}
      <CartProvider>      {/* ✅ Cart context */}
        <Router>
          <Header />
          <main className="container mt-4">
            <Routes>
              {/* User routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />  // ✅ Đúng route
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Admin routes - ✅ Complete admin panel */}
              <Route path="/admin/products" element={<ProductListAdminPage />} />
              <Route path="/admin/products/:id/edit" element={<ProductEditAdminPage />} />
              <Route path="/admin/orders" element={<OrderListAdminPage />} />
              <Route path="/admin/users" element={<UserListAdminPage />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}