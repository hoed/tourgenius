
import React from 'react';
import { DayItinerary } from '@/lib/types';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Trash2 } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import DayDestinations from './day-destinations';
import DayHotel from './day-hotel';
import DayMeals from './day-meals';
import DayTransportation from './day-transportation';
import DayActivities from './day-activities';

interface DayItineraryProps {
  day: DayItinerary;
  onRemoveDay: (dayId: string) => void;
  onAddDestination: (dayId: string, name: string, price: number, time?: string) => void;
  onRemoveDestination: (dayId: string, destinationId: string) => void;
  onSetHotel: (dayId: string, name: string, location: string, stars: number, price: number, roomAmount: number, time?: string) => void;
  onAddMeal: (dayId: string, description: string, type: string, price: number, time?: string) => void;
  onRemoveMeal: (dayId: string, mealId: string) => void;
  onSetTransportation: (dayId: string, description: string, price: number, type?: string, time?: string) => void;
  onAddTransportationItem?: (dayId: string, type: string, description: string, price: number, time?: string) => void;
  onRemoveTransportationItem?: (dayId: string, transportationId: string) => void;
  onAddActivity?: (dayId: string, name: string, description: string, price: number, time?: string) => void;
  onRemoveActivity?: (dayId: string, activityId: string) => void;
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
  onAddActivity,
  onRemoveActivity,
  totalDays
}: DayItineraryProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-700">
          <CalendarIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Day {day.day}</h2>
        </div>
        {totalDays > 1 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRemoveDay(day.id)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Day
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DayDestinations
          dayId={day.id}
          destinations={day.destinations}
          onAddDestination={onAddDestination}
          onRemoveDestination={onRemoveDestination}
        />
        
        <DayActivities
          dayId={day.id}
          activities={day.activities}
          onAddActivity={onAddActivity || (() => {})}
          onRemoveActivity={onRemoveActivity || (() => {})}
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
      </div>
    </div>
  );
};

export default DayItineraryComponent;
