import React, { useState } from "react";

const Cart = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");

  const orderItems = [
    { id: 1, name: "Pol Roti", quantity: 1, price: 1000.00 },
    { id: 2, name: "Large Nai miris kottu", quantity: 2, price: 10000.00 }
  ];

  const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 500.00;
  const total = subtotal + deliveryFee;

  return (
    <div className="border border-gray-300 rounded p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-4">Order Summary</h2>
      <hr className="border-gray-300 mb-4" />

      {/* Order Items */}
      <div className="space-y-3 mb-6">
        {orderItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center mr-2">
                <span className="text-gray-500">{item.quantity}x</span>
              </div>
              <span>{item.name}</span>
            </div>
            <span className="font-medium">Rs. {item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Subtotal and Fees */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>Rs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span>Rs. {deliveryFee.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between font-bold text-lg mb-6">
        <span>Total</span>
        <span>Rs. {total.toFixed(2)}</span>
      </div>

      <hr className="border-gray-300 mb-4" />

      {/* Payment Options */}
      <div className="flex justify-between mb-8">
        <div className="flex items-center">
          <div 
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 cursor-pointer ${paymentMethod === "card" ? "bg-red-500" : "border border-gray-400"}`}
            onClick={() => setPaymentMethod("card")}
          >
            {paymentMethod === "card" && <div className="w-3 h-3 bg-white rounded-full"></div>}
          </div>
          <span>Card Payment</span>
        </div>
        <div className="flex items-center">
          <div 
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 cursor-pointer ${paymentMethod === "cash" ? "bg-red-500" : "border border-gray-400"}`}
            onClick={() => setPaymentMethod("cash")}
          >
            {paymentMethod === "cash" && <div className="w-3 h-3 bg-white rounded-full"></div>}
          </div>
          <span>Cash On Delivery</span>
        </div>
      </div>

      {/* Order Button */}
      <button className="w-full bg-red-500 text-white py-3 rounded font-medium hover:bg-red-600 transition duration-200">
        Order Now
      </button>
    </div>
  );
};

export default Cart;