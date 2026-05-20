export const HAWI_FIGURE_STATES_PHOTO_REVIEW_TODO = {
  id: 'hawi-figure-states-photo-review-todo',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceArea: 'figure-states',
  status: 'closed-after-working-review',
  purposeHebrew:
    'קובץ זה נסגר לאחר עבודת ביקורת קודמת על שכבת מצבי הצורות. הוא נשמר רק כתיעוד לכך שהסימונים הישנים נוקו כדי שלא יבלבלו את המשך העבודה.',

  terminologyHebrew: {
    saad: 'סעד / טוב',
    nahs: 'נחס / רע',
    natiq: 'מדבר',
    samit: 'שותק',
  },

  closedDecisionHebrew:
    'שכבת מצבי הצורות נחשבת שכבת ידע שנבדקה בעבודתנו הקודמת. אין להשתמש בקובץ זה כדי לפתוח מחדש את כל הצורות. אם תתגלה נקודת מקור חדשה בעתיד, היא תיפתח כפריט חדש וממוקד בלבד.',

  closedItemsHebrew: [
    'סוהר / العقلة — בית 11',
    'חיבור / الاجتماع — בתים 10–11',
    'ממון נכנס / القبض الداخل — בתים 14–15',
    'סף נכנס / عتبة داخلة — בתים 15–16',
    'שאר הערות בית 15 ו־16 נשמרות לפי המיפוי הסופי הקיים ולא פותחות את העבודה מחדש.',
  ],

  engineDecisionHebrew:
    'סעד יוצג בעברית כטוב. נחס יוצג בעברית כרע. המקור הערבי נשמר בקבצי הידע.',
};

export default { HAWI_FIGURE_STATES_PHOTO_REVIEW_TODO };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FIGURE_STATES_PHOTO_REVIEW_TODO };
}
