
import React from 'react';
import { Destination } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Trash2, Plus, Clock } from 'lucide-react';
import { formatRupiah } from './itinerary-utils';

interface DayDestinationsProps {
  dayId: string;
  destinations: Destination[];
  onAddDestination: (dayId: string, name: string, price: number, time?: string) => void;
  onRemoveDestination: (dayId: string, destinationId: string) => void;
}

const DayDestinations = ({ 
  dayId, 
  destinations, 
  onAddDestination, 
  onRemoveDestination 
}: DayDestinationsProps) => {
  const handleAddDestination = () => {
    const name = (document.getElementById(`destination-name-${dayId}`) as HTMLInputElement).value;
    const price = Number((document.getElementById(`destination-price-${dayId}`) as HTMLInputElement).value);
    const time = (document.getElementById(`destination-time-${dayId}`) as HTMLInputElement).value;
    
    if (!name.trim()) return;
    
    onAddDestination(dayId, name, price, time);
    
    // Clear inputs after adding
    (document.getElementById(`destination-name-${dayId}`) as HTMLInputElement).value = '';
    (document.getElementById(`destination-price-${dayId}`) as HTMLInputElement).value = '';
    (document.getElementById(`destination-time-${dayId}`) as HTMLInputElement).value = '';
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-amber-700">
        <MapPin className="h-5 w-5" />
        Destinations
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {destinations.map((destination) => (
          <div key={destination.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{destination.name}</p>
              <p className="text-sm text-gray-900">{formatRupiah(destination.pricePerPerson)}/person</p>
              {destination.time && (
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {destination.time}
                </p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveDestination(dayId, destination.id)}
              className="ml-auto text-rose-600 hover:text-rose-700 hover:bg-rose-400/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input id={`destination-name-${dayId}`} placeholder="Destination name" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
        <Input id={`destination-price-${dayId}`} type="number" placeholder="100000" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
        <Input 
          id={`destination-time-${dayId}`} 
          placeholder="e.g. 09:00 AM" 
          className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" 
        />
      </div>
      <Button 
        onClick={handleAddDestination}
        className="mt-3 bg-amber-400 text-gray-900 hover:bg-amber-500 transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Destination
      </Button>
    </div>
  );
};

export default DayDestinations;
