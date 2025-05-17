import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { addToCart, getCart } from "../../redux/slices/cartSlice";

import Navbar from "../../components/Navbar";
import MenuItemCard from "../../components/MenuItemCard";
import Cart from "../../components/Cart";

import { X, Minus, Plus, ShoppingBag } from "lucide-react";

import { useCartOperations } from "../../utils/cartUtils";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

// const menuItems = [
//   {
//     name: "Margherita Pizza",
//     price: 1299,
//     description: "Classic pizza with fresh tomatoes, mozzarella, and basil.",
//     image:
//       "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     sizes: [
//       { name: "Regular", price: 0 },
//       { name: "Medium", price: 100 },
//       { name: "Large", price: 200 },
//     ],
//     addOns: [
//       { name: "Extra Cheese", price: 100 },
//       { name: "Olives", price: 50 },
//       { name: "Mushrooms", price: 75 },
//     ],
//   },
//   {
//     name: "Grilled Salmon",
//     price: 1850,
//     description: "Perfectly grilled salmon served with roasted veggies.",
//     image:
//       "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     sizes: [
//       { name: "Regular", price: 0 },
//       { name: "Large", price: 150 },
//     ],
//     addOns: [
//       { name: "Lemon Butter Sauce", price: 100 },
//       { name: "Garlic Mashed Potatoes", price: 150 },
//       { name: "Steamed Asparagus", price: 120 },
//     ],
//   },
//   {
//     name: "Caesar Salad",
//     price: 925,
//     description:
//       "Crisp romaine lettuce with creamy Caesar dressing and croutons.",
//     image:
//       "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     sizes: [
//       { name: "Regular", price: 0 },
//       { name: "Large", price: 100 },
//     ],
//     addOns: [
//       { name: "Grilled Chicken", price: 150 },
//       { name: "Avocado", price: 100 },
//       { name: "Bacon Bits", price: 80 },
//     ],
//   },
//   {
//     name: "Beef Burger",
//     price: 1400,
//     description: "Juicy beef patty with cheddar, lettuce, tomato, and pickles.",
//     image:
//       "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     sizes: [
//       { name: "Single", price: 0 },
//       { name: "Double", price: 200 },
//     ],
//     addOns: [
//       { name: "Extra Cheese", price: 50 },
//       { name: "Bacon", price: 80 },
//       { name: "Fried Egg", price: 70 },
//     ],
//   },
//   {
//     name: "Spaghetti Carbonara",
//     price: 1375,
//     description:
//       "Traditional Italian pasta with eggs, cheese, pancetta, and pepper.",
//     image:
//       "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     sizes: [
//       { name: "Regular", price: 0 },
//       { name: "Large", price: 150 },
//     ],
//     addOns: [
//       { name: "Extra Parmesan", price: 50 },
//       { name: "Mushrooms", price: 70 },
//       { name: "Grilled Chicken", price: 150 },
//     ],
//   },
//   {
//     name: "Chicken Tikka Masala",
//     price: 1150,
//     description: "Tender chicken pieces in a creamy spiced tomato sauce.",
//     image:
//       "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     sizes: [
//       { name: "Regular", price: 0 },
//       { name: "Large", price: 150 },
//     ],
//     addOns: [
//       { name: "Extra Sauce", price: 50 },
//       { name: "Naan Bread", price: 100 },
//       { name: "Raita", price: 80 },
//     ],
//   },
//   {
//     name: "Veggie Delight Sandwich",
//     price: 850,
//     description:
//       "Fresh vegetables layered with hummus and pesto in whole grain bread.",
//     image:
//       "https://images.unsplash.com/photo-1554433607-66b5efe9d304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     sizes: [
//       { name: "Regular", price: 0 },
//       { name: "Large", price: 100 },
//     ],
//     addOns: [
//       { name: "Cheese Slice", price: 50 },
//       { name: "Avocado", price: 70 },
//       { name: "Extra Pesto", price: 40 },
//     ],
//   },
//   {
//     name: "Chocolate Lava Cake",
//     price: 650,
//     description: "Warm chocolate cake with a gooey molten center.",
//     image:
//       "https://images.unsplash.com/photo-1617455559706-fa196228c05d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
//     sizes: [
//       { name: "Single", price: 0 },
//       { name: "Double", price: 100 },
//     ],
//     addOns: [
//       { name: "Vanilla Ice Cream", price: 80 },
//       { name: "Strawberries", price: 60 },
//       { name: "Whipped Cream", price: 50 },
//     ],
//   },
// ];

const ResturentPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector(getCart);

  const [resturentData, setReturentData] = useState({
    address: "",
    image: "",
    name: "",
    phoneNumbers: [],
    rating: 0,
  });
  const [menuItems, setMenusItems] = useState([]);

  const { restaurantId } = useParams();
  const [isLoggin, setIsLoggin] = useState(false);
  //Get resturent
  const getResturentById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/restaurant/get/${restaurantId}`
      );
      console.log(response);
      const data = response?.data;
      setReturentData({
        address: data.address || "Null",
        image: data.image || "",
        name: data.name || "Null",
        phoneNumbers: data.phoneNumbers || [],
        rating: data.rating ? Number(data.rating).toFixed(1) : "0.0",
      });

      setMenusItems(data.menuItems);
    } catch (error) {
      console.error("Error fetching resturent : ", error);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      getResturentById();
      getUserToken();
    }
  }, []);

  //   useEffect(() => {
  //   const testApi = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/api/order/cart/', {
  //         method: 'GET',
  //         credentials: 'include',
  //         headers: {
  //           'Accept': 'application/json'
  //         }
  //       });

  //       if (!response.ok) {
  //         console.error('Server responded with error:', response.status);
  //         const errorText = await response.text();
  //         console.error('Error details:', errorText);
  //         return;
  //       }

  //       const data = await response.json();
  //       console.log('Success!', data);
  //     } catch (error) {
  //       console.error('Fetch error:', error);
  //     }
  //   };

  //   testApi();
  // }, []);

  //Dish Custtomization
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Regular");
  const [addOns, setAddOns] = useState([]);

  const { addItemToCart, isAddingToCart } = useCartOperations();

  //get user token
  const getUserToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    console.log(token);

    if (token) {
      setIsLoggin(true);
    }
  };

  const handleSelectedItem = (item) => {
    console.log(item);
    setSelectedItem(item);
    setIsOpen(true);
  };

  const incrementQuantity = () => {
    if (quantity < 21) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleAddOnsSelections = (addon) => {
    if (addOns.includes(addon)) {
      setAddOns(addOns.filter((item) => item != addon));
    } else {
      setAddOns([...addOns, addon]);
    }
  };

  const handleCustomizationPopup = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  const handleAddToCart = async () => {
    console.log("Added to cart:", {
      item: selectedItem.name,
      quantity,
      size: selectedSize,
      addOns,
    });

    const sizeObj = Array.isArray(selectedItem?.sizes)
      ? selectedItem.sizes.find((s) => s.name === selectedSize)
      : null;

    const addOnsArray = Array.isArray(selectedItem?.addOns)
      ? selectedItem.addOns.filter((a) => addOns.includes(a.name))
      : [];

    const cartItem = {
      id: Date.now(),
      name: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.image,
      quantity: quantity,
      size: selectedSize,
      sizePrice: sizeObj ? sizeObj.price : 0,
      addOns: addOns,
      addOnsPrices: addOnsArray.map((a) => a.price),
    };

    const result = await addItemToCart(
      cartItem,
      restaurantId,
      resturentData.name
    );

    if (result.success) {
      console.log("result: ", result);
      console.log("Cart", cart);
    } else {
      console.log("result: error");
    }

    setAddOns([]);
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <Navbar />

      <div className="relative h-screen p-10 overflow-hidden">
        <div className="absolute inset-0 w-full">
          <img
            src={`/uploads/${resturentData.image}`}
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
              <span className="font-bold">{resturentData.rating}</span>
            </div>
            <div className="text-white text-sm">350 Reviews</div>
          </div>

          <h1 className=" text-[50px] font-bold ">{resturentData.name}</h1>
          <div className="flex gap-5">
            <p className=" text-[20px] font-semibold ">Chinese</p>
            <p className=" text-[20px] font-semibold ">
              {resturentData.address}
            </p>
          </div>
        </div>
      </div>

      <div className="p-10 w-full lg:flex gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
          {!menuItems || menuItems.length === 0 ? (
            <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-8  bg-white">
              <ShoppingBag size={48} className="text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Menu Items Available
              </h3>
              <p className="text-gray-500 text-center">
                No menu items have been added yet. Please check back later.
              </p>
            </div>
          ) : (
            menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelectedItem(item)}
                className=" h-fit"
              >
                <MenuItemCard menuItem={item} />
              </div>
            ))
          )}
        </div>

        {isLoggin && <Cart />}
      </div>

      {/* customization popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
            {/* Header with item name */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={handleCustomizationPopup}
              >
                <X size={20} />
              </button>
            </div>

            {/* Item customization options */}
            <div className="p-4">
              {/* Quantity selector */}
              <div className="mb-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Quantity</h3>
                  <div className="relative flex items-center w-full border border-gray-300 rounded-full h-12">
                    <button
                      onClick={decrementQuantity}
                      className="flex items-center justify-center h-full pl-4 pr-2"
                      disabled={quantity <= 1}
                    >
                      <span className="flex items-center justify-center w-6 h-6 active:bg-red-500 rounded-full cursor-pointer">
                        <Minus
                          size={18}
                          className={`active:text-white ${
                            quantity <= 1 ? "text-gray-300" : "text-gray-600"
                          } `}
                        />
                      </span>
                    </button>

                    <div className="flex-1 text-center">{quantity}</div>

                    <button
                      onClick={incrementQuantity}
                      className="flex items-center justify-center h-full pl-2 pr-2"
                    >
                      <span className="flex items-center justify-center w-6 h-6 active:bg-red-500 rounded-full cursor-pointer">
                        <Plus
                          size={16}
                          className={`text-gray-600 active:text-white `}
                        />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Size selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <div className="space-y-2">
                  {selectedItem.sizes &&
                    selectedItem.sizes.map((size, index) => (
                      <label
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <input
                            id={`size-${index}`}
                            type="radio"
                            name="size"
                            checked={selectedSize === size.name}
                            onChange={() => handleSizeSelection(size.name)}
                            className="w-4 h-4 accent-red-500"
                          />
                          <span className="ml-2 text-sm">{size.name}</span>
                        </div>
                        <span className="text-sm">+{size.price}</span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Add Ons */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Add Ons</h3>
                <div className="space-y-2">
                  {selectedItem.addOns &&
                    selectedItem.addOns.map((addOn, index) => (
                      <label
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <input
                            id={`addOn-${index}`}
                            type="checkbox"
                            checked={addOns.includes(addOn.name)}
                            onChange={() => handleAddOnsSelections(addOn.name)}
                            className="w-4 h-4 accent-red-500"
                          />
                          <span className="ml-2 text-sm">{addOn.name}</span>
                        </div>
                        <span className="text-sm">+ Rs.{addOn.price}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex p-4 border-t">
              <button
                className="flex-1 py-2 border border-gray-300 rounded-md mr-2 text-sm"
                onClick={() => console.log("Cancelled")}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 bg-red-500 text-white rounded-md text-sm"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResturentPage;
