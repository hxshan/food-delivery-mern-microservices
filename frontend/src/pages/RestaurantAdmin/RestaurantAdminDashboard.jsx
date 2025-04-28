import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import NewOrders from "../../components/Restaurent/NewOrder";

function RestaurentAdminDashboard() {
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
          <div className="flex items-center gap-4 ">
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
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <div>
                <p className="text-xs font-semibold">Wade Warren</p>
                <p className="text-xs text-gray-500">user@example.com</p>
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
                <p className="text-white text-sm">Welcome</p>
                <h2 className="text-white text-3xl font-bold mb-2">
                 
                </h2>
                <p className="text-white text-sm mb-6">
                  
                </p>
              </div>
              <img
             
              />
            </div>

            {/* Categories */}
            {/* <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Explore Category</h3>
                <button className="text-red-500 text-sm">See All</button>
              </div>
              <div className="grid grid-cols-6 gap-4">
                <CategoryCard icon="🔥" title="Popular" color="bg-yellow-500" />
                <CategoryCard
                  icon="🚗"
                  title="Fast Delivery"
                  color="bg-pink-500"
                />
                <CategoryCard icon="🍽️" title="Dine In" color="bg-orange-500" />
                <CategoryCard
                  icon="💎"
                  title="High Class"
                  color="bg-blue-500"
                />
                <CategoryCard icon="📍" title="Nearest" color="bg-green-500" />
                <CategoryCard icon="🚖" title="Pick up" color="bg-purple-500" />
              </div>
            </div> */}

         

            {/* Recent orders */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Recent Order</h3>
                <button className="text-red-500 text-sm">See All</button>

                
              </div>
              <NewOrders />
            </div>
          </div>

          {/* Right sidebar (cart) */}
          {/* <div className="w-72 bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-4"></h3>

            <div className="bg-red-500 rounded-lg p-4 mb-6 text-white">
              <p className="text-sm mb-1"></p>
              <p className="text-2xl font-bold mb-4"></p>
              <div className="flex justify-between">
                <button className="bg-white text-red-500 rounded-lg px-4 py-1 text-sm flex items-center gap-1">
                  <span></span>
                </button>
                <button className="bg-white text-red-500 rounded-lg px-4 py-1 text-sm">
             
                </button>
              </div>
            </div>

            <h3 className="font-semibold mb-4">My Order</h3>
            

            

            <div className="mt-8 text-center">
              <button className="bg-red-500 text-white rounded-lg py-3 px-6 font-medium w-full">
              
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

// Component for sidebar items
function SidebarItem({ icon, text, active, onClick }) {
  return (
    <div 
      className={`p-3 my-1 flex items-center gap-3 rounded-lg cursor-pointer ${
        active ? 'bg-red-100 text-red-500' : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span className={active ? 'font-medium' : ''}>{text}</span>
    </div>
  );
}

// Component for category cards
function CategoryCard({ icon, title, color }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-16 h-16 ${color} rounded-lg flex items-center justify-center text-white text-2xl mb-2`}
      >
        <span>{icon}</span>
      </div>
      <p className="text-xs text-center">{title}</p>
      <p className="text-xs text-gray-400">100+ places</p>
    </div>
  );
}

// Component for dish cards
function DishCard({ title, price, rating, time, discount }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      {discount && (
        <div className="bg-res-500 text-white text-xs font-medium px-2 py-1 absolute">
          {discount}% Off
        </div>
      )}
      <div className="relative h-32 bg-gray-200">
        <img
          src="/api/placeholder/200/150"
          alt={title}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-gray-400">♡</span>
        </button>
      </div>
      <div className="p-3">
        <h4 className="font-medium text-sm mb-1">{title}</h4>
        <p className="font-bold mb-2">${price.toFixed(2)}</p>
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1">
            <span className="text-red-500">★</span>
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{time}</span>
          </div>
          <button className="bg-red-500 text-white rounded-md px-2 py-1">
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// Component for cart items
function CartItem({ name, price, quantity, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src="/api/placeholder/50/50"
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{name}</h4>
        <p className="text-red-500 font-medium">${price.toFixed(2)}</p>
        <p className="text-xs text-gray-500">x{quantity}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md"
        >
          -
        </button>
        <span className="text-sm">{quantity}</span>
        <button
          onClick={onIncrease}
          className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default RestaurentAdminDashboard;
