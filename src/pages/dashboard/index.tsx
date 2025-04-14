
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import DashboardLayout from '@/components/dashboard/layout';
import { CalendarDays, FileText, Users, Map, ArrowRight, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TourItinerary, TourPlan } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import TourPlanCard from '@/components/dashboard/tour-plans/tour-plan-card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [itineraries, setItineraries] = useState<TourItinerary[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [tourPlans, setTourPlans] = useState<TourPlan[]>([]);
  const [tourPlansLoading, setTourPlansLoading] = useState(true);
  const [tourPlanCount, setTourPlanCount] = useState(0);
  
  // Pagination state
  const [currentItineraryPage, setCurrentItineraryPage] = useState(1);
  const [currentTourPlanPage, setCurrentTourPlanPage] = useState(1);
  const itemsPerPage = 4;

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
        const { data: itinerariesData, error: itinerariesError } = await supabase
          .from('itineraries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (itinerariesError) {
          console.error('Error fetching itineraries:', itinerariesError);
          throw itinerariesError;
        }

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

        const { count, error: customerError } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        if (customerError) {
          console.error('Error fetching customer count:', customerError);
          throw customerError;
        }

        setCustomerCount(count || 0);
        
        const { count: tourPlansCount, error: tourPlansCountError } = await supabase
          .from('tour_plans')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);
          
        if (tourPlansCountError) {
          console.error('Error fetching tour plans count:', tourPlansCountError);
          throw tourPlansCountError;
        }
        
        setTourPlanCount(tourPlansCount || 0);
        
        setTourPlansLoading(true);
        const { data: tourPlansData, error: tourPlansError } = await supabase
          .from('tour_plans')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate pagination values for itineraries
  const totalItineraryPages = Math.ceil(itineraries.length / itemsPerPage);
  const indexOfLastItinerary = currentItineraryPage * itemsPerPage;
  const indexOfFirstItinerary = indexOfLastItinerary - itemsPerPage;
  const currentItineraries = itineraries.slice(indexOfFirstItinerary, indexOfLastItinerary);

  // Calculate pagination values for tour plans
  const totalTourPlanPages = Math.ceil(tourPlans.length / itemsPerPage);
  const indexOfLastTourPlan = currentTourPlanPage * itemsPerPage;
  const indexOfFirstTourPlan = indexOfLastTourPlan - itemsPerPage;
  const currentTourPlans = tourPlans.slice(indexOfFirstTourPlan, indexOfLastTourPlan);

  const renderPagination = (currentPage: number, totalPages: number, setPage: (page: number) => void) => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === pageNumber} 
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {totalPages > 3 && (
            <>
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {currentPage > 3 && currentPage <= totalPages && (
                <PaginationItem>
                  <PaginationLink isActive={true}>
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {totalPages > 3 && (
                <PaginationItem>
                  <PaginationLink 
                    isActive={currentPage === totalPages} 
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
            </>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderItineraries = () => {
    if (loading) {
      return Array(4).fill(0).map((_, i) => (
        <Card key={i} className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-8 w-full mt-4" />
            </div>
          </CardContent>
        </Card>
      ));
    }

    if (itineraries.length === 0) {
      return (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Map className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Itineraries Yet</h3>
          <p className="text-gray-500 text-center mb-6">Start creating your first travel itinerary to see it here.</p>
          <Button onClick={() => navigate('/dashboard/itinerary')}>
            Create New Itinerary
          </Button>
        </div>
      );
    }

    return currentItineraries.map(itinerary => (
      <Card key={itinerary.id} className="shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-amber-700 truncate">{itinerary.name}</CardTitle>
          <CardDescription className="flex items-center text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Updated {new Date(itinerary.updated_at || '').toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Start Date:</span>
              <span className="font-medium">{formatDate(itinerary.start_date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration:</span>
              <span className="font-medium">{itinerary.days?.length || 0} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Travelers:</span>
              <span className="font-medium">{itinerary.numberOfPeople}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total:</span>
              <span className="font-medium text-amber-600">{formatRupiah(itinerary.totalPrice || 0)}</span>
            </div>
          </div>
          <Link to={`/dashboard/itinerary?id=${itinerary.id}`}>
            <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black">
              <ArrowRight className="h-4 w-4 mr-2" />
              View Itinerary
            </Button>
          </Link>
        </CardContent>
      </Card>
    ));
  };

  const renderTourPlans = () => {
    if (tourPlansLoading) {
      return Array(4).fill(0).map((_, i) => (
        <div key={i} className="h-64">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      ));
    }

    if (tourPlans.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Map className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Tour Plans Yet</h3>
          <p className="text-gray-500 text-center mb-4">Create your first tour plan to showcase to your customers.</p>
          <Button onClick={() => navigate('/dashboard/tour-plans')} className="bg-amber-500 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Create Tour Plan
          </Button>
        </div>
      );
    }

    return currentTourPlans.map(tourPlan => (
      <div key={tourPlan.id} className="h-64">
        <TourPlanCard
          tourPlan={tourPlan}
          onEdit={() => navigate(`/dashboard/tour-plans?id=${tourPlan.id}`)}
        />
      </div>
    ));
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-blue-700">Itineraries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-blue-600">{loading ? <Skeleton className="h-8 w-16" /> : itineraries.length}</span>
                <FileText className="h-8 w-8 text-blue-300" />
              </div>
              <p className="text-blue-600 text-sm mt-2">Total created itineraries</p>
              <Link to="/dashboard/itinerary" className="text-blue-500 text-xs mt-2 hover:underline inline-block">
                View all itineraries →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-green-700">Tour Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-green-600">
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    tourPlanCount
                  )}
                </span>
                <Map className="h-8 w-8 text-green-300" />
              </div>
              <p className="text-green-600 text-sm mt-2">Available tour plans</p>
              <Link to="/dashboard/tour-plans" className="text-green-500 text-xs mt-2 hover:underline inline-block">
                View all tour plans →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-amber-700">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-amber-600">{loading ? <Skeleton className="h-8 w-16" /> : customerCount}</span>
                <Users className="h-8 w-8 text-amber-300" />
              </div>
              <p className="text-amber-600 text-sm mt-2">Customers in database</p>
              <Link to="/dashboard/customers" className="text-amber-500 text-xs mt-2 hover:underline inline-block">
                View all customers →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-purple-700">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-purple-600">
                  {loading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    formatRupiah(itineraries.reduce((sum, itinerary) => sum + (itinerary.totalPrice || 0), 0))
                  )}
                </span>
                <Map className="h-8 w-8 text-purple-300" />
              </div>
              <p className="text-purple-600 text-sm mt-2">Total value of all itineraries</p>
              <Link to="/dashboard/invoices" className="text-purple-500 text-xs mt-2 hover:underline inline-block">
                Generate invoices →
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Tour Plans</h2>
          <Button onClick={() => navigate('/dashboard/tour-plans')} className="bg-amber-500 text-black hover:bg-amber-600">
            View All Tour Plans
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {renderTourPlans()}
        </div>
        
        {renderPagination(currentTourPlanPage, totalTourPlanPages, setCurrentTourPlanPage)}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Your Itineraries</h2>
          <Button onClick={() => navigate('/dashboard/itinerary')} className="bg-amber-500 text-black hover:bg-amber-600">
            Create New Itinerary
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {renderItineraries()}
        </div>
        
        {renderPagination(currentItineraryPage, totalItineraryPages, setCurrentItineraryPage)}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
