
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import { CalendarIcon, FileText, Users, Settings, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TourItinerary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState<TourItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'id' | 'en'>(
    localStorage.getItem('language') as 'id' | 'en' || 'en'
  );

  const translations = {
    en: {
      title: 'Dashboard',
      subtitle: 'Your tour itineraries at a glance',
      createItinerary: 'Create New Itinerary',
      noItineraries: 'No itineraries created yet.',
      name: 'Name',
      startDate: 'Start Date',
      numberOfPeople: 'Number of People',
      totalPrice: 'Total Price',
      days: 'Days',
      tourGuides: 'Tour Guides',
      view: 'View',
    },
    id: {
      title: 'Dasbor',
      subtitle: 'Rencana perjalanan wisata Anda sekilas',
      createItinerary: 'Buat Rencana Perjalanan Baru',
      noItineraries: 'Belum ada rencana perjalanan yang dibuat.',
      name: 'Nama',
      startDate: 'Tanggal Mulai',
      numberOfPeople: 'Jumlah Orang',
      totalPrice: 'Total Harga',
      days: 'Hari',
      tourGuides: 'Pemandu Wisata',
      view: 'Lihat',
    },
  };

  const t = translations[language];

  useEffect(() => {
    let mounted = true;
    
    const fetchItineraries = async () => {
      if (!mounted) return;
      
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/auth');
          return;
        }
        
        const { data, error } = await supabase
          .from('itineraries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching itineraries:', error);
          toast.error('Failed to load your itineraries');
          setLoading(false);
          return;
        }
        
        // Parse JSON fields and convert to TourItinerary structure
        const parsedData = data.map(item => {
          let parsedDays;
          let parsedGuides;
          
          try {
            parsedDays = typeof item.days === 'string' ? JSON.parse(item.days) : item.days;
          } catch (e) {
            console.error('Error parsing days:', e);
            parsedDays = [];
          }
          
          try {
            parsedGuides = typeof item.tour_guides === 'string' ? JSON.parse(item.tour_guides) : item.tour_guides;
          } catch (e) {
            console.error('Error parsing tour guides:', e);
            parsedGuides = [];
          }
          
          return {
            id: item.id,
            name: item.name,
            days: parsedDays,
            tourGuides: parsedGuides,
            totalPrice: item.total_price,
            numberOfPeople: item.number_of_people,
            start_date: item.start_date,
            created_at: item.created_at,
            updated_at: item.updated_at,
            user_id: item.user_id
          };
        });
        
        if (mounted) {
          console.log('Loaded itineraries:', parsedData);
          setItineraries(parsedData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Dashboard error:', error);
        if (mounted) {
          toast.error('An error occurred while loading the dashboard');
          setLoading(false);
        }
      }
    };
    
    fetchItineraries();
    
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleCreateItinerary = () => {
    navigate('/dashboard/itinerary');
  };

  const handleViewItinerary = (itineraryId: string) => {
    navigate(`/dashboard/itinerary?id=${itineraryId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <Button onClick={handleCreateItinerary} className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black transition-all duration-300 hover:scale-105 shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          {t.createItinerary}
        </Button>

        <Separator />

        {loading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-gray-100 border-gray-200 shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-24 mt-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : itineraries.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
              <Card key={itinerary.id} className="bg-gray-100 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>{itinerary.name}</CardTitle>
                  <CardDescription>
                    {t.startDate}: {itinerary.start_date ? new Date(itinerary.start_date).toLocaleDateString() : 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><span className="font-medium">{t.numberOfPeople}:</span> {itinerary.numberOfPeople}</p>
                  <p><span className="font-medium">{t.days}:</span> {itinerary.days?.length || 0}</p>
                  <p><span className="font-medium">{t.tourGuides}:</span> {itinerary.tourGuides?.length || 0}</p>
                  <p><span className="font-medium">{t.totalPrice}:</span> {formatRupiah(itinerary.totalPrice || 0)}</p>
                  <Button 
                    variant="secondary" 
                    className="w-full mt-4 bg-amber-400 text-gray-900 hover:bg-amber-500"
                    onClick={() => handleViewItinerary(itinerary.id)}
                  >
                    {t.view}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 p-8 bg-gray-100 rounded-lg">
            <p className="text-lg">{t.noItineraries}</p>
            <Button 
              onClick={handleCreateItinerary} 
              className="mt-4 bg-amber-400 text-gray-900 hover:bg-amber-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.createItinerary}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
