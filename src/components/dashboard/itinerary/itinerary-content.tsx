
import React from 'react';
import { TourItinerary } from '@/lib/types';
import ItineraryInfo from './itinerary-info';
import TourGuidesSection from './tour-guides-section';
import ItineraryDays from './itinerary-days';
import PriceCalculator from '../pricing/price-calculator';

interface ItineraryContentProps {
  itinerary: TourItinerary;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  updateItineraryName: (name: string) => void;
  updateNumberOfPeople: (people: number) => void;
  addDay: () => void;
  removeDay: (dayId: string) => void;
  addDestination: (dayId: string, name: string, price: number, time?: string) => void;
  removeDestination: (dayId: string, destinationId: string) => void;
  setHotel: (dayId: string, name: string, location: string, stars: number, price: number, roomAmount: number, time?: string) => void;
  addMeal: (dayId: string, description: string, type: string, price: number, time?: string) => void;
  removeMeal: (dayId: string, mealId: string) => void;
  setTransportation: (dayId: string, description: string, price: number, type?: string, time?: string) => void;
  addTransportationItem?: (dayId: string, type: string, description: string, price: number, time?: string) => void;
  removeTransportationItem?: (dayId: string, transportationId: string) => void;
  addTourGuide: (name: string, expertise: string, pricePerDay: number) => void;
  removeTourGuide: (guideId: string) => void;
}

const ItineraryContent = ({
  itinerary,
  selectedDate,
  setSelectedDate,
  updateItineraryName,
  updateNumberOfPeople,
  addDay,
  removeDay,
  addDestination,
  removeDestination,
  setHotel,
  addMeal,
  removeMeal,
  setTransportation,
  addTransportationItem,
  removeTransportationItem,
  addTourGuide,
  removeTourGuide
}: ItineraryContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <ItineraryInfo
          name={itinerary.name}
          numberOfPeople={itinerary.numberOfPeople}
          selectedDate={selectedDate}
          onNameChange={updateItineraryName}
          onPeopleChange={updateNumberOfPeople}
          onDateChange={setSelectedDate}
        />

        <TourGuidesSection
          tourGuides={itinerary.tourGuides}
          onAddGuide={addTourGuide}
          onRemoveGuide={removeTourGuide}
        />

        <ItineraryDays
          days={itinerary.days}
          onAddDay={addDay}
          onRemoveDay={removeDay}
          onAddDestination={addDestination}
          onRemoveDestination={removeDestination}
          onSetHotel={setHotel}
          onAddMeal={addMeal}
          onRemoveMeal={removeMeal}
          onSetTransportation={setTransportation}
          onAddTransportationItem={addTransportationItem}
          onRemoveTransportationItem={removeTransportationItem}
        />
      </div>

      <div className="lg:col-span-1">
        <PriceCalculator itinerary={itinerary} />
      </div>
    </div>
  );
};

export default ItineraryContent;
