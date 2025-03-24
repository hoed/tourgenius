
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TourItinerary } from '@/lib/types';
import { DollarSign, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/glass-card';

interface PriceCalculatorProps {
  itinerary: TourItinerary;
}

const PriceCalculator = ({ itinerary }: PriceCalculatorProps) => {
  const navigate = useNavigate();

  const calculatedPrices = useMemo(() => {
    // Calculate all prices
    const destinations = {
      total: itinerary.days.reduce((sum, day) => {
        return sum + day.destinations.reduce((daySum, dest) => 
          daySum + dest.pricePerPerson * itinerary.numberOfPeople, 0);
      }, 0),
      count: itinerary.days.reduce((sum, day) => sum + day.destinations.length, 0)
    };

    const hotels = {
      total: itinerary.days.reduce((sum, day) => {
        return sum + (day.hotel ? day.hotel.pricePerNight : 0);
      }, 0),
      count: itinerary.days.reduce((sum, day) => sum + (day.hotel ? 1 : 0), 0)
    };

    const meals = {
      total: itinerary.days.reduce((sum, day) => {
        return sum + day.meals.reduce((daySum, meal) => 
          daySum + meal.pricePerPerson * itinerary.numberOfPeople, 0);
      }, 0),
      count: itinerary.days.reduce((sum, day) => sum + day.meals.length, 0)
    };

    const transportation = {
      // Transportation is per day, not per person
      total: itinerary.days.reduce((sum, day) => {
        return sum + (day.transportation ? day.transportation.pricePerPerson : 0);
      }, 0),
      count: itinerary.days.reduce((sum, day) => sum + (day.transportation ? 1 : 0), 0)
    };

    const guides = {
      total: itinerary.tourGuides.reduce((sum, guide) => {
        return sum + guide.pricePerDay * itinerary.days.length;
      }, 0),
      count: itinerary.tourGuides.length
    };

    const subtotal = destinations.total + hotels.total + meals.total + 
                    transportation.total + guides.total;
    
    // Add 10% service fee
    const serviceFee = subtotal * 0.1;
    
    // Add 5% tax
    const tax = subtotal * 0.05;
    
    const total = subtotal + serviceFee + tax;

    return {
      destinations,
      hotels,
      meals,
      transportation,
      guides,
      subtotal,
      serviceFee,
      tax,
      total
    };
  }, [itinerary]);

  const handleCreateInvoice = () => {
    // Navigate to the invoice creation page with the itinerary data
    navigate('/dashboard/invoices', { 
      state: { itinerary }
    });
  };

  // Format currency in Indonesian Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6 sticky top-6">
      <GlassCard>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Price Calculator
          </CardTitle>
          <CardDescription>
            Total for {itinerary.numberOfPeople} {itinerary.numberOfPeople === 1 ? 'person' : 'people'}, 
            {itinerary.days.length} {itinerary.days.length === 1 ? 'day' : 'days'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary Items */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Destinations ({calculatedPrices.destinations.count})</span>
              <span>{formatRupiah(calculatedPrices.destinations.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accommodations ({calculatedPrices.hotels.count})</span>
              <span>{formatRupiah(calculatedPrices.hotels.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Meals ({calculatedPrices.meals.count})</span>
              <span>{formatRupiah(calculatedPrices.meals.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transportation ({calculatedPrices.transportation.count})</span>
              <span>{formatRupiah(calculatedPrices.transportation.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tour Guides ({calculatedPrices.guides.count})</span>
              <span>{formatRupiah(calculatedPrices.guides.total)}</span>
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">{formatRupiah(calculatedPrices.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">Service Fee (10%)</span>
              <span>{formatRupiah(calculatedPrices.serviceFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span>{formatRupiah(calculatedPrices.tax)}</span>
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatRupiah(calculatedPrices.total)}</span>
            </div>
            <div className="text-xs text-muted-foreground text-right mt-1">
              {formatRupiah(calculatedPrices.total / itinerary.numberOfPeople)} per person
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleCreateInvoice}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </CardFooter>
      </GlassCard>

      <GlassCard className="bg-primary/5 animate-float">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Pro Tips</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>Add at least one destination for each day</li>
            <li>Include meals for a complete experience</li>
            <li>Choose appropriate transportation options</li>
            <li>Select tour guides with relevant expertise</li>
          </ul>
        </CardContent>
      </GlassCard>
    </div>
  );
};

export default PriceCalculator;
