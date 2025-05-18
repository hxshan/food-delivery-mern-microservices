import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, X } from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import {ADMIN_URL} from '../../api/index';


// Define API_URL without using process.env
const API_URL = ADMIN_URL ;

const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded shadow-lg ${type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  type = 'button',
  className = '' 
}) => {
  const baseClasses = 'flex items-center justify-center font-medium rounded focus:outline-none transition-colors';
  
  const variantClasses = {
    primary: 'bg-red-600 hover:bg-red-700 text-white',
    secondary: 'bg-white text-red-600 border border-gray-300 hover:bg-gray-50',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-100',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-6 py-3',
    icon: 'p-2'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  return (
    <span className={`${baseClasses} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`}
    />
  );
};

const Select = ({ value, onChange, options }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const ManageCustomers = () => {
  const { admin } = useAuthContext(); // Get admin from auth context
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (admin?.token) { // Only fetch if we have an admin token
      fetchCustomers();
    }
  }, [currentPage, statusFilter, searchTerm, admin]);

  // Function to get the admin token from localStorage
  const getAdminToken = () => {
    // First try to get token from auth context
    if (admin?.token) {
      return admin.token;
    }
    
    // Fallback: try to get from localStorage directly
    try {
      const adminData = JSON.parse(localStorage.getItem('admin'));
      return adminData?.token;
    } catch (error) {
      console.error('Error getting admin token:', error);
      return null;
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Build query params
      let queryParams = `page=${currentPage}&limit=10`;
      if (statusFilter !== 'all') {
        queryParams += `&status=${statusFilter}`;
      }
      if (searchTerm.trim()) {
        queryParams += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      
      // Include role=customer to only get customers
      queryParams += `&role=customer`;
  
      // Get the admin token
      const token = getAdminToken();
      
      if (!token) {
        throw new Error('Admin authentication required');
      }
  
      const response = await axios.get(`${API_URL}/admin/users?${queryParams}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
  
      setCustomers(response.data.users);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showToast(
        error.response?.data?.message || "Failed to load customers", 
        'error'
      );
      
      // If unauthorized, show specific message
      if (error.response?.status === 401) {
        showToast('Admin authentication required. Please login again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCustomerStatusChange = async (customerId, newStatus) => {
    try {

      // Skip if "selectAction" is chosen (placeholder)
      if (newStatus === 'selectAction') {
        return;
      }

      // Get the admin token
      const token = getAdminToken();
      
      if (!token) {
        throw new Error('Admin authentication required');
      }
      
      let endpoint, method, data;
      
      switch (newStatus) {
        case 'active':
          endpoint = `${API_URL}/admin/users/${customerId}/reinstate`;
          method = 'post';
          data = { role: 'customer' };
          break;
        case 'suspended':
          endpoint = `${API_URL}/admin/users/${customerId}/suspend`;
          method = 'post';
          data = { role: 'customer', reason: 'Admin action' };
          break;
        default:
          throw new Error('Invalid status');
      }
      
      await axios({
        method,
        url: endpoint,
        data,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast(`Customer status updated to ${newStatus}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer status:', error);
      showToast(
        error.response?.data?.message || `Failed to update customer status`, 
        'error'
      );
      
      // If unauthorized, show specific message
      if (error.response?.status === 401) {
        showToast('Admin authentication required. Please login again.', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-amber-100 text-amber-800">Suspended</Badge>;
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Base restaurant status options
  const baseStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspend' }
  ];

  const getCustomerStatusOptions = (status) => {
    // For pending restaurants, include a "select action" option
    if (status === 'pending') {
      return [
        { value: 'selectAction', label: 'Approve' },
        ...baseStatusOptions
      ];
    }
    return baseStatusOptions;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'banned', label: 'Banned' }
  ];

  const customerStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspend' },
  ];

  // If not authenticated, show login prompt
  if (!getAdminToken()) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
            <h1 className="text-2xl font-bold">Manage Customers</h1>
          </div>
          <div className="p-6 text-center">
            <p className="text-red-600 mb-4">Admin authentication required</p>
            <Button 
              onClick={() => window.location.href = '/admin/login'}
              variant="primary"
            >
              Go to Admin Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <h1 className="text-2xl font-bold">Manage Customers</h1>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <button type="submit" className="hidden">Search</button>
            </form>
            
            <div className="flex gap-2">
              <Select 
                value={statusFilter}
                onChange={handleStatusChange}
                options={statusOptions}
                placeholder="Filter by status"
              />
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCurrentPage(1);
                  fetchCustomers();
                }}
                className="text-gray-500"
              >
                <RefreshCw size={18} />
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.length > 0 ? (
                      customers.map((customer) => (
                        <tr key={customer.userId} className="hover:bg-gray-50">
                          
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {formatDate(customer.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(customer.roleStatus?.customer || customer.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Select
                              value={(customer.roleStatus?.customer || customer.status) === 'pending' ? 'selectAction' : (customer.roleStatus?.customer || customer.status)}
                              onChange={(newStatus) => handleCustomerStatusChange(customer.userId, newStatus)}                          
                              options={getCustomerStatusOptions(customer.roleStatus?.customer || customer.status)}
                              className="w-32"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="py-4 flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default ManageCustomers;