import React, { useState } from 'react';
import { assets } from "../../assets/assets";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { restaurantApi } from "../../services/restaurantApi";

const AddMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '', 
    category: '',
    size:''

  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onPriceChangeHandler = (event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      setData(prev => ({ ...prev, price: value }));
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("size", data.size);
      if (image) {
        formData.append("image", image);
      }

      console.log("Submitting menu item for restaurant:", id);
      
      const response = await restaurantApi.post(`/${id}/menu`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        toast.success("Menu item added successfully!");
        // Navigate back to the restaurant details page with the same ID
        navigate(`/restaurant-details/${id}`);
      } else {
        toast.error(response.data.message || "Failed to add menu item");
      }
    } catch (error) {
      console.error("Error adding menu item:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || "Failed to add menu item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
          Add New Menu Item
        </h2>
        
        <form className="space-y-4" onSubmit={onSubmitHandler}>
     
          <div className="flex flex-col items-center mb-4">
            <label className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-red-500 rounded-lg p-4 bg-white transition-colors">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Upload preview"
                className="w-24 h-24 object-contain mx-auto"
              />
              <p className="text-gray-500 text-sm text-center mt-2">
                {image ? image.name : "Click to select an image"}
              </p>
              <input 
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                className="hidden"
                required
              />
            </label>
          </div>
          
         
          <div>
            <label className="font-medium mb-1 block">Menu Name</label>
            <input
              onChange={onChangeHandler}
              value={data.name}
              name="name"
              placeholder="Enter menu item name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
        
          <div>
            <label className="font-medium mb-1 block">Item Description</label>
            <textarea
              onChange={onChangeHandler}
              value={data.description}
              name="description"
              placeholder="Enter description"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent min-h-[80px]"
              required
            />
          </div>

       
          <div>
            <label className="font-medium mb-1 block">Item Size (Optional)</label>
            <select
              onChange={onChangeHandler}
              value={data.size}
              name="size"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
         
          <div>
            <label className="font-medium mb-1 block">Item Category</label>
            <select
              onChange={onChangeHandler}
              value={data.category}
              name="category"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              <option value="Salad">Salad</option>
              <option value="Cake">Cake</option>
              <option value="Drink">Drink</option>
              <option value="Rolls">Rolls</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          
         
          <div>
            <label className="font-medium mb-1 block">Item Price</label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                onChange={onPriceChangeHandler}
                value={data.price}
                name="price"
                type="number"
                placeholder="0.00"
                className="w-full pl-8 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-4 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add Menu Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;