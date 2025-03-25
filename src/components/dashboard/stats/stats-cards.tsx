
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { CalendarDays, FileText, Users, Map } from 'lucide-react';
import { TourItinerary } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

interface StatsCardsProps {
  loading: boolean;
  itineraries: TourItinerary[];
  customerCount: number;
}

const StatsCards = ({ loading, itineraries, customerCount }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {/* Itineraries Stats Card */}
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

      {/* Tour Days Stats Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-green-700">Tour Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-green-600">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                itineraries.reduce((sum, itinerary) => sum + (itinerary.days?.length || 0), 0)
              )}
            </span>
            <CalendarDays className="h-8 w-8 text-green-300" />
          </div>
          <p className="text-green-600 text-sm mt-2">Days of adventure planned</p>
        </CardContent>
      </Card>

      {/* Customers Stats Card */}
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

      {/* Total Value Stats Card */}
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
  );
};

export default StatsCards;
