
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Save } from 'lucide-react';
import { saveToGoogleCalendar, saveItineraryToSupabase } from './itinerary-utils';
import { TourItinerary } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ItineraryHeaderProps {
  itinerary: TourItinerary;
  selectedDate: Date | undefined;
  isSaving: boolean;
}

const ItineraryHeader = ({ itinerary, selectedDate, isSaving: propIsSaving }: ItineraryHeaderProps) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(propIsSaving);
  const [language, setLanguage] = useState<'id' | 'en'>(
    localStorage.getItem('language') as 'id' | 'en' || 'en'
  );

  const translations = {
    en: {
      title: 'Tour Itinerary Builder',
      subtitle: 'Craft your perfect journey with elegance',
      googleCalendar: 'Google Calendar',
      save: 'Save',
      saving: 'Saving...'
    },
    id: {
      title: 'Pembuat Rencana Perjalanan',
      subtitle: 'Rancang perjalanan sempurna Anda dengan elegan',
      googleCalendar: 'Google Calendar',
      save: 'Simpan',
      saving: 'Menyimpan...'
    }
  };

  const t = translations[language];

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveItineraryToSupabase(itinerary, selectedDate, navigate);
    } catch (error) {
      console.error('Error in handleSave:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoogleCalendar = () => {
    saveToGoogleCalendar(itinerary);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-md">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-gradient">
          {t.title}
        </h1>
        <p className="text-gray-600 mt-1">{t.subtitle}</p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={handleGoogleCalendar}
          className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-black transition-all duration-300 hover:scale-105 shadow-md"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          {t.googleCalendar}
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black transition-all duration-300 hover:scale-105 shadow-md"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? t.saving : t.save}
        </Button>
      </div>
    </div>
  );
};

export default ItineraryHeader;
