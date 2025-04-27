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
    <nav className="bg-white shadow-sm z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-red-500">FoodDelivery</Link>
        
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
              <Link to="/loginSelection" className="text-gray-600 hover:text-red-500">Sign In</Link>
              <Link to="/registrationSelection" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;