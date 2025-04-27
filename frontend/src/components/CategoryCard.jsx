import React from 'react';

const CategoryCard = ({ category }) => {
  return (
    <div className="flex-shrink-0 w-32">
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name} 
          className="w-full h-24 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '';
          }}
        />
        <div className="p-2 bg-white bg-opacity-80 text-center">
          <h3 className="font-medium text-gray-800">{category.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
