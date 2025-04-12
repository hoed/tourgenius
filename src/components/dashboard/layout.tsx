import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, Users, Calendar, Receipt, Map, FileText, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chatbot from '@/components/chatbot/Chatbot';
import { supabase } from '@/integrations/supabase/client';
import { Toaster, toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user data on mount and listen for auth changes
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = (): void => {
    setIsSidebarOpen(false);
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        toast.error('Failed to log out. Please try again.');
        return;
      }
      toast.success('Successfully logged out');
      navigate('/auth');
    } catch (error: unknown) {
      console.error('Unexpected error during logout:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md h-16 flex items-center justify-between px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 focus:outline-none focus:shadow-outline"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link to="/dashboard" className="ml-4 text-lg font-semibold text-gray-800">
            TourGenius Dashboard
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* User profile - moved to sidebar */}
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 z-30 transition-all duration-300 transform bg-gray-900 text-white w-64 
                    pt-16 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
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
              {/* User Info */}
              <li className="border-t border-gray-700 mt-4 pt-4">
                <div className="flex items-center space-x-3 p-3 text-gray-300">
                  <User className="h-5 w-5" />
                  <span>{currentUser?.email || 'User'}</span>
                </div>
              </li>
              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition-colors text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 transition-all duration-300 ml-0 md:ml-64">
          <main className="p-6">{children}</main>
        </div>
      </div>

      {/* Chatbot */}
      <div className="z-50">
        <Chatbot position="bottom-right" />
      </div>
    </div>
  );
};

export default Layout;