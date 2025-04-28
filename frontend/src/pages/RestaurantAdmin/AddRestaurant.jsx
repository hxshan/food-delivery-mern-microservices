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
    phoneNumbers: [''],  
  longitude: '',
  latitude: ''
  });

  const onChangeHandler = (event, index = null) => {
    const { name, value, type, checked } = event.target;
    if (name === "phoneNumbers" && index !== null) {
      setData(prev => {
        const updatedPhones = [...prev.phoneNumbers];
        updatedPhones[index] = value;
        return { ...prev, phoneNumbers: updatedPhones };
      });
    } else {
      setData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('User not authenticated. Please login again.');
     
      return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("isOpen", data.isOpen);
    data.phoneNumbers.forEach(phone => {
      formData.append("phoneNumbers", phone);
    });
    if (data.longitude) formData.append("longitude", data.longitude);
if (data.latitude) formData.append("latitude", data.latitude);
if (userId) formData.append("userId", userId); 

    if (image) {
      formData.append("image", image);
    }
    console.log("Sending to:", `${restaurantApi.defaults.baseURL}/add`);

    try {
      const response = await restaurantApi.post('/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    // try {
    //   const response = await restaurantApi.post('/add', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    //     }
    //   });
      
      if (response.data.success) {
        localStorage.setItem('restaurantId', response.data.restaurant._id);

        setData({
          name: "",
          address: "",
          isOpen: false,
          phoneNumbers: [''],
      longitude: '',
      latitude: ''
        });
        setImage(false);
        toast.success(response.data.message);
        // navigate(`/restaurant-details/${response.data.restaurant._id}`); 
        navigate('/wait')
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add restaurant");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8"> 
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-lg md:ml-36">
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#FA5F55] focus:border-transparent transition hover:border-red-500"
              required
            />
          </div>
          <div>
          <input
  type="text"
  name="location"
  value={`${data.longitude}, ${data.latitude}`}
  onChange={(e) => {
    const [longitude, latitude] = e.target.value.split(",").map(val => val.trim());
    if (longitude && latitude) {
      setData(prev => ({
        ...prev,
        longitude: longitude || "",
        latitude: latitude || ""
      }));
    }
    else {
      toast.error("Please enter valid coordinates.");
  }}}
  placeholder="Longitude, Latitude (optional)"
  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FA5F55]"
/>
</div>


          <div>
  <p className="font-sm mb-2">Phone Numbers (up to 3)</p>
  {data.phoneNumbers.map((phone, idx) => (
    <input
      key={idx}
      type="text"
      value={phone}
      onChange={(e) => onChangeHandler(e, idx)}
      name="phoneNumbers"
      placeholder={`Phone Number ${idx + 1}`}
      className="w-full p-2 mb-2 border hover:border-red-500 border-gray-300 rounded-lg focus:ring-[#FA5F55]"
      
    />
  ))}
  {data.phoneNumbers.length < 3 && (
    <button
      type="button"
      onClick={() => setData(prev => ({ ...prev, phoneNumbers: [...prev.phoneNumbers, ''] }))}
      className="text-[#FA5F55] hover:border-red-500 hover:underline text-sm"
    >
      + Add Another Phone Number
    </button>
  )}
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
  );
};

export default AddRestaurant;