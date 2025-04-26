import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { restaurantApi } from "../../services/restaurantApi";

const AddRestaurant = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [data, setData] = useState({ 
    name: '', 
    address: '', 
    isOpen: false,
    
   
  });

  const onChangeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

   
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("isOpen", data.isOpen);
    formData.append("image", image);

    


    const response = await restaurantApi.post('/add', formData);
    console.log(response);
    
    if (response.data.success) {
      setData({
        name: "",
        address: "",
        isOpen: false,
      
      });
      setImage(false);
      toast.success(response.data.message);
      navigate('/restaurant-details'); 
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-4 p-6 md:p-8 bg-white rounded-lg md:ml-36">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-[#FA5F55]">
            Add Restaurant Details
          </h2>

          <form className="space-y-4" onSubmit={onSubmitHandler}>

            
            <div className="flex flex-col mb-4">
              <p className="font-medium mb-2">Upload Image</p>
              <label
                htmlFor="image"
                className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#FA5F55] rounded-lg p-4 bg-white transition-colors"
              >
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="Upload area"
                  className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto"
                />
                <p className="text-gray-500 text-sm text-center mt-2">
                  Click to select an image
                </p>
              </label>
              <input 
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
                required 
              />
            </div>

        
            <div>
              <input
                onChange={onChangeHandler}
                value={data.name}
                name="name"
                placeholder="Restaurant Name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#FA5F55] focus:border-transparent transition"
                required
              />
            </div>

           
            <div>
              <input
                onChange={onChangeHandler}
                value={data.address}
                name="address"
                placeholder="Restaurant Address"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#FA5F55] focus:border-transparent transition"
                required
              />
            </div>
          
            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    onChange={onChangeHandler}
                    checked={data.isOpen}
                    name="isOpen"
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full shadow-inner transition ${
                    data.isOpen ? 'bg-[#FA5F55]' : 'bg-gray-300'
                  }`}></div>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    data.isOpen ? 'transform translate-x-4' : ''
                  }`}></div>
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
    </>
  );
};

export default AddRestaurant;
