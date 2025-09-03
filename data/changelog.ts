import { HandHelping, Utensils, BellRing } from 'lucide-react';

export const LATEST_CHANGELOG_VERSION = '1.2.0';

export const changelog = [
    {
        version: '1.2.0',
        title: {
            en: "What's New in Your Kitchen!",
            ar: "ما الجديد في مطبخك!",
        },
        features: [
            {
                icon: HandHelping,
                title: {
                    en: 'Interactive Toast Notifications',
                    ar: 'إشعارات تفاعلية أنيقة',
                },
                description: {
                    en: 'Get instant, sleek feedback when you favorite a recipe or add items to your shopping list.',
                    ar: 'احصل على تأكيد فوري وأنيق عند إضافة وصفة للمفضلة أو مكونات لقائمة التسوق.',
                },
            },
            {
                icon: Utensils,
                title: {
                    en: 'Enhanced Menu Planner',
                    ar: 'تحسين مخطط قوائم الطعام',
                },
                description: {
                    en: 'The menu planner now generates even more cohesive and creative 3-course meals for your special occasions.',
                    ar: 'يقوم مخطط قوائم الطعام الآن بإنشاء وجبات من 3 أطباق أكثر تناسقًا وإبداعًا لمناسباتك الخاصة.',
                },
            },
            {
                icon: BellRing,
                title: {
                    en: 'This "What\'s New" Popup!',
                    ar: 'هذه النافذة المنبثقة "ما الجديد"!',
                },
                description: {
                    en: 'Stay informed about all the latest features and improvements with this update screen.',
                    ar: 'ابق على اطلاع بجميع الميزات والتحسينات الجديدة مع شاشة التحديثات هذه.',
                },
            },
        ],
    },
];
