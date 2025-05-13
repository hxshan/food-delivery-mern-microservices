import React from "react";
import { useNavigate } from "react-router-dom";

const confirmScreen = () => {

    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate(`/map?orderId=${orderData?._id || ""}`);
      };


  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="text-center py-10">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You For Your Order!</h1>
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
    </div>
  );
};

export default confirmScreen;
