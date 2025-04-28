import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <span className="text-gray-300 text-9xl font-bold">4</span>
          <div className="relative mx-2">
            <div className="animate-bounce">
              <div className="relative">
                <div className="bg-blue-100 w-24 h-28 rounded-t-full relative">
                  <div className="absolute top-10 left-4 w-3 h-3 bg-gray-700 rounded-full"></div>
                  <div className="absolute top-10 right-4 w-3 h-3 bg-gray-700 rounded-full"></div>

                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-700 rounded-full"></div>

                  <div className="absolute bottom-0 left-0 w-full">
                    <div className="flex">
                      <div className="w-1/4 h-4 bg-blue-100 rounded-b-full"></div>
                      <div className="w-1/4 h-4 bg-blue-100 rounded-b-full"></div>
                      <div className="w-1/4 h-4 bg-blue-100 rounded-b-full"></div>
                      <div className="w-1/4 h-4 bg-blue-100 rounded-b-full"></div>
                    </div>
                  </div>

                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-6 bg-gray-800 rounded-t-lg"></div>
                    <div className="w-20 h-2 bg-gray-800 rounded"></div>
                  </div>

                  <div className="absolute -right-4 top-2">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center rotate-12 transform">
                      <span className="text-white font-bold text-xs">STOP</span>
                    </div>
                  </div>
                </div>

                <div className="w-16 h-2 bg-gray-200 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
          </div>
          <span className="text-gray-300 text-9xl font-bold">4</span>
        </div>

        <h1 className="mt-8 text-2xl font-medium text-gray-600">
          We're sorry, but the page you were looking for doesn't exist.
        </h1>
        <p className="mt-4 text-gray-500">
          The page might have been moved or deleted.
        </p>

        <button
          className="mt-8 px-6 py-3 bg-[#EB4C40] text-white rounded-lg hover:bg-red-600 transition duration-300"
          onClick={() => navigate("/")}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
