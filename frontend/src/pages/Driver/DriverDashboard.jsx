import React, { useEffect, useState } from "react";
import NavbarDriver from "../../components/Driver/NavbarDriver";
import DeliveryRequestModal from "../../components/Driver/DeliveryRequestModal";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "../../api/axios";
import socketService from "../../services/socketService";

const DriverDashboard = () => {
  const socket = socketService.getSocket();
  const [incomingDelivery, setIncomingDelivery] = useState({
    delivery: {
      orderId:'acfvsdas',
      restaurantLocation:'',
      customerLocation:'',
      restaurantName: "Hilton Colombo",
      pickupAddress: "Hilton Colombo",
      orderSummary: "2 fried rice,1 coke",
    },
  });
  const [driverStats, setDriverStats] = useState({
    firstname: "",
    vehicle: "",
    plate: "",
    earnings: 0,
    rating: 0,
    reviewsCount: 0,
    deliveriesCompleted: 0,
  });
  const navigate = useNavigate();
  const user = useAuthContext();

  const getuserData = async () => {
    const res = await axios.get(`/user/driver/profile/${user.user.userId}`);
    console.log(res);
    setDriverStats({
      firstname: res.data.firstName,
      vehicle: res.data.type,
      plate: res.data.vehicle.plateNumber,
      earnings: res.data.earnings,
      rating: res.data.rating,
      reviewsCount: res.data.reviewsCount,
      deliveriesCompleted: 0,
    });
  };
  const acceptDelivery = (orderId, restaurantLocation, customerLocation) => {
    socket.emit("driver:accept-order", {
      orderId,
      restaurantLocation,
      customerLocation,
    });
    setIncomingDelivery(prev => prev.filter(delivery => delivery.orderId !== orderId));
    navigate(`/driver/map/${orderId}`);
  };
  const rejectDelivery = (orderId) => {
    setIncomingDelivery(prev => prev.filter(delivery => delivery.orderId !== orderId));
  };
  useEffect(() => {
    if (!user?.user) return;
    getuserData();

    if (!socketService.isConnected()) {
      socketService.connect();
    }
    socketService.on("driver:new-delivery", (delivery) => {
      setIncomingDelivery(delivery);
    });

    return () => {
      socketService.off("driver:new-delivery");
    };
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarDriver page={"Driver Dashboard"} />

      <div className="flex-grow p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back, Heshan!
            </h1>
            <p className="text-gray-600 mt-2">Ready for your next delivery?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-[#EB4C40] text-white px-3 py-1 rounded-full text-sm">
                Motorcycle
              </span>
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                Plate: ABA256
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-500 text-sm font-medium">Earnings</h3>
              <p className="text-2xl font-bold text-gray-800">
                Rs. {driverStats.earnings.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-500 text-sm font-medium">Rating</h3>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800">
                  {driverStats.rating}
                </span>
                <span className="text-yellow-500 ml-1">★</span>
                <span className="text-gray-500 text-sm ml-2">
                  ({driverStats.reviewsCount} reviews)
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-500 text-sm font-medium">Deliveries</h3>
              <p className="text-2xl font-bold text-gray-800">
                {driverStats.deliveriesCompleted}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-500 text-sm font-medium">Status</h3>
              <div className="flex items-center mt-1">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-800 font-medium">
                  Currently Online
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Deliveries Availble
            </h2>
            {incomingDelivery?.delivery ? (
              <div className="border border-green-200 bg-green-50 p-6 rounded-lg flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    Incoming Delivery Request
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">
                        Restaurant:
                      </span>
                      <p className="text-gray-900">
                        {incomingDelivery.delivery.restaurantName}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Pickup Address:
                      </span>
                      <p className="text-gray-900">
                        {incomingDelivery.delivery.pickupAddress}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Order Summary:
                      </span>
                      <p className="text-gray-900">
                        {incomingDelivery.delivery.orderSummary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => acceptDelivery(incomingDelivery.delivery.orderId,incomingDelivery.delivery.restaurantLocation,incomingDelivery.delivery.customerLocation)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => rejectDelivery(incomingDelivery)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Waiting for Delivery Requests
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  You'll be notified when a new delivery request comes in. Make
                  sure your location services are enabled.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
