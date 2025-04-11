
import React from 'react';
import { Calendar } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface NutritionSummaryProps {
  date?: Date;
  calories: {
    current: number;
    goal: number;
  };
  protein: {
    current: number;
    goal: number;
  };
  carbs: {
    current: number;
    goal: number;
  };
  fat: {
    current: number;
    goal: number;
  };
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  date = new Date(),
  calories,
  protein,
  carbs,
  fat
}) => {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  const calculatePercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Daily Summary</CardTitle>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">Calories</div>
              <div className="text-sm text-gray-500">
                {calories.current} / {calories.goal} kcal
              </div>
            </div>
            <Progress
              value={calculatePercentage(calories.current, calories.goal)}
              className="h-2 bg-gray-100"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">Protein</div>
              <div className="text-sm text-gray-500">
                {protein.current} / {protein.goal} g
              </div>
            </div>
            <Progress
              value={calculatePercentage(protein.current, protein.goal)}
              className="h-2 bg-gray-100 [&>div]:bg-blue-500"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">Carbohydrates</div>
              <div className="text-sm text-gray-500">
                {carbs.current} / {carbs.goal} g
              </div>
            </div>
            <Progress
              value={calculatePercentage(carbs.current, carbs.goal)}
              className="h-2 bg-gray-100 [&>div]:bg-amber-500"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">Fat</div>
              <div className="text-sm text-gray-500">
                {fat.current} / {fat.goal} g
              </div>
            </div>
            <Progress
              value={calculatePercentage(fat.current, fat.goal)}
              className="h-2 bg-gray-100 [&>div]:bg-red-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionSummary;
