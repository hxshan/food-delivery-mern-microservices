import React, { useState } from 'react';

const UserProfile = () => {
  // Mock user data - replace with actual data from your backend
  const [user, setUser] = useState({
    name: 'John Do',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    zipCode: '10001',
    profilePicture: '/api/placeholder/150/150'
  });

  // Mock order history - replace with actual data from your backend
  const [orders, setOrders] = useState([
    {
      id: 'ORD-1234',
      date: '2025-04-20',
      total: 42.99,
      status: 'Delivered',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 15.99 },
        { name: 'Garlic Bread', quantity: 1, price: 4.99 },
        { name: 'Chocolate Cake', quantity: 1, price: 7.99 },
        { name: 'Delivery Fee', quantity: 1, price: 3.99 },
        { name: 'Tip', quantity: 1, price: 10.00 }
      ]
    },
    {
      id: 'ORD-1198',
      date: '2025-04-15',
      total: 27.98,
      status: 'Delivered',
      items: [
        { name: 'Chicken Burger', quantity: 2, price: 11.99 },
        { name: 'French Fries', quantity: 1, price: 3.99 }
      ]
    },
    {
      id: 'ORD-1056',
      date: '2025-04-05',
      total: 35.97,
      status: 'Delivered',
      items: [
        { name: 'Sushi Combo', quantity: 1, price: 24.99 },
        { name: 'Miso Soup', quantity: 2, price: 5.49 }
      ]
    }
  ]);

  // State for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
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

  return (
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
                      <h3 className="text-lg font-medium">Personal Information</h3>
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
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editedUser.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editedUser.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editedUser.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editedUser.city}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-EB4C40 focus:ring focus:ring-EB4C40 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Zip Code</label>
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
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <span className="text-gray-500 text-sm">{order.date}</span>
                          <h3 className="font-medium">{order.id}</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                          <span className="font-semibold">${order.total.toFixed(2)}</span>
                          <button 
                            onClick={() => toggleOrderDetails(order.id)}
                            className="text-sm bg-EB4C40 hover:bg-FF6A5E text-white px-3 py-1 rounded-md transition-colors"
                          >
                            {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                          </button>
                        </div>
                      </div>
                      
                      {selectedOrder === order.id && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Order Items</h4>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {order.items.map((item, idx) => (
                                <tr key={idx}>
                                  <td className="px-2 py-4 whitespace-nowrap">{item.name}</td>
                                  <td className="px-2 py-4 whitespace-nowrap">{item.quantity}</td>
                                  <td className="px-2 py-4 text-right whitespace-nowrap">${item.price.toFixed(2)}</td>
                                  <td className="px-2 py-4 text-right whitespace-nowrap">${(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                              ))}
                              <tr className="bg-gray-100">
                                <td colSpan="3" className="px-2 py-4 text-right font-medium">Order Total:</td>
                                <td className="px-2 py-4 text-right font-bold">${order.total.toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button className="text-sm border border-EB4C40 text-EB4C40 hover:bg-EB4C40 hover:text-white px-3 py-1 rounded-md transition-colors">
                              Reorder
                            </button>
                            <button className="text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors">
                              Report Issue
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                    <button className="mt-4 bg-EB4C40 hover:bg-FF6A5E text-white py-2 px-4 rounded-md transition-colors">
                      Browse Menu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;