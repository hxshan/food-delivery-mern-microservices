import React from "react";

import TempKottu from "../assets/Images/temp_kotttu.jpg";


const MenuItemCard = ( {menuItem} ) => {
  return (
    <div className="w-full h-[150px] flex justify-between items-center border border-gray-200 px-5 py-4 cursor-pointer rounded-lg transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:bg-gray-50 group">
      <div className="transition-all duration-300 group-hover:transform group-hover:translate-x-2">
        <p className="text-[25px] font-semibold text-gray-800 group-hover:text-gray-900">
          {menuItem.name}
        </p>
        <p className="text-[15px] text-gray-600 group-hover:text-gray-700">
        {menuItem.description}
        </p>
        <p className="text-[18px] font-medium text-gray-700 mt-2 group-hover:text-[#EB4C40]">
        Rs. {menuItem.price}
        </p>
      </div>
      <div className="w-1/4 h-full overflow-hidden rounded-lg">
        <img
          src={menuItem.image}
          alt="Dish Image"
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
};

export default MenuItemCard;
