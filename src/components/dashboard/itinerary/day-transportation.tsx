
import React from 'react';
import { Transportation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plane, Trash2, Plus } from 'lucide-react';
import { formatRupiah } from './itinerary-utils';

interface DayTransportationProps {
  dayId: string;
  transportation: Transportation | null;
  onSetTransportation: (dayId: string, description: string, price: number) => void;
}

const DayTransportation = ({ 
  dayId, 
  transportation, 
  onSetTransportation 
}: DayTransportationProps) => {
  const handleSetTransportation = () => {
    const desc = (document.getElementById(`transport-desc-${dayId}`) as HTMLInputElement).value;
    const price = Number((document.getElementById(`transport-price-${dayId}`) as HTMLInputElement).value);
    
    onSetTransportation(dayId, desc, price);
    
    // Clear inputs after setting
    if (desc.trim()) {
      (document.getElementById(`transport-desc-${dayId}`) as HTMLInputElement).value = '';
      (document.getElementById(`transport-price-${dayId}`) as HTMLInputElement).value = '';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-amber-700">
        <Plane className="h-5 w-5" />
        Transportation
      </h3>
      {transportation && (
        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4 hover:bg-gray-100 transition-all duration-300">
          <div>
            <p className="font-medium text-gray-900">{transportation.description}</p>
            <p className="text-sm text-gray-900">{formatRupiah(transportation.pricePerPerson)}/day</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onSetTransportation(dayId, '', 0)}
            className="ml-auto text-rose-600 hover:text-rose-700 hover:bg-rose-400/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input id={`transport-desc-${dayId}`} placeholder="Description" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
        <Input id={`transport-price-${dayId}`} type="number" placeholder="200000" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
      </div>
      <Button 
        onClick={handleSetTransportation}
        className="mt-3 bg-amber-400 text-gray-900 hover:bg-amber-500 transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        Set Transportation
      </Button>
    </div>
  );
};

export default DayTransportation;
