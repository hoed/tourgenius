import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Save } from 'lucide-react';
import { saveToGoogleCalendar, saveItineraryToSupabase } from './itinerary-utils'; // Verify this path
import { TourItinerary } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ItineraryHeaderProps {
  itinerary: TourItinerary;
  selectedDate: Date | undefined;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
}

const ItineraryHeader = ({ itinerary, selectedDate, isSaving, setIsSaving }: ItineraryHeaderProps) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'id' | 'en'>(
    localStorage.getItem('language') as 'id' | 'en' || 'en'
  );

  const translations = {
    en: {
      title: 'Tour Itinerary Builder',
      subtitle: 'Craft your perfect journey with elegance',
      googleCalendar: 'Google Calendar',
      save: 'Save',
      saving: 'Saving...',
      saveSuccess: 'Itinerary saved successfully!',
      saveError: 'Failed to save itinerary. Please try again.',
      validationError: 'Please fill in all required fields (name, number of people, start date).'
    },
    id: {
      title: 'Pembuat Rencana Perjalanan',
      subtitle: 'Rancang perjalanan sempurna Anda dengan elegan',
      googleCalendar: 'Google Calendar',
      save: 'Simpan',
      saving: 'Menyimpan...',
      saveSuccess: 'Rencana perjalanan berhasil disimpan!',
      saveError: 'Gagal menyimpan rencana perjalanan. Silakan coba lagi.',
      validationError: 'Harap isi semua bidang yang diperlukan (nama, jumlah orang, tanggal mulai).'
    }
  };

  const t = translations[language];

  const handleSave = async () => {
    if (!itinerary.name.trim() || itinerary.numberOfPeople <= 0 || !selectedDate) {
      toast.error(t.validationError);
      return;
    }

    try {
      setIsSaving(true);
      await saveItineraryToSupabase(itinerary, selectedDate, navigate);
      toast.success(t.saveSuccess);
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error(`${t.saveError} Details: ${error instanceof Error ? error.message : 'Unknown error'}`);
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