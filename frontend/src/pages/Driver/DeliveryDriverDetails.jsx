import React, { useState,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Upload, ArrowLeft, Car, FileText, CreditCard, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import axios from "../../api/axios";

const DeliveryDriverDetails = () => {
  // Form fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseDocument, setLicenseDocument] = useState(null);
  const [licenseDocPreview, setLicenseDocPreview] = useState(null);
  const [nicNumber, setNicNumber] = useState("");
  const [nicDocument, setNicDocument] = useState(null);
  const [nicDocPreview, setNicDocPreview] = useState(null);

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    vehicleType: false,
    plateNumber: false,
    licenseNumber: false,
    licenseDocument: false,
    nicNumber: false,
    nicDocument: false,
  });
const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const navigate = useNavigate();



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

  const handleLicenseDocChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseDocument(file);
      setErrors({...errors, licenseDocument: false});
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setLicenseDocPreview(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleNicDocChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNicDocument(file);
      setErrors({...errors, nicDocument: false});
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setNicDocPreview(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Validation functions
  const validateStep1 = () => {
    const step1Errors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      phoneNumber: !phoneNumber.trim()
    };
    
    setErrors({...errors, ...step1Errors});
    return !Object.values(step1Errors).some(error => error);
  };

  const validateStep2 = () => {
    const step2Errors = {
      vehicleType: !vehicleType,
      licenseNumber: !licenseNumber.trim(),
      licenseDocument: !licenseDocument
    };
    
    setErrors({...errors, ...step2Errors});
    return !Object.values(step2Errors).some(error => error);
  };

  const validateStep3 = () => {
    const step3Errors = {
      nicNumber: !nicNumber.trim(),
      nicDocument: !nicDocument
    };
    
    setErrors({...errors, ...step3Errors});
    return !Object.values(step3Errors).some(error => error);
  };

  // Navigation functions
  const nextStep = () => {
    setAttemptedSubmit(true);
    
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setAttemptedSubmit(false);
      window.scrollTo(0, 0);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setAttemptedSubmit(false);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setAttemptedSubmit(false);
    window.scrollTo(0, 0);
  };
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    if (validateStep3()) {
      try {const userData = JSON.parse(localStorage.getItem("user"));
      
        if (!userData || !userData.userId) {
          // showNotification("error", "User information is missing. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }

        const formData = new FormData();
        
        formData.append('userId', userData.userId);
        formData.append('phone', phoneNumber);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('licenseNumber', licenseNumber);
        formData.append('nicNumber', nicNumber);
        formData.append('vehicle[type]', vehicleType);
        formData.append('vehicle[plateNumber]', plateNumber);
        formData.append('licenseDocument', licenseDocument);
        formData.append('nicDocument', nicDocument);
        

        const response = await axios.post(
          '/user/driver/profile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        if(response.status == 200 ){

          navigate("/driver/inactive");
        }else{
          showNotification("error", response.message || "Server error occurred");
        }
        
      } catch (error) {
        console.error("Error submitting driver profile:", error);
        
        if (error.response) {
          showNotification("error", error.response.data.message || "Server error occurred");
        } else if (error.request) {
          showNotification("No response from server. Please check your connection.");
        } else {
          showNotification("An error occurred while submitting your profile.");
        }
      }
    }
  };

  // Step indicators
  const StepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step 
                    ? "bg-red-500 text-white" 
                    : currentStep > step 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step ? <Check size={16} /> : step}
              </div>
              {step < 3 && (
                <div 
                  className={`w-12 h-1 ${
                    currentStep > step ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Error message component
  const ErrorMessage = ({ message }) => {
    return (
      <div className="text-red-500 text-sm mt-1 flex items-center">
        <AlertCircle size={14} className="mr-1" />
        <span>{message}</span>
      </div>
    );
  };

  // Step 1: Personal Information
  const renderStep1 = () => {
    return (
      <>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Personal Information
        </h2>

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
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG or GIF, max 2MB
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
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
            {errors.firstName && attemptedSubmit && (
              <ErrorMessage message="First name is required" />
            )}
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
            {errors.lastName && attemptedSubmit && (
              <ErrorMessage message="Last name is required" />
            )}
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
            {errors.phoneNumber && attemptedSubmit && (
              <ErrorMessage message="Phone number is required" />
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition duration-200"
          >
            Next
            <ChevronRight size={18} className="ml-2" />
          </button>
        </div>
      </>
    );
  };

  // Step 2: Vehicle & License Information
  const renderStep2 = () => {
    return (
      <>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Vehicle & License Details
        </h2>

        <div className="space-y-6">
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
            {errors.vehicleType && attemptedSubmit && (
              <ErrorMessage message="Please select a vehicle type" />
            )}
          </div>

          <div>
            <label
              htmlFor="plateNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Vehicle Plate Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="plateNumber"
                value={plateNumber}
                onChange={(e) => {
                  setPlateNumber(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors({...errors, plateNumber: false});
                  }
                }}
                className={`pl-10 w-full p-3 border ${errors.plateNumber ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Enter your plate number"
                required
              />
            </div>
            {errors.plateNumber && attemptedSubmit && (
              <ErrorMessage message="Plate number is required" />
            )}
          </div>

          <div>
            <label
              htmlFor="licenseNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              License Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="licenseNumber"
                value={licenseNumber}
                onChange={(e) => {
                  setLicenseNumber(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors({...errors, licenseNumber: false});
                  }
                }}
                className={`pl-10 w-full p-3 border ${errors.licenseNumber ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Enter your license number"
                required
              />
            </div>
            {errors.licenseNumber && attemptedSubmit && (
              <ErrorMessage message="License number is required" />
            )}
          </div>

          <div>
            <label
              htmlFor="licenseDocument"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload License Document
            </label>
            <div className={`border ${errors.licenseDocument && attemptedSubmit ? "border-red-500" : "border-gray-300"} border-dashed rounded-md p-4`}>
              <div className="flex items-center justify-center">
                {licenseDocPreview ? (
                  <div className="relative">
                    <img
                      src={licenseDocPreview}
                      alt="License document preview"
                      className="h-20 object-contain"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {licenseDocument?.name}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText size={24} className="mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload license document
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-center">
                <label className="cursor-pointer block">
                  <div className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                    <Upload size={14} />
                    <span>{licenseDocument ? "Change file" : "Browse files"}</span>
                  </div>
                  <input
                    type="file"
                    id="licenseDocument"
                    accept="image/*, application/pdf"
                    className="hidden"
                    onChange={handleLicenseDocChange}
                    required
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">
                JPG, PNG, or PDF, max 5MB
              </p>
            </div>
            {errors.licenseDocument && attemptedSubmit && (
              <ErrorMessage message="License document is required" />
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-200"
          >
            <ChevronLeft size={18} className="mr-2" />
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition duration-200"
          >
            Next
            <ChevronRight size={18} className="ml-2" />
          </button>
        </div>
      </>
    );
  };

  // Step 3: NIC Information
  const renderStep3 = () => {
    return (
      <>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          National ID Information
        </h2>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="nicNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              NIC Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="nicNumber"
                value={nicNumber}
                onChange={(e) => {
                  setNicNumber(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors({...errors, nicNumber: false});
                  }
                }}
                className={`pl-10 w-full p-3 border ${errors.nicNumber ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Enter your NIC number"
                required
              />
            </div>
            {errors.nicNumber && attemptedSubmit && (
              <ErrorMessage message="NIC number is required" />
            )}
          </div>

          <div>
            <label
              htmlFor="nicDocument"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload NIC Document
            </label>
            <div className={`border ${errors.nicDocument && attemptedSubmit ? "border-red-500" : "border-gray-300"} border-dashed rounded-md p-4`}>
              <div className="flex items-center justify-center">
                {nicDocPreview ? (
                  <div className="relative">
                    <img
                      src={nicDocPreview}
                      alt="NIC document preview"
                      className="h-20 object-contain"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {nicDocument?.name}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText size={24} className="mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload NIC document
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-center">
                <label className="cursor-pointer block">
                  <div className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                    <Upload size={14} />
                    <span>{nicDocument ? "Change file" : "Browse files"}</span>
                  </div>
                  <input
                    type="file"
                    id="nicDocument"
                    accept="image/*, application/pdf"
                    className="hidden"
                    onChange={handleNicDocChange}
                    required
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">
                JPG, PNG, or PDF, max 5MB
              </p>
            </div>
            {errors.nicDocument && attemptedSubmit && (
              <ErrorMessage message="NIC document is required" />
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-200"
          >
            <ChevronLeft size={18} className="mr-2" />
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition duration-200"
          >
            Register as Driver
          </button>
        </div>
      </>
    );
  };

  // Error summary for each step
  const getErrorSummary = () => {
    const currentErrors = [];
    
    if (attemptedSubmit) {
      if (currentStep === 1) {
        if (errors.firstName) currentErrors.push("First name is required");
        if (errors.lastName) currentErrors.push("Last name is required");
        if (errors.phoneNumber) currentErrors.push("Phone number is required");
      } else if (currentStep === 2) {
        if (errors.vehicleType) currentErrors.push("Vehicle type is required");
        if (errors.licenseNumber) currentErrors.push("License number is required");
        if (errors.licenseDocument) currentErrors.push("License document is required");
      } else if (currentStep === 3) {
        if (errors.nicNumber) currentErrors.push("NIC number is required");
        if (errors.nicDocument) currentErrors.push("NIC document is required");
      }
    }
    
    if (currentErrors.length === 0) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
        <div className="flex items-center mb-2">
          <AlertCircle size={18} className="text-red-500 mr-2" />
          <p className="text-red-600 font-medium">Please enter the following details:</p>
        </div>
        <ul className="list-disc pl-10 text-red-600 text-sm">
          {currentErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
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
              <span>Exit Registration</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Delivery Driver Registration
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Step {currentStep} of 3
          </p>

          <StepIndicator />

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            {attemptedSubmit && getErrorSummary()}
            
            <form>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              You can always update these details later from your driver profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDriverDetails;