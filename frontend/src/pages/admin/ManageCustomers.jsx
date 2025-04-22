import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Plus, Edit, Trash2 } from 'lucide-react';

const ManageCustomers = () => {
  const [customers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 15, registered: '01/15/2025', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 8, registered: '02/03/2025', status: 'Active' },
    { id: 3, name: 'Robert Brown', email: 'robert@example.com', orders: 23, registered: '12/05/2024', status: 'Active' },
    { id: 4, name: 'Emily Wilson', email: 'emily@example.com', orders: 4, registered: '03/21/2025', status: 'Inactive' },
    { id: 5, name: 'Michael Johnson', email: 'michael@example.com', orders: 12, registered: '01/30/2025', status: 'Active' },
  ]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Manage Customers</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            <Filter size={18} className="mr-2" />
            <span>Filter</span>
          </button>
          
          <button className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            <Plus size={18} className="mr-2" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.registered}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">5</span> results
          </div>
          
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
