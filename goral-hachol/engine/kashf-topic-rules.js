/**
 * kashf-topic-rules.js
 *
 * כללי פסיקה לפי נושא — שיטת כשף אל-אסרר.
 * כל נושא מכיל: נוסחה ראשית, נוסחה חלופית (אם יש), בדיקות תומכות,
 * ובתים מרכזיים לתיאור.
 *
 * מקורות:
 *   כשף אל-אסרר המצונה — פרקים 1-12 של "השער השישי" (עמ׳ 166-276)
 *   כל טקסט מקורי מתורגם / מצוטט ישירות מהספר.
 */

// ── סוגי נוסחאות ─────────────────────────────────────────────────────────
// 'fire-row-assemble': קח ראש (שורת-אש) מ-4 בתים → צורה חדשה → חיצונית/פנימית
// 'combine':           חיבור רמל של N בתים → צורה חדשה → מיטיב/מזיק או חיצונית/פנימית
// 'assemble':          "העמד מהם צורה" מ-4 בתים (כל שורות) → מיטיב/מזיק
// 'house-quality':     בדיקת בית יחיד — האם הוא מיטיב/מזיק
// 'count-quality':     ספירת מיטיב/מזיק בקבוצת בתים

// ── מיפוי נושאים → כללים ────────────────────────────────────────────────

export const KASHF_TOPIC_RULES = {

  // ────────────────────────────────────────────────────────────────────────
  completion: {
    topicId: 'completion',
    topicHebrewName: 'השלמת העניין',
    sourceRef: 'כשף אל-אסרר, עמ׳ 173',
    topicDescription: 'האם הדבר שנשאל עליו יושלם ויצא לפועל?',
    primaryFormula: {
      type: 'fire-row-assemble',
      houses: [1, 5, 9, 10],
      interpretBy: 'dakhal-kharij',
      sourceText: 'קח את ראש הראשון, החמישי, התשיעי והעשירי, והעמד מהם צורה. אם יצאה חיצונית — העניין לא יושלם; ואם יצאה פנימית — יושלם.',
      verdictByDakhalKharij: {
        kharij:          { text: 'העניין לא יושלם', positive: false },
        'mujassad-kharij': { text: 'העניין ספק — נוטה לאי-השלמה', positive: false },
        dakhil:          { text: 'העניין יושלם', positive: true },
        'mujassad-dakhil': { text: 'העניין ספק — נוטה להשלמה', positive: true },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [1, 16],
      interpretBy: 'saad-nahs',
      sourceText: 'ויש שאמרו: קח צורה מן הראשון והשישה-עשר, ואם יצאה מיטיבה או מזיקה, דון על פיה.',
      verdictBySaadNahs: {
        saad:  { text: 'הצורה מיטיבה — העניין יתקיים', positive: true },
        nahs:  { text: 'הצורה מזיקה — העניין לא יתקיים', positive: false },
        mixed: { text: 'הצורה ממוזגת — תוצאה לא ודאית', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'pillars',
        checkType: 'count-quality',
        houses: [1, 4, 7, 10],
        label: 'ארבע היתדות',
        sourceText: 'התבונן בראשון, ברביעי, בשביעי ובעשירי — ארבע היתדות. אם כולן מיטיבות, יש בכך סימן למהירות קיום הבקשות.',
      },
      {
        id: 'hope-house',
        checkType: 'house-quality',
        houses: [15],
        label: 'בית אחרית העניין',
        sourceText: 'התבונן בחמישה-עשר — בית אחרית עניינו.',
      },
    ],
    keyHouses: [1, 5, 9, 10, 16],
  },

  // ────────────────────────────────────────────────────────────────────────
  spiritualDiagnostics: {
    topicId: 'spiritualDiagnostics',
    topicHebrewName: 'כישוף ופעולה נסתרת',
    sourceRef: 'כשף אל-אסרר, עמ׳ 167 (הפרק הראשון — הנפש — נקודות אחדות)',
    topicDescription: 'האם יש כישוף מכוון, או פעולה נסתרת מאחורי העניין.',
    primaryFormula: {
      type: 'fire-row-assemble',
      houses: [1, 4, 6, 16],
      interpretBy: 'saad-nahs',
      sourceText: 'כלל מעשי: האם השואל עושה כישוף בנשאל עליו? קח את שורת יסוד האש של הבית הראשון, של הבית הרביעי, של הבית השישי ושל המאזן (בית 16), העמד מהם צורה, והתבונן באותה צורה. אם היא צורה מזיקה, השואל פועל עליו בכישוף.',
      verdictBySaadNahs: {
        saad:  { text: 'אין סימן לכישוף מכוון', positive: true },
        nahs:  { text: 'יש סימן שמופעל כישוף על הנשאל עליו', positive: false },
        mixed: { text: 'הסימן אינו חד-משמעי', positive: null },
      },
    },
    altFormula: {
      type: 'row-assemble',
      row: 'air',
      houses: [4, 6, 8, 16],
      interpretBy: 'saad-nahs',
      sourceText: 'כלל מעשי: האם יש פעולה מאחורי הדבר? קח את אוויר הרביעי, אוויר השישי, אוויר השמיני ואוויר המאזן (בית 16); העמד מהם צורה. אם יצאה צורה מזיקה, הרי הפעולה מאחוריו; ואם לא — לא.',
      verdictBySaadNahs: {
        saad:  { text: 'אין פעולה נסתרת מאחורי העניין', positive: true },
        nahs:  { text: 'יש פעולה נסתרת מאחורי העניין', positive: false },
        mixed: { text: 'התוצאה אינה ודאית', positive: null },
      },
    },
    keyHouses: [1, 4, 6, 8, 16],
  },

  // ────────────────────────────────────────────────────────────────────────
  money: {
    topicId: 'money',
    topicHebrewName: 'ממון וכסף',
    sourceRef: 'כשף אל-אסרר, עמ׳ 179-182',
    topicDescription: 'מצב הממון, הכסף והפרנסה של הנשאל.',
    primaryFormula: {
      type: 'assemble',
      houses: [2, 4, 6, 8],
      interpretBy: 'dakhal-kharij',
      sourceText: 'קח את השני, הרביעי, השישי והשמיני, והעמד מהם צורה — זו מורה על כספי הנשאל עליו.',
      verdictByDakhalKharij: {
        kharij:          { text: 'ממון הנשאל בתנועה יוצאת — הכסף יוצא', positive: false },
        'mujassad-kharij': { text: 'ממון הנשאל תלוי, נוטה ליציאה', positive: false },
        dakhil:          { text: 'ממון הנשאל בתנועה נכנסת — הכסף נכנס', positive: true },
        'mujassad-dakhil': { text: 'ממון הנשאל תלוי, נוטה להיכנס', positive: true },
      },
    },
    altFormula: {
      type: 'assemble',
      houses: [1, 3, 5, 7],
      interpretBy: 'dakhal-kharij',
      sourceText: 'קח את הראשון, השלישי, החמישי והשביעי, והעמד מהם צורה — זו מורה על כספי השואל.',
      verdictByDakhalKharij: {
        kharij:          { text: 'ממון השואל יוצא ממנו', positive: false },
        'mujassad-kharij': { text: 'ממון השואל תלוי, נוטה ליציאה', positive: false },
        dakhil:          { text: 'ממון השואל נכנס אליו', positive: true },
        'mujassad-dakhil': { text: 'ממון השואל תלוי, נוטה להיכנס', positive: true },
      },
    },
    supportingChecks: [
      {
        id: 'money-house',
        checkType: 'house-quality',
        houses: [2],
        label: 'בית הממון',
        sourceText: 'אם בבית הממון (השני) יש בה צד מיטיב — הממון קיים ויושג.',
      },
      {
        id: 'livelihood-house',
        checkType: 'house-quality',
        houses: [10],
        label: 'בית הפרנסה',
        sourceText: 'אם רצית לשאול על בית ממונך ופרנסתך: התבונן בבית השני ובעשירי, שהוא בית הפרנסות.',
      },
      {
        id: 'pillars',
        checkType: 'count-quality',
        houses: [1, 4, 7, 10],
        label: 'ארבע היתדות',
        sourceText: 'ברכישת ממון: התבונן בארבע היתדות. אם כולן מיטיבות והופיעו בראשון ובשני, הדבר מורה על רכישת ממון בקלות.',
      },
    ],
    keyHouses: [2, 6, 8, 10],
  },

  // ────────────────────────────────────────────────────────────────────────
  siblings: {
    topicId: 'siblings',
    topicHebrewName: 'אחים ויחסי משפחה',
    sourceRef: 'כשף אל-אסרר, עמ׳ 182',
    topicDescription: 'מצב הקשרים עם אחים ובני המשפחה.',
    primaryFormula: {
      type: 'combine',
      houses: [1, 3],
      interpretBy: 'saad-nahs',
      sourceText: 'הולד צורה מן הראשון והשלישי: אם יצאה מיטיבה — היא מורה על הסכמתם; ואם מזיקה — מורה על קלקול מידותיהם.',
      verdictBySaadNahs: {
        saad:  { text: 'הקשר עם האחים טוב, יש הסכמה', positive: true },
        nahs:  { text: 'קיים קלקול ביחסים, מריבות', positive: false },
        mixed: { text: 'הקשר בינוני, יש מעלות וחסרונות', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [3, 13],
      interpretBy: 'saad-nahs',
      sourceText: 'וכן מן החמישי והשלישי, ומן החמישי והשלושה-עשר — הולד צורה ודון על פיה.',
      verdictBySaadNahs: {
        saad:  { text: 'הבדיקה הנוספת מאשרת: יחסים טובים', positive: true },
        nahs:  { text: 'הבדיקה הנוספת מאשרת: קשיים ביחסים', positive: false },
        mixed: { text: 'הבדיקה הנוספת: מצב מעורב', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'siblings-house',
        checkType: 'house-quality',
        houses: [3],
        label: 'בית האחים',
        sourceText: 'אם בשלישי יש בה צד מיטיב — הדבר מורה על טוב מצבם ועל הסכמה ביניהם.',
      },
    ],
    keyHouses: [3, 13],
  },

  // ────────────────────────────────────────────────────────────────────────
  relocation: {
    topicId: 'relocation',
    topicHebrewName: 'מעבר ממקום למקום',
    sourceRef: 'כשף אל-אסרר, עמ׳ 183-184',
    topicDescription: 'האם המעבר למקום חדש טוב לנשאל?',
    primaryFormula: {
      type: 'combine',
      houses: [4, 15],
      interpretBy: 'saad-nahs',
      sourceText: 'העמד צורה מן הרביעי והחמישה-עשר. אם היא מיטיבה — דון שהמקום ההוא טוב ומבורך. אם היא מזיקה — דון במזיק המקום, בקושי ובעמל. ואם היא ממוזגת — דון שהמקום ממוצע.',
      verdictBySaadNahs: {
        saad:  { text: 'המקום טוב ומבורך למעבר', positive: true },
        nahs:  { text: 'המקום מזיק, יש קושי ועמל', positive: false },
        mixed: { text: 'המקום ממוצע — לא מצוין אך לא מזיק', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [1, 15],
      interpretBy: 'dakhal-kharij',
      sourceText: 'אם השאלה על אדם במקומו או על מעברו, קח מן הראשון והחמישה-עשר צורה. אם פנימית — נשאר; אם חיצונית — נוסע.',
      verdictByDakhalKharij: {
        kharij:          { text: 'הצורה חיצונית — מומלץ לנסוע', positive: true },
        'mujassad-kharij': { text: 'הצורה נוטה לחוץ — נסיעה סבירה', positive: true },
        dakhil:          { text: 'הצורה פנימית — עדיף להישאר', positive: null },
        'mujassad-dakhil': { text: 'הצורה נוטה לפנים — לשקול הישארות', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'current-place',
        checkType: 'count-quality',
        houses: [1, 2],
        label: 'מקום נוכחי',
        sourceText: 'אם הראשון והשני חזקים יותר — מקומו הנוכחי טוב לו יותר.',
      },
      {
        id: 'new-place',
        checkType: 'count-quality',
        houses: [7, 8],
        label: 'מקום חדש',
        sourceText: 'אם השביעי והשמיני חזקים יותר — המעבר טוב לו יותר.',
      },
    ],
    keyHouses: [1, 2, 4, 7, 8, 15],
  },

  // ────────────────────────────────────────────────────────────────────────
  hiddenTreasure: {
    topicId: 'hiddenTreasure',
    topicHebrewName: 'מטמון ודבר נסתר',
    sourceRef: 'כשף אל-אסרר, עמ׳ 184-190 (הפרק הרביעי — הורים, נכסים ונסתרות)',
    topicDescription: 'האם יש מטמון/דבר נסתר, האם הוא במקומו, ומה טיבו.',
    primaryFormula: {
      type: 'count-quality',
      houses: [1, 2, 4, 13, 14, 15],
      interpretBy: 'count-quality',
      sourceText: 'בדבר הנסתר — האם הוא במקומו או לא? התבונן בבית הראשון, בשני, בבית הדבר הנסתר — הוא הרביעי — ובשלושה־עשר, בארבעה־עשר ובחמישה־עשר. אם הצורות מיטיבות, הרי הדבר שם. ואם אינן מיטיבות — אינו שם.',
      verdictByCountQuality: {
        allSaad:  { text: 'הדבר הנסתר נמצא במקומו', positive: true },
        allNahs:  { text: 'הדבר הנסתר אינו במקומו', positive: false },
        mostSaad: { text: 'רוב הסימנים מורים שהדבר נמצא במקומו', positive: true },
        mostNahs: { text: 'רוב הסימנים מורים שהדבר אינו במקומו', positive: false },
        mixed:    { text: 'הסימנים מעורבים — אין ודאות למיקום', positive: null },
      },
    },
    altFormula: {
      type: 'house-quality',
      houses: [4],
      interpretBy: 'saad-nahs',
      sourceText: 'בדיני הדברים הנסתרים: הבית הראשון הוא עצם הדבר הנסתר; והרביעי הוא מקומו. בכל מקום שתמצא בו צורות מיטיבות — דון בו לטובה; ובכל מקום שתמצא בו מזיקים — דון להפך.',
      verdictBySaadNahs: {
        saad:  { text: 'מקום הדבר הנסתר טוב ונגיש', positive: true },
        nahs:  { text: 'יש קושי במציאת/הוצאת הדבר הנסתר', positive: false },
        mixed: { text: 'מצב מקום הדבר הנסתר מעורב', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'object-nature',
        checkType: 'house-figure-description',
        houses: [1],
        label: 'טבע הדבר הנסתר',
        sourceText: 'אם הבית הראשון מיסוד העפר — הדבר מן האדמה. אם הוא ממין הצומח — מן הירקות או הצמחים. ואם הוא בבית המורה על בעלי חיים — מן החי.',
      },
      {
        id: 'recovery-chance',
        checkType: 'count-quality',
        houses: [6, 8],
        label: 'שיבת האבדה',
        sourceText: 'באבדה ובשיבתה: כוון אל הבית השמיני והשישי. אם נמצאו שם צורות מיטיבות פנימיות — האבדה תשוב; ואם לא — לא.',
      },
    ],
    // שיטות חישוב ישיר לכיוון/עומק (עמ׳ 185-190) — מצוטטות מהמקור במלואן,
    // אך אינן מקודדות עדיין כבדיקה אוטומטית: הן דורשות גימטריית שם השואל
    // וחישוב מודולו-4 חוזר (חלוקת רבעים לרבעים), שאינם מתבצעים כרגע במנוע.
    additionalMethods: [
      {
        id: 'quadrant-direction',
        label: 'כיוון הדבר הנסתר — חלוקה לרבעים',
        sourceStatus: 'explicit-in-source',
        sourceText: 'קח את נקודות שורת יסוד האש של הבית עם מספר שם בעל הצורה, והפחת את הסכום בארבע ארבע. אם נשאר אחד — הוא בפינה המערבית; שניים — בפינה המזרחית; שלושה — בפינה הדרומית; ארבעה — בפינה הצפונית. כאשר הגעת אל אותו רבע, הוצא לו שוב אמהות וחזור על החלוקה, עד שתגיע אל ההכאה הרביעית.',
      },
      {
        id: 'quadrant-direction-alt-tamtam',
        label: 'כיוון לפי שיטת טמטם ההודי',
        sourceStatus: 'explicit-in-source',
        sourceText: 'עמוד באמצע המקום, ופניך אל הדרום. חשב את שם השואל, שם אמו והיום שבו אתה עומד לפי חשבון הגימטרייה הגדולה, והפחת בארבע. אם נשאר אחד — הטמון ברבע המזרחי. אם שניים — ברבע המערבי. אם שלושה — ברבע הדרומי. ואם ארבעה — ברבע הצפוני.',
      },
      {
        id: 'depth-by-element',
        label: 'עומק הדבר הנסתר / המים לפי היסוד',
        sourceStatus: 'explicit-in-source',
        sourceText: 'האש נמדדת באצבע, האוויר בשיבר, המים באמה, והעפר לפי עומק הקרקע והדבר הקבור. לפי היסוד השולט דון על עומק הדבר. (ובשיטת שיבוץ ההפכים: אורך כל צורה ביחידות משלה — למשל נשוא ראש=אצבע, כבוד יוצא=אצבע וטפח.)',
      },
      {
        id: 'direction-by-element-h1',
        label: 'כיוון לפי יסוד הבית הראשון',
        sourceStatus: 'explicit-in-source',
        sourceText: 'אם הצורה שבבית הראשון היא מיסוד האוויר — הכיוון הוא צפון; אם היא מיסוד האש — הכיוון הוא מזרח; אם היא מיסוד העפר — הכיוון הוא דרום; ואם היא מיסוד המים — הכיוון הוא מערב. שים לב: מיפוי יסוד-לכיוון זה (עמ׳ 191) שונה מזה המשמש בנושא "גניבה" (עמ׳ 224-230) — אין למזג בין השניים.',
      },
    ],
    keyHouses: [1, 2, 4, 6, 8, 13, 14, 15],
  },

  // ────────────────────────────────────────────────────────────────────────
  parentsProperty: {
    topicId: 'parentsProperty',
    topicHebrewName: 'הורים, נכסים וקרקע',
    sourceRef: 'כשף אל-אסרר, עמ׳ 184 (הפרק הרביעי — הורים, נכסים ונסתרות)',
    topicDescription: 'מצב ההורים, ודין הנכסים והקרקע (בית / גן).',
    primaryFormula: {
      type: 'house-quality',
      houses: [4],
      interpretBy: 'saad-nahs',
      sourceText: 'וכן דין הנכסים: אם צורות הטובה שורות ברביעי של השואל, יהיה לו נכס וירכוש נכס. ואם הרביעי פנוי מן הצורות המיטיבות, הדבר מורה על העדר נכס ועל יציאתו מידו.',
      verdictBySaadNahs: {
        saad:  { text: 'יהיה לו נכס, וירכוש נכס', positive: true },
        nahs:  { text: 'העדר נכס, או יציאתו מידו', positive: false },
        mixed: { text: 'מצב הנכסים מעורב', positive: null },
      },
    },
    altFormula: {
      type: 'house-quality',
      houses: [5],
      interpretBy: 'saad-nahs',
      sourceText: 'אם בחמישי יש בה צד מיטיב, יהיה לו ממון; ואם בו יש צד מזיק, אין לו ממון.',
      verdictBySaadNahs: {
        saad:  { text: 'יהיה לו ממון בזכות ההורים/הירושה', positive: true },
        nahs:  { text: 'אין לו ממון מצד זה', positive: false },
        mixed: { text: 'מצב הממון מעורב', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'land-nature',
        checkType: 'house-figure-description',
        houses: [4],
        label: 'תכונת הקרקע (בית/גן)',
        sourceText: 'ואם השאלה על בית או גן, דע שהרביעי הוא תכונת הקרקע; העשירי — תכונת העצים שבו; השביעי — תעלות המים; השלישי — הירקות; והשני — החומה או הגדר המקיפה.',
      },
    ],
    // זיהוי "צורת האב" (שמש-ביום/שבתאי-בלילה) ו"צורת האם" (נוגה-ביום/ירח-בלילה)
    // דורש טבלת צורה↔כוכב (קיימת חלקית ב-SHIBUTZ_4_PLANETS ב-kashf-shibutzim.js,
    // כולל הערת אי-ודאות אחת) ואבחנה יום/לילה, שאינן מקודדות עדיין במנוע זה.
    additionalMethods: [
      {
        id: 'parent-figure-longevity',
        label: 'אריכות ימי האב / מצב האם — לפי צורת הכוכב',
        sourceStatus: 'explicit-in-source',
        sourceText: 'לאב ביום — צורת השמש; ולאם — צורת נוגה. בלילה, לאב — צורת שבתאי; ולאם — צורת הירח. אם צורת האב בייתדות, וברביעי יש בה צד מיטיב, הדבר מורה על אריכות ימיו. ואם בבית הרביעי יש צד מזיק, וסימני האב בבתים הנופלים, הדבר מורה על דלותו. ואם צורות השמש והירח בבית הראשון, יהיה לו ממון, כבוד ומעמד.',
      },
    ],
    keyHouses: [2, 3, 4, 5, 7, 10],
  },

  // ────────────────────────────────────────────────────────────────────────
  children: {
    topicId: 'children',
    topicHebrewName: 'ילדים והריון',
    sourceRef: 'כשף אל-אסרר, עמ׳ 191',
    topicDescription: 'שאלה על ילדים, הריון, ומין העובר.',
    primaryFormula: {
      type: 'house-quality',
      houses: [5],
      interpretBy: 'saad-nahs',
      sourceText: 'אם בבית החמישי נמצאת צורה שותקת — ההריון נכון. ואם נמצאת בו צורה ריקה — ההריון בטל.',
      verdictBySaadNahs: {
        saad:  { text: 'בית החמישי מיטיב — ההריון ברוך', positive: true },
        nahs:  { text: 'בית החמישי מזיק — יש לחשוש להריון', positive: false },
        mixed: { text: 'בית החמישי ממוזג — מצב לא ודאי', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'child-safety',
        checkType: 'house-quality',
        houses: [1],
        label: 'בריאות הוולד',
        sourceText: 'אם בבית הראשון נמצאת צורה מיטיבה — הוולד יינצל ויהיה בשלום. ואם נמצאת בו צורה מזיקה — יש לחשוש עליו.',
      },
      {
        id: 'danger',
        checkType: 'count-quality',
        houses: [6, 8],
        label: 'סכנה לוולד',
        sourceText: 'ואם בשישי ובשמיני נמצאות צורות מזיקות — הוולד עלול לצאת מת.',
      },
      {
        id: 'gender-check',
        checkType: 'house-gender',
        houses: [5],
        label: 'מין הוולד',
        sourceText: 'אם הצורה זכרית — הוולד זכר; ואם היא נקבית — הוולד נקבה.',
      },
    ],
    keyHouses: [1, 5, 6, 8, 11],
  },

  // ────────────────────────────────────────────────────────────────────────
  illness: {
    topicId: 'illness',
    topicHebrewName: 'חולה ומחלה',
    sourceRef: 'כשף אל-אסרר, עמ׳ 196-199',
    topicDescription: 'מצב החולה, אופי המחלה, והסיכוי לרפואה.',
    primaryFormula: {
      type: 'combine',
      houses: [1, 5],
      interpretBy: 'saad-nahs',
      sourceText: 'הוצא צורה מן הראשון והחמישי — ובאמצעותה תדע מי מהם קשה מזל ומי מהם טוב מזל.',
      verdictBySaadNahs: {
        saad:  { text: 'סיכוי טוב להחלמה', positive: true },
        nahs:  { text: 'מצב קשה, המחלה חמורה', positive: false },
        mixed: { text: 'מצב בינוני, יש תקווה אך גם חשש', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [6, 8],
      interpretBy: 'saad-nahs',
      sourceText: 'הכה את הצורה השישית בצורת השמינית — ודון בתוצאה.',
      verdictBySaadNahs: {
        saad:  { text: 'שילוב ו-ח מיטיב — פחות סכנה', positive: true },
        nahs:  { text: 'שילוב ו-ח מזיק — יש סכנה', positive: false },
        mixed: { text: 'שילוב ו-ח ממוזג', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'recovery',
        checkType: 'house-quality',
        houses: [15],
        label: 'סיכוי ריפוי',
        sourceText: 'אם בחמישה-עשר צורה מיטיבה — הוא יתרפא. ואם היא מזיקה — המחלה תתארך.',
      },
      {
        id: 'illness-duration-h6',
        checkType: 'house-in-house-check',
        mainHouse: 1,
        targetHouse: 6,
        label: 'אורך המחלה',
        sourceText: 'אם הראשון נמצא בשישי — מחלה זו מתארכת.',
      },
      {
        id: 'illness-severity-h8',
        checkType: 'house-in-house-check',
        mainHouse: 1,
        targetHouse: 8,
        label: 'חומרת המחלה',
        sourceText: 'ואם הראשון בשמיני — מחלתו מתארכת ויש לחשוש עליו.',
      },
      {
        id: 'illness-type',
        checkType: 'element-pair',
        houses: [1, 8],
        label: 'סוג המחלה',
        sourceText: 'אם הראשון והשמיני הם צורות מיסוד המים — החולי מצד קור ולחות. אם מיסוד העפר — מן המרה השחורה. אם מיסוד האש — מן המרה הצהובה. ואם מיסוד האוויר — מרוחות שונות.',
      },
    ],
    keyHouses: [1, 6, 8, 15],
  },

  // ────────────────────────────────────────────────────────────────────────
  lostAnimal: {
    topicId: 'lostAnimal',
    topicHebrewName: 'בהמה או חיה אבודה',
    sourceRef: 'כשף אל-אסרר, עמ׳ 201-202 (הפרק השישי — החולה, האבוד והבהמות)',
    topicDescription: 'האם הבהמה/החיה האבודה תחזור, ומהו סוגה.',
    primaryFormula: {
      type: 'count-quality',
      houses: [6, 8],
      interpretBy: 'count-quality',
      sourceText: 'באבדה ובשיבתה: כוון אל הבית השמיני והשישי. אם נמצאו שם צורות מיטיבות פנימיות — האבדה תשוב; ואם לא — לא.',
      verdictByCountQuality: {
        allSaad:  { text: 'הבהמה/החיה תשוב', positive: true },
        allNahs:  { text: 'הבהמה/החיה לא תשוב', positive: false },
        mostSaad: { text: 'רוב הסימנים מורים על שיבה', positive: true },
        mostNahs: { text: 'רוב הסימנים מורים שלא תשוב', positive: false },
        mixed:    { text: 'התוצאה אינה ודאית', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'animal-type',
        checkType: 'house-figure-description',
        houses: [6],
        label: 'זיהוי סוג הבהמה',
        sourceText: 'בבהמות: אדום[] בבית השישי מורה על כבשים; תַשמִיר מורה על שוורים; כבוד יוצא[] וסף יוצא[] מורים על סוסים; סוהר[] מורה על גמלים; שפל ראש[] מורה על חמורים וגם על גדיים ותיישים; ממון יוצא[] מורה על פרדות.',
      },
    ],
    // בדיקת מום/פגיעה בבהמה (עמ׳ 202) דורשת "הרכבת שורת עפר" משתי קבוצות
    // בתים — סוג נוסחה שאינו מקודד עדיין במנוע (יש רק הרכבת שורת-אש).
    additionalMethods: [
      {
        id: 'animal-defect',
        label: 'מום הבהמה',
        sourceStatus: 'explicit-in-source',
        sourceText: 'במום הבהמה: הוצא את עפר הבתים הראשון, התשיעי, השלושה־עשר והמאזן — ועמד ממנו צורה. אחר כך הוצא את עפר הבתים השמיני, השני, הרביעי והמאזן — ועמד ממנו צורה. לאחר מכן התבונן בטבע אותה צורה.',
      },
    ],
    keyHouses: [6, 8],
  },

  // ────────────────────────────────────────────────────────────────────────
  marriage: {
    topicId: 'marriage',
    topicHebrewName: 'נישואין וזיווג',
    sourceRef: 'כשף אל-אסרר, עמ׳ 204-211',
    topicDescription: 'שאלה על נישואין, הזיווג, ומצב בן/בת הזוג.',
    primaryFormula: {
      type: 'combine',
      houses: [1, 7],
      interpretBy: 'saad-nahs',
      sourceText: 'בנישואין: לאחר השלמת הלוח, התבונן בראשון — לגבר; ובשביעי — לאישה. הוצא צורה מן הראשון והשביעי.',
      verdictBySaadNahs: {
        saad:  { text: 'זיווג טוב — בית ראשון ושביעי מתחברים לטובה', positive: true },
        nahs:  { text: 'זיווג בעייתי — יש קשיים ביחסים', positive: false },
        mixed: { text: 'זיווג ממוצע — יש טוב וגם אתגרים', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [1, 7, 9],
      interpretBy: 'saad-nahs',
      sourceText: 'הצורה הנולדת מן הבתים הראשון, השביעי והתשיעי: אם היא מיטיבה — תבוא ממנה תועלת; ואם מזיקה — להפך.',
      verdictBySaadNahs: {
        saad:  { text: 'הצורה מן א-ז-ט מיטיבה — תוצאה טובה', positive: true },
        nahs:  { text: 'הצורה מן א-ז-ט מזיקה — קשיים צפויים', positive: false },
        mixed: { text: 'הצורה מן א-ז-ט ממוזגת', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'spouse-house',
        checkType: 'house-quality',
        houses: [7],
        label: 'בית בן/בת הזוג',
        sourceText: 'אם בבית השביעי יש צורה מיטיבה — הזיווג טוב. ואם מזיקה — יש בו קלקול.',
      },
      {
        id: 'dowry-house',
        checkType: 'house-quality',
        houses: [8],
        label: 'מוהר/ממון',
        sourceText: 'צורה מיטיבה בבית השמיני מורה על מוהר גדול.',
      },
      {
        id: 'stability',
        checkType: 'house-dakhal-kharij',
        houses: [7],
        label: 'יציבות הנישואין',
        sourceText: 'אם בבית השביעי שוכנות צורות פנימיות — הדבר מורה על יישוב הדעת ועל קיום הנישואין.',
      },
      {
        id: 'outcome-house',
        checkType: 'house-quality',
        houses: [4],
        label: 'אחרית הנישואין',
        sourceText: 'ואם במאזן נמצאים ממון יוצא, דרך או חיבור — אחריתה אינה טובה. דון גם ברביעי, מפני ששניהם בתי האחרית.',
      },
    ],
    keyHouses: [1, 4, 5, 7, 8, 10, 11],
  },

  // ────────────────────────────────────────────────────────────────────────
  disputes: {
    topicId: 'disputes',
    topicHebrewName: 'מריבות ומשפט',
    sourceRef: 'כשף אל-אסרר, עמ׳ 212',
    topicDescription: 'מי גובר במחלוקת? האם יש פיוס?',
    primaryFormula: {
      type: 'house-quality',
      houses: [1],
      interpretBy: 'saad-nahs',
      sourceText: 'במריבות: אם בבית הראשון יש צורה מזיקה — המבקש (הנשאל) גובר; ואם מיטיבה — הדין להפך.',
      verdictBySaadNahs: {
        saad:  { text: 'הצורה מיטיבה בבית הראשון — הצד שכנגד גובר', positive: false },
        nahs:  { text: 'הצורה מזיקה בבית הראשון — הנשאל גובר', positive: true },
        mixed: { text: 'בית הראשון ממוזג — תוצאה לא ודאית', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [1, 7],
      interpretBy: 'saad-nahs',
      sourceText: 'ואם מן הראשון והשביעי נולדת צורה מיטיבה — שניהם יתפייסו על ידי מי שמורה עליו הבית שבו שוכנת הצורה.',
      verdictBySaadNahs: {
        saad:  { text: 'יש אפשרות לפיוס ופשרה', positive: true },
        nahs:  { text: 'המחלוקת תמשיך ואין פיוס קל', positive: false },
        mixed: { text: 'פיוס חלקי אפשרי', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'opponent',
        checkType: 'house-quality',
        houses: [7],
        label: 'הצד שכנגד',
        sourceText: 'התבונן בשביעי — הצד שכנגד.',
      },
      {
        id: 'questioner-money',
        checkType: 'house-quality',
        houses: [2],
        label: 'כסף השואל',
        sourceText: 'אם בשני צורה מיטיבה — המבקש זוכה במבוקש.',
      },
      {
        id: 'opponent-money',
        checkType: 'house-quality',
        houses: [8],
        label: 'כסף הצד שכנגד',
        sourceText: 'ואם בשמיני צורה מיטיבה — המבוקש גובר על המבקש.',
      },
    ],
    keyHouses: [1, 2, 7, 8, 13, 14],
  },

  // ────────────────────────────────────────────────────────────────────────
  enemies: {
    topicId: 'enemies',
    topicHebrewName: 'אויבים',
    sourceRef: 'כשף אל-אסרר, עמ׳ 271-272 (הפרק השנים-עשר — אויבים ואסירים)',
    topicDescription: 'האם יש לנשאל אויב, ומי גובר?',
    primaryFormula: {
      type: 'combine',
      houses: [1, 12],
      interpretBy: 'saad-nahs',
      sourceText: 'אם שאל השואל אם יש לו אויב: אם בראשון ובשנים־עשר יש צורה מיטיבה, אין לו אויב. אם יש בהם מזיק, יש לו אויבים. אם בראשון מיטיב ובשנים־עשר מזיק, הוא גובר על אויביו. ואם בראשון מזיק ובשנים־עשר מיטיב, האויב גובר עליו.',
      verdictBySaadNahs: {
        saad:  { text: 'אין אויב ממשי, או שהנשאל גובר עליו', positive: true },
        nahs:  { text: 'יש אויב, ויש חשש שהוא הגובר', positive: false },
        mixed: { text: 'המצב מול האויב מעורב', positive: null },
      },
    },
    altFormula: {
      type: 'count-quality',
      houses: [1, 7, 10, 12],
      interpretBy: 'count-quality',
      sourceText: 'נקודה בדין האויב: עשה את הראשון, השביעי, העשירי והשנים־עשר כאמהות, והשלם את מערך גורל החול. אם חוזרות שם צורות מיטיבות, הוא הנראה והמנצח.',
      verdictByCountQuality: {
        allSaad:  { text: 'הנשאל הוא הגובר והמנצח', positive: true },
        allNahs:  { text: 'האויב הוא הגובר', positive: false },
        mostSaad: { text: 'רוב הסימנים מורים שהנשאל גובר', positive: true },
        mostNahs: { text: 'רוב הסימנים מורים שהאויב גובר', positive: false },
        mixed:    { text: 'התוצאה אינה ודאית', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'querent-vs-enemy',
        checkType: 'house-quality',
        houses: [1],
        label: 'מצב הנשאל',
        sourceText: 'אם בראשון מיטיב ובשנים־עשר מזיק — הוא גובר על אויביו. ואם בראשון מזיק ובשנים־עשר מיטיב — האויב גובר עליו.',
      },
      {
        id: 'enemy-nature',
        checkType: 'house-figure-description',
        houses: [12],
        label: 'טיב האויב',
        sourceText: 'את טיב האויבים מכירים מן צורות הכוכבים השוכנות בבית השנים־עשר. אם הצורה שבבית השנים־עשר קבועה, אויביו עומדים באיבתם. ואם היא מתהפכת, אינם עומדים באיבתם לאורך זמן.',
      },
    ],
    keyHouses: [1, 7, 10, 12],
  },

  // ────────────────────────────────────────────────────────────────────────
  theft: {
    topicId: 'theft',
    topicHebrewName: 'גניבה ואבדה',
    sourceRef: 'כשף אל-אסרר, עמ׳ 224-230',
    topicDescription: 'מיהו הגנב? היכן הגניבה? האם הדבר הגנוב יוחזר?',
    primaryFormula: {
      type: 'house-quality',
      houses: [8],
      interpretBy: 'saad-nahs',
      sourceText: 'אם בשמיני צורה מיטיבה — בעל הדבר יזכה בגניבה. ואם צורה מזיקה — לא יזכה בה.',
      verdictBySaadNahs: {
        saad:  { text: 'יש סיכוי לאחזר את הגניבה', positive: true },
        nahs:  { text: 'מועט הסיכוי לאחזר את הגניבה', positive: false },
        mixed: { text: 'אפשר לאחזר חלק מן הגניבה', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [6, 4],
      interpretBy: 'dakhal-kharij',
      sourceText: 'קח מן השישי והרביעי צורה: אם היא פנימית — הגנב בעיר; ואם חיצונית — הוא מחוץ לעיר.',
      verdictByDakhalKharij: {
        kharij:          { text: 'הגנב כבר יצא מהעיר', positive: false },
        'mujassad-kharij': { text: 'הגנב אולי יצא מהעיר', positive: null },
        dakhil:          { text: 'הגנב עדיין בעיר', positive: true },
        'mujassad-dakhil': { text: 'הגנב כנראה עדיין בעיר', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'thief-description',
        checkType: 'house-figure-description',
        houses: [7],
        label: 'תיאור הגנב',
        sourceText: 'מן הבית השביעי לוקחים את תיאור הגנב, וממנו תכיר את מראהו.',
      },
      {
        id: 'theft-direction',
        checkType: 'house-element',
        houses: [4],
        label: 'כיוון הגניבה',
        sourceText: 'אם בבית הרביעי צורה מזרחית — הגניבה לצד מזרח; מערבית — צד מערב; דרומית — צד דרום; צפונית — צד צפון.',
      },
      {
        id: 'who-stole',
        checkType: 'house-quality',
        houses: [4],
        label: 'מי גנב',
        sourceText: 'אם הרביעי בשביעי — הגנב מאנשי הבית או מקרוביו.',
      },
    ],
    keyHouses: [2, 4, 7, 8, 10, 12],
  },

  // ────────────────────────────────────────────────────────────────────────
  loan: {
    topicId: 'loan',
    topicHebrewName: 'הלוואה וחוב',
    sourceRef: 'כשף אל-אסרר, עמ׳ 234',
    topicDescription: 'האם יוחזר החוב? האם כדאי לתת הלוואה?',
    primaryFormula: {
      type: 'combine',
      houses: [2, 8],
      interpretBy: 'saad-nahs',
      sourceText: 'הוצא צורה מן השני והשמיני. אם יצאה מיטיבה — ימצא הלווה את מה שלקח ויוכל להשיב; ואם מזיקה — יקשה עליו להשיב.',
      verdictBySaadNahs: {
        saad:  { text: 'הלווה מסוגל להחזיר את החוב', positive: true },
        nahs:  { text: 'יקשה על הלווה להחזיר את החוב', positive: false },
        mixed: { text: 'אפשרי חזרת חלק מן החוב', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [7, 8],
      interpretBy: 'saad-nahs',
      sourceText: 'ואם נשאלת אם ראוי לתת הלוואה — הוצא צורה מן השביעי והשמיני. אם מיטיבה — ייתן וייטב הדבר; ואם מזיקה — הדין להפך.',
      verdictBySaadNahs: {
        saad:  { text: 'ראוי לתת את ההלוואה', positive: true },
        nahs:  { text: 'לא ראוי לתת הלוואה', positive: false },
        mixed: { text: 'לשקול היטב לפני מתן הלוואה', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'borrower',
        checkType: 'house-quality',
        houses: [7],
        label: 'מצב הלווה',
        sourceText: 'התבונן בשביעי — בית הלווה/הנתבע.',
      },
      {
        id: 'money-available',
        checkType: 'house-quality',
        houses: [2],
        label: 'ממון זמין',
        sourceText: 'התבונן בשני — בית הממון.',
      },
    ],
    keyHouses: [2, 7, 8],
  },

  // ────────────────────────────────────────────────────────────────────────
  deathInheritance: {
    topicId: 'deathInheritance',
    topicHebrewName: 'מוות וירושה',
    sourceRef: 'כשף אל-אסרר, עמ׳ 234-235',
    topicDescription: 'שאלה על מוות, ירושה, ופחד.',
    primaryFormula: {
      type: 'house-quality',
      houses: [8],
      interpretBy: 'saad-nahs',
      sourceText: 'אם הצורה שבבית השמיני היא מיטיבה — הדבר מורה על ביטחון מפחד, על אריכות ימים, על ירושה או ממון נעלם שיבוא. אם מזיקה — הפחד מרובה.',
      verdictBySaadNahs: {
        saad:  { text: 'בית שמיני מיטיב — ביטחון, ירושה, אריכות ימים', positive: true },
        nahs:  { text: 'בית שמיני מזיק — פחד, חוסר ביטחון', positive: false },
        mixed: { text: 'בית שמיני ממוזג — מצב בינוני', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'death-quality',
        checkType: 'count-quality',
        houses: [1, 2, 8, 6, 4],
        label: 'בתי המוות',
        sourceText: 'בעניין ירושה ומיתה: התבונן בראשון, בשני, בשמיני, בשישי וברביעי. אם נמצאו בהם צורות מיטיבות — דון שמיתתו טובה.',
      },
    ],
    keyHouses: [1, 2, 4, 6, 8],
  },

  // ────────────────────────────────────────────────────────────────────────
  travel: {
    topicId: 'travel',
    topicHebrewName: 'נסיעה ומסע',
    sourceRef: 'כשף אל-אסרר, עמ׳ 237-239',
    topicDescription: 'האם הנסיעה מבורכת? מה תוצאתה?',
    primaryFormula: {
      type: 'assemble',
      houses: [1, 3, 5, 9],
      interpretBy: 'saad-nahs',
      sourceText: 'קח את שורת יסוד האש של הראשון, השלישי, החמישי והתשיעי. אם זוגית — שתי נקודות; יחידית — נקודה אחת. עשה כן גם ביסוד האוויר, המים והעפר, והוצא מן הכול צורה. אם מיטיבה — המסע נאה; ואם מזיקה — היזהר.',
      verdictBySaadNahs: {
        saad:  { text: 'המסע מבורך ונאה', positive: true },
        nahs:  { text: 'המסע מסוכן — יש להיזהר', positive: false },
        mixed: { text: 'המסע עם אתגרים אך אפשרי', positive: null },
      },
    },
    altFormula: {
      type: 'house-quality',
      houses: [9],
      interpretBy: 'saad-nahs',
      sourceText: 'כלל מעשי בדין הנוסע: אם התשיעי והרביעי מיטיבים — המסע מבורך וסופו לטובה.',
      verdictBySaadNahs: {
        saad:  { text: 'בית המסע (תשיעי) מיטיב — נסיעה טובה', positive: true },
        nahs:  { text: 'בית המסע מזיק — נסיעה קשה', positive: false },
        mixed: { text: 'בית המסע ממוזג', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'travel-houses',
        checkType: 'count-quality',
        houses: [3, 5, 9],
        label: 'בתי הנסיעה',
        sourceText: 'דע כי בתי המסע ביבשה הם התשיעי והשלושה-עשר. אם ראית בהם צורות מיטיבות — דון לשלום ולטובה.',
      },
      {
        id: 'foundation-house',
        checkType: 'house-quality',
        houses: [4],
        label: 'הבסיס לנסיעה',
        sourceText: 'בדין הנוסע: כלל מעשי — אם התשיעי והרביעי מיטיבים — המסע מבורך.',
      },
    ],
    keyHouses: [1, 3, 5, 9, 13],
  },

  // ────────────────────────────────────────────────────────────────────────
  missingPerson: {
    topicId: 'missingPerson',
    topicHebrewName: 'נעדר ובורח',
    sourceRef: 'כשף אל-אסרר, עמ׳ 248-252',
    topicDescription: 'מצב הנעדר — חי או מת? יחזור או לא?',
    primaryFormula: {
      type: 'house-quality',
      houses: [7],
      interpretBy: 'dakhal-kharij',
      sourceText: 'התבונן בבית השביעי — בית הנעדר. אם צורה מיטיבה פנימית — הדבר מורה על בואו בשלום. אם קבועה — שוהה. אם מיטיבה חיצונית — יצא מן העיר.',
      verdictByDakhalKharij: {
        kharij:          { text: 'הנעדר בדרך — יצא מן העיר, רחוק', positive: null },
        'mujassad-kharij': { text: 'הנעדר בין כאן לשם', positive: null },
        dakhil:          { text: 'הנעדר בא — צפוי לחזור בשלום', positive: true },
        'mujassad-dakhil': { text: 'הנעדר קבוע במקומו — לא זזים', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [1, 4],
      interpretBy: 'saad-nahs',
      sourceText: 'לדעת אם הנעדר חי: הוצא צורה מן הראשון והרביעי, וצורה מן החמישי והשמיני, ומהן צורה שלישית. אם נולדה צורת חיים — דון לחיים.',
      verdictBySaadNahs: {
        saad:  { text: 'סיכוי שהנעדר חי', positive: true },
        nahs:  { text: 'חשש לחיי הנעדר', positive: false },
        mixed: { text: 'מצב לא ודאי', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'death-check',
        checkType: 'count-quality',
        houses: [3, 5, 9],
        label: 'בדיקת חיים',
        sourceText: 'התבונן בשלישי, בחמישי ובתשיעי. אם אחת מהן חוזרת בשמיני — הרי הוא מת, ובפרט אם שם לבן, חיבור או סוהר.',
      },
      {
        id: 'journey-house',
        checkType: 'house-quality',
        houses: [9],
        label: 'מצב הדרך',
        sourceText: 'אחר כך התבונן בתשיעי: אם הוא מיטיב — לבו טוב ודרכו נוחה.',
      },
      {
        id: 'status',
        checkType: 'count-quality',
        houses: [1, 2, 3, 5, 7],
        label: 'מצב כללי',
        sourceText: 'אם בראשון, בשני, בשלישי, בחמישי ובשביעי נמצאו צורות מיטיבות פנימיות — הרי הוא בא בלא ספק.',
      },
    ],
    keyHouses: [1, 3, 5, 7, 8, 9, 15],
  },

  // ────────────────────────────────────────────────────────────────────────
  dream: {
    topicId: 'dream',
    topicHebrewName: 'משמעות החלום',
    sourceRef: 'כשף אל-אסרר, עמ׳ 254 (השער התשיעי — ראיית חלום)',
    topicDescription: 'האם החלום מבשר טוב או רע.',
    primaryFormula: {
      type: 'house-quality',
      houses: [9],
      interpretBy: 'saad-nahs',
      sourceText: 'דין החלום נלמד מן הבית התשיעי. אם הצורה השוכנת בו מיטיבה — דון לטוב; ואם היא מזיקה — דון להפך.',
      verdictBySaadNahs: {
        saad:  { text: 'החלום מבשר טוב', positive: true },
        nahs:  { text: 'החלום מבשר רע', positive: false },
        mixed: { text: 'משמעות החלום מעורבת', positive: null },
      },
    },
    keyHouses: [9],
  },

  // ────────────────────────────────────────────────────────────────────────
  authorityState: {
    topicId: 'authorityState',
    topicHebrewName: 'כבוד ושררה',
    sourceRef: 'כשף אל-אסרר, עמ׳ 256-260',
    topicDescription: 'האם המינוי יתקיים? מה מצב השלטון?',
    primaryFormula: {
      type: 'combine',
      houses: [1, 10],
      interpretBy: 'benefic-planet',
      sourceText: 'הולד צורה מן הראשון והעשירי. אם היא מן צורות שני המאורות — השמש והירח — או מן שני הכוכבים המיטיבים — צדק ונוגה — השררה מתקיימת. ואם לא — אינה מתקיימת.',
      verdictByBeneficPlanet: {
        benefic: { text: 'המינוי יתקיים — הצורה מכוכבי הטוב', positive: true },
        malefic: { text: 'המינוי לא יתקיים — הצורה ממזיקים', positive: false },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [7, 10],
      interpretBy: 'saad-nahs',
      sourceText: 'הולד צורה מן השביעי והעשירי. אם יצאה מיטיבה — דון לטובה. ואם מזיקה — דון לרעה.',
      verdictBySaadNahs: {
        saad:  { text: 'מצב השלטון טוב', positive: true },
        nahs:  { text: 'מצב השלטון קשה', positive: false },
        mixed: { text: 'מצב השלטון מעורב', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'pillars',
        checkType: 'count-quality',
        houses: [1, 4, 7, 10],
        label: 'ארבע היתדות',
        sourceText: 'ראה את ארבעת היתדות. אם כולן מיטיבות — אין לחשוש. אם מקצתן מיטיב — יש לפחד. ואם כולן מזיקות יוצאות — הוא מודח במהירות.',
      },
      {
        id: 'authority-house',
        checkType: 'house-quality',
        houses: [10],
        label: 'בית הכבוד',
        sourceText: 'ראה את הבית העשירי — בית המלכות והשלטון. אם נמצאת בו צורה מיטיבה — עמדתו חזקה.',
      },
      {
        id: 'public-support',
        checkType: 'house-quality',
        houses: [11],
        label: 'תמיכת הציבור',
        sourceText: 'אם באחד-עשר צורה מיטיבה — העם אוהב אותו; ואם מזיקה — העם שונא אותו.',
      },
    ],
    keyHouses: [1, 4, 7, 10, 11],
  },

  // ────────────────────────────────────────────────────────────────────────
  commerce: {
    topicId: 'commerce',
    topicHebrewName: 'מסחר ועסקים — מכירה וקנייה',
    sourceRef: 'כשף אל-אסרר, עמ׳ 218, 223 (יוקר וזול, קנייה ומכירה)',
    topicDescription: 'שאלה על עסקה, מכירה/קנייה ספציפית, והאם תושלם ברווח.',
    primaryFormula: {
      type: 'count-quality',
      houses: [1, 2, 4, 7, 11, 15, 16],
      interpretBy: 'count-quality',
      sourceText: 'במכירה וקנייה: התבונן בראשון, ברביעי, בשני, בשביעי, באחד־עשר, בחמישה־עשר ובשישה־עשר. אם כולן, או רובן, צורות מיטיבות פנימיות — הקנייה תושלם בקלות, ואחרית הקונה תהיה טובה. עשה את הראשון והשני לקונה, את השמיני והשביעי למוכר, את העשירי למתווך, ואת החמישה־עשר לאחרית הדבר.',
      verdictByCountQuality: {
        allSaad:  { text: 'העסקה תושלם בקלות, ואחרית הקונה טובה', positive: true },
        allNahs:  { text: 'העסקה תיתקל בקשיים ובעיכובים', positive: false },
        mostSaad: { text: 'רוב הסימנים נוטים להשלמת העסקה בטוב', positive: true },
        mostNahs: { text: 'רוב הסימנים נוטים לקושי בהשלמת העסקה', positive: false },
        mixed:    { text: 'התוצאה אינה ודאית', positive: null },
      },
    },
    altFormula: {
      type: 'house-quality',
      houses: [15],
      interpretBy: 'saad-nahs',
      sourceText: 'ואת החמישה־עשר לאחרית הדבר — התבונן בו לדעת את סוף העסקה.',
      verdictBySaadNahs: {
        saad:  { text: 'אחרית העסקה טובה', positive: true },
        nahs:  { text: 'אחרית העסקה קשה', positive: false },
        mixed: { text: 'אחרית העסקה מעורבת', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'buyer-vs-seller',
        checkType: 'house-in-house-check',
        mainHouse: 1,
        targetHouse: 8,
        label: 'קונה מול מוכר',
        sourceText: 'אם הראשון בא בשמיני, הקונה טוב מן המוכר.',
      },
      {
        id: 'buyer-generosity',
        checkType: 'house-in-house-check',
        mainHouse: 1,
        targetHouse: 10,
        label: 'נדיבות הקונה',
        sourceText: 'ואם הראשון בא בעשירי, הקונה נדיב מן המוכר.',
      },
      {
        id: 'goods-profit-loss',
        checkType: 'house-figure-description',
        houses: [5],
        label: 'סחורה — יוקר או רווח',
        sourceText: 'אם קונה שואל על סחורה — האם תתייקר או תוזל: אם מצאת שהבית החמישי חוזר בתשיעי, בעשירי או בשלושה־עשר, בשר לו ברווחים רבים. ואם הוא חוזר בשישי או בשמיני, יפסיד בלא ספק.',
      },
    ],
    keyHouses: [1, 2, 4, 7, 8, 10, 11, 15, 16],
  },

  // ────────────────────────────────────────────────────────────────────────
  yearlyForecast: {
    topicId: 'yearlyForecast',
    topicHebrewName: 'תחזית שנתית — יוקר וזול',
    sourceRef: 'כשף אל-אסרר, עמ׳ 221-222 (יוקר וזול; מתוספת נזהת אל-עוקול)',
    topicDescription: 'תחזית לשנה הקרובה — יוקר/זול, גשם ויבול.',
    primaryFormula: {
      type: 'combine',
      houses: [1, 5],
      interpretBy: 'saad-nahs',
      sourceText: 'תחילת השנה נידונית מן הראשון והחמישי: אם יצאה צורה מיטיבה — יהיה זול; ואם יצאה צורה מזיקה — להפך.',
      verdictBySaadNahs: {
        saad:  { text: 'תחילת השנה זולה וטובה', positive: true },
        nahs:  { text: 'תחילת השנה יקרה וקשה', positive: false },
        mixed: { text: 'תחילת השנה מעורבת', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [11, 15],
      interpretBy: 'saad-nahs',
      sourceText: 'אמצע השנה נידון מן האחד־עשר והחמישה־עשר.',
      verdictBySaadNahs: {
        saad:  { text: 'אמצע השנה טוב', positive: true },
        nahs:  { text: 'אמצע השנה קשה', positive: false },
        mixed: { text: 'אמצע השנה מעורב', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'harvest',
        checkType: 'house-quality',
        houses: [4],
        label: 'זריעה ויבול',
        sourceText: 'התבונן בבית הרביעי. אם הוא צורה חזקה ומיטיבה, הדבר מורה על ריבוי זריעה וטוב. ואם הוא צורה מזיקה — להפך.',
      },
      {
        id: 'rain-sign',
        checkType: 'house-figure-description',
        houses: [4],
        label: 'סימני גשם',
        sourceText: 'אם יצאו בבית הרביעי צורות מיסוד המים, השנה גשומה, ובפרט אם הופיעה קהלה[] בו וחזרה במערך. ואם יצאה בו צורה שהיא מיסוד האוויר או מיסוד האש, הדבר מורה על ארבה, יוקר ומיעוט גשמים.',
      },
    ],
    // סוף השנה (בתים 7,16) ובדיקת מאזן נקודות יסוד-אש+אוויר מול מים+עפר
    // מצוטטים במלואם אך אינם מקודדים — דורשים סוג נוסחה (איזון-יסודות) שאינו
    // קיים עדיין במנוע (יש רק saad-nahs / dakhal-kharij / count-quality).
    additionalMethods: [
      {
        id: 'end-of-year',
        label: 'סוף השנה',
        sourceStatus: 'explicit-in-source',
        sourceText: 'סוף השנה — מן השביעי והשישה־עשר.',
      },
      {
        id: 'element-balance-price',
        label: 'יוקר/זול לפי איזון היסודות',
        sourceStatus: 'explicit-in-source',
        sourceText: 'קח את הבית השני, החמישי, העשירי והאחד־עשר ועשה אותם לאמהות; השלם מהם את המערך עד הבית השישה־עשר. אחר כך חבר את יסוד האש ויסוד האוויר לחוד, ואת יסוד המים ויסוד העפר לחוד. אם יסוד האש והאוויר מרובים אפילו בנקודה אחת, הדבר מורה על יוקר. ואם יסוד המים והעפר מרובים, הדבר מורה על זול.',
      },
    ],
    keyHouses: [1, 4, 5, 7, 10, 11, 15, 16],
  },

  // ────────────────────────────────────────────────────────────────────────
  partnership: {
    topicId: 'partnership',
    topicHebrewName: 'שותפות',
    sourceRef: 'כשף אל-אסרר, עמ׳ 212-213 (המנצח והמנוצח — מריבות, שותפות)',
    topicDescription: 'האם השותפות העסקית כדאית וטובה?',
    primaryFormula: {
      type: 'combine',
      houses: [1, 7],
      interpretBy: 'saad-nahs',
      sourceText: 'וכן דון בשותף מן הראשון והשביעי, ומן החמישי והשביעי, מפני שהם בתי מזגם. מה שמיטיב — דון בו לטוב; ומה שמזיק — דון בו להפך.',
      verdictBySaadNahs: {
        saad:  { text: 'השותפות טובה', positive: true },
        nahs:  { text: 'השותפות מזיקה', positive: false },
        mixed: { text: 'השותפות מעורבת — יש בה מעלות וחסרונות', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [5, 7],
      interpretBy: 'saad-nahs',
      sourceText: 'וכן דון בשותף... מן החמישי והשביעי, מפני שהם בתי מזגם.',
      verdictBySaadNahs: {
        saad:  { text: 'הבדיקה הנוספת מאשרת: שותפות טובה', positive: true },
        nahs:  { text: 'הבדיקה הנוספת מאשרת: שותפות מזיקה', positive: false },
        mixed: { text: 'הבדיקה הנוספת: מצב מעורב', positive: null },
      },
    },
    // שיטת "חלוקה לשניים" (עמ׳ 213) דורשת סכימת נקודות גולמית של הלוח,
    // שאינה נתמכת כרגע במנוע החישוב — מצוטטת במלואה, לא מקודדת אוטומטית.
    additionalMethods: [
      {
        id: 'divide-by-two-parity',
        label: 'בשותפות — האם יש בה טובה (חלוקה לשניים)',
        sourceStatus: 'explicit-in-source',
        sourceText: 'בשותפות — האם יש בה טובה? חלק את הסכום לשניים־שניים. אם נשאר אחד — אין בה טובה; ואם נשארו שניים — יש בה טוב והיא ראויה.',
      },
    ],
    keyHouses: [1, 5, 7],
  },

  // ────────────────────────────────────────────────────────────────────────
  prisoner: {
    topicId: 'prisoner',
    topicHebrewName: 'אסיר וכלוא',
    sourceRef: 'כשף אל-אסרר, עמ׳ 166',
    topicDescription: 'מצב הכלוא — האם ישוחרר?',
    primaryFormula: {
      type: 'combine',
      houses: [2, 12],
      interpretBy: 'dakhal-kharij',
      sourceText: 'ולאסיר קח מן השני והשנים-עשר צורה.',
      verdictByDakhalKharij: {
        kharij:          { text: 'הצורה חיצונית — האסיר ישוחרר', positive: true },
        'mujassad-kharij': { text: 'נוטה לשחרור', positive: true },
        dakhil:          { text: 'הצורה פנימית — האסיר נשאר כלוא', positive: false },
        'mujassad-dakhil': { text: 'נוטה להמשך מאסר', positive: false },
      },
    },
    supportingChecks: [
      {
        id: 'captivity-house',
        checkType: 'house-quality',
        houses: [12],
        label: 'בית הכלא',
        sourceText: 'התבונן בשנים-עשר — בית הכלא ואויבים נסתרים.',
      },
    ],
    keyHouses: [1, 2, 6, 12],
  },

  // ────────────────────────────────────────────────────────────────────────
  fear: {
    topicId: 'fear',
    topicHebrewName: 'פחד וסכנה',
    sourceRef: 'כשף אל-אסרר, עמ׳ 236, 274',
    topicDescription: 'האם יש סכנה ממשית, והאם הפחד יחלוף.',
    primaryFormula: {
      type: 'combine',
      houses: [7, 8],
      interpretBy: 'saad-nahs',
      sourceText: 'והפחד נידון מן השביעי והשמיני: אם הדין מיטיב — הפחד בטל; ואם הוא מזיק — הפחד עומד במקומו.',
      verdictBySaadNahs: {
        saad:  { text: 'הפחד בטל, אין סכנה ממשית', positive: true },
        nahs:  { text: 'הפחד קיים, יש חשש ממשי', positive: false },
        mixed: { text: 'המצב מעורב — יש להיזהר בלי בהלה', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'house8-quality',
        checkType: 'house-quality',
        houses: [8],
        label: 'מזל בית השמיני',
        sourceText: 'אם הצורה שבבית השמיני היא מזיקה ופנימית, הדבר מורה על פחד חזק, אך סופו של האדם בתשובה, שלום ופיוס. ואם היא מיטיבה ויוצאת, יינצל השואל מן הפחד, ייכנס בידו ממון, והסוף נוטה לטובה. ואם היא מזיקה ויוצאת, הפחד מרובה ואין ביטחון.',
      },
      {
        id: 'house8-direction',
        checkType: 'house-dakhal-kharij',
        houses: [8],
        label: 'כיוון בית השמיני',
        sourceText: 'ראה גם אם צורת בית השמיני נכנסת או יוצאת — משפיע על אופי הפחד ועל אחריתו (ראה פירוט מלא בבדיקת "מזל בית השמיני").',
      },
    ],
    keyHouses: [7, 8],
  },

  // ────────────────────────────────────────────────────────────────────────
  religion: {
    topicId: 'religion',
    topicHebrewName: 'דת וצדיקות',
    sourceRef: 'כשף אל-אסרר, עמ׳ 253',
    topicDescription: 'רמת הדתיות והצדיקות של הנשאל.',
    primaryFormula: {
      type: 'count-quality',
      houses: [3, 9],
      interpretBy: 'count-quality',
      sourceText: 'בדין הדת והצדקות: אם בבית השלישי והתשיעי יש צורה מזיקה — הוא מועט בדת. ואם יש שם צורה מיטיבה — הוא בעל דת ויראת אלוהים.',
      verdictByCountQuality: {
        allSaad:    { text: 'שני בתי הדת מיטיבים — בעל דת ויראת שמים', positive: true },
        mostSaad:   { text: 'רוב בתי הדת מיטיבים — דתי למדי', positive: true },
        mostNahs:   { text: 'רוב בתי הדת מזיקים — מועט בדת', positive: false },
        allNahs:    { text: 'שני בתי הדת מזיקים — רחוק מדת', positive: false },
        mixed:      { text: 'מעורב בדת — יש גם יש', positive: null },
      },
    },
    supportingChecks: [],
    keyHouses: [3, 9],
  },

  // ────────────────────────────────────────────────────────────────────────
  generalReading: {
    topicId: 'generalReading',
    topicHebrewName: 'קריאה כללית',
    sourceRef: 'כשף אל-אסרר, עמ׳ 166-174',
    topicDescription: 'קריאה כוללת של מצב השואל ועניינו.',
    primaryFormula: {
      type: 'combine',
      houses: [1, 4],
      interpretBy: 'saad-nahs',
      sourceText: 'אם רצית לערוך הכאה לדבר מסוים, קח מן הראשון והרביעי צורה, והיא תורה על מבוקשך.',
      verdictBySaadNahs: {
        saad:  { text: 'הצורה הכללית מיטיבה — העניין נוטה לטובה', positive: true },
        nahs:  { text: 'הצורה הכללית מזיקה — העניין נוטה לרעה', positive: false },
        mixed: { text: 'הצורה הכללית ממוזגת — עניין מורכב', positive: null },
      },
    },
    altFormula: {
      type: 'combine',
      houses: [1, 7, 10, 11],
      interpretBy: 'saad-nahs',
      sourceText: 'לדעת את תוצאת עניינו של השואל: הוצא צורה מן הבית הראשון והשביעי, וצורה נוספת מן העשירי והאחד-עשר. אחר כך צרף אותן.',
      verdictBySaadNahs: {
        saad:  { text: 'תוצאת העניין — לטובה', positive: true },
        nahs:  { text: 'תוצאת העניין — לרעה', positive: false },
        mixed: { text: 'תוצאת העניין — מורכבת', positive: null },
      },
    },
    supportingChecks: [
      {
        id: 'pillars',
        checkType: 'count-quality',
        houses: [1, 4, 7, 10],
        label: 'ארבע היתדות',
        sourceText: 'התבונן בארבע היתדות — הראשון, הרביעי, השביעי והעשירי. אם כולן מיטיבות — הבקשה תיענה.',
      },
      {
        id: 'outcome',
        checkType: 'house-quality',
        houses: [15],
        label: 'אחרית העניין',
        sourceText: 'התבונן בחמישה-עשר — בית אחרית עניינו.',
      },
    ],
    keyHouses: [1, 4, 7, 10, 15, 16],
  },

};

/**
 * מחזיר כללי נושא לפי מזהה
 */
export function getTopicRules(topicId) {
  return KASHF_TOPIC_RULES[topicId] || null;
}

/**
 * מחזיר רשימת כל מזהי הנושאים
 */
export function getAllTopicIds() {
  return Object.keys(KASHF_TOPIC_RULES);
}

/**
 * מחזיר שם עברי של נושא
 */
export function getTopicHebrewName(topicId) {
  return KASHF_TOPIC_RULES[topicId]?.topicHebrewName || topicId;
}

export default { KASHF_TOPIC_RULES, getTopicRules, getAllTopicIds, getTopicHebrewName };
