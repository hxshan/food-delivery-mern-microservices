import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Upload, ArrowLeft, AlertCircle, Check } from "lucide-react";
import axios from "../../api/axios";

const CustomerDetails = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });
  
  const navigate = useNavigate();
  
  // Get user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.userId) {
      // If no user data is found, redirect to login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showNotification("error", "File size exceeds 2MB limit");
        return;
      }
      
      setProfilePicture(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      
      if (!userData || !userData.userId) {
        showNotification("error", "User information is missing. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }
      
      // Create profile data object
      const profileData = {
        userId: userData.userId,
        firstName,
        lastName,
        phone: phoneNumber,
      };
      
      // Make API call to save customer profile
      const response = await axios.post("/user/customer/profile", profileData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`
        },
        withCredentials: true
      });
      
      
      // Update user data in localStorage to mark profile as completed
      userData.profileCompleted = true;
      localStorage.setItem("user", JSON.stringify(userData));
      
      showNotification("success", "Profile saved successfully!");
      
      // Redirect to customer dashboard after a brief delay
      setTimeout(() => {
        navigate("/customer/profile", { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMessage = error?.response?.data?.message || "Failed to save profile. Please try again.";
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Notification popup */}
      {notification.show && (
        <div 
          className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 p-4 rounded-lg shadow-lg transition-all duration-300 z-50 flex items-center ${
            notification.type === "success" ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"
          }`}
        >
          <div className={`p-2 rounded-full mr-3 ${notification.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
            {notification.type === "success" ? (
              <Check size={20} className="text-green-500" />
            ) : (
              <AlertCircle size={20} className="text-red-500" />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${notification.type === "success" ? "text-green-800" : "text-red-800"}`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link
              to="/verify-otp"
              className="flex items-center text-gray-600 hover:text-red-500"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="profilePicture"
                className="block text-sm font-medium text-center text-gray-700 mb-4"
              >
                Profile Picture (Optional)
              </label>
              <div className="flex flex-col items-center gap-4">
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <label className="cursor-pointer block">
                    <div className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600">
                      <Upload size={16} />
                      <span>
                        {profilePicture ? "Change picture" : "Upload picture"}
                      </span>
                    </div>
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                      disabled={loading}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF, max 2MB
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-4">
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
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
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
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
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
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  <span>Saving...</span>
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              You can always update these details later from your profile
              settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;