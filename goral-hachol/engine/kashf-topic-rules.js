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
// 'fire-row-assemble': קח ראש (שורת-אש) מ-4 בתים → צורה חדשה → כרינ׳/דח׳ל
// 'combine':           חיבור רמל של N בתים → צורה חדשה → מיטיב/מזיק או כרינ׳/דח׳ל
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
    topicHebrewName: 'מריבות, שותפות ומשפט',
    sourceRef: 'כשף אל-אסרר, עמ׳ 212',
    topicDescription: 'מי גובר במחלוקת? מה סיכוי השותפות?',
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
    topicHebrewName: 'מסחר ועסקים',
    sourceRef: 'כשף אל-אסרר, עמ׳ 179-182',
    topicDescription: 'שאלה על מסחר, עסקאות, ורווח.',
    primaryFormula: {
      type: 'combine',
      houses: [2, 10],
      interpretBy: 'saad-nahs',
      sourceText: 'אם רצית לשאול על בית ממונך ופרנסתך: התבונן בבית השני ובעשירי שהוא בית הפרנסות.',
      verdictBySaadNahs: {
        saad:  { text: 'המסחר מבורך ורווחי', positive: true },
        nahs:  { text: 'המסחר קשה, יש הפסדים', positive: false },
        mixed: { text: 'המסחר בינוני', positive: null },
      },
    },
    altFormula: {
      type: 'assemble',
      houses: [2, 4, 6, 8],
      interpretBy: 'dakhal-kharij',
      sourceText: 'קח את השני, הרביעי, השישי והשמיני, והעמד מהם צורה — זו מורה על כספי הנשאל עליו.',
      verdictByDakhalKharij: {
        kharij:          { text: 'הכסף יוצא, רווח נמוך', positive: false },
        'mujassad-kharij': { text: 'הכסף נוטה לצאת', positive: false },
        dakhil:          { text: 'הכסף נכנס, רווח טוב', positive: true },
        'mujassad-dakhil': { text: 'הכסף נוטה להיכנס', positive: true },
      },
    },
    supportingChecks: [
      {
        id: 'money-house',
        checkType: 'house-quality',
        houses: [2],
        label: 'בית הממון',
        sourceText: 'התבונן בשני — בית הממון.',
      },
      {
        id: 'livelihood',
        checkType: 'house-quality',
        houses: [10],
        label: 'בית הפרנסה',
        sourceText: 'התבונן בעשירי — בית הפרנסות.',
      },
    ],
    keyHouses: [2, 6, 8, 10],
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
