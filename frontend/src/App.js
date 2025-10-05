import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import NotificationContainer from "./components/Notification";

// User pages
import HomePage from "./pages/HomePage";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardAdminPage from "./pages/admin/DashboardAdminPage";
import ProductListAdminPage from "./pages/admin/ProductListAdminPage";
import ProductEditAdminPage from "./pages/admin/ProductEditAdminPage";
import OrderListAdminPage from "./pages/admin/OrderListAdminPage";
import CustomerListAdminPage from "./pages/admin/CustomerListAdminPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <Header />
            <main className="container mt-4">
              <Routes>
                {/* User routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<LoginPage />} />
                {/* Admin layout with nested routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<DashboardAdminPage />} />
                  <Route path="products" element={<ProductListAdminPage />} />
                  <Route path="products/new" element={<ProductEditAdminPage />} />
                  <Route path="products/:id/edit" element={<ProductEditAdminPage />} />
                  <Route path="orders" element={<OrderListAdminPage />} />
                  <Route path="customers" element={<CustomerListAdminPage />} />
                  {/* Có thể thêm các route admin khác ở đây */}
                </Route>
              </Routes>
            </main>
            <Footer />
            <NotificationContainer />
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
