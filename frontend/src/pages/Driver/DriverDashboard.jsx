import React, { useEffect, useState } from 'react';
import NavbarDriver from '../../components/Driver/NavbarDriver';
import DeliveryRequestModal from '../../components/Driver/DeliveryRequestModal';
import socket from '../../services/socketService';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import axios from '../../api/axios';

const DriverDashboard = () => {
  const [incomingDelivery, setIncomingDelivery] = useState({
    delivery:{
      restaurantName:"Hilton Colombo",
      pickupAddress:"Hilton Colombo",
      orderSummary:"2 fried rice,1 coke"
    },

  });
  const [driverStats, setDriverStats] = useState({
    firstname:'',
    vehicle:'',
    plate:'',
    earnings: 0,
    rating: 0,
    reviewsCount: 0,
    deliveriesCompleted: 0
  });
  const navigate = useNavigate();
  const user = useAuthContext();

  const getuserData = async()=>{
    const res = await axios.get(`/user/driver/profile/${user.user.userId}`)
    console.log(res)
    setDriverStats({
      firstname:res.data.firstName,
      vehicle:res.data.type,
      plate:res.data.vehicle.plateNumber,
      earnings: res.data.earnings,
      rating:res.data.rating,
      reviewsCount:res.data.reviewsCount,
      deliveriesCompleted: 0
    });
  }
  const acceptDelivery=()=>{
    navigate('/driver/map?restaurantName=Hilton Colombo')
  }
  const rejectDelivery=()=>{
    setIncomingDelivery(null)
  }
  useEffect(() => {
    if(user.user != null){
      getuserData()
      socket.initSocket(user.user.token,user.user);
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarDriver page={'Driver Dashboard'} />
      
      <div className="flex-grow p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome back, Heshan!</h1>
            <p className="text-gray-600 mt-2">Ready for your next delivery?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-[#EB4C40] text-white px-3 py-1 rounded-full text-sm">Motorcycle</span>
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">Plate: ABA256</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-500 text-sm font-medium">Earnings</h3>
              <p className="text-2xl font-bold text-gray-800">Rs. {driverStats.earnings.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-500 text-sm font-medium">Rating</h3>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800">{driverStats.rating}</span>
                <span className="text-yellow-500 ml-1">★</span>
                <span className="text-gray-500 text-sm ml-2">({driverStats.reviewsCount} reviews)</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-500 text-sm font-medium">Deliveries</h3>
              <p className="text-2xl font-bold text-gray-800">{driverStats.deliveriesCompleted}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-500 text-sm font-medium">Status</h3>
              <div className="flex items-center mt-1">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-800 font-medium">Currently Online</span>
              </div>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Status</h2>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Waiting for Delivery Requests</h3>
              <p className="text-gray-600 text-center max-w-md">
                You'll be notified when a new delivery request comes in. Make sure your location services are enabled.
              </p>
            </div>
          </div>
        </div>
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