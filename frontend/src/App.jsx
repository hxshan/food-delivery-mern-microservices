import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import AdminDashboard from './pages/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageDrivers from './pages/admin/ManageDrivers';
import ManageRestaurants from './pages/admin/ManageRestaurants';

// Layouts / Common components
import Navbar from './components/Navbar'; // If you have a Navbar component

// Auth wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // Replace this with actual auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerification />} />

        {/* Admin Routes with nested structure */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="drivers" element={<ManageDrivers />} />
          <Route path="restaurants" element={<ManageRestaurants />} />
        </Route>

        {/* Fallback - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
