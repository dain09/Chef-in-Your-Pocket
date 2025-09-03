import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const translationAR = {
  "appName": "شيف في جيبك",
  "tagline": "أخبرنا ما لديك، ودع السحر يبدأ!",
  "findYourRecipe": "ابحث عن وصفتك المثالية",
  "availableIngredients": "ما هي المكونات المتوفرة لديك؟",
  "ingredientsPlaceholder": "مثال: دجاج، أرز، طماطم، بصل...",
  "occasionDescription": "صف مناسبتك",
  "occasionPlaceholder": "مثال: عشاء إيطالي رومانسي، غداء عائلي صحي...",
  "chooseCuisine": "اختر نوع المطبخ",
  "getRecipe": "ابتكر لي وصفة!",
  "getMenu": "خطط لي قائمة!",
  "surpriseMe": "فاجئني!",
  "allergies": "الحساسية",
  "allergiesPlaceholder": "مثال: فول سوداني، جلوتين، ألبان...",
  "diet": "النظام الغذائي",
  "optional": "اختياري",
  "generating": "جاري التحضير...",
  "chefIsCooking": "يقوم الشيف بإعداد وصفتك...",
  "generatingRecipe": "نبتكر لك وصفة فريدة...",
  "generatingImage": "نلتقط صورة شهية للطبق...",
  "remixingRecipe": "الشيف يضيف لمستك الخاصة...",
  "analyzingImage": "جاري تحليل مكوناتك...",
  "planningMenu": "نخطط لقائمتك...",
  "preparingAppetizer": "نحضر المقبلات...",
  "craftingMainCourse": "نجهز الطبق الرئيسي...",
  "perfectingDessert": "نضع اللمسات الأخيرة على الحلوى...",
  "scanIngredients": "مسح المكونات",
  "scanModalTitle": "امسح ثلاجتك",
  "scanInstruction": "وجّه الكاميرا نحو مكوناتك والتقط صورة.",
  "capture": "التقاط",
  "retake": "إعادة الالتقاط",
  "usePhoto": "استخدام الصورة",
  "prepTime": "وقت التحضير",
  "cookTime": "وقت الطهي",
  "servings": "تكفي لـ",
  "difficulty": "الصعوبة",
  "easy": "سهل",
  "medium": "متوسط",
  "hard": "صعب",
  "people": "أشخاص",
  "addToFavorites": "أضف للمفضلة",
  "inFavorites": "في المفضلة",
  "addToShoppingList": "إضافة لقائمة التسوق",
  "addAllToShoppingList": "إضافة كل المكونات للقائمة",
  "ingredients": "المكونات",
  "nutritionFacts": "القيمة الغذائية",
  "calories": "السعرات",
  "protein": "البروتين",
  "carbs": "الكربوهيدرات",
  "fat": "الدهون",
  "preparationMethod": "طريقة التحضير",
  "funSection": "قسم المرح والمعرفة",
  "pairings": "المشروبات المقترحة",
  "proTips": "نصائح احترافية",
  "foodJokes": "نكت طعام",
  "historyCorner": "لمحة تاريخية",
  "searchAnotherRecipe": "بحث جديد",
  "tryAgain": "حاول مرة أخرى",
  "myFavoriteRecipes": "وصفاتي المفضلة",
  "shoppingList": "قائمة التسوق",
  "clearAll": "مسح الكل",
  "clearChecked": "مسح المحدد",
  "startCooking": "ابدأ الطهي",
  "exit": "خروج",
  "nextStep": "التالي",
  "prevStep": "السابق",
  "stepOf": "خطوة {{current}} من {{total}}",
  "listening": "أستمع الآن... قل 'التالي'، 'السابق'، أو اسأل سؤالاً",
  "micPermissionDenied": "تم رفض الوصول إلى الميكروفون. يرجى تمكينه في إعدادات المتصفح لاستخدام التحكم الصوتي.",
  "micNotSupported": "متصفحك لا يدعم التعرف على الصوت.",
  "newRecipe": "وصفة جديدة",
  "myFavorites": "مفضلتي",
  "noFavorites": "لم تقم بإضافة أي وصفات إلى مفضلتك بعد.",
  "viewRecipe": "عرض الوصفة",
  "watchTutorial": "شاهد الشرح",
  "addYourTouch": "أضف لمستك",
  "remixInstruction": "اكتب التعديل الذي تريده على الوصفة الحالية.",
  "remixPlaceholder": "مثال: اجعلها نباتية، بدون جلوتين، أسرع...",
  "remixRecipe": "عدّل الوصفة",
  "cancel": "إلغاء",
  "ingredientSubstitutesTitle": "بدائل لـِ {{ingredientName}}",
  "findingSubstitutes": "نبحث عن بدائل ذكية...",
  "noSubstitutesFound": "لم نجد بدائل جيدة. قد يكون من الأفضل الالتزام بالمكون الأصلي.",
  "errorFindingSubstitutes": "عذرًا، حدث خطأ أثناء البحث عن بدائل.",
  "singleRecipe": "وصفة فردية",
  "menuPlanner": "قائمة طعام",
  "appetizer": "المقبلات",
  "mainCourse": "الطبق الرئيسي",
  "dessert": "الحلوى",
  "chatWelcomeMessage": "أنا جاهز للمساعدة! اسألني أي شيء عن هذه الوصفة.",
  "chefIsTyping": "الشيف يكتب...",
  "askQuestion": "اسأل سؤالاً...",
  "chatError": "عذرًا، حدث خطأ في المحادثة. حاول مرة أخرى.",
  "toastAddedToFavorites": "تمت إضافة الوصفة إلى المفضلة!",
  "toastRemovedFromFavorites": "تمت إزالة الوصفة من المفضلة.",
  "toastAddedToShoppingList": "تمت إضافة المكونات إلى قائمة التسوق.",
  "toastShoppingListCleared": "تم مسح قائمة التسوق.",
  "shareRecipe": "مشاركة الوصفة",
  "toastRecipeShared": "تمت مشاركة الوصفة بنجاح!",
  "toastRecipeCopied": "تم نسخ الوصفة إلى الحافظة.",
  "loadingTips": [
    "هل تعلم؟ إضافة قليل من السكر للطماطم يبرز حلاوتها الطبيعية.",
    "للحصول على بيض مسلوق سهل التقشير، أضف ملعقة صغيرة من صودا الخبز إلى الماء.",
    "تجميد الزنجبيل يجعله أسهل في البشر والتقشير.",
    "استخدم ملعقة لكشط قشر الزنجبيل بسهولة.",
    "للحفاظ على الأعشاب طازجة، لفها في منشفة ورقية رطبة وضعها في كيس بلاستيكي.",
    "شحذ سكاكينك بانتظام يجعل الطهي أسرع وأكثر أمانًا.",
    "دع اللحم يرتاح بعد الطهي للحفاظ على عصائره.",
    "قراءة الوصفة بالكامل قبل البدء تمنع المفاجآت غير السارة."
  ],
  "errorFailedToGenerate": "فشل في إنشاء الطلب. قد تكون المدخلات غير متوافقة. حاول مرة أخرى!",
  "errorFailedToAnalyzeImage": "تعذر تحليل الصورة. يرجى المحاولة مرة أخرى بصورة أوضح.",
  "errorCamera": "تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.",
  "onboarding": {
    "prev": "السابق",
    "next": "التالي",
    "finish": "لنبدأ الطهي!",
    "steps": [
        {
            "title": "أهلاً بك في شيف في جيبك!",
            "description": "شيف الذكاء الاصطناعي الشخصي. دعنا نأخذك في جولة سريعة."
        },
        {
            "title": "ابتكر طبقك",
            "description": "ابدأ بإدخال المكونات المتوفرة لديك، اختر نوع المطبخ، وحدد أي حساسية. سيقوم الذكاء الاصطناعي بإنشاء وصفة فريدة لك."
        },
        {
            "title": "خطط لقائمة طعام كاملة",
            "description": "لديك مناسبة خاصة؟ انتقل إلى وضع 'قائمة طعام'، صف المناسبة، واحصل على قائمة من 3 أطباق متكاملة بالوصفات والصور!"
        },
        {
            "title": "امسح ثلاجتك",
            "description": "لا تريد الكتابة؟ استخدم أيقونة الكاميرا لمسح مكوناتك، وسنتعرف عليها فورًا."
        },
        {
            "title": "تفاعل وخصص",
            "description": "استخدم 'لمسة الشيف' لتعديل الوصفات، اعثر على بدائل للمكونات بالعصا السحرية، وادخل وضع 'اطبخ معي' لإرشاد تفاعلي خطوة بخطوة."
        },
        {
            "title": "أنت جاهز الآن!",
            "description": "احفظ إبداعاتك المفضلة وأدر قائمة التسوق الخاصة بك. استمتع بمغامرتك في الطهي!"
        }
    ]
  },
  "footer": {
      "copyright": "© {{year}} {{name}}. كل الحقوق محفوظة."
  },
  "whatsNew": {
    "continue": "متابعة"
  }
};

const translationEN = {
  "appName": "Chef in Your Pocket",
  "tagline": "Tell us what you have, and let the magic begin!",
  "findYourRecipe": "Find Your Perfect Creation",
  "availableIngredients": "What ingredients do you have?",
  "ingredientsPlaceholder": "e.g., chicken, rice, tomatoes, onion...",
  "occasionDescription": "Describe your occasion",
  "occasionPlaceholder": "e.g., romantic Italian dinner, healthy family lunch...",
  "chooseCuisine": "Choose a cuisine",
  "getRecipe": "Create a Recipe!",
  "getMenu": "Plan My Menu!",
  "surpriseMe": "Surprise Me!",
  "allergies": "Allergies",
  "allergiesPlaceholder": "e.g., peanuts, gluten, dairy...",
  "diet": "Diet",
  "optional": "optional",
  "generating": "Generating...",
  "chefIsCooking": "The chef is preparing your recipe...",
  "generatingRecipe": "Crafting a unique recipe for you...",
  "generatingImage": "Snapping a delicious photo of the dish...",
  "remixingRecipe": "The Chef is adding your special touch...",
  "analyzingImage": "Analyzing your ingredients...",
  "planningMenu": "Planning your menu...",
  "preparingAppetizer": "Preparing the appetizer...",
  "craftingMainCourse": "Crafting the main course...",
  "perfectingDessert": "Perfecting the dessert...",
  "scanIngredients": "Scan Ingredients",
  "scanModalTitle": "Scan Your Fridge",
  "scanInstruction": "Point your camera at your ingredients and take a picture.",
  "capture": "Capture",
  "retake": "Retake",
  "usePhoto": "Use Photo",
  "prepTime": "Prep time",
  "cookTime": "Cook time",
  "servings": "Servings",
  "difficulty": "Difficulty",
  "easy": "Easy",
  "medium": "Medium",
  "hard": "Hard",
  "people": "people",
  "addToFavorites": "Add to Favorites",
  "inFavorites": "In Favorites",
  "addToShoppingList": "Add to Shopping List",
  "addAllToShoppingList": "Add All to Shopping List",
  "ingredients": "Ingredients",
  "nutritionFacts": "Nutrition Facts",
  "preparationMethod": "Preparation Method",
  "funSection": "Fun & Knowledge",
  "pairings": "Drink Pairings",
  "proTips": "Pro Tips",
  "foodJokes": "Food Jokes",
  "historyCorner": "History Corner",
  "calories": "Calories",
  "protein": "Protein",
  "carbs": "Carbs",
  "fat": "Fat",
  "searchAnotherRecipe": "New Search",
  "tryAgain": "Try Again",
  "myFavoriteRecipes": "My Favorite Recipes",
  "shoppingList": "Shopping List",
  "clearAll": "Clear All",
  "clearChecked": "Clear Checked",
  "startCooking": "Start Cooking",
  "exit": "Exit",
  "nextStep": "Next",
  "prevStep": "Previous",
  "stepOf": "Step {{current}} of {{total}}",
  "listening": "Listening... Say 'Next', 'Previous', or ask a question",
  "micPermissionDenied": "Microphone access denied. Please enable it in your browser settings to use voice control.",
  "micNotSupported": "Your browser does not support speech recognition.",
  "newRecipe": "New Creation",
  "myFavorites": "My Favorites",
  "noFavorites": "You haven't added any recipes to your favorites yet.",
  "viewRecipe": "View Recipe",
  "watchTutorial": "Watch Tutorial",
  "addYourTouch": "Chef's Touch",
  "remixInstruction": "Describe the change you'd like to make to the current recipe.",
  "remixPlaceholder": "e.g., make it vegetarian, gluten-free, quicker...",
  "remixRecipe": "Remix Recipe",
  "cancel": "Cancel",
  "ingredientSubstitutesTitle": "Substitutes for {{ingredientName}}",
  "findingSubstitutes": "Finding smart substitutes...",
  "noSubstitutesFound": "No suitable substitutes found. It might be best to stick with the original ingredient.",
  "errorFindingSubstitutes": "Sorry, an error occurred while finding substitutes.",
  "singleRecipe": "Single Recipe",
  "menuPlanner": "Menu Planner",
  "appetizer": "Appetizer",
  "mainCourse": "Main Course",
  "dessert": "Dessert",
  "chatWelcomeMessage": "I'm ready to help! Ask me anything about this recipe.",
  "chefIsTyping": "Chef is typing...",
  "askQuestion": "Ask a question...",
  "chatError": "Sorry, a chat error occurred. Please try again.",
  "toastAddedToFavorites": "Recipe added to favorites!",
  "toastRemovedFromFavorites": "Recipe removed from favorites.",
  "toastAddedToShoppingList": "Ingredients added to shopping list.",
  "toastShoppingListCleared": "Shopping list cleared.",
  "shareRecipe": "Share Recipe",
  "toastRecipeShared": "Recipe shared successfully!",
  "toastRecipeCopied": "Recipe copied to clipboard.",
  "loadingTips": [
    "Did you know? A pinch of sugar brings out the natural sweetness in tomatoes.",
    "For easy-to-peel boiled eggs, add a teaspoon of baking soda to the water.",
    "Freezing ginger makes it much easier to grate and peel.",
    "Use a spoon to easily scrape the skin off ginger.",
    "To keep herbs fresh, wrap them in a damp paper towel and place them in a plastic bag.",
    "Sharpening your knives regularly makes cooking faster and safer.",
    "Let meat rest after cooking to keep its juices locked in.",
    "Reading the entire recipe before starting prevents unpleasant surprises."
  ],
  "errorFailedToGenerate": "Failed to generate your request. The input might be incompatible. Please try again!",
  "errorFailedToAnalyzeImage": "Could not analyze the image. Please try again with a clearer picture.",
  "errorCamera": "Could not access the camera. Please check permissions.",
  "onboarding": {
    "prev": "Previous",
    "next": "Next",
    "finish": "Let's Cook!",
    "steps": [
        {
            "title": "Welcome to Chef in Your Pocket!",
            "description": "Your personal AI chef. Let's quickly show you around."
        },
        {
            "title": "Craft Your Dish",
            "description": "Start by entering ingredients you have, choose a cuisine, and even specify allergies. Our AI will create a unique recipe just for you."
        },
        {
            "title": "Plan a Full Menu",
            "description": "Have a special occasion? Switch to 'Menu Planner' mode, describe the event, and get a complete 3-course menu with recipes and photos!"
        },
        {
            "title": "Scan Your Fridge",
            "description": "Don't want to type? Use the camera icon to scan your ingredients, and we'll identify them for you instantly."
        },
        {
            "title": "Interact & Customize",
            "description": "Use the 'Chef's Touch' to modify recipes, find ingredient substitutes with the magic wand, and enter the 'Cook with Me' mode for a step-by-step interactive guide."
        },
        {
            "title": "You're All Set!",
            "description": "Save your favorite creations and manage your shopping list. Enjoy your culinary adventure!"
        }
    ]
  },
  "footer": {
      "copyright": "© {{year}} {{name}}. All rights reserved."
  },
  "whatsNew": {
    "continue": "Continue"
  }
};

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
