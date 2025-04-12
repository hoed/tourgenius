
import React from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TourGuide } from '@/lib/types';
import { Users, Trash2, Plus, Phone } from 'lucide-react';
import { formatRupiah } from './itinerary-utils';
import { toast } from 'sonner';
import GlassCard from '@/components/ui/glass-card';

interface TourGuidesSectionProps {
  tourGuides: TourGuide[];
  onAddGuide: (name: string, expertise: string, pricePerDay: number, phoneNumber?: string) => void;
  onRemoveGuide: (guideId: string) => void;
}

const TourGuidesSection = ({ tourGuides, onAddGuide, onRemoveGuide }: TourGuidesSectionProps) => {
  const handleAddGuide = () => {
    const name = (document.getElementById('guide-name') as HTMLInputElement).value;
    const expertise = (document.getElementById('guide-expertise') as HTMLInputElement).value;
    const price = Number((document.getElementById('guide-price') as HTMLInputElement).value);
    const phoneNumber = (document.getElementById('guide-phone') as HTMLInputElement).value;
    
    if (!name.trim()) {
      toast.error('Guide name is required');
      return;
    }
    
    onAddGuide(name, expertise, price, phoneNumber);
    
    // Clear inputs after adding
    (document.getElementById('guide-name') as HTMLInputElement).value = '';
    (document.getElementById('guide-expertise') as HTMLInputElement).value = '';
    (document.getElementById('guide-price') as HTMLInputElement).value = '';
    (document.getElementById('guide-phone') as HTMLInputElement).value = '';
  };

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return '—';
    return phone;
  };

  return (
    <GlassCard className="bg-white border border-gray-200 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <Users className="h-5 w-5" />
          Tour Guides
        </CardTitle>
        <CardDescription className="text-gray-600">Assign guides for your tour</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tourGuides.map((guide) => (
            <div key={guide.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{guide.name}</p>
                <p className="text-sm text-gray-600">{guide.expertise}</p>
                <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                  <Phone className="h-3 w-3" />
                  <span>{formatPhoneNumber(guide.phoneNumber)}</span>
                </div>
                <p className="text-sm text-gray-900 mt-1">{formatRupiah(guide.pricePerDay)}/day</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onRemoveGuide(guide.id)}
                className="ml-auto text-rose-600 hover:text-rose-700 hover:bg-rose-400/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input id="guide-name" placeholder="Guide name" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
          <Input id="guide-expertise" placeholder="Expertise" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
          <Input id="guide-price" type="number" placeholder="150000" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
          <Input 
            id="guide-phone" 
            type="tel" 
            placeholder="+62 812 3456 7890" 
            className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50"
          />
        </div>
        <Button 
          onClick={handleAddGuide}
          className="bg-amber-400 text-gray-900 hover:bg-amber-500 transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Guide
        </Button>
      </CardContent>
    </GlassCard>
  );
};

export default TourGuidesSection;
