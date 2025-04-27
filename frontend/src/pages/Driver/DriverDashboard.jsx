import React, { useEffect, useState } from 'react';
import NavbarDriver from '../../components/Driver/NavbarDriver';
import DeliveryRequestModal from '../../components/Driver/DeliveryRequestModal';
import socket from '../../services/socketService';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const [incomingDelivery, setIncomingDelivery] = useState(null);
  const navigate = useNavigate();

//   useEffect(() => {
//     socket.emit('driver-online', { driverId: 'driver123' });

//     socket.on('new-delivery-request', (deliveryData) => {
//       setIncomingDelivery(deliveryData);
//     });

//     return () => {
//       socket.off('new-delivery-request');
//     };
//   }, []);

//   const acceptDelivery = () => {
//     socket.emit('accept-delivery', { deliveryId: incomingDelivery.id, driverId: 'driver123' });

//     navigate('/navigate-restaurant', { state: { delivery: incomingDelivery } });
//   };

//   const rejectDelivery = () => {
//     socket.emit('reject-delivery', { deliveryId: incomingDelivery.id, driverId: 'driver123' });
//     setIncomingDelivery(null);
//   };

  return (
    <div className="flex flex-col h-screen">
      <NavbarDriver page={'Driver Dashboard'} />
      <div className="flex flex-col flex-grow items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold">Waiting for Delivery Requests...</h1>
      </div>

      <DeliveryRequestModal
        delivery={incomingDelivery}
        onAccept={acceptDelivery}
        onReject={rejectDelivery}
      />
    </div>
  );
};

export default DriverDashboard;
