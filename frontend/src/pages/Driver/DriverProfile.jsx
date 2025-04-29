import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Phone, 
  Upload, 
  ArrowLeft, 
  Car, 
  Calendar, 
  MapPin, 
  Settings, 
  Star, 
  CheckCircle,
  DollarSign,
  History
} from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {assets} from '../../assets/assets'
import axios from "../../api/axios";
import { useAuthContext } from "../../hooks/useAuthContext";

const DriverProfilePage = () => {
  // Form fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  
  // Profile stats
  const [deliveriesCompleted, setDeliveriesCompleted] = useState(0);
  const [rating, setRating] = useState(0);
  const [earnings, setEarnings] = useState(0);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  
  // Error states
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    vehicleType: false
  });
  
  // const navigate = useNavigate();

   const user = useAuthContext();
  
    const getuserData = async()=>{
      console.log(`http://localhost:8000/api/user/driver/profile/${user.user.userId}`)
      const res = await axios.get(`/user/driver/profile/${user.user.userId}`)
      console.log(res)
          
    setFirstName(res.data.firstName);
    setLastName(res.data.lastName);
    setPhoneNumber(res.data.phone);
    setVehicleType(res.data.vehicle.type);
    setPreviewUrl("/api/placeholder/100/100");
    setDeliveriesCompleted(246);
    setRating(res.data.rating);
    setEarnings(res.data.earnings);
    }
    useEffect(() => {
      if(user.user != null){
        getuserData()
      }
    }, [user]);
    

  // File handling functions
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const formErrors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      phoneNumber: !phoneNumber.trim(),
      vehicleType: !vehicleType
    };
    
    setErrors(formErrors);
    return !Object.values(formErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formData = new FormData();
      formData.append('phone', phoneNumber);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('vehicle', vehicleType);
      formData.append('profilePicture', profilePicture);
      const response = await axios.put(`/user/driver/profile/${user.user.userId}`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
              );
      if(response.status == 200 ){
        toast.success('Profile updated!', {
          onClose: () => getuserData()
        });
        setIsEditing(false);
      }
    }
  };

  // Error message component
  const ErrorMessage = ({ message }) => {
    return (
      <div className="text-red-500 text-sm mt-1 flex items-center">
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link
            to="/driver/dashboard"
            className="flex items-center text-gray-600 hover:text-red-500"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-semibold text-center flex-1 mr-6">Driver Profile</h1>
        </div>
      </div>

      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Driver Profile Header */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="bg-red-500 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {previewUrl ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                      <img
                        src={assets.placeholder}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-red-400 flex items-center justify-center border-4 border-white">
                      <User size={36} className="text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer">
                      <Upload size={16} className="text-red-500" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{`${firstName} ${lastName}`}</h2>
                  <div className="flex items-center text-red-100">
                    <Car size={16} className="mr-1" />
                    <span className="capitalize">{vehicleType} Driver</span>
                    <div className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center">
                      <CheckCircle size={12} className="mr-1" />
                      <span>Active</span>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-2 bg-white text-red-500 px-4 py-1 rounded-full text-sm font-medium hover:bg-red-50 transition"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Driver Stats */}
            <div className="p-4 border-b">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2">
                  <div className="text-gray-500 text-sm flex items-center justify-center">
                    <CheckCircle size={14} className="mr-1" />
                    <span>Deliveries</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{deliveriesCompleted}</div>
                </div>
                <div className="text-center p-2 border-l border-r border-gray-200">
                  <div className="text-gray-500 text-sm flex items-center justify-center">
                    <Star size={14} className="mr-1" />
                    <span>Rating</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{rating}/5</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-gray-500 text-sm flex items-center justify-center">
                    <DollarSign size={14} className="mr-1" />
                    <span>Earnings</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">${earnings.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {isEditing ? "Edit Profile Information" : "Driver Information"}
              </h3>

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            if (e.target.value.trim()) {
                              setErrors({...errors, firstName: false});
                            }
                          }}
                          className={`pl-10 w-full p-3 border ${errors.firstName ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      {errors.firstName && <ErrorMessage message="First name is required" />}
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            if (e.target.value.trim()) {
                              setErrors({...errors, lastName: false});
                            }
                          }}
                          className={`pl-10 w-full p-3 border ${errors.lastName ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                      {errors.lastName && <ErrorMessage message="Last name is required" />}
                    </div>

                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            if (e.target.value.trim()) {
                              setErrors({...errors, phoneNumber: false});
                            }
                          }}
                          className={`pl-10 w-full p-3 border ${errors.phoneNumber ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                      {errors.phoneNumber && <ErrorMessage message="Phone number is required" />}
                    </div>

                    <div>
                      <label
                        htmlFor="vehicleType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Vehicle Type
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Car size={18} className="text-gray-400" />
                        </div>
                        <select
                          id="vehicleType"
                          value={vehicleType}
                          onChange={(e) => {
                            setVehicleType(e.target.value);
                            if (e.target.value) {
                              setErrors({...errors, vehicleType: false});
                            }
                          }}
                          className={`pl-10 w-full p-3 border ${errors.vehicleType ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white`}
                          required
                        >
                          <option value="" disabled>Select vehicle type</option>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="car">Car</option>
                          <option value="van">Van</option>
                          <option value="truck">Truck</option>
                        </select>
                      </div>
                      {errors.vehicleType && <ErrorMessage message="Vehicle type is required" />}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <User className="text-gray-400 mt-1 mr-3" size={18} />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-gray-700">{`${firstName} ${lastName}`}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="text-gray-400 mt-1 mr-3" size={18} />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-gray-700">{phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Car className="text-gray-400 mt-1 mr-3" size={18} />
                        <div>
                          <p className="text-sm text-gray-500">Vehicle Type</p>
                          <p className="text-gray-700 capitalize">{vehicleType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {!isEditing && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/delivery-schedule" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                    <Calendar size={24} className="text-red-500 mb-2" />
                    <span className="text-sm text-center text-gray-700">Delivery Schedule</span>
                  </Link>
                  
                  <Link to="/service-areas" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                    <MapPin size={24} className="text-red-500 mb-2" />
                    <span className="text-sm text-center text-gray-700">Service Areas</span>
                  </Link>
                  
                  <Link to="/earnings-history" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                    <History size={24} className="text-red-500 mb-2" />
                    <span className="text-sm text-center text-gray-700">Earnings History</span>
                  </Link>
                  
                  <Link to="/account-settings" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                    <Settings size={24} className="text-red-500 mb-2" />
                    <span className="text-sm text-center text-gray-700">Account Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverProfilePage;