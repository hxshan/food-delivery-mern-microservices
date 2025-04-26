import React from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate to another page (e.g., Add Restaurant form)

const RestaurantAdminDashboard = () => {
  const navigate = useNavigate();

  const handleAddRestaurant = () => {
    
    navigate('/add-restaurant');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
      <h1 className="text-3xl font-bold mb-6 text-[#FA5F55]">Welcome to your Restaurant Dashboard</h1>
      <button
        onClick={handleAddRestaurant}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
      >
        Add Restaurant
      </button>
    </div>
  </div>
  );
};

export default RestaurantAdminDashboard;
