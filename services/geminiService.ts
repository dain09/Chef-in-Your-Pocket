import { GoogleGenAI, Type, Chat } from "@google/genai";
import { apiKeyManager } from "./apiKeyManager";
import type {
  Recipe,
  MultilingualString,
  Menu,
  MealPlan,
  FestivalTheme,
  Ingredient,
  AcademyLesson,
  FlavorProfileData,
} from "../types";


// Initialize the key manager with keys from environment variables.
// It prioritizes the new `API_KEYS` variable but falls back to `API_KEY` for backward compatibility.
// FIX: Correctly type and initialize `apiKeys`. TypeScript infers `process.env.API_KEYS` as a string,
// but Vite injects it as an array. This cast to `any` ensures `apiKeys` is treated as an array,
// resolving errors on lines 19 and 21.
const apiKeys = (process.env.API_KEYS as any) || [];
if (apiKeys.length === 0 && process.env.API_KEY) {
    apiKeys.push(process.env.API_KEY);
}
apiKeyManager.initializeKeys(apiKeys);

// The `ai` instance will now be managed dynamically.
let ai: GoogleGenAI;

/**
 * Gets the current GoogleGenAI client instance.
 * Throws an error if no API key is available.
 */
function getClient(): GoogleGenAI {
    const apiKey = apiKeyManager.getCurrentKey();
    if (!apiKey) {
        // This error will be shown if neither API_KEY nor API_KEYS is set.
        throw new Error("Gemini API key is missing. Please set the API_KEYS environment variable.");
    }
    // Initialize the client if it hasn't been created yet.
    if (!ai) {
         ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}

/**
 * Re-initializes the GoogleGenAI client with the current key from the manager.
 * This is used after a key rotation.
 */
function reinitializeClient(): void {
    const apiKey = apiKeyManager.getCurrentKey();
     if (!apiKey) {
        throw new Error("No valid API key available to reinitialize the client.");
    }
    ai = new GoogleGenAI({ apiKey });
    console.log("Gemini client re-initialized with a new API key.");
}

/**
 * A wrapper function to make Gemini API calls with automatic key rotation on failure.
 * @param apiCall - A function that returns a promise from a Gemini API call.
 * @returns The result of the successful API call.
 * @throws An error if the call fails with all available keys.
 */
async function makeApiCall<T>(apiCall: (client: GoogleGenAI) => Promise<T>): Promise<T> {
    apiKeyManager.resetRotationCount();
    
    while (true) {
        try {
            const client = getClient();
            const result = await apiCall(client);
            return result;
        } catch (error: any) {
            console.warn("Gemini API call failed. Checking for key rotation.", error);
            
            // Only try to rotate if multiple keys are provided.
            if (apiKeyManager.hasMultipleKeys()) {
                const nextKey = apiKeyManager.rotateKey();
                if (nextKey) {
                    console.log("Rotating to the next API key...");
                    reinitializeClient();
                    // The loop will continue and retry the call with the new client instance.
                } else {
                    // All keys have been tried and failed.
                    console.error("All API keys have failed. Aborting operation.");
                    throw new Error("The request could not be completed with any of the provided API keys. Please check your keys and their usage quotas.");
                }
            } else {
                // If there's only one key, there's nothing to rotate to. Re-throw the original error.
                throw error;
            }
        }
    }
}


const flavorProfileSchema = {
    type: Type.OBJECT,
    properties: {
        sweet: { type: Type.INTEGER, description: "Score from 0 to 100" },
        sour: { type: Type.INTEGER, description: "Score from 0 to 100" },
        bitter: { type: Type.INTEGER, description: "Score from 0 to 100" },
        salty: { type: Type.INTEGER, description: "Score from 0 to 100" },
        umami: { type: Type.INTEGER, description: "Score from 0 to 100" },
    },
    required: ['sweet', 'sour', 'bitter', 'salty', 'umami'],
};

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
    flavorProfile: flavorProfileSchema,
  },
  required: ['title', 'description', 'cuisine', 'diet', 'cookTime', 'servings', 'ingredients', 'steps', 'youtubeUrl', 'flavorProfile'],
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
  // NOTE: Image generation has been temporarily disabled.
  // The Imagen API being used requires a billed Google Cloud account, which was causing
  // an API error and preventing recipe generation for users on the free tier.
  // The application will now fall back to a placeholder UI, ensuring core functionality remains intact.
  console.log(`Image generation for "${recipeTitle}" skipped to avoid API errors.`);
  return "IMAGE_GENERATION_FAILED";
};


export const generateRecipe = async (
  ingredients: string,
  cuisine: string,
  diet: string,
  recipeName?: string,
  remixRecipe?: Recipe,
  availableIngredients?: string[]
): Promise<Recipe | null> => {
    let prompt = `You are a world-class chef and food analyst. Create a delicious and easy-to-follow recipe.
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

    prompt += `\nIn addition to the recipe, provide a flavor profile analysis, rating the dish on a scale of 0-100 for sweet, sour, bitter, salty, and umami.
    Your response MUST be in JSON format and adhere to the provided schema. Provide all text in both English ('en') and Arabic ('ar'). Be creative and inspiring with the recipe title and description.`;
  
  try {
    const response = await makeApiCall(client => client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
    }));

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
        const response = await makeApiCall(client => client.models.generateContent({
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
        }));

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
        const response = await makeApiCall(client => client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: festivalSchema,
            },
        }));
        return parseJsonResponse<FestivalTheme>(response.text);
    } catch (error) {
        console.error("Error fetching festival theme:", error);
        // Fallback to a static theme to prevent UI from getting stuck on loader due to rate limits.
        return {
            title: { en: "Global Comfort Classics", ar: "أطباق عالمية مريحة" },
            description: { en: "Rediscover heartwarming dishes from around the world that feel like a hug in a bowl.", ar: "أعد اكتشاف الأطباق الدافئة من جميع أنحاء العالم التي تمنحك شعوراً بالراحة." },
            recipeIdeas: [
                {
                    title: { en: "Creamy Tomato Soup", ar: "شوربة الطماطم الكريمية" },
                    description: { en: "A velvety soup, perfect for a cozy evening.", ar: "شوربة مخملية، مثالية لأمسية دافئة." }
                },
                {
                    title: { en: "Classic Shepherd's Pie", ar: "فطيرة الراعي الكلاسيكية" },
                    description: { en: "Rich, savory, and topped with fluffy mashed potatoes.", ar: "غنية ولذيذة ومغطاة بالبطاطس المهروسة الهشة." }
                },
                {
                    title: { en: "Molten Chocolate Lava Cake", ar: "كيكة الحمم البركانية بالشوكولاتة" },
                    description: { en: "An indulgent dessert with a gooey, melted center.", ar: "حلوى غنية بقلب من الشوكولاتة الذائبة." }
                }
            ]
        };
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
        const response = await makeApiCall(client => client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: menuSchema,
                maxOutputTokens: 8000,
                thinkingConfig: { thinkingBudget: 4000 },
            },
        }));
        
        const menuData = parseJsonResponse<Omit<Menu, 'id'>>(response.text);

        if (menuData) {
            // Images are disabled, so we pass the failure flag directly.
            const img_failed = "IMAGE_GENERATION_FAILED";
            return {
                ...menuData,
                id: new Date().toISOString(),
                appetizer: { ...menuData.appetizer, id: `app-${Date.now()}`, imageUrl: img_failed },
                mainCourse: { ...menuData.mainCourse, id: `main-${Date.now()}`, imageUrl: img_failed },
                dessert: { ...menuData.dessert, id: `des-${Date.now()}`, imageUrl: img_failed },
            };
        }
        return null;
    } catch (error) {
        console.error("Error generating menu:", error);
        return null;
    }
};

export const generateSubstitutions = async (ingredients: Ingredient[]): Promise<MultilingualString | null> => {
    const ingredientList = ingredients.map(i => i.name.en).join(', ');
    const prompt = `For a recipe including these ingredients: ${ingredientList}. Suggest some common, simple substitutions for a few of the key ingredients. Provide the answer as a simple, single paragraph. Provide the response in both English ('en') and Arabic ('ar'). Response must be JSON.`;
    
    try {
        const response = await makeApiCall(client => client.models.generateContent({
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
        }));
        return parseJsonResponse<MultilingualString>(response.text);
    } catch (error) {
        console.error("Error generating substitutions:", error);
        return null;
    }
};

export const getExtraRecipeInfo = async (recipeTitle: string, infoType: 'nutrition' | 'trivia' | 'drinks'): Promise<MultilingualString | null> => {
    let promptAction = '';
    if (infoType === 'nutrition') {
        promptAction = 'provide estimated nutritional information (calories, protein, carbs, fat) per serving. Keep it brief.';
    } else if (infoType === 'trivia') {
        promptAction = 'provide a fun fact or interesting piece of trivia about the dish or its main ingredients.';
    } else if (infoType === 'drinks') {
        promptAction = 'suggest a few complementary beverages (both alcoholic and non-alcoholic) that would pair well with it.';
    }

    const prompt = `For the recipe "${recipeTitle}", ${promptAction} Format the response as a single paragraph. Provide the response in both English ('en') and Arabic ('ar'). Response must be JSON.`;

    try {
        const response = await makeApiCall(client => client.models.generateContent({
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
        }));
        return parseJsonResponse<MultilingualString>(response.text);
    } catch (error) {
        console.error(`Error generating extra info (${infoType}):`, error);
        return null;
    }
};

export const generateAcademyLesson = async (category: string): Promise<AcademyLesson | null> => {
    const prompt = `You are a patient and encouraging cooking instructor. Create a single, simple, beginner-friendly lesson for the topic: "${category}". 
    The lesson must be well-structured with an introduction and distinct steps.
    Each step should have a clear title and a descriptive paragraph.
    The difficulty should be 'Beginner'. The duration should be a simple string like '5-10 minutes'.
    For the Arabic ('ar') text, please use clear, natural, and encouraging language.
    Your response MUST be in JSON format and adhere to the provided schema.`;

    const lessonSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } }, required: ['en', 'ar'] },
            category: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } }, required: ['en', 'ar'] },
            duration: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } }, required: ['en', 'ar'] },
            difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
            content: {
                type: Type.OBJECT,
                properties: {
                    introduction: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } }, required: ['en', 'ar'] },
                    steps: {
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
                required: ['introduction', 'steps'],
            }
        },
        required: ['title', 'category', 'duration', 'difficulty', 'content'],
    };

    try {
        const response = await makeApiCall(client => client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: lessonSchema,
            },
        }));
        const lessonData = parseJsonResponse<Omit<AcademyLesson, 'id'>>(response.text);
        if (lessonData) {
            return {
                ...lessonData,
                id: new Date().toISOString(),
            };
        }
        return null;
    } catch (error) {
        console.error("Error generating academy lesson:", error);
        return null;
    }
};

export const getSupportMessage = async (): Promise<MultilingualString | null> => {
    const prompt = "Generate a short, single-sentence, positive, and supportive message for humanity, suitable for a web app footer. It should be uplifting and universal, avoiding specific events or politics. Provide the response in both English ('en') and Arabic ('ar'). Response must be JSON.";
    
    try {
        const response = await makeApiCall(client => client.models.generateContent({
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
        }));
        return parseJsonResponse<MultilingualString>(response.text);
    } catch (error) {
        console.error("Error generating support message:", error);
        // Fallback message
        return {
            en: "Wishing you peace and delicious meals.",
            ar: "نتمنى لكم السلام والوجبات الشهية."
        };
    }
};

export const createRecipeChat = (): Chat => {
    const ai = getClient();
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a helpful and friendly cooking assistant named 'Chef'. The user is asking questions about a specific recipe.
            Your answers must be concise, helpful, and directly related to the recipe context that will be provided in the user's first message.
            Be friendly and encouraging. Do not answer questions unrelated to cooking or the recipe.`
        }
    });
    return chat;
}
