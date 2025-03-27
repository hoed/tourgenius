
import React from 'react';
import { TourPlan } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Edit, Trash2, Plus, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TourPlanCardProps {
  tourPlan?: TourPlan;
  isNew?: boolean;
  onClick?: () => void;
  onEdit?: (tourPlan: TourPlan) => void;
  onDelete?: (id: string) => void;
  onConvertToItinerary?: (tourPlan: TourPlan) => void;
}

const TourPlanCard = ({ 
  tourPlan, 
  isNew = false, 
  onClick, 
  onEdit, 
  onDelete,
  onConvertToItinerary
}: TourPlanCardProps) => {
  if (isNew) {
    return (
      <Card 
        className="h-full border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center text-center p-6"
        onClick={onClick}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-amber-100 p-3 rounded-full mb-3">
            <Plus className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Create New Tour Plan</h3>
          <p className="text-sm text-gray-500">
            Create a customizable tour plan to offer to your customers
          </p>
        </div>
      </Card>
    );
  }

  if (!tourPlan) return null;

  const bgImage = tourPlan.image_path
    ? `url(${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/tour_plan_images/${tourPlan.image_path})`
    : 'url(/placeholder.svg)';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit && tourPlan && onEdit(tourPlan);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete && tourPlan && onDelete(tourPlan.id);
  };

  const handleConvertToItinerary = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConvertToItinerary && tourPlan && onConvertToItinerary(tourPlan);
  };

  return (
    <Card 
      className="h-full overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all flex flex-col"
      onClick={() => onEdit && tourPlan && onEdit(tourPlan)}
    >
      <div 
        className="h-36 bg-cover bg-center" 
        style={{ backgroundImage: bgImage }}
      />
      
      <CardContent className="flex-1 p-4">
        <h3 className="text-lg font-semibold line-clamp-1 mb-2">{tourPlan.title}</h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{tourPlan.description}</p>
        
        <div className="space-y-2">
          <p className="text-amber-600 font-semibold text-lg">
            {formatCurrency(tourPlan.price || 0)}
          </p>
          
          {tourPlan.numberOfPeople && (
            <div className="flex items-center text-gray-500 text-xs">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              <span>{tourPlan.numberOfPeople} people</span>
            </div>
          )}
          
          {tourPlan.start_date && (
            <div className="flex items-center text-gray-500 text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>{new Date(tourPlan.start_date).toLocaleDateString()}</span>
            </div>
          )}
          
          {tourPlan.days && tourPlan.days.length > 0 && (
            <div className="flex items-center text-gray-500 text-xs">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span>{tourPlan.days.length} {tourPlan.days.length === 1 ? 'day' : 'days'}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 bg-gray-50 border-t flex justify-between">
        <div className="flex gap-1.5">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-amber-600"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-rose-600"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200"
          onClick={handleConvertToItinerary}
        >
          <FileText className="h-3.5 w-3.5" />
          Convert to Itinerary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TourPlanCard;
