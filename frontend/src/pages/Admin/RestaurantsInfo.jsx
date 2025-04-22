import React, { useEffect, useState } from 'react';
import { api } from "../../services/api";

const RestaurantInfo = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    api.get('/get').then(res => setRestaurants(res.data));
  }, []);

  const toggleAvailability = async (id, isOpen) => {
    const updated = await api.put(`/${id}/availability`, { isOpen: !isOpen });
    setRestaurants(restaurants.map(r => (r._id === id ? updated.data.restaurant : r)));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Restaurant Info</h2>
      {restaurants.map((r) => (
        <div key={r._id} className="border p-4 rounded mb-4 bg-gray-50">
          <h3 className="text-xl font-semibold">{r.name}</h3>
          <p>{r.address}</p>
          <p>Status: <span className={r.isOpen ? "text-green-600" : "text-red-600"}>
            {r.isOpen ? 'Open' : 'Closed'}</span></p>
          <button
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => toggleAvailability(r._id, r.isOpen)}
          >
            Set {r.isOpen ? 'Closed' : 'Open'}
          </button>

          {r.menuItems?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Menu Items:</h4>
              <ul className="list-disc list-inside">
                {r.menuItems.map(item => (
                  <li key={item._id}>{item.name} – Rs.{item.price}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RestaurantInfo;
