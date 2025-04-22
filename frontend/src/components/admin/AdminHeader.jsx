import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const AdminHeader = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100 md:hidden"
        >
          <Menu size={24} />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-800 md:hidden">
          Admin Panel
        </h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="hidden md:block text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;