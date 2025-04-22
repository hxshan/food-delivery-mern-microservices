import React from 'react';
import { CheckCircle } from 'lucide-react';

const VerificationSuccessPopup = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verified!</h2>
          <p className="text-gray-600 text-center mb-4">
            Your email has been successfully verified. Redirecting you...
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccessPopup;