
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TourItinerary } from '@/lib/types';
import { saveItineraryToSupabase, saveToGoogleCalendar } from './itinerary-utils';
import { exportItineraryToPdf } from '@/utils/pdf-exporter';
import { toast } from 'sonner';
import { Calendar, Download, FilePlus, Save } from 'lucide-react';

interface ItineraryHeaderProps {
  itinerary: TourItinerary;
  selectedDate: Date | undefined;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
}

const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
  itinerary,
  selectedDate,
  isSaving,
  setIsSaving
}) => {
  const navigate = useNavigate();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveItineraryToSupabase(itinerary, selectedDate, navigate);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportToCalendar = () => {
    saveToGoogleCalendar(itinerary);
  };

  const handleExportToPdf = () => {
    try {
      exportItineraryToPdf(itinerary);
      toast.success('Itinerary exported to PDF successfully');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export itinerary to PDF');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:p-6 rounded-lg border border-amber-100 shadow-sm">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-800">
          {itinerary.id ? 'Edit Itinerary' : 'Create New Itinerary'}
        </h1>
        <p className="text-amber-700 mt-1">
          Plan your perfect travel experience
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline" 
          className="text-amber-600 border-amber-300 hover:bg-amber-50"
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </Button>
        
        <Button
          variant="outline"
          className="bg-white border-amber-300 text-amber-600 hover:bg-amber-50"
          onClick={handleExportToCalendar}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Google Calendar
        </Button>
        
        <Button
          variant="outline"
          className="bg-white border-amber-300 text-amber-600 hover:bg-amber-50"
          onClick={handleExportToPdf}
        >
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {itinerary.id ? 'Update Itinerary' : 'Save Itinerary'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ItineraryHeader;
