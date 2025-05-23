import React, { useState, useEffect } from 'react';
import { Search, RefreshCw , X} from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import {ADMIN_URL} from '../../api/index';

// Define API_URL without using process.env
const API_URL = ADMIN_URL;

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

const ManageDrivers = () => {
  const { admin } = useAuthContext(); // Get admin from auth context
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (admin?.token) { // Only fetch if we have an admin token
      fetchDrivers();
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

  const fetchDrivers = async () => {
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
      
      // Include role=driver to only get drivers
      queryParams += `&role=driver`;
  
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
  
      setDrivers(response.data.users || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      showToast(
        error.response?.data?.message || "Failed to load drivers", 
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
    fetchDrivers();
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDriverStatusChange = async (driverId, newStatus) => {
    try {
      // Get the admin token
      const token = getAdminToken();
      
      if (!token) {
        throw new Error('Admin authentication required');
      }
      
      let endpoint, method, data;
      
      switch (newStatus) {
        case 'active':
          endpoint = `${API_URL}/admin/users/${driverId}/approve`;
          method = 'post';
          data = { role: 'driver' };
          break;
        case 'suspended':
          endpoint = `${API_URL}/admin/users/${driverId}/suspend`;
          method = 'post';
          data = { role: 'driver', reason: 'Admin action' };
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
      
      showToast(`Driver status updated to ${newStatus}`);
      fetchDrivers();
    } catch (error) {
      console.error('Error updating driver status:', error);
      showToast(
        error.response?.data?.message || `Failed to update driver status`, 
        'error'
      );
      
      // If unauthorized, show specific message
      if (error.response?.status === 401) {
        showToast('Admin authentication required. Please login again.', 'error');
      }
    }
  };

  const baseStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspend' }
  ];

  const getDriverStatusOptions = (status) => {
    // For pending restaurants, include a "select action" option
    if (status === 'pending') {
      return [
        { value: 'selectAction', label: 'Approve' },
        ...baseStatusOptions
      ];
    }
    return baseStatusOptions;
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
    { value: 'pending', label: 'Pending Approval' },
    { value: 'banned', label: 'Banned' }
  ];

  const driverStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspend' },
  ];

  // If not authenticated, show login prompt
  if (!getAdminToken()) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
            <h1 className="text-2xl font-bold">Manage Drivers</h1>
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
          <h1 className="text-2xl font-bold">Manage Drivers</h1>
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
                  fetchDrivers();
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
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.length > 0 ? (
                      drivers.map((driver) => (
                        <tr key={driver.userId} className="hover:bg-gray-50">
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{driver.name || 'No Name'}</div>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{driver.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{driver.phone || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {formatDate(driver.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(driver.roleStatus?.driver || driver.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Select
                              value={(driver.roleStatus?.driver || driver.status) === 'pending' ? 'selectAction' : (driver.roleStatus?.driver || driver.status)}
                              onChange={(newStatus) => handleDriverStatusChange(driver.userId, newStatus)}
                              options={getDriverStatusOptions(driver.roleStatus?.driver || driver.status)}
                              className="w-32"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No drivers found
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

export default ManageDrivers;