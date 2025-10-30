import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/main/Header';
import Footer from '../components/main/Footer';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;