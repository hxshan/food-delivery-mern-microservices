import React from "react";
import { Link } from "react-router-dom";
import NewOrders from "../../components/Restaurent/NewOrder";
import ConfirmedOrders from "../../components/Restaurent/ConfirmedOrder";
import Sidebar from "../../components/Sidebar/Sidebar";
import { ArrowRight } from "lucide-react";

function OrdersPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* First Orders Component - Incoming Orders */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium text-gray-700">
                Incoming Orders
              </h2>
              <Link 
                to="" 
                className="text-sm flex items-center text-red-600 hover:text-red-800"
              >
                See All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <NewOrders />
          </div>

          {/* Second Orders Component - Kitchen Orders */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium text-gray-700">
                Kitchen Orders
              </h2>
              <Link 
                to="" 
                className="text-sm flex items-center text-red-600 hover:text-red-800"
              >
                See All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <ConfirmedOrders />
          </div>
        </div>
        
        {/* View All Orders Button */}
        <div className="mt-8 text-center">
          <Link
            to="/restaurantadminordersall"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;