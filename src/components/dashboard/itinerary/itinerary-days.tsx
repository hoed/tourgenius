
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DayItinerary } from '@/lib/types';
import { Plus } from 'lucide-react';
import DayItineraryComponent from './day-itinerary';

interface ItineraryDaysProps {
  days: DayItinerary[];
  onAddDay: () => void;
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
}

const ItineraryDays = ({
  days,
  onAddDay,
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
  onRemoveActivity
}: ItineraryDaysProps) => {
  return (
    <Tabs defaultValue={days[0]?.id} className="space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl border border-amber-200 shadow-sm">
        <h2 className="text-xl font-semibold text-amber-800">Day by Day Itinerary</h2>
        <Button 
          onClick={onAddDay}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
      </div>
      
      <TabsList className="bg-amber-50 border border-amber-200 flex justify-start overflow-x-auto rounded-lg p-1">
        {days.map((day) => (
          <TabsTrigger 
            key={day.id} 
            value={day.id} 
            className="min-w-[100px] text-amber-800 data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm hover:bg-amber-100 transition-all duration-300"
          >
            Day {day.day}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {days.map((day) => (
        <TabsContent key={day.id} value={day.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <DayItineraryComponent
            day={day}
            onRemoveDay={onRemoveDay}
            onAddDestination={onAddDestination}
            onRemoveDestination={onRemoveDestination}
            onSetHotel={onSetHotel}
            onAddMeal={onAddMeal}
            onRemoveMeal={onRemoveMeal}
            onSetTransportation={onSetTransportation}
            onAddTransportationItem={onAddTransportationItem}
            onRemoveTransportationItem={onRemoveTransportationItem}
            onAddActivity={onAddActivity}
            onRemoveActivity={onRemoveActivity}
            totalDays={days.length}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ItineraryDays;
