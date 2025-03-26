
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
    removeTourGuide
  } = useItinerary({ initialItinerary });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <ItineraryHeader 
        itinerary={itinerary}
        selectedDate={selectedDate}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
      />

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
      />
    </div>
  );
};

export default ItineraryBuilder;
