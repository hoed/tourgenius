
import React from 'react';
import { Meal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Utensils, Trash2, Plus, Clock } from 'lucide-react';
import { formatRupiah } from '@/utils/currency-formatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DayMealsProps {
  dayId: string;
  meals: Meal[];
  onAddMeal: (dayId: string, description: string, type: string, price: number, time?: string) => void;
  onRemoveMeal: (dayId: string, mealId: string) => void;
}

const DayMeals = ({ dayId, meals, onAddMeal, onRemoveMeal }: DayMealsProps) => {
  const handleAddMeal = () => {
    const desc = (document.getElementById(`meal-desc-${dayId}`) as HTMLInputElement).value;
    const type = (document.getElementById(`meal-type-${dayId}`) as HTMLInputElement).value;
    const price = Number((document.getElementById(`meal-price-${dayId}`) as HTMLInputElement).value);
    const time = (document.getElementById(`meal-time-${dayId}`) as HTMLInputElement)?.value;
    
    if (!desc.trim()) return;
    
    onAddMeal(dayId, desc, type, price, time);
    
    // Clear inputs after adding
    (document.getElementById(`meal-desc-${dayId}`) as HTMLInputElement).value = '';
    (document.getElementById(`meal-type-${dayId}`) as HTMLInputElement).value = '';
    (document.getElementById(`meal-price-${dayId}`) as HTMLInputElement).value = '';
    if (document.getElementById(`meal-time-${dayId}`)) {
      (document.getElementById(`meal-time-${dayId}`) as HTMLInputElement).value = '';
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-amber-700">
          <Utensils className="h-5 w-5" />
          Meals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {meals.map((meal) => (
            <div key={meal.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300">
              <div>
                <p className="font-medium text-gray-900">{meal.description}</p>
                <p className="text-sm text-gray-600">{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</p>
                <p className="text-sm text-gray-900">{formatRupiah(meal.pricePerPerson)}/person</p>
                {meal.time && (
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {meal.time}
                  </p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onRemoveMeal(dayId, meal.id)}
                className="ml-auto text-rose-600 hover:text-rose-700 hover:bg-rose-400/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input id={`meal-desc-${dayId}`} placeholder="Meal description" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
          <Input id={`meal-type-${dayId}`} placeholder="breakfast/lunch/dinner" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
          <Input id={`meal-price-${dayId}`} type="number" placeholder="75000" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
          <Input id={`meal-time-${dayId}`} placeholder="e.g. 12:00 PM" className="bg-gray-50 border-gray-200 text-gray-900 focus:ring-amber-400/50" />
        </div>
        <Button 
          onClick={handleAddMeal}
          className="mt-3 bg-amber-400 text-gray-900 hover:bg-amber-500 transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Meal
        </Button>
      </CardContent>
    </Card>
  );
};

export default DayMeals;
