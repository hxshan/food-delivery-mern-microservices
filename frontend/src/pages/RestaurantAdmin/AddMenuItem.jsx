import React, { useState } from 'react';
import { assets } from "../../assets/assets";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from "../../services/api";

const AddMenuItem = () => {
  const { id } = useParams();
   const [image, setImage] = useState(false);
    const [data, setData] = useState({
      name: '',
       description: '',
        price: '', 
        category: ''
     });
     const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData((data) => ({ ...data, [name]: value }));
    };
    const onPriceChangeHandler = (event) => {
      const value = event.target.value;
      if (!isNaN(value)) {
        setData((data) => ({ ...data, price: value }));
      }
    };
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);
    
        console.log("Submitting:", { name: data.name, description: data.description, category: data.category,price : data.price });
    
    //const hardcodeId ="6807a1957197e3db9f0ec50b";
        const response = await api.post(`/${id}/menu`, formData);
        console.log(response);
        if (response.data.success) {
          setData({
          name: "",
          description:"",
          price:"",
          category:""
            
          })
          setImage(false);
          toast.success(response.data.message)
        } else {
          toast.error(response.data.message)
        }
    
      }
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="md:ml-[250px] mt-5 w-full md:w-[450px] p-4 md:p-6 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#FA5F55]">
          Add New Menu Item
        </h2>
        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <div className="flex flex-col mb-4">
            <p className="font-medium mb-2">Upload Image</p>
            <label
              htmlFor="image"
              className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#FA5F55] rounded-lg p-4 bg-white transition-colors flex flex-col items-center"
            >
              <img
                 src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Upload area"
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
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
             className="hidden" required />
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
              onChange={onPriceChangeHandler}
              value={data.price}
                name="price"
                type="number"
                placeholder="Price"
                className="w-full pl-8 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FA5F55] focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#FA5F55] hover:bg-[#e04b42] text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-4"
          >
            Add Menu
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;