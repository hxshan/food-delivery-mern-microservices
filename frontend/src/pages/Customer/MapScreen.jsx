import React, { useEffect, useState } from "react";
import { Map, Truck, Clock, Phone, Navigation } from "lucide-react";
import Navbar from "../../components/Navbar";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import socket from "../../services/socketService";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapScreen = ({ order }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 6.9, lng: 79.899 });
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const [deliveryStatus, setDeliveryStatus] = useState("Being Prepared");

  const API_BASE_URL = "http://localhost:8000/api/order";

  const orderId = "6810fd37d1160447a916099f";

  async function getOrderById(orderId) {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/order/${orderId}`
      );
      return response.data.data; 
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to retrieve order";
      console.error("Error fetching order:", message);
      throw new Error(message);
    }
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await getOrderById(orderId);
        console.log("Order:", order);
      } catch (err) {
        console.error("Error loading order:", err.message);
      }
    };

    fetchOrder();
  }, []);

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
            <Marker
              position={driverLocation}
              icon={{ url: "/driver-icon.png" }}
            />
          )}
          {userLocation && (
            <Marker position={userLocation} icon={{ url: "/user-icon.png" }} />
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
            <span>Your order {deliveryStatus}</span>
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
};

export default MapScreen;
