import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash2, PlusCircle, Image } from 'lucide-react';
import { TourPlan } from '@/lib/types';
import { formatRupiah } from '@/components/dashboard/itinerary/itinerary-utils';
import { supabase } from '@/integrations/supabase/client';

// Mock auth context (replace with your actual auth setup)
interface User {
  id: string;
  role: 'user' | 'admin';
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user_metadata exists and contains the role
        if (user.user_metadata && user.user_metadata.role) {
          setUser({
            id: user.id,
            role: user.user_metadata.role as 'user' | 'admin',
          });
        } else {
          // Fallback to fetching from 'profiles' table if user_metadata is not available
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          setUser({ id: user.id, role: profile?.role || 'user' });
        }
      }
    };
    fetchUser();
  }, []);

  return user;
};

interface TourPlanCardProps {
  tourPlan?: TourPlan;
  onEdit?: (tourPlan: TourPlan) => void;
  onDelete?: (id: string) => void;
  isNew?: boolean;
  onClick?: () => void;
}

const TourPlanCard = ({ tourPlan, onEdit, onDelete, isNew = false, onClick }: TourPlanCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentUser = useAuth(); // Get current user info

  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (!tourPlan?.image_path) return;
      try {
        const { data, error } = await supabase.storage
          .from('tour_plan_images')
          .createSignedUrl(tourPlan.image_path, 60); // URL valid for 60 seconds
        if (error) throw error;
        setSignedImageUrl(data.signedUrl);
        console.log(`Signed URL for ${tourPlan.title}:`, data.signedUrl);
      } catch (error) {
        console.error('Error fetching signed URL:', error);
        setImageError(true);
      }
    };
    fetchSignedUrl();
  }, [tourPlan?.image_path]);

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

  const fallbackImageUrl = '/placeholder.svg';
  const displayImageUrl = tourPlan.image_path && signedImageUrl && !imageError ? signedImageUrl : fallbackImageUrl;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDialogOpen(true);
  };

  // Check if the current user can edit (creator or admin)
  const canEdit = currentUser && (currentUser.id === tourPlan.user_id || currentUser.role === 'admin');

  return (
    <>
      <Card
        className="h-full overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {tourPlan.image_path && !imageError ? (
            <img
              src={displayImageUrl}
              alt={tourPlan.title}
              className="w-full h-full object-cover"
              onError={() => {
                console.error(`Failed to load image for ${tourPlan.title}: ${displayImageUrl}`);
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
            onClick={(e) => {
              e.stopPropagation();
              onEdit && tourPlan && onEdit(tourPlan);
            }}
            className="flex gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-100"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete && tourPlan.id && onDelete(tourPlan.id);
            }}
            className="flex gap-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog for Tour Plan Details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-amber-700">{tourPlan.title}</DialogTitle>
            <DialogDescription>
              Details of your selected tour plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {tourPlan.image_path && !imageError ? (
              <img
                src={displayImageUrl}
                alt={tourPlan.title}
                className="w-full h-48 object-cover rounded-md"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
                <Image className="h-16 w-16 text-gray-300" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Description</h3>
              <p className="text-gray-600">{tourPlan.description || 'No description available'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Price</h3>
              <p className="text-amber-600 text-xl font-bold">{formatRupiah(tourPlan.price)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Created</h3>
              <p className="text-gray-600">{new Date(tourPlan.created_at || '').toLocaleDateString()}</p>
            </div>
          </div>
          {canEdit && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  onEdit && tourPlan && onEdit(tourPlan);
                  setIsDialogOpen(false); // Close dialog after clicking Edit
                }}
                className="flex gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-100"
              >
                <Edit className="h-4 w-4" />
                Edit Tour Plan
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TourPlanCard;
