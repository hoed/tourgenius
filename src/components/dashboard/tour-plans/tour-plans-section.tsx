
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Map, Plus } from 'lucide-react';
import { TourPlan } from '@/lib/types';
import TourPlanCard from '@/components/dashboard/tour-plans/tour-plan-card';

interface TourPlansSectionProps {
  tourPlans: TourPlan[];
  tourPlansLoading: boolean;
}

const TourPlansSection = ({ tourPlans, tourPlansLoading }: TourPlansSectionProps) => {
  const navigate = useNavigate();

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

    return tourPlans.map(tourPlan => (
      <div key={tourPlan.id} className="h-64">
        <TourPlanCard
          tourPlan={tourPlan}
          onEdit={() => navigate(`/dashboard/tour-plans?id=${tourPlan.id}`)}
        />
      </div>
    ));
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Tour Plans</h2>
        <Button onClick={() => navigate('/dashboard/tour-plans')} className="bg-amber-500 text-black hover:bg-amber-600">
          View All Tour Plans
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {renderTourPlans()}
      </div>
    </>
  );
};

export default TourPlansSection;
