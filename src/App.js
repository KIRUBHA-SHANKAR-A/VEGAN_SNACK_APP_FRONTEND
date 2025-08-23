// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import UserAuth from "./components/UserAuth";
import DisplayVeganSnacks from "./components/DisplayVeganSnacks";
import AddVeganSnack from "./components/AddVeganSnack";
import Inventory from "./components/Inventory";
import ApproveVendors from "./components/ApproveVendors";
import ApproveSnacks from "./components/ApproveSnacks";
import AdminDashboard from "./components/AdminDashboard";
import CreateProductManager from "./components/CreateProductManager";
import StaffLogin from "./components/StaffLogin";

function App() {
  const [authUpdateTrigger, setAuthUpdateTrigger] = useState(0);

  const handleAuthChange = () => {
    setAuthUpdateTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('vendorId');
    handleAuthChange();
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      return <Navigate to="/" replace />;
    }
    
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
     
        <NavBar onLogout={handleLogout} authUpdateTrigger={authUpdateTrigger} />
        <main className="flex-grow pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<UserAuth onAuthChange={handleAuthChange} />} />
            
            {/* User Routes */}
            <Route 
              path="/snacks" 
              element={
                <ProtectedRoute>
                   <DisplayVeganSnacks />
                </ProtectedRoute>
              } 
            />
            
            {/* Vendor Routes */}
            <Route 
              path="/add-snack" 
              element={
                <ProtectedRoute requiredRoles={['VENDOR']}>
                  <AddVeganSnack />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute requiredRoles={['VENDOR']}>
                  <Inventory />
                </ProtectedRoute>
              } 
            />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/create-product-manager" element={<CreateProductManager />} />
            {/* Product Manager & Admin Routes */}
            <Route 
              path="/approve-vendors" 
              element={
                <ProtectedRoute requiredRoles={['PRODUCT_MANAGER', 'ADMIN']}>
                  <ApproveVendors />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/approve-snacks" 
              element={
                <ProtectedRoute requiredRoles={['PRODUCT_MANAGER', 'ADMIN']}>
                  <ApproveSnacks />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Only Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;