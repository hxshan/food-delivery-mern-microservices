"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

// Food categories data
const foodCategories = [
    {
      id: 1,
      name: "Pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 8,
    },
    {
      id: 2,
      name: "Burgers",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 12,
    },
    {
      id: 3,
      name: "Pasta",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 6,
    },
    {
      id: 4,
      name: "Sushi",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 9,
    },
    {
      id: 5,
      name: "Desserts",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 15,
    },
    {
      id: 6,
      name: "Salads",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 7,
    },
    {
      id: 7,
      name: "Drinks",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 10,
    },
    {
      id: 8,
      name: "Breakfast",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 11,
    },
  ];

const Slider = () => {
  const swiperRef = useRef(null);

  return (
    <div className="relative overflow-hidden px-4">
      <Swiper
        ref={swiperRef}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        modules={[Navigation]}
        className="mySwiper"
        slidesPerView="auto"
        spaceBetween={16}
      >
        {foodCategories.map((category) => (
          <SwiperSlide key={category.id} className="!w-[220px] md:!w-[250px]">
            <div className="relative group overflow-hidden rounded-lg transition-transform duration-300 ease-in-out hover:scale-105">
              
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              
              {/* Category name */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
              </div>
              
              {/* Clickable overlay */}
              <a 
                href={'/ResturentList'}
                className="absolute inset-0"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="custom-prev absolute left-1 md:-left-10 top-1/2 transform -translate-y-1/2 bg-[#EB4C40] p-2 rounded-full shadow-lg z-10 xl:ml-10 ml-5 md:ml-10">
        <ChevronLeft size={24} stroke="white" />
      </button>
      <button className="custom-next absolute right-1 md:-right-10 top-1/2 transform -translate-y-1/2 bg-[#EB4C40] p-2 rounded-full shadow-lg z-10 xl:mr-10 mr-5 md:mr-10">
        <ChevronRight size={24} stroke="white" />
      </button>
    </div>
  );
};

export default Slider;