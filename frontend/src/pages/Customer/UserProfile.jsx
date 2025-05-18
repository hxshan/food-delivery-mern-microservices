import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { API_URL } from "../../api"; 

const UserProfile = () => {
  // Mock user data - replace with actual data from your backend
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    zipCode: "10001",
    profilePicture: "/api/placeholder/150/150",
  });

  // State to store orders and loading state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  // Handle input changes for profile editing
  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile changes
  const handleSaveProfile = () => {
    setUser(editedUser);
    setIsEditing(false);
    // Here you would typically send the updated profile to your backend
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    if (selectedOrder === orderId) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(orderId);
    }
  };

  // Fetch user orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/order/`, {
        // Replace with your actual API endpoint
        params: { page: 1, limit: 10 }, // You can implement pagination if needed
      });

      console.log(response)
      setOrders(response.data.data.orders); // Adjust according to the structure of your API response
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []); // Empty array ensures this runs only once

  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                  <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>

                {!isEditing ? (
                  <div>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          Personal Information
                        </h3>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-white bg-EB4C40 hover:bg-FF6A5E px-3 py-1 rounded-md transition-colors"
                        >
                          Edit Profile
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{user.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="font-medium">{user.city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Zip Code</p>
                          <p className="font-medium">{user.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Edit Profile</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editedUser.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editedUser.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={editedUser.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={editedUser.address}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={editedUser.city}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={editedUser.zipCode}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          className="bg-EB4C40 hover:bg-FF6A5E text-white py-2 px-4 rounded-md transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setEditedUser(user);
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Order History Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-xl font-semibold">Order History</h2>
                  <p className="text-gray-500">View all your past orders</p>
                </div>

                <div className="divide-y divide-gray-200">
                  {loading ? (
                    <div className="p-6 text-center text-gray-500">
                      Loading...
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div>
                            <span className="text-gray-500 text-sm">
                              {order.createdAt}
                            </span>
                            <h3 className="font-medium">{order._id}</h3>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="font-semibold">
                              ${order.total.toFixed(2)}
                            </span>
                            <button
                              onClick={() => toggleOrderDetails(order.id)}
                              className="text-sm bg-EB4C40 hover:bg-FF6A5E text-black px-3 py-1 rounded-md transition-colors"
                            >
                              {selectedOrder === order.id
                                ? "Hide Details"
                                : "View Details"}
                            </button>
                          </div>
                        </div>

                        {selectedOrder === order.id && (
                          <div className="mt-4 space-y-2">
                            <h4 className="font-medium text-lg">Items:</h4>
                            <ul className="space-y-2">
                              {order.items.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex justify-between"
                                >
                                  <span>{item.name}</span>
                                  <span>
                                    {item.quantity} x ${item.price.toFixed(2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No orders found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
