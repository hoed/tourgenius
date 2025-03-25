
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { TourItinerary, TourGuide } from '@/lib/types';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';

// Format currency in Rupiah
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date for Google Calendar
export const formatDateForGoogleCalendar = (date: string): string => {
  if (!date) return '';
  const formattedDate = format(new Date(date), 'yyyyMMdd');
  return formattedDate;
};

// Save to Google Calendar
export const saveToGoogleCalendar = (itinerary: TourItinerary): void => {
  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    toast.error('No itinerary data to save to calendar');
    return;
  }

  const startDate = itinerary.start_date || new Date().toISOString();
  const endDate =
    itinerary.days.length > 1
      ? new Date(
          new Date(startDate).setDate(
            new Date(startDate).getDate() + itinerary.days.length - 1
          )
        ).toISOString()
      : startDate;

  const title = encodeURIComponent(`Tour Itinerary: ${itinerary.name}`);
  let details = encodeURIComponent(`${itinerary.name}\n\nItinerary Details:\n`);

  itinerary.days.forEach((day, index) => {
    details += encodeURIComponent(`Day ${index + 1}:\n`);
    if (day.destinations && day.destinations.length > 0) {
      details += encodeURIComponent(
        `Destinations: ${day.destinations.map((d) => d.name).join(', ')}\n`
      );
    }
    if (day.hotel) {
      details += encodeURIComponent(`Hotel: ${day.hotel.name}\n`);
    }
    if (day.meals && day.meals.length > 0) {
      const meals = day.meals
        .map((meal) => {
          if (typeof meal === 'string') return meal;
          else if (meal && typeof meal === 'object' && 'type' in meal)
            return meal.type;
          return '';
        })
        .filter(Boolean);
      if (meals.length > 0) {
        details += encodeURIComponent(`Meals: ${meals.join(', ')}\n`);
      }
    }
    details += encodeURIComponent('\n');
  });

  const formattedStartDate = formatDateForGoogleCalendar(startDate);
  const formattedEndDate = formatDateForGoogleCalendar(endDate);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedStartDate}/${formattedEndDate}&details=${details}`;
  window.open(googleCalendarUrl, '_blank');
};

// Save itinerary to Supabase - Fixed to properly handle errors
export const saveItineraryToSupabase = async (
  itinerary: TourItinerary,
  selectedDate: Date | undefined,
  navigate: NavigateFunction
): Promise<void> => {
  try {
    // Validate required fields
    if (!itinerary.name.trim()) {
      toast.error('Itinerary name is required');
      return;
    }
    if (itinerary.numberOfPeople <= 0) {
      toast.error('Number of people must be greater than 0');
      return;
    }
    if (!selectedDate) {
      toast.error('Start date is required');
      return;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      toast.error('You must be logged in to save an itinerary');
      navigate('/auth');
      return;
    }

    const userId = session.user.id;
    const totalPrice = calculateTotalPrice(itinerary);

    const itineraryData = {
      user_id: userId,
      name: itinerary.name.trim(),
      start_date: selectedDate.toISOString(),
      number_of_people: itinerary.numberOfPeople,
      days: JSON.stringify(itinerary.days || []),
      tour_guides: JSON.stringify(itinerary.tourGuides || []),
      total_price: totalPrice,
      updated_at: new Date().toISOString(),
    };

    console.log('Attempting to save itineraryData:', itineraryData);

    let response;
    if (itinerary.id && itinerary.id.length > 10) {
      // Update existing itinerary
      response = await supabase
        .from('itineraries')
        .update(itineraryData)
        .eq('id', itinerary.id)
        .eq('user_id', userId)
        .select('*');
    } else {
      // Create new itinerary
      const newItineraryData = {
        ...itineraryData,
        created_at: new Date().toISOString()
      };
      
      response = await supabase
        .from('itineraries')
        .insert([newItineraryData])
        .select('*');
    }

    if (response.error) {
      console.error('Supabase error:', response.error);
      toast.error(`Failed to save itinerary: ${response.error.message}`);
      return;
    }

    console.log('Itinerary saved successfully:', response.data);
    toast.success(itinerary.id ? 'Itinerary updated successfully!' : 'Itinerary saved successfully!');
    
    // Navigate to the itinerary page with the new ID
    if (response.data && response.data.length > 0) {
      navigate(`/dashboard/itinerary?id=${response.data[0].id}`);
    }
  } catch (error) {
    console.error('Unexpected error in saveItineraryToSupabase:', error);
    toast.error(
      `An unexpected error occurred: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

// Calculate total price considering number of people and room amounts
export const calculateTotalPrice = (itinerary: TourItinerary): number => {
  if (!itinerary || !itinerary.days || itinerary.days.length === 0) return 0;

  const numPeople = itinerary.numberOfPeople || 1;

  const destinationsTotal = itinerary.days.reduce(
    (sum, day) =>
      sum +
      day.destinations.reduce(
        (daySum, dest) => daySum + dest.pricePerPerson * numPeople,
        0
      ),
    0
  );

  const hotelsTotal = itinerary.days.reduce(
    (sum, day) => {
      if (!day.hotel) return sum;
      // Calculate hotel price based on rooms needed
      const roomsNeeded = day.hotel.roomAmount || Math.ceil(numPeople / 2);
      return sum + (day.hotel.pricePerNight * roomsNeeded);
    },
    0
  );

  const mealsTotal = itinerary.days.reduce(
    (sum, day) =>
      sum +
      day.meals.reduce(
        (daySum, meal) => daySum + meal.pricePerPerson * numPeople,
        0
      ),
    0
  );

  const transportationTotal = itinerary.days.reduce(
    (sum, day) => {
      if (!day.transportation) return sum;
      // Transportation is per person
      return sum + (day.transportation.pricePerPerson * numPeople);
    },
    0
  );

  const guidesTotal = itinerary.tourGuides.reduce(
    (sum, guide) => sum + guide.pricePerDay * itinerary.days.length,
    0
  );

  const subtotal =
    destinationsTotal + hotelsTotal + mealsTotal + transportationTotal + guidesTotal;
  const serviceFee = subtotal * 0.1;
  const tax = subtotal * 0.05;

  return subtotal + serviceFee + tax;
};

// Add customer to database
export const addCustomerToDatabase = async (customerName: string, customerEmail: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error('You must be logged in to add customers');
      return false;
    }
    
    const { data: existingCustomers, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerEmail)
      .eq('user_id', session.user.id);
    
    if (fetchError) {
      console.error('Error checking for existing customer:', fetchError);
      return false;
    }
    
    if (!existingCustomers || existingCustomers.length === 0) {
      const { error } = await supabase
        .from('customers')
        .insert([{ 
          name: customerName, 
          email: customerEmail,
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error adding customer:', error);
        return false;
      }
      
      toast.success('New customer added to database');
      return true;
    } else {
      console.log('Customer already exists in database');
      return true;
    }
  } catch (error) {
    console.error('Error in addCustomerToDatabase:', error);
    return false;
  }
};
