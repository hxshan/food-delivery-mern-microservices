import React from "react";
import { assets } from "../../assets/assets";

const AddRestaurant = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-4 p-6 md:p-8 bg-white rounded-lg md:ml-36">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-[#FA5F55]">
          Add Restaurant Details
        </h2>
        <form className="space-y-4">

          <div className="flex flex-col mb-4">
            <p className="font-medium mb-2">Upload Image</p>
            <label
              htmlFor="image"
              className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#FA5F55] rounded-lg p-4 bg-white transition-colors"
            >
              <img
                src={assets.upload_area}
                alt="Upload area"
                className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto"
              />

              <p className="text-gray-500 text-sm text-center mt-2">
                Click to select an image
              </p>
            </label>
            <input type="file" id="image" className="hidden" required />
          </div>
          
          <div>
            <input
              name="name"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#FA5F55] focus:border-transparent transition"
              required
            />
          </div>
          
          <div>
            <input
              name="address"
              placeholder="Address"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#FA5F55] focus:border-transparent transition"
              required
            />
          </div>
         
          <div className="flex items-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isOpen"
                  className="sr-only"
                />
                <div
                  className={`w-10 h-6 rounded-full shadow-inner transition`}
                ></div>
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform`}
                ></div>
              </div>
              <span className="text-gray-700 font-medium">Currently Open</span>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#FA5F55] hover:bg-[#e04b42] text-white font-bold py-2 md:py-3 px-4 rounded-lg transition duration-300"
          >
            Add Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;