import React, { useEffect, useState, useCallback } from 'react';
import { Map, Truck, Phone, Navigation } from 'lucide-react';
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { useSearchParams } from 'react-router-dom';

import Navbar from '../../components/Navbar';
import { useAuthContext } from '../../hooks/useAuthContext';
import axios from '../../api/axios'
import { assets } from '../../assets/assets';
const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapScreen = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { token, user } = useAuthContext();
  
  // State declarations
  const [driverLocation, setDriverLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 6.9, lng: 79.899 });
  const [driverDetails, setDriverDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState("Loading...");
  const [distance, setDistance] = useState("Calculating...");
  const [isLoading, setIsLoading] = useState(true);
  const [socketError, setSocketError] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Calculate route between points
  const calculateRoute = useCallback(async (origin, destination, driverPosition) => {
    if (!window.google || !origin || !destination) return;
    
    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: driverPosition || origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      
      setDirections(result);
      
      if (result.routes[0]?.legs[0]?.distance) {
        setDistance(result.routes[0].legs[0].distance.text);
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, []);

  // Fetch order and restaurant details
  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/order/${orderId}`);
        console.log(response.data)
        setOrderDetails(response.data.data);
        setDeliveryStatus(response.data.data.status || "On the way");
        setDeliveryLocation({
          lat: response.data.data.latitude,
          lng: response.data.data.longitude
        });
        const id = '68110391c5debe59c4558cb1'
        const restaurantResponse = await axios.get(`/restaurant/get/${id}`);
        setRestaurantDetails(restaurantResponse.data);
        setRestaurantLocation({
          lat: 6.933273,
          lng: 79.842092
        });

        setUserLocation({
          lat: restaurantResponse.data.location.latitude,
          lng: restaurantResponse.data.location.longitude
        });

      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  
  if (!orderId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Order ID missing</h2>
          <p className="mt-2">Please access this page through a valid order link</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB4C40] mx-auto"></div>
          <p className="mt-4">Loading map and order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      
      {/* Map Section */}
      <div className="relative flex-grow bg-gray-200">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={driverLocation || restaurantLocation || userLocation}
          zoom={14}
        >
          {restaurantLocation && (
            <Marker 
              position={restaurantLocation} 
              icon={{
                url: assets.restaurant,
                scaledSize: new window.google.maps.Size(30, 30) 
              }} 
            />
          )}
          
          {deliveryLocation && (
            <Marker 
              position={deliveryLocation} 
              icon={{ url: '/user-icon.png' }} 
            />
          )}
          
          {driverLocation && (
            <Marker 
              position={driverLocation} 
              icon={{ url: '/driver-icon.png' }} 
            />
          )}
          
          {directions && (
            <DirectionsRenderer directions={directions} />
          )}
        </GoogleMap>
      </div>
      
      {/* Rider Information */}
      <div className="bg-white shadow-lg rounded-t-xl p-4 -mt-6 relative z-10">
        {socketError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4">
            <p>{socketError} - Some real-time features may not work</p>
          </div>
        )}

        {driverDetails ? (
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <Truck className="text-[#EB4C40]" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{driverDetails.name}</h2>
              <div className="text-gray-500 flex items-center">
                <Navigation className="w-4 h-4 mr-1" />
                <span>{distance} away</span>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="bg-[#EB4C40] hover:bg-[#FF6A5E] text-white p-2 rounded-full">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="font-bold text-lg">
              {deliveryStatus === "Ready for delivery" 
                ? "Finding a driver..." 
                : "Waiting for order preparation"}
            </h2>
          </div>
        )}
        
        {/* Order Details */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium mb-2">Order Status</h3>
          <div className="flex items-center text-green-500 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>Your order {deliveryStatus.toLowerCase()}</span>
          </div>
          
          {restaurantDetails && (
            <div className="mb-4">
              <p className="text-gray-600">From: {restaurantDetails.name}</p>
              {orderDetails && (
                <p className="text-gray-600">Order ID: {orderId}</p>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <button className="bg-[#EB4C40] hover:bg-[#FF6A5E] text-white py-2 px-4 rounded-lg w-full font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;