import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';

const NavbarDriver = ({ page }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { logout } = useLogout();
  
    const handleLogout = () => {
    setIsDropdownOpen(false);
      logout();
    };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/driver/profile');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-[#EB4C40] p-4 text-white flex justify-between items-center relative">
      <span className="font-bold text-lg">{page}</span>
      
      <div className="flex items-center space-x-4">
        <span className="hidden sm:inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-green-500">
          Online
        </span>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
              <span className="hidden sm:inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-black font-bold">
                H
              </span>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button
                onClick={handleProfileClick}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarDriver;