export const HAWI_TOPIC_INDEX = {
  id: 'hawi-topic-index',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  status: 'clean-current-topic-index',
  purposeHebrew:
    'אינדקס נושאים נקי לאחר מחיקת הוראות צ׳אטים ישנות. האינדקס לא פותח מחדש חומר שכבר נבדק.',

  terminologyHebrew: {
    saad: 'סעד / טוב',
    nahs: 'נחס / רע',
    mumtazij: 'ממוזג',
    takhth: 'לוח הגורל',
    mothers: 'אמהות',
    daughters: 'בנות',
    granddaughters: 'נכדות',
    witnesses: 'עדים',
    judge: 'דיין',
    sentence: 'משלים בית 15',
  },

  completedTopics: [
    {
      topicId: 'figure-names',
      hebrewTitle: 'שמות הצורות',
      coverageStatus: 'complete-current-layer',
      existingFiles: ['goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js'],
    },
    {
      topicId: 'houses-16',
      hebrewTitle: '16 הבתים',
      coverageStatus: 'complete-rich-current-layer',
      existingFiles: ['goral-hachol/data/sources/hawi/foundations/hawi-houses-16.js'],
    },
    {
      topicId: 'figure-transits',
      hebrewTitle: 'מעבר הצורות בבתים',
      coverageStatus: 'complete-rich-current-layer',
      existingFiles: ['goral-hachol/data/sources/hawi/figure-transits/'],
    },
    {
      topicId: 'figure-states',
      hebrewTitle: 'מצבי הצורות — מדבר/שותק, סעד/נחס',
      coverageStatus: 'closed-after-working-review',
      existingFiles: ['goral-hachol/data/sources/hawi/figure-states/'],
    },
    {
      topicId: 'board-generation',
      hebrewTitle: 'בניית לוח הגורל',
      coverageStatus: 'engine-implemented-and-source-aligned',
      existingFiles: [
        'goral-hachol/engine/raml-figures.js',
        'goral-hachol/engine/raml-board-generator.js',
      ],
    },
    {
      topicId: 'question-rules',
      hebrewTitle: 'דיני שאלות קיימים',
      coverageStatus: 'complete-current-layer',
      existingFiles: ['goral-hachol/data/sources/hawi/question-rules/'],
    },
    {
      topicId: 'spiritual-diagnostics-current',
      hebrewTitle: 'אבחון רוחני קיים',
      coverageStatus: 'partly-covered-current-layer',
      existingFiles: [
        'goral-hachol/data/sources/hawi/foundations/hawi-spiritual-diagnostics.js',
        'goral-hachol/data/sources/approved-raml/spiritual-diagnostics/raml-spiritual-diagnostics-sihr-mass-hasad.js',
      ],
    },
  ],

  remainingTopics: [
    {
      topicId: 'planetary-correspondences',
      hebrewTitle: 'שיוכי כוכבים וחומרים',
      coverageStatus: 'future-module',
      noteHebrew: 'לא מעכב את גורל החול הבסיסי.',
    },
    {
      topicId: 'birth-nativity-mawlud',
      hebrewTitle: 'שער המולד',
      coverageStatus: 'future-large-module',
      noteHebrew: 'מודול עתידי נפרד.',
    },
    {
      topicId: 'yearly-weather-omens',
      hebrewTitle: 'טאלע השנה / גשם / יוקר וזול',
      coverageStatus: 'future-large-module',
      noteHebrew: 'מודול עתידי נפרד.',
    },
    {
      topicId: 'authority-state',
      hebrewTitle: 'מלכים / מדינות / שלטון',
      coverageStatus: 'future-specialized-module',
      noteHebrew: 'לא חלק מהמנוע הבסיסי.',
    },
    {
      topicId: 'spiritual-diagnostics-expanded',
      hebrewTitle: 'עין / ג׳ין / מס ואבחון רוחני מורחב',
      coverageStatus: 'needs-approved-source-only',
      noteHebrew: 'להשלים רק ממקור מאושר, לא מסברה.',
    },
  ],

  currentDecisionHebrew:
    'כל סימוני הביקורת הישנים נמחקו מהאינדקס. מה שמופיע ב־completedTopics לא נפתח מחדש.',
};

export function getHawiCompletedTopics() {
  return HAWI_TOPIC_INDEX.completedTopics;
}

export function getHawiRemainingTopics() {
  return HAWI_TOPIC_INDEX.remainingTopics;
}

export default { HAWI_TOPIC_INDEX };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_TOPIC_INDEX };
}
