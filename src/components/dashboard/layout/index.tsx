
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DashboardSidebar } from './sidebar';
import { DashboardHeader } from './header';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'id' | 'en'>(
    localStorage.getItem('language') as 'id' | 'en' || 'en'
  );
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    const initializeUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }
        
        const userData = {
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || ''
        };
        
        if (mounted) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        if (mounted) {
          setIsLoading(false);
          navigate('/auth');
        }
      }
    };

    const savedLanguage = localStorage.getItem('language') as 'id' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    initializeUser();
    
    return () => {
      mounted = false;
      window.removeEventListener('resize', checkMobile);
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      toast.success(language === 'id' ? 'Berhasil keluar!' : 'Logged out successfully!');
      navigate('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(language === 'id' ? 'Gagal keluar. Silakan coba lagi.' : 'Failed to log out. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'id' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    toast.success(newLanguage === 'id' ? 'Bahasa diubah ke Indonesia' : 'Language changed to English');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-batik-dark bg-opacity-95 batik-overlay">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-batik-dark bg-opacity-95 batik-overlay">
      <DashboardSidebar 
        user={user}
        language={language}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        toggleLanguage={toggleLanguage}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          language={language}
        />

        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
