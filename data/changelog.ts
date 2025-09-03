import { Archive, CalendarDays, Recycle, Search, ChefHat, Palette, Compass, GlassWater, Scaling, BookOpen, Wand2, Dices, Sparkles, BarChart2, AlertTriangle, ListChecks, LayoutPanelLeft } from 'lucide-react';
import type { ElementType } from 'react';

interface ChangelogFeature {
  icon: ElementType;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
}

interface ChangelogEntry {
  version: string;
  title: { en: string; ar: string };
  features: ChangelogFeature[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: '5.0.0',
    title: {
        en: "The Smart Chef Update",
        ar: "تحديث الشيف الذكي"
    },
    features: [
      {
        icon: BarChart2,
        title: { en: "Flavor Profile Analysis", ar: "تحليل النكهات" },
        description: { en: "Understand your food better! Every recipe now comes with a visual radar chart analyzing its sweet, salty, sour, bitter, and umami flavors.", ar: "افهم طعامك بشكل أفضل! كل وصفة تأتي الآن مع مخطط راداري بصري يحلل نكهاتها الخمس: الحلو، المالح، الحامض، المر، والأومامي." }
      },
      {
        icon: AlertTriangle,
        title: { en: "Smart Pantry Spotlight", ar: "أضواء على خزانتك الذكية" },
        description: { en: "Reduce food waste! The app now highlights ingredients nearing their expiry date and suggests creating a recipe with them.", ar: "قلل من هدر الطعام! التطبيق يسلط الضوء الآن على المكونات التي تقترب من تاريخ انتهاء صلاحيتها ويقترح عليك إنشاء وصفة بها." }
      },
      {
        icon: ListChecks,
        title: { en: "Upgraded Academy Lessons", ar: "دروس أكاديمية مطورة" },
        description: { en: "Learning is now easier and more organized. Academy lessons are presented in clear, step-by-step formats with introductions.", ar: "أصبح التعلم الآن أسهل وأكثر تنظيمًا. تُعرض دروس الأكاديمية الآن بتنسيق خطوات واضحة ومنظمة مع مقدمات." }
      },
      {
        icon: LayoutPanelLeft,
        title: { en: "Streamlined Recipe View", ar: "واجهة وصفة محسّنة" },
        description: { en: "Enjoy a cleaner, tabbed interface for ingredients and instructions, plus a new 'Chef's Tips' section for all extra info.", ar: "استمتع بواجهة مبوبة أكثر أناقة للمكونات والتعليمات، بالإضافة إلى قسم 'نصائح الشيف' الجديد لجميع المعلومات الإضافية." }
      },
    ]
  },
  {
    version: '4.0.0',
    title: {
        en: "The Quality of Life Update!",
        ar: "تحديث جودة الحياة!"
    },
    features: [
      {
        icon: BookOpen,
        title: { en: "Chef's Academy 2.0", ar: "أكاديمية الشيف 2.0" },
        description: { en: 'The academy now opens in a dedicated tab for a more focused and immersive learning experience.', ar: 'تفتح الأكاديمية الآن في تبويب مخصص لتجربة تعليمية أكثر تركيزًا وغنى.' }
      },
      {
        icon: Wand2,
        title: { en: 'Interactive UI Feedback', ar: 'تحسينات بصرية تفاعلية' },
        description: { en: 'Buttons now have a glowing pulse animation while loading to provide clearer feedback.', ar: 'أصبحت الأزرار الآن تتميز بتأثير توهج نابض أثناء التحميل لتقديم ردود فعل مرئية أوضح.' }
      },
      {
        icon: Dices,
        title: { en: 'Random Recipe Dice', ar: 'زر الوصفة العشوائية' },
        description: { en: 'Feeling adventurous? The new dice button generates a random, popular recipe for you instantly.', ar: 'هل تشعر بالمغامرة؟ الزر الجديد يولد لك وصفة عشوائية وشهيرة على الفور.' }
      },
      {
        icon: Sparkles,
        title: { en: 'Dynamic Footer Message', ar: 'رسالة تذييل متغيرة' },
        description: { en: 'The footer now features a unique, AI-generated uplifting message on every visit.', ar: 'يعرض التذييل الآن رسالة إيجابية فريدة من نوعها يتم إنشاؤها بواسطة الذكاء الاصطناعي في كل زيارة.' }
      },
    ]
  },
  {
    version: '3.0.0',
    title: {
        en: "The Cinematic Update is Here!",
        ar: "التحديث السينمائي وصل!"
    },
    features: [
       {
        icon: Palette,
        title: { en: 'A Whole New Look', ar: 'تصميم جديد كلياً' },
        description: { en: 'A redesigned, cinematic interface with a darker, warmer theme for a more immersive experience.', ar: 'واجهة سينمائية مُعاد تصميمها بمظهر داكن وألوان دافئة لتجربة غامرة أكثر.' }
      },
      {
        icon: GlassWater,
        title: { en: 'Menu Planner for Occasions', ar: 'مخطط قائمة الطعام للمناسبات' },
        description: { en: 'Plan a complete 3-course meal for any event. Just describe the occasion and get a full menu!', ar: 'خطط لوجبة كاملة من 3 أطباق لأي مناسبة. فقط صف المناسبة واحصل على قائمة طعام متكاملة!' }
      },
       {
        icon: Scaling,
        title: { en: 'Dynamic Recipe Scaling', ar: 'تعديل كميات الوصفة' },
        description: { en: 'Adjust servings on the fly and watch ingredient amounts update automatically and intelligently.', ar: 'عدّل عدد الحصص بسهولة وشاهد كميات المكونات تتحدث تلقائياً وبشكل ذكي.' }
      },
       {
        icon: Compass,
        title: { en: 'Discovery-First Homepage', ar: 'صفحة اكتشاف ملهمة' },
        description: { en: 'A new homepage that inspires you with the Recipe of the Day before you even search.', ar: 'صفحة رئيسية جديدة تلهمك بوصفة اليوم قبل أن تبدأ البحث.' }
      },
    ]
  },
  {
    version: '2.0.0',
    title: {
        en: "What's New in Chef in Your Pocket!",
        ar: 'ما الجديد في شيف في جيبك!'
    },
    features: [
      {
        icon: CalendarDays,
        title: { en: 'Weekly Meal Planner', ar: 'مخطط الوجبات الأسبوعي' },
        description: { en: 'Plan your entire week! Describe your goals and get a full 7-day meal plan with recipes.', ar: 'خطط أسبوعك بالكامل! صف أهدافك واحصل على خطة وجبات لمدة 7 أيام مع وصفات كاملة.' }
      },
      {
        icon: Recycle,
        title: { en: 'Leftover Remix', ar: 'ريمكس بواقي الطعام' },
        description: { en: 'Got leftovers? Enter what you have and get a creative new recipe to reduce food waste.', ar: 'عندك بواقي أكل؟ أدخل ما لديك واحصل على وصفة جديدة ومبتكرة لتقليل هدر الطعام.' }
      },
      {
        icon: Search,
        title: { en: 'Search by Recipe Name', ar: 'البحث باسم الوصفة' },
        description: { en: 'Craving something specific? Now you can search for recipes directly by their name.', ar: 'تشتهي شيئًا محددًا؟ يمكنك الآن البحث عن الوصفات مباشرة باسمها.' }
      },
      {
        icon: Archive,
        title: { en: 'My Pantry', ar: 'خزينة مكوناتي' },
        description: { en: 'Manage your staple ingredients in the new Pantry section for quicker recipe suggestions.', ar: 'أدر مكوناتك الأساسية في قسم الخزينة الجديد للحصول على اقتراحات وصفات أسرع.' }
      },
      {
        icon: ChefHat,
        title: { en: 'Recipe of the Day', ar: 'وصفة اليوم' },
        description: { en: 'Discover a new, curated recipe every day right on the home screen.', ar: 'اكتشف وصفة جديدة ومنسقة كل يوم مباشرة على الشاشة الرئيسية.' }
      },
    ]
  }
];