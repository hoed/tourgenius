
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  FileText, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  Globe,
  Users,
  X,
  Map
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getTranslations } from './translations';

interface DashboardSidebarProps {
  user: { name: string; email: string } | null;
  language: 'id' | 'en';
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  handleLogout: () => void;
  toggleLanguage: () => void;
}

export const DashboardSidebar = ({ 
  user, 
  language, 
  isSidebarOpen, 
  isMobile, 
  toggleSidebar, 
  handleLogout, 
  toggleLanguage 
}: DashboardSidebarProps) => {
  const location = useLocation();
  const t = getTranslations(language);

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

  return (
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
  );
};
