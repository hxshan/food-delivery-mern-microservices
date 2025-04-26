import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from "../../assets/assets";
import { toast } from 'react-toastify';
import { api } from "../../services/api";

function UpdateMenuItem() {

  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    
    const fetchMenuItem = async () => {
      try {
        const response = await api.get(`/menu-item/${menuItemId}`);
        const item = response.data.menuItem || response.data;
        
        setData({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category
        });
        
       
        if (item.image) {
          setImagePreview(`http://localhost:5003/uploads/${item.image}`);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch menu item", error);
        toast.error("Failed to load menu item data");
        setLoading(false);
      }
    };

    if (menuItemId) {
      fetchMenuItem();
    }
  }, [menuItemId]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
  
    if (name === "price") {
      // Allow only numbers and optional decimal
      const regex = /^\d*\.?\d*$/;
      if (value === '' || regex.test(value)) {
        setData((data) => ({ ...data, [name]: value }));
      }
    } else {
      setData((data) => ({ ...data, [name]: value }));
    }
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      
      
      if (image) {
        formData.append("image", image);
      }
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      console.log("Updating menu item:", menuItemId, data);
      
      const response = await api.put(`update/${menuItemId}`, formData);
      
      if (response.data.message) {
        toast.success(response.data.message);
        
        navigate('/restaurant-details');
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Failed to update menu item", error);
      toast.error(error.response?.data?.error || "Failed to update menu item");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">
      <div className="spinner">Loading menu item...</div>
      </div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="md:ml-[250px] mt-5 w-full md:w-[450px] p-4 md:p-6 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#FA5F55]">
          Update Menu Item
        </h2>
        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <div className="flex flex-col mb-4">
            <p className="font-medium mb-2">Upload Image</p>
            <label
              htmlFor="image"
              className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#FA5F55] rounded-lg p-4 bg-white transition-colors flex flex-col items-center"
            >
              <img
                src={imagePreview || assets.upload_area}
                alt="Upload area"
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
              />
              <p className="text-gray-500 text-sm text-center mt-2">
                Click to select a new image
              </p>
            </label>
            <input 
              onChange={handleImageChange}
              type="file"
              id="image"
              hidden
              className="hidden" 
            />
          </div>
          
          <div>
            <p className="font-medium mb-1">Menu Name</p>
            <input
              onChange={onChangeHandler}
              value={data.name}
              name="name"
              placeholder="Type here"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FA5F55] focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <p className="font-medium mb-1">Item Description</p>
            <textarea
              onChange={onChangeHandler}
              value={data.description}
              name="description"
              placeholder="Write content here"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FA5F55] focus:border-transparent min-h-[80px]"
              required
            />
          </div>
          
          <div>
            <p className="font-medium mb-1">Item Category</p>
            <select
              onChange={onChangeHandler}
              value={data.category}
              name="category"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FA5F55] focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              <option value="Salad">Salad</option>
              <option value="Cake">Cake</option>
              <option value="Drink">Drink</option>
              <option value="Rolls">Rolls</option>
              <option value="Sandwich">Sandwich</option>
            </select>
          </div>
          
          <div>
            <p className="font-medium mb-1">Item Price</p>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                onChange={onChangeHandler}
                value={data.price}
                name="price"
                type="number"
                placeholder="Price"
                className="w-full pl-8 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FA5F55] focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
           
              type="submit"
              className="flex-1 bg-[#FA5F55] hover:bg-[#e04b42] text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-4"
            >
              Update Menu
            </button>
            <button
              type="button"
              onClick={() => navigate('/restaurant-details')}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateMenuItem;