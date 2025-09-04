import { Recycle, Search, Youtube, Zap, Sparkles, Archive, CalendarDays } from 'lucide-react';

export const LATEST_CHANGELOG_VERSION = '2.3.0';

export const changelog = [
    {
        version: '2.3.0',
        title: {
            en: 'Polish & Performance Update',
            ar: 'تحديث التحسينات والأداء',
        },
        features: [
            {
                icon: Zap,
                title: { en: 'Major Bug Fixes & Performance Boost', ar: 'إصلاحات رئيسية وتعزيز للأداء' },
                description: { en: 'We squashed tricky display bugs with dropdowns and images. The app now runs smoother and more reliably on all devices, especially mobile!', ar: 'لقد أصلحنا الأخطاء المزعجة في عرض القوائم المنسدلة والصور. التطبيق الآن يعمل بشكل أكثر سلاسة وموثوقية على جميع الأجهزة، خاصة الهواتف!' },
            },
            {
                icon: Sparkles,
                title: { en: 'UI Refinements & Permanent Footer', ar: 'تحسينات بصرية وتذييل دائم' },
                description: { en: 'We fine-tuned visual details like dropdown menus. The solidarity message is now a permanent part of our footer, proudly crediting Abdallah Ibrahim.', ar: 'لقد قمنا بضبط التفاصيل المرئية مثل القوائم المنسدلة. أصبحت رسالة التضامن الآن جزءًا دائمًا من تذييل الصفحة، مع إضافة اسم عبد الله إبراهيم بكل فخر.' },
            },
        ],
    },
    {
        version: '2.2.0',
        title: {
            en: 'The Magic Touch Upgrade!',
            ar: 'ترقية اللمسة السحرية!',
        },
        features: [
            {
                icon: Sparkles,
                title: { en: 'A Living, Breathing Logo', ar: 'شعار حي ومتجدد' },
                description: { en: 'Our app icon is now more alive than ever, with a fun new animation to greet you!', ar: 'أيقونة تطبيقنا أصبحت الآن أكثر حيوية من أي وقت مضى، مع حركة جديدة وممتعة للترحيب بك!' },
            },
            {
                icon: CalendarDays,
                title: { en: 'Weekly Meal Planner', ar: 'مخطط الوجبات الأسبوعي' },
                description: { en: 'Plan your meals for the week with one click. Get a full schedule and a unified shopping list!', ar: 'خطط وجباتك للأسبوع بنقرة واحدة. احصل على جدول كامل وقائمة تسوق موحدة!' },
            },
            {
                icon: Archive,
                title: { en: 'Your Smart Pantry', ar: 'خزينتك الذكية' },
                description: { en: 'Save staple ingredients in your pantry. One click adds them to your next creation!', ar: 'احفظ مكوناتك الأساسية في خزينتك. نقرة واحدة تضيفها لوصفتك التالية!' },
            },
            {
                icon: Recycle,
                title: { en: 'Leftover Remix', ar: 'ريمكس البواقي' },
                description: { en: 'Turn your leftovers into a delicious new meal and reduce food waste.', ar: 'حوّل بقايا طعامك إلى وجبة جديدة ولذيذة وقلل من هدر الطعام.' },
            },
            {
                icon: Search,
                title: { en: 'Instant Recipe Search', ar: 'بحث فوري عن الوصفات' },
                description: { en: 'Looking for a specific dish? Use the new "Search by Name" mode to find it instantly.', ar: 'تبحث عن طبق معين؟ استخدم وضع "البحث بالاسم" الجديد للعثور عليه فورًا.' },
            },
            {
                icon: Zap,
                title: { en: 'Smarter & Faster Experience', ar: 'تجربة أذكى وأسرع' },
                description: { en: 'Get unique AI-powered cooking tips on the loading screen and enjoy faster recipe generation.', ar: 'احصل على نصائح طهي فريدة من الذكاء الاصطناعي أثناء التحميل واستمتع بإنشاء أسرع للوصفات.' },
            },
            {
                icon: Youtube,
                title: { en: 'Reliable Video Search', ar: 'بحث فيديو موثوق' },
                description: { en: 'The "Watch Tutorial" button now takes you directly to a YouTube search, giving you the best and latest videos for every recipe.', ar: 'زر "شاهد الشرح" ينقلك الآن مباشرة إلى بحث يوتيوب، مما يمنحك أفضل وأحدث الفيديوهات لكل وصفة.' },
            },
        ],
    },
];
