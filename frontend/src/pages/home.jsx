// Home.jsx
import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  // Sample data for categories
  const categories = [
    { id: 1, name: 'Pizza', image: '/images/pizza.jpg' },
    { id: 2, name: 'Pizza', image: '/images/pizza.jpg' },
    { id: 3, name: 'Pizza', image: '/images/pizza.jpg' },
    { id: 4, name: 'Pizza', image: '/images/pizza.jpg' },
  ];

  // Sample data for restaurants
  const restaurants = [
    { id: 1, name: 'Restaurant Name', address: 'Address', rating: 4.5, image: '/images/restaurant.jpg' },
    { id: 2, name: 'Restaurant Name', address: 'Address', rating: 4.5, image: '/images/restaurant.jpg' },
    { id: 3, name: 'Restaurant Name', address: 'Address', rating: 4.5, image: '/images/restaurant.jpg' },
    { id: 4, name: 'Restaurant Name', address: 'Address', rating: 4.5, image: '/images/restaurant.jpg' },
    { id: 5, name: 'Restaurant Name', address: 'Address', rating: 4.5, image: '/images/restaurant.jpg' },
    { id: 6, name: 'Restaurant Name', address: 'Address', rating: 4.5, image: '/images/restaurant.jpg' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
    
      
      {/* Hero Section with Search */}
      <div className="relative w-full h-64 bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center flex-col p-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 rounded-md shadow-md border border-gray-200"
            />
            <button className="absolute right-2 top-2 bg-red-500 text-white px-3 py-1 rounded-md">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Popular Categories</h2>
        
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronLeft size={20} />
          </button>
          
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Top Rated Restaurants */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Top Rated Restaurants</h2>
          <a href="#" className="text-red-500 text-sm">View All</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-500 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Thank you for letting us deliver your favorites.</h3>
              <p>We're proud to bring food faster to your doorstep.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <ul>
                <li className="mb-2"><a href="#" className="hover:underline">About Company</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Restaurant Signup</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Get Help</h3>
              <ul>
                <li className="mb-2"><a href="#" className="hover:underline">FAQ</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Terms and Conditions</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul>
                <li className="mb-2"><a href="#" className="hover:underline">Email</a></li>
                <li className="mb-2"><a href="#" className="hover:underline">Phone</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm">
            <p>© 2025 Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;