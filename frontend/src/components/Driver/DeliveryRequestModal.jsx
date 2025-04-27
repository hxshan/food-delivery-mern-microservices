import React from 'react';

const DeliveryRequestModal = ({ delivery, onAccept, onReject }) => {
  if (!delivery) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-lg font-bold mb-4">New Delivery Request</h2>
        <p><strong>Restaurant:</strong> {delivery.restaurantName}</p>
        <p><strong>Pickup Address:</strong> {delivery.pickupAddress}</p>
        <p><strong>Order Details:</strong> {delivery.orderSummary}</p>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onReject} className="px-4 py-2 bg-gray-300 rounded-lg">Reject</button>
          <button onClick={onAccept} className="px-4 py-2 bg-[#EB4C40] text-white rounded-lg">Accept</button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRequestModal;
