/**
 * kashf-topics-per-house.js
 *
 * רשימת כל הנושאים הניתנים לשאלה לפי 12 הבתים — מחולצת מספר כשף אל-אסרר.
 * מקור: שער שישי, עמ' 166-276.
 *
 * כל נושא מצוין עם:
 *   - label      : שם קצר לתצוגה
 *   - description: תיאור מה נבדק
 *   - implemented: האם ממומש באפליקציה
 *   - topicId    : המזהה הקיים (אם ממומש)
 */

export const KASHF_TOPICS_PER_HOUSE = {

  1: {
    houseNameHebrew: 'בית החיים — הנפש והשואל',
    topics: [
      { label: 'מצב השואל הכללי',        description: 'כוח הנפש, מצב האדם עכשיו',                        implemented: true,  topicId: 'foundations' },
      { label: 'האם העניין יצליח',        description: 'האם הצורך יתמלא — לפי סעד/נחס ויתדות',            implemented: true,  topicId: 'completion' },
      { label: 'כישוף / עין הרע',         description: 'האם יש מעשה על השואל מהנשאל',                    implemented: true,  topicId: 'spiritualDiagnostics' },
      { label: 'אסתח׳ארה',                description: 'שאלת כוונה ורשות — 21 פעמים בטהרה',               implemented: false, topicId: null },
      { label: 'מולד / גורל האדם',        description: 'מצב האדם מלידה לפי בית 1 כטאלע',                  implemented: true,  topicId: 'birthNativity' },
      { label: 'אורך חיים',               description: 'האם יחיה ארוך — לפי צורות ארוכות/קצרות',          implemented: false, topicId: null },
      { label: 'מי מסתכל על מי',         description: 'האם אדם מסתכל על השואל או על אחר',                 implemented: false, topicId: null },
      { label: 'כיוון גיאוגרפי של העניין', description: 'איפה בפועל — מזרח/מערב/דרום/צפון לפי יסוד',      implemented: false, topicId: null },
    ],
  },

  2: {
    houseNameHebrew: 'בית הממון — כסף ורכוש',
    topics: [
      { label: 'ממון וכסף',               description: 'כמה כסף, מאיפה מגיע, האם יגיע',                   implemented: true,  topicId: 'commerce' },
      { label: 'האם חוב יוחזר',           description: 'נושה ומדיון — מי יגבר',                           implemented: true,  topicId: 'loan' },
      { label: 'ירושה',                   description: 'מי יורש את מי, ממון ירושה',                        implemented: true,  topicId: 'deathInheritance' },
      { label: 'פרנסה ומחיה',             description: 'מצב הפרנסה, מאיפה תבוא הפרנסה',                    implemented: false, topicId: null },
      { label: 'מקור הכסף',               description: 'שלטון / נשים / ספרים / נסיעה / מסחר / ירושה',     implemented: false, topicId: null },
    ],
  },

  3: {
    houseNameHebrew: 'בית האחים — קשרי משפחה ותנועה',
    topics: [
      { label: 'אחים ושכנים',             description: 'מצב האח, קרוב משפחה, שכן',                        implemented: true,  topicId: 'siblings' },
      { label: 'האם לעבור מקום',          description: 'להישאר או לעבור — מקום א׳ לעומת מקום ב׳',         implemented: false, topicId: null },
      { label: 'איזו עיר עדיפה',          description: 'השוואה בין שתי ערים — בית 1+2 מול בית 7+8',        implemented: false, topicId: null },
      { label: 'תנועה ונסיעה קצרה',       description: 'מעבר בתוך האזור, נסיעה פנים-ארצית',               implemented: false, topicId: null },
    ],
  },

  4: {
    houseNameHebrew: 'בית ההורים — נכסים ונסתרות',
    topics: [
      { label: 'מטמון / חפץ נסתר',        description: 'האם קיים, איפה מוקם, כיוון, עומק',                 implemented: true,  topicId: 'hiddenTreasure' },
      { label: 'מצב האב / הבית / הקרקע', description: 'כוח הבסיס, בית, נכסים, ירושת נדל״ן',              implemented: false, topicId: null },
      { label: 'קידוח בארות / עומק מים',  description: 'האם יש מים, באיזה עומק, אכדאד אל-הנדי',           implemented: false, topicId: null },
      { label: 'כיוון לחפירה / חיפוש',    description: 'מזרח/מערב/דרום/צפון לפי יסוד ושיטת נקודות',       implemented: false, topicId: null },
      { label: 'נסתרות / סודות',          description: 'דבר חבוי שלא ידוע — האם יתגלה',                   implemented: false, topicId: null },
    ],
  },

  5: {
    houseNameHebrew: 'בית הבנים — ילדים והריון',
    topics: [
      { label: 'האם יש הריון',            description: 'בדיקת הריון קיים לפי בית 5 ועדים',                 implemented: true,  topicId: 'childrenPregnancy' },
      { label: 'זכר או נקבה',             description: 'מין העובר — נארי/הוואאי=זכר, מאאי/תראבי=נקבה',   implemented: false, topicId: null },
      { label: 'חשש להפלה',              description: 'חמרה/אנכיס בבית 7+8 = סימן להפלה',                 implemented: false, topicId: null },
      { label: 'לידה קלה או כבדה',       description: 'כח אלד — כבד/קל לפי צורה',                         implemented: false, topicId: null },
      { label: 'מצב הילדים',             description: 'בריאות, עתיד, מזל הילד',                            implemented: false, topicId: null },
      { label: 'אורך חיים של הילד',      description: 'ארוך/קצר לפי צורות',                                implemented: false, topicId: null },
      { label: 'שמחות ואירועים',          description: 'כסוות, אפראח — מועד לשמחה',                        implemented: false, topicId: null },
    ],
  },

  6: {
    houseNameHebrew: 'בית המחלות — חולה, אבוד, בהמות',
    topics: [
      { label: 'האם החולה יחלים',         description: 'פרוגנוזה — ישתפר, יתמשך, סכנה',                   implemented: true,  topicId: 'illness' },
      { label: 'מיקום המחלה בגוף',       description: 'ראש / צוואר / חזה / בטן / ידיים / רגליים',        implemented: false, topicId: null },
      { label: 'סוג המחלה (אח׳לאט)',     description: 'מרה צהובה / שחורה / דם / ליחה לפי יסוד',           implemented: false, topicId: null },
      { label: 'האם ימות',               description: 'טריק/ביאד/עקלה/אג׳תמאע כאמהות = סכנת מוות',       implemented: false, topicId: null },
      { label: 'בהמה / חיה אבודה',       description: 'האם תחזור, איפה היא, מה קרה לה',                   implemented: false, topicId: null },
      { label: 'אבחון רוחני',            description: 'כישוף, עין, ג׳ין — מה גורם לקושי',                 implemented: true,  topicId: 'spiritualDiagnostics' },
    ],
  },

  7: {
    houseNameHebrew: 'בית הזוגיות — נישואין, שותפות, עסקאות',
    topics: [
      { label: 'נישואין / זוגיות',        description: 'האם יסתיים בנישואין, מצב הצד השני',               implemented: true,  topicId: 'marriage' },
      { label: 'מה היא האישה',           description: 'ת׳יב (גרושה) / בכר (בתולה) / חופשייה',            implemented: false, topicId: null },
      { label: 'צניעות האישה',           description: 'האם האישה צנועה ונאמנה',                            implemented: false, topicId: null },
      { label: 'אהבה ועשק',              description: 'האם מאוהב, עוצמת האהבה, אהבה הדדית',              implemented: true,  topicId: 'loveHate' },
      { label: 'סכסוך / תביעה',          description: 'מי ינצח — גאלב ומגלוב',                            implemented: true,  topicId: 'disputes' },
      { label: 'קנייה ומכירה',           description: 'האם העסקה תצליח, מי יגבר',                         implemented: true,  topicId: 'commerce' },
      { label: 'שותפות',                 description: 'האם השותפות כדאית, מי ירוויח',                      implemented: true,  topicId: 'partnership' },
      { label: 'מלחמה / עימות',          description: 'מי ינצח, כוח הצבאות, האם תיפתח עיר',              implemented: true,  topicId: 'disputes' },
      { label: 'אויבים',                 description: 'מי האויב, כוחו, האם מסוכן',                         implemented: true,  topicId: 'enemies' },
      { label: 'נעדר',                   description: 'מצב הנעדר — מיוצג בבית 7',                          implemented: true,  topicId: 'missingPerson' },
    ],
  },

  8: {
    houseNameHebrew: 'בית המוות — גנבה, הלוואה, מוות',
    topics: [
      { label: 'גנבה',                   description: 'זיהוי גנב, מיקום הגנוב, האם יוחזר',               implemented: true,  topicId: 'theft' },
      { label: 'תיאור הגנב',             description: 'מראה פיזי, שם, קרוב/רחוק, בתוך הבית/מחוצה',       implemented: false, topicId: null },
      { label: 'הלוואה',                 description: 'האם ישיב את ההלוואה — לפי ב1+ב7, ב2+ב8',          implemented: true,  topicId: 'loan' },
      { label: 'מוות / ירושה',           description: 'חשש מוות, ממון ירושה, מי יורש',                    implemented: true,  topicId: 'deathInheritance' },
      { label: 'ביטחון ואורך חיים',      description: 'סעד בבית 8 = ביטחון; נחס = פחד, מוות פתאומי',     implemented: false, topicId: null },
      { label: 'גנבת בהמות',            description: 'גמלים / סוסים / חמורים / צאן — זיהוי וחזרה',       implemented: false, topicId: null },
    ],
  },

  9: {
    houseNameHebrew: 'בית הנסיעה — מסע, נעדר, דת, חלום',
    topics: [
      { label: 'נסיעה (יבשה)',           description: 'האם לנסוע, בטיחות הדרך, כיוון',                    implemented: true,  topicId: 'travel' },
      { label: 'נסיעה (ים)',             description: 'ספינה, בטיחות מסע ים, סכנות מים',                  implemented: true,  topicId: 'seaVoyage' },
      { label: 'כיוון הנסיעה',           description: 'לאיזה כיוון לנסוע — מזרח/מערב/ים/קיבלה',          implemented: false, topicId: null },
      { label: 'בחירת זמן לנסיעה',      description: 'מתי לצאת — לפי בית 9 וכוחות בלוח',                 implemented: false, topicId: null },
      { label: 'נעדר — חי או מת',       description: 'מצב הנעדר, האם חי, האם יחזור',                      implemented: true,  topicId: 'missingPerson' },
      { label: 'מיקום הנעדר',            description: 'האם בעיר, כיוון, קרוב/רחוק',                       implemented: false, topicId: null },
      { label: 'חלום',                   description: 'פרשנות חלום — סעד/נחס בבית 9',                     implemented: false, topicId: null },
      { label: 'דת ויראת שמים',          description: 'האם האדם בעל דת — בית 3 + בית 9',                  implemented: true,  topicId: 'religion' },
      { label: 'מקצוע / עיסוק',         description: 'לפי כוכב בית 9 — חקלאות, מדעים, רפואה, אמנות',    implemented: false, topicId: null },
      { label: 'הבטחה — האם תתממש',     description: 'מסאלה: האם ייקיים הבטחה שנתן',                      implemented: false, topicId: null },
    ],
  },

  10: {
    houseNameHebrew: 'בית הכבוד — שלטון, מעמד, האם',
    topics: [
      { label: 'שלטון / תפקיד / כבוד',  description: 'האם יישמר התפקיד, כוח המעמד',                      implemented: true,  topicId: 'authorityState' },
      { label: 'משך השררות',             description: 'כמה זמן ישאר בתפקיד — מנקלב/ת׳אבת',               implemented: false, topicId: null },
      { label: 'האם יחזור לתפקיד',      description: 'מסולק שרוצה לחזור — בית 1+10+11 דאח׳ל',           implemented: false, topicId: null },
      { label: 'דיני האם',               description: 'מצב האם, מזלה, בריאותה',                            implemented: true,  topicId: 'motherRules' },
      { label: 'יוקר / זול (מחירי שוק)', description: 'אש+אוויר > מים+עפר = יוקר; הפוך = זולות',         implemented: false, topicId: null },
      { label: 'תחזית שנתית',            description: 'גורל השנה — שפע/יובש/גשם/יוקר',                    implemented: true,  topicId: 'yearlyForecast' },
      { label: 'מלך / שליט — האם מפחד', description: 'האם שליט בסכנה מאויב — שמס+קמר בעמודים',           implemented: false, topicId: null },
    ],
  },

  11: {
    houseNameHebrew: 'בית התקווה — חברים, אמל, אורך חיים',
    topics: [
      { label: 'חברים ותמיכה',           description: 'מצב הידידות, האם החברים נאמנים',                   implemented: true,  topicId: 'loveHate' },
      { label: 'תקווה / אמל',            description: 'האם מה שמקווים לו יתממש',                          implemented: true,  topicId: 'completion' },
      { label: 'אורך חיים',               description: 'עמר — ראשית/אמצע/סוף לפי בתים 9+7',               implemented: false, topicId: null },
      { label: 'אהבה / עשק',             description: 'אהבה נלהבת — האם הדדית, האם חלאל/חראם',           implemented: false, topicId: null },
      { label: 'לבוש ומזל בלבוש',        description: 'מזל בלבוש/ביגוד — לפי כוכב',                      implemented: false, topicId: null },
      { label: 'האם ישיג מה שרוצה',      description: 'קצ׳אאת חוואאג׳ — לפי בית 1+11+15',                 implemented: false, topicId: null },
      { label: 'יציבות המצב הנוכחי',     description: 'דוואם אל-חאל — האם המצב יימשך',                    implemented: false, topicId: null },
    ],
  },

  12: {
    houseNameHebrew: 'בית האויבים — אויב, כלא, פחד',
    topics: [
      { label: 'אויבים / מתנגדים',       description: 'כוח האויב, ת׳אבת/מנקלב — קבוע/זמני',              implemented: true,  topicId: 'enemies' },
      { label: 'פחד / סכנה',             description: 'האם הפחד מבוסס, מה מקורו',                         implemented: true,  topicId: 'fear' },
      { label: 'אסיר / כלוא',            description: 'האם יצא מהכלא — ב1+ב5 ח׳ארג/דאח׳ל',              implemented: true,  topicId: 'prisoner' },
      { label: 'פרטי שחרור',             description: 'מתי יצא, האם בשפאעה, עונש/קנס/מחלה בכלא',         implemented: false, topicId: null },
      { label: 'בורחים',                 description: 'האם הבורח ייתפס, מיקומו',                           implemented: false, topicId: null },
    ],
  },

};

/**
 * סיכום: נושאים שחסרים באפליקציה
 * (implemented: false בכל הבתים)
 */
export const MISSING_TOPICS_SUMMARY = [
  { house: 1,  label: 'אסתח׳ארה',                 priority: 'medium' },
  { house: 1,  label: 'אורך חיים',                 priority: 'low' },
  { house: 1,  label: 'מי מסתכל על מי',           priority: 'low' },
  { house: 1,  label: 'כיוון גיאוגרפי',            priority: 'low' },
  { house: 2,  label: 'פרנסה ומחיה',               priority: 'high' },
  { house: 2,  label: 'מקור הכסף',                 priority: 'medium' },
  { house: 3,  label: 'האם לעבור מקום',            priority: 'high' },
  { house: 3,  label: 'איזו עיר עדיפה',            priority: 'high' },
  { house: 4,  label: 'מצב האב / הקרקע',          priority: 'medium' },
  { house: 4,  label: 'קידוח בארות / עומק מים',   priority: 'low' },
  { house: 4,  label: 'כיוון לחפירה',              priority: 'low' },
  { house: 5,  label: 'זכר או נקבה',               priority: 'high' },
  { house: 5,  label: 'חשש להפלה',                priority: 'medium' },
  { house: 5,  label: 'אורך חיים של הילד',        priority: 'low' },
  { house: 6,  label: 'מיקום המחלה בגוף',         priority: 'high' },
  { house: 6,  label: 'סוג המחלה (אח׳לאט)',       priority: 'medium' },
  { house: 6,  label: 'האם ימות',                  priority: 'medium' },
  { house: 6,  label: 'בהמה / חיה אבודה',         priority: 'low' },
  { house: 7,  label: 'מה היא האישה (ת׳יב/בכר)',  priority: 'medium' },
  { house: 7,  label: 'צניעות האישה',              priority: 'medium' },
  { house: 8,  label: 'תיאור פיזי של הגנב',       priority: 'high' },
  { house: 8,  label: 'ביטחון ואורך חיים',        priority: 'low' },
  { house: 9,  label: 'כיוון הנסיעה',              priority: 'medium' },
  { house: 9,  label: 'בחירת זמן לנסיעה',         priority: 'medium' },
  { house: 9,  label: 'מיקום הנעדר',               priority: 'high' },
  { house: 9,  label: 'חלום — פרשנות',             priority: 'high' },
  { house: 9,  label: 'מקצוע / עיסוק',            priority: 'medium' },
  { house: 9,  label: 'הבטחה — האם תתממש',        priority: 'medium' },
  { house: 10, label: 'משך השררות',                priority: 'medium' },
  { house: 10, label: 'יוקר / זול',                priority: 'medium' },
  { house: 11, label: 'אורך חיים',                 priority: 'low' },
  { house: 11, label: 'האם ישיג מה שרוצה',        priority: 'medium' },
  { house: 12, label: 'פרטי שחרור / עונש',        priority: 'medium' },
  { house: 12, label: 'בורחים',                    priority: 'low' },
];

export default { KASHF_TOPICS_PER_HOUSE, MISSING_TOPICS_SUMMARY };
