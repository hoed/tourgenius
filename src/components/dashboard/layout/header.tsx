
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { getTranslations } from './translations';

interface DashboardHeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
  language: 'id' | 'en';
}

export const DashboardHeader = ({ 
  toggleSidebar, 
  isMobile, 
  language 
}: DashboardHeaderProps) => {
  const t = getTranslations(language);

  return (
    <header className="sticky top-0 z-30 flex items-center bg-batik-dark/90 backdrop-blur-md h-16 px-4 border-b border-border/20 lg:hidden">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="ml-4 font-bold text-white">{t.tourGenius}</div>
    </header>
  );
};
