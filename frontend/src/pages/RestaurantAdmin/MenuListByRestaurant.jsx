import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from "../../services/api";

const MenuListByRestaurant = () => {
  const { id } = useParams(); 
  //const hardcodeId ="68060ba9d924f2d7597e5053";
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get(`/${id}`);
        setRestaurant(res.data);
      } catch (err) {
        console.error('Error fetching menu list', err);
      }
    };

    fetchMenu();
  }, [id]);

  if (!restaurant) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Menu for {restaurant.name}</h2>
      {restaurant.menuItems?.length > 0 ? (
        <ul className="space-y-3">
          {restaurant.menuItems.map((item) => (
            <li
              key={item.id}
              className="p-4 border rounded bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-sm text-gray-700">${item.price}</p>
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
        <p className="text-gray-500">No menu items available.</p>
      )}
    </div>
  );
};

export default MenuListByRestaurant;

