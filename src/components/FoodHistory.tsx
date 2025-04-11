
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FoodEntry } from '@/utils/foodRecognition';

interface FoodHistoryProps {
  entries: FoodEntry[];
  onDeleteEntry?: (id: string) => void;
}

const FoodHistory: React.FC<FoodHistoryProps> = ({ entries, onDeleteEntry }) => {
  // Group food entries by meal type
  const breakfastEntries = entries.filter(entry => entry.mealType === 'breakfast');
  const lunchEntries = entries.filter(entry => entry.mealType === 'lunch');
  const dinnerEntries = entries.filter(entry => entry.mealType === 'dinner');
  const snackEntries = entries.filter(entry => entry.mealType === 'snack');
  
  const renderFoodEntries = (entries: FoodEntry[]) => {
    if (entries.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          <p>No food items logged yet</p>
        </div>
      );
    }
    
    return entries.map((entry) => (
      <div key={entry.id} className="py-3 border-b last:border-b-0">
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium">{entry.foodItems.map(item => item.name).join(', ')}</h4>
            <p className="text-sm text-gray-500">
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-bold">
                {entry.foodItems.reduce((sum, item) => sum + item.nutrition.calories, 0)} cal
              </p>
              <div className="flex gap-2 text-xs">
                <span>P: {entry.foodItems.reduce((sum, item) => sum + item.nutrition.protein, 0)}g</span>
                <span>C: {entry.foodItems.reduce((sum, item) => sum + item.nutrition.carbs, 0)}g</span>
                <span>F: {entry.foodItems.reduce((sum, item) => sum + item.nutrition.fat, 0)}g</span>
              </div>
            </div>
            {onDeleteEntry && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDeleteEntry(entry.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    ));
  };
  
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Food Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="snack">Snack</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {entries.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No food items logged yet</p>
                <p className="text-sm mt-2">Take a photo of your food to get started</p>
              </div>
            ) : (
              renderFoodEntries(entries)
            )}
          </TabsContent>
          
          <TabsContent value="breakfast">
            {renderFoodEntries(breakfastEntries)}
          </TabsContent>
          
          <TabsContent value="lunch">
            {renderFoodEntries(lunchEntries)}
          </TabsContent>
          
          <TabsContent value="dinner">
            {renderFoodEntries(dinnerEntries)}
          </TabsContent>
          
          <TabsContent value="snack">
            {renderFoodEntries(snackEntries)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FoodHistory;
