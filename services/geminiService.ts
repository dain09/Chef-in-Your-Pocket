import { GoogleGenAI, Type, Chat } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import type { Recipe, Menu, Ingredient, MultilingualString, MealPlan, Substitute } from '../types';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// Helper Schemas
const multilingualStringSchema = {
    type: Type.OBJECT,
    properties: {
        en: { type: Type.STRING },
        ar: { type: Type.STRING },
    },
    required: ['en', 'ar'],
};

const ingredientSchema = {
    type: Type.OBJECT,
    properties: {
        amount: multilingualStringSchema,
        name: multilingualStringSchema,
    },
    required: ['amount', 'name'],
};

const pairingSchema = {
    type: Type.OBJECT,
    properties: {
        name: multilingualStringSchema,
        description: multilingualStringSchema,
    },
    required: ['name', 'description'],
};

// Main Recipe Schema
const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: multilingualStringSchema,
        description: multilingualStringSchema,
        prepTime: multilingualStringSchema,
        cookTime: multilingualStringSchema,
        servings: { type: Type.NUMBER },
        difficulty: { type: Type.STRING },
        category: { type: Type.STRING, enum: ['Healthy', 'Dessert', 'Seafood', 'Meat', 'Vegetarian', 'Pasta', 'General'] },
        ingredients: {
            type: Type.ARRAY,
            items: ingredientSchema,
        },
        steps: {
            type: Type.ARRAY,
            items: multilingualStringSchema,
        },
        nutrition: {
            type: Type.OBJECT,
            properties: {
                calories: multilingualStringSchema,
                protein: multilingualStringSchema,
                carbs: multilingualStringSchema,
                fat: multilingualStringSchema,
            },
            required: ['calories', 'protein', 'carbs', 'fat'],
        },
        funStuff: {
            type: Type.OBJECT,
            properties: {
                proTips: { type: Type.ARRAY, items: multilingualStringSchema },
                jokes: { type: Type.ARRAY, items: multilingualStringSchema },
                historyFact: multilingualStringSchema,
            },
            required: ['proTips', 'jokes', 'historyFact'],
        },
        pairings: {
            type: Type.ARRAY,
            items: pairingSchema,
        },
    },
    required: [
        'recipeName', 'description', 'prepTime', 'cookTime', 'servings',
        'difficulty', 'category', 'ingredients', 'steps', 'nutrition', 'funStuff'
    ],
};

const mealPlanSchema = {
    type: Type.OBJECT,
    properties: {
        title: multilingualStringSchema,
        plan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: multilingualStringSchema,
                    recipe: recipeSchema,
                },
                required: ['day', 'recipe'],
            }
        }
    },
    required: ['title', 'plan']
};


const parseJsonResponse = <T>(jsonString: string): T => {
    try {
        const cleanedString = jsonString.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanedString) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonString, e);
        throw new Error("errorFailedToGenerate");
    }
};

export const generateRecipe = async (ingredients: string, cuisine: string, allergies: string, diet: string): Promise<Recipe> => {
    const prompt = `
      Create a detailed recipe using these ingredients: ${ingredients}.
      Cuisine: ${cuisine === 'random' ? 'any cuisine is fine' : cuisine}.
      Allergies to avoid: ${allergies || 'none'}.
      Dietary preference: ${diet === 'none' ? 'no specific diet' : diet}.
      The recipe should be creative, delicious, and easy to follow.
      Provide all text in two languages: English (en) and Arabic (ar).
      The difficulty should be 'Easy', 'Medium', or 'Hard'.
      The category should be one of: 'Healthy', 'Dessert', 'Seafood', 'Meat', 'Vegetarian', 'Pasta', 'General'.
      Ensure the response strictly follows the provided JSON schema.
      Include fun stuff like pro tips, jokes, and a history fact related to the dish or cuisine.
      Also, suggest some drink pairings.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
    });

    const recipeData = parseJsonResponse<Omit<Recipe, 'id'>>(response.text);
    return { ...recipeData, id: uuidv4() };
};

export const searchRecipeByName = async (recipeName: string): Promise<Recipe> => {
    const prompt = `
      Find and generate a detailed recipe for "${recipeName}".
      The recipe should be creative, delicious, and easy to follow.
      Provide all text in two languages: English (en) and Arabic (ar).
      The difficulty should be 'Easy', 'Medium', or 'Hard'.
      The category should be one of: 'Healthy', 'Dessert', 'Seafood', 'Meat', 'Vegetarian', 'Pasta', 'General'.
      Ensure the response strictly follows the provided JSON schema.
      Include fun stuff like pro tips, jokes, and a history fact related to the dish or cuisine.
      Also, suggest some drink pairings.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
    });
    
    const recipeData = parseJsonResponse<Omit<Recipe, 'id'>>(response.text);
    return { ...recipeData, id: uuidv4() };
};

export const remixLeftovers = async (ingredients: string): Promise<Recipe> => {
    const prompt = `
        I have these leftovers: ${ingredients}. Create a new, creative, and delicious recipe to use them up and avoid food waste.
        The recipe should be detailed and easy to follow.
        Provide all text in two languages: English (en) and Arabic (ar).
        Difficulty should be 'Easy', 'Medium', or 'Hard'.
        Category should be one of: 'Healthy', 'Dessert', 'Seafood', 'Meat', 'Vegetarian', 'Pasta', 'General'.
        Ensure the response strictly follows the provided JSON schema.
        Include fun stuff like pro tips, jokes, and a history fact.
        Also suggest some drink pairings.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
    });
    
    const recipeData = parseJsonResponse<Omit<Recipe, 'id'>>(response.text);
    return { ...recipeData, id: uuidv4() };
};

export const generateWeeklyMealPlan = async (prompt: string): Promise<MealPlan> => {
    const fullPrompt = `
        Create a 7-day meal plan based on this user request: "${prompt}".
        For each day, provide a unique day name (e.g., 'Day 1 - Quick Start Monday') and a complete recipe that fits the weekly theme.
        Each recipe must be detailed and follow the full recipe JSON schema provided.
        The overall plan needs a creative title.
        All text must be provided in both English (en) and Arabic (ar).
        Ensure the final output is a single JSON object that strictly adheres to the provided meal plan schema.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: mealPlanSchema,
        },
    });
    
    const planData = parseJsonResponse<MealPlan>(response.text);
    planData.plan.forEach(day => {
        day.recipe.id = uuidv4();
    });
    return planData;
};

export const remixRecipe = async (originalRecipe: Recipe, remixPrompt: string): Promise<Recipe> => {
    const prompt = `
      Remix the following recipe based on this instruction: "${remixPrompt}".

      Original Recipe JSON:
      ${JSON.stringify(originalRecipe)}

      Generate a new, complete recipe based on the change. The new recipe must still be delicious and easy to follow.
      Provide all text in two languages: English (en) and Arabic (ar).
      Ensure the response is a single JSON object that strictly follows the provided recipe schema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
    });

    const recipeData = parseJsonResponse<Omit<Recipe, 'id'>>(response.text);
    return { ...recipeData, id: uuidv4() };
};

export const identifyIngredientsFromImage = async (base64Image: string): Promise<string> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };
    const textPart = {
        text: 'Identify the food items in this image. List them as comma-separated ingredients suitable for a recipe. Respond only with the list of ingredients in English.'
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text.trim();
};


export const startCookingChat = (recipe: Recipe, lang: 'en' | 'ar'): Chat => {
  const systemInstruction = `You are a helpful and encouraging cooking assistant for a specific recipe. Your name is "Chef". 
  The user is about to cook the following recipe:
  Recipe Name: ${recipe.recipeName[lang]}
  Ingredients: ${recipe.ingredients.map(i => `${i.amount[lang]} ${i.name[lang]}`).join(', ')}
  Steps: ${recipe.steps.map((s, i) => `Step ${i + 1}: ${s[lang]}`).join('\n')}
  
  Your primary language for responding should be ${lang === 'ar' ? 'Arabic' : 'English'}.
  Answer only questions related to this specific recipe, cooking techniques, ingredient substitutions for this recipe, or kitchen safety. 
  If asked about something unrelated, politely decline and steer the conversation back to the recipe.
  Keep your answers concise and clear. Be friendly and encouraging.`;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: systemInstruction,
    },
  });
  return chat;
};


export const generateRecipeImage = async (recipeName: string, recipeDescription: string): Promise<string | null> => {
    try {
        const prompt = `
            Create a vibrant, appetizing, photorealistic image for a recipe.
            Recipe Name: "${recipeName}"
            Description: "${recipeDescription}"
            The image should be beautifully lit, with a clean background that complements the dish. Focus on making the food look delicious and fresh. Top-down or a 45-degree angle shot.
            IMPORTANT: Generate a web-optimized, lightweight photo with a small file size to ensure it loads quickly on all devices.
        `;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            }
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;
    } catch (error) {
        console.error("Image generation failed:", error);
        return null;
    }
};

export const getCookingTip = async (): Promise<MultilingualString> => {
    const prompt = `Provide a single, short, interesting cooking tip or food fact. The tip should be universally helpful. Provide the response in both English (en) and Arabic (ar). Ensure the response strictly follows the provided JSON schema.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: multilingualStringSchema
        }
    });

    return parseJsonResponse<MultilingualString>(response.text);
};

export const getIngredientSubstitutes = async (ingredientName: string): Promise<Substitute[]> => {
    const prompt = `For the ingredient "${ingredientName}", provide 2-3 common substitutes. For each substitute, give a brief description of how it might change the recipe's flavor or texture. Provide the response in both English (en) and Arabic (ar). Ensure the response strictly follows the provided JSON schema.`;

    const substituteSchema = {
        type: Type.OBJECT,
        properties: {
            name: multilingualStringSchema,
            description: multilingualStringSchema,
        },
        required: ['name', 'description'],
    };

    const responseSchema = {
        type: Type.ARRAY,
        items: substituteSchema,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    return parseJsonResponse<Substitute[]>(response.text);
};

export const getRecipeOfTheDay = async (): Promise<Recipe> => {
    const prompt = `
        Generate a "Recipe of the Day". It should be a popular, appealing, and relatively easy dish that would be interesting to a general audience.
        Provide all text in two languages: English (en) and Arabic (ar).
        The difficulty should be 'Easy' or 'Medium'.
        The category should be one of: 'Healthy', 'Dessert', 'Seafood', 'Meat', 'Vegetarian', 'Pasta', 'General'.
        Ensure the response strictly follows the provided JSON schema.
        Include fun stuff like pro tips, jokes, and a history fact related to the dish or cuisine.
        Also, suggest some drink pairings.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
    });

    const recipeData = parseJsonResponse<Omit<Recipe, 'id'>>(response.text);
    return { ...recipeData, id: uuidv4() };
};

export const generateMenu = async (occasion: string): Promise<Menu> => {
    throw new Error("generateMenu is not implemented");
};