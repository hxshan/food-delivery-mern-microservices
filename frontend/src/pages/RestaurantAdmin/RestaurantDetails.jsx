import React, { useEffect, useState } from 'react';
//import { useParams } from 'react-router-dom';
import { api } from "../../services/api";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState([]);
  const hardcodeId ="6807a1957197e3db9f0ec50b";
  //const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


   const toggleAvailability = async (id, isOpen) => {
      const updated = await api.put(`/${hardcodeId}/availability`, { isOpen: !isOpen });
      setRestaurant(restaurant.map(r => (r._id === id ? updated.data.restaurant : r)));
    };

    const handleUpdateMenuItem = (menuItemId) => {
      navigate(`/update-menu-item/${menuItemId}`);
    };

    
  

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/get/${hardcodeId}`);
        // Handle both response structures:
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
      <div className="bg-white p-6 rounded flex gap-5">
        <div>
        <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
        <p className="text-gray-600">{restaurant.address}</p>
        <p className="mt-1 text-sm">
          Status:{' '}
          <span className={restaurant.isOpen ? "text-green-600" : "text-red-600"}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </span>
        </p>
        <button
            className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
            onClick={() => toggleAvailability(restaurant.hardcodeId, restaurant.isOpen)}
          >
            Set {restaurant.isOpen ? 'Closed' : 'Open'}
          </button>
        </div>
        <div>
        {restaurant.image && (
          <img
            src={`http://localhost:3001/uploads/${restaurant.image}`}
            alt="Restaurant"
            className="mt-4 w-full max-h-40 object-cover rounded"
          />
        )}
      </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Menu Items</h3>
        {restaurant.menuItems && restaurant.menuItems.length > 0 ? (
          <ul className="space-y-4">
            {restaurant.menuItems.map((item,index) => (
              <li key={item._id || `menu-item-${index}`} className="p-4 rounded bg-white shadow flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-sm">$. {item.price}</p>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleUpdateMenuItem(item._id)}
                      className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {item.image && (
                  <img
                    src={`http://localhost:3001/uploads/${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
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