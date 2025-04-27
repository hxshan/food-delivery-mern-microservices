import React from 'react';
import { Star } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
      <div className="w-1/3">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '';
          }}
        />
      </div>
      <div className="w-2/3 p-4">
        <div className="text-xs text-gray-500 mb-1">Delivery</div>
        <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{restaurant.address}</p>
        <div className="flex items-center">
          <div className="flex items-center bg-red-500 text-white text-xs px-2 py-1 rounded">
            <Star size={12} className="mr-1" />
            <span>{restaurant.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;