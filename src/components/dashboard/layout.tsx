import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, Users, Calendar, Receipt, Map, FileText, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Chatbot from '@/components/chatbot/Chatbot';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md h-16 flex items-center justify-between px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 focus:outline-none focus:shadow-outline"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link to="/dashboard" className="ml-4 text-lg font-semibold text-gray-800">
            TourGenius Dashboard
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* User profile or any other header content */}
          <Button onClick={() => navigate('/auth')} variant="outline">Logout</Button>
        </div>
      </header>
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 z-30 transition-all duration-300 transform bg-gray-900 text-white w-64 
                    pt-16 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Sidebar content */}
          <nav className="flex flex-col h-full">
            <ul className="space-y-2 p-4">
              <li>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition-colors ${
                    isActive('/dashboard') ? 'bg-gray-800' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <Map className="h-5 w-5" />
                  <span>Dasbor</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/customers"
                  className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition-colors ${
                    isActive('/dashboard/customers') ? 'bg-gray-800' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <Users className="h-5 w-5" />
                  <span>Pelanggan</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/itinerary"
                  className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition-colors ${
                    isActive('/dashboard/itinerary') ? 'bg-gray-800' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Rencana Perjalanan</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/tour-plans"
                  className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition-colors ${
                    isActive('/dashboard/tour-plans') ? 'bg-gray-800' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <Map className="h-5 w-5" />
                  <span>Paket Wisata</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/invoices"
                  className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition-colors ${
                    isActive('/dashboard/invoices') ? 'bg-gray-800' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <Receipt className="h-5 w-5" />
                  <span>Faktur</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/settings"
                  className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition-colors ${
                    isActive('/dashboard/settings') ? 'bg-gray-800' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <Settings className="h-5 w-5" />
                  <span>Pengaturan</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/manual"
                  className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition-colors ${
                    isActive('/manual') ? 'bg-gray-800' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <FileText className="h-5 w-5" />
                  <span>Manual</span>
                </Link>
              </li>
            </ul>
            {/* Add more links as needed */}
          </nav>
        </div>

        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ml-0 md:ml-64`}>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* Add Chatbot */}
      <div className="z-50">
        <Chatbot position="bottom-right" />
      </div>
    </div>
  );
};

export default Layout;
