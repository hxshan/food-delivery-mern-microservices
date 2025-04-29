import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import NewOrders from "../../components/Restaurent/NewOrder";
import ConfirmedOrders from "../../components/Restaurent/ConfirmedOrder";
import { AuthContext } from "../../context/AuthContext";

function RestaurentAdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Chinese Pizza", price: 159.0, quantity: 1 },
    { id: 2, name: "Fish Burger", price: 103.5, quantity: 2 },
    { id: 3, name: "Meat Burger", price: 103.5, quantity: 1 },
    { id: 4, name: "Italian Pizza", price: 150.0, quantity: 2 },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
 
  const handleRestaurantDetailsClick = () => {
    const restaurantId = localStorage.getItem('restaurantId');
    
    if (restaurantId) {
      setActiveItem("Restaurant Details");
      navigate(`/restaurant-details/${restaurantId}`);
    } else {
      console.error('No restaurant ID found in local storage');
    }
  };
  
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Restaurant Owner Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 rounded-md bg-gray-100 w-64 hover:border-red-500"
              />
              <span className="absolute right-3 top-2.5">🔍</span>
            </div>
            <button className="p-2">🔔</button>
            <button className="p-2">✉️</button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-xs font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex p-4 gap-4">
          {/* Left side content */}
          <div className="flex-1">
            {/* Hero banner */}
            <div className="bg-red-500 rounded-lg p-6 mb-6 flex justify-between overflow-hidden relative">
              <div className="w-1/2">
                <p className="text-white font-bold text-3xl">Welcome </p>
               
                <p className="text-white text-2xl mb-6 ">
                  Manage your restaurant efficiently
                </p>
              </div>
            {/* image */}
            </div>

            {/* Recent orders */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Recent Orders</h3>
                <button className="text-red-500 text-sm">See All</button>
              </div>
              <NewOrders />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurentAdminDashboard;