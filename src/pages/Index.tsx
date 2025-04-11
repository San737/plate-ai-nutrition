
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Header from '@/components/Header';
import CameraCapture from '@/components/CameraCapture';
import FoodAnalysisResult from '@/components/FoodAnalysisResult';
import NutritionSummary from '@/components/NutritionSummary';
import FoodHistory from '@/components/FoodHistory';

import { 
  detectFoodFromImage, 
  determineMealType, 
  saveFoodEntry, 
  getFoodEntries,
  deleteFoodEntry,
  calculateDailyNutrition,
  type FoodEntry
} from '@/utils/foodRecognition';
import type { FoodItem } from '@/data/nutritionDatabase';

const Index = () => {
  const { toast } = useToast();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<FoodItem[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [nutritionGoals] = useState({
    calories: 2000,
    protein: 120,
    carbs: 200,
    fat: 65
  });
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [activeTab, setActiveTab] = useState("track");

  // Load food entries from Supabase on mount
  useEffect(() => {
    const loadFoodEntries = async () => {
      setLoadingEntries(true);
      try {
        const entries = await getFoodEntries();
        setFoodEntries(entries);
        
        const nutrition = await calculateDailyNutrition();
        setDailyNutrition(nutrition);
      } catch (error) {
        console.error("Error loading food data:", error);
        toast({
          title: "Error",
          description: "Could not load your food entries.",
          variant: "destructive"
        });
      } finally {
        setLoadingEntries(false);
      }
    };
    
    loadFoodEntries();
  }, [toast]);

  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setIsAnalyzing(true);
    
    try {
      // This now uses our Gemini edge function via Supabase
      const detectedItems = await detectFoodFromImage(imageData);
      setDetectedFoods(detectedItems);
    } catch (error) {
      console.error("Error analyzing food image:", error);
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing your food image.",
        variant: "destructive"
      });
      setDetectedFoods([]);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleReset = () => {
    setCapturedImage(null);
    setDetectedFoods([]);
  };
  
  const handleConfirmFood = async () => {
    if (detectedFoods.length === 0) return;
    
    try {
      const newEntry: FoodEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        mealType: determineMealType(),
        imageData: capturedImage || '',
        foodItems: detectedFoods
      };
      
      // Save to Supabase
      const result = await saveFoodEntry(newEntry);
      
      if (!result.success) {
        throw new Error(result.error || "Unknown error");
      }
      
      // Refresh entries and nutrition data
      const entries = await getFoodEntries();
      setFoodEntries(entries);
      
      const updatedNutrition = await calculateDailyNutrition();
      setDailyNutrition(updatedNutrition);
      
      // Show toast notification
      toast({
        title: "Food logged successfully",
        description: `Added ${detectedFoods.length} items to your food log`
      });
      
      // Reset
      handleReset();
    } catch (error) {
      console.error("Error saving food entry:", error);
      toast({
        title: "Error",
        description: "Could not save your food entry.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteEntry = async (entryId: string) => {
    try {
      // Delete from Supabase
      const success = await deleteFoodEntry(entryId);
      
      if (!success) {
        throw new Error("Failed to delete entry");
      }
      
      // Update state
      const updatedEntries = await getFoodEntries();
      setFoodEntries(updatedEntries);
      
      // Update daily nutrition totals
      const nutrition = await calculateDailyNutrition();
      setDailyNutrition(nutrition);
      
      // Show toast notification
      toast({
        title: "Entry deleted",
        description: "Food log entry has been removed"
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Could not delete the food entry.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="track" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="track">Track Food</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="track" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold mb-4">Capture Your Meal</h2>
                <CameraCapture 
                  onCapture={handleImageCapture} 
                  onReset={handleReset}
                  hasImage={!!capturedImage}
                />
                
                {(isAnalyzing || detectedFoods.length > 0) && (
                  <FoodAnalysisResult 
                    isLoading={isAnalyzing}
                    detectedFoods={detectedFoods}
                    onConfirm={handleConfirmFood}
                    onEdit={handleReset}
                  />
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Today's Progress</h2>
                <NutritionSummary 
                  calories={{
                    current: dailyNutrition.calories,
                    goal: nutritionGoals.calories
                  }}
                  protein={{
                    current: dailyNutrition.protein,
                    goal: nutritionGoals.protein
                  }}
                  carbs={{
                    current: dailyNutrition.carbs,
                    goal: nutritionGoals.carbs
                  }}
                  fat={{
                    current: dailyNutrition.fat,
                    goal: nutritionGoals.fat
                  }}
                />
                
                {loadingEntries ? (
                  <div className="w-full mt-6 p-8 bg-white rounded-lg border border-gray-200 flex justify-center">
                    <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <FoodHistory 
                    entries={foodEntries}
                    onDeleteEntry={handleDeleteEntry}
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="summary">
            <div className="space-y-6">
              <NutritionSummary 
                calories={{
                  current: dailyNutrition.calories,
                  goal: nutritionGoals.calories
                }}
                protein={{
                  current: dailyNutrition.protein,
                  goal: nutritionGoals.protein
                }}
                carbs={{
                  current: dailyNutrition.carbs,
                  goal: nutritionGoals.carbs
                }}
                fat={{
                  current: dailyNutrition.fat,
                  goal: nutritionGoals.fat
                }}
              />
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Nutrition Insights</h2>
                <p className="text-gray-700">
                  Based on your recent food logs, you're getting a good balance of macronutrients.
                  Consider adding more protein sources to help reach your daily goal.
                </p>
              </div>
              
              {loadingEntries ? (
                <div className="w-full p-8 bg-white rounded-lg border border-gray-200 flex justify-center">
                  <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <FoodHistory 
                  entries={foodEntries}
                  onDeleteEntry={handleDeleteEntry}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
