import { GoogleGenAI, Type } from "@google/genai";
import type {
  Recipe,
  MultilingualString,
  Menu,
  MealPlan,
  FestivalTheme,
} from "../types";

// FIX: Initialize the GoogleGenAI client with a named apiKey parameter as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.OBJECT,
      properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
      required: ['en', 'ar'],
    },
    description: {
      type: Type.OBJECT,
      properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
      required: ['en', 'ar'],
    },
    cuisine: {
      type: Type.OBJECT,
      properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
      required: ['en', 'ar'],
    },
    diet: {
      type: Type.OBJECT,
      properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
      required: ['en', 'ar'],
    },
    cookTime: {
      type: Type.OBJECT,
      properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
      required: ['en', 'ar'],
    },
    servings: { type: Type.INTEGER },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.OBJECT,
            properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
            required: ['en', 'ar'],
          },
          amount: {
            type: Type.OBJECT,
            properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
            required: ['en', 'ar'],
          },
        },
        required: ['name', 'amount'],
      },
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.OBJECT,
            properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } },
            required: ['en', 'ar'],
          },
        },
        required: ['text'],
      },
    },
    youtubeUrl: { type: Type.STRING, description: "A URL to a YouTube video for the recipe, if a relevant one is found. Otherwise, an empty string." },
  },
  required: ['title', 'description', 'cuisine', 'diet', 'cookTime', 'servings', 'ingredients', 'steps', 'youtubeUrl'],
};

const parseJsonResponse = <T,>(jsonString: string): T | null => {
  try {
    const cleanedString = jsonString.replace(/^```json\s*|```$/g, '').trim();
    return JSON.parse(cleanedString) as T;
  } catch (error) {
    console.error("Failed to parse JSON response:", error, "Raw string:", jsonString);
    return null;
  }
};

const generateImageForRecipe = async (recipeTitle: string, cuisine: string): Promise<string> => {
  try {
    const prompt = `A cinematic, realistic, delicious-looking photo of ${recipeTitle}, a classic ${cuisine} dish. The food should be presented beautifully on a plate, with a shallow depth of field, on a rustic wooden table. The lighting should be warm and inviting.`;
    
    // FIX: Use the 'imagen-4.0-generate-001' model for image generation as per guidelines.
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return "IMAGE_GENERATION_FAILED";
  } catch (error) {
    console.error("Error generating image:", error);
    return "IMAGE_GENERATION_FAILED";
  }
};


export const generateRecipe = async (
  ingredients: string,
  cuisine: string,
  diet: string,
  recipeName?: string,
  remixRecipe?: Recipe,
  availableIngredients?: string[]
): Promise<Recipe | null> => {
    let prompt = `You are a world-class chef. Create a delicious and easy-to-follow recipe.
    The user wants a recipe with the following characteristics:
    - Main Ingredients: ${ingredients}
    - Cuisine: ${cuisine === 'random' ? 'Suggest something popular and fitting' : cuisine}
    - Dietary Restrictions: ${diet === 'none' ? 'None' : diet}
    `;

    if (recipeName) {
        prompt += `- The user is specifically asking for a recipe named: "${recipeName}". Prioritize this.`;
    }

    if (remixRecipe) {
        prompt += `\nThis is a "remix" of an existing recipe. Start with this original recipe and modify it to incorporate the new ingredients.
        Original Recipe Title: ${remixRecipe.title.en}
        Original Ingredients: ${remixRecipe.ingredients.map(i => i.name.en).join(', ')}
        New main ingredient to incorporate: ${ingredients}.
        Make sure the new recipe is a creative evolution of the original.`;
    }
    
    if (availableIngredients) {
        prompt += `\nThe user has checked their pantry and only has these ingredients from the original recipe: ${availableIngredients.join(', ')}. Please modify the recipe to work with only these ingredients, suggesting simple substitutes for what's missing if absolutely necessary.`;
    }

    prompt += `\nYour response MUST be in JSON format and adhere to the provided schema. Provide all text in both English ('en') and Arabic ('ar'). Be creative and inspiring with the recipe title and description.`;
  
  try {
    // FIX: Use 'gemini-2.5-flash' model and correct API call structure.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
    });

    // FIX: Access the generated text directly from the 'text' property of the response.
    const recipeData = parseJsonResponse<Omit<Recipe, 'id' | 'imageUrl'>>(response.text);

    if (recipeData) {
      const imageUrl = await generateImageForRecipe(recipeData.title.en, recipeData.cuisine.en);
      return {
        ...recipeData,
        id: new Date().toISOString(),
        imageUrl: imageUrl,
      };
    }
    return null;
  } catch (error) {
    console.error("Error generating recipe:", error);
    return null;
  }
};


export const getCookingTip = async (): Promise<MultilingualString | null> => {
    const prompt = "Give me a single, short, and interesting cooking tip or kitchen hack. Provide it in both English ('en') and Arabic ('ar'). Your response must be in JSON format like this: {\"en\": \"...\", \"ar\": \"...\"}";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        en: { type: Type.STRING },
                        ar: { type: Type.STRING },
                    },
                    required: ['en', 'ar'],
                }
            },
        });

        return parseJsonResponse<MultilingualString>(response.text);

    } catch (error) {
        console.error("Error fetching cooking tip:", error);
        return null;
    }
};


export const getMonthlyFestivalTheme = async (): Promise<FestivalTheme | null> => {
    const prompt = `Create a fun, imaginative, and trendy monthly food "festival" theme for a recipe app. 
    It should include a main title, a short, engaging description, and three specific recipe ideas that fit the theme.
    For each recipe idea, provide a catchy title and a one-sentence description.
    Provide all text in both English ('en') and Arabic ('ar').
    Your response MUST be in JSON format and adhere to the provided schema.`;

    const festivalSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } }, required: ['en', 'ar'] },
            description: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } }, required: ['en', 'ar'] },
            recipeIdeas: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } }, required: ['en', 'ar'] },
                        description: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } }, required: ['en', 'ar'] },
                    },
                    required: ['title', 'description'],
                }
            }
        },
        required: ['title', 'description', 'recipeIdeas'],
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: festivalSchema,
            },
        });
        return parseJsonResponse<FestivalTheme>(response.text);
    } catch (error) {
        console.error("Error fetching festival theme:", error);
        return null;
    }
};

export const generateMenuForOccasion = async (occasion: string): Promise<Menu | null> => {
    const prompt = `Plan a complete 3-course menu (appetizer, main course, dessert) for the following occasion: "${occasion}".
    For each course, provide a full recipe object that matches the specified JSON schema.
    Ensure the courses are complementary and create a cohesive dining experience.
    The response must be a single JSON object containing the occasion and the three recipe objects.
    Provide all text in both English ('en') and Arabic ('ar').`;

    const menuSchema = {
        type: Type.OBJECT,
        properties: {
            occasion: { type: Type.STRING },
            appetizer: recipeSchema,
            mainCourse: recipeSchema,
            dessert: recipeSchema,
        },
        required: ['occasion', 'appetizer', 'mainCourse', 'dessert'],
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: menuSchema,
                maxOutputTokens: 8000,
                thinkingConfig: { thinkingBudget: 4000 },
            },
        });
        
        const menuData = parseJsonResponse<Omit<Menu, 'id'>>(response.text);

        if (menuData) {
            const [appetizerImg, mainCourseImg, dessertImg] = await Promise.all([
                generateImageForRecipe(menuData.appetizer.title.en, menuData.appetizer.cuisine.en),
                generateImageForRecipe(menuData.mainCourse.title.en, menuData.mainCourse.cuisine.en),
                generateImageForRecipe(menuData.dessert.title.en, menuData.dessert.cuisine.en)
            ]);
            
            return {
                ...menuData,
                id: new Date().toISOString(),
                appetizer: { ...menuData.appetizer, id: `app-${Date.now()}`, imageUrl: appetizerImg },
                mainCourse: { ...menuData.mainCourse, id: `main-${Date.now()}`, imageUrl: mainCourseImg },
                dessert: { ...menuData.dessert, id: `des-${Date.now()}`, imageUrl: dessertImg },
            };
        }
        return null;
    } catch (error) {
        console.error("Error generating menu:", error);
        return null;
    }
};
