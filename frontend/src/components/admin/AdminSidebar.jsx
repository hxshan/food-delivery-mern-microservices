import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Coffee, 
  Truck, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Overview', path: '/admin/overview', icon: <Home size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Restaurants', path: '/admin/restaurants', icon: <Coffee size={20} /> },
    { name: 'Drivers', path: '/admin/drivers', icon: <Truck size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg
                    transform transition-transform duration-300 ease-in-out md:translate-x-0`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold text-red-500">Admin Panel</h1>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 pt-4 border-t">
          <button className="flex items-center px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-100 rounded-lg">
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;