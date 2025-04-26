import React, { useEffect, useState } from 'react';
import { api } from "../../services/api";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState([]);
  const hardcodeId = "6807a1957197e3db9f0ec50b";
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleAvailability = async (id, isOpen) => {
    setRestaurant(prev => ({
      ...prev,
      isOpen: !isOpen
    }));
    const updated = await api.put(`/${hardcodeId}/availability`, { isOpen: !isOpen });
    setRestaurant(restaurant.map(r => (r._id === id ? updated.data.restaurant : r)));
  };

  const handleUpdateMenuItem = (menuItemId) => {
    navigate(`/menu-item/${menuItemId}`);
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this menu item?");
      if (!confirmDelete) return;

      const response = await api.delete(`delete-menu/${menuItemId}`);
      console.log(response);

      if (response.data.message) {
        toast.success(response.data.message);

        const res = await api.get(`/get/${hardcodeId}`);
        setRestaurant(res.data.restaurant || res.data);
      }
    } catch (error) {
      console.error("Failed to delete menu item", error);
      toast.error(error.response?.data?.error || "Failed to delete menu item");
    }
  };

  const handleAddMenu = () => {
    navigate(`/add-menu/${restaurant._id}`);
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/get/${hardcodeId}`);
        setRestaurant(res.data.restaurant || res.data);
        console.log("Restaurant data:", res.data);
        console.log("Menu items:", res.data.restaurant?.menuItems || res.data.menuItems);
      } catch (error) {
        console.error("Failed to fetch restaurant", error);
        toast.error("Failed to load restaurant data");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [hardcodeId]);

  if (loading) {
    return <div className="p-6 text-center">Loading restaurant...</div>;
  }

  if (!restaurant) {
    return <div className="p-6 text-center">Loading restaurant...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6 rounded flex flex-col md:flex-row gap-5">
        <div className="md:w-1/3">
          {restaurant.image && (
            <img
              src={`http://localhost:5003/uploads/${restaurant.image}`}
              alt="Restaurant"
              className="mt-4 w-full max-h-40 object-cover rounded"
            />
          )}
        </div>
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
          <p className="text-gray-600">{restaurant.address}</p>
          <p className="mt-1 text-sm">
            Status:{' '}
            <span className={restaurant.isOpen ? "text-green-600" : "text-red-600"}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
          </p>
          <p>⭐ Rating: {restaurant.rating}</p>
          <div className="flex gap-3 mt-4">
            <button
              className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white rounded"
              onClick={() => toggleAvailability(restaurant._id, restaurant.isOpen)}
            >
              Set {restaurant.isOpen ? 'Closed' : 'Open'}
            </button>
            <button
              className="mt-2 px-3 py-1 bg-green-500 hover:bg-green-700 text-white rounded"
              onClick={handleAddMenu}
            >
              Add Menu
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Menu Items</h3>
        {restaurant.menuItems && restaurant.menuItems.length > 0 ? (
          <ul className="space-y-4">
            {restaurant.menuItems.map((item, index) => (
              <li key={item._id || `menu-item-${index}`} className="p-4 rounded bg-white shadow flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex-1">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-md text-gray-600">{item.description}</p>
                  <p className="text-md text-gray-600">{item.category}</p>
                  <p className="text-md">$ {item.price}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleUpdateMenuItem(item._id)}
                      className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item._id)}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {item.image && (
                  <img
                    src={`http://localhost:5003/uploads/${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded mt-4 sm:mt-0"
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No menu items added yet.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
