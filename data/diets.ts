export interface Diet {
  value: string;
  en: string;
  ar: string;
}

export const diets: Diet[] = [
  { value: 'none', en: 'None', ar: 'لا يوجد' },
  { value: 'vegetarian', en: 'Vegetarian', ar: 'نباتي' },
  { value: 'vegan', en: 'Vegan', ar: 'نباتي صرف (فيجن)' },
  { value: 'keto', en: 'Keto', ar: 'كيتو' },
  { value: 'gluten-free', en: 'Gluten-Free', ar: 'خالي من الجلوتين' },
  { value: 'paleo', en: 'Paleo', ar: 'باليو' },
];
