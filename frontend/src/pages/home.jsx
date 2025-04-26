// Home.jsx
import React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";

import TempImage from "../assets/Images/temp_restaurant_image.jpg";
import Slider from "../components/Slider";
import Footer from "../components/Footer";

import deliveyRiderImg from '../assets/Images/delivey rider image.jpg'
import restuarentOwnerImage from "../assets/Images/restuarent owner image.jpg"

const Home = () => {
  // Sample data for categories
 

  // Sample data for restaurants
  const restaurants = [
    {
      id: 1,
      name: "Maple & Thyme",
      address: "42 Harbor Street, Marina Bay",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "Olive Garden",
      address: "78 Sunflower Avenue, Downtown",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      name: "The Rustic Table",
      address: "23 Mountain View Road",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      name: "Seaside Bistro",
      address: "12 Beach Drive, Coastal District",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 5,
      name: "Urban Plate",
      address: "56 City Center Street",
      rating: 4.4,
      image:
        "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 6,
      name: "Sakura Japanese",
      address: "89 Cherry Blossom Lane",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section with Search */}
      <div className="relative w-full h-[60vh] bg-gray-200">
        <div className="absolute inset-0 w-full">
          <img
            src={TempImage}
            alt="Image"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center flex-col p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-md">
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 rounded-md shadow-md "
            />
            <button className="absolute right-2 top-2 bg-[#EB4C40] text-white px-3 py-1 rounded-md">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Popular Categories
        </h2>

        <div className="relative">
          <Slider />
          {/* <div className="flex overflow-x-auto space-x-4 pb-4">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div> */}

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
          <h2 className="text-2xl font-semibold text-gray-800">
            Top Rated Restaurants
          </h2>
          <a href="/ResturentList" className="text-[#EB4C40] text-sm">
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Want to Join Partnership?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Courier Card */}
            <div className="rounded-lg overflow-hidden border-2 border-amber-500 relative">
              <div className="h-80 relative">
                <img
                  src={deliveyRiderImg}
                  alt="Delivery courier on motorcycle"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Join As Rider
                  </h3>
                  <button className="bg-[#EB4C40] hover:bg-[#FF6A5E] text-white px-6 py-3 rounded font-medium transition-colors">
                    LEARN MORE
                  </button>
                </div>
              </div>
            </div>

            {/* Merchant Card */}
            <div className="rounded-lg overflow-hidden border-2 border-amber-500 relative">
              <div className="h-80 relative">
                <img
                  src={restuarentOwnerImage}
                  alt="Restaurant merchant team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Join As Merchant
                  </h3>
                  <button className="bg-[#EB4C40] hover:bg-[#FF6A5E] text-white px-6 py-3 rounded font-medium transition-colors">
                    LEARN MORE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;