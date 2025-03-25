import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/landing/footer';
import { 
  Calendar, 
  FileText, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  User,
  Users,
  X,
  Globe,
  Map
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const location = useLocation();

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

  const translations = {
    en: {
      dashboard: 'Dashboard',
      itinerary: 'Itinerary',
      invoices: 'Invoices',
      customers: 'Customers',
      settings: 'Settings',
      logout: 'Logout',
      tourGenius: 'TourGenius',
      tourPlans: 'Tour Plans'
    },
    id: {
      dashboard: 'Dasbor',
      itinerary: 'Rencana Perjalanan',
      invoices: 'Faktur',
      customers: 'Pelanggan',
      settings: 'Pengaturan',
      logout: 'Keluar',
      tourGenius: 'TourGenius',
      tourPlans: 'Paket Wisata'
    }
  };

  const t = translations[language];

  const navItems = [
    { path: '/dashboard', label: t.dashboard, icon: <Home className="h-5 w-5" /> },
    { path: '/dashboard/tour-plans', label: t.tourPlans, icon: <Map className="h-5 w-5" /> },
    { path: '/dashboard/itinerary', label: t.itinerary, icon: <Calendar className="h-5 w-5" /> },
    { path: '/dashboard/invoices', label: t.invoices, icon: <FileText className="h-5 w-5" /> },
    { path: '/dashboard/customers', label: t.customers, icon: <Users className="h-5 w-5" /> },
    { path: '/dashboard/settings', label: t.settings, icon: <Settings className="h-5 w-5" /> },
  ];
  
  const isActivePath = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
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
      <aside 
        className={`fixed inset-y-0 left-0 z-40 lg:relative transition-all duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-20'
        } w-64 lg:translate-x-0 bg-sidebar border-r border-border/20 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            {isSidebarOpen && (
              <span className="text-xl font-bold text-white">{t.tourGenius}</span>
            )}
            {!isSidebarOpen && (
              <span className="text-xl font-bold text-white">TG</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:flex hidden text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <Separator />
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        <Separator />
        
        <div className="p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="mb-4 w-full flex items-center justify-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {isSidebarOpen && (
              <span>{language === 'en' ? 'Bahasa Indonesia' : 'English'}</span>
            )}
          </Button>
          
          {user && (
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {isSidebarOpen && (
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              )}
            </div>
          )}
          
          <Button
            variant="outline"
            size={isSidebarOpen ? "default" : "icon"}
            onClick={handleLogout}
            className={`${isSidebarOpen ? 'w-full' : 'w-10 h-10'}`}
          >
            <LogOut className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">{t.logout}</span>}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center bg-batik-dark/90 backdrop-blur-md h-16 px-4 border-b border-border/20 lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 font-bold text-white">{t.tourGenius}</div>
        </header>

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
