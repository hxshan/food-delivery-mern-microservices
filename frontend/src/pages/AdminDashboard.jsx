import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import ManageCustomers from '../pages/admin/ManageCustomers';
import ManageDrivers from '../pages/admin/ManageDrivers';
import ManageRestaurants from '../pages/admin/ManageRestaurants';
import AdminOverview from '../pages/admin/AdminOverview';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/overview" />} />
            <Route path="/overview" element={<AdminOverview />} />
            <Route path="/customers" element={<ManageCustomers />} />
            <Route path="/drivers" element={<ManageDrivers />} />
            <Route path="/restaurants" element={<ManageRestaurants />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;