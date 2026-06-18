/**
 * kashf-topics-per-house.js
 *
 * רשימת כל הנושאים הניתנים לשאלה לפי 12 הבתים.
 * מקורות (נבדקו במלואם):
 *   1. ספר כשף אל-אסרר (מובנה באפליקציה) — שער שישי, עמ' 166-276
 *   2. القول الجامع في علم الرمل — שייח' מוחמד סאס (58 עמ') — "PDF1"
 *   3. حاوي العجائب ومظهر الغرائب — אחמד בן זנבל (62 עמ') — "PDF2"
 *
 * sourceNote:
 *   'multi-source'          → מאושש ב-2 מקורות ומעלה
 *   'source: PDF1 p.XX'     → القول الجامع בלבד
 *   'source: PDF2 ch.XX'    → حاوي العجائب בלבד
 *   'source: kashf'         → כשף אל-אסרר בלבד
 *
 * כל נושא מצוין עם:
 *   - label      : שם קצר לתצוגה
 *   - description: תיאור מה נבדק + מתודולוגיה מהמקורות
 *   - implemented: האם ממומש באפליקציה
 *   - topicId    : המזהה הקיים (אם ממומש)
 *   - sourceNote : מקור ואישור
 */

export const KASHF_TOPICS_PER_HOUSE = {

  1: {
    houseNameHebrew: 'בית החיים — הנפש והשואל',
    sourceNoteHouse: 'multi-source — PDF1 p.24 (النفس والروح والحياة، صحة الجسم، البصر والسمع), PDF2 ch.1, kashf',
    topics: [
      { label: 'מצב השואל הכללי',        description: 'כוח הנפש, מצב האדם עכשיו — PDF1: النفس والروح والحياة، صحة الجسم والأمور النفسية والجسمية',         implemented: true,  topicId: 'foundations',   sourceNote: 'multi-source' },
      { label: 'האם העניין יצליח',        description: 'האם הצורך יתמלא — לפי סעד/נחס ויתדות',            implemented: true,  topicId: 'completion',    sourceNote: 'multi-source' },
      // הערה: כישוף/עין הרע שייך לבית 6 (الشعوذة מפורש שם בספר). בית 1 נכנס לאבחון רוחני רק כבית השואל — לא כבית ספציפי לנושא.
      { label: 'אסתח׳ארה',                description: 'שאלת כוונה ורשות — 21 פעמים בטהרה',               implemented: false, topicId: null,            sourceNote: 'source: kashf' },
      { label: 'מולד / גורל האדם',        description: 'מצב האדם מלידה לפי בית 1 כטאלע — PDF2 p.51: إعمل بالضمير من باب الضمير',                           implemented: true,  topicId: 'birthNativity', sourceNote: 'multi-source' },
      { label: 'אורך חיים',               description: 'האם יחיה ארוך — לפי צורות ארוכות/קצרות',          implemented: false, topicId: null,            sourceNote: 'source: kashf' },
      { label: 'מי מסתכל על מי',         description: 'האם אדם מסתכל על השואל או על אחר',                 implemented: false, topicId: null,            sourceNote: 'source: kashf' },
      { label: 'כיוון גיאוגרפי של העניין', description: 'מזרח/מערב/דרום/צפון לפי יסוד הצורה — PDF1: نار=דרום, ماء=צפון, هواء=מזרח, تراب=מערב',           implemented: false, topicId: null,            sourceNote: 'source: PDF1 p.30' },
    ],
  },

  2: {
    houseNameHebrew: 'בית הממון — כסף ורכוש',
    sourceNoteHouse: 'multi-source — PDF1 p.24 (المال والمكاسب والبيع والشراء والكنوز والدفاين), PDF2 ch.2, kashf',
    topics: [
      { label: 'ממון וכסף',               description: 'כמה כסף, מאיפה מגיע, האם יגיע — PDF1: المال والمكاسب والبيع والشراء والأعوان',                    implemented: true,  topicId: 'commerce',          sourceNote: 'multi-source' },
      { label: 'האם חוב יוחזר',           description: 'נושה ומדיון — מי יגבר',                           implemented: true,  topicId: 'loan',              sourceNote: 'multi-source' },
      { label: 'ירושה',                   description: 'מי יורש את מי, ממון ירושה',                        implemented: true,  topicId: 'deathInheritance',  sourceNote: 'multi-source' },
      { label: 'פרנסה ומחיה',             description: 'מצב הפרנסה, מאיפה תבוא הפרנסה — PDF1: المكاسب، مال الأب، ما يملكه أو يقبضه',                    implemented: false, topicId: null,                sourceNote: 'multi-source — PDF1 p.24, PDF2 ch.2' },
      { label: 'מקור הכסף',               description: 'מאיפה מגיע הכסף: שלטון / נשים / מסחר / ירושה / ספרים — לפי כוכב בעל הבית',                      implemented: false, topicId: null,                sourceNote: 'source: kashf' },
      { label: 'מטמון / כנוז תת-קרקעי',  description: 'PDF1 p.24: والكنوز والدفاين — בית 2 מורה גם על מטמונות. שיטה: בית 2+6 יחד עם בית 4',             implemented: false, topicId: null,                sourceNote: 'source: PDF1 p.24' },
    ],
  },

  3: {
    houseNameHebrew: 'בית האחים — קשרי משפחה ותנועה',
    sourceNoteHouse: 'multi-source — PDF1 p.24 (الأخوة والأخوات والأصدقاء والحركات الصغيرة والسفر القريب والهدايا والمنامات), PDF2 ch.3, kashf',
    topics: [
      { label: 'אחים ושכנים',             description: 'מצב האח, קרוב משפחה, שכן — PDF1: الأخوة والأخوات والأصدقاء',                                      implemented: true,  topicId: 'siblings',  sourceNote: 'multi-source' },
      { label: 'האם לעבור מקום',          description: 'להישאר או לעבור — בית 3 = תנועה קצרה; השוואה: ב1+ב2 (כאן) מול ב7+ב8 (שם)',                        implemented: false, topicId: null,        sourceNote: 'source: kashf' },
      { label: 'איזו עיר עדיפה',          description: 'השוואה בין שתי ערים — ב1+ב2 מול ב7+ב8',           implemented: false, topicId: null,        sourceNote: 'source: kashf' },
      { label: 'תנועה ונסיעה קצרה',       description: 'PDF1 p.24: الحركات الصغيرة والسفر القريب — מעבר בתוך האזור, נסיעה פנים-ארצית',                    implemented: false, topicId: null,        sourceNote: 'multi-source — PDF1 p.24, PDF2 ch.3' },
      { label: 'חלום (קצר-טווח)',          description: 'PDF1 p.24: والمنامات — בית 3 כולל חלומות רגילים; חלומות רוחניים בבית 9',                          implemented: false, topicId: null,        sourceNote: 'source: PDF1 p.24' },
      { label: 'מסרים והודעות',           description: 'PDF1 p.24: والهدايا — בית 3 = מסרים, שליחויות, מתנות',                                            implemented: false, topicId: null,        sourceNote: 'source: PDF1 p.24' },
    ],
  },

  4: {
    houseNameHebrew: 'בית ההורים — נכסים ונסתרות',
    sourceNoteHouse: 'multi-source — PDF1 p.24 (العاقبة، الآباء، الأراضي، الكنوز، السحر، الأسرار القديمة), PDF2 ch.16 (الخبينة), kashf',
    topics: [
      { label: 'מטמון / חפץ נסתר (ח׳בינה)',description: 'PDF2 ch.16 (الخبينة): חלק את הלוח ל-4 כיוונים — ב1+ב7=מזרח/מערב, ב4+ב10=צפון/דרום. בית 2+6+8 לאישור. כוכב בטאלע מורה על מיקום מדויק.',  implemented: true,  topicId: 'hiddenTreasure', sourceNote: 'multi-source — PDF2 ch.16, kashf' },
      { label: 'מצב האב / הבית / הקרקע', description: 'PDF1 p.24: الآباء والأمهات والزراعات والعقارات والأراضي والأطعمة والبناءات — בית 4 = בסיס, בית, נדל״ן', implemented: false, topicId: null,             sourceNote: 'multi-source — PDF1 p.24, PDF2 ch.4' },
      { label: 'קידוח בארות / עומק מים',  description: 'האם יש מים, באיזה עומק, אכדאד אל-הנדי',           implemented: false, topicId: null,             sourceNote: 'source: kashf' },
      { label: 'כיוון לחפירה / חיפוש',    description: 'מזרח/מערב/דרום/צפון לפי יסוד הצורה; PDF2 ch.16: احسب النقط لكل جهة من الأول والسابع',                implemented: false, topicId: null,             sourceNote: 'multi-source — PDF2 ch.16, kashf' },
      { label: 'נסתרות / סודות',          description: 'PDF1 p.24: الخبايا والأسرار القديمة — דבר חבוי שלא ידוע; גם: כישוף קבור (מוזכר בבית 4 ב-PDF1)',    implemented: false, topicId: null,             sourceNote: 'source: PDF1 p.24' },
      { label: 'סיבת המחלה',              description: 'PDF1 p.24: بيت سبب المرض — בית 4 הוא "בית סיבת המחלה"; שיטה: השווה ב4 עם ב6 לבחינת מקור',         implemented: false, topicId: null,             sourceNote: 'source: PDF1 p.24' },
    ],
  },

  5: {
    houseNameHebrew: 'בית הבנים — ילדים והריון',
    sourceNoteHouse: 'multi-source — PDF1 p.24 (الفرح الأصغر، الأولاد، الأفراح، الملابس), PDF2 ch.15 (هل يكون له ولد), kashf',
    topics: [
      { label: 'האם יש הריון',            description: 'בדיקת הריון קיים לפי בית 5 ועדים',                 implemented: true,  topicId: 'childrenPregnancy',  sourceNote: 'multi-source' },
      { label: 'זכר או נקבה',             description: 'PDF2 ch.15: הסתכל בצורה שבבית 11. אחר כך בית 5. נארי/הוואאי=זכר, מאאי/תראבי=נקבה. (الجودلة وحمرة في الخامس عشر = كثرة البنات)',  implemented: false, topicId: null, sourceNote: 'multi-source — PDF2 ch.15, kashf' },
      { label: 'חשש להפלה',              description: 'PDF2 ch.15: الانكيس في الخامس عشر = עצירת הילדים — قيام العقلة في الخامس عشر من جودلة / وانكيس وحمرة في الثالث عشر = כמות ופחד מהמוות',  implemented: false, topicId: null, sourceNote: 'source: PDF2 ch.15' },
      { label: 'כמה חודשים הריון',        description: 'PDF2 (שיטת אבו סעיד הטרבלסי): מנה 16 בתי הרמל; ספור פתוחות ומסגורות מבית 1 עד 16, חסר 9 = מה שנותר = חודשים שעברו',              implemented: false, topicId: null, sourceNote: 'source: PDF2 (ch.15 continuation)' },
      { label: 'לידה קלה או כבדה',       description: 'כח אלד — כבד/קל לפי צורה; PDF2: اجتماع = לידה של בנות/בנים מנשים שונות',                                                         implemented: false, topicId: null, sourceNote: 'source: PDF2 ch.15' },
      { label: 'מצב הילדים',             description: 'PDF1 p.24: الأولاد — בריאות, עתיד, מזל הילד',      implemented: false, topicId: null, sourceNote: 'multi-source — PDF1 p.24, kashf' },
      { label: 'אורך חיים של הילד',      description: 'ארוך/קצר לפי צורות',                                implemented: false, topicId: null, sourceNote: 'source: kashf' },
      { label: 'שמחות ואירועים',          description: 'PDF1 p.24: الأفراح والطعام والشراب والأخبار والرسائل والولائم والحفلات — שמחות, אירועים, ביגוד',  implemented: false, topicId: null, sourceNote: 'source: PDF1 p.24' },
    ],
  },

  6: {
    houseNameHebrew: 'בית המחלות — חולה, אבוד, בהמות, כישוף',
    sourceNoteHouse: 'multi-source — PDF1 p.24+57 (العبيد والأمراض والسرقة), kashf line 963 (الشعوذة والحسد والشيء الخفي), PDF2 ch.6+8',
    topics: [
      { label: 'האם החולה יחלים',         description: 'PDF1 p.41: הסתכל בבית 1+6+8+12 ועד. קבץ דאח׳ל+נוסרה דאח׳לה+נקי ח׳ד+עקלה = ישתפר. ג׳ודלה+חמרה+ביאד+ג׳מאעה+אג׳תמאע+טריק = סכנה',  implemented: true,  topicId: 'illness',             sourceNote: 'multi-source — PDF1 p.41, PDF2 ch.8, kashf' },
      { label: 'מיקום המחלה בגוף',       description: 'PDF1 p.57: العضو الذي يؤلم المريض 8×6 — כפל ב6 ב-ב8; מיפוי לגוף: ראה טבלת "צורה→איבר" מעמ׳ 16 PDF1: אחיאן=צוואר, ג׳מאעה=טבור, חמרה=גב, טריק=איבר מין, קבץ ח׳ארג׳=ירך ימין...',  implemented: false, topicId: null,                  sourceNote: 'multi-source — PDF1 p.16+57, kashf' },
      { label: 'סוג המחלה (אח׳לאט)',     description: 'PDF1 p.41: נארי=מרה צהובה, מאאי=ליחה, הוואאי=דם, תראבי=מרה שחורה. גם שיטת אסקאט: שארית 4=ליחה/מים, 5=דם/אוויר, 6=מרה שחורה/עפר, 7=מרה צהובה/אש',  implemented: false, topicId: null,                  sourceNote: 'multi-source — PDF1 p.41+58' },
      { label: 'האם ימות',               description: 'PDF1 p.41-42: סימני מוות: ג׳ודלה+חמרה+ביאד+ג׳מאעה+אג׳תמאע+טריק. חמרה בב6 + אנכיס בב8 = "הגלב עليهم الموت". בית 14 (עאקבה) — נחס חזק = מוות',  implemented: false, topicId: null,                  sourceNote: 'source: PDF1 p.41-42' },
      { label: 'בהמה / חיה אבודה',       description: 'PDF1 p.24: الأمراض والدواب والآبق — האם תחזור, איפה היא. הסתכל ב6 לאישור האבידה ובבית 7 לגנב/איבוד',                                     implemented: false, topicId: null,                  sourceNote: 'multi-source — PDF1 p.24, kashf' },
      { label: 'אבחון רוחני — כישוף / עין / ג׳ין', description: 'kashf line 963: الشعوذة والحسد والشيء الخفي. PDF1 p.57: אנכיס בב6=קבור בקבר, ג׳ודלה בב6=כישוף שתייה, קבץ דאח׳ל בב6=עקוד מנשים, ג׳מאעה בב6 (מ-2 אנכיסים)=שניים קבורים, מחודש כל תקופה',  implemented: true,  topicId: 'spiritualDiagnostics', sourceNote: 'multi-source — kashf line 963, PDF1 p.57' },
      { label: 'סוג הג׳ין (שיטת אסקאט)', description: 'PDF1 p.58: כפל ב15 ב-4; שארית: 1=ג׳ין (ממוסס), 2=חסד/עין רעה, 3=כישוף ע"י אדם; נוסף: נארי=ג׳ין אש, תראבי=ג׳ין אדמה, מאאי/הוואאי=ג׳ין טייר',  implemented: false, topicId: null,                  sourceNote: 'source: PDF1 p.57-58' },
    ],
  },

  7: {
    houseNameHebrew: 'בית הזוגיות — נישואין, שותפות, עסקאות',
    sourceNoteHouse: 'multi-source — PDF1 p.24+42-46 (الأزواج والشركة والمنازعات والسارق), PDF2 ch.7+12-15, kashf',
    topics: [
      { label: 'נישואין / זוגיות',        description: 'PDF1 p.45: ב1=שואל, ב7=בן/בת הזוג. בית 8 לאישור (ב7 מתחבר ב8 לב12). שמס=שואל; זהרה=מבוקשת. בית 13+14+15 כעדים',                       implemented: true,  topicId: 'marriage',     sourceNote: 'multi-source — PDF1 p.42-46, PDF2 ch.7, kashf' },
      { label: 'ת׳יב / בכר (האישה)',     description: 'PDF1 p.44: لمعرفة المرأة ثيب أم بكر — כפל 13×7; פתוחה=ת׳יב, מסגורת=בכר. PDF2 p.44: הסתכל בבית 11 (קבץ דאח׳ל) ותוצאה מציינת',               implemented: false, topicId: null,           sourceNote: 'multi-source — PDF1 p.44, PDF2 p.44' },
      { label: 'צניעות האישה',           description: 'PDF1 p.44: אם הזהרה + מריח׳ בבית 7+4 = פחיתות. אג׳תמאע מהשמס+קמר = לוואט. ביאד בב4 = סחאק. אם מריח׳ בטאלע + זהרה בב7+מריח׳ בב7 = זנות בעל',  implemented: false, topicId: null,           sourceNote: 'source: PDF1 p.43-44' },
      { label: 'אהבה ועשק',              description: 'האם מאוהב, עוצמת האהבה, אהבה הדדית — בתים 1+5+11',  implemented: true,  topicId: 'loveHate',     sourceNote: 'multi-source' },
      { label: 'סכסוך / תביעה',          description: 'מי ינצח — גאלב ומגלוב. PDF1 ch.16: الفصل السادس عشر الغالب والمغلوب. PDF2 ch.8: בתים 1+2+7+8; שופט=ב10; מגשרים=ב3+4+13+14',            implemented: true,  topicId: 'disputes',     sourceNote: 'multi-source — PDF1 ch.16, PDF2 ch.8, kashf' },
      { label: 'קנייה ומכירה',           description: 'PDF1 ch.9: بتم البيع والشراء. בתים 1+2+7+8+9+10 — שואל ב1, קונה ב7, כסף ב2+8',                                                          implemented: true,  topicId: 'commerce',     sourceNote: 'multi-source — PDF1 ch.9, PDF2 ch.13, kashf' },
      { label: 'שותפות',                 description: 'האם השותפות כדאית, מי ירוויח',                      implemented: true,  topicId: 'partnership',  sourceNote: 'multi-source' },
      { label: 'מלחמה / עימות',          description: 'מי ינצח, כוח הצבאות — PDF1 ch.21: الحرب والقتال',   implemented: true,  topicId: 'disputes',     sourceNote: 'multi-source' },
      { label: 'אויבים',                 description: 'מי האויב, כוחו, האם מסוכן — PDF1 p.24 ch.13 (عداء): ב7 = יריב ראשי',                                                                      implemented: true,  topicId: 'enemies',      sourceNote: 'multi-source' },
      { label: 'נעדר',                   description: 'מצב הנעדר — מיוצג בבית 7 כצד שני',                  implemented: true,  topicId: 'missingPerson',sourceNote: 'multi-source' },
    ],
  },

  8: {
    houseNameHebrew: 'בית המוות — גנבה, הלוואה, מוות',
    sourceNoteHouse: 'multi-source — PDF1 p.24+47-49 (الموت والخوف والفرقة والوسوسة), PDF2 ch.8, kashf',
    topics: [
      { label: 'גנבה',                   description: 'PDF1 p.47: ב1=נגנב, ב2=כמות, ב3=מספר, ב4=מאיפה נגנב, ב6=סוג הגנבה, ב7=גנב, ב8=כסף הגנב, ב10=מיקום הגנב. אם לא מצא חמרה/נקי/קבץ ח׳ארג׳/עתבה ח׳ארגה = לא נגנב',  implemented: true,  topicId: 'theft',             sourceNote: 'multi-source — PDF1 p.47-49, kashf' },
      { label: 'תיאור פיזי של הגנב',     description: 'PDF1 p.48: הגנב = ב7. מין: נארי/הוואאי=זכר; מאאי/תראבי=נקבה. גיל: נקי ח׳ד+עתבה ח׳ארגה+ביאד=צעיר; ג׳מאעה+טריק+עתבה דאח׳לה=ביניים; אנכיס+אחיאן=זקן. מספר גנבים = כמות חזרות ב7 בלוח.',  implemented: false, topicId: null,                sourceNote: 'source: PDF1 p.48' },
      { label: 'קרבת הגנב לשואל',        description: 'PDF1 p.48: ב7 חוזר בב1=שואל/עוזר; בב2=מכרים/שכנים; בב3=בן המשפחה (עם); בב4=מהבית; בב5=בעל הבית; בב6=שכן קרוב; בב7=זר ממקום אחר...',  implemented: false, topicId: null,                sourceNote: 'source: PDF1 p.48-49' },
      { label: 'האם הגנוב יוחזר',        description: 'PDF1 p.48-49: ב1+ב2 סעודים + ב7+ב8 נחס = הגנבה חוזרת. ב12 דאח׳ל = חוזרת. ב12+ב14 ח׳ארג = לא חוזרת. ת׳אבת = חוזרת בקושי; מנקלב = חוזרת בקלות',  implemented: false, topicId: null,                sourceNote: 'source: PDF1 p.48-49' },
      { label: 'הלוואה',                 description: 'האם ישיב את ההלוואה — לפי ב1+ב7, ב2+ב8',          implemented: true,  topicId: 'loan',              sourceNote: 'multi-source' },
      { label: 'מוות / ירושה',           description: 'חשש מוות, ממון ירושה, מי יורש — PDF1 p.24: الموت والخوف والأهوال والقبور والوسوسة والنسيان، بيت الديون',  implemented: true,  topicId: 'deathInheritance',  sourceNote: 'multi-source — PDF1 p.24, PDF2 ch.8, kashf' },
      { label: 'ביטחון ואורך חיים',      description: 'סעד בבית 8 = ביטחון; נחס = פחד, מוות פתאומי',     implemented: false, topicId: null,                sourceNote: 'source: kashf' },
    ],
  },

  9: {
    houseNameHebrew: 'בית הנסיעה — מסע, נעדר, דת, חלום, כישוף',
    sourceNoteHouse: 'multi-source — PDF1 p.24+52 (الأسفار البعيدة، الغائب، المنامات، طلب العلم، الدين), PDF2 ch.9+58, kashf',
    topics: [
      { label: 'נסיעה (יבשה)',           description: 'PDF1 ch.10: ב1=מטייל, ב2=כסף, ב3=תנועה, ב4=מולדת, ב7=יעד/מקביל, ב9=ברכה, ב10=מסחר. כיוון: יסוד הצורה בב9 → נארי=דרום, תראבי=מזרח, מאאי=צפון, הוואאי=מערב',  implemented: true,  topicId: 'travel',        sourceNote: 'multi-source — PDF1 ch.10, kashf' },
      { label: 'נסיעה (ים)',             description: 'ספינה, בטיחות מסע ים, סכנות מים',                  implemented: true,  topicId: 'seaVoyage',     sourceNote: 'multi-source' },
      { label: 'כיוון הנסיעה',           description: 'PDF1 ch.10: יסוד צורה בב9 → נארי=דרום, תראבי=מזרח, מאאי=צפון, הוואאי=מערב',  implemented: false, topicId: null,            sourceNote: 'source: PDF1 ch.10' },
      { label: 'בחירת זמן לנסיעה',      description: 'מתי לצאת — לפי בית 9 וכוחות בלוח',                 implemented: false, topicId: null,            sourceNote: 'source: kashf' },
      { label: 'נעדר — חי או מת',       description: 'PDF1 p.52 + PDF2 p.59: הסתכל ב1+ב4+ב8+ב9+ב12. ב6+ב7+ב9+ב10 לחיות. ג׳ודלה+חמרה+ג׳מאעה+עתבה ח׳ארגה בב4+ב12+ב14 = מת. סעד בב10 = חי',  implemented: true,  topicId: 'missingPerson', sourceNote: 'multi-source — PDF1 p.52, PDF2 p.59, kashf' },
      { label: 'מיקום הנעדר',            description: 'PDF1 p.52: ב9+ב10 = מיקום; ב5 = קרוב לבית; ב11 = פתוח/מחובר = קשר קרוב. קבץ ח׳ארג׳ = נמצא בחו"ל, מת בגלות. PDF2 p.59: ב6+ב7+ב9+ב10 לקרבה',  implemented: false, topicId: null,            sourceNote: 'multi-source — PDF1 p.52, PDF2 p.59' },
      { label: 'האם הנעדר יחזור',        description: 'PDF2 p.59: ב1+ב7=בסיס; ג׳מאעה בב9 עם קבצין ח׳ארגין = יסע ל; אחיאן+נסרה בב14 = יחזור; קבץ ח׳ארג׳ בב6 = ימות בגלות',                      implemented: false, topicId: null,            sourceNote: 'source: PDF2 p.59' },
      { label: 'חלום',                   description: 'PDF1 p.24 (בית 9): والمنامات وطلب العلم. גם בית 3 (PDF1 p.24). בית 9 = חלומות דתיים ורוחניים; בית 3 = חלומות רגילים קצרי-טווח',           implemented: false, topicId: null,            sourceNote: 'multi-source — PDF1 p.24 (house 9), PDF1 p.24 (house 3)' },
      { label: 'דת ויראת שמים',          description: 'PDF1 p.24: كل أمر يرجع إلى الدين والتفكر في خلق السماوات. בית 9 = דת, קוראן, חכמה — בית 3 + בית 9',  implemented: true,  topicId: 'religion',      sourceNote: 'multi-source — PDF1 p.24, kashf' },
      { label: 'כישוף / מכשפים',         description: 'PDF1 p.56: والبيت التاسع يدل على الساحر والشيوخ الروحانيين والذين يعملون في أمور السحر والجن والعرافة والكهانة والشعوذة',                    implemented: false, topicId: null,            sourceNote: 'source: PDF1 p.56' },
      { label: 'מקצוע / עיסוק',         description: 'לפי כוכב בית 9 — חקלאות, מדעים, רפואה, אמנות',    implemented: false, topicId: null,            sourceNote: 'source: kashf' },
      { label: 'הבטחה — האם תתממש',     description: 'מסאלה: האם ייקיים הבטחה שנתן',                      implemented: false, topicId: null,            sourceNote: 'source: kashf' },
    ],
  },

  10: {
    houseNameHebrew: 'בית הכבוד — שלטון, מעמד, האם',
    sourceNoteHouse: 'multi-source — PDF1 p.24+53 (السلطان والولاية والمعاش والرزق), PDF2 ch.10, kashf',
    topics: [
      { label: 'שלטון / תפקיד / כבוד',  description: 'PDF1 p.24: السلطان والولاية والاتصال بالملوك والمعاش والرزق. PDF1 p.53: ב10=שליט, ב2=אוצר, ב11=שמחות, ב12=אויב',                              implemented: true,  topicId: 'authorityState', sourceNote: 'multi-source — PDF1 p.24+53, PDF2 ch.10, kashf' },
      { label: 'משך השררות',             description: 'כמה זמן ישאר בתפקיד — מנקלב/ת׳אבת',               implemented: false, topicId: null,             sourceNote: 'source: kashf' },
      { label: 'האם יחזור לתפקיד',      description: 'מסולק שרוצה לחזור — בית 1+10+11 דאח׳ל',           implemented: false, topicId: null,             sourceNote: 'source: kashf' },
      { label: 'דיני האם',               description: 'מצב האם, מזלה, בריאותה',                            implemented: true,  topicId: 'motherRules',    sourceNote: 'multi-source' },
      { label: 'יוקר / זול (מחירי שוק)', description: 'PDF1 p.25: בית 10 = المعاش; יוקר/זול נגזר מסכום היסודות. אש+אוויר > מים+עפר = יוקר',                                                      implemented: false, topicId: null,             sourceNote: 'multi-source — PDF1 p.25, kashf' },
      { label: 'תחזית שנתית',            description: 'PDF2 p.60: גורל השנה — לפי מקום השמש בשנה. PDF2 p.61-62: طالع السنة — שפע/יובש/גשם. PDF2 p.62: מטר — כפל הלוח ל-16 בתים, קמר=חצי=קור/חצי=חום',  implemented: true,  topicId: 'yearlyForecast',  sourceNote: 'multi-source — PDF2 p.60-62, kashf' },
      { label: 'מלך / שליט — האם מפחד', description: 'PDF1 p.53: ch.19 — الفصل التاسع عشر أحكام الملوك والحكام. אם מריח׳ חוזר בב10 עם נחס גדול = השליט בסכנה מאויב',                              implemented: false, topicId: null,             sourceNote: 'source: PDF1 p.53' },
      { label: 'האם השואל מכושף',        description: 'PDF1 p.56: الاحيان في العاشر = مسحور — אחיאן בב10 = מכושף',                                                                                  implemented: false, topicId: null,             sourceNote: 'source: PDF1 p.56-57' },
    ],
  },

  11: {
    houseNameHebrew: 'בית התקווה — חברים, אמל, אורך חיים',
    sourceNoteHouse: 'multi-source — PDF1 p.24 (الرجاء والآمال والأصحاب والدعاء والسعادة), PDF2 ch.11, kashf',
    topics: [
      { label: 'חברים ותמיכה',           description: 'PDF1 p.24: الرجاء والآمال والأصحاب والأصدقاء والأخوان والدعاء والسعادة — מצב הידידות, האם נאמנים',  implemented: true,  topicId: 'loveHate',   sourceNote: 'multi-source' },
      { label: 'תקווה / אמל',            description: 'האם מה שמקווים לו יתממש — PDF1 p.51: اضرب 1×5 — נאתג׳ דאח׳ל = יתמלא',                                implemented: true,  topicId: 'completion', sourceNote: 'multi-source' },
      { label: 'אורך חיים',               description: 'עמר — ראשית/אמצע/סוף לפי בתים 9+7',               implemented: false, topicId: null,         sourceNote: 'source: kashf' },
      { label: 'אהבה / עשק',             description: 'אהבה נלהבת — האם הדדית, האם חלאל/חראם — שיטה: בתים 1+5+11',  implemented: false, topicId: null,         sourceNote: 'multi-source' },
      { label: 'לבוש ומזל בלבוש',        description: 'PDF1 p.24 ch.5: מזל בלבוש/ביגוד — לפי כוכב',       implemented: false, topicId: null,         sourceNote: 'source: kashf' },
      { label: 'האם ישיג מה שרוצה',      description: 'PDF1 p.51 ch.12: قضاء الحاجة — לפי ב1+ב11+ב15 דאח׳לים. PDF1 p.52: ב11 = בית הרג׳אאה',               implemented: false, topicId: null,         sourceNote: 'multi-source — PDF1 p.51-52, kashf' },
      { label: 'יציבות המצב הנוכחי',     description: 'דוואם אל-חאל — האם המצב יימשך',                    implemented: false, topicId: null,         sourceNote: 'source: kashf' },
    ],
  },

  12: {
    houseNameHebrew: 'בית האויבים — אויב, כלא, פחד, חוב',
    sourceNoteHouse: 'multi-source — PDF1 p.24+53-55 (الأعداء وقطاع الطريق واللصوص والسجن والديون والأسر), PDF2 ch.12, kashf',
    topics: [
      { label: 'אויבים / מתנגדים',       description: 'PDF1 p.24: الأعداء وقطاع الطريق والبلطجية وأسافل الناس واللصوص والحسد وأعداء الدين — כוח האויב, ת׳אבת/מנקלב',  implemented: true,  topicId: 'enemies',   sourceNote: 'multi-source — PDF1 p.24, PDF2 ch.12, kashf' },
      { label: 'פחד / סכנה',             description: 'האם הפחד מבוסס, מה מקורו — PDF2 ch.9: بيت الخوف. בתים 1+6+8+12 לאיתור הסיבה',                                  implemented: true,  topicId: 'fear',      sourceNote: 'multi-source — PDF2 ch.9, kashf' },
      { label: 'אסיר / כלוא',            description: 'PDF1 p.53-55: ב6=אסיר (המסגון), ב10=שופט/קאדי, ב12=הכלא. יציאה: ב1+ב4+ב8+ב12+ב15 חייבים להיות ח׳ארגה לצאת. אנכיס+עקלה בבתים רעים = שהייה ארוכה',  implemented: true,  topicId: 'prisoner',  sourceNote: 'multi-source — PDF1 p.53-55, kashf' },
      { label: 'פרטי שחרור / עונש',      description: 'PDF1 p.54-55: מות בכלא: חמרה+ג׳מאעה חוזרות בב4+ב8+ב9 = מות שם. עתבה ח׳ארגה בב1+ב3 ועתבה+קבץ ח׳ ב8+ב12 = בורח. אנכיס בב1 = חולה בכלא. ג׳ודלה בב1+ב12 = עדיין כלוא',  implemented: false, topicId: null,        sourceNote: 'source: PDF1 p.53-55' },
      { label: 'כלא — מי אשם (מין)',      description: 'PDF1 p.54: המסבב לכלא — כפל 7×1 לגנוסו. עתבה ח׳ארגה בב1+ב3 = בורח. ג׳ודלה בב1+ב12 = עצור עדיין',             implemented: false, topicId: null,        sourceNote: 'source: PDF1 p.54' },
      { label: 'בורחים',                 description: 'האם הבורח ייתפס, מיקומו',                           implemented: false, topicId: null,        sourceNote: 'source: kashf' },
      { label: 'חובות',                  description: 'PDF1 p.24: بيت الديون والأسر والاعتقال — בית 12 = חובות וכפייה',                                                  implemented: false, topicId: null,        sourceNote: 'source: PDF1 p.24' },
    ],
  },

};

/**
 * סיכום: נושאים שחסרים באפליקציה (implemented: false)
 *
 * עדכון אחרון: נבדקו 3 מקורות מלאים (כשף + القول الجامع + حاوي العجائب)
 * נושאים שסומנו 'verified' — המתודולוגיה ידועה ומאוששת, ניתן לממש
 */
export const MISSING_TOPICS_SUMMARY = [
  // בית 1
  { house: 1,  label: 'אסתח׳ארה',                 priority: 'medium',  sourceStatus: 'source: kashf' },
  { house: 1,  label: 'אורך חיים',                 priority: 'low',     sourceStatus: 'source: kashf' },
  { house: 1,  label: 'מי מסתכל על מי',           priority: 'low',     sourceStatus: 'source: kashf' },
  { house: 1,  label: 'כיוון גיאוגרפי',            priority: 'low',     sourceStatus: 'verified — PDF1 p.30' },
  // בית 2
  { house: 2,  label: 'פרנסה ומחיה',               priority: 'high',    sourceStatus: 'verified — multi-source' },
  { house: 2,  label: 'מקור הכסף',                 priority: 'medium',  sourceStatus: 'source: kashf' },
  { house: 2,  label: 'מטמון / כנוז תת-קרקעי',   priority: 'low',     sourceStatus: 'verified — PDF1 p.24' },
  // בית 3
  { house: 3,  label: 'האם לעבור מקום',            priority: 'high',    sourceStatus: 'source: kashf' },
  { house: 3,  label: 'איזו עיר עדיפה',            priority: 'high',    sourceStatus: 'source: kashf' },
  { house: 3,  label: 'תנועה קצרה',               priority: 'medium',  sourceStatus: 'verified — multi-source' },
  { house: 3,  label: 'חלום (קצר-טווח)',           priority: 'medium',  sourceStatus: 'verified — PDF1 p.24' },
  { house: 3,  label: 'מסרים והודעות',             priority: 'low',     sourceStatus: 'verified — PDF1 p.24' },
  // בית 4
  { house: 4,  label: 'מצב האב / הקרקע',          priority: 'medium',  sourceStatus: 'verified — multi-source' },
  { house: 4,  label: 'קידוח בארות / עומק מים',   priority: 'low',     sourceStatus: 'source: kashf' },
  { house: 4,  label: 'כיוון לחפירה',              priority: 'low',     sourceStatus: 'verified — PDF2 ch.16' },
  { house: 4,  label: 'נסתרות / סודות',            priority: 'medium',  sourceStatus: 'verified — PDF1 p.24' },
  { house: 4,  label: 'סיבת המחלה',               priority: 'medium',  sourceStatus: 'verified — PDF1 p.24' },
  // בית 5
  { house: 5,  label: 'זכר או נקבה',               priority: 'high',    sourceStatus: 'verified — multi-source' },
  { house: 5,  label: 'חשש להפלה',                priority: 'medium',  sourceStatus: 'verified — PDF2 ch.15' },
  { house: 5,  label: 'כמה חודשים הריון',         priority: 'medium',  sourceStatus: 'verified — PDF2 ch.15' },
  { house: 5,  label: 'אורך חיים של הילד',        priority: 'low',     sourceStatus: 'source: kashf' },
  // בית 6
  { house: 6,  label: 'מיקום המחלה בגוף',         priority: 'high',    sourceStatus: 'verified — PDF1 p.16+57' },
  { house: 6,  label: 'סוג המחלה (אח׳לאט)',       priority: 'medium',  sourceStatus: 'verified — PDF1 p.41+58' },
  { house: 6,  label: 'האם ימות',                  priority: 'medium',  sourceStatus: 'verified — PDF1 p.41-42' },
  { house: 6,  label: 'בהמה / חיה אבודה',         priority: 'low',     sourceStatus: 'verified — multi-source' },
  { house: 6,  label: 'סוג הג׳ין (אסקאט)',        priority: 'medium',  sourceStatus: 'verified — PDF1 p.57-58' },
  // בית 7
  { house: 7,  label: 'ת׳יב / בכר (האישה)',       priority: 'medium',  sourceStatus: 'verified — PDF1 p.44, PDF2 p.44' },
  { house: 7,  label: 'צניעות האישה',              priority: 'medium',  sourceStatus: 'verified — PDF1 p.43-44' },
  // בית 8
  { house: 8,  label: 'תיאור פיזי של הגנב',       priority: 'high',    sourceStatus: 'verified — PDF1 p.48' },
  { house: 8,  label: 'קרבת הגנב לשואל',          priority: 'high',    sourceStatus: 'verified — PDF1 p.48-49' },
  { house: 8,  label: 'האם הגנוב יוחזר',          priority: 'high',    sourceStatus: 'verified — PDF1 p.48-49' },
  { house: 8,  label: 'ביטחון ואורך חיים',        priority: 'low',     sourceStatus: 'source: kashf' },
  // בית 9
  { house: 9,  label: 'כיוון הנסיעה',              priority: 'medium',  sourceStatus: 'verified — PDF1 ch.10' },
  { house: 9,  label: 'בחירת זמן לנסיעה',         priority: 'medium',  sourceStatus: 'source: kashf' },
  { house: 9,  label: 'מיקום הנעדר',               priority: 'high',    sourceStatus: 'verified — PDF1 p.52, PDF2 p.59' },
  { house: 9,  label: 'האם הנעדר יחזור',          priority: 'high',    sourceStatus: 'verified — PDF2 p.59' },
  { house: 9,  label: 'חלום — פרשנות',             priority: 'high',    sourceStatus: 'verified — PDF1 p.24 (house 3+9)' },
  { house: 9,  label: 'כישוף / מכשפים',           priority: 'medium',  sourceStatus: 'verified — PDF1 p.56' },
  { house: 9,  label: 'מקצוע / עיסוק',            priority: 'medium',  sourceStatus: 'source: kashf' },
  { house: 9,  label: 'הבטחה — האם תתממש',        priority: 'medium',  sourceStatus: 'source: kashf' },
  // בית 10
  { house: 10, label: 'משך השררות',                priority: 'medium',  sourceStatus: 'source: kashf' },
  { house: 10, label: 'יוקר / זול',                priority: 'medium',  sourceStatus: 'verified — PDF1 p.25' },
  { house: 10, label: 'מלך / שליט — האם מפחד',    priority: 'low',     sourceStatus: 'verified — PDF1 p.53' },
  { house: 10, label: 'האם השואל מכושף',           priority: 'medium',  sourceStatus: 'verified — PDF1 p.56-57' },
  // בית 11
  { house: 11, label: 'אורך חיים',                 priority: 'low',     sourceStatus: 'source: kashf' },
  { house: 11, label: 'האם ישיג מה שרוצה',        priority: 'medium',  sourceStatus: 'verified — PDF1 p.51-52' },
  // בית 12
  { house: 12, label: 'פרטי שחרור / עונש',        priority: 'medium',  sourceStatus: 'verified — PDF1 p.54-55' },
  { house: 12, label: 'כלא — מי אשם',             priority: 'medium',  sourceStatus: 'verified — PDF1 p.54' },
  { house: 12, label: 'בורחים',                    priority: 'low',     sourceStatus: 'source: kashf' },
  { house: 12, label: 'חובות',                     priority: 'low',     sourceStatus: 'verified — PDF1 p.24' },
];

export default { KASHF_TOPICS_PER_HOUSE, MISSING_TOPICS_SUMMARY };
