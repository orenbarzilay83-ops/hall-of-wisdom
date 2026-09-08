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
  verificationNotes = null,
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
      notes: verificationNotes,
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
    hebrewRule: 'אם הצורה זכרית — הוולד זכר; ואם היא נקבית — הוולד נקבה.',
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
    hebrewRule: 'בדין מזל הלבוש: אם בחמישי ובאחד־עשר יש צורות מיטיבות, יש לו מזל בלבושים. אם בעשירי צורה מזיקה, אין לו מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה. אם בחמישי ובאחד־עשר צורות מזיקות, אין לו מזל בלבוש.',
    detailPages: [264, 265],
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [264, 265],
    verificationNotes: 'הסריקה הערבית בעמ׳ 265 מאשרת את שלושת ענפי המזל. היא גם מבהירה שהדין על בגד שנשאר עד שיקרע שייך לצורה קבועה, ואילו הצורה המתהפכת אינה עומדת על לבוש אחד; ב-v57 משפט הקביעות התמזג בטעות עם ענף המזיק, ולכן שני סעיפי הקביעות/התהפכות אינם מופעלים במנוע מזל זה. טבלת הצבעים נבדקה מחדש: عطارد/כוכב = צבעוני-מגוון; הירח וראש התלי = לבן; זנב התלי = אפרפר/עכור.',
    notes: 'הפסק הקנוני עונה על מזל בלבוש, לא על שאלת איזה צבע מביא מזל. צבעי הלבוש, וכן דין צורה קבועה/מתהפכת, נשמרים כחומר ידע נפרד ואינם מצביעים לתוך הכרעת המזל.',
  }),

  'love.p206.womanFavorH7H11ThenH5': knowledge({
    kashfMethodId: 'love.p206.womanFavorH7H11ThenH5',
    page: 206,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'האם האישה תמצא חן בעיני השואל',
    hebrewRule: 'אם שאל השואל על אישה — האם היא תמצא חן בעיני? קח צורה מן השביעי והאחד־עשר, ואת היוצא הכה עם החמישי. אם יצאה צורה מיטיבה, היא תמצא חן בעיניו. ואם יצאה צורה מזיקה, לא תמצא חן בעיניו.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [206],
    verificationNotes: 'המקור הערבי בעמ׳ 206 מאשר במפורש את אותה שאלה ואת אותה הולדה: השביעי+האחד־עשר, ואחר כך עם החמישי; מיטיב = תמצא חן, מזיק = לא תמצא חן.',
    notes: 'זהו דין חד־כיווני של מציאת חן בעיני השואל. אין להרחיב אותו לכימיה הדדית, משיכה הדדית או אהבה מלאה; דין רצון השואל הסמוך בעמ׳ 206 נשמר כשיטה נפרדת אף שהחישוב זהה.',
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
    notes: 'לשאלת עצם הפיוס מפעילים רק את הולדת H1+H7. רק ענף מיטיב מפורש במקור כעדות לפיוס; אין להמציא מן ההפך דין מפורש של אי־פיוס. סעיפי זהות המפשר/מתווך נשמרים כחומר ידע ואינם חלק מהכרעת כן/לא זו.',
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
    notes: 'זהו כלל תשומת לב/מבט; הוא אינו שקול לשאלת אהבה. הכלל הדומה שבעמ׳ 170 נשאר שיטה/נוסח נפרד ואינו מוזג אוטומטית לפסק הקנוני של עמ׳ 204.',
  }),

  'love.p205.directLoveH1PlacementH5Relation': knowledge({
    kashfMethodId: 'love.p205.directLoveH1PlacementH5Relation',
    page: 205,
    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',
    heading: 'האם אדם זה אוהב אותך?',
    hebrewRule: 'האם אדם זה אוהב אותך? התבונן בצורת הבית הראשון. אם אותה צורה נמצאת ביתדות, יש לו רצון בך. אם היא נמצאת בקבוצת הבתים שהמקור מכנה כאן נופלים ומונה במפורש כ־6, 8, 3, 12 — הוא מתרחק ממך ומבקש אחר. לאחר מכן התבונן בבית החמישי, המכונה כאן המבוקש, ביחס לבית הראשון. אם היחס רע — הוא שונא אותך ומתרחק ממך. הסיפא "ואם הוא באחיזתך" נשמרת כלשונה ואינה מקבלת פסק נוסף עד שהמונח ייסגר.',
    supportingPages: [43, 44, 45],
    arabicVerificationPages: [205],
    verificationNotes: 'אימות מול הסריקה המודפסת בעמ׳ 205: כתוב "الخامس المطلوب" — הבית החמישי, לא החמישה־עשר. באותו משפט מודפס גם רצף הבתים 6,8,3,12 תחת הכינוי "הנופלים", בעוד חלוקת הנופלים הסטנדרטית בספר היא 3,6,9,12; אין לתקן את 8 ל־9 בשקט. גם הפעולה המדויקת של "نسبة رديئة" והסיפא "وإن كان في قبضتك" טרם נסגרו מכנית. נוסח v57 הקיים שהזכיר H15 מסומן כאן כפער תעתוק/‏OCR ודורש תיקון מפורש במקור v57 עצמו.',
    notes: 'שכבת הידע מתעדת את תיקון H5 ואת הסתירות במקום להחליק אותן. השיטה נשארת repair-required ואינה רשאית להפיק פסק אהבה עד שסמנטיקת החזרה של צורת H1, רשימת הבתים החריגה, יחס H5↔H1 והביטוי "באחיזתך" ייסגרו מן המקור.',
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
    notes: 'שיטה זו נפרדת משיטת השלמת העניין בעמוד 173. את הצורה הסופית שופטים לפי סיווג הטוב/הרע הקנוני של v57; צורה ממוזגת נשארת ממוזגת ואינה נהפכת אוטומטית למיטיבה או למזיקה.',
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
    hebrewRule: 'אם בבית השני צורה מיטיבה, בקש את כבוד נכנס; במקום שבו הוא נמצא, הממון יגיע מטבע אותו בית שבו הוא שורה. ואם עלתה צורת ממון נכנס בבית הממון, כל בית שבו נמצאת הצורה הזאת ייתן דין על השגת הממון.',
    supportingPages: [43, 46, 47, 54, 57, 58, 59, 60],
    arabicVerificationPages: [179],
    notes: 'אימות הסריקה הערבית בעמ׳ 179 סגר את ניסוח השער: המקור אומר במפורש «وإن كان في الثاني سعد» — אם בשני מיטיב. לכן שער המבצע הקנוני הוא سعد/מיטיב טהור בלבד; צורה ממוזגת אינה מקודמת לשער.',
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
    heading: 'הנעדר לפי הזנאטי; דת וצדקות',
    hebrewRule: 'בדין הדת והצדקות: אם בבית השלישי והתשיעי יש צורה מזיקה — הוא מועט בדת. ואם יש שם צורה מיטיבה — הוא בעל דת ויראת אלוהים.',
    supportingPages: [54, 57, 58, 59, 60],
    arabicVerificationPages: [253],
    notes: 'זהו דין מצומצם על הדת/הצדקות לפי H3 ו-H9, לא מענה לשאלות אמונה או ייעוץ רוחני כללי. כדי לא להמציא הרחבה מעבר ללשון v57, הכרעה קנונית ניתנת רק כאשר שני הבתים מסכימים בסיווג טהור: שניהם מיטיבים או שניהם מזיקים. ממוזג או עדות מפוצלת נשארים ללא הכרעה.',
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
    page: 178,
    topic: 'הפרק השלישי — אחים ומעבר',
    heading: 'אורך חיי האדם / ומקום או מעבר — האם להישאר או לעבור',
    hebrewRule: 'האם טוב לאדם להישאר בעיר זו או לעבור ממנה? השלם את ההכאה. אם יצאה בראשון צורה מיטיבה ובשני צורה מזיקה, המקום שבו הוא נמצא טוב לו. ואם יצא להפך — הדין להפך.',
    detailPages: [178, 183],
    supportingPages: [178],
    arabicVerificationPages: [178, 183],
    notes: 'הכלל מופיע ב-v57 בעמ׳ 178 וחוזר שוב בעמ׳ 183. רק שני המצבים ההפוכים מפורשים: H1 מיטיב + H2 מזיק = המקום הנוכחי טוב; H1 מזיק + H2 מיטיב = הדין להפך. אין להשלים דין כאשר שני הבתים באותו סיווג או כאשר אחד מהם ממוזג.',
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
  }),

  'theft.p225.thiefDescriptionH7': knowledge({
    kashfMethodId: 'theft.p225.thiefDescriptionH7',
    page: 225,
    topic: 'הפרק השמיני — גניבה והלוואה',
    heading: 'כיווני הגניבה — תיאור הגנב וקרבתו',
    hebrewRule: 'מן הבית השביעי לוקחים את תיאור הגנב, וממנו תכיר את מראהו ואת אותיות שמו, לפי הצורה השוכנת בו.',
    detailPages: [231, 232, 233],
    arabicVerificationPages: [225, 231, 232, 233],
    notes: 'עמ׳ 225 נותן את הוראת H7. טבלת תיאורי 16 הצורות מתחילה בעמ׳ 231 ונמשכת בעמ׳ 232–233. המבצע הקנוני מחזיר פרופיל תיאורי בלבד; אותיות השם המוזכרות בעמ׳ 225 אינן מחושבות בשיטה זו, ואין להשתמש בפרופיל כדי לזהות או להאשים אדם מסוים.',
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
  const sourceReady = Object.values(methodRegistry || {}).filter((method) =>
    method?.methodRole === 'canonical-operational'
      && method?.kashfRuntimeStatus === 'ready'
  );
  const runnable = sourceReady.filter((method) => method?.runtimeAllowed === true && method?.executorStatus === 'ready');

  for (const method of sourceReady) {
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
    sourceReadyCount: sourceReady.length,
    runnableCount: runnable.length,
    coveredCount: sourceReady.filter((method) => hasKashfV57Knowledge(method.kashfMethodId)).length,
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
