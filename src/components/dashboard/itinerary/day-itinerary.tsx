
import React from 'react';
import { DayItinerary, Transportation } from '@/lib/types';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Trash2 } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import DayDestinations from './day-destinations';
import DayHotel from './day-hotel';
import DayMeals from './day-meals';
import DayTransportation from './day-transportation';

interface DayItineraryProps {
  day: DayItinerary;
  onRemoveDay: (dayId: string) => void;
  onAddDestination: (dayId: string, name: string, price: number) => void;
  onRemoveDestination: (dayId: string, destinationId: string) => void;
  onSetHotel: (dayId: string, name: string, location: string, stars: number, price: number) => void;
  onAddMeal: (dayId: string, description: string, type: string, price: number) => void;
  onRemoveMeal: (dayId: string, mealId: string) => void;
  onSetTransportation: (dayId: string, description: string, price: number, type?: string) => void;
  onAddTransportationItem?: (dayId: string, type: string, description: string, price: number) => void;
  onRemoveTransportationItem?: (dayId: string, transportationId: string) => void;
  totalDays: number;
}

const DayItineraryComponent = ({
  day,
  onRemoveDay,
  onAddDestination,
  onRemoveDestination,
  onSetHotel,
  onAddMeal,
  onRemoveMeal,
  onSetTransportation,
  onAddTransportationItem,
  onRemoveTransportationItem,
  totalDays
}: DayItineraryProps) => {
  return (
    <GlassCard className="bg-white border border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <CalendarIcon className="h-5 w-5" />
            Day {day.day}
          </CardTitle>
          {totalDays > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveDay(day.id)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-400/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <DayDestinations
          dayId={day.id}
          destinations={day.destinations}
          onAddDestination={onAddDestination}
          onRemoveDestination={onRemoveDestination}
        />
        
        <DayHotel
          dayId={day.id}
          hotel={day.hotel}
          onSetHotel={onSetHotel}
        />
        
        <DayMeals
          dayId={day.id}
          meals={day.meals}
          onAddMeal={onAddMeal}
          onRemoveMeal={onRemoveMeal}
        />
        
        <DayTransportation
          dayId={day.id}
          transportation={day.transportation}
          transportationItems={day.transportationItems}
          onSetTransportation={onSetTransportation}
          onAddTransportationItem={onAddTransportationItem}
          onRemoveTransportationItem={onRemoveTransportationItem}
        />
      </CardContent>
    </GlassCard>
  );
};

export default DayItineraryComponent;
