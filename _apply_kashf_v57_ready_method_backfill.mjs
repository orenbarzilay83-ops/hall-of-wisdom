#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const knowledgePath = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
const methodPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const routePath = 'goral-hachol/registry/kashf-question-route-registry.js';
const testPath = '_test_kashf_canonical_routing.mjs';
const workflowPath = '.github/workflows/kashf-canonical-routing-tests.yml';
const reportPath = 'HALL_WISDOM_KASHF_V57_READY_METHOD_BACKFILL.md';

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing patch anchor: ${label}`);
  return text.replace(from, to);
}

let knowledge = fs.readFileSync(knowledgePath, 'utf8');
if (knowledge.includes("'career.p266.returnToOffice': knowledge({")) {
  console.log('Ready-method v57 backfill already applied.');
  process.exit(0);
}

knowledge = replaceOnce(
  knowledge,
  "  arabicVerificationPages = [],\n  notes = null,",
  "  arabicVerificationPages = [],\n  verificationNotes = null,\n  notes = null,",
  'knowledge verificationNotes argument'
);
knowledge = replaceOnce(
  knowledge,
  "    arabicVerification: Object.freeze({\n      role: 'verification-only',\n      pages: Object.freeze([...arabicVerificationPages]),\n    }),",
  "    arabicVerification: Object.freeze({\n      role: 'verification-only',\n      pages: Object.freeze([...arabicVerificationPages]),\n      notes: verificationNotes,\n    }),",
  'knowledge verificationNotes payload'
);

const entries = String.raw`

  'career.p266.returnToOffice': knowledge({
    kashfMethodId: 'career.p266.returnToOffice',
    page: 266,
    topic: 'הפרק האחד־עשר — חברים, תקווה, אורך חיים ואהבה',
    heading: 'קיום המצב; מי שהודח משירות',
    hebrewRule: 'מי שהודח משירות — האם יחזור? ראה את הראשון. אם הוא מיטיב נכנס, ומצטייר בעשירי או בבתים החזקים, והאחרית מעידה על כך — הוא חוזר למקומו. ואם הצורה מזיקה, הדין להפך. לפי אותו קו דנים מי שהוסר מדרגה, יצא מביתו או נפרד מאשתו.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [266],
    notes: 'הידע העברי מוכן; המבצע נשאר חסום עד חיבור סיווג מיטיב/מזיק ופנימי/חיצוני באופן שיטתי לשיטה זו.',
  }),

  'child.p194.healthTrajectoryH6H8': knowledge({
    kashfMethodId: 'child.p194.healthTrajectoryH6H8',
    page: 194,
    topic: 'הפרק החמישי — ילדים והריון',
    heading: 'טבע הראשון והחמישי / ודיני בריאות הוולד',
    hebrewRule: 'אם באה הצורה ריקה, התבונן בבית השישי, שהוא בית המחלות. אם נמצאת בו צורה מזיקה, הדבר מורה על ריבוי מכאובים בילדותו. אחר כך התבונן בבית השמיני, שהוא בית המוות והאבדון. אם נמצאת בו צורה מזיקה, התקווה בו מועטה. ואם נמצאת בו צורה מיטיבה, כל כמה שיגדל — ימעט חוליו וישתפר מצבו.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [194],
    notes: 'זהו מסלול בריאות הילד לאורך הזמן, לא מנוע החלמה מחולי נוכחי.',
  }),

  'clothing.p264-265.luck': knowledge({
    kashfMethodId: 'clothing.p264-265.luck',
    page: 265,
    topic: 'הפרק האחד־עשר — חברים, תקווה, אורך חיים ואהבה',
    heading: 'דין הלבוש וקיום המצב',
    hebrewRule: 'אם בחמישי ובאחד־עשר יש צורות מיטיבות, יש לו מזל בלבושים. אם בעשירי מזיק, אין לו מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה. אם בשני הבתים צורות מזיקות, אין לו מזל בלבוש, והבגד נשאר עליו עד שיקרע. אם הצורה מתהפכת, אינו עומד על לבוש אחד.',
    detailPages: [264, 265],
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [264, 265],
  }),

  'desire.p206.querentWantsH7H11ThenH5': knowledge({
    kashfMethodId: 'desire.p206.querentWantsH7H11ThenH5',
    page: 206,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'רצון השואל בדבר',
    hebrewRule: 'אם רצית לדעת אם השואל רוצה בדבר או לא: הכה את השביעי והאחד־עשר, ואת היוצא מהם הכה עם החמישי. אם יצאה צורה מיטיבה — הוא רוצה. ואם יצאה צורה מזיקה — להפך.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [206],
    notes: 'הכלל בודק את רצון השואל בדבר; אין להמירו בבדיקת התאמה זוגית או משיכה הדדית.',
  }),

  'dispute.p212.reconciliationH1H7': knowledge({
    kashfMethodId: 'dispute.p212.reconciliationH1H7',
    page: 212,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'חזרת השביעי בבתים — מריבות, שותפות ומנצח ומנוצח',
    hebrewRule: 'אם מן הראשון והשביעי נולדת צורה מיטיבה, שניהם יתפייסו על ידי מי שמורה עליו הבית שבו שוכנת הצורה. אם בראשון צורת השמש — הפיוס בא מן השלטון; ואם בעשירי צורת צדק — מן הדיין; ואם בראשון צורה של נציב או ממונה — מן המושל.',
    supportingPages: [54, 57, 58, 59, 60, 133, 134],
    arabicVerificationPages: [212],
  }),

  'general.p174.h1h2h4h7h10h15': knowledge({
    kashfMethodId: 'general.p174.h1h2h4h7h10h15',
    page: 174,
    topic: 'השער השישי — דיני שנים־עשר הבתים; הפרק הראשון — הנפש',
    heading: 'היתדות, התקווה ובית ראשון האדם',
    hebrewRule: 'בבית הראשון האדם: אם שאלך אדם על הבית הראשון שלו, על אחריתו, על ממונו, על מסעותיו או על כלל ענייניו, התבונן לאחר השלמת ההכאה בבית הראשון — בית הנפש, שהוא התחלת כל דבר. אחר כך התבונן בשני — בית הממון; ברביעי — בית אחריתו ומקומו; בשביעי — בית כוונותיו ומבוקשיו; בעשירי — בית טובו ומעמדו; ובחמישה־עשר — בית אחרית עניינו.',
    arabicVerificationPages: [174],
    notes: 'זהו כלל מצב כללי תחום; אין להפעיל במקומו את כל חבילת generalReading הישנה.',
  }),

  'hidden.p188.quarterDirection': knowledge({
    kashfMethodId: 'hidden.p188.quarterDirection',
    page: 188,
    topic: 'הפרק הרביעי — הורים, נכסים ודברים נסתרים',
    heading: 'כיוון הדבר הנסתר',
    hebrewRule: 'לכיוון: חלק את המקום החשוד לארבעה חלקים, וערוך לכל כיוון צורה. אם יצאה צורה פנימית ומיטיבה — אותו מקום חשוד. ואם יצאה צורה מזיקה וחיצונית — אין באותו מקום דבר, עד שתשלים ארבע צורות.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [188],
    notes: 'השיטה מחייבת ארבע הטלות/צורות נוספות לפי ארבעת חלקי המקום; אין להסיק אותן מן הלוח הקיים.',
  }),

  'inheritance.p180.elementComposite': knowledge({
    kashfMethodId: 'inheritance.p180.elementComposite',
    page: 180,
    topic: 'הפרק השני — דיני הממון',
    heading: 'כספי הנשאל והשואל / ירושה ומחיה',
    hebrewRule: 'קח את אש החמישי, אוויר השישי, מי השביעי ועפר השני, והוצא מהם צורה. התבונן בצורה: אם היא מחלקו של השואל — אמור לו: אתה יורש אותו. ואם היא מחלקו של הנשאל עליו — אמור: הוא יורש אותך, והאל יודע.',
    supportingPages: [121, 122, 123, 124, 125, 126, 127, 128, 129],
    arabicVerificationPages: [180],
    notes: 'השיטה קובעת איזה צד יורש את האחר; היא אינה מחשבת חלקי ירושה או סכומים.',
  }),

  'lifespan.p178.elementCountToHouse': knowledge({
    kashfMethodId: 'lifespan.p178.elementCountToHouse',
    page: 178,
    topic: 'השער השישי — דיני שנים־עשר הבתים; הפרק הראשון — הנפש',
    heading: 'אורך חיי האדם / ומקום או מעבר',
    hebrewRule: 'כיצד אדע את שנותיי? הסר את הגורל, ואסוף את כל היסודות — אש, אוויר, מים ועפר. הפחת אותם בשש־עשרה, ומה שנותר הולך על פני הבתים. במקום שבו יסתיים החשבון, התבונן בצורה שעליה עמד: איזו צורה היא, ומה מספרה באותו בית. אם היא מן היתדות, מספרה הוא מספר השנים; אם היא מן הנטויים, מספרה הוא חודשים; ואם היא מן הנופלים, מספרה הוא ימים.',
    supportingPages: [43, 44, 45, 121, 122],
    arabicVerificationPages: [178],
  }),

  'lifespan.p264.stagesH11H9H7': knowledge({
    kashfMethodId: 'lifespan.p264.stagesH11H9H7',
    page: 264,
    topic: 'הפרק האחד־עשר — חברים, תקווה, אורך חיים ואהבה',
    heading: 'חברים, אהבה וחשק',
    hebrewRule: 'בדין החיים: הבית האחד־עשר מורה על ראשית החיים; התשיעי על האמצע; והשביעי על הסוף. דון לפי צורות הכוכבים המופיעות בבתים.',
    supportingPages: [133, 134],
    arabicVerificationPages: [264],
    notes: 'זהו דין שלבי החיים ואינו מחזיר מספר שנות חיים.',
  }),

  'love.p204.attentionFireRows1713': knowledge({
    kashfMethodId: 'love.p204.attentionFireRows1713',
    page: 204,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'פתיחת דיני הנישואין — האם אדם זה מביט אליך או אל אחר?',
    hebrewRule: 'האם אדם זה מביט אליך או אל אחר? אם אש הבית הראשון פתוחה, ואש הבית השביעי פתוחה, וגם אש הבית השלושה־עשר מתחברת — שניהם מביטים זה בזה וגם באחרים.',
    supportingPages: [54, 61],
    arabicVerificationPages: [204],
    notes: 'זהו כלל תשומת לב/מבט; הוא אינו שקול לשאלת אהבה.',
  }),

  'love.p205.directLoveH1PlacementH15': knowledge({
    kashfMethodId: 'love.p205.directLoveH1PlacementH15',
    page: 205,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'האם אדם זה אוהב אותך?',
    hebrewRule: 'האם אדם זה אוהב אותך? אם הצורה שבבית הראשון נמצאת ביתדות, יש לו רצון בך. אם היא בבתים הנופלים, הוא מתרחק ומבקש אחר. התבונן גם בבית החמישה־עשר ביחס לצורת הבית הראשון: אם היחס רע, אין בו אהבה; ואם הוא תחת ידך, הדבר קרוב יותר.',
    supportingPages: [43, 44, 45],
    arabicVerificationPages: [205],
  }),

  'marriage.p210.generalMarriageH1H2H7H8H10Judge': knowledge({
    kashfMethodId: 'marriage.p210.generalMarriageH1H2H7H8H10Judge',
    page: 210,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'כלל מעשי בנישואין',
    hebrewRule: 'עשה את הבית הראשון והשני לסימני האיש והנישואין, ואת הבית השביעי והשמיני לסימני האישה. הבית העשירי מורה על מה שיתרחש ביניהם, והדיין מורה על אחרית עניינם. אם הראשון מיטיב, האיש טוב לה ומיטיב עמה. אם הראשון מזיק והשביעי מיטיב, הרי היא טובה ממנו. אם המכריע מיטיב, אחרית עניינם טובה, יפה ושמחה. לאחר מכן הוצא צורה מן הראשון והחמישי, ודון במה שיצא, לטוב או להפך.',
    detailPages: [211],
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [210, 211],
    notes: 'זהו דין הנישואין הכללי; אין להחליפו בנוסחת הרצון שבעמוד 206.',
  }),

  'marriage.p211.dissolutionH7StateMatrix': knowledge({
    kashfMethodId: 'marriage.p211.dissolutionH7StateMatrix',
    page: 211,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'אופני הבית השביעי — פנימי, חיצוני, קבוע ומתַהפך',
    hebrewRule: 'בבית השביעי: אם שכנו בו צורות פנימיות, הדבר מורה על יישוב הדעת ועל קיום מצב הנישואין. צורה מזיקה פנימית מורה על עגמת נפש ומריבה, אבל החלק קבוע. צורה מיטיבה חיצונית מורה על נישואין טובים אך אפשר שייפרד ממנה, מפני שהחלק אינו קבוע. צורה מזיקה חיצונית מורה שאין כאן נישואין ראויים, ואם כבר היו — החלק נחתך ונפסק. צורה מיטיבה וקבועה מורה על תיקון בית המשכב.',
    detailPages: [210, 211],
    supportingPages: [57, 58, 59, 60],
    arabicVerificationPages: [210, 211],
    notes: 'יש לשמר את מטריצת מצב הצורה ולא לצמצם אותה למיטיב/מזיק בלבד.',
  }),

  'matter.p172.h17_h1011_thenCombine': knowledge({
    kashfMethodId: 'matter.p172.h17_h1011_thenCombine',
    page: 172,
    topic: 'השער השישי — דיני שנים־עשר הבתים; הפרק הראשון — הנפש',
    heading: 'תוצאת עניין השואל / ובתי היחיד והזוג',
    hebrewRule: 'הוצא צורה מן הבית הראשון והשביעי, וצורה נוספת מן העשירי והאחד־עשר. אחר כך צרף אותן; הצורה היוצאת מהן היא תוצאת עניינו של השואל — לטוב או לרע.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [172],
    notes: 'שיטה זו נפרדת משיטת השלמת העניין בעמוד 173.',
  }),

  'messenger.p176.recast14511': knowledge({
    kashfMethodId: 'messenger.p176.recast14511',
    page: 176,
    topic: 'השער השישי — דיני שנים־עשר הבתים; הפרק הראשון — הנפש',
    heading: 'בית השנים־עשר, משרתים / ושליחות',
    hebrewRule: 'באחרית שליחים: העמד את הראשון, הרביעי, החמישי והאחד־עשר כאמהות, והשלים את גורל החול. הסתמך על החמישי ועל היתדות; אם הן מיטיבות, הבקשה תיענה, ואם לא — לא.',
    supportingPages: [28, 29, 30, 31, 32, 33, 34, 35, 36, 54, 57, 58, 59, 60],
    arabicVerificationPages: [176],
    notes: 'זהו כלל שליחות. אין להעתיק אותו לשאלת שמחה/אירוע ללא מקור.',
  }),

  'missing.p248-249.lifeH1H4H9Outcome': knowledge({
    kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',
    page: 251,
    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',
    heading: 'הגעת הנעדר ושובו',
    hebrewRule: 'אם הראשון, הרביעי, התשיעי והסוף מיטיבים, הרי הנעדר חי. אם נמצאו בשישי, בשביעי, בשמיני ובסוף צורות המוות המנויות במקור — קהלה, חיבור, דרך, סוהר, שפל ראש, אדום או לבן — הדבר משמש עדות קשה בדין חייו של הנעדר.',
    detailPages: [250, 251],
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [250, 251],
    notes: 'מזהה השיטה נשמר לשם תאימות לאחור, אך ביקורת v57 תיקנה את עקיבות העמודים: הכלל התפעולי הזה נמצא בעמודים 250–251, לא 248–249.',
  }),

  'missing.p249.returnAnglesJudge': knowledge({
    kashfMethodId: 'missing.p249.returnAnglesJudge',
    page: 249,
    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',
    heading: 'מצב הנעדר ומרחקו',
    hebrewRule: 'אם בבתים היתדיים נמצאו צורות מיטיבות פנימיות בעניין נעדר, בורח, אבדה או גניבה — הדבר מורה על חזרת הזכרים, כאשר גם המכריע מעיד לכך.',
    supportingPages: [43, 44, 45, 54, 57, 58, 59, 60],
    arabicVerificationPages: [249],
    notes: 'הכלל עוסק בשיבה כאשר היתדות והכרעת הסוף מעידות לכך; הוא אינו מחשב מועד חזרה.',
  }),

  'money.p179.sourceByIncomingHonorHouse': knowledge({
    kashfMethodId: 'money.p179.sourceByIncomingHonorHouse',
    page: 179,
    topic: 'הפרק השני — דיני הממון',
    heading: 'הפרק השני — דיני הממון',
    hebrewRule: 'אם בשני יש בה צד מיטיב, בקש את כבוד נכנס; במקום שבו הוא נמצא, הממון יגיע מטבע אותו בית שבו הוא שורה. ואם עלתה צורת ממון נכנס בבית הממון, כל בית שבו נמצאת הצורה הזאת ייתן דין על השגת הממון.',
    supportingPages: [43, 46, 47, 54, 57, 58, 59, 60],
    arabicVerificationPages: [179],
  }),

  'money.p180.livelihoodH10Invert': knowledge({
    kashfMethodId: 'money.p180.livelihoodH10Invert',
    page: 180,
    topic: 'הפרק השני — דיני הממון',
    heading: 'כספי הנשאל והשואל / ירושה ומחיה',
    hebrewRule: 'במחיה: התבונן בעשירי. כל מה שבצורותיו פתוח — סתום; וכל מה שסתום — פתח. התבונן איזו צורה יוצאת. אם הצורה עוברת לבית יתד והיא צורה מיטיבה, המחיה מתרחבת; ואם היא נופלת, אינה טובה.',
    supportingPages: [43, 44, 45, 54, 57, 58, 59, 60],
    arabicVerificationPages: [180],
  }),

  'money.p181.recast25811': knowledge({
    kashfMethodId: 'money.p181.recast25811',
    page: 181,
    topic: 'הפרק השני — דיני הממון',
    heading: 'ממון — האם יושג? / ומקור נוסף על צד הממון',
    hebrewRule: 'בדין הממון: העמד את השני, החמישי, השמיני והאחד־עשר כאמהות, והשלים את גורל החול. אם ראית שהיתדות והבית השני פנימיים, הממון יושג.',
    supportingPages: [28, 29, 30, 31, 32, 33, 34, 35, 36, 57, 58, 59, 60],
    arabicVerificationPages: [181],
    notes: 'שיטת 2/5/8/11 היא שיטת לוח חדש; שיטת הזוג/יחיד של 2/6/8/10 באותו עמוד היא חלופה נפרדת ואינה מצביעה יחד איתה.',
  }),

  'mother.p257.statusDayNight': knowledge({
    kashfMethodId: 'mother.p257.statusDayNight',
    page: 257,
    topic: 'הפרק העשירי — כבוד, שררה ומינוי',
    heading: 'קיום השררה, דין האם ודין המלכות',
    hebrewRule: 'בדין האם: אם מן בית זה יוצא מזיק, דון לה לרע; ואם היא מיטיבה — לטוב. אם לבן או דרך נמצאים באחד היתדות או במה שסמוך להן, דון לה לטוב ולתיקון. אם הן בבתים הנופלים, דון לה לצרות. דין זה נאמר כשזמן השאלה בלילה; ואם ביום — ראה את צורות נוגה ודון על פיהן.',
    supportingPages: [43, 44, 45, 54, 57, 58, 59, 60, 133, 134],
    arabicVerificationPages: [257],
    notes: 'נשמר ניסוח v57 “בית זה” בלי להמציא בית שלא ננקב בקטע; המבצע יישאר ממתין עד שסגירת ההקשר תושלם.',
  }),

  'pregnancy.p191.childSafetyH1H6H8': knowledge({
    kashfMethodId: 'pregnancy.p191.childSafetyH1H6H8',
    page: 191,
    topic: 'הפרק החמישי — ילדים והריון',
    heading: 'פתיחת דיני הילדים וההריון',
    hebrewRule: 'אם בבית הראשון נמצאת צורה מיטיבה, הוולד יינצל ויהיה בשלום. ואם נמצאת בו צורה מזיקה, יש לחשוש עליו. ואם בשישי ובשמיני נמצאות צורות מזיקות, הוולד עלול לצאת מת.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [191],
    notes: 'H1 הוא עדות הבטיחות הבסיסית; H6+H8 המזיקים הם תנאי החומרה. אין לספור אותם כהצבעות בלתי תלויות.',
  }),

  'pregnancy.p191.deliveryDifficultyH1H5H15': knowledge({
    kashfMethodId: 'pregnancy.p191.deliveryDifficultyH1H5H15',
    page: 191,
    topic: 'הפרק החמישי — ילדים והריון',
    heading: 'פתיחת דיני הילדים וההריון — קלות וקושי הלידה',
    hebrewRule: 'אם הראשון והחמישי זכריים, הוולד זכר והלידה קלה ליולדת, בפרט אם הצורות מתהפכות. אם החמישי צורה קבועה, הלידה קשה ואינה נשלמת בקלות, לפי עדות הראשון והחמישה־עשר.',
    detailPages: [194],
    supportingPages: [57, 58, 59, 60],
    arabicVerificationPages: [191, 194],
    notes: 'עמוד 194 מספק חומר מאשש על כובד/טובת H5; הוא אינו שיטת הצבעה חלופית.',
  }),

  'religion.p253.h3h9Quality': knowledge({
    kashfMethodId: 'religion.p253.h3h9Quality',
    page: 253,
    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',
    heading: 'הנעדר לפי אל־זנאתי; דת וצדקות',
    hebrewRule: 'בדין הדת והצדקות: אם בבית השלישי והתשיעי יש צורה מזיקה — הוא מועט בדת. ואם יש שם צורה מיטיבה — הוא בעל דת ויראת אלוהים.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [253],
    notes: 'זהו דין מצומצם על הדת/הצדקות לפי H3 ו-H9, לא מענה לשאלות אמונה או ייעוץ רוחני כללי.',
  }),

  'relocation.p183.currentVsNewPlace': knowledge({
    kashfMethodId: 'relocation.p183.currentVsNewPlace',
    page: 183,
    topic: 'הפרק השלישי — אחים ומעבר',
    heading: 'מעבר ממקום למקום',
    hebrewRule: 'במעבר — האם מקום זה טוב לי או לא? התבונן בראשון וברביעי. אם שניהם מיטיבים, דון בטובת המגורים. ואם השביעי והעשירי צורות מיטיבות, דון בטובת המעבר.',
    supportingPages: [43, 46, 47, 54, 57, 58, 59, 60],
    arabicVerificationPages: [183],
    notes: 'H1+H4 מייצגים את המקום הנוכחי ו-H7+H10 את המקום שאליו עוברים; אין להפוך זאת להצבעה כללית של ארבעה בתים.',
  }),

  'relocation.p183.stayMoveH1H2': knowledge({
    kashfMethodId: 'relocation.p183.stayMoveH1H2',
    page: 183,
    topic: 'הפרק השלישי — אחים ומעבר',
    heading: 'מעבר ממקום למקום — הישיבה במקום או המעבר ממנו',
    hebrewRule: 'אם שאלך אדם האם הישיבה בעיר זו טובה לו או המעבר ממנה, השלם את לוח הגורל. אם בראשון יצאה צורה מיטיבה ובשני צורה מזיקה — המקום שבו הוא נמצא טוב לו. אם בראשון מזיק ובשני מיטיב — הדין להפך.',
    supportingPages: [178],
    arabicVerificationPages: [178, 183],
  }),

  'siblings.p182.seniority': knowledge({
    kashfMethodId: 'siblings.p182.seniority',
    page: 182,
    topic: 'הפרק השלישי — אחים ומעבר',
    heading: 'הפרק השלישי — באחים ובמעבר',
    hebrewRule: 'הצורה קהלה מורה על הגדולים, ובייחוד הגדולים מצד האב. וכן שפל ראש.',
    arabicVerificationPages: [182],
    notes: 'זהו דין ותק/בכורה בין האחים, והוא נפרד מדין הסכמה או קלקול היחסים בין אחים.',
  }),

  'spiritual.p167.hiddenActionAirRows46815': knowledge({
    kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
    page: 167,
    topic: 'השער השישי — דיני שנים־עשר הבתים; הפרק הראשון — הנפש',
    heading: 'כלל מעשי: האם יש פעולה מאחורי הדבר?',
    hebrewRule: 'אם אמר לך השואל: האם מאחורי הדבר יש פעולה או לא? קח את אוויר הרביעי, אוויר השישי, אוויר השמיני ואוויר המאזן; העמד מהם צורה. אם יצאה צורה מזיקה, הרי הפעולה מאחוריו; ואם לא — לא.',
    supportingPages: [54, 61],
    arabicVerificationPages: [167],
    notes: '“המאזן” הוא בית הדין/המאזן בהקשר הלוח. השיטה בודקת פעולה נסתרת מאחורי המצב; היא אינה כשלעצמה אבחנת כישוף, ג׳ין או עין הרע.',
  }),

  'travel.p239.profitEarthRowH2': knowledge({
    kashfMethodId: 'travel.p239.profitEarthRowH2',
    page: 239,
    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',
    heading: 'רווח במסע — ים או יבשה',
    hebrewRule: 'אם נשאלת אם הנוסע ירוויח במסעו, קח את שורת יסוד העפר של הנקודה, והכה אותה עם הבית השני. אם יצאה צורה מיטיבה — ירוויח במסעו; אם יצאה ממוזגת — ירוויח רווח מועט ונעים; ואם יצאה צורה מזיקה — אין בו טובה.',
    supportingPages: [54, 61],
    arabicVerificationPages: [239],
    verificationNotes: 'הביטוי המגדיר את קלט “עפר הנקודה/האזור” אינו סגור דיו לביצוע קנוני. הידע העברי נשמר, אך השיטה אינה source-ready להפעלה עד סגירת הקלט המדויק.',
    notes: 'אין להמציא איזו נקודה נלקחת; המבצע נשאר חסום.',
  }),

  'travel.p239.seaOrLandByElement': knowledge({
    kashfMethodId: 'travel.p239.seaOrLandByElement',
    page: 239,
    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',
    heading: 'רווח במסע — ים או יבשה',
    hebrewRule: 'אם נשאלת אם המסע יהיה בים או ביבשה, התבונן בצורה היוצאת משתי הצורות: אם היא מיסוד האש — אמור שילך ביבשה; אם היא מיסוד האוויר — אמור שילך בים וישוב ביבשה; אם היא מיסוד המים — ילך בים וישוב בים; ואם היא מיסוד העפר — ילך ביבשה וישוב ביבשה.',
    supportingPages: [61, 62],
    arabicVerificationPages: [239],
    verificationNotes: 'פער נוסח פעיל: v57 העברי אומר באש רק “ילך ביבשה”, ואילו המקור הערבי המאומת מוסיף חזרה בים. בנוסף בניית “שתי הצורות” תלויה בקלט הקודם שאינו סגור. אין להפעיל עד תיקון/הכרעה מפורשים ב-v57.',
    notes: 'העברית נשמרת בדיוק כשכבת הידע; הפער מול הערבית מסומן ולא מתוקן בשקט.',
  }),

  'travel.p244.returnH1H2H9': knowledge({
    kashfMethodId: 'travel.p244.returnH1H2H9',
    page: 244,
    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',
    heading: 'סימני פגם במרכבה והחזרה מן המסע',
    hebrewRule: 'כלל לנוסע: התבונן בראשון, בשני ובתשיעי. אם נמצאו בהם צורות מיטיבות המורות על כניסה, ובפרט במקומות הראויים, ישוב אל ארצו בטוב ובשמחה. ואם נמצאו בהם צורות מזיקות, יתייגע במסעו, ולעיתים לא ישוב.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [244],
  }),

  'well.p188.recast1468': knowledge({
    kashfMethodId: 'well.p188.recast1468',
    page: 188,
    topic: 'הפרק הרביעי — הורים, נכסים ודברים נסתרים',
    heading: 'האם הדבר במקומו? / חפירת בארות ועומק המים',
    hebrewRule: 'בחפירת בארות ותעלות: עשה את הראשון, הרביעי, השישי והשמיני לאמהות, והשלים את גורל החול. אם הרביעי והיתדות מיטיבים ופנימיים — המבוקש מתקבל.',
    supportingPages: [28, 29, 30, 31, 32, 33, 34, 35, 36, 54, 57, 58, 59, 60],
    arabicVerificationPages: [188],
    notes: 'יש לבנות לוח חדש מן H1/H4/H6/H8. חישוב עומק המים הוא כוונה נפרדת ואינו חלק מפסק זה.',
  }),`;

knowledge = replaceOnce(
  knowledge,
  "  'theft.p225.thiefDescriptionH7': knowledge({",
  entries + "\n\n  'theft.p225.thiefDescriptionH7': knowledge({",
  'insert v57 pending/source-aware entries'
);

knowledge = replaceOnce(
  knowledge,
  "export function validateKashfV57KnowledgeCoverage(methodRegistry) {\n  const errors = [];\n  const runnable = Object.values(methodRegistry || {}).filter((method) =>\n    method?.methodRole === 'canonical-operational'\n      && method?.kashfRuntimeStatus === 'ready'\n      && method?.runtimeAllowed === true\n      && method?.executorStatus === 'ready'\n  );\n\n  for (const method of runnable) {",
  "export function validateKashfV57KnowledgeCoverage(methodRegistry) {\n  const errors = [];\n  const sourceReady = Object.values(methodRegistry || {}).filter((method) =>\n    method?.methodRole === 'canonical-operational'\n      && method?.kashfRuntimeStatus === 'ready'\n  );\n  const runnable = sourceReady.filter((method) => method?.runtimeAllowed === true && method?.executorStatus === 'ready');\n\n  for (const method of sourceReady) {",
  'coverage filter source-ready'
);
knowledge = replaceOnce(
  knowledge,
  "    runnableCount: runnable.length,\n    coveredCount: runnable.filter((method) => hasKashfV57Knowledge(method.kashfMethodId)).length,",
  "    sourceReadyCount: sourceReady.length,\n    runnableCount: runnable.length,\n    coveredCount: sourceReady.filter((method) => hasKashfV57Knowledge(method.kashfMethodId)).length,",
  'coverage counters'
);
fs.writeFileSync(knowledgePath, knowledge);

let methods = fs.readFileSync(methodPath, 'utf8');
function patchMethodStatus(id, fromStatus, toStatus, noteText) {
  const start = methods.indexOf(`  '${id}': method({`);
  if (start < 0) throw new Error(`Method not found: ${id}`);
  const end = methods.indexOf('\n  }),', start);
  if (end < 0) throw new Error(`Method block end not found: ${id}`);
  let block = methods.slice(start, end + 6);
  block = replaceOnce(block, `kashfRuntimeStatus: '${fromStatus}'`, `kashfRuntimeStatus: '${toStatus}'`, `${id} status`);
  if (noteText) block = block.replace(/notes: '[^']*',/, `notes: '${noteText.replaceAll("'", "\\'")}',`);
  methods = methods.slice(0, start) + block + methods.slice(end + 6);
}
patchMethodStatus('joy.p196.recast14511', 'ready', 'blocked-by-source', 'v57 p196 is the illness/lost-item/animals chapter and does not contain the 1,4,5,11 joy/event recast. The known celebrations helper is sourced from an external PDF, not Kashf. Do not execute or backfill it as a Kashf method until a real v57 source method is identified.');
patchMethodStatus('travel.p239.profitEarthRowH2', 'ready', 'blocked-by-source', 'v57 preserves the profit rule, but the exact source input denoted by the earth row of the point/area is not sufficiently resolved for canonical construction. Hebrew knowledge is indexed; runtime remains source-blocked until the input is closed.');
patchMethodStatus('travel.p239.seaOrLandByElement', 'ready', 'blocked-by-source', 'v57 preserves the sea/land element mapping, but the preceding two-figure construction is unresolved and the Hebrew fire branch omits the Arabic return-by-sea clause. Runtime remains source-blocked until v57 is explicitly corrected/closed.');

const missingStart = methods.indexOf("  'missing.p248-249.lifeH1H4H9Outcome': method({");
if (missingStart < 0) throw new Error('Missing-person life method not found');
const missingEnd = methods.indexOf('\n  }),', missingStart);
let missingBlock = methods.slice(missingStart, missingEnd + 6);
missingBlock = replaceOnce(missingBlock, 'sourcePages: [248, 249]', 'sourcePages: [250, 251]', 'missing life source pages');
missingBlock = missingBlock.replace(/notes: '[^']*',/, "notes: 'v57 audit correction: the selected body-source life/death rule is operationally located on pp250-251. The historical method id is retained for compatibility. H1/H4/H9/outcome support life; the named severe/death-sign conditions occur in H6/H7/H8/outcome. Do not use the later al-Multaqat 3/5/9 recurrence method.',");
methods = methods.slice(0, missingStart) + missingBlock + methods.slice(missingEnd + 6);
fs.writeFileSync(methodPath, methods);

let routes = fs.readFileSync(routePath, 'utf8');
function patchRouteStatusForMethod(methodId, toStatus) {
  const re = new RegExp(`(kashfMethodId: '${methodId.replaceAll('.', '\\.')}',\\n\\s*kashfRuntimeStatus: )'ready'`, 'g');
  const before = routes;
  routes = routes.replace(re, `$1'${toStatus}'`);
  if (routes === before) throw new Error(`No route status patched for ${methodId}`);
}
patchRouteStatusForMethod('joy.p196.recast14511', 'blocked-by-source');
patchRouteStatusForMethod('travel.p239.profitEarthRowH2', 'blocked-by-source');
patchRouteStatusForMethod('travel.p239.seaOrLandByElement', 'blocked-by-source');
routes = routes.replace(
  'Provenance correction: the prior 3/5/9 recurrence method is in the later al-Multaqat addition. This route now points to the selected body-source life/death method from p248-p249.',
  'v57 provenance correction: the prior 3/5/9 recurrence method is in the later al-Multaqat addition. The selected body-source life/death material is on pp250-251; the historical method id is retained for compatibility.'
);
fs.writeFileSync(routePath, routes);

let tests = fs.readFileSync(testPath, 'utf8');
tests = replaceOnce(
  tests,
  "  assert(result.valid, `every runnable canonical method has v57 Hebrew knowledge: ${result.errors.join('; ')}`);\n  assert(result.coveredCount === result.runnableCount, `v57 runnable coverage ${result.coveredCount}/${result.runnableCount}`);\n  assert(result.runnableCount > 0, 'v57 coverage gate sees runnable canonical methods');",
  "  assert(result.valid, `every source-ready canonical method has v57 Hebrew knowledge: ${result.errors.join('; ')}`);\n  assert(result.coveredCount === result.sourceReadyCount, `v57 source-ready coverage ${result.coveredCount}/${result.sourceReadyCount}`);\n  assert(result.sourceReadyCount > 0, 'v57 coverage gate sees source-ready canonical methods');\n  assert(result.runnableCount > 0, 'v57 coverage gate still sees runnable canonical methods');",
  'test source-ready coverage gate'
);
const regression = `\nconst p239SeaLandV57 = getKashfV57Knowledge('travel.p239.seaOrLandByElement');\nassert(p239SeaLandV57?.knowledgeLanguage === 'he', 'p239 sea/land has Hebrew v57 knowledge despite runtime source block');\nassert(p239SeaLandV57?.arabicVerification?.notes?.includes('פער נוסח'), 'p239 sea/land records Hebrew/Arabic source discrepancy');\nassert(getKashfMethod('travel.p239.seaOrLandByElement')?.kashfRuntimeStatus === 'blocked-by-source', 'p239 sea/land is not mislabeled source-ready while derivation/discrepancy remain open');\nassert(getKashfMethod('travel.p239.profitEarthRowH2')?.kashfRuntimeStatus === 'blocked-by-source', 'p239 profit is not mislabeled source-ready while earth-row input remains unresolved');\nassert(getKashfMethod('joy.p196.recast14511')?.kashfRuntimeStatus === 'blocked-by-source', 'joy p196 false source mapping is blocked');\nassert(getKashfV57Knowledge('joy.p196.recast14511') === null, 'false p196 joy mapping is not fabricated into v57 Hebrew knowledge');\nassert(JSON.stringify(getKashfMethod('missing.p248-249.lifeH1H4H9Outcome')?.sourcePages) === JSON.stringify([250, 251]), 'missing-person life/death source pages corrected to v57 pp250-251');\n`;
tests = replaceOnce(tests, "const professionV57 = getKashfV57Knowledge('profession.p254.h9Planet');", regression + "\nconst professionV57 = getKashfV57Knowledge('profession.p254.h9Planet');", 'insert v57 correction regressions');
fs.writeFileSync(testPath, tests);

let wf = fs.readFileSync(workflowPath, 'utf8');
if (!wf.includes("kashf-v57-knowledge-registry.js")) {
  wf = replaceOnce(
    wf,
    "      - 'goral-hachol/registry/kashf-canonical-method-registry.js'\n",
    "      - 'goral-hachol/registry/kashf-canonical-method-registry.js'\n      - 'goral-hachol/registry/kashf-v57-knowledge-registry.js'\n",
    'workflow v57 knowledge trigger'
  );
  fs.writeFileSync(workflowPath, wf);
}

const report = `# Kashf v57 — Source-ready Hebrew Knowledge Backfill\n\n## Goal\nExtend the v57 Hebrew operational-primary knowledge layer from runnable methods to every canonical method whose source status is genuinely ready, before adding more executors. Arabic remains verification-only.\n\n## Corrections found while backfilling\n\n1. **joy.p196.recast14511 was falsely source-ready.** v57 p196 belongs to the illness/lost-item/animals chapter and does not contain the 1/4/5/11 joy/event recast. The known celebrations helper is external, so the Kashf route is now blocked-by-source rather than fabricating a v57 entry.\n2. **travel.p239.profitEarthRowH2 was falsely source-ready.** The Hebrew rule is indexed, but the exact earth-row input is unresolved; it is now blocked-by-source.\n3. **travel.p239.seaOrLandByElement was falsely source-ready.** The preceding two-figure construction is unresolved, and v57 omits the Arabic fire-branch return-by-sea clause. The Hebrew text is preserved with explicit verification metadata and the method is blocked-by-source.\n4. **missing-person life/death page traceability was stale.** The selected operational rule is in v57 pp250-251; the historical method id is retained for compatibility, but sourcePages are corrected.\n\n## Permanent contract\n\n- Every method with methodRole=canonical-operational and kashfRuntimeStatus=ready must have a v57 Hebrew knowledge entry, even while executorStatus is pending.\n- Runnable methods still require runtimeAllowed=true and executorStatus=ready.\n- Blocked-by-source methods may have Hebrew knowledge for AI context, but that knowledge never authorizes runtime execution.\n- Source discrepancies are recorded rather than silently repaired from Arabic.\n- The canonical routing CI now triggers when kashf-v57-knowledge-registry.js changes.\n`;
fs.writeFileSync(reportPath, report);

for (const cmd of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const r = spawnSync(cmd[0], cmd[1], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('v57 source-ready Hebrew knowledge backfill applied successfully.');
