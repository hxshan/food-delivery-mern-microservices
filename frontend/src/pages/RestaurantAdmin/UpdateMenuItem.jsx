import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { restaurantApi } from "../../services/restaurantApi";
import { assets } from "../../assets/assets";

function UpdateMenuItem() {
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    size:'',
    oldImage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurantId, setRestaurantId] = useState('');

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await restaurantApi.get(`/menu-item/${menuItemId}`);
        const item = response.data.menuItem || response.data;
        
        setData({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          size: item.size,
          oldImage: item.image || ''
        });

        if (item.image) {
          setImagePreview(`http://localhost:5003/uploads/${item.image}`);
        }
        
         const idFromState = location.state?.restaurantId;
         if (idFromState) {
           setRestaurantId(idFromState);
        } else {
          const resResponse = await restaurantApi.get(`/find-by-menu/${menuItemId}`);
          setRestaurantId(resResponse.data._id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load menu item data");
        navigate(`/restaurant-details`);
      }
    };

   
      fetchMenuItem();
    
  }, [menuItemId, navigate, location.state]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
  
    if (name === "price") {
      const regex = /^\d*\.?\d*$/;
      if (value === '' || regex.test(value)) {
        setData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setData(prev => ({ ...prev, [name]: value }));
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
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("size", data.size);
      formData.append("oldImage", data.oldImage);
      
      if (image) {
        formData.append("image", image);
      }

      console.log("Submitting update with data:", {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        oldImage: data.oldImage,
        size: data.size,
        hasNewImage: !!image
      });

      const response = await restaurantApi.put(`/update/${menuItemId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success(response.data.message || "Menu item updated successfully!");
        navigate(`/restaurant-details/${response.data.restaurantId || restaurantId}`);
         
      } 
    } catch (error) {
      console.error("Update failed:", {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
      
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to update menu item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-red-500 rounded-full animate-spin"></div>
          <p className="mt-2">Loading menu item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
            Update Menu Item
          </h2>
          
          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 hover:border-red-500 rounded-lg p-4 transition-colors">
                  <img
                    src={imagePreview || assets.upload_area}
                    alt="Menu item preview"
                    className="w-32 h-32 object-contain mx-auto"
                  />
                  <p className="text-gray-500 text-sm text-center mt-2">
                    {image ? "New image selected" : "Click to change image"}
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={data.description}
                onChange={onChangeHandler}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
            <label className="font-medium mb-1 block">Item Size (Optional)</label>
            <select
              onChange={onChangeHandler}
              value={data.size}
              name="size"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FA5F55] focus:border-transparent"
            >
              <option value="">Select size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select a category</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  name="price"
                  value={data.price}
                  onChange={onChangeHandler}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-red-500 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Update Item'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/restaurant-details/${restaurantId}`)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateMenuItem;