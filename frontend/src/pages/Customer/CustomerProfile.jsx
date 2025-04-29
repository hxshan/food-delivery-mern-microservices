import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Upload, MapPin, ArrowLeft, Mail, CreditCard, Clock, Home, History } from "lucide-react";
import axios from "../../api/axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { assets } from "../../assets/assets";

const CustomerProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
//   const navigate = useNavigate();

const user = useAuthContext();
  
    const getuserData = async()=>{
      console.log(`http://localhost:8000/api/user/driver/profile/${user.user.userId}`)
      const res = await axios.get(`/user/customer/profile/${user.user.userId}`)
      console.log(res)
          
    setFirstName(res.data.firstName);
    setLastName(res.data.lastName);
    setPhoneNumber(res.data.phone); 
    setPreviewUrl(assets.placeholder);
    res.data.addresses.length>0?setAddress(res.data.addresses[0]):setAddress( 'Address not given')
    setEmail(res.data.user.email)
    
    }
    useEffect(() => {
      if(user.user != null){
        getuserData()
      }
    }, [user]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle API call to update user profile
    setIsEditing(false);
    // Show success message or toast notification
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-red-500"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-semibold text-center flex-1 mr-6">My Profile</h1>
        </div>
      </div>

      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Profile Header */}
            <div className="p-6 bg-red-500 text-white">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {previewUrl ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                      <img
                        src={previewUrl}
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
                  <p className="text-red-100">{email}</p>
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

            {/* Profile Content */}
            <div className="p-6">
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
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
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
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={true}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none hover:cursor-not-allowed focus:ring-2 bg-gray-100 focus:ring-red-500"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
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
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Default Delivery Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter your delivery address"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
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
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <User className="text-gray-400 mt-1 mr-2" size={18} />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-gray-700">{`${firstName} ${lastName}`}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Phone className="text-gray-400 mt-1 mr-2" size={18} />
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="text-gray-700">{phoneNumber}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Mail className="text-gray-400 mt-1 mr-2" size={18} />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-700">{email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Delivery Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <MapPin className="text-gray-400 mt-1 mr-2" size={18} />
                          <div>
                            <p className="text-sm text-gray-500">Default Address</p>
                            <p className="text-gray-700">{address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link to="/saved-addresses" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                        <Home size={24} className="text-red-500 mb-2" />
                        <span className="text-sm text-gray-700">Saved Addresses</span>
                      </Link>
                      
                      <Link to="/payment-methods" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                        <CreditCard size={24} className="text-red-500 mb-2" />
                        <span className="text-sm text-gray-700">Payment Methods</span>
                      </Link>
                      
                      <Link to="/order-history" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                        <History size={24} className="text-red-500 mb-2" />
                        <span className="text-sm text-gray-700">Order History</span>
                      </Link>
                      
                      <Link to="/account-settings" className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                        <Clock size={24} className="text-red-500 mb-2" />
                        <span className="text-sm text-gray-700">Delivery Schedule</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;