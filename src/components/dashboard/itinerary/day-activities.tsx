
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, ListChecks, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Activity } from '@/lib/types';
import { formatRupiah } from '@/utils/currency-formatter';

interface DayActivitiesProps {
  dayId: string;
  activities: Activity[];
  onAddActivity: (dayId: string, name: string, description: string, price: number, time?: string) => void;
  onRemoveActivity: (dayId: string, activityId: string) => void;
}

const DayActivities = ({
  dayId,
  activities,
  onAddActivity,
  onRemoveActivity
}: DayActivitiesProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [time, setTime] = useState('');

  const handleAddActivity = () => {
    onAddActivity(dayId, name, description, Number(price) || 0, time);
    setName('');
    setDescription('');
    setPrice('');
    setTime('');
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-amber-700">
          <ListChecks className="h-5 w-5" />
          Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Activity Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Input 
              placeholder="Activity name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-amber-200 focus:ring-amber-400"
            />
            <Input 
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-amber-200 focus:ring-amber-400"
            />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input 
                placeholder="Time (e.g. 10:00 AM)"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-amber-200 focus:ring-amber-400"
              />
              <Input 
                placeholder="Price per person"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-amber-200 focus:ring-amber-400"
              />
            </div>
            <Button 
              onClick={handleAddActivity} 
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-gray-900 transition-all duration-300"
              disabled={!name.trim()}
            >
              Add Activity
            </Button>
          </div>
        </div>

        {/* Activities List */}
        {activities.length > 0 ? (
          <div className="space-y-3 mt-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-md border border-gray-100 hover:shadow-sm transition-shadow duration-200">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-amber-800">{activity.name}</h4>
                    {activity.time && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs bg-amber-50 border-amber-200 text-amber-700">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </Badge>
                    )}
                  </div>
                  {activity.description && (
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  )}
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">
                    {formatRupiah(activity.pricePerPerson)} / person
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRemoveActivity(dayId, activity.id)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic py-2">No activities added yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DayActivities;
