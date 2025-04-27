import { User, Truck, Store, Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSelectionWithNav() {
  const [hovered, setHovered] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const options = [
    { 
      id: "customer", 
      title: "Customer", 
      description: "Access your orders and favorite restaurants",
      icon: User,
      path: "/login"
    },
    { 
      id: "driver", 
      title: "Driver", 
      description: "Manage your deliveries and earnings",
      icon: Truck,
      path: "/driverLogin"
    },
    { 
      id: "restaurant", 
      title: "Restaurant", 
      description: "Manage your menu and orders",
      icon: Store,
      path: "/restaurantLogin"
    }
  ];

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Restaurants", path: "/restaurants" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Select your account type to sign in</p>
          </div>
          
          <div className="space-y-4 mb-8">
            {options.map((option) => (
              <button
                key={option.id}
                className={`w-full p-6 rounded-xl flex items-center text-left transition-all duration-200 border-2 ${
                  hovered === option.id 
                    ? "bg-red-50 border-red-500" 
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                }`}
                onMouseEnter={() => setHovered(option.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate(option.path)}
              >
                <div className={`p-3 rounded-full mr-4 ${
                  hovered === option.id ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
                }`}>
                  <option.icon size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-900">{option.title}</h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <a 
              className="text-red-500 hover:text-red-600 font-medium cursor-pointer"
              onClick={() => navigate("/registrationSelection")}
            >
              Don't have an account? Sign Up
            </a>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <a 
              className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
              onClick={() => navigate("/")}
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}