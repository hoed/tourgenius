
import React from 'react';
import { Hotel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HotelIcon, Trash2, Plus } from 'lucide-react';
import { formatRupiah } from './itinerary-utils';

interface DayHotelProps {
  dayId: string;
  hotel: Hotel | null;
  onSetHotel: (dayId: string, name: string, location: string, stars: number, price: number, roomAmount: number) => void;
}

const DayHotel = ({ dayId, hotel, onSetHotel }: DayHotelProps) => {
  const handleSetHotel = () => {
    const name = (document.getElementById(`hotel-name-${dayId}`) as HTMLInputElement).value;
    const location = (document.getElementById(`hotel-location-${dayId}`) as HTMLInputElement).value;
    const stars = Number((document.getElementById(`hotel-stars-${dayId}`) as HTMLInputElement).value);
    const price = Number((document.getElementById(`hotel-price-${dayId}`) as HTMLInputElement).value);
    const roomAmount = Number((document.getElementById(`hotel-rooms-${dayId}`) as HTMLInputElement).value);
    
    onSetHotel(dayId, name, location, stars, price, roomAmount);
    
    // Clear inputs after setting
    if (name.trim()) {
      (document.getElementById(`hotel-name-${dayId}`) as HTMLInputElement).value = '';
      (document.getElementById(`hotel-location-${dayId}`) as HTMLInputElement).value = '';
      (document.getElementById(`hotel-stars-${dayId}`) as HTMLInputElement).value = '';
      (document.getElementById(`hotel-price-${dayId}`) as HTMLInputElement).value = '';
      (document.getElementById(`hotel-rooms-${dayId}`) as HTMLInputElement).value = '';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-amber-700">
        <HotelIcon className="h-5 w-5" />
        Accommodation
      </h3>
      {hotel && (
        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4 hover:bg-gray-100 transition-all duration-300">
          <div>
            <p className="font-medium text-gray-900">{hotel.name}</p>
            <p className="text-sm text-gray-600">{hotel.location} - {hotel.stars} Stars</p>
            <p className="text-sm text-gray-700">{hotel.roomAmount || 1} rooms at {formatRupiah(hotel.pricePerNight)}/night</p>
            <p className="text-sm text-gray-900">Total: {formatRupiah(hotel.pricePerNight * (hotel.roomAmount || 1))}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onSetHotel(dayId, '', '', 0, 0, 0)}
            className="ml-auto text-rose-600 hover:text-rose-700 hover:bg-rose-400/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <Input id={`hotel-name-${dayId}`} placeholder="Hotel name" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
        <Input id={`hotel-location-${dayId}`} placeholder="Location" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
        <Input id={`hotel-stars-${dayId}`} type="number" min="1" max="5" placeholder="3" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
        <Input id={`hotel-price-${dayId}`} type="number" placeholder="500000" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
        <Input id={`hotel-rooms-${dayId}`} type="number" min="1" placeholder="Rooms" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
      </div>
      <Button 
        onClick={handleSetHotel}
        className="mt-3 bg-amber-400 text-gray-900 hover:bg-amber-500 transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        Set Hotel
      </Button>
    </div>
  );
};

export default DayHotel;
