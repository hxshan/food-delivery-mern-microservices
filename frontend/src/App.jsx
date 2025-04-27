import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/home"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OtpVerification from "./pages/OtpVerification";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import ManageCustomers from "./pages/admin/ManageCustomers";
import ManageDrivers from "./pages/admin/ManageDrivers";
import ManageRestaurants from "./pages/admin/ManageRestaurants";
import AddRestaurant from "./pages/RestaurantAdmin/AddRestaurant";
import AddMenuItem from "./pages/RestaurantAdmin/AddMenuItem";
import MenuListByRestaurant from "./pages/RestaurantAdmin/MenuListByRestaurant";
import RestaurantDetails from "./pages/RestaurantAdmin/RestaurantDetails"; 
import UpdateMenuItem from "./pages/RestaurantAdmin/UpdateMenuItem";
//import Navbar from "./pages/RestaurantAdmin/Navbar";
import { ToastContainer } from "react-toastify";

import ResturantListing from "./pages/Customer/ResturentListPage";
import CustomerDetails from "./pages/Customer/CustomerDetails";
import DeliveryDriverDetails from "./pages/Driver/DeliveryDriverDetails";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import DriverProfilePage from "./pages/Driver/DriverProfile";
import RestaurantsInfo from "./pages/Admin/RestaurantsInfo";
import RestaurantMenus from "./pages/Admin/RestaurantMenus";
import RestaurantAdminDashboard from "./pages/RestaurantAdmin/RestaurantAdminDashboard";
import DriverSignup from "./pages/DriverSignup";
import DriverOtpVerification from "./pages/DriverOtpVerification";
import DriverLogin from "./pages/DriverLogin";
import UserProfile from "./pages/Customer/UserProfile";import MapScreen from "./pages/Customer/MapScreen"
import DriverDashboard from "./pages/Driver/DriverDashboard";
import DriverMapScreen from "./pages/Driver/DriverMapscreen";
import RestaurantLogin from "./pages/RestaurantLogin"
import RestaurantOtpVerification from "./pages/RestaurantOtpVerification"
import RestaurantSignup from "./pages/RestaurantSignup"

import RegistrationSelection from "./pages/RegistrationSelection";
import LoginSelection from "./pages/LoginSelection";



import ResturentPage from "./pages/Customer/ResturentPage";
import OrderConfirmation from "./pages/Customer/OrderConfirmPage";
import DriverWaitingActivation from "./pages/Driver/DriverwaitforActivation";


// Auth wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // Replace this with actual auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <ToastContainer />
      {/* <Navbar /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/resturentlist" element={<ResturantListing />} />
        <Route path="/restaurant/:restaurantId" element={<ResturentPage />} />
        <Route path="/checkout" element={<OrderConfirmation />} />

        <Route path="/login" element={<Login />} />
        <Route path="/driver-login" element={<DriverLogin />} />
        <Route path="/restaurantLogin" element={<RestaurantLogin />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/driverSignup" element={<DriverSignup />} />
        <Route path="/restaurantSignup" element={<RestaurantSignup />} />

        <Route path="/verify-otp/:userId" element={<OtpVerification />} />
        <Route path="/driver-otp/:userId" element={<DriverOtpVerification />} />
        <Route path="/restaurant-otp/:userId" element={<RestaurantOtpVerification />} />

        <Route path="/registrationSelection" element={<RegistrationSelection />} />
        <Route path="/loginSelection" element={<LoginSelection />} />

        
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/add-menu/:id" element={<AddMenuItem />} />
        <Route path="/profile" element={<UserProfile />} />/
        <Route path="/restaurants-info" element={<RestaurantsInfo />} />
        <Route path="/restaurant-details/:id" element={<RestaurantDetails />} /> 
        <Route path="/restaurant/:id/menus" element={<RestaurantMenus />} />
        <Route path="/menus" element={<MenuListByRestaurant />} />

        <Route path="/map" element={<MapScreen/>} />
        <Route path="/driver/dashboard" element={<DriverDashboard/>} />
        <Route path="/driver/map" element={<DriverMapScreen/>} />
        {/* <Route path="/update-menu-item" element={<UpdateMenuItem />} /> */}


        <Route path="/menu-item/:menuItemId" element={<UpdateMenuItem />} /> 
        <Route path="/restaurant-admin-dashboard" element={<RestaurantAdminDashboard />} /> 


        <Route path="/customer-details" element={<CustomerDetails />} />
        <Route path="/driver-details" element={<DeliveryDriverDetails />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/driver/profile" element={<DriverProfilePage />} />
        <Route path="/driver/inactive" element={<DriverWaitingActivation />} />
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

        
        <Route path="/ResturentList" element={<ResturantListing />} />
      </Routes>
    </>
  );
};

export default App;
