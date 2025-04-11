
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TourPlan, DayItinerary, TourGuide } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Loader2, Image as ImageIcon, CalendarIcon, Users } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { formatRupiah } from '@/lib/utils';

interface TourPlanEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tourPlan: TourPlan) => Promise<void>;
  tourPlan?: TourPlan;
}

const TourPlanEditor = ({ isOpen, onClose, onSave, tourPlan }: TourPlanEditorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [numberOfPeople, setNumberOfPeople] = useState(2);

  useEffect(() => {
    if (tourPlan) {
      setTitle(tourPlan.title || '');
      setDescription(tourPlan.description || '');
      setPrice(tourPlan.price.toString() || '');
      
      if (tourPlan.start_date) {
        setSelectedDate(new Date(tourPlan.start_date));
      }
      
      if (tourPlan.numberOfPeople) {
        setNumberOfPeople(tourPlan.numberOfPeople);
      }
      
      if (tourPlan.image_path) {
        const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/tour_plan_images/${tourPlan.image_path}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      resetForm();
    }
  }, [tourPlan, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setImage(null);
    setImagePreview(null);
    setSelectedDate(undefined);
    setNumberOfPeople(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    const file = e.target.files[0];
    setImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!image) return tourPlan?.image_path || null;

    setIsUploading(true);
    try {
      const fileExt = image.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('tour_plan_images')
        .upload(filePath, image);

      if (uploadError) {
        throw uploadError;
      }

      // If updating, delete the old image if it exists
      if (tourPlan?.image_path && tourPlan.image_path !== filePath) {
        await supabase.storage
          .from('tour_plan_images')
          .remove([tourPlan.image_path]);
      }

      return filePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return tourPlan?.image_path || null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your tour plan.');
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error('Please enter a valid price for your tour plan.');
      return;
    }

    setIsSaving(true);
    try {
      const imagePath = await handleImageUpload();
      
      const newTourPlan: TourPlan = {
        id: tourPlan?.id || uuidv4(),
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        image_path: imagePath || undefined,
        user_id: tourPlan?.user_id || undefined,
        created_at: tourPlan?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        start_date: selectedDate ? selectedDate.toISOString() : undefined,
        numberOfPeople: numberOfPeople,
        days: tourPlan?.days || [],
        tourGuides: tourPlan?.tourGuides || []
      };

      await onSave(newTourPlan);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving tour plan:', error);
      toast.error('Failed to save tour plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>{tourPlan ? 'Edit Tour Plan' : 'Create Tour Plan'}</DialogTitle>
          <DialogDescription>
            {tourPlan 
              ? 'Update your tour plan details below.' 
              : 'Create a new customizable tour plan for your customers.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary Details</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Exciting Beach Adventure"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the tour plan details..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="price">Price (IDR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1000000"
                  required
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <Label htmlFor="image">Cover Image</Label>
                <div 
                  className="mt-1 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img 
                        src={imagePreview} 
                        alt="Tour plan preview" 
                        className="mx-auto h-48 object-cover rounded-md"
                      />
                      <p className="text-xs text-center mt-2 text-gray-500">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 2MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="itinerary" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="number-of-people">Number of People</Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                    >
                      -
                    </Button>
                    <div className="mx-4 text-center min-w-14">
                      <div className="text-lg font-medium">{numberOfPeople}</div>
                      <div className="text-xs text-gray-500">people</div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-amber-600 font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tour price per person: {formatRupiah(Number(price))}
                </p>
                <p className="text-amber-600 font-bold text-lg mt-1">
                  Total for {numberOfPeople} people: {formatRupiah(Number(price) * numberOfPeople)}
                </p>
              </div>

              <p className="text-sm text-gray-500 italic">
                Note: Days and specific itinerary details can be added after creating the tour plan and converting it to a full itinerary.
              </p>
            </TabsContent>

            <DialogFooter className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                disabled={isUploading || isSaving}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isUploading || isSaving}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {(isUploading || isSaving) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {tourPlan ? 'Update Tour Plan' : 'Create Tour Plan'}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TourPlanEditor;
