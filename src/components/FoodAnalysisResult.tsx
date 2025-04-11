
import React from 'react';
import { Check, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import type { FoodItem } from '@/data/nutritionDatabase';

interface FoodAnalysisResultProps {
  isLoading: boolean;
  detectedFoods: FoodItem[];
  onConfirm: () => void;
  onEdit: () => void;
}

const FoodAnalysisResult: React.FC<FoodAnalysisResultProps> = ({
  isLoading,
  detectedFoods,
  onConfirm,
  onEdit
}) => {
  if (isLoading) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="text-center">Analyzing your food...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <div className="w-16 h-16 border-4 border-t-foodtrack-primary border-r-foodtrack-secondary border-b-foodtrack-light border-l-foodtrack-accent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Our AI is identifying your food items</p>
        </CardContent>
      </Card>
    );
  }
  
  if (detectedFoods.length === 0) {
    return null;
  }
  
  // Calculate total nutrition values
  const totalCalories = detectedFoods.reduce((sum, food) => sum + (food.nutrition?.calories || 0), 0);
  const totalProtein = detectedFoods.reduce((sum, food) => sum + (food.nutrition?.protein || 0), 0);
  const totalCarbs = detectedFoods.reduce((sum, food) => sum + (food.nutrition?.carbs || 0), 0);
  const totalFat = detectedFoods.reduce((sum, food) => sum + (food.nutrition?.fat || 0), 0);
  
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Detected Food Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {detectedFoods.map((food, index) => (
            <div key={index} className="food-item-card p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 mr-3 flex items-center justify-center overflow-hidden">
                    {food.imageUrl ? (
                      <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-500">No img</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{food.name}</h4>
                    <p className="text-sm text-gray-500">{food.portionSize || '1 serving'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{food.nutrition?.calories || 0} cal</p>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {food.nutrition?.protein || 0}g protein
                </span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {food.nutrition?.carbs || 0}g carbs
                </span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {food.nutrition?.fat || 0}g fat
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Total Nutrition</h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-gray-800">{totalCalories}</p>
              <p className="text-xs text-gray-500">Calories</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-700">{totalProtein}g</p>
              <p className="text-xs text-gray-500">Protein</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-700">{totalCarbs}g</p>
              <p className="text-xs text-gray-500">Carbs</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-700">{totalFat}g</p>
              <p className="text-xs text-gray-500">Fat</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onEdit}
          className="flex items-center space-x-2"
        >
          <Edit2 className="h-4 w-4" />
          <span>Edit</span>
        </Button>
        
        <Button 
          onClick={onConfirm}
          className="flex items-center space-x-2"
        >
          <Check className="h-4 w-4" />
          <span>Add to Log</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodAnalysisResult;
