import React from 'react';
import { Star } from 'lucide-react';

import tempImage from '../assets/Images/temp_kotttu.jpg'

const RestaurantCard = ({ restaurant }) => {

  return (
    <div className="relative rounded overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
    <img 
      src={restaurant.image || tempImage} 
      alt={restaurant.name} 
      className="w-full h-48 object-cover"
      onError={(e) => {
        e.target.src = {tempImage}
      }}
    />
    <div className="absolute top-2 right-2 flex space-x-2">
      <button className="bg-white text-xs font-medium py-1 px-2 rounded shadow flex items-center">
        <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span>{restaurant.rating}</span>
      </button>

       </div>
       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
         <h3 className="text-white font-bold text-lg">{restaurant.name}</h3>
         <p className="text-white/80 text-sm">{restaurant.address}</p>
       </div>
       <div className="absolute top-2 left-2">
         <button className="bg-white p-1 rounded-full">
           <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
           </svg>
         </button>
      </div>
    </div>
  );
};

export default RestaurantCard;