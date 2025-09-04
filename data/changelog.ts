import { Archive, CalendarDays, Recycle, Search, ChefHat } from 'lucide-react';
import type { Icon } from 'lucide-react';

interface ChangelogFeature {
  icon: Icon;
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
