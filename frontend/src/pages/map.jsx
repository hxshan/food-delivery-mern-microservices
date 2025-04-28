import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const LocationMapSelector = ({ onLocationSelect, initialLocation }) => {
  const defaultLocation = initialLocation || { lat: 6.9271, lng: 79.8612 };
  const [userLocation, setUserLocation] = useState(defaultLocation);

  useEffect(() => {
    console.log("Log: " , userLocation) 
  }, [userLocation])

  // Load the Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
  });

  // Handle map click to set location
  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setUserLocation(newLocation);
    
    // Pass the selected location back to parent component if callback exists
    if (onLocationSelect) {
      onLocationSelect(newLocation);
    }
  };

  // Try to get user's current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        // On error, keep the default location
        (error) => console.log("Error getting location:", error)
      );
    }
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  // Render loading state, error state, or the map
  if (loadError) {
    return (
      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-red-500 text-center px-4">
            Error loading maps. Please check your API key.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300">
      {!isLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation}
          zoom={14}
          onClick={handleMapClick}
        >
          <Marker position={userLocation} />
        </GoogleMap>
      )}
    </div>
  );
};

export default LocationMapSelector;