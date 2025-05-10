import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, useLoadScript, Marker } from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarDriver from '../../components/Driver/NavbarDriver';

// Define the libraries outside of the component to prevent reloading on every render
const libraries = ['places']; // Static declaration of libraries

const DriverMapScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const delivery = location.state?.delivery || {
    id: 'test123',
    restaurantLat: 6.933273,
    restaurantLng: 79.99,
    customerLat: 6.948092,
    customerLng: 79.883489,
    restaurantName: 'Hilton Colombo',
    restaurantAddress: '456 Food St, Colombo',
    restaurantPhone: '+94 77 123 4567',
    customerName: 'John Doe',
    customerAddress: '123 Main St, Colombo',
    customerPhone: '+94 71 987 6543',
    instructions: 'Please leave at the door. Building code: 4321',
    items: [
      { name: 'Chicken Burger', quantity: 2, price: 450 },
      { name: 'Fries', quantity: 1, price: 250 },
      { name: 'Coke', quantity: 1, price: 100 }
    ],
    totalAmount: 1250,
    paymentMethod: 'Cash on Delivery'
  };

  const [directions, setDirections] = useState(null);
  const [phase, setPhase] = useState('toRestaurant');
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [driverPosition, setDriverPosition] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [distance, setDistance] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const directionsServiceRef = useRef(null);

  useEffect(() => {
    if (!delivery) return;
  
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      setPermissionDenied(true);
      return;
    }
  
    navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        setPermissionDenied(true);
      }
    });
  
    let lastPosition = null;
  
    const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
      const toRad = (x) => (x * Math.PI) / 180;
      const R = 6371000; // meters
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
  
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
  
          if (!lastPosition) {
            setDriverPosition(newPos);
            lastPosition = newPos;
            
          
            
            return;
          }
  
          const distance = calculateDistanceMeters(
            lastPosition.lat,
            lastPosition.lng,
            newPos.lat,
            newPos.lng
          );
  
          if (distance >= 2) {
            setDriverPosition(newPos);
            lastPosition = newPos;
            
        
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setPermissionDenied(true);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }, 2000); // Check every 2 seconds
  
    return () => clearInterval(intervalId);
  }, [delivery]);

  // Initialize DirectionsService after Google Maps API is loaded
  useEffect(() => {
    if (!isLoaded || !window.google) return;
    directionsServiceRef.current = new window.google.maps.DirectionsService();
  }, [isLoaded]);

  // Calculate route
  useEffect(() => {
    if (!delivery || !driverPosition || !directionsServiceRef.current || !window.google) return;

    const directionsService = directionsServiceRef.current;

    const destination = (phase === 'toRestaurant')
      ? { lat: delivery.restaurantLat, lng: delivery.restaurantLng }
      : { lat: delivery.customerLat, lng: delivery.customerLng };

    directionsService.route(
      {
        origin: driverPosition,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          
          // Extract and set estimated time and distance information
          if (result.routes[0]?.legs[0]) {
            setEstimatedTime(result.routes[0].legs[0].duration.text);
            setDistance(result.routes[0].legs[0].distance.text);
          }
        } else {
          console.error('Error fetching directions:', status);
        }
      }
    );
  }, [delivery, driverPosition, phase]);

  // Create and update Advanced Marker
  useEffect(() => {
    if (!mapRef.current || !driverPosition || !window.google) return;

    // Use standard marker if Advanced Marker is not available
    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        map: mapRef.current,
        position: driverPosition,
        title: 'You are here',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#EB4C40',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      });
    } else {
      markerRef.current.setPosition(driverPosition);
    }
  }, [driverPosition]);

  // Detect proximity to restaurant or customer
  useEffect(() => {
    if (!driverPosition || !delivery) return;

    const targetLat = phase === 'toRestaurant' ? delivery.restaurantLat : delivery.customerLat;
    const targetLng = phase === 'toRestaurant' ? delivery.restaurantLng : delivery.customerLng;

    const distance = calculateDistance(
      driverPosition.lat, driverPosition.lng,
      targetLat, targetLng
    );

    if (distance < 0.05) { // within 50 meters
      if (phase === 'toRestaurant') {
        setShowPickupModal(true);
      } else {
        setShowDeliveryModal(true);
      }
    }
  }, [driverPosition, delivery, phase]);

  const handleConfirmPickup = () => {
    setPhase('toCustomer');
    setShowPickupModal(false);
    
  
  };

  const handleConfirmDelivery = () => {
 
    navigate('/driver/dashboard');
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleCallCustomer = () => {
    if (delivery.customerPhone) {
      window.location.href = `tel:${delivery.customerPhone}`;
    }
  };

  const handleCallRestaurant = () => {
    if (delivery.restaurantPhone) {
      window.location.href = `tel:${delivery.restaurantPhone}`;
    }
  };

  if (!isLoaded) return (
    <div className="h-screen flex flex-col">
      <NavbarDriver page={'Delivery Tracking'}/>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB4C40] mx-auto"></div>
          <p className="mt-4 text-lg">Loading Map...</p>
        </div>
      </div>
    </div>
  );
  
  if (permissionDenied) return (
    <div className="h-screen flex flex-col">
      <NavbarDriver page={'Delivery Tracking'}/>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Location Access Needed</h2>
          <p className="mb-4">Please enable location permissions in your browser settings to continue with delivery.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#EB4C40] text-white rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
  
  if (!driverPosition) return (
    <div className="h-screen flex flex-col">
      <NavbarDriver page={'Delivery Tracking'} />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB4C40] mx-auto"></div>
          <p className="mt-4 text-lg">Getting your location...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <NavbarDriver page={'Delivery Tracking'}/>
      <div className="relative flex-grow">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={15}
          center={driverPosition}
          onLoad={(map) => (mapRef.current = map)}
          mapId="ca22c4641069c7cc" 
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>

        {/* Delivery Info Panel */}
        <div className="absolute top-4 left-0 right-0 mx-auto w-11/12 max-w-md bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${phase === 'toRestaurant' ? 'bg-[#EB4C40]' : 'bg-green-500'}`}></div>
              <span className="font-bold">
                {phase === 'toRestaurant' ? 'Heading to Restaurant' : 'Delivering to Customer'}
              </span>
            </div>
            <div className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
              {estimatedTime && `${estimatedTime} (${distance})`}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-2">
            {phase === 'toRestaurant' ? (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#EB4C40] rounded-full flex items-center justify-center text-white mr-3">
                  <span className="text-xs">R</span>
                </div>
                <div>
                  <div className="font-bold">{delivery.restaurantName}</div>
                  <div className="text-sm text-gray-600">Pick up order #{delivery.id.slice(-4)}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
                  <span className="text-xs">C</span>
                </div>
                <div>
                  <div className="font-bold">{delivery.customerName}</div>
                  <div className="text-sm text-gray-600">{delivery.customerAddress}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Order Details Button */}
        <button 
          className="absolute bottom-4 left-0 right-0 mx-auto w-11/12 max-w-md bg-[#EB4C40] text-white py-3 rounded-full shadow-lg z-10"
          onClick={() => setShowOrderDetails(true)}
        >
          View Order Details
        </button>

        {/* Order Details Bottom Sheet */}
        {showOrderDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end">
            <div className="bg-white rounded-t-2xl p-5 pb-8 max-h-[85vh] overflow-y-auto animate-slide-up">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button 
                  className="text-gray-500 p-2"
                  onClick={() => setShowOrderDetails(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-5">
                <h3 className="text-sm text-gray-500 uppercase mb-2">Order #{delivery.id.slice(-4)}</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {delivery.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-start">
                        <span className="font-medium mr-2">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 mt-2 border-t border-gray-300">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">Rs. {delivery.totalAmount}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">Payment Method: </span> {delivery.paymentMethod}
                  </div>
                </div>
              </div>

              {phase === 'toRestaurant' ? (
                <div className="mb-5">
                  <h3 className="text-sm text-gray-500 uppercase mb-2">Restaurant</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="font-bold text-lg mb-1">{delivery.restaurantName}</div>
                    <div className="text-gray-700 mb-3">{delivery.restaurantAddress}</div>
                    <button 
                      onClick={handleCallRestaurant}
                      className="w-full py-3 mt-1 bg-[#EB4C40] text-white rounded-lg flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Call Restaurant
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h3 className="text-sm text-gray-500 uppercase mb-2">Customer</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="font-bold text-lg mb-1">{delivery.customerName}</div>
                      <div className="text-gray-700 mb-3">{delivery.customerAddress}</div>
                      <button 
                        onClick={handleCallCustomer}
                        className="w-full py-3 bg-[#EB4C40] text-white rounded-lg flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Call Customer
                      </button>
                    </div>
                  </div>

                  {delivery.instructions && (
                    <div className="mb-5">
                      <h3 className="text-sm text-gray-500 uppercase mb-2">Special Instructions</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p>{delivery.instructions}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className="mt-2">
                <button 
                  onClick={() => setShowOrderDetails(false)}
                  className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pickup Modal */}
      {showPickupModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center mx-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Pickup</h2>
            <p className="mb-4">Have you picked up the order from <strong>{delivery.restaurantName}</strong>?</p>
            <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded">
              {delivery.items.map((item, idx) => (
                <div key={idx} className="flex justify-between mb-1">
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirmPickup}
              className="w-full py-3 bg-[#EB4C40] text-white rounded-full"
            >
              Confirm Pickup
            </button>
            <button
              onClick={() => setShowPickupModal(false)}
              className="w-full py-3 text-gray-600 mt-2"
            >
              Not yet
            </button>
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center mx-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delivery</h2>
            <p className="mb-4">Have you delivered the order to <strong>{delivery.customerName}</strong>?</p>
            <div className="text-sm mb-6">
              <div className="font-semibold text-[#EB4C40]">Order #{delivery.id.slice(-4)}</div>
              <div>{delivery.customerAddress}</div>
            </div>
            <button
              onClick={handleConfirmDelivery}
              className="w-full py-3 bg-green-500 text-white rounded-full"
            >
              Complete Delivery
            </button>
            <button
              onClick={() => setShowDeliveryModal(false)}
              className="w-full py-3 text-gray-600 mt-2"
            >
              Not yet
            </button>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DriverMapScreen;