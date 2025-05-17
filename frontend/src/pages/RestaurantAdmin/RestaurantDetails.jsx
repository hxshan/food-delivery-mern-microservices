import React, { useEffect, useState } from 'react';
import { restaurantApi } from "../../services/restaurantApi";
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from "../../components/Sidebar/Sidebar";


const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleAvailability = async (id, isOpen) => {
    setRestaurant(prev => ({
      ...prev,
      isOpen: !isOpen
    }));
    const updated = await restaurantApi.put(`/${id}/availability`, { isOpen: !isOpen });
    setRestaurant(restaurant.map(r => (r._id === id ? updated.data.restaurant : r)));
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this menu item?");
      if (!confirmDelete) return;

      const response = await restaurantApi.delete(`delete-menu/${menuItemId}`);
      console.log(response);

      if (response.data.message) {
        toast.success(response.data.message);
        const res = await restaurantApi.get(`/get/${id}`);
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
        console.log("Fetching restaurant with ID:", id); 
        if (!id) {
          throw new Error("No restaurant ID provided")
        }
        const res = await restaurantApi.get(`/get/${id}`);
        setRestaurant(res.data.restaurant || res.data);
        console.log("Restaurant data:", res.data);
      } catch (error) {
        console.error("Failed to fetch restaurant", error);
        toast.error("Failed to load restaurant data");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading restaurant...</div>;
  }

  if (!restaurant) {
    return <div className="p-6 text-center">Restaurant not found</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar/>
      <div className="flex-1 p-8 h-screen overflow-scroll">
        {/* Restaurant Image and Details Row */}
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          
          {/* Image Section */}
          <div className="md:w-1/3">
            {restaurant.image && (
              <img
                // src={`http://localhost:5003/uploads/${restaurant.image}`}
                alt="Restaurant"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            )}
          </div>
          
          {/* Details Section */}
          <div className="md:w-2/3 bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-red-500">{restaurant.name}</h2>
            <div className="space-y-1">
              <p className="text-gray-700">
                <span className="font-semibold">Address:</span> {restaurant.address}
              </p>
              
              <p className="text-gray-700">
                <span className="font-semibold">Status:</span>{' '}
                <span className={restaurant.isOpen ? "text-green-600" : "text-red-600"}>
                  {restaurant.isOpen ? 'Open' : 'Closed'}
                </span>
              </p>
              
              <p className="text-gray-700">
                <span className="font-semibold">Rating:</span> ⭐ {restaurant.rating || 'Not rated yet'}
              </p>

              
              {restaurant.phoneNumbers && restaurant.phoneNumbers.length > 0 && (
                <p className="text-gray-700">
                  <span className="font-semibold">Phone:</span> {restaurant.phoneNumbers.join(', ')}
                </p>)
                
                }
              
              <div className="flex gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                  onClick={() => toggleAvailability(restaurant._id, restaurant.isOpen)}
                >
                  Set {restaurant.isOpen ? 'Closed' : 'Open'}
                </button>
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                  onClick={handleAddMenu}
                >
                  Add Menu Item
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-red-500">Menu Items</h3>
            {restaurant.menuItems && restaurant.menuItems.length > 0 && (
              <span className="text-gray-500">
                {restaurant.menuItems.length} items
              </span>
            )}
          </div>
          
          {restaurant.menuItems && restaurant.menuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.menuItems.map((item, index) => (
                <div 
                  key={item._id || `menu-item-${index}`} 
                  className="shadow rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  {item.image && (
                    <img
                      // src={`http://localhost:5003/uploads/${item.image}`}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="font-bold text-2xl text-red-500">${item.price}</p>
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {item.category}
                      </span>
                      {item.size && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {item.size}
                        </span>
                      )}
                    </div>
                  
                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/menu-item/${item._id}`}
                        state={{ restaurantId: restaurant._id }}
                        className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDeleteMenuItem(item._id)}
                        className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No menu items added yet.</p>
              {/* <button
                onClick={handleAddMenu}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Add Your First Menu Item
              </button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;