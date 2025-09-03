import { Recycle, Lightbulb, Search, Youtube, Zap, Sparkles, Archive } from 'lucide-react';

export const LATEST_CHANGELOG_VERSION = '1.9.0';

export const changelog = [
    {
        version: '1.9.0',
        title: {
            en: 'The Smart Pantry Update!',
            ar: 'تحديث الخزينة الذكية!',
        },
        features: [
            {
                icon: Archive,
                title: {
                    en: 'Introducing: Your Smart Pantry',
                    ar: 'نقدم لكم: خزينتكم الذكية',
                },
                description: {
                    en: 'Save your staple ingredients in your personal pantry. One click is all it takes to add them to your next creation, saving you time!',
                    ar: 'احفظ مكوناتك الأساسية في خزينتك الشخصية. نقرة واحدة تكفي لإضافتها إلى وصفتك التالية، مما يوفر وقتك!',
                },
            },
            {
                icon: Recycle,
                title: {
                    en: 'Leftover Remix',
                    ar: 'ريمكس البواقي',
                },
                description: {
                    en: 'Don\'t waste food! Use the new "Leftover Remix" mode to turn your leftovers into a delicious new meal.',
                    ar: 'لا تهدر الطعام! استخدم وضع "ريمكس البواقي" الجديد لتحويل بقايا طعامك إلى وجبة جديدة ولذيذة.',
                },
            },
            {
                icon: Zap,
                title: {
                    en: 'Smarter & Faster Experience',
                    ar: 'تجربة أذكى وأسرع',
                },
                description: {
                    en: 'Enjoy unique AI cooking tips while loading, and get your recipes faster than ever before with better video results.',
                    ar: 'استمتع بنصائح طهي فريدة من الذكاء الاصطناعي أثناء التحميل، واحصل على وصفاتك بشكل أسرع مع نتائج فيديو أفضل.',
                },
            },
        ],
    },
];