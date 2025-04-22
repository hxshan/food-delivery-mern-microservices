import React from 'react';
import { Users, Truck, Coffee, ShoppingBag } from 'lucide-react';

const AdminOverview = () => {
  const stats = [
    { name: 'Total Customers', value: '1,258', icon: <Users size={24} className="text-blue-500" /> },
    { name: 'Total Drivers', value: '326', icon: <Truck size={24} className="text-green-500" /> },
    { name: 'Total Restaurants', value: '95', icon: <Coffee size={24} className="text-orange-500" /> },
    { name: 'Total Orders', value: '3,412', icon: <ShoppingBag size={24} className="text-purple-500" /> },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-gray-100">
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <h2 className="text-xl font-semibold text-gray-800">{stat.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Restaurant</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">#ORD-{10000 + i}</td>
                    <td className="px-4 py-2">Customer Name</td>
                    <td className="px-4 py-2">Restaurant Name</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">New Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">User Name</td>
                    <td className="px-4 py-2">{i % 3 === 0 ? 'Customer' : i % 3 === 1 ? 'Driver' : 'Restaurant'}</td>
                    <td className="px-4 py-2">Today</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;