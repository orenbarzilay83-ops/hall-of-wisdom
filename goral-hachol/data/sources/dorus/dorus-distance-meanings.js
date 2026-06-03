export const DORUS_DISTANCE_MEANINGS = [
  { distance: 5,  arabicName: 'فرح',          meaning: 'שמחה' },
  { distance: 6,  arabicName: 'نحسة',         meaning: 'אסון/צרה נסתרת' },
  { distance: 7,  arabicName: 'مطلوب',         meaning: 'המבוקש מושג' },
  { distance: 8,  arabicName: 'احتراق وهلاك', meaning: 'שריפה וכליה' },
  { distance: 9,  arabicName: 'غيب',          meaning: 'נסתר/נעדר' },
  { distance: 10, arabicName: 'عز وملك',      meaning: 'כבוד ושלטון' },
  { distance: 11, arabicName: 'سعد',          meaning: 'מזל' },
  { distance: 12, arabicName: 'عداوة',        meaning: 'איבה' },
];

export function getDistanceMeaning(distance) {
  return DORUS_DISTANCE_MEANINGS.find((d) => d.distance === distance) || null;
}
