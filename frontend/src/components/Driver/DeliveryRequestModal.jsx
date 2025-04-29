import React from 'react';

const DeliveryRequestModal = ({ delivery, onAccept, onReject }) => {
  if (!delivery) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-white p-4 rounded-lg shadow-xl w-80 border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-md font-bold text-gray-800">New Delivery Request</h2>
          <span className="text-xs bg-[#EB4C40] text-white px-2 py-1 rounded-full">NEW</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="flex items-start">
            <span className="font-medium text-gray-700 w-24">Restaurant:</span>
            <span className="flex-1">{delivery.restaurantName}</span>
          </p>
          <p className="flex items-start">
            <span className="font-medium text-gray-700 w-24">Pickup:</span>
            <span className="flex-1 line-clamp-2">{delivery.pickupAddress}</span>
          </p>
          <p className="flex items-start">
            <span className="font-medium text-gray-700 w-24">Order:</span>
            <span className="flex-1 line-clamp-2">{delivery.orderSummary}</span>
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button 
            onClick={onReject} 
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reject
          </button>
          <button 
            onClick={onAccept} 
            className="px-3 py-1.5 text-sm bg-[#EB4C40] hover:bg-[#d44338] text-white rounded-lg transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRequestModal;