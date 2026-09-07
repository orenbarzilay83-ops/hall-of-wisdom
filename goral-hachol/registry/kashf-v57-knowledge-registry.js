/**
 * kashf-v57-knowledge-registry.js
 *
 * Hebrew operational knowledge for the canonical Kashf runtime.
 *
 * Source policy:
 * - v57 Hebrew is the operational-primary knowledge layer exposed to the AI.
 * - kashf-v57-topic-index.html is the navigation layer into v57.
 * - The Arabic book remains verification-only and must not replace the Hebrew
 *   operational context returned to the AI.
 * - Every runnable canonical method must have an entry here. Missing v57
 *   knowledge is a runtime hard stop.
 */

const V57_VERSION = 'v57';
const V57_INDEX_FILE = 'kashf-v57-topic-index.html';
const V57_DRAFT_FILE = 'kashf-v57-draft.html';

function knowledge({
  kashfMethodId,
  page,
  topic,
  heading,
  hebrewRule,
  detailPages = [],
  supportingPages = [],
  arabicVerificationPages = [],
  notes = null,
}) {
  return Object.freeze({
    kashfMethodId,
    knowledgeLanguage: 'he',
    knowledgeRole: 'operational-primary',
    v57: Object.freeze({
      version: V57_VERSION,
      indexFile: V57_INDEX_FILE,
      draftFile: V57_DRAFT_FILE,
      page,
      anchor: `#p${page}`,
      topic,
      heading,
      hebrewRule,
      detailPages: Object.freeze([...detailPages]),
      supportingPages: Object.freeze([...supportingPages]),
    }),
    arabicVerification: Object.freeze({
      role: 'verification-only',
      pages: Object.freeze([...arabicVerificationPages]),
    }),
    notes,
  });
}

export const KASHF_V57_KNOWLEDGE = Object.freeze({
  'completion.p173.fireRows15910': knowledge({
    kashfMethodId: 'completion.p173.fireRows15910',
    page: 173,
    topic: 'השער השישי — דיני שנים־עשר הבתים; הפרק הראשון — הנפש',
    heading: 'ממון, ידידות והשלמת העניין',
    hebrewRule: 'האם העניין יושלם? קח את ראש הראשון, החמישי, התשיעי והעשירי, והעמד מהם צורה. אם יצאה חיצונית — העניין לא יושלם; ואם יצאה פנימית — יושלם.',
    arabicVerificationPages: [173],
    notes: 'הדרך החלופית מן הראשון והשישה־עשר נשארת מחוץ לפסק הקנוני הזה.',
  }),

  'relocation.p183.h4h15': knowledge({
    kashfMethodId: 'relocation.p183.h4h15',
    page: 183,
    topic: 'הפרק השלישי — אחים ומעבר',
    heading: 'מעבר ממקום למקום',
    hebrewRule: 'למעבר ממקום למקום: העמד צורה מן הרביעי והחמישה־עשר. אם היא מיטיבה — דון שהמקום ההוא טוב ומבורך. אם היא מזיקה — דון במזיק המקום, בקושי ובעמל. ואם היא ממוזגת — דון שהמקום ממוצע.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [183],
  }),

  'siblings.p182.h1h3': knowledge({
    kashfMethodId: 'siblings.p182.h1h3',
    page: 182,
    topic: 'הפרק השלישי — אחים ומעבר',
    heading: 'הפרק השלישי — באחים ובמעבר',
    hebrewRule: 'הולד צורה מן הראשון והשלישי: אם יצאה מיטיבה, היא מורה על הסכמתם; ואם מזיקה, היא מורה על קלקול מידותיהם.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [182],
    notes: 'הולדות נוספות מן החמישי והשלישי ומן החמישי והשלושה־עשר אינן חלק מן השיטה הקנונית הזאת.',
  }),

  'travel.p238.assemble1359': knowledge({
    kashfMethodId: 'travel.p238.assemble1359',
    page: 238,
    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',
    heading: 'כלל מעשי במסע לפי שורות היסודות',
    hebrewRule: 'קח את שורת יסוד האש של הראשון, השלישי, החמישי והתשיעי. אם היא זוגית — עשה אותה שתי נקודות; ואם היא יחידית — נקודה אחת. עשה כך גם בשורת יסוד האוויר, המים והעפר, והוצא מן הכול צורה. אם היא מיטיבה — המסע נאה; ואם היא מזיקה — היזהר מן המסע.',
    supportingPages: [54, 61],
    arabicVerificationPages: [238],
  }),

  'illness.p196.outcomeH15': knowledge({
    kashfMethodId: 'illness.p196.outcomeH15',
    page: 196,
    topic: 'הפרק השישי — החולה, האבדה והבהמות',
    heading: 'דין החולה',
    hebrewRule: 'אם בחמישה־עשר צורה מיטיבה, הוא יתרפא. ואם היא מזיקה, המחלה תתארך.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [196],
    notes: 'הכלל אינו אומר שמזיק בבית 15 שולל החלמה עתידית או מורה לבדו על מוות; ממוזג נשאר ללא הכרעה.',
  }),

  'illness.bodyPart.h6Figure': knowledge({
    kashfMethodId: 'illness.bodyPart.h6Figure',
    page: 199,
    topic: 'הפרק השישי — החולה, האבדה והבהמות',
    heading: 'תוצאת ההכאה בחולה ושיבוץ איברי הגוף',
    hebrewRule: 'בשיבוץ איברי הגוף: השלם את מערך גורל החול, והתבונן בבית השישי ובצורה שנפלה בו. לפי הצורה תדע באיזה איבר החולי עצמו.',
    detailPages: [199],
    arabicVerificationPages: [199],
    notes: 'טבלת הצורה־לאיבר שבעמוד 199 היא חלק מן הידע התפעולי של שיטה זו.',
  }),

  'pregnancy.p191.genderH5': knowledge({
    kashfMethodId: 'pregnancy.p191.genderH5',
    page: 191,
    topic: 'הפרק החמישי — ילדים והריון',
    heading: 'פתיחת דיני הילדים וההריון',
    hebrewRule: 'אם הצורה בבית החמישי זכרית — הוולד זכר; ואם היא נקבית — הוולד נקבה.',
    supportingPages: [59, 60],
    arabicVerificationPages: [191],
    notes: 'צורות שאינן מוכרעות בזכר/נקבה לפי הסיווג המשמש בכלל זה נשארות ללא הכרעה; שיטות מין נוספות בעמודים הבאים אינן מצביעות לתוך שיטה זו.',
  }),

  'pregnancy.p191.existsH5SilentEmpty': knowledge({
    kashfMethodId: 'pregnancy.p191.existsH5SilentEmpty',
    page: 191,
    topic: 'הפרק החמישי — ילדים והריון',
    heading: 'פתיחת דיני הילדים וההריון',
    hebrewRule: 'אם בבית החמישי נמצאת צורה שותקת — ההריון נכון. ואם נמצאת בו צורה ריקה — ההריון בטל.',
    supportingPages: [57, 58, 59, 60],
    arabicVerificationPages: [191],
    notes: 'אין להחליף את סיווג שותקת/ריקה בסיווג מיטיב/מזיק.',
  }),

  'hidden.p188.isStillThere': knowledge({
    kashfMethodId: 'hidden.p188.isStillThere',
    page: 188,
    topic: 'הפרק הרביעי — הורים, נכסים ודברים נסתרים',
    heading: 'האם הדבר במקומו? / חפירת בארות ועומק המים',
    hebrewRule: 'בדבר הנסתר — האם הוא במקומו או לא? התבונן בבית הראשון, בשני, בבית הדבר הנסתר — הוא הרביעי — ובשלושה־עשר, בארבעה־עשר ובחמישה־עשר. אם הצורות מיטיבות, הרי הדבר שם. ואם אינן מיטיבות — אינו שם.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [188],
    notes: 'אין כלל רוב: כל הבתים הנדרשים חייבים לעמוד בתנאי המפורש. הכלל מניח דבר נסתר שכבר נשאל עליו ואינו מוכיח קיום מטמון מאפס.',
  }),

  'lostItem.p202.returnH6H8': knowledge({
    kashfMethodId: 'lostItem.p202.returnH6H8',
    page: 202,
    topic: 'הפרק השישי — החולה, האבדה והבהמות',
    heading: 'האבדה, מום הבהמה וסימני אובדן החולה',
    hebrewRule: 'באבדה ובשיבתה: כוון אל הבית השמיני והשישי. אם נמצאו שם צורות מיטיבות פנימיות — האבדה תשוב; ואם לא — לא.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [202],
    notes: 'גם בית 6 וגם בית 8 חייבים להיות מיטיבים ופנימיים; אין ענף אמצעי לא־מקורי.',
  }),

  'marriage.p204.dowryH8': knowledge({
    kashfMethodId: 'marriage.p204.dowryH8',
    page: 204,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'פתיחת דיני הנישואין',
    hebrewRule: 'צורה מיטיבה בבית השמיני מורה על מוהר גדול.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [204],
    notes: 'המשפט הסמוך על מיטיב/מזיק בבית העשירי שייך למעמד המשפחה; אין להסיק ממנו שמזיק בבית 8 פירושו מוהר קטן.',
  }),

  'marriage.p204.previousStatusH7inH10': knowledge({
    kashfMethodId: 'marriage.p204.previousStatusH7inH10',
    page: 204,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'פתיחת דיני הנישואין',
    hebrewRule: 'אם השביעי נמצא בעשירי והצורה מתהפכת — היא גרושה; ואם היא קבועה — בתולה.',
    supportingPages: [57, 58, 59, 60],
    arabicVerificationPages: [204],
    notes: 'ללא מציאת/חזרת השביעי בעשירי אין הכרעה בכלל זה; המקור אינו מוסיף כאן אלמנה.',
  }),

  'authority.p256.honorConditionH10Planet': knowledge({
    kashfMethodId: 'authority.p256.honorConditionH10Planet',
    page: 256,
    topic: 'הפרק העשירי — כבוד, שררה ומינוי',
    heading: 'פתיחת דיני כבוד ושררה',
    hebrewRule: 'כאשר בבית הכבוד והשררה נמצאות צורות השמש, הדבר מורה על כוח הכבוד, המעלה והשלווה למלכים ולבעלי השררה. אם נמצאות בו צורות צדק או נוגה, הדבר מורה על טוב ושלמות. ואם נמצאת בו צורת שבתאי, הדבר מורה על חוסר תועלת, קדרות וצער מאדם נמוך־מוצא.',
    supportingPages: [133, 134],
    arabicVerificationPages: [256],
  }),

  'authority.p257.appointmentH1H10Planet': knowledge({
    kashfMethodId: 'authority.p257.appointmentH1H10Planet',
    page: 257,
    topic: 'הפרק העשירי — כבוד, שררה ומינוי',
    heading: 'קיום השררה, דין האם ודין המלכות',
    hebrewRule: 'אם רצונך לדעת אם השררה / המינוי תתקיים או לא, הולד צורה מן הראשון והעשירי. אם היא מן צורות שני המאורות — השמש והירח — או מן שני הכוכבים המיטיבים — צדק ונוגה — השררה מתקיימת. ואם לא — אינה מתקיימת.',
    supportingPages: [133, 134],
    arabicVerificationPages: [257],
  }),

  'authority.p257.rulerConditionH7H10': knowledge({
    kashfMethodId: 'authority.p257.rulerConditionH7H10',
    page: 257,
    topic: 'הפרק העשירי — כבוד, שררה ומינוי',
    heading: 'דין השלטון',
    hebrewRule: 'הולד צורה מן השביעי והעשירי. אם יצאה צורה מיטיבה — דון לו טובה. ואם יצאה צורה מזיקה — דון לו רעה.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [257],
    notes: 'המקור נותן כאן דין מפורש למיטיב ולמזיק; צורה ממוזגת אינה נדחפת אוטומטית לאחד מהם.',
  }),

  'profession.p254.h9Planet': knowledge({
    kashfMethodId: 'profession.p254.h9Planet',
    page: 254,
    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',
    heading: 'ייחוס, מלאכה וחלום — תכונות המלאכות',
    hebrewRule: 'אם בבית העשירי ובאחד־עשר יש צורה מיטיבה, מלאכתו מעטה בטרחה והוא מוצא בה מנוחה. אחר כך דנים לפי הצורה או הכוכב בבית התשיעי: שבתאי — חקלאות ועבודת אדמה; צדק — בקשת חכמות ולימודים; מאדים — רפואה ורפואת בהמות; שמש — הנדסה ומדידות; נוגה — דברי הימים, לחנים וניגונים; כוכב / עֻטַארִד — כישוף, נפלאות ואצטגנינות; ירח — ענייני עניים וצדיקים; ראש התלי — ידיעת הדתות ואפשר ידיעה בחלק ממדע הנסתר; זנב התלי — בורות, בגידה וקלקול.',
    supportingPages: [133, 134],
    arabicVerificationPages: [254],
    notes: 'v57 מתקן כאן חומר ישן: עֻטַארִד אינו כתיבה/חשבונות בכלל המלאכות הזה אלא כישוף, נפלאות ואצטגנינות. H10/H11 הם תנאי נפרד של קלות המלאכה ולא קובעים את סוג המקצוע.',
  }),

  'theft.p224.relationshipH7Recurrence': knowledge({
    kashfMethodId: 'theft.p224.relationshipH7Recurrence',
    page: 224,
    topic: 'הפרק השמיני — גניבה והלוואה',
    heading: 'בדיני הגניבה — חזרת השביעי בבתים',
    hebrewRule: 'אם הבית השביעי חוזר באחד הבתים, הוא מורה על סיבת הגניבה ועל מי שקשור בה. אם הוא חוזר בראשון — אדם העומד במקום בעל הדבר; בשני — מן העוזרים שלו; בשלישי — זה הגנב; ברביעי — ממי שנכנס לביתו; בחמישי — ממי שמתערב עם ילדיו; בשישי — הוא יחלה בגלל הגניבה; בתשיעי — הדבר בא מחמת נסיעה; בעשירי — ממי שקשור לבעלי השלטון; ובאחד־עשר — קשור לאנשים שהגנב מתחבר עמם.',
    detailPages: [225],
    arabicVerificationPages: [224, 225],
    notes: 'זהו תיאור קשר/סיבה לפי בית החזרה, לא זיהוי ודאי של אדם מסוים ולא מד מרחק.',
  }),

  'theft.p225.thiefDescriptionH7': knowledge({
    kashfMethodId: 'theft.p225.thiefDescriptionH7',
    page: 225,
    topic: 'הפרק השמיני — גניבה והלוואה',
    heading: 'כיווני הגניבה — תיאור הגנב וקרבתו',
    hebrewRule: 'מן הבית השביעי לוקחים את תיאור הגנב, וממנו תכיר את מראהו ואת אותיות שמו, לפי הצורה השוכנת בו.',
    detailPages: [232, 233, 234],
    arabicVerificationPages: [225, 232, 233, 234],
    notes: 'תיאורי 16 הצורות המפורטים בעמודים 232–234 הם גוף הידע של המבצע. אין להשתמש בתיאור כדי להאשים אדם מסוים.',
  }),
});

export function getKashfV57Knowledge(kashfMethodId) {
  return KASHF_V57_KNOWLEDGE[kashfMethodId] || null;
}

export function hasKashfV57Knowledge(kashfMethodId) {
  return Boolean(getKashfV57Knowledge(kashfMethodId));
}

export function listKashfV57KnowledgeMethodIds() {
  return Object.keys(KASHF_V57_KNOWLEDGE);
}

export function validateKashfV57KnowledgeEntry(entry) {
  const errors = [];
  if (!entry || typeof entry !== 'object') return { valid: false, errors: ['entry missing'] };
  if (!entry.kashfMethodId) errors.push('kashfMethodId missing');
  if (entry.knowledgeLanguage !== 'he') errors.push('knowledgeLanguage must be he');
  if (entry.knowledgeRole !== 'operational-primary') errors.push('knowledgeRole must be operational-primary');
  if (entry.v57?.version !== V57_VERSION) errors.push('v57.version mismatch');
  if (entry.v57?.indexFile !== V57_INDEX_FILE) errors.push('v57.indexFile mismatch');
  if (entry.v57?.draftFile !== V57_DRAFT_FILE) errors.push('v57.draftFile mismatch');
  if (!Number.isInteger(entry.v57?.page) || entry.v57.page < 1) errors.push('v57.page must be a positive integer');
  if (entry.v57?.anchor !== `#p${entry.v57?.page}`) errors.push('v57.anchor must match page');
  if (typeof entry.v57?.hebrewRule !== 'string' || entry.v57.hebrewRule.trim().length === 0) errors.push('v57.hebrewRule missing');
  if (entry.arabicVerification?.role !== 'verification-only') errors.push('Arabic source must be verification-only');
  return { valid: errors.length === 0, errors };
}

export function validateKashfV57KnowledgeCoverage(methodRegistry) {
  const errors = [];
  const runnable = Object.values(methodRegistry || {}).filter((method) =>
    method?.methodRole === 'canonical-operational'
      && method?.kashfRuntimeStatus === 'ready'
      && method?.runtimeAllowed === true
      && method?.executorStatus === 'ready'
  );

  for (const method of runnable) {
    const entry = getKashfV57Knowledge(method.kashfMethodId);
    if (!entry) {
      errors.push(`Runnable method missing v57 Hebrew knowledge: ${method.kashfMethodId}`);
      continue;
    }
    const validation = validateKashfV57KnowledgeEntry(entry);
    for (const error of validation.errors) errors.push(`${method.kashfMethodId}: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    runnableCount: runnable.length,
    coveredCount: runnable.filter((method) => hasKashfV57Knowledge(method.kashfMethodId)).length,
  };
}

export default {
  KASHF_V57_KNOWLEDGE,
  getKashfV57Knowledge,
  hasKashfV57Knowledge,
  listKashfV57KnowledgeMethodIds,
  validateKashfV57KnowledgeEntry,
  validateKashfV57KnowledgeCoverage,
};
