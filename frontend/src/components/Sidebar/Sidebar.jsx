import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  List, 
  PlusCircle, 
  ShoppingBag, 
  Edit, 
  FileText, 
  Star, 
  Bookmark, 
  User, 
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get restaurant ID from localStorage
  const getRestaurantId = () => {
    return localStorage.getItem('restaurantId') || '';
  };
  
  // Navigation route mapping with dynamic restaurant ID
  const getRoutes = () => {
    const restaurantId = getRestaurantId();
    
    return {
      'Dashboard': '/restaurant-admin-dashboard',
      'Messages': '/messages',
      'Listings': '/listings',
      'Add listing': '/add-listing',
      'Orders Page': '/restaurant-admin-orders',
      'Edit Order': '/edit-order',
      'Invoice': '/invoice',
      'Reviews': '/reviews',
      'Bookmarks': '/bookmarks',
      'My Profile': '/profile',
      'Restaurant Details': `/restaurant-details/${restaurantId}`,
      'Components': '/components'
    };
  };
  
  // Determine active route based on current path
  const getActiveRoute = () => {
    const path = location.pathname;
    const routes = getRoutes();
    
    for (const [name, route] of Object.entries(routes)) {
      if (path === route || (route !== '/' && path.startsWith(route))) {
        return name;
      }
    }
    return 'Dashboard'; // Default
  };
  
  const activeItem = getActiveRoute();
  
  // Generic navigation handler
  const handleNavigation = (routeName) => {
    const routes = getRoutes();
    navigate(routes[routeName]);
  };
  
  // Special handler for Restaurant Details that includes restaurantId
  const handleRestaurantDetailsClick = () => {
    const restaurantId = getRestaurantId();
    
    if (restaurantId) {
      navigate(`/restaurant-details/${restaurantId}`);
    } else {
      console.error('No restaurant ID found in local storage');
      // Optional: Show user feedback or navigate to a fallback page
      // For example: navigate('/add-restaurant');
    }
  };
  
  return (
    <div className={`h-screen bg-white text-gray-700 flex flex-col border-r ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      {/* Logo */}
      <div className="p-4 flex items-center">
        <div className="flex items-center gap-2">
          <div className="rounded-full p-1">
            <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
          </div>
          {!collapsed && <span className="font-bold text-xl text-red-500">Food Order</span>}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4">
          <NavItem 
            icon={<Home />} 
            text="Dashboard" 
            active={activeItem === 'Dashboard'}
            onClick={() => handleNavigation('Dashboard')}
            collapsed={collapsed} 
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            text="Messages" 
            active={activeItem === 'Messages'}
            onClick={() => handleNavigation('Messages')}
            collapsed={collapsed} 
          />
          <NavItem 
            icon={<List size={20} />} 
            text="Listings" 
            active={activeItem === 'Listings'}
            onClick={() => handleNavigation('Listings')}
            collapsed={collapsed} 
            hasSubmenu 
          />
          <NavItem 
            icon={<PlusCircle size={20} />} 
            text="Add listing + Menu List" 
            active={activeItem === 'Add listing'}
            onClick={() => handleNavigation('Add listing')}
            collapsed={collapsed} 
          />
          <NavItem 
            icon={<ShoppingBag size={20} />} 
            text="Orders Page" 
            active={activeItem === 'Orders Page'}
            onClick={() => handleNavigation('Orders Page')}
            collapsed={collapsed} 
          />
          <NavItem 
            icon={<Edit size={20} />} 
            text="Edit Order" 
            active={activeItem === 'Edit Order'}
            onClick={() => handleNavigation('Edit Order')}
            collapsed={collapsed} 
          />
          <NavItem 
            icon={<FileText size={20} />} 
            text="Invoice" 
            active={activeItem === 'Invoice'}
            onClick={() => handleNavigation('Invoice')}
            collapsed={collapsed} 
          />
          <NavItem 
            icon={<Star size={20} />} 
            text="Reviews" 
            active={activeItem === 'Reviews'}
            onClick={() => handleNavigation('Reviews')}
            collapsed={collapsed} 
          />
          <NavItem 
            icon={<Bookmark size={20} />} 
            text="Bookmarks" 
            active={activeItem === 'Bookmarks'}
            onClick={() => handleNavigation('Bookmarks')}
            collapsed={collapsed} 
          />
          <NavItem 
            icon={<User size={20} />} 
            text="My Profile" 
            active={activeItem === 'My Profile'}
            onClick={() => handleNavigation('My Profile')}
            collapsed={collapsed} 
          />
          <NavItem 
            icon={<span className="text-yellow-600">🍔</span>} 
            text="Restaurant Details" 
            active={activeItem === 'Restaurant Details'}
            onClick={handleRestaurantDetailsClick}
            collapsed={collapsed} 
            multiline={true} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            text="Components" 
            active={activeItem === 'Components'}
            onClick={() => handleNavigation('Components')}
            collapsed={collapsed} 
            hasSubmenu 
          />
        </nav>
      </div>
      
      {/* Collapse Button */}
      <div className="p-4 flex justify-center">
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-full p-2"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, text, active, onClick, collapsed, hasSubmenu = false, multiline = false }) {
  return (
    <div 
      className={`flex items-center py-2 px-3 my-1 rounded-md cursor-pointer transition-colors duration-200
        ${active ? 'bg-red-100 text-red-500' : 'hover:bg-red-50 hover:text-red-500'}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className={active ? 'text-red-500' : ''}>{icon}</span>
        {!collapsed && (
          <span className={`ml-3 ${multiline ? "text-sm leading-tight" : ""}`}>
            {multiline ? (
              <div className="flex flex-col">
                {text.split(' ').map((word, index) => (
                  <span key={index}>{word}</span>
                ))}
              </div>
            ) : (
              text
            )}
          </span>
        )}
      </div>
      {!collapsed && hasSubmenu && (
        <div className="ml-auto">
          <ChevronRight size={16} />
        </div>
      )}
    </div>
  );
}