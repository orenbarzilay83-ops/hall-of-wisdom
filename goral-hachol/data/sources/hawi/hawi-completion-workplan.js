export const HAWI_COMPLETION_WORKPLAN = {
  id: 'hawi-completion-workplan',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  project: 'גורל החול',
  status: 'clean-workplan-after-old-instructions-removed',
  purposeHebrew:
    'תוכנית עבודה נקייה אחרי מחיקת הוראות צ׳אטים ישנות. אין לפתוח מחדש שכבות שכבר נבדקו.',

  closedDoNotReopen: [
    'שמות 16 הצורות',
    'חוק הכאת הצורות',
    'בניית לוח הגורל עד בית 16',
    'אמהות, בנות, נכדות, עדים, דיין ומשלים בית 15',
    'מצבי הצורות — מדבר/שותק, סעד/נחס',
    'מעבר הצורות ב־16 הבתים',
    '16 הבתים',
    'דיני שאלות קיימים בשכבת חאוי',
  ],

  nextOnlyIfNeeded: [
    {
      id: 'spiritual-diagnostics-expanded',
      titleHebrew: 'אבחון רוחני מורחב',
      ruleHebrew:
        'רק ממקורות מאושרים. לא להמציא ולא לפתוח מחדש חומר שכבר קיים.',
    },
    {
      id: 'future-modules',
      titleHebrew: 'מודולים עתידיים',
      ruleHebrew:
        'שער מולד, כוכבים/חומרים, טאלע שנה ושלטון הם מודולים עתידיים; הם לא מעכבים את גורל החול הבסיסי.',
    },
  ],

  terminologyHebrew: {
    saad: 'סעד / טוב',
    nahs: 'נחס / רע',
    mumtazij: 'ממוזג',
    natiq: 'מדבר',
    samit: 'שותק',
    takhth: 'לוח הגורל',
    judge: 'דיין',
    sentence: 'משלים בית 15',
  },

  currentDecisionHebrew:
    'מכאן ממשיכים רק לפי פער אמיתי וממוקד. לא חוזרים לסיבובים על הצורות או על בניית הלוח בגלל הוראות ישנות.',
};

export default { HAWI_COMPLETION_WORKPLAN };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_COMPLETION_WORKPLAN };
}
