import React, { useState, useEffect } from "react";
import RestaurantCard from "../../components/RestaurantCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";

// Import the JSON data
import restaurantData from "../Customer/restuarent.json";

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

const RestaurantListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Food & Drink");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  // Initialize restaurants data from JSON
  useEffect(() => {
    if (restaurantData && restaurantData.restaurants) {
      setRestaurants(restaurantData.restaurants);
      setFilteredRestaurants(restaurantData.restaurants);
    }
  }, []);

  // Filter restaurants when search query changes
  useEffect(() => {
    if (restaurants.length > 0) {
      const filtered = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchQuery, restaurants]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("Food & Drink");
    setFilteredRestaurants(restaurants);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  // Get current page restaurants
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(
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
                placeholder="Search Restaurants..."
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

              {/* Rating Filter */}
              <div className="relative">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm">
                  <span>Rating</span>
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
          {restaurants.length === 0 ? (
            <div className="col-span-3 text-center py-10">Loading restaurants...</div>
          ) : currentRestaurants.length === 0 ? (
            <div className="col-span-3 text-center py-10">No restaurants found matching your search criteria.</div>
          ) : (
            currentRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <Link to={`/restaurant/${restaurant._id}`}>
                  <RestaurantCard restaurant={restaurant} />
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredRestaurants.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantListing;