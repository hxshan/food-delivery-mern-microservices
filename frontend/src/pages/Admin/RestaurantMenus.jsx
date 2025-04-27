import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantApi } from "../../services/restaurantApi";

const RestaurantMenus = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMenus = async () => {
      const res = await restaurantApi.get(`/get/${id}`);
      setRestaurant(res.data);
    };
    fetchMenus();
  }, [id]);

  if (!restaurant) return <div className="p-6">Loading...</div>;

  const filteredMenus = restaurant.menuItems?.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
    
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-center text-[#FA5F55] sm:text-left mb-4 sm:mb-0">
          Menus for {restaurant.name}
        </h2>

        <input
          type="text"
          placeholder="Search by name or category"
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMenus?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredMenus.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded shadow flex gap-4 items-center"
            >
              {item.image && (
                <img
                  src={`http://localhost:5003/uploads/${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <h3 className="font-sm  text-gray-600">{item.description}</h3>
                <p className="text-sm  text-gray-600 ">{item.category}</p>
                <p className="text-sm font-semibold">$ {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No menu items found.</p>
      )}
    </div>
  );
};

export default RestaurantMenus;
