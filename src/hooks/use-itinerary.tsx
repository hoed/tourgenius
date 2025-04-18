import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { TourItinerary, DayItinerary, Transportation, Activity } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface UseItineraryProps {
  initialItinerary?: TourItinerary | null;
}

export const useItinerary = ({ initialItinerary }: UseItineraryProps) => {
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<TourItinerary>(() => {
    if (initialItinerary) {
      return initialItinerary;
    }
    
    return {
      id: '',
      name: 'New Tour Itinerary',
      start_date: new Date().toISOString(),
      days: [{
        id: Date.now().toString(),
        day: 1,
        destinations: [],
        hotel: null,
        meals: [],
        transportation: null,
        transportationItems: [],
        activities: []
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
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('You must be logged in to view itineraries');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast.error('Failed to verify authentication');
      }
    };

    checkAuth();
  }, [navigate]);

  const updateItineraryName = (name: string) => {
    setItinerary((prev) => ({ ...prev, name }));
  };

  const updateNumberOfPeople = (people: number) => {
    setItinerary((prev) => ({ ...prev, numberOfPeople: people }));
  };

  const addDay = () => {
    const newDay: DayItinerary = {
      id: Date.now().toString(),
      day: itinerary.days.length + 1,
      destinations: [],
      hotel: null,
      meals: [],
      transportation: null,
      transportationItems: [],
      activities: []
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

  const addDestination = (dayId: string, name: string, price: number, time?: string) => {
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
                image: undefined,
                time
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

  const setHotel = (dayId: string, name: string, location: string, stars: number, price: number, roomAmount: number = 0, time?: string) => {
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
              roomAmount: roomAmount || Math.ceil(prev.numberOfPeople / 2),
              image: undefined,
              time
            } : null
          };
        }
        return day;
      })
    }));
  };

  const addMeal = (dayId: string, description: string, type: string, price: number, time?: string) => {
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
                pricePerPerson: price,
                time
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

  const setTransportation = (dayId: string, description: string, price: number, type: string = 'car', time?: string) => {
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
              type: type as 'flight' | 'train' | 'bus' | 'car' | 'ferry',
              time
            } : null
          };
        }
        return day;
      })
    }));
  };

  const addTransportationItem = (dayId: string, type: string, description: string, price: number, time?: string) => {
    if (!description.trim()) return;
    
    const newTransportation: Transportation = {
      id: Date.now().toString(),
      type: type as 'flight' | 'train' | 'bus' | 'car' | 'ferry',
      description,
      pricePerPerson: price,
      time
    };
    
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            transportationItems: [...(day.transportationItems || []), newTransportation]
          };
        }
        return day;
      })
    }));
  };

  const removeTransportationItem = (dayId: string, transportationId: string) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId && day.transportationItems) {
          return {
            ...day,
            transportationItems: day.transportationItems.filter(t => t.id !== transportationId)
          };
        }
        return day;
      })
    }));
  };

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

  const addActivity = (dayId: string, name: string, description: string, price: number, time?: string) => {
    if (!name.trim()) return;
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: [
              ...day.activities,
              {
                id: Date.now().toString(),
                name,
                description,
                pricePerPerson: price,
                time
              }
            ]
          };
        }
        return day;
      })
    }));
  };

  const removeActivity = (dayId: string, activityId: string) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.filter(a => a.id !== activityId)
          };
        }
        return day;
      })
    }));
  };

  return {
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
  };
};
