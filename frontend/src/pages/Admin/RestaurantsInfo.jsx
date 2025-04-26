import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Link } from "react-router-dom";

const RestaurantInfo = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/get");
        setRestaurants(res.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

 
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const nameMatch = restaurant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const addressMatch = restaurant.address
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch = searchTerm.toLowerCase() === "open"
      ? restaurant.isOpen
      : searchTerm.toLowerCase() === "closed"
      ? !restaurant.isOpen
      : true;
    return (nameMatch || addressMatch) && statusMatch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center  text-[#FA5F55]">Restaurants</h2>

     
      <div className="my-6 flex justify-end">
        <input
          type="text"
          placeholder="Search by name, address, or status (open/closed)"
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-4"
          >
            {restaurant.image && (
              <img
                src={`http://localhost:5003/uploads/${restaurant.image}`}
                alt={restaurant.name}
                className="w-full sm:w-32 h-32 object-cover rounded"
              />
            )}

            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                <p className="text-gray-600">{restaurant.address}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      restaurant.isOpen
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {restaurant.isOpen ? "Open" : "Closed"}
                  </span>
                </p>
                <p>⭐ Rating: {restaurant.rating?.toFixed(1) || "0.0"}</p>
              </div>

              <Link
                to={`/restaurant/${restaurant._id}/menus`}
                className="mt-3 w-fit px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
              >
                View Menus
              </Link>
            </div>
          </div>
        ))}

        
        {filteredRestaurants.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center">
            No restaurants found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RestaurantInfo;
