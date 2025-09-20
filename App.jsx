import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserFromStorage } from "./slices/authSlice";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false); // סגור כברירת מחדל
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const dispatch = useDispatch();

  // בודק אם יש משתמש ב-localStorage בעת טעינת האפליקציה
  useEffect(() => {
    dispatch(setUserFromStorage());
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Sidebar overlay */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* תוכן ראשי – בלי margin-left */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />
          <Route
            path="/products"
            element={
              <AdminRoute>
                <Products />
              </AdminRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <AdminRoute>
                <ProductForm />
              </AdminRoute>
            }
          />
          <Route
            path="/products/:productId"
            element={
              <AdminRoute>
                <ProductForm />
              </AdminRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <AdminRoute>
                <Orders />
              </AdminRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}
