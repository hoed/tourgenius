import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { TourItinerary, TourGuide } from '@/lib/types';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';

// Function to format currency in Rupiah
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Function to format date for Google Calendar
export const formatDateForGoogleCalendar = (date: string): string => {
  if (!date) return '';
  const formattedDate = format(new Date(date), 'yyyyMMdd');
  return formattedDate;
};

// Function to save to Google Calendar
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

// Function to save itinerary to Supabase
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

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session?.user) {
      toast.error('You must be logged in to save an itinerary');
      navigate('/auth');
      return;
    }

    const totalPrice = calculateTotalPrice(itinerary);

    const itineraryData = {
      id: itinerary.id && itinerary.id.length > 10 ? itinerary.id : undefined,
      user_id: session.user.id,
      name: itinerary.name.trim(),
      start_date: selectedDate.toISOString(),
      number_of_people: itinerary.numberOfPeople,
      days: JSON.stringify(itinerary.days || []),
      tour_guides: JSON.stringify(itinerary.tourGuides || []),
      total_price: totalPrice,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Attempting to save itineraryData:', itineraryData);

    if (itinerary.id && itinerary.id.length > 10) {
      const { data, error } = await supabase
        .from('itineraries')
        .update(itineraryData)
        .eq('id', itinerary.id)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        toast.error(`Failed to update itinerary: ${error.message} (Code: ${error.code})`);
        return;
      }

      toast.success('Itinerary updated successfully!');
      navigate(`/dashboard/itinerary/${data.id}`);
    } else {
      const { data, error } = await supabase
        .from('itineraries')
        .insert([itineraryData])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        toast.error(`Failed to save itinerary: ${error.message} (Code: ${error.code})`);
        return;
      }

      toast.success('Itinerary saved successfully!');
      navigate(`/dashboard/itinerary/${data.id}`);
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

// Function to calculate total price considering number of people
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
    (sum, day) => sum + (day.hotel ? day.hotel.pricePerNight : 0),
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
    (sum, day) => sum + (day.transportation ? day.transportation.pricePerPerson : 0),
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