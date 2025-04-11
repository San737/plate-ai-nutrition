// Define the food item interface
export interface FoodItem {
  id: string;
  name: string;
  portionSize?: string;
  imageUrl?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Pre-defined nutrition data
const nutritionData: Record<string, FoodItem> = {
  apple: {
    id: 'apple',
    name: 'Apple',
    portionSize: '1 medium (182g)',
    imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXBwbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3
    }
  },
  banana: {
    id: 'banana',
    name: 'Banana',
    portionSize: '1 medium (118g)',
    imageUrl: 'https://images.unsplash.com/photo-1566393028639-d108a42c46a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuYW5hfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4
    }
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    portionSize: '1 medium (131g)',
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9041525?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 62,
      protein: 1.2,
      carbs: 15.4,
      fat: 0.2
    }
  },
  chicken_breast: {
    id: 'chicken_breast',
    name: 'Chicken Breast',
    portionSize: '100g',
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGJyZWFzdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6
    }
  },
  salmon: {
    id: 'salmon',
    name: 'Salmon Fillet',
    portionSize: '100g',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsbW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 13
    }
  },
  brown_rice: {
    id: 'brown_rice',
    name: 'Brown Rice',
    portionSize: '100g cooked',
    imageUrl: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnJvd24lMjByaWNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 112,
      protein: 2.6,
      carbs: 23,
      fat: 0.9
    }
  },
  broccoli: {
    id: 'broccoli',
    name: 'Broccoli',
    portionSize: '100g',
    imageUrl: 'https://images.unsplash.com/photo-1583680599407-5dea2f634f10?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnJvY2NvbGl8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 34,
      protein: 2.8,
      carbs: 6.6,
      fat: 0.4
    }
  },
  almonds: {
    id: 'almonds',
    name: 'Almonds',
    portionSize: '1 oz (28g)',
    imageUrl: 'https://images.unsplash.com/photo-1548329408-0bcd6e68058d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWxtb25kc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 164,
      protein: 6,
      carbs: 6,
      fat: 14
    }
  },
  oatmeal: {
    id: 'oatmeal',
    name: 'Oatmeal',
    portionSize: '1 cup cooked',
    imageUrl: 'https://images.unsplash.com/photo-1584263347416-85a696b87e88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b2F0bWVhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 158,
      protein: 6,
      carbs: 27,
      fat: 3
    }
  },
  sweet_potato: {
    id: 'sweet_potato',
    name: 'Sweet Potato',
    portionSize: '1 medium (130g)',
    imageUrl: 'https://images.unsplash.com/photo-1596097635626-78302a52373e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3dlZXQlMjBwb3RhdG98ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 112,
      protein: 2,
      carbs: 26,
      fat: 0.1
    }
  },
  mixed_vegetables: {
    id: 'mixed_vegetables',
    name: 'Mixed Vegetables',
    portionSize: '1 cup (160g)',
    imageUrl: 'https://images.unsplash.com/photo-1510629315233-401ffcc8d15a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWl4ZWQlMjB2ZWdldGFibGVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 59,
      protein: 4,
      carbs: 13,
      fat: 0.2
    }
  },
  greek_yogurt: {
    id: 'greek_yogurt',
    name: 'Greek Yogurt',
    portionSize: '1 cup (245g)',
    imageUrl: 'https://images.unsplash.com/photo-1575938748739-c7be9c92547e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZWslMjB5b2d1cnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    nutrition: {
      calories: 130,
      protein: 22,
      carbs: 6,
      fat: 2
    }
  },
};

// Function to get nutrition data for a specific food
export const getNutritionData = (foodId: string): FoodItem => {
  // If the food exists in our database, return it
  if (foodId in nutritionData) {
    return nutritionData[foodId];
  }
  
  // Otherwise return a default "unknown" food item
  return {
    id: 'unknown',
    name: 'Unknown Food Item',
    nutrition: {
      calories: 100,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  };
};

// Export the list of all available foods
export const getAllFoodItems = (): FoodItem[] => {
  return Object.values(nutritionData);
};
