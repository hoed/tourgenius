import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, PlusCircle, Image } from 'lucide-react';
import { TourPlan } from '@/lib/types';
import { formatRupiah } from '@/components/dashboard/itinerary/itinerary-utils';

interface TourPlanCardProps {
  tourPlan?: TourPlan;
  onEdit?: (tourPlan: TourPlan) => void;
  onDelete?: (id: string) => void;
  isNew?: boolean;
  onClick?: () => void;
}

const TourPlanCard = ({ tourPlan, onEdit, onDelete, isNew = false, onClick }: TourPlanCardProps) => {
  const [imageError, setImageError] = useState(false);

  if (isNew) {
    return (
      <Card
        className="h-full cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] border-dashed border-2 border-gray-300 flex flex-col justify-center items-center bg-gray-50"
        onClick={onClick}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
          <PlusCircle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">Create New Tour Plan</h3>
          <p className="text-sm text-gray-400">Add a customizable tour plan for your customers</p>
        </CardContent>
      </Card>
    );
  }

  if (!tourPlan) return null;

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const imageUrl = tourPlan.image_path && baseUrl
    ? `${baseUrl}/storage/v1/object/public/tour_plan_images/${tourPlan.image_path}`
    : '/placeholder.svg';

  // Log the URL for debugging
  console.log(`Tour Plan Image URL (${tourPlan.title}):`, imageUrl);

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {tourPlan.image_path && !imageError ? (
          <img
            src={imageUrl}
            alt={tourPlan.title}
            className="w-full h-full object-cover"
            onError={() => {
              console.error(`Failed to load image for ${tourPlan.title}: ${imageUrl}`);
              setImageError(true);
            }}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Image className="h-16 w-16 text-gray-300" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-amber-700">{tourPlan.title}</CardTitle>
        <CardDescription className="text-sm">
          Created {new Date(tourPlan.created_at || '').toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3 mb-3 text-gray-600">{tourPlan.description}</p>
        <p className="text-lg font-semibold text-amber-600">{formatRupiah(tourPlan.price)}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit && tourPlan && onEdit(tourPlan)}
          className="flex gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-100"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete && tourPlan.id && onDelete(tourPlan.id)}
          className="flex gap-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border-rose-100"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TourPlanCard;