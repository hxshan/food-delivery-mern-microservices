import React, { useState } from "react";

import RestaurantCard from "../../components/RestaurantCard";
import Navbar from "../../components/Navbar";

import { Search, ChevronDown, X } from "lucide-react";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

// Restaurant data
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
  {
    id: 7,
    name: "The Hungry Bear",
    address: "34 Forest Avenue, Wilderness",
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 8,
    name: "El Mariachi",
    address: "67 Spice Street, Cultural District",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1523145149804-5d8e0c044753?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 9,
    name: "Café Parisienne",
    address: "22 Eiffel Avenue, French Quarter",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1559329071-ee3e2de34548?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 10,
    name: "Smokey BBQ Shack",
    address: "45 Grill Lane, Smoketown",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1555992336-fb0d29498b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 11,
    name: "Thai Orchid",
    address: "31 Spice Boulevard, Asia Town",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 12,
    name: "Nonna's Kitchen",
    address: "19 Pasta Street, Little Italy",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
];

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`w-8 h-8 flex items-center justify-center rounded-full 
                    ${
                      currentPage === index + 1
                        ? "bg-[#EB4C40] text-white"
                        : "border border-gray-300 text-gray-700"
                    }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

const ResturantListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Food & Drink");

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    // Reset all filter states here
    console.log("Clearing all filters");
  };

  // Calculate total pages
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  // Get current page restaurants
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRestaurants = restaurants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="w-full bg-white p-6 rounded-lg shadow-sm">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="flex items-center w-full max-w-2xl mx-auto border border-gray-300 rounded-full overflow-hidden px-4 py-2">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Resturents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1 outline-none text-sm"
              />
              {searchQuery && (
                <button onClick={clearSearch}>
                  <X className="text-gray-400 w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              {/* Price Filter */}
              <div className="relative">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm">
                  <span>Price</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* When Filter */}
              <div className="relative">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm">
                  <span>When</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Time of day Filter */}
              <div className="relative">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm">
                  <span>Time of day</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Type Filter */}
              <div className="relative">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm">
                  <span>Type</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Persons Filter */}
              <div className="relative">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm">
                  <span>Persons</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Rating Filter */}
              <div className="relative">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm">
                  <span>Rating</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Language Filter */}
              <div className="relative">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm">
                  <span>Language</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm border ${
                activeCategory === "Art & Culture"
                  ? "bg-orange-50 border-orange-300 text-orange-700"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveCategory("Art & Culture")}
            >
              <span className="text-lg">🎨</span>
              <span>Art & Culture</span>
            </button>

            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm border ${
                activeCategory === "Entertainment"
                  ? "bg-orange-50 border-orange-300 text-orange-700"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveCategory("Entertainment")}
            >
              <span className="text-lg">🎭</span>
              <span>Entertainment</span>
            </button>

            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm border ${
                activeCategory === "Food & Drink"
                  ? "bg-orange-50 border-orange-300 text-orange-700"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveCategory("Food & Drink")}
            >
              <span className="text-lg">🍲</span>
              <span>Food & Drink</span>
            </button>

            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm border ${
                activeCategory === "Sightseeing"
                  ? "bg-orange-50 border-orange-300 text-orange-700"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveCategory("Sightseeing")}
            >
              <span className="text-lg">🏛️</span>
              <span>Sightseeing</span>
            </button>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <Link to={"/ResturentPage"}>
                <RestaurantCard restaurant={restaurant} />
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <Footer />
    </div>
  );
};

export default ResturantListing;
