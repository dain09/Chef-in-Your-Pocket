import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Recipe, Ingredient, Substitute, Menu, Pairing, MultilingualString, MealPlan } from '../types';

// Per @google/genai guidelines, the API key must be sourced directly from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// This function is now re-enabled and exported to be called from the front-end.
export const generateRecipeImage = async (recipeName: string, description: string): Promise<string | null> => {
    try {
        const prompt = `A delicious, professional, vibrant photo of "${recipeName}". A mouth-watering dish described as: "${description}". The image should be in a cinematic, foodie magazine style, with a clean, simple background. Aspect ratio 16:9.`;

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
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;
    } catch (error) {
        console.error("Error generating recipe image:", error);
        return null; // Return null on failure, the UI can handle it.
    }
};

const multilingualStringSchema = {
    type: Type.OBJECT,
    properties: {
        en: { type: Type.STRING, description: "The content in English." },
        ar: { type: Type.STRING, description: "The content in Arabic (العربية)." }
    },
    required: ["en", "ar"]
};

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { ...multilingualStringSchema, description: "The recipe name in both English and Arabic." },
    description: { ...multilingualStringSchema, description: "A captivating one-sentence description in both languages." },
    prepTime: { ...multilingualStringSchema, description: "Preparation time, e.g., {en: '15 minutes', ar: '15 دقيقة'}" },
    cookTime: { ...multilingualStringSchema, description: "Cooking time, e.g., {en: '30 minutes', ar: '30 دقيقة'}" },
    servings: { type: Type.INTEGER, description: "Number of servings the recipe yields." },
    difficulty: {
        type: Type.STRING,
        enum: ['Easy', 'Medium', 'Hard'],
        description: "Classify the recipe's difficulty. Must be one of: 'Easy', 'Medium', 'Hard'."
    },
    category: {
      type: Type.STRING,
      enum: ['Healthy', 'Dessert', 'Seafood', 'Meat', 'Vegetarian', 'Pasta', 'General'],
      description: "Classify the recipe into one category from the list. Choose 'General' if no other fits."
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          amount: { ...multilingualStringSchema, description: "The quantity in both languages, e.g., {en: '1 cup', ar: '1 كوب'}" },
          name: { ...multilingualStringSchema, description: "The ingredient name in both languages." },
        },
        required: ["amount", "name"],
      },
    },
    steps: {
      type: Type.ARRAY,
      items: { ...multilingualStringSchema, description: "A single preparation step in both English and Arabic." },
    },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { ...multilingualStringSchema, description: "Calories, e.g., {en: '350 calories', ar: '350 سعر حراري'}" },
        protein: { ...multilingualStringSchema, description: "Protein, e.g., {en: '15g', ar: '15 جرام'}" },
        carbs: { ...multilingualStringSchema, description: "Carbohydrates, e.g., {en: '40g', ar: '40 جرام'}" },
        fat: { ...multilingualStringSchema, description: "Fat, e.g., {en: '20g', ar: '20 جرام'}" },
      },
      required: ["calories", "protein", "carbs", "fat"],
    },
    funStuff: {
      type: Type.OBJECT,
      properties: {
        proTips: {
          type: Type.ARRAY,
          items: { ...multilingualStringSchema, description: "A professional cooking tip in both languages." },
        },
        jokes: {
          type: Type.ARRAY,
          items: { ...multilingualStringSchema, description: "A food-related joke in both languages." },
        },
        historyFact: { ...multilingualStringSchema, description: "An interesting historical fact about the dish in both languages." },
      },
      required: ["proTips", "jokes", "historyFact"],
    },
  },
  required: ["recipeName", "description", "prepTime", "cookTime", "servings", "difficulty", "category", "ingredients", "steps", "nutrition", "funStuff"],
};

const menuSchema = {
    type: Type.OBJECT,
    properties: {
        occasion: { ...multilingualStringSchema, description: "A creative, appealing name for the menu or occasion in both languages." },
        appetizer: recipeSchema,
        mainCourse: recipeSchema,
        dessert: recipeSchema,
    },
    required: ["occasion", "appetizer", "mainCourse", "dessert"],
};

const mealPlanSchema = {
    type: Type.OBJECT,
    properties: {
        title: { ...multilingualStringSchema, description: "A creative title for the meal plan, in both English and Arabic." },
        plan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { ...multilingualStringSchema, description: "The day for this meal, e.g., {en: 'Monday Dinner', ar: 'عشاء الإثنين'}." },
                    recipe: recipeSchema
                },
                required: ["day", "recipe"]
            }
        }
    },
    required: ["title", "plan"]
};


const pairingSchema = {
    type: Type.OBJECT,
    properties: {
        name: { ...multilingualStringSchema, description: "The name of the drink pairing in both English and Arabic." },
        description: { ...multilingualStringSchema, description: "A brief explanation of why this drink pairs well with the dish, in both languages." }
    },
    required: ["name", "description"]
};

const pairingsResponseSchema = {
    type: Type.ARRAY,
    items: pairingSchema
};

const getDrinkPairings = async (recipeName: string, recipeDescription: string): Promise<Pairing[] | null> => {
    const prompt = `
        You are an expert mixologist.
        For the recipe "${recipeName}" described as "${recipeDescription}", provide a list of perfect non-alcoholic drink pairings.

        **CRITICAL INSTRUCTION**: Your response must be a single, valid JSON array of objects, following the provided schema.
        - Provide 2-3 creative non-alcoholic pairings.
        - For each pairing, provide a name and a short description explaining why it's a good match.
        - For EVERY text field (name, description), you MUST provide an object with 'en' for English and 'ar' for Arabic.
        - Do not include any text, greetings, or explanations outside the JSON array.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: pairingsResponseSchema,
            },
        });
        // Correctly access the .text property for the response string.
        const text = response.text;
        return JSON.parse(text);
    } catch (error) {
        console.error("Error generating drink pairings:", error);
        return null; // Return null on failure
    }
};


export const generateRecipe = async (ingredients: string, cuisine: string, allergies: string, diet: string): Promise<Recipe> => {

  const allergyPrompt = allergies.trim() 
    ? `\n- CRITICAL SAFETY INSTRUCTION: The user is allergic to the following: "${allergies}". You MUST create a recipe that is completely free of these ingredients and any derivatives. Double-check the ingredient list to ensure it is safe.` 
    : "";
  
  const dietPrompt = diet && diet !== 'none'
    ? `\n- DIETARY RESTRICTION: The recipe MUST strictly adhere to the following diet: "${diet}". All ingredients must be compliant.`
    : "";
    
  const cuisinePrompt = cuisine.toLowerCase() === 'random'
    ? `- Cuisine Type: Surprise me! Choose a suitable and interesting world cuisine that works well with the provided ingredients.`
    : `- Cuisine Type: ${cuisine}`;

  const prompt = `
    You are a world-class chef, food historian, and comedian named "Chef AI".
    Your task is to create a complete recipe and entertainment package based on the user's preferences.

    **CRITICAL INSTRUCTION**: For EVERY text field (e.g., recipeName, description, ingredient names, steps, tips, jokes), you MUST provide an object with two keys: 'en' for the English version and 'ar' for the Arabic (العربية) version. The entire JSON response must follow this bilingual structure.

    **CRITICAL DIETARY RESTRICTION**: The recipe MUST NOT contain any pork, pork-derived products (like gelatin, lard), or any form of alcohol (like wine, beer, liquor) as an ingredient. This is a strict requirement.

    User Preferences:
    - Main Ingredients: ${ingredients}
    ${cuisinePrompt}
    ${dietPrompt}
    ${allergyPrompt}

    Please generate the recipe in a single, valid JSON object according to the provided schema.
    - You must classify the recipe's category and difficulty.
    - You must provide exactly 3 different jokes, 3 pro tips, and one historical fact.
    - Do not include any text, greetings, or explanations outside the JSON object itself.
  `;

  try {
    // Step 1: Generate Recipe Text
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
      },
    });

    const text = response.text;
    const recipeData = JSON.parse(text);

    // Step 2: Generate pairings. Image will be generated separately by the client.
    const pairings = await getDrinkPairings(recipeData.recipeName.en, recipeData.description.en);

    // Step 3: Combine and Return
    return { 
        ...recipeData, 
        id: new Date().toISOString(),
        imageUrl: undefined,
        pairings: pairings || undefined
    };

  } catch (error) {
    console.error("Error generating recipe from Gemini:", error);
    throw new Error("errorFailedToGenerate");
  }
};

export const searchRecipeByName = async (recipeNameQuery: string): Promise<Recipe> => {
      const prompt = `
        You are a world-class chef, food historian, and comedian named "Chef AI".
        A user is searching for a specific recipe by name. Your task is to provide the most popular, authentic, and well-regarded version of this recipe.

        Recipe Name Searched: "${recipeNameQuery}"

        **CRITICAL INSTRUCTION**: For EVERY text field (e.g., recipeName, description, ingredient names, steps, tips, jokes), you MUST provide an object with two keys: 'en' for the English version and 'ar' for the Arabic (العربية) version. The entire JSON response must follow this bilingual structure.

        **CRITICAL DIETARY RESTRICTION**: The recipe MUST NOT contain any pork, pork-derived products (like gelatin, lard), or any form of alcohol (like wine, beer, liquor) as an ingredient. This is a strict requirement.

        Please generate the recipe in a single, valid JSON object according to the provided schema.
        - The 'recipeName' you return should be the official name of the dish, even if the user's query was a bit different.
        - You must classify the recipe's category and difficulty.
        - You must provide exactly 3 different jokes, 3 pro tips, and one historical fact.
        - Do not include any text, greetings, or explanations outside the JSON object itself.
      `;

      try {
        // Step 1: Generate Recipe Text
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: recipeSchema,
          },
        });

        const text = response.text;
        const recipeData = JSON.parse(text);

        // Step 2: Generate pairings. Image will be generated separately by the client.
        const pairings = await getDrinkPairings(recipeData.recipeName.en, recipeData.description.en);

        // Step 3: Combine and Return
        return {
            ...recipeData,
            id: new Date().toISOString(),
            imageUrl: undefined,
            pairings: pairings || undefined
        };

      } catch (error) {
        console.error("Error searching for recipe from Gemini:", error);
        throw new Error("errorFailedToGenerate");
      }
    };

export const remixLeftovers = async (ingredients: string): Promise<Recipe> => {
  const prompt = `
    You are a world-class, creative chef named "Chef AI", specializing in reducing food waste.
    Your task is to invent a delicious and complete recipe using ONLY the leftover ingredients provided by the user.

    **CRITICAL INSTRUCTION**: For EVERY text field (e.g., recipeName, description, ingredient names, steps, tips, jokes), you MUST provide an object with two keys: 'en' for the English version and 'ar' for the Arabic (العربية) version.

    **CRITICAL DIETARY RESTRICTION**: The recipe MUST NOT contain any pork, pork-derived products, or any form of alcohol. This is a strict requirement.

    User's Leftover Ingredients: "${ingredients}"

    Your creative mission:
    - Invent a suitable recipe name.
    - The ingredients list in your response should primarily be what the user provided. You may assume common pantry staples like salt, pepper, oil, and water are available, but do not add major new ingredients.
    - Generate all other fields like steps, nutrition, fun facts, etc., to match this new, creative dish.
    - Your response must be a single, valid JSON object according to the schema. Do not include any text or explanations outside the JSON object.
  `;

  try {
    // Step 1: Generate Recipe Text
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
      },
    });

    const text = response.text;
    const recipeData = JSON.parse(text);

    // Step 2: Generate pairings. Image will be generated separately by the client.
    const pairings = await getDrinkPairings(recipeData.recipeName.en, recipeData.description.en);

    // Step 3: Combine and Return
    return {
        ...recipeData,
        id: new Date().toISOString(),
        imageUrl: undefined,
        pairings: pairings || undefined
    };

  } catch (error) {
    console.error("Error remixing leftovers from Gemini:", error);
    throw new Error("errorFailedToGenerate");
  }
};
    
export const generateMenu = async (occasion: string): Promise<Menu> => {
    const prompt = `
        You are a world-class event planner and Michelin-starred chef, "Chef AI".
        Your task is to create a complete, cohesive, and impressive 3-course menu (Appetizer, Main Course, Dessert) for a specific occasion.

        **CRITICAL INSTRUCTION**: Your response MUST be a single, valid JSON object following the provided menu schema. For EVERY text field within each recipe (names, descriptions, steps, etc.), you MUST provide an object with two keys: 'en' for English and 'ar' for Arabic.

        **CRITICAL DIETARY RESTRICTION**: ALL recipes in the menu (Appetizer, Main Course, Dessert) MUST NOT contain any pork, pork-derived products (like gelatin, lard), or any form of alcohol (like wine, beer, liquor) as an ingredient. This is a strict requirement.

        User's Occasion: "${occasion}"

        Please generate the full menu. Ensure the dishes are complementary and fit the theme of the occasion.
        - Create a creative name for the overall occasion/menu.
        - For each of the 3 courses, provide a complete recipe object as defined in the schema.
        - Each recipe must have its own unique name, ingredients, steps, fun facts, etc.
        - Do not include any text, greetings, or explanations outside the JSON object itself.
    `;
    try {
        // Step 1: Generate all text data for the menu in one call
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: menuSchema,
            },
        });
        const text = response.text;
        const menuData = JSON.parse(text);

        // Step 2: Generate images for all three courses and the menu occasion in parallel
        // NOTE: This is an expensive operation and is currently not handled asynchronously by the front-end.
        // It's left as-is to minimize changes to the unused Menu feature.
        const [menuImage, appetizerImage, mainCourseImage, dessertImage] = await Promise.all([
            generateRecipeImage(menuData.occasion.en, "A beautiful, thematic, lightweight, web-optimized food spread representing this dining occasion. Professional photography with a simple, clean background."),
            generateRecipeImage(menuData.appetizer.recipeName.en, menuData.appetizer.description.en),
            generateRecipeImage(menuData.mainCourse.recipeName.en, menuData.mainCourse.description.en),
            generateRecipeImage(menuData.dessert.recipeName.en, menuData.dessert.description.en)
        ]);
        
        // Step 3: Combine text data with generated images and add unique IDs
        return {
            ...menuData,
            imageUrl: menuImage || undefined,
            appetizer: { ...menuData.appetizer, id: new Date().toISOString() + '-app', imageUrl: appetizerImage || undefined },
            mainCourse: { ...menuData.mainCourse, id: new Date().toISOString() + '-main', imageUrl: mainCourseImage || undefined },
            dessert: { ...menuData.dessert, id: new Date().toISOString() + '-des', imageUrl: dessertImage || undefined }
        };

    } catch (error) {
        console.error("Error generating menu from Gemini:", error);
        throw new Error("errorFailedToGenerate"); // Can reuse for menus
    }
};


export const remixRecipe = async (originalRecipe: Recipe, remixPrompt: string): Promise<Recipe> => {
  // We don't want to send the image, ID, or pairings back to the AI
  const { id, imageUrl, pairings, ...recipeToRemix } = originalRecipe;

  const prompt = `
    You are a world-class chef, "Chef AI".
    You have previously created the following recipe JSON object:
    ${JSON.stringify(recipeToRemix)}

    Now, the user has a modification request: "${remixPrompt}"

    **CRITICAL INSTRUCTION**: Your task is to regenerate the ENTIRE recipe JSON object, applying the user's modification.
    - You MUST maintain the exact same JSON schema and bilingual structure ({ "en": "...", "ar": "..." }) for all text fields.
    - Even after the remix, the recipe MUST remain free of any pork, pork-derived products (like gelatin, lard), and any form of alcohol (like wine, beer, liquor) as an ingredient. This is a strict rule that overrides any user prompt that might suggest otherwise.
    - Intelligently update the ingredients, steps, description, name, and even nutrition facts to reflect the user's request.
    - If the user asks for "vegetarian", replace meat. If they ask for "spicier", add chili. Be creative but accurate.
    - The difficulty, category, or prep/cook times might need to be adjusted based on the change.
    - Keep the fun stuff (tips, jokes, history) relevant to the new version of the dish.
    - Do not include any text, greetings, or explanations outside the single, valid JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
      },
    });

    const text = response.text;
    const newRecipeData = JSON.parse(text);

    // Generate new pairings for the remixed recipe. Image is handled by client.
    const newPairings = await getDrinkPairings(newRecipeData.recipeName.en, newRecipeData.description.en);

    // Combine the new text data, keeping the original ID
    return {
        ...newRecipeData,
        id: originalRecipe.id,
        imageUrl: undefined, // New image will be fetched separately
        pairings: newPairings || originalRecipe.pairings, // Fallback to old pairings if new ones fail
    };

  } catch (error) {
    console.error("Error remixing recipe from Gemini:", error);
    throw new Error("errorFailedToGenerate"); // Can reuse the same error message
  }
};

export const identifyIngredientsFromImage = async (base64Image: string): Promise<string> => {
    const prompt = "Analyze this image of food ingredients and list them as a comma-separated string. Identify only the main, usable food items. For example: 'tomatoes, onions, chicken breast, olive oil'.";
    
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const text = response.text;
        return text.trim();

    } catch (error) {
        console.error("Error identifying ingredients from image:", error);
        throw new Error("errorFailedToAnalyzeImage");
    }
};

const substituteSchema = {
    type: Type.OBJECT,
    properties: {
        name: { ...multilingualStringSchema, description: "The name of the substitute ingredient in both English and Arabic." },
        description: { ...multilingualStringSchema, description: "A brief explanation of how to use this substitute (e.g., ratio, preparation) in both languages." }
    },
    required: ["name", "description"]
};

const substitutesResponseSchema = {
    type: Type.ARRAY,
    items: substituteSchema
};

export const getIngredientSubstitutes = async (ingredient: Ingredient, recipe: Recipe): Promise<Substitute[]> => {
    const prompt = `
        You are a world-class chef, "Chef AI".
        A user is cooking the following recipe: "${recipe.recipeName.en}".
        The full recipe context is: ${JSON.stringify({ ingredients: recipe.ingredients.map(i => i.name.en), steps: recipe.steps.map(s => s.en) })}.

        They need a substitute for the ingredient: "${ingredient.name.en} (${ingredient.amount.en})".

        **CRITICAL INSTRUCTION**: Provide a list of 2-3 smart, practical substitutes for this ingredient specifically within the context of this recipe. For each substitute, explain the usage ratio or any necessary adjustments.

        Your response MUST be a valid JSON array following the provided schema. For EVERY text field, provide an object with 'en' for English and 'ar' for Arabic.

        If no good substitutes exist, return an empty array. Do not include any text outside the JSON array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: substitutesResponseSchema,
            },
        });

        const text = response.text;
        return JSON.parse(text);

    } catch (error) {
        console.error("Error finding ingredient substitutes:", error);
        throw new Error("errorFindingSubstitutes");
    }
};

const cookingTipSchema = {
    type: Type.OBJECT,
    properties: {
        tip: { ...multilingualStringSchema, description: "A short, interesting cooking tip or food fact in both English and Arabic." }
    },
    required: ["tip"]
};

export const getCookingTip = async (): Promise<MultilingualString> => {
    const prompt = `
        You are a world-class chef. Provide a single, interesting, and short cooking tip or food fact.
        The tip must be suitable for a loading screen.
        **CRITICAL INSTRUCTION**: Your response must be a single, valid JSON object following the provided schema.
        The tip must be in both English and Arabic.
        Do not include any text, greetings, or explanations outside the JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: cookingTipSchema,
            },
        });
        const text = response.text;
        const data = JSON.parse(text);
        return data.tip;
    } catch (error) {
        console.error("Error generating cooking tip:", error);
        // Fallback to a static tip in case of an error.
        return {
            en: "Reading a recipe fully before you start is the first step to success.",
            ar: "قراءة الوصفة بالكامل قبل البدء هي أول خطوة نحو النجاح."
        };
    }
};

export const generateWeeklyMealPlan = async (userPrompt: string): Promise<MealPlan> => {
    const prompt = `
        You are an expert meal planner and world-class chef, "Chef AI".
        Your task is to create a complete, cohesive weekly meal plan based on the user's request.

        **CRITICAL INSTRUCTION**: Your response MUST be a single, valid JSON object following the provided meal plan schema. For EVERY text field within each recipe (names, descriptions, steps, etc.), you MUST provide an object with two keys: 'en' for English and 'ar' for Arabic.

        **CRITICAL DIETARY RESTRICTION**: ALL recipes in the plan MUST NOT contain any pork, pork-derived products (like gelatin, lard), or any form of alcohol (like wine, beer, liquor) as an ingredient. This is a strict requirement.

        User's Request: "${userPrompt}"

        Your mission:
        - Generate a meal plan that fulfills the user's request (e.g., if they ask for 5 dinners, provide 5 dinner recipes).
        - Create a creative and appealing title for the overall meal plan.
        - For each meal in the plan, provide a day/meal identifier (e.g., "Monday Dinner", "Day 1 Lunch") and a complete recipe object as defined in the schema.
        - Each recipe must be unique and appropriate for the plan. Do not generate images or pairings for these recipes to ensure speed.
        - Do not include any text, greetings, or explanations outside the main JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: mealPlanSchema,
            },
        });

        const text = response.text;
        const mealPlanData: MealPlan = JSON.parse(text);

        // Add unique IDs to each recipe within the plan
        mealPlanData.plan.forEach((meal, index) => {
            meal.recipe.id = new Date().toISOString() + `-plan-${index}`;
        });

        return mealPlanData;

    } catch (error) {
        console.error("Error generating meal plan from Gemini:", error);
        throw new Error("errorFailedToGenerate");
    }
};

export const startCookingChat = (recipe: Recipe, langKey: 'en' | 'ar'): Chat => {
    const systemInstruction = `You are "Chef AI," a helpful and friendly cooking assistant.
Your task is to answer the user's questions about THIS RECIPE ONLY. Keep your answers concise, helpful, and directly related to the cooking process. Politely decline to answer any off-topic questions.
The user's language is ${langKey}. You must respond in that language.`;

    const recipeContext = `
        The user is currently cooking the following recipe: "${recipe.recipeName[langKey]}".
        Here is the full recipe for your context:
        - Description: ${recipe.description[langKey]}
        - Ingredients: ${recipe.ingredients.map(i => `${i.amount[langKey]} ${i.name[langKey]}`).join(', ')}
        - Steps: ${recipe.steps.map((s, i) => `Step ${i + 1}: ${s[langKey]}`).join('\n')}
    `;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
        history: [
            { role: 'user', parts: [{ text: recipeContext }] },
            { role: 'model', parts: [{ text: "I'm ready to help! Ask me anything about this recipe." }] },
        ],
    });

    return chat;
};
