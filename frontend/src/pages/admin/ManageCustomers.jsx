import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Plus, Edit, Trash2, Check, X, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import axios from 'axios';

// Define API_URL without using process.env
const API_URL = 'http://localhost:5005/api';
// If you're using Create React App, you could use:
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; // for Vite
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'; // for CRA

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

const Select = ({ value, onChange, options, placeholder = 'Select option' }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const Modal = ({ isOpen, onClose, title, children, icon }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {icon && (
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  {icon}
                </div>
              )}
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                <div className="mt-2">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, statusFilter]);

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
      if (searchTerm) {
        queryParams += `&search=${searchTerm}`;
      }
      
      // Include role=customer to only get customers
      queryParams += `&role=customer`;
  
      const token = localStorage.getItem('token');
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

  const openActionModal = (customer, action) => {
    setSelectedCustomer(customer);
    setActionType(action);
    setIsActionModalOpen(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleCustomerAction = async () => {
    if (!selectedCustomer) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      let endpoint, method, data, successMessage;
      
      switch (actionType) {
        case 'activate':
          endpoint = `${API_URL}/admin/users/${selectedCustomer.userId}/reinstate`;
          method = 'post';
          data = { role: 'customer' };
          successMessage = "Customer activated successfully";
          break;
        case 'deactivate':
          endpoint = `${API_URL}/admin/users/${selectedCustomer.userId}/suspend`;
          method = 'post';
          data = { role: 'customer', reason: 'Admin action' };
          successMessage = "Customer deactivated successfully";
          break;
        case 'ban':
          endpoint = `${API_URL}/admin/users/${selectedCustomer.userId}/ban`;
          method = 'post';
          data = { reason: 'Admin action' };
          successMessage = "Customer banned successfully";
          break;
        default:
          throw new Error('Invalid action type');
      }
      
      await axios({
        method,
        url: endpoint,
        data,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast(successMessage);
      setIsActionModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error(`Error ${actionType} customer:`, error);
      showToast(
        error.response?.data?.message || `Failed to ${actionType} customer`, 
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/admin/users/${selectedCustomer.userId}/ban`,
        { reason: 'Account deleted by admin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showToast("Customer has been permanently removed");
      setIsDeleteModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast(
        error.response?.data?.message || "Failed to delete customer", 
        'error'
      );
    } finally {
      setIsSubmitting(false);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getActionTitle = () => {
    switch (actionType) {
      case 'activate': return 'Activate Customer Account';
      case 'deactivate': return 'Deactivate Customer Account';
      case 'ban': return 'Ban Customer Account';
      default: return 'Confirm Action';
    }
  };

  const getActionDescription = () => {
    switch (actionType) {
      case 'activate': 
        return 'This will reactivate the customer account, allowing them to sign in and place orders.';
      case 'deactivate': 
        return 'This will temporarily suspend the customer account. They will not be able to sign in or place orders until reactivated.';
      case 'ban': 
        return 'This will permanently ban the customer account. This action cannot be undone.';
      default: 
        return 'Are you sure you want to proceed with this action?';
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'activate': return <Check className="h-6 w-6 text-green-500" />;
      case 'deactivate': return <Clock className="h-6 w-6 text-amber-500" />;
      case 'ban': return <AlertCircle className="h-6 w-6 text-red-500" />;
      default: return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'banned', label: 'Banned' }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <h1 className="text-2xl font-bold">Manage Customers</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => {}} variant="secondary">
              <Plus size={18} className="mr-2" />
              <span>Add Customer</span>
            </Button>
          </div>
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
                onClick={() => fetchCustomers()}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{customer.name || 'No Name'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {formatDate(customer.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(customer.roleStatus?.customer || customer.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end items-center space-x-2">
                              {(customer.status === 'inactive' || customer.status === 'suspended' || customer.roleStatus?.customer === 'inactive' || customer.roleStatus?.customer === 'suspended') && (
                                <Button 
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600 hover:bg-green-100 rounded"
                                  onClick={() => openActionModal(customer, 'activate')}
                                >
                                  <Check size={18} />
                                </Button>
                              )}
                              
                              {(customer.status === 'active' || customer.roleStatus?.customer === 'active') && (
                                <Button 
                                  variant="ghost"
                                  size="icon"
                                  className="text-amber-600 hover:bg-amber-100 rounded"
                                  onClick={() => openActionModal(customer, 'deactivate')}
                                >
                                  <Clock size={18} />
                                </Button>
                              )}
                              
                              <Button 
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:bg-red-100 rounded"
                                onClick={() => openDeleteModal(customer)}
                              >
                                <Trash2 size={18} />
                              </Button>
                              
                              <Button 
                                variant="ghost"
                                size="icon"
                                className="text-blue-600 hover:bg-blue-100 rounded"
                              >
                                <MoreVertical size={18} />
                              </Button>
                            </div>
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
      
      {/* Customer Action Confirmation Modal */}
      <Modal 
        isOpen={isActionModalOpen} 
        onClose={() => setIsActionModalOpen(false)}
        title={getActionTitle()}
        icon={getActionIcon()}
      >
        <div className="mt-2">
          {selectedCustomer && (
            <p className="mb-2">
              <span className="font-medium">{selectedCustomer.name || selectedCustomer.email}</span>
            </p>
          )}
          <p className="text-sm text-gray-500">{getActionDescription()}</p>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button 
            onClick={handleCustomerAction} 
            disabled={isSubmitting} 
            className={`ml-3 ${
              actionType === 'activate' ? 'bg-green-600 hover:bg-green-700' :
              actionType === 'deactivate' ? 'bg-amber-600 hover:bg-amber-700' :
              actionType === 'ban' ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Confirm ${actionType === 'activate' ? 'Activation' : actionType === 'deactivate' ? 'Deactivation' : 'Ban'}`
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsActionModalOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Customer Account"
        icon={<AlertCircle className="h-6 w-6 text-red-500" />}
      >
        <div className="mt-2">
          {selectedCustomer && (
            <p className="mb-2">
              Are you sure you want to delete <span className="font-medium">{selectedCustomer.name || selectedCustomer.email}</span>?
            </p>
          )}
          <p className="text-sm text-gray-500">
            This action cannot be undone. The customer will be permanently banned from the platform.
          </p>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button 
            variant="destructive" 
            onClick={handleDeleteCustomer}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </div>
            ) : (
              'Delete Customer'
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isSubmitting}
            className="mr-3"
          >
            Cancel
          </Button>
        </div>
      </Modal>
      
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