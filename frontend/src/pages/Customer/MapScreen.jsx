import React, { useEffect, useState } from 'react';
import { Map, Truck, Clock, Phone, Navigation } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import socket from '../../services/socketService';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapScreen = ({orderId}) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat:6.9  , lng: 79.899});
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  // useEffect(() => {
  //   socket.emit('join-order-room', { orderId: '1234' });

  //   socket.on('driver-location-update', (location) => {
  //     setDriverLocation(location);
  //   });

  //   return () => {
  //     socket.off('driver-location-update');
  //   };
  // }, []);

  if (!isLoaded) return <div>Loading map...</div>;

  
    
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar />
        
        {/* Map Section */}
        <div className="relative flex-grow bg-gray-200">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={driverLocation || userLocation}
          zoom={14}
        >
          {driverLocation && (
            <Marker position={driverLocation} icon={{ url: '/driver-icon.png' }} />
          )}
          {userLocation && (
            <Marker position={userLocation} icon={{ url: '/user-icon.png' }} />
          )}
        </GoogleMap>
        </div>
        
        {/* Rider Information */}
        <div className="bg-white shadow-lg rounded-t-xl p-4 -mt-6 relative z-10">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <Truck className="text-[#EB4C40]" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Michael Rodriguez</h2>
              <div className="text-gray-500 flex items-center">
                <Navigation className="w-4 h-4 mr-1" />
                <span>0.8 miles away</span>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="bg-[#EB4C40] hover:bg-[#FF6A5E] text-white p-2 rounded-full">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium mb-2">Order Status</h3>
            <div className="flex items-center text-green-500 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>Your order is on the way!</span>
            </div>
            
            <div className="flex justify-between items-center">
              <button className="bg-[#EB4C40] hover:bg-[#FF6A5E] text-white py-2 px-4 rounded-lg w-full font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export default MapScreen