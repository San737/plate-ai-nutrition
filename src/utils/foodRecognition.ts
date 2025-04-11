
import type { FoodItem } from '@/data/nutritionDatabase';
import { getNutritionData } from '@/data/nutritionDatabase';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { Database } from '@/integrations/supabase/types';

// We're using this type to represent a recognized food entry
export interface FoodEntry {
  id: string;
  timestamp: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  imageData: string;
  foodItems: FoodItem[];
  user_id?: string;
}

// Database types for TypeScript safety
type DbFoodEntry = {
  id: string;
  user_id: string;
  timestamp: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image_url?: string;
  food_items: Json;
  created_at?: string;
}

// Use Gemini for food detection via edge function
export const detectFoodFromImage = async (imageData: string): Promise<FoodItem[]> => {
  try {
    // Call the Supabase Edge Function for image analysis
    const { data, error } = await supabase.functions.invoke('analyze-food-image', {
      body: { imageData }
    });

    if (error) {
      console.error("Error calling analyze-food-image:", error);
      // Fallback to mock data
      return getFallbackFoodData();
    }

    // Process the response from Gemini
    if (data && data.foodItems && Array.isArray(data.foodItems)) {
      return data.foodItems.map((item: any) => ({
        id: Math.random().toString(36).substring(7),
        name: item.name,
        portionSize: item.portionSize || '1 serving',
        nutrition: {
          calories: item.nutrition.calories || 0,
          protein: item.nutrition.protein || 0,
          carbs: item.nutrition.carbs || 0,
          fat: item.nutrition.fat || 0
        }
      }));
    } else {
      console.error("Invalid response from analyze-food-image:", data);
      return getFallbackFoodData();
    }
  } catch (error) {
    console.error("Error in detectFoodFromImage:", error);
    return getFallbackFoodData();
  }
};

// Fallback function to return mock data based on time of day
const getFallbackFoodData = (): FoodItem[] => {
  const hour = new Date().getHours();
  
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

// Save a new food entry to Supabase
export const saveFoodEntry = async (entry: FoodEntry): Promise<{ success: boolean; error?: any }> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Prepare entry for database - convert FoodItem[] to Json compatible format
    const dbEntry = {
      meal_type: entry.mealType,
      food_items: entry.foodItems as unknown as Json,
      timestamp: new Date(entry.timestamp).toISOString(),
      user_id: user.id,
    };
    
    console.log("Saving entry:", dbEntry);
    
    // Insert into database
    const { error } = await supabase
      .from('food_entries')
      .insert(dbEntry);
    
    if (error) {
      console.error("Database error when saving entry:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving food entry:", error);
    return { success: false, error };
  }
};

// Get all food entries from Supabase
export const getFoodEntries = async (): Promise<FoodEntry[]> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    // Query database
    const { data, error } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    console.log("Retrieved data from database:", data);
    
    // Convert database entries to FoodEntry format
    return (data || []).map((entry: DbFoodEntry) => ({
      id: entry.id,
      timestamp: new Date(entry.timestamp).getTime(),
      mealType: entry.meal_type,
      imageData: entry.image_url || '',
      foodItems: entry.food_items as unknown as FoodItem[],
      user_id: entry.user_id
    }));
  } catch (error) {
    console.error("Error getting food entries:", error);
    return [];
  }
};

// Delete a food entry from Supabase
export const deleteFoodEntry = async (entryId: string): Promise<boolean> => {
  try {
    console.log("Deleting entry with ID:", entryId);
    const { error } = await supabase
      .from('food_entries')
      .delete()
      .eq('id', entryId);
    
    if (error) {
      console.error("Database error when deleting entry:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting food entry:", error);
    return false;
  }
};

// Calculate daily nutrition totals from all entries today
export const calculateDailyNutrition = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }
    
    // Get today's entries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('timestamp', today.toISOString());
    
    if (error) throw error;
    
    console.log("Retrieved today's entries:", data);
    
    // Calculate totals
    const totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
    
    (data || []).forEach((entry: DbFoodEntry) => {
      const foodItems = entry.food_items as unknown as FoodItem[];
      
      if (Array.isArray(foodItems)) {
        foodItems.forEach(item => {
          if (item && item.nutrition) {
            totalNutrition.calories += item.nutrition.calories || 0;
            totalNutrition.protein += item.nutrition.protein || 0;
            totalNutrition.carbs += item.nutrition.carbs || 0;
            totalNutrition.fat += item.nutrition.fat || 0;
          }
        });
      }
    });
    
    return totalNutrition;
  } catch (error) {
    console.error("Error calculating daily nutrition:", error);
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
  }
};
