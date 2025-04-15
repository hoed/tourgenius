
import React from 'react';
import { TourItinerary } from '@/lib/types';
import { useItinerary } from '@/hooks/use-itinerary';
import ItineraryHeader from './itinerary-header';
import ItineraryContent from './itinerary-content';

interface ItineraryBuilderProps {
  initialItinerary?: TourItinerary | null;
}

const ItineraryBuilder = ({ initialItinerary }: ItineraryBuilderProps) => {
  const {
    itinerary,
    selectedDate,
    setSelectedDate,
    isSaving,
    setIsSaving,
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
    removeTourGuide,
    addActivity,
    removeActivity
  } = useItinerary({ initialItinerary });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-7xl">
      {/* Gradient background header using MindTrip-like styles */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 mb-8">
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10 p-8">
          <ItineraryHeader 
            itinerary={itinerary}
            selectedDate={selectedDate}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
          />
        </div>
      </div>

      {/* Content with updated styling inspired by MindTrip.ai */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <ItineraryContent 
          itinerary={itinerary}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          updateItineraryName={updateItineraryName}
          updateNumberOfPeople={updateNumberOfPeople}
          addDay={addDay}
          removeDay={removeDay}
          addDestination={addDestination}
          removeDestination={removeDestination}
          setHotel={setHotel}
          addMeal={addMeal}
          removeMeal={removeMeal}
          setTransportation={setTransportation}
          addTransportationItem={addTransportationItem}
          removeTransportationItem={removeTransportationItem}
          addTourGuide={addTourGuide}
          removeTourGuide={removeTourGuide}
          addActivity={addActivity}
          removeActivity={removeActivity}
        />
      </div>
    </div>
  );
};

export default ItineraryBuilder;
