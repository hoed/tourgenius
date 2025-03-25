
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TourItinerary, TourPlan } from '@/lib/types';
import DashboardLayout from '@/components/dashboard/layout';
import StatsCards from '@/components/dashboard/stats/stats-cards';
import TourPlansSection from '@/components/dashboard/tour-plans/tour-plans-section';
import ItinerariesSection from '@/components/dashboard/itineraries/itineraries-section';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [itineraries, setItineraries] = useState<TourItinerary[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [tourPlans, setTourPlans] = useState<TourPlan[]>([]);
  const [tourPlansLoading, setTourPlansLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please login to access dashboard');
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);
        // Fetch itineraries
        const { data: itinerariesData, error: itinerariesError } = await supabase
          .from('itineraries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (itinerariesError) {
          console.error('Error fetching itineraries:', itinerariesError);
          throw itinerariesError;
        }

        // Parse itineraries data
        const parsedItineraries = itinerariesData?.map(item => {
          let parsedDays, parsedGuides;
          
          try {
            parsedDays = typeof item.days === 'string' ? JSON.parse(item.days) : item.days;
          } catch (e) {
            console.error('Error parsing days for itinerary', item.id, ':', e);
            parsedDays = [];
          }
          
          try {
            parsedGuides = typeof item.tour_guides === 'string' ? JSON.parse(item.tour_guides) : item.tour_guides;
          } catch (e) {
            console.error('Error parsing tour_guides for itinerary', item.id, ':', e);
            parsedGuides = [];
          }

          return {
            id: item.id,
            name: item.name,
            days: parsedDays || [],
            tourGuides: parsedGuides || [],
            totalPrice: item.total_price,
            numberOfPeople: item.number_of_people,
            start_date: item.start_date,
            created_at: item.created_at,
            updated_at: item.updated_at,
            user_id: item.user_id
          };
        }) || [];

        setItineraries(parsedItineraries);

        // Fetch customer count
        const { count, error: customerError } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        if (customerError) {
          console.error('Error fetching customer count:', customerError);
          throw customerError;
        }

        setCustomerCount(count || 0);
        
        // Fetch tour plans
        setTourPlansLoading(true);
        const { data: tourPlansData, error: tourPlansError } = await supabase
          .from('tour_plans')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (tourPlansError) {
          console.error('Error fetching tour plans:', tourPlansError);
          throw tourPlansError;
        }
        
        setTourPlans(tourPlansData || []);
        setTourPlansLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Stats Cards */}
        <StatsCards 
          loading={loading} 
          itineraries={itineraries} 
          customerCount={customerCount}
        />

        {/* Tour Plans Section */}
        <TourPlansSection 
          tourPlans={tourPlans} 
          tourPlansLoading={tourPlansLoading} 
        />

        {/* Itineraries Section */}
        <ItinerariesSection 
          itineraries={itineraries} 
          loading={loading} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
