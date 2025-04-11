
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { TourPlan } from '@/lib/types';
import TourPlanCard from '@/components/dashboard/tour-plans/tour-plan-card';
import TourPlanEditor from '@/components/dashboard/tour-plans/tour-plan-editor';
import { Plus, Map } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const TourPlansPage = () => {
  const [loading, setLoading] = useState(true);
  const [tourPlans, setTourPlans] = useState<TourPlan[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentTourPlan, setCurrentTourPlan] = useState<TourPlan | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tourPlanToDelete, setTourPlanToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchTourPlans();
  }, []);

  const fetchTourPlans = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        toast.error('Please log in to view your tour plans');
        return;
      }

      const { data, error } = await supabase
        .from('tour_plans')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTourPlans(data || []);
    } catch (error) {
      console.error('Error fetching tour plans:', error);
      toast.error('Failed to load tour plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTourPlan = () => {
    setCurrentTourPlan(undefined);
    setEditorOpen(true);
  };

  const handleEditTourPlan = (tourPlan: TourPlan) => {
    setCurrentTourPlan(tourPlan);
    setEditorOpen(true);
  };

  const handleDeleteTourPlan = (id: string) => {
    setTourPlanToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTourPlan = async () => {
    if (!tourPlanToDelete) return;

    try {
      const tourPlanToDeleteObj = tourPlans.find(tp => tp.id === tourPlanToDelete);
      
      const { error } = await supabase
        .from('tour_plans')
        .delete()
        .eq('id', tourPlanToDelete);

      if (error) throw error;

      // If the tour plan had an image, delete it from storage
      if (tourPlanToDeleteObj?.image_path) {
        const { error: storageError } = await supabase
          .storage
          .from('tour_plan_images')
          .remove([tourPlanToDeleteObj.image_path]);
        
        if (storageError) {
          console.error('Error deleting image:', storageError);
        }
      }

      setTourPlans(tourPlans.filter(tp => tp.id !== tourPlanToDelete));
      toast.success('Tour plan deleted successfully');
    } catch (error) {
      console.error('Error deleting tour plan:', error);
      toast.error('Failed to delete tour plan');
    } finally {
      setTourPlanToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveTourPlan = async (tourPlan: TourPlan) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        toast.error('Please log in to save your tour plan');
        return;
      }

      const isNewTourPlan = !tourPlans.some(tp => tp.id === tourPlan.id);
      
      // Add user_id for new tour plans
      if (isNewTourPlan) {
        tourPlan.user_id = session.session.user.id;
      }

      // Ensure we have proper data for Supabase
      const tourPlanForDB = {
        id: tourPlan.id,
        title: tourPlan.title,
        description: tourPlan.description,
        price: tourPlan.price,
        image_path: tourPlan.image_path,
        user_id: tourPlan.user_id,
        start_date: tourPlan.start_date,
        number_of_people: tourPlan.numberOfPeople,
        // Store tour guides and days as JSON strings
        tour_guides: tourPlan.tourGuides ? JSON.stringify(tourPlan.tourGuides) : JSON.stringify([]),
        days: tourPlan.days ? JSON.stringify(tourPlan.days) : JSON.stringify([])
      };

      const { error } = isNewTourPlan
        ? await supabase.from('tour_plans').insert([tourPlanForDB])
        : await supabase.from('tour_plans').update(tourPlanForDB).eq('id', tourPlan.id);

      if (error) throw error;

      await fetchTourPlans();
      toast.success(`Tour plan ${isNewTourPlan ? 'created' : 'updated'} successfully`);
    } catch (error) {
      console.error('Error saving tour plan:', error);
      toast.error('Failed to save tour plan');
      throw error;
    }
  };

  // Function to convert tour plan to itinerary
  const convertToItinerary = async (tourPlan: TourPlan) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        toast.error('Please log in to create an itinerary');
        return;
      }
      
      // Create a basic itinerary from tour plan with proper structure
      const newItinerary = {
        name: tourPlan.title,
        start_date: tourPlan.start_date || new Date().toISOString().split('T')[0],
        tour_guides: tourPlan.tourGuides ? JSON.stringify(tourPlan.tourGuides) : JSON.stringify([]),
        days: tourPlan.days ? JSON.stringify(tourPlan.days) : JSON.stringify([]),
        number_of_people: tourPlan.numberOfPeople || 2,
        total_price: tourPlan.price,
        user_id: session.session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('itineraries')
        .insert([newItinerary])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast.success('Tour plan converted to itinerary successfully');
        window.location.href = `/dashboard/itinerary?id=${data[0].id}`;
      }
    } catch (error) {
      console.error('Error converting tour plan to itinerary:', error);
      toast.error('Failed to convert tour plan to itinerary');
    }
  };

  const renderTourPlans = () => {
    if (loading) {
      return Array(4).fill(0).map((_, i) => (
        <div key={i} className="h-80">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      ));
    }

    return (
      <>
        <div className="h-80" onClick={handleCreateTourPlan}>
          <TourPlanCard isNew={true} onClick={handleCreateTourPlan} />
        </div>
        
        {tourPlans.map(tourPlan => (
          <div key={tourPlan.id} className="h-80">
            <TourPlanCard
              tourPlan={tourPlan}
              onEdit={handleEditTourPlan}
              onDelete={handleDeleteTourPlan}
              onConvertToItinerary={convertToItinerary}
            />
          </div>
        ))}
      </>
    );
  };

  return (
    <DashboardLayout>
      <Toaster position="top-center" richColors />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tour Plans</h1>
          <Button 
            onClick={handleCreateTourPlan} 
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Plus className="h-4 w-4" />
            Create Tour Plan
          </Button>
        </div>
        
        <p className="text-gray-500">
          Create and manage customizable tour plans for your customers.
        </p>
        
        {tourPlans.length === 0 && !loading ? (
          <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <Map className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Tour Plans Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Create your first tour plan to showcase your offerings to customers.
            </p>
            <Button onClick={handleCreateTourPlan} className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Tour Plan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {renderTourPlans()}
          </div>
        )}
      </div>

      <TourPlanEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveTourPlan}
        tourPlan={currentTourPlan}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tour plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTourPlan}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default TourPlansPage;
