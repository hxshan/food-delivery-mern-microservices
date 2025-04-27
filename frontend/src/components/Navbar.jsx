import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm z-100">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-red-500">FoodDelivery</Link>
        <div className="space-x-4">
          <Link to="/loginSelection" className="text-gray-600 hover:text-red-500">Sign In</Link>
          <Link to="/registrationSelection" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;