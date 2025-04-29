import React from 'react';
import { useLogout } from '../../hooks/useLogout';

const DriverWaitingActivation = () => {
  const { logout } = useLogout();
  
    const handleLogout = () => {
      logout();
    };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-[#EB4C40] bg-opacity-10 p-4 rounded-full">
            <span className="text-[#EB4C40] text-4xl"></span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Account Under Review
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          Thank you for signing up as a driver. Your application is being reviewed by our team.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-blue-400">ℹ️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This process typically takes 24-48 hours. We'll notify you by email once your account is activated.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="bg-gray-200 p-2 rounded-full">
              <span className="text-gray-600">📄</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">Documents Submitted</p>
              <p className="text-sm text-gray-500">Your documents are being verified</p>
            </div>
            <div className="ml-auto">
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="bg-gray-200 p-2 rounded-full">
              <span className="text-gray-600">🪪</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">Account Activation</p>
              <p className="text-sm text-gray-500">Admin review in progress</p>
            </div>
            <div className="ml-auto">
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Waiting
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm text-center mb-4">
          Have questions? Contact our support team:
        </p>
        
        <div className="text-center">
          <a 
            href="mailto:support@yourservice.com" 
            className="text-[#EB4C40] hover:text-[#cb3c30] font-medium"
          >
            support@yourservice.com
          </a>
        </div>
        
        <button 
          className="w-full mt-6 py-3 bg-[#EB4C40] hover:bg-[#cb3c30] text-white rounded-lg font-medium transition duration-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Thank you for choosing to partner with us!</p>
        <p className="mt-1">We'll notify you when your account is ready.</p>
      </div>
    </div>
  );
};

export default DriverWaitingActivation;