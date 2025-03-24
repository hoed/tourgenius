
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DayItinerary, TourItinerary } from '@/lib/types';
import ItineraryHeader from './itinerary-header';
import ItineraryInfo from './itinerary-info';
import TourGuidesSection from './tour-guides-section';
import ItineraryDays from './itinerary-days';
import PriceCalculator from '../pricing/price-calculator';

interface ItineraryBuilderProps {
  initialItinerary?: TourItinerary | null;
}

const ItineraryBuilder = ({ initialItinerary }: ItineraryBuilderProps) => {
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<TourItinerary>(() => {
    if (initialItinerary) {
      return initialItinerary;
    }
    
    return {
      id: Date.now().toString(),
      name: 'New Tour Itinerary',
      days: [{
        id: '1',
        day: 1,
        destinations: [],
        hotel: null,
        meals: [],
        transportation: null
      }],
      tourGuides: [],
      totalPrice: 0,
      numberOfPeople: 2
    };
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (initialItinerary?.start_date) {
      return new Date(initialItinerary.start_date);
    }
    return new Date();
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('You must be logged in to view itineraries');
          navigate('/auth');
          return;
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchItineraries();
  }, [navigate]);

  // Itinerary info handlers
  const updateItineraryName = (name: string) => {
    setItinerary((prev) => ({ ...prev, name }));
  };

  const updateNumberOfPeople = (people: number) => {
    setItinerary((prev) => ({ ...prev, numberOfPeople: people }));
  };

  // Day management handlers
  const addDay = () => {
    const newDay: DayItinerary = {
      id: Date.now().toString(),
      day: itinerary.days.length + 1,
      destinations: [],
      hotel: null,
      meals: [],
      transportation: null
    };
    setItinerary((prev) => ({ ...prev, days: [...prev.days, newDay] }));
  };

  const removeDay = (dayId: string) => {
    if (itinerary.days.length <= 1) return;
    const updatedDays = itinerary.days
      .filter(day => day.id !== dayId)
      .map((day, index) => ({ ...day, day: index + 1 }));
    setItinerary((prev) => ({ ...prev, days: updatedDays }));
  };

  // Destination handlers
  const addDestination = (dayId: string, name: string, price: number) => {
    if (!name.trim()) return;
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            destinations: [
              ...day.destinations,
              {
                id: Date.now().toString(),
                name,
                description: name,
                pricePerPerson: price,
                image: undefined
              }
            ]
          };
        }
        return day;
      })
    }));
  };

  const removeDestination = (dayId: string, destinationId: string) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            destinations: day.destinations.filter(d => d.id !== destinationId)
          };
        }
        return day;
      })
    }));
  };

  // Hotel handlers
  const setHotel = (dayId: string, name: string, location: string, stars: number, price: number) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            hotel: name.trim() ? {
              id: Date.now().toString(),
              name,
              location,
              stars,
              pricePerNight: price,
              image: undefined
            } : null
          };
        }
        return day;
      })
    }));
  };

  // Meal handlers
  const addMeal = (dayId: string, description: string, type: string, price: number) => {
    if (!description.trim()) return;
    let mealType: 'breakfast' | 'lunch' | 'dinner' = 'lunch';
    if (type.toLowerCase() === 'breakfast') mealType = 'breakfast';
    else if (type.toLowerCase() === 'dinner') mealType = 'dinner';
    
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            meals: [
              ...day.meals,
              {
                id: Date.now().toString(),
                description,
                type: mealType,
                pricePerPerson: price
              }
            ]
          };
        }
        return day;
      })
    }));
  };

  const removeMeal = (dayId: string, mealId: string) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            meals: day.meals.filter(m => m.id !== mealId)
          };
        }
        return day;
      })
    }));
  };

  // Transportation handlers
  const setTransportation = (dayId: string, description: string, price: number) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            transportation: description.trim() ? {
              id: Date.now().toString(),
              description,
              pricePerPerson: price,
              type: 'car'
            } : null
          };
        }
        return day;
      })
    }));
  };

  // Tour guide handlers
  const addTourGuide = (name: string, expertise: string, pricePerDay: number) => {
    if (!name.trim()) return;
    if (itinerary.tourGuides.some(g => g.name.toLowerCase() === name.toLowerCase())) {
      toast.error('A guide with this name already exists');
      return;
    }
    
    setItinerary((prev) => ({
      ...prev,
      tourGuides: [
        ...prev.tourGuides,
        {
          id: Date.now().toString(),
          name,
          expertise,
          pricePerDay,
          languages: []
        }
      ]
    }));
  };

  const removeTourGuide = (guideId: string) => {
    setItinerary((prev) => ({
      ...prev,
      tourGuides: prev.tourGuides.filter(g => g.id !== guideId)
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <ItineraryHeader 
        itinerary={itinerary}
        selectedDate={selectedDate}
        isSaving={isSaving}
      />

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
          />
        </div>

        <div className="lg:col-span-1">
          <PriceCalculator itinerary={itinerary} />
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
