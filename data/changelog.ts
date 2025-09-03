import { Recycle, Search, Youtube, Zap, Sparkles, Archive } from 'lucide-react';

export const LATEST_CHANGELOG_VERSION = '2.0.0';

export const changelog = [
    {
        version: '2.0.0',
        title: {
            en: 'The 2.0 Comprehensive Upgrade!',
            ar: 'الترقية الشاملة 2.0!',
        },
        features: [
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
            {
                icon: Sparkles,
                title: { en: 'Redesigned Interface', ar: 'واجهة مُعاد تصميمها' },
                description: { en: 'The "Surprise Me" button is now a fun, dedicated icon, making the main form cleaner and more intuitive.', ar: 'أصبح زر "فاجئني" الآن أيقونة مخصصة وممتعة، مما يجعل الواجهة الرئيسية أكثر تنظيمًا وسهولة.' },
            },
        ],
    },
];