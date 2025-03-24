
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { TourItinerary, TourGuide } from '@/lib/types';
import { toast } from 'sonner';

// Function to format currency in Rupiah
export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Function to format date for Google Calendar
export const formatDateForGoogleCalendar = (date: string) => {
  if (!date) return '';
  const formattedDate = format(new Date(date), 'yyyyMMdd');
  return formattedDate;
};

// Function to save to Google Calendar
export const saveToGoogleCalendar = (itinerary: TourItinerary) => {
  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    toast.error('No itinerary data to save to calendar');
    return;
  }

  // Find the first and last day to determine event duration
  const startDate = itinerary.start_date || new Date().toISOString();
  const endDate = itinerary.days.length > 1 
    ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + itinerary.days.length - 1)).toISOString()
    : startDate;

  // Create summary of the itinerary
  const title = encodeURIComponent(`Tour Itinerary: ${itinerary.name}`);
  let details = encodeURIComponent(`${itinerary.name}\n\nItinerary Details:\n`);

  itinerary.days.forEach((day, index) => {
    details += encodeURIComponent(`Day ${index + 1}:\n`);
    
    // Add destinations
    if (day.destinations && day.destinations.length > 0) {
      details += encodeURIComponent(`Destinations: ${day.destinations.map(d => d.name).join(', ')}\n`);
    }
    
    // Add hotel
    if (day.hotel) {
      details += encodeURIComponent(`Hotel: ${day.hotel.name}\n`);
    }
    
    // Add meals
    if (day.meals && day.meals.length > 0) {
      const meals = day.meals.map(meal => {
        if (typeof meal === 'string') {
          return meal;
        } else if (meal && typeof meal === 'object' && 'type' in meal) {
          return meal.type;
        }
        return '';
      }).filter(Boolean);
      
      if (meals.length > 0) {
        details += encodeURIComponent(`Meals: ${meals.join(', ')}\n`);
      }
    }
    
    details += encodeURIComponent('\n');
  });

  // Format dates for Google Calendar
  const formattedStartDate = formatDateForGoogleCalendar(startDate);
  const formattedEndDate = formatDateForGoogleCalendar(endDate);

  // Create Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedStartDate}/${formattedEndDate}&details=${details}`;

  // Open in a new tab
  window.open(googleCalendarUrl, '_blank');
};

// Function to save itinerary to Supabase
export const saveItineraryToSupabase = async (
  itinerary: TourItinerary, 
  selectedDate: Date | undefined, 
  navigate: any
) => {
  try {
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error('You must be logged in to save an itinerary');
      navigate('/auth');
      return;
    }

    // Calculate the total price considering number of people
    const totalPrice = calculateTotalPrice(itinerary);

    // Format data for DB
    const itineraryData = {
      user_id: session.user.id,
      name: itinerary.name,
      start_date: selectedDate ? selectedDate.toISOString() : null,
      number_of_people: itinerary.numberOfPeople,
      days: JSON.stringify(itinerary.days),
      tour_guides: JSON.stringify(itinerary.tourGuides),
      total_price: totalPrice
    };
    
    // Save to DB
    const { error } = await supabase
      .from('itineraries')
      .insert([itineraryData]);
    
    if (error) {
      console.error('Error saving itinerary:', error);
      toast.error('Failed to save itinerary');
      return;
    }
    
    toast.success('Itinerary saved successfully!');
    
  } catch (error) {
    console.error('Error in saveItineraryToSupabase:', error);
    toast.error('An error occurred while saving the itinerary');
  }
};

// Function to calculate total price considering number of people
export const calculateTotalPrice = (itinerary: TourItinerary): number => {
  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return 0;
  }

  const numPeople = itinerary.numberOfPeople || 1;

  // Calculate destinations total
  const destinationsTotal = itinerary.days.reduce((sum, day) => {
    return sum + day.destinations.reduce((daySum, dest) => 
      daySum + dest.pricePerPerson * numPeople, 0);
  }, 0);

  // Calculate hotels total
  const hotelsTotal = itinerary.days.reduce((sum, day) => {
    return sum + (day.hotel ? day.hotel.pricePerNight : 0);
  }, 0);

  // Calculate meals total
  const mealsTotal = itinerary.days.reduce((sum, day) => {
    return sum + day.meals.reduce((daySum, meal) => 
      daySum + meal.pricePerPerson * numPeople, 0);
  }, 0);

  // Calculate transportation total
  const transportationTotal = itinerary.days.reduce((sum, day) => {
    return sum + (day.transportation ? 
      day.transportation.pricePerPerson * numPeople : 0);
  }, 0);

  // Calculate guides total
  const guidesTotal = itinerary.tourGuides.reduce((sum, guide) => {
    return sum + guide.pricePerDay * itinerary.days.length;
  }, 0);

  // Calculate subtotal
  const subtotal = destinationsTotal + hotelsTotal + mealsTotal + 
                  transportationTotal + guidesTotal;
  
  // Add 10% service fee
  const serviceFee = subtotal * 0.1;
  
  // Add 5% tax
  const tax = subtotal * 0.05;
  
  // Calculate total
  return subtotal + serviceFee + tax;
};
