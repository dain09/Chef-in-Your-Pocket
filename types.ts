export type LoadingMessages = 'generating' | 'remixing' | 'analyzing' | 'planning' | 'remixingLeftovers';

export type MultilingualString = {
  en: string;
  ar: string;
};

export interface Cuisine {
  value: string;
  en: string;
  ar: string;
}

export interface Ingredient {
  amount: MultilingualString;
  name: MultilingualString;
}

export interface Substitute {
  name: MultilingualString;
  description: MultilingualString;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Pairing {
  name: MultilingualString;
  description: MultilingualString;
}

export interface Recipe {
  id: string;
  recipeName: MultilingualString;
  description: MultilingualString;
  prepTime: MultilingualString;
  cookTime: MultilingualString;
  servings: number;
  difficulty: string;
  category: 'Healthy' | 'Dessert' | 'Seafood' | 'Meat' | 'Vegetarian' | 'Pasta' | 'General';
  ingredients: Ingredient[];
  steps: MultilingualString[];
  nutrition: {
    calories: MultilingualString;
    protein: MultilingualString;
    carbs: MultilingualString;
    fat: MultilingualString;
  };
  funStuff: {
    proTips: MultilingualString[];
    jokes: MultilingualString[];
    historyFact: MultilingualString;
  };
  imageUrl?: string;
  youtubeLink?: MultilingualString;
  pairings?: Pairing[];
}

export interface Menu {
  occasion: MultilingualString;
  appetizer: Recipe;
  mainCourse: Recipe;
  dessert: Recipe;
  imageUrl?: string;
}

export interface PantryItem {
  id: string;
  name: string;
}
