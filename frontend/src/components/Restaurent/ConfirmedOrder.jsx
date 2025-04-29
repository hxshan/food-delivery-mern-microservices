import React, { useState, useEffect } from "react";
import {
  Clock,
  Check,
  X,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  ShoppingBag,
} from "lucide-react";

import axios from "../../api/axios";

function ConfirmedOrders({ onAccept, onReject }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const resturentId = "hilton-colombo";

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:8000/api/order/restaurant/${resturentId}`
        );

        console.log(response);

        const pendingOrders = response.data.data.orders.filter(
          (order) => order.status === "confirmed"
        );
        setOrders(pendingOrders);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders");
        setLoading(false);
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();

    // Optional: Set up polling for new orders
    const intervalId = setInterval(fetchOrders, 100000); 

    return () => clearInterval(intervalId);
  }, []);

  const handleAccept = async (orderId) => {
    try {
      await axios.patch(`http://localhost:8000/api/order/status/${orderId}`, {
        status: "ready_for_delivery",
      });

      setOrders(orders.filter((order) => order._id !== orderId));

      // Call parent callback if provided
      if (onAccept) onAccept(orderId);
    } catch (err) {
      console.error("Error accepting order:", err);
      // Show error notification
    }
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
        {error}
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-1">
          No  Orders
        </h3>
        <p className="text-gray-500">
          You don't have any confirmed orders at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 bg-red-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <ShoppingBag className="mr-2 text-red-500" size={20} />
          Confirmed Orders
          <span className="ml-2 bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
            {orders.length}
          </span>
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <div key={order._id} className="p-4 hover:bg-gray-50">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleOrderDetails(order._id)}
            >
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-800">
                    {order.id || order._id.slice(-6)}
                  </h3>
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Clock size={12} className="mr-1" />
                    confirmed
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatDate(order.createdAt)} • {order.items.length} item(s) •
                  ${order.total.toFixed(2)}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(order._id);
                  }}
                  className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                  title="Accept Order"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>

            {expandedOrder === order._id && (
              <div className="mt-4 pl-4 border-l-2 border-red-200">
                {/* Customer Details */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Customer Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={14} className="mr-2 text-gray-400" />
                      {order.customerPhone || "No phone provided"}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2 text-gray-400" />
                      {order.customerEmail || "No email provided"}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </h4>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin size={14} className="mr-2 text-gray-400 mt-1" />
                      <div>
                        {order.deliveryAddress.street},
                        {order.deliveryAddress.city},
                        {order.deliveryAddress.zipCode}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded"
                      >
                        <div className="flex items-center">
                          {item.image && (
                            <div className="h-10 w-10 rounded overflow-hidden mr-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-sm">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.size && `${item.size} • `}
                              {item.addOns &&
                                item.addOns.length > 0 &&
                                `Add-ons: ${item.addOns.join(", ")}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            ${item.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            x{item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-3 rounded">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>${order.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span>${order.tax?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span>${order.deliveryFee?.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-red-500">
                        ${order.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-2 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Payment Method</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {order.paymentMethod}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${
                      order.paymentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handleAccept(order._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
                  >
                    Accept Order
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConfirmedOrders;
