import { HandHelping, Utensils, BellRing, Sparkles, Eye, Smartphone, GlassWater } from 'lucide-react';

export const LATEST_CHANGELOG_VERSION = '1.3.0';

export const changelog = [
    {
        version: '1.3.0',
        title: {
            en: "A Fresh & Animated Update!",
            ar: "تحديث جديد وحيوي!",
        },
        features: [
            {
                icon: Sparkles,
                title: {
                    en: 'A Magical Welcome!',
                    ar: 'ترحيب ساحر!',
                },
                description: {
                    en: 'We\'ve revamped the new user tutorial with delightful animations and illustrations to make your first experience even more enjoyable.',
                    ar: 'لقد قمنا بتجديد البرنامج التعليمي للمستخدمين الجدد برسوم متحركة وتوضيحية رائعة لجعل تجربتك الأولى أكثر متعة.',
                },
            },
            {
                icon: Eye,
                title: {
                    en: 'Crystal Clear UI',
                    ar: 'واجهة استخدام أكثر وضوحًا',
                },
                description: {
                    en: 'Text in the "Chef\'s Touch" (remix) modal is now much easier to read. We also fixed a layout issue with the recipe tabs on mobile.',
                    ar: 'أصبح النص في نافذة "أضف لمستك" أسهل في القراءة الآن. أصلحنا أيضًا مشكلة في تخطيط الأزرار على الهواتف.',
                },
            },
            {
                icon: Smartphone,
                title: {
                    en: 'Faster, Better Images on Mobile',
                    ar: 'صور أسرع وأفضل على الهاتف',
                },
                description: {
                    en: 'We\'ve fine-tuned our image generation to deliver faster-loading and more reliable recipe photos, especially for you.',
                    ar: 'لقد قمنا بتحسين عملية إنشاء الصور لتقديم صور وصفات أسرع وأكثر موثوقية، خاصة بالنسبة لك.',
                },
            },
            {
                icon: GlassWater,
                title: {
                    en: 'Safer Sips',
                    ar: 'مشروبات آمنة',
                },
                description: {
                    en: 'Based on your feedback, all suggested drink pairings are now guaranteed to be non-alcoholic and delicious.',
                    ar: 'بناءً على ملاحظاتك، نضمن الآن أن جميع المشروبات المقترحة غير كحولية ولذيذة.',
                },
            },
        ],
    },
];
