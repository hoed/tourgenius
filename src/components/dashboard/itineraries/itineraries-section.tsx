
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Clock, Map } from 'lucide-react';
import { TourItinerary } from '@/lib/types';
import { formatDate, formatRupiah } from '@/lib/utils';

interface ItinerariesSectionProps {
  itineraries: TourItinerary[];
  loading: boolean;
}

const ItinerariesSection = ({ itineraries, loading }: ItinerariesSectionProps) => {
  const navigate = useNavigate();

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

    return itineraries.map(itinerary => (
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

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Your Itineraries</h2>
        <Button onClick={() => navigate('/dashboard/itinerary')} className="bg-amber-500 text-black hover:bg-amber-600">
          Create New Itinerary
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {renderItineraries()}
      </div>
    </>
  );
};

export default ItinerariesSection;
