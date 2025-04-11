
import type { FoodItem } from '@/data/nutritionDatabase';
import { getNutritionData } from '@/data/nutritionDatabase';

// We're using this type to represent a recognized food entry
export interface FoodEntry {
  id: string;
  timestamp: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  imageData: string;
  foodItems: FoodItem[];
}

// Placeholder function for the AI food detection
// In a real implementation, this would call an ML model or API
export const detectFoodFromImage = async (imageData: string): Promise<FoodItem[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, we'd send the image to an AI model or API
  // For this demo, we'll return mock data based on time of day
  const hour = new Date().getHours();
  
  // Simple logic to return different food items based on time of day
  if (hour >= 5 && hour < 11) {
    // Breakfast
    return [
      getNutritionData('oatmeal'),
      getNutritionData('banana'),
    ];
  } else if (hour >= 11 && hour < 15) {
    // Lunch
    return [
      getNutritionData('chicken_breast'),
      getNutritionData('brown_rice'),
      getNutritionData('broccoli'),
    ];
  } else if (hour >= 15 && hour < 19) {
    // Snack
    return [
      getNutritionData('apple'),
      getNutritionData('almonds'),
    ];
  } else {
    // Dinner
    return [
      getNutritionData('salmon'),
      getNutritionData('sweet_potato'),
      getNutritionData('mixed_vegetables'),
    ];
  }
};

// Determine meal type based on time of day
export const determineMealType = (): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return 'breakfast';
  } else if (hour >= 11 && hour < 15) {
    return 'lunch';
  } else if (hour >= 19 && hour < 23) {
    return 'dinner';
  } else {
    return 'snack';
  }
};

// Save a new food entry to local storage
export const saveFoodEntry = (entry: FoodEntry): void => {
  const existingEntries = getFoodEntries();
  const updatedEntries = [entry, ...existingEntries];
  
  localStorage.setItem('foodEntries', JSON.stringify(updatedEntries));
};

// Get all food entries from local storage
export const getFoodEntries = (): FoodEntry[] => {
  const entriesJson = localStorage.getItem('foodEntries');
  return entriesJson ? JSON.parse(entriesJson) : [];
};

// Delete a food entry from local storage
export const deleteFoodEntry = (entryId: string): void => {
  const existingEntries = getFoodEntries();
  const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
  
  localStorage.setItem('foodEntries', JSON.stringify(updatedEntries));
};

// Calculate daily nutrition totals from all entries today
export const calculateDailyNutrition = () => {
  const entries = getFoodEntries();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  const totalNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };
  
  todayEntries.forEach(entry => {
    entry.foodItems.forEach(item => {
      totalNutrition.calories += item.nutrition.calories;
      totalNutrition.protein += item.nutrition.protein;
      totalNutrition.carbs += item.nutrition.carbs;
      totalNutrition.fat += item.nutrition.fat;
    });
  });
  
  return totalNutrition;
};
