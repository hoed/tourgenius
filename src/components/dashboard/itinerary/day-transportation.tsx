
import React, { useState } from 'react';
import { Transportation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plane, Trash2, Plus, Train, Bus, Car, Ship } from 'lucide-react';
import { formatRupiah } from './itinerary-utils';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DayTransportationProps {
  dayId: string;
  transportation: Transportation | null;
  onSetTransportation: (dayId: string, description: string, price: number, type?: string) => void;
  onAddTransportationItem?: (dayId: string, type: string, description: string, price: number) => void;
  onRemoveTransportationItem?: (dayId: string, transportationId: string) => void;
}

const transportationIcons = {
  flight: <Plane className="h-4 w-4" />,
  train: <Train className="h-4 w-4" />,
  bus: <Bus className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  ferry: <Ship className="h-4 w-4" />
};

const DayTransportation = ({ 
  dayId, 
  transportation, 
  onSetTransportation,
  onAddTransportationItem,
  onRemoveTransportationItem
}: DayTransportationProps) => {
  const [transportDesc, setTransportDesc] = useState('');
  const [transportPrice, setTransportPrice] = useState('');
  const [transportType, setTransportType] = useState<'flight' | 'train' | 'bus' | 'car' | 'ferry'>('flight');
  
  // Updated to support multiple transportation items
  const handleAddTransportation = () => {
    if (!transportDesc.trim() || !transportPrice.trim()) {
      return;
    }
    
    if (onAddTransportationItem) {
      onAddTransportationItem(dayId, transportType, transportDesc, Number(transportPrice));
    } else {
      onSetTransportation(dayId, transportDesc, Number(transportPrice), transportType);
    }
    
    // Clear inputs after setting
    setTransportDesc('');
    setTransportPrice('');
  };

  // Get icon based on transportation type
  const getTransportIcon = (type: string) => {
    return transportationIcons[type as keyof typeof transportationIcons] || <Plane className="h-4 w-4" />;
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-amber-700">
        <Plane className="h-5 w-5" />
        Transportation
      </h3>
      
      {transportation && (
        <Card className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4 hover:bg-gray-100 transition-all duration-300">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {getTransportIcon(transportation.type)}
              <div>
                <p className="font-medium text-gray-900">{transportation.description}</p>
                <p className="text-sm text-gray-900">{formatRupiah(transportation.pricePerPerson)} (per day)</p>
              </div>
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
        </Card>
      )}
      
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Select 
            value={transportType} 
            onValueChange={(value) => setTransportType(value as any)}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flight">Flight</SelectItem>
              <SelectItem value="train">Train</SelectItem>
              <SelectItem value="bus">Bus</SelectItem>
              <SelectItem value="car">Car/Taxi</SelectItem>
              <SelectItem value="ferry">Ferry/Boat</SelectItem>
            </SelectContent>
          </Select>
          <div className="sm:col-span-2">
            <Input 
              value={transportDesc}
              onChange={(e) => setTransportDesc(e.target.value)}
              placeholder="Description" 
              className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" 
            />
          </div>
          <Input 
            value={transportPrice}
            onChange={(e) => setTransportPrice(e.target.value)}
            type="number" 
            placeholder="200000" 
            className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" 
          />
        </div>
        <Button 
          onClick={handleAddTransportation}
          className="bg-amber-400 text-gray-900 hover:bg-amber-500 transition-all duration-300"
          disabled={!transportDesc.trim() || !transportPrice.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transportation
        </Button>
      </div>
    </div>
  );
};

export default DayTransportation;
