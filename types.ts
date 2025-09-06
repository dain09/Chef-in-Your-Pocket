export interface MultilingualString {
  en: string;
  ar: string;
}

export interface Cuisine {
  value: string;
  en: string;
  ar: string;
}

export interface Ingredient {
  name: MultilingualString;
  amount: MultilingualString;
}

export interface RecipeStep {
  text: MultilingualString;
}

export interface Recipe {
  id: string;
  title: MultilingualString;
  description: MultilingualString;
  cuisine: MultilingualString;
  diet: MultilingualString;
  cookTime: MultilingualString;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  imageUrl: string; // base64 string
  youtubeUrl?: string;
}

export interface PantryItem {
    id: string;
    name: string;
    date: string;
    expiryDate?: string;
}

export interface Menu {
    id: string;
    occasion: string;
    appetizer: Recipe;
    mainCourse: Recipe;
    dessert: Recipe;
}

export interface MealPlan {
    id: string;
    goals: string;
    days: {
        day: MultilingualString;
        recipe: Recipe;
    }[];
}

export interface FestivalTheme {
  title: MultilingualString;
  description: MultilingualString;
  recipeIdeas: {
    title: MultilingualString;
    description: MultilingualString;
  }[];
}

export interface AcademyLesson {
  id: string;
  title: MultilingualString;
  category: MultilingualString;
  duration: MultilingualString;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: MultilingualString;
}

export interface FlavorProfileData {
    sweet: number;
    sour: number;
    bitter: number;
    salty: number;
    umami: number;
}

export type LoadingMessages = 'generating' | 'remixing' | 'remixingLeftovers' | 'analyzing' | 'planningMenu' | 'planningWeek';
