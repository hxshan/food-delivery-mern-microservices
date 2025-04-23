import React from "react";
import Navbar from "../../components/Navbar";

import TempImage from "../../assets/Images/temp_restaurant_image.jpg";
import MenuItemCard from "../../components/MenuItemCard";
import Cart from "../../components/Cart";

const menuItems = [
    {
      name: "Margherita Pizza",
      price: 1299,
      description: "Classic pizza with fresh tomatoes, mozzarella, and basil.",
      image: "https://images.unsplash.com/photo-1601924928352-5a4c2e4f8b05",
    },
    {
      name: "Grilled Salmon",
      price: 185,
      description: "Perfectly grilled salmon served with roasted veggies.",
      image: "https://images.unsplash.com/photo-1585238341986-71a3b3a7b20d",
    },
    {
      name: "Caesar Salad",
      price: 925,
      description:
        "Crisp romaine lettuce with creamy Caesar dressing and croutons.",
      image: "https://images.unsplash.com/photo-1572441710531-4b2a9c2aa0c7",
    },
    {
      name: "Beef Burger",
      price: 140,
      description:
        "Juicy beef patty with cheddar, lettuce, tomato, and pickles.",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    },
    {
      name: "Spaghetti Carbonara",
      price: 1375,
      description:
        "Traditional Italian pasta with eggs, cheese, pancetta, and pepper.",
      image: "https://images.unsplash.com/photo-1613145991034-0f4d3d6fdd45",
    },
  ];

const ResturentPage = () => {
  return (
    <div>
      <Navbar />

      <div className="relative h-screen p-10 overflow-hidden">
        <div className="absolute inset-0 w-full">
          <img
            src={TempImage}
            alt="Image"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-transparent"></div>
        </div>
        <div className="relative text-white flex flex-col w-full h-full gap-5 pb-15 md:pl-10 md:gap-0 justify-end items-start md:w-3/4  lg:w-1/2">
          {/* Rating Badge */}
          <div>
            <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded">
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold">8.9</span>
            </div>
            <div className="text-white text-sm">350 Reviews</div>
          </div>

          <h1 className=" text-[50px] font-bold ">Hilton Colombo</h1>
          <div className="flex gap-5">
            <p className=" text-[20px] font-semibold ">Chinese</p>
            <p className=" text-[20px] font-semibold ">Colombo</p>
          </div>
        </div>
      </div>

      <div className="p-10 w-full lg:flex gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
          {menuItems.map((item, index) => (
            <MenuItemCard key={index} menuItem={item} />
          ))}
        </div>

        <Cart />
      </div>
    </div>
  );
};

export default ResturentPage;
