// המקור הראשי לאפליקציה: תיקיית Google Drive "ספרים לאפליקציית גורל החול"
// ID: 183LO6vN9CsPW13CkNWN7Q-8_MMylrkmO
// תמיד יש לחפש ולהשלים ידע משם לפני כל יישום חדש.

export const HAWI_TOPIC_INDEX = {
  id: 'hawi-topic-index',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  status: 'clean-current-topic-index',
  purposeHebrew:
    'אינדקס נושאים נקי לאחר מחיקת הוראות צ׳אטים ישנות. האינדקס לא פותח מחדש חומר שכבר נבדק.',
  primarySourceNote:
    'תיקיית Google Drive "ספרים לאפליקציית גורל החול" (ID: 183LO6vN9CsPW13CkNWN7Q-8_MMylrkmO) היא המקור הראשי לכל הידע באפליקציה — חפש ממנה תמיד קודם.',

  terminologyHebrew: {
    saad: 'מיטיב / טוב',
    nahs: 'מזיק / רע',
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
      hebrewTitle: 'מצבי הצורות — מדבר/שותק, מיטיב/מזיק',
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
      coverageStatus: 'engine-implemented',
      existingFiles: [
        'goral-hachol/data/sources/hawi/foundations/hawi-spiritual-diagnostics.js',
        'goral-hachol/data/sources/approved-raml/spiritual-diagnostics/raml-spiritual-diagnostics-sihr-mass-hasad.js',
      ],
    },
  ],

  remainingTopics: [],

  implementedTopics: [
    {
      topicId: 'spiritual-diagnostics-expanded',
      hebrewTitle: 'ג׳ומלה — אבחון מחלה / ילדים / שותפות לפי שיטת סכום הנקודות',
      coverageStatus: 'engine-implemented',
      noteHebrew: 'שיטת הג׳ומלה ממקור בלוג׳ אל-אמל עמ׳ 62-63. מחושב אוטומטית על כל לוח. מחלה: mod4 (שארית 3 = כישוף), ילדים: mod3, שותפות: mod4.',
      existingFiles: [
        'goral-hachol/data/sources/approved-raml/spiritual-diagnostics/raml-jumla-method.js',
        'goral-hachol/engine/hawi-interpreter.js (computeJumlaAnalysis)',
      ],
    },
    {
      topicId: 'planetary-correspondences',
      hebrewTitle: 'שיוכי כוכבים וחומרים / משולשי יסודות',
      coverageStatus: 'engine-implemented',
      noteHebrew: 'משולשי יסודות וכוכבים פעילים במנוע trianglesEnrichment.',
    },
    {
      topicId: 'birth-nativity-mawlud',
      hebrewTitle: 'שער המולד',
      coverageStatus: 'engine-implemented',
      noteHebrew: 'מנוע birthNativity פעיל לפי חאוי.',
    },
    {
      topicId: 'yearly-weather-omens',
      hebrewTitle: 'עולה השנה / גשם / יוקר וזול',
      coverageStatus: 'engine-implemented',
      noteHebrew: 'מנוע yearlyForecast פעיל לפי חאוי עמ׳ 61-62.',
    },
    {
      topicId: 'authority-state',
      hebrewTitle: 'מלכים / מדינות / שלטון',
      coverageStatus: 'engine-implemented',
      noteHebrew: 'מנוע authorityState פעיל. חילוץ שם אויב מדינה דרך בית 7.',
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

export function getHawiTopic(id) {
  return HAWI_TOPIC_INDEX.topics?.find((topic) => topic.id === id || topic.topicId === id) || null;
}

export function getHawiTopicsByStatus(status) {
  return HAWI_TOPIC_INDEX.topics?.filter((topic) => topic.coverageStatus === status || topic.status === status) || [];
}

export function getHawiTopicsByPriority(priority) {
  return HAWI_TOPIC_INDEX.topics?.filter((topic) => topic.priority === priority) || [];
}
