
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/layout';
import ItineraryBuilder from '@/components/dashboard/itinerary/itinerary-builder';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { TourItinerary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const ItineraryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState<TourItinerary | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please login to access this page');
        navigate('/auth');
        return;
      }

      // Get itinerary ID from URL if present
      const searchParams = new URLSearchParams(location.search);
      const itineraryId = searchParams.get('id');

      if (itineraryId) {
        try {
          console.log('Loading itinerary with ID:', itineraryId);
          const { data, error } = await supabase
            .from('itineraries')
            .select('*')
            .eq('id', itineraryId)
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching itinerary:', error);
            throw error;
          }

          if (data) {
            console.log('Loaded itinerary data:', data);
            // Parse JSON fields
            let parsedDays;
            let parsedGuides;
            
            try {
              parsedDays = typeof data.days === 'string' ? JSON.parse(data.days) : data.days;
              
              // Ensure each day has an activities array
              parsedDays = parsedDays.map((day: any) => ({
                ...day,
                activities: day.activities || []
              }));
            } catch (e) {
              console.error('Error parsing days:', e);
              parsedDays = [];
            }
            
            try {
              parsedGuides = typeof data.tour_guides === 'string' ? JSON.parse(data.tour_guides) : data.tour_guides;
            } catch (e) {
              console.error('Error parsing tour guides:', e);
              parsedGuides = [];
            }

            const itinerary: TourItinerary = {
              id: data.id,
              name: data.name,
              days: parsedDays,
              tourGuides: parsedGuides,
              totalPrice: data.total_price,
              numberOfPeople: data.number_of_people,
              start_date: data.start_date,
              user_id: data.user_id,
              created_at: data.created_at,
              updated_at: data.updated_at
            };

            console.log('Parsed itinerary:', itinerary);
            setSelectedItinerary(itinerary);
          }
        } catch (error) {
          console.error('Error loading itinerary:', error);
          toast.error('Failed to load the itinerary');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate, location.search]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      <ItineraryBuilder initialItinerary={selectedItinerary} />
    </DashboardLayout>
  );
};

export default ItineraryPage;
