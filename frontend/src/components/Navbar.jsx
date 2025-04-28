import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm z-100 px-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-red-500">
          FoodDelivery
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center space-x-20">
            <Link
              to="/"
              className="text-gray-500 font-medium hover:text-[#EB4C40] transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-red-500"
            >
              Home
            </Link>
            <Link
              to="/resturentlist"
              className="text-gray-500 font-medium hover:text-red-500 transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-red-500"
            >
              Restaurant
            </Link>
            <Link
              to="#"
              className="text-gray-500 font-medium hover:text-red-500 transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-red-500"
            >
              Offers
            </Link>

            <Link to={"/profile"} className="flex items-center">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-red-500 transition-all duration-200">
                <span className="text-gray-500 font-medium">JD</span>
              </div>
            </Link>
          </div>
        ) : (
          
        <div className="space-x-4">
            {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hi, {user.name || 'User'}</span>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
              to="/loginSelection"
              className="text-gray-600 hover:text-red-500"
            >
              Sign In
            </Link>
                <Link
              to="/registrationSelection"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Sign Up
            </Link>
              </>
          )}
        </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
