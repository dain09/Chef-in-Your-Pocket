import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { v4 as uuidv4 } from 'uuid';

const resources = {
  en: {
    translation: {
      // General
      appName: 'Chef in Your Pocket',
      generating: 'Generating...',
      Close: 'Close',
      'Back to search': 'Back to search',
      'Cook Time': 'Cook Time',
      'Servings': 'Servings',
      'Ingredients': 'Ingredients',
      'Instructions': 'Instructions',
      'Add all to Shopping List': 'Add all to Shopping List',

      // Form
      'form.placeholderIngredients': 'e.g., chicken, tomatoes, rice',
      'form.placeholderName': 'e.g., Spaghetti Carbonara',
      'form.placeholderLeftovers': 'e.g., cooked rice, roasted vegetables',
      'form.placeholderOccasion': 'e.g., Romantic dinner for two',
      'form.placeholderWeekly': 'e.g., Healthy, quick meals for a busy week',
      'form.generateButton': 'Create Recipe',
      'form.findButton': 'Find Recipe',
      'form.remixButton': 'Remix Leftovers',
      'form.planMenuButton': 'Plan a Menu',
      'form.planWeekButton': 'Plan My Week',
      'form.generating': 'Creating Magic...',
      'form.cuisineLabel': 'Cuisine Type',
      'form.dietLabel': 'Dietary Preference',
      'form.analyzeImage': 'Analyze with Camera',
      'form.analyzeImageShort': 'Camera',
      'form.randomButton': 'Random',
      'form.randomButtonTooltip': "I'm feeling lucky!",
      'form.randomPrompt': 'a popular and delicious dinner recipe',
      'form.modeIngredients': 'Ingredients',
      'form.modeName': 'Recipe Name',
      'form.modeLeftovers': 'Leftovers',
      'form.modeOccasion': 'Occasion',
      'form.modeWeekly': 'Weekly Plan',

      // Loading Overlay
      generatingRecipe: 'Warming up the oven...',
      remixingRecipe: 'Adding a new twist...',
      remixingLeftovers: 'Saving the day with leftovers!',
      analyzingImage: 'Scanning your ingredients...',
      planningMenu: 'Setting the table...',
      preparingAppetizer: 'Preparing the appetizer...',
      craftingMainCourse: 'Crafting the main course...',
      perfectingDessert: 'Perfecting the dessert...',
      planningWeek: 'Planning your delicious week...',
      
      // Favorites
      myFavorites: 'My Favorites',
      favoritesEmpty: 'Your cookbook is empty!',
      favoritesEmptyHint: 'Save recipes you love to see them here.',

      // Shopping List
      shoppingList: 'Shopping List',
      clearAll: 'Clear all items',
      clearChecked: 'Clear Checked',
      
      // Toasts
      'toastShoppingListCleared': 'Shopping list cleared!',
      'toast.recipeAddedToFavorites': 'Recipe added to favorites!',
      'toast.recipeRemovedFromFavorites': 'Recipe removed from favorites.',
      'toast.addedToShoppingList': 'Added {{count}} items to shopping list.',
      'Recipe saved to cookbooks!': 'Recipe saved to cookbooks!',
      
      // Menu Card
      'Menu for': 'Menu for',
      'Appetizer': 'Appetizer',
      'Main Course': 'Main Course',
      'Dessert': 'Dessert',

      // Recipe of the Day
      'Recipe of the Day': 'Recipe of the Day',
      viewRecipe: 'View Recipe',
      
      // Chef's Tips
      chefsTips: "Chef's Tips",
      Substitutions: 'Substitutions',
      'Nutritional Info': 'Nutritional Info',
      'Fun Facts': 'Fun Facts',
      'Drink Pairings': 'Drink Pairings',
      'Flavor Profile': 'Flavor Profile',
      loadingTipContent: 'Getting tips from the chef...',
      selectTip: 'Select a category to get a helpful tip from our chef!',

      // Onboarding
      'onboarding.prev': 'Previous',
      'onboarding.next': 'Next',
      'onboarding.finish': "Let's Get Cooking!",
      'onboarding.steps': [
          { "title": "Welcome!", "description": "Let's quickly show you around your new kitchen assistant." },
          { "title": "List Ingredients", "description": "Tell me what you have, and I'll create a unique recipe for you." },
          { "title": "Plan for Occasions", "description": "Need a menu for a special event? Just describe the occasion!" },
          { "title": "Use Your Camera", "description": "Snap a photo of your ingredients, and I'll identify them for you." },
          { "title": "Remix Leftovers", "description": "Don't waste food! I can turn your leftovers into a new, exciting dish." },
          { "title": "Start Cooking!", "description": "You're all set. Let's create something delicious together!" }
      ],

      // What's New Modal
      'whatsNew.continue': 'Awesome!',
      
      // Footer
      'footer.copyright': '© {{year}} Made with ❤️ by {{name}}',

      // Pantry
      myPantry: 'My Pantry',
      pantryDescription: 'Manage your staple ingredients here.',
      pantryPlaceholder: 'Add new item...',
      pantryEmpty: 'Your pantry is empty. Add some items!',
      pantryChallenge: "Use My Ingredients",
      'Check Your Pantry': 'Check Your Pantry',
      "Uncheck any ingredients you don't have.": "Uncheck any ingredients you don't have.",
      'Confirm Ingredients': 'Confirm Ingredients',
      expiresSoon: 'Expires soon',
      expired: 'Expired',
      'pantrySpotlight.title': "Pantry Spotlight",
      'pantrySpotlight.description': "These items are expiring soon! Let's cook something with them.",
      'pantrySpotlight.button': "Create a Recipe",
      
      // Image Capture
      'Capture Ingredients': 'Capture Ingredients',
      'Retake': 'Retake',
      'Confirm': 'Confirm',

      // Hands-Free Mode
      handsFreeTitle: 'Hands-Free Cooking',
      handsFreeDescription: 'Use voice commands to navigate the recipe.',
      step: 'Step',
      listening: 'Listening...',
      commandNext: 'next',
      commandPrevious: 'previous',
      commandIngredients: 'ingredients',
      commandExit: 'exit',
      
      // Chef Chat
      "Ask the Chef": "Ask the Chef",
      "Chat with the Chef": "Chat with the Chef",
      "Type your question...": "Type your question...",
      "chefIsTyping": "Chef is typing...",
      "chat.welcomeMessage": "Hello! I'm here to help. What would you like to know about this recipe?",

      // Chefs Academy
      chefsAcademy: "Chef's Academy",
      'academy.description': 'Learn cooking basics and master new techniques.',
      'academy.lessonsTitle': 'Available Lessons',
      'academy.selectPrompt': 'Select a lesson from the left to begin.',
      'academy.difficultyLabel': 'Difficulty',
      'academy.durationLabel': 'Est. Time',
      'Back to Main App': 'Back to Main App',
      'difficulty.Beginner': 'Beginner',
      'difficulty.Intermediate': 'Intermediate',
      'difficulty.Advanced': 'Advanced',

      // Flavors
      'flavors.sweet': 'Sweet',
      'flavors.salty': 'Salty',
      'flavors.sour': 'Sour',
      'flavors.bitter': 'Bitter',
      'flavors.umami': 'Umami',

      // Cookbooks
      'My Cookbooks': 'My Cookbooks',
      'Add to Cookbook': 'Add to Cookbook',
      "You don't have any cookbooks yet.": "You don't have any cookbooks yet.",
      'Create New Cookbook': 'Create New Cookbook',
      'New cookbook name...': 'New cookbook name...',
      'Save Changes': 'Save Changes',
      '{{count}} recipes': '{{count}} recipes',
      'This cookbook is empty.': 'This cookbook is empty.',
      'Select a cookbook to view its recipes.': 'Select a cookbook to view its recipes.',
      "actions": {
        "favorite": "Favorite",
        "unfavorite": "Favorited",
        "save": "Save",
        "cookMode": "Cook Mode",
        "askChef": "Ask Chef",
        "remix": "Remix"
      },
      "header": {
        "pantry": "Pantry",
        "cookbooks": "Cookbooks",
        "favorites": "Favorites",
        "academy": "Academy"
      }
    },
  },
  ar: {
    translation: {
      // General
      appName: 'شيف في جيبك',
      generating: 'جاري التحضير...',
      Close: 'إغلاق',
      'Back to search': 'العودة للبحث',
      'Cook Time': 'وقت الطهي',
      'Servings': 'حصص',
      'Ingredients': 'المكونات',
      'Instructions': 'الخطوات',
      'Add all to Shopping List': 'أضف الكل لقائمة التسوق',

      // Form
      'form.placeholderIngredients': 'مثال: دجاج، طماطم، أرز',
      'form.placeholderName': 'مثال: سباغيتي كاربونارا',
      'form.placeholderLeftovers': 'مثال: أرز مطبوخ، خضروات مشوية',
      'form.placeholderOccasion': 'مثال: عشاء رومانسي لشخصين',
      'form.placeholderWeekly': 'مثال: وجبات صحية وسريعة لأسبوع حافل',
      'form.generateButton': 'ابتكر وصفة',
      'form.findButton': 'ابحث عن وصفة',
      'form.remixButton': 'جدد البواقي',
      'form.planMenuButton': 'خطط قائمة طعام',
      'form.planWeekButton': 'خطط أسبوعي',
      'form.generating': 'لحظات من الإبداع...',
      'form.cuisineLabel': 'نوع المطبخ',
      'form.dietLabel': 'التفضيلات الغذائية',
      'form.analyzeImage': 'تحليل بالكاميرا',
      'form.analyzeImageShort': 'كاميرا',
      'form.randomButton': 'عشوائي',
      'form.randomButtonTooltip': 'أنا محظوظ!',
      'form.randomPrompt': 'وصفة عشاء مشهورة ولذيذة',
      'form.modeIngredients': 'المكونات',
      'form.modeName': 'اسم الوصفة',
      'form.modeLeftovers': 'بواقي الطعام',
      'form.modeOccasion': 'المناسبة',
      'form.modeWeekly': 'خطة أسبوعية',

      // Loading Overlay
      generatingRecipe: 'تسخين الفرن...',
      remixingRecipe: 'إضافة لمسة جديدة...',
      remixingLeftovers: 'إنقاذ الموقف ببواقي الطعام!',
      analyzingImage: 'فحص مكوناتك...',
      planningMenu: 'تجهيز المائدة...',
      preparingAppetizer: 'تحضير المقبلات...',
      craftingMainCourse: 'إعداد الطبق الرئيسي...',
      perfectingDessert: 'وضع اللمسات الأخيرة على الحلوى...',
      planningWeek: 'تخطيط أسبوعك الشهي...',

      // Favorites
      myFavorites: 'وصفاتي المفضلة',
      favoritesEmpty: 'كتاب طبخك فارغ!',
      favoritesEmptyHint: 'احفظ وصفاتك التي تحبها لترها هنا.',

      // Shopping List
      shoppingList: 'قائمة التسوق',
      clearAll: 'مسح كل العناصر',
      clearChecked: 'مسح المحدد',

      // Toasts
      'toastShoppingListCleared': 'تم مسح قائمة التسوق!',
      'toast.recipeAddedToFavorites': 'تمت إضافة الوصفة للمفضلة!',
      'toast.recipeRemovedFromFavorites': 'تمت إزالة الوصفة من المفضلة.',
      'toast.addedToShoppingList': 'تمت إضافة {{count}} عناصر لقائمة التسوق.',
      'Recipe saved to cookbooks!': 'تم حفظ الوصفة في كتب الطبخ!',
      
      // Menu Card
      'Menu for': 'قائمة طعام لـ',
      'Appetizer': 'المقبلات',
      'Main Course': 'الطبق الرئيسي',
      'Dessert': 'الحلويات',

      // Recipe of the Day
      'Recipe of the Day': 'وصفة اليوم',
      viewRecipe: 'عرض الوصفة',

      // Chef's Tips
      chefsTips: "نصائح الشيف",
      Substitutions: 'البدائل',
      'Nutritional Info': 'معلومات غذائية',
      'Fun Facts': 'طرائف ومعلومات',
      'Drink Pairings': 'مشروبات مقترحة',
      'Flavor Profile': 'تحليل النكهة',
      loadingTipContent: 'جاري جلب النصائح من الشيف...',
      selectTip: 'اختر فئة للحصول على نصيحة مفيدة من الشيف!',

      // Onboarding
      'onboarding.prev': 'السابق',
      'onboarding.next': 'التالي',
      'onboarding.finish': 'لنبدأ الطهي!',
      'onboarding.steps': [
          { "title": "أهلاً بك!", "description": "دعنا نريك سريعاً مميزات مساعد مطبخك الجديد." },
          { "title": "اذكر المكونات", "description": "أخبرني بما لديك، وسأبتكر لك وصفة فريدة." },
          { "title": "خطط للمناسبات", "description": "هل تحتاج قائمة لمناسبة خاصة؟ فقط صف المناسبة!" },
          { "title": "استخدم كاميرتك", "description": "التقط صورة لمكوناتك، وسأتعرف عليها من أجلك." },
          { "title": "جدد بواقي الطعام", "description": "لا تهدر الطعام! يمكنني تحويل بقايا طعامك إلى طبق جديد ومثير." },
          { "title": "ابدأ الطهي!", "description": "أنت جاهز تمامًا. لنصنع شيئًا لذيذًا معًا!" }
      ],

      // What's New Modal
      'whatsNew.continue': 'رائع!',
      
      // Footer
      'footer.copyright': '© {{year}} صنع بـ ❤️ بواسطة {{name}}',

      // Pantry
      myPantry: 'خزانتي',
      pantryDescription: 'أدر مكوناتك الأساسية هنا.',
      pantryPlaceholder: 'أضف عنصراً جديداً...',
      pantryEmpty: 'خزانتك فارغة. أضف بعض المكونات!',
      pantryChallenge: "استخدم مكوناتي",
      'Check Your Pantry': 'تفقد خزانتك',
      "Uncheck any ingredients you don't have.": "ألغِ تحديد أي مكونات غير متوفرة لديك.",
      'Confirm Ingredients': 'تأكيد المكونات',
      expiresSoon: 'ينتهي قريباً',
      expired: 'منتهي الصلاحية',
      'pantrySpotlight.title': "أضواء على الخزانة",
      'pantrySpotlight.description': "هذه المكونات ستنتهي صلاحيتها قريباً! لنطبخ شيئاً بها.",
      'pantrySpotlight.button': "ابتكر وصفة",
      
      // Image Capture
      'Capture Ingredients': 'تصوير المكونات',
      'Retake': 'إعادة الالتقاط',
      'Confirm': 'تأكيد',
      
      // Hands-Free Mode
      handsFreeTitle: 'الطبخ بدون لمس',
      handsFreeDescription: 'استخدم الأوامر الصوتية للتنقل في الوصفة.',
      step: 'خطوة',
      listening: 'أستمع الآن...',
      commandNext: 'التالي',
      commandPrevious: 'السابق',
      commandIngredients: 'المكونات',
      commandExit: 'خروج',
      
      // Chef Chat
      "Ask the Chef": "اسأل الشيف",
      "Chat with the Chef": "دردش مع الشيف",
      "Type your question...": "اكتب سؤالك...",
      "chefIsTyping": "الشيف يكتب...",
      "chat.welcomeMessage": "مرحباً! أنا هنا للمساعدة. ماذا تود أن تعرف عن هذه الوصفة؟",

      // Chefs Academy
      chefsAcademy: "أكاديمية الشيف",
      'academy.description': 'تعلم أساسيات الطهي واتقن تقنيات جديدة.',
      'academy.lessonsTitle': 'الدروس المتاحة',
      'academy.selectPrompt': 'اختر درسًا من القائمة للبدء.',
      'academy.difficultyLabel': 'الصعوبة',
      'academy.durationLabel': 'الوقت التقديري',
      'Back to Main App': 'العودة للتطبيق الرئيسي',
      'difficulty.Beginner': 'مبتدئ',
      'difficulty.Intermediate': 'متوسط',
      'difficulty.Advanced': 'متقدم',
      
      // Flavors
      'flavors.sweet': 'حلو',
      'flavors.salty': 'مالح',
      'flavors.sour': 'حامض',
      'flavors.bitter': 'مر',
      'flavors.umami': 'أومامي',

      // Cookbooks
      'My Cookbooks': 'كتبي الطبخ',
      'Add to Cookbook': 'أضف إلى كتاب الطبخ',
      "You don't have any cookbooks yet.": 'ليس لديك أي كتب طبخ بعد.',
      'Create New Cookbook': 'إنشاء كتاب طبخ جديد',
      'New cookbook name...': 'اسم كتاب الطبخ الجديد...',
      'Save Changes': 'حفظ التغييرات',
      '{{count}} recipes': '{{count}} وصفات',
      'This cookbook is empty.': 'كتاب الطبخ هذا فارغ.',
      'Select a cookbook to view its recipes.': 'اختر كتاب طبخ لعرض وصفاته.',
      "actions": {
        "favorite": "تفضيل",
        "unfavorite": "مُفضّلة",
        "save": "حفظ",
        "cookMode": "وضع الطبخ",
        "askChef": "اسأل الشيف",
        "remix": "تعديل"
      },
      "header": {
        "pantry": "خزانتي",
        "cookbooks": "كتبي",
        "favorites": "المفضلة",
        "academy": "الأكاديمية"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
  });

export default i18n;