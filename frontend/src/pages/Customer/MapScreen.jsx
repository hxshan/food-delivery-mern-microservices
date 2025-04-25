import React from 'react'
import { Map, Truck, Clock, Phone, Navigation } from 'lucide-react';
import Navbar from '../../components/Navbar';

const MapScreen = () => {
    // const [currentTime, setCurrentTime] = useState(new Date());
    // const [deliveryProgress, setDeliveryProgress] = useState(35);
    
    // Simulate updating the time
    // useEffect(() => {
    //   const timer = setInterval(() => {
    //     setCurrentTime(new Date());
    //     // Simulate delivery progress
    //     setDeliveryProgress(prev => Math.min(prev + 1, 100));
    //   }, 10000);
      
    //   return () => clearInterval(timer);
    // }, []);
    
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar />
        
        {/* Map Section */}
        <div className="relative flex-grow bg-gray-200">
          {/* Map Placeholder */}
          <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center">
              <Map className="text-[#EB4C40] mr-2" />
            </div>
          </div>
          
          {/* Floating ETA Card */}
          {/* <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="text-[#EB4C40] mr-2" />
                <span className="font-medium">Estimated Arrival</span>
              </div>
              <div className="text-lg font-bold">{currentTime.getHours() % 12 || 12}:{String(currentTime.getMinutes()).padStart(2, '0')} {currentTime.getHours() >= 12 ? 'PM' : 'AM'}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#EB4C40] h-2 rounded-full" 
                style={{ width: `${deliveryProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Order Confirmed</span>
              <span>On the way</span>
              <span>Arrived</span>
            </div>
          </div> */}
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