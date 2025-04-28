import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios"; // Import axios
import {
  CreditCard,
  Landmark,
  MapPin,
  Phone,
  User,
  CheckCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  useGetCartQuery,
  useClearCartMutation,
} from "../../redux/slices/cartApi";

import orderProcessImg from "../../assets/Images/order_process.png";
import LocationMapSelector from "../map";

// API base URL - adjust based on your environment
const API_BASE_URL = "http://localhost:8000/api/order";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  // RTK Query hooks
  const {
    data: cart = {
      items: [],
      total: 0,
      subtotal: 0,
      tax: 0,
      deliveryFee: 0,
      restaurantName: "",
    },
  } = useGetCartQuery();
  const [clearCart] = useClearCartMutation();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(null);
  // Handle the location selection from the map component
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setFormData({
      ...formData,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6),
    });

    // Clear location error if exists
    if (formErrors.location) {
      setFormErrors({
        ...formErrors,
        location: "",
      });
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    deliveryInstructions: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !orderPlaced) {
      navigate("/");
    }
  }, [cart.items, navigate, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields for all payment methods
    if (!formData.fullName.trim()) errors.fullName = "Name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.zipCode.trim()) errors.zipCode = "ZIP code is required";

    // Card payment validation
    if (paymentMethod === "card") {
      if (!formData.cardNumber.trim())
        errors.cardNumber = "Card number is required";
      if (!formData.cardHolder.trim())
        errors.cardHolder = "Card holder name is required";
      if (!formData.expiryDate.trim())
        errors.expiryDate = "Expiry date is required";
      if (!formData.cvv.trim()) errors.cvv = "CVV is required";
    }

    return errors;
  };

  const submitOrderToAPI = async () => {
    try {
      // Prepare the order data for API
      const orderPayload = {
        paymentMethod,
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          instructions: formData.instructions,
        },
        customerPhone: formData.phone,
        customerEmail: formData.email || "",
        deliveryTime: new Date(Date.now() + 45 * 60000).toISOString(),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
      // Submit order to backend
      const response = await axios.post(`${API_BASE_URL}/`, orderPayload);

      // Save the returned order data
      setOrderData(response.data.data);

      console.log("Order Pay: ",orderPayload)

      console.log("Location", selectedLocation);

      return response.data;
    } catch (error) {
      console.error("Order submission error:", error);

      // Show error message
      await Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to place your order. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });

      throw error;
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to the first error
      const firstErrorField = document.querySelector(
        `[name="${Object.keys(errors)[0]}"]`
      );
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const confirm = await Swal.fire({
      title: "Do you confirm the order?",
      text: "Your delicious meal will be on its way soon!",
      imageUrl: orderProcessImg,
      imageWidth: 300,
      imageHeight: 200,
      imageAlt: "Food delivery animation",
      showCancelButton: true,
      confirmButtonText: "Confirm Order",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ffffff",
      cancelButtonColor: "#d33",
      confirmButtonTextColor: "#000000",
      customClass: {
        confirmButton: "swal2-confirm-white",
      },
    });

    // Add custom CSS for white confirm button with black text
    document.head.insertAdjacentHTML(
      "beforeend",
      `
        <style>
          .swal2-confirm-white {
            color: black !important;
            background-color: white !important;
            border: 1px solid #d4d4d4 !important;
          }
        </style>
      `
    );

    if (confirm.isConfirmed) {
      try {
        setIsSubmitting(true);

        // Submit order to API
        await submitOrderToAPI();

        console.log("Order submitted successfully!");
        setOrderPlaced(true);

        // Don't need to clear cart here since the API handles that
      } catch (error) {
        console.error("Order submission failed:", error);
        // Error handling is done inside submitOrderToAPI
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleNavigate = () => {
    navigate(`/map?orderId=${orderData?._id || ""}`);
  };

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          <div className="text-center py-10">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              Thank You For Your Order!
            </h1>
            <p className="text-gray-600 mb-8">
              Your order has been placed successfully. You will receive a
              confirmation email shortly.
            </p>
            <p className="font-medium mb-2">
              Order Total: Rs. {cart.total.toFixed(2)}
            </p>
            <p className="font-medium mb-8">
              Estimated Delivery Time: 30-45 minutes
            </p>
            <button
              className="bg-red-500 text-white px-8 py-3 rounded-md font-medium hover:bg-red-600 transition"
              onClick={handleNavigate}
            >
              Track Order
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
          Checkout
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left Side - Customer Details Form */}

          <form
            className="lg:col-span-2 mb-8 lg:mb-0"
            onSubmit={handleSubmitOrder}
          >
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="fullName"
                  >
                    Full Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`pl-10 w-full p-3 border ${
                        formErrors.fullName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                      placeholder="John Doe"
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="phone"
                  >
                    Phone Number*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`pl-10 w-full p-3 border ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="email"
                  >
                    Email Address (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div>
                <LocationMapSelector
                  onLocationSelect={handleLocationSelect}
                  initialLocation={{ lat: 6.9271, lng: 79.8612 }}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="address"
                  >
                    Street Address*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`pl-10 w-full p-3 border ${
                        formErrors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="city"
                  >
                    City*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Landmark size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`pl-10 w-full p-3 border ${
                        formErrors.city ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                      placeholder="Colombo"
                    />
                  </div>
                  {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="zipCode"
                  >
                    ZIP Code*
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${
                      formErrors.zipCode ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                    placeholder="10100"
                  />
                  {formErrors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.zipCode}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="deliveryInstructions"
                  >
                    Delivery Instructions (optional)
                  </label>
                  <textarea
                    id="deliveryInstructions"
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
                    placeholder="Ring doorbell, leave at door, call when arriving, etc."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-red-500"
                        : "border border-gray-400"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    {paymentMethod === "card" && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <CreditCard size={20} className="mr-2 text-gray-600" />
                    <span>Credit/Debit Card</span>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="pl-9 mt-4 space-y-4">
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="cardNumber"
                      >
                        Card Number*
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          formErrors.cardNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                      {formErrors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="cardHolder"
                      >
                        Cardholder Name*
                      </label>
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${
                          formErrors.cardHolder
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                        placeholder="John Doe"
                      />
                      {formErrors.cardHolder && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.cardHolder}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-medium mb-2"
                          htmlFor="expiryDate"
                        >
                          Expiry Date*
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={`w-full p-3 border ${
                            formErrors.expiryDate
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                          placeholder="MM/YY"
                        />
                        {formErrors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className="block text-gray-700 text-sm font-medium mb-2"
                          htmlFor="cvv"
                        >
                          CVV*
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={`w-full p-3 border ${
                            formErrors.cvv
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                          placeholder="123"
                        />
                        {formErrors.cvv && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center mt-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 cursor-pointer ${
                      paymentMethod === "cash"
                        ? "bg-red-500"
                        : "border border-gray-400"
                    }`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    {paymentMethod === "cash" && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span>Cash On Delivery</span>
                </div>
              </div>
            </div>
          </form>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Restaurant Name */}
              {cart.restaurantName && (
                <div className="mb-4 pb-2 border-b border-gray-200">
                  <h3 className="font-medium">{cart.restaurantName}</h3>
                </div>
              )}

              {/* Order Items */}
              <div className="space-y-3 px-5 mb-6 max-h-[30vh] overflow-y-auto">
                {cart.items.map((item, index) => {
                  // Calculate item total price
                  let itemBasePrice = item.price;
                  if (item.sizePrice) itemBasePrice += item.sizePrice;
                  if (item.addOnsPrices && item.addOnsPrices.length) {
                    itemBasePrice += item.addOnsPrices.reduce(
                      (sum, price) => sum + price,
                      0
                    );
                  }

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="flex-1">
                        <div className="flex">
                          <span className="font-medium mr-2">
                            {item.quantity}x
                          </span>
                          <div>
                            <span>{item.name}</span>
                            {item.size && item.size !== "Regular" && (
                              <div className="text-xs text-gray-600">
                                Size: {item.size}
                              </div>
                            )}
                            {item.addOns && item.addOns.length > 0 && (
                              <div className="text-xs text-gray-600">
                                Add-ons: {item.addOns.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div>
                          Rs. {(itemBasePrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 mb-4 pt-2 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rs. {cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>Rs. {cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>
                    Rs.{" "}
                    {cart.deliveryFee ? cart.deliveryFee.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>Rs. {cart.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Estimated Delivery Time */}
              <div className="mb-6 py-3 border-y border-gray-200">
                <div className="text-sm text-gray-600">
                  Estimated Delivery Time
                </div>
                <div className="font-medium">30-45 minutes</div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                } text-white py-3 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-red-300`}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>

              {/* Terms & Privacy Policy */}
              <div className="mt-4 text-xs text-center text-gray-500">
                By placing your order, you agree to our{" "}
                <a href="#" className="text-red-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-red-500 hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
