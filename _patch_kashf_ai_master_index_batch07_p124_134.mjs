#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);
if(data.schemaVersion!=='1.7.0') throw new Error(`expected schema 1.7.0, got ${data.schemaVersion}`);
if(data.records.length!==80) throw new Error(`expected 80 existing records, got ${data.records.length}`);

const scan=(ps)=>ps.map(p=>p+2);
const anchors=(ps)=>ps.map(p=>`kashf-v57-draft.html#p${p}`);
const rec=(entryId,entryType,bookPages,topic,criticalFacts,extra={})=>({
  entryId,entryType,bookPages,scanPdfPages:scan(bookPages),v57Anchors:anchors(bookPages),topic,
  keywords:extra.keywords||[],criticalFacts,
  outputScope:extra.outputScope||'חומר מקור לאחזור AI; אינו הופך לבדו לפסק פעיל.',
  doNotInfer:extra.doNotInfer||[],sourceDiscrepancies:extra.sourceDiscrepancies||[],
  verificationStatus:extra.verificationStatus||'VERIFIED',
  sourceVerification:{
    printedBookPages:bookPages,scanPdfPages:scan(bookPages),v57Checked:true,printedScanChecked:true,
    visualLineByLineChecked:extra.visualLineByLineChecked??true,
    note:extra.sourceNote||'v57 was compared with the printed Arabic scan; source scope and disagreements are preserved explicitly.'
  },
  ...Object.fromEntries(Object.entries(extra).filter(([k])=>!['keywords','outputScope','doNotInfer','sourceDiscrepancies','verificationStatus','sourceNote','visualLineByLineChecked'].includes(k)))
});

// Project-level method-selection policy: index the book exhaustively as knowledge,
// but never operationalize every quoted/alternative method merely because it exists.
data.methodSelectionPolicy={
  ...(data.methodSelectionPolicy||{}),
  principle:'ONE_PRIMARY_METHOD_PER_QUESTION_INTENT',
  operationalSelection:'NEED_DRIVEN',
  sourceExhaustiveIndexing:true,
  noMultiMethodAggregation:true,
  quotedAlternativesDefaultRuntimeEligible:false,
  dhamirPolicy:'INDEX_ALL_REFERENCED_METHODS_AS_KNOWLEDGE; OPERATIONALLY_MAP_ONLY_TYPES_NEEDED_FOR_A_SPECIFIC_QUESTION_INTENT; SELECT_ONE_PRIMARY_ROUTE',
  legacyFiveMethodMajorityRuntimeAllowed:false,
  note:'A source may describe several methods, including majority/aggregation rules. The Hall of Wisdom AI does not run all of them by default. Operational selection is made by question intent and an explicitly approved primary route.'
};

const added=[];

added.push(rec('shibutz.p124.element-exemplars','source-foundation',[124],
  'ארבע צורות יסודיות — ראייה, דיבור, חיבור והעדר',[
    'נשוא ראש (1222 / الأحيان) נקשרת לראייה/עיון; המקור מתאר את אש השמש, המרה הצהובה והאיכות החמה־יבשה.',
    'אדום (2122 / الحمرة) נקשר לדיבור; המקור קושר אותו לאוויר/אש נעה, לדם ולאיכות החמה־לחה.',
    'לבן (2212 / البياض) נקשר לחיבור; המקור קושר אותו למים, לליחה ולאיכות הקרה־לחה.',
    'שפל ראש (2221 / الأنكيس) נקשר להיפרדות/העדר; המקור קושר אותו לעפר, למרה השחורה ולאיכות הקרה־יבשה.'
  ],{
    keywords:['ארבע צורות יסודיות','ראייה','דיבור','חיבור','העדר','נשוא ראש','אדום','לבן','שפל ראש'],
    elementExemplars:[
      {pattern:'1222',name:'נשוא ראש',arabic:'الأحيان',semanticRole:'ראייה/עיון',humor:'מרה צהובה',quality:'חם ויבש'},
      {pattern:'2122',name:'אדום',arabic:'الحمرة',semanticRole:'דיבור',humor:'דם',quality:'חם ולח'},
      {pattern:'2212',name:'לבן',arabic:'البياض',semanticRole:'חיבור',humor:'ליחה',quality:'קר ולח'},
      {pattern:'2221',name:'שפל ראש',arabic:'الأنكيس',semanticRole:'היפרדות/העדר',humor:'מרה שחורה',quality:'קר ויבש'}
    ],
    operationalRole:'FOUNDATION_KNOWLEDGE',runtimeEligible:false,
    doNotInfer:['אין להפוך את ארבע הדוגמאות למסווג יחיד לכל 16 הצורות.','אין להשתמש בהן לבדן כדי לבחור שיטת דמיר.']
  }));

added.push(rec('shibutz.p124-125.questioner-target-nature','method-selection-source',[124,125],
  'ידיעת טבע השואל והנשאל — הכרעת המחבר לטובת דרך האותיות',[
    'עמ׳ 124 מביא דרך של ספירת אש/אוויר/מים/עפר ובחירת היסוד שמספרו גדול יותר.',
    'מובאת גם דעה של התבוננות בבית מחשבת השואל ובצורה השוכנת בו.',
    'בעמ׳ 125 המחבר מכריע: הנכון יותר הוא להתבונן בבית מחשבת השואל בדרך התסייר, בצורתו, לקחת את אותיותיהם ולצרפן; הטבע היוצא מן האותיות אינו משתנה כמו צורה היכולה לכלול כמה יסודות.',
    'המקור מסיים במפורש: הדרך השלישית היא הנכונה יותר.'
  ],{
    keywords:['טבע השואל','טבע הנשאל','בית מחשבת השואל','בית הדמיר','אותיות','הדרך השלישית','האصح'],
    methodStatus:'AUTHOR_PREFERRED',operationalRole:'PRIMARY_CANDIDATE',runtimeEligible:false,
    questionIntents:['questioner-nature','target-person-nature','hidden-intent-nature'],
    alternatives:[
      {id:'element-count-prevalence',status:'SOURCE_ALTERNATIVE'},
      {id:'bayt-al-damir-figure-nature',status:'SOURCE_ALTERNATIVE'},
      {id:'bayt-al-damir-letter-combination',status:'AUTHOR_PREFERRED'}
    ],
    doNotInfer:['AUTHOR_PREFERRED אינו אישור runtime אוטומטי. יש לבחור שיטה רק כאשר סוג השאלה דורש אותה.','אין להריץ את שלוש הדרכים יחד ואין לבצע הצבעת רוב ביניהן.'],
    sourceNote:'Printed pp124-125 and v57 agree on the competing approaches and on the explicit phrase that the third approach is more correct.'
  }));

added.push(rec('reference.p125.element-letter-treatment','quoted-practical-treatment',[125],
  'טיפול לפי אותיות היסודות — חומר מקור שאינו מסלול פסיקה פעיל',[
    'המקור מתאר טיפול במרה צהובה באמצעות אותיות המים, ובדם באמצעות אותיות העפר.',
    'בדוגמת ליחה/מים הוא מתאר שימוש באותיות האש במשך שבעה ימים.',
    'זהו חומר טיפולי־מסורתי בתוך הספר, לא כלל נדרש למסקנת גורל רגילה.'
  ],{
    keywords:['טיפול','אותיות היסודות','מרה צהובה','דם','ליחה','שבעה ימים'],
    methodStatus:'REFERENCE_ONLY',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    outputScope:'תיעוד מקור בלבד; אינו מסלול אבחון רפואי או טיפול פעיל של המערכת.',
    doNotInfer:['אין להפעיל טיפול זה אוטומטית בשאלת חולי.','אין להציגו כהמלצה רפואית מודרנית.']
  }));

added.push(rec('shibutz.p126.three-element-traditions','quoted-method-comparison',[126],
  'שלוש מסורות לשיבוץ היסודות — אל־זנאתי, אבו סעיד אל־טרבלסי ובעלי הטבעים',[
    'אל־זנאתי: אש 9, אוויר 11, מים 14, עפר 16.',
    'אבו סעיד אל־טרבלסי: אש 1, אוויר 2, מים 4, עפר 8.',
    'בעלי הטבעים: אש 1, אוויר 2, מים 3, עפר 4.',
    'המחבר אומר שהמסורות חוזרות אל חוק אחד, אך מציג אותן בנפרד ואינו אומר להריץ את שלושתן יחד.'
  ],{
    keywords:['שלושה סדרים','אל־זנאתי','אבו סעיד אל־טרבלסי','בעלי הטבעים','שיבוץ היסודות'],
    traditions:[
      {authority:'אל־זנאתי',arabic:'الزناتي',values:{fire:9,air:11,water:14,earth:16},methodStatus:'QUOTED_ALTERNATIVE',runtimeEligible:false},
      {authority:'אבו סעיד אל־טרבלסי',arabic:'أبو سعيد الطرابلسي',values:{fire:1,air:2,water:4,earth:8},methodStatus:'QUOTED_ALTERNATIVE',runtimeEligible:false},
      {authority:'בעלי הטבעים',arabic:'أهل الطبائع',values:{fire:1,air:2,water:3,earth:4},methodStatus:'SCHOOL_METHOD',runtimeEligible:false}
    ],
    operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    doNotInfer:['אין לבחור מסורת לפי הקוד שכבר קיים.','אין להריץ את שלוש המסורות ולמזג או להצביע ביניהן.','הביטוי "חוק אחד" אינו הופך את המספרים לזהים.']
  }));

added.push(rec('shibutz.p127.ahl-al-tabai-point-semantics','quoted-school-rule',[127],
  'דיני בעלי הטבעים בנקודות ובהיבטים',[
    'נקודת האש מיוחסת לראייה/עיון; נקודת האוויר לדיבור; נקודת המים לחיבור; נקודת העפר להעדר/פירוד.',
    'המקור מפתח יחסים מן האמהות אל הבנות: אש בראשון ביחס לחמישי, אוויר בראשון/שני, מים בראשון/שלישי אל השביעי, ועפר בראשון/רביעי כהעדר לאחר מציאות.',
    'נזכרים גם היבטי שישית מן הראשון לשלישי ולאחד־עשר, ריבוע מן הרביעי והעשירי, ושילוש מן החמישי והתשיעי.',
    'הראייה השלמה מיוחסת בשמו של אל־עֻמרי.'
  ],{
    keywords:['בעלי הטבעים','נקודת אש','נקודת אוויר','נקודת מים','נקודת עפר','אל־עמרי','היבטים'],
    pointSemantics:{fire:'ראייה/עיון',air:'דיבור',water:'חיבור',earth:'העדר/פירוד'},
    attributedAuthority:'אל־עֻמרי',methodStatus:'QUOTED_SCHOOL_RULE',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    doNotInfer:['אין למזג את שיטת אל־עמרי עם שיטת השוואת בית הדמיר בעמ׳ 128 ללא בחירת מסלול מפורשת.']
  }));

added.push(rec('dhamir.p128.comparison-judge','dhamir-candidate',[128],
  'השוואת בית הדמיר ומכריע גורל החול',[
    'מתבוננים בבית מחשבת השואל/הדמיר ובנקודתו ומשווים אל הבית הראשון; התאמה מורה התאמה, והמשך ההשוואה נעשה לפי הנקודות והקשר.',
    'המקור מחלק את הבתים במחזור: ראשון אש, שני אוויר, שלישי מים, רביעי עפר וכן הלאה.',
    'לאחר מכן מתבוננים בבית החמישה־עשר ובנקודתו; המקור מכנה אותו חاكم الرمل وقاضيه — מכריע/שופט גורל החול — ומשווים את עדותו לראייה, דיבור, חיבור והעדר.',
    'נבדק גם אם המצב קבוע או מתהפך.'
  ],{
    keywords:['דמיר','בית מחשבת השואל','השוואה','מכריע','חاكم الرمل','בית 15','ראייה','דיבור','חיבור','העדר'],
    houses:[1,15],
    methodStatus:'PRIMARY_CANDIDATE',operationalRole:'PRIMARY_CANDIDATE',runtimeEligible:false,
    questionIntents:['hidden-intent-comparison','agreement-between-questioner-and-matter'],
    doNotInfer:['אין להפעיל מסלול זה יחד עם כל שיטות הדמיר האחרות.','יש לבחור בו רק אם מיפוי השאלה קובע שזהו המסלול הראשי המתאים.','אין להסיק מן היות H15 שופט שכל שאלה חייבת לעבור דרך שיטה זו.']
  }));

added.push(rec('reference.p128-129.element-variant-survey','quoted-variant-survey',[128,129],
  'סדר אל־זנאתי, דרך אנשי הברבר וסיכום מחלוקות היסודות',[
    'המחבר מציין שמצא בספרי אל־זנאתי סדר יסודות נוסף ומביאו כשיטה מיוחסת.',
    'בעמ׳ 129 מובאת גם דרך אנשי הברבר, והמחבר אומר שגם היא חוזרת אל דרך בעלי הטבעים.',
    'המחבר מסכם כי אסף את דרכי בעלי גורל החול ביסודות ואת מחלוקותיהם, וכי ריבוי ההבדלים חוזר אצלו למשמעות כוללת אחת.',
    'היסודות מוצגים כבסיס להבנת דמיר, שמות, אופי, כיוונים, קבורה, אורך, רוחב ועומק.'
  ],{
    keywords:['אל־זנאתי','אנשי הברבר','יסודות','מחלוקת','סיכום שיטות','דמיר','כיוונים'],
    methodStatus:'REFERENCE_ONLY',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    doNotInfer:['סיכום המחבר אינו הוראה להריץ את כל שיטות היסודות.','אין ליצור majority או consensus engine מן הרשימה.']
  }));

added.push(rec('reference.p130-131.weighted-five-evidences','weighted-evidence-method',[130,131],
  'חמש עדויות משוקללות בקווי היסודות',[
    'מערכת הקווים הבסיסית: בית 5, מעלה/שררה 4, גבול 3, שילוש 2, פנים 1 — סך הכול 15 קווים.',
    'המקור מתאר עדות הפחתה במשקל 5, נקודה במשקל 4, צורה כעד שלישי במשקל 3, עד רביעי במשקל 2, ויתד/נוטה מן היתד כעד חמישי במשקל 1.',
    'כאשר עדויות מצטרפות באותו מקום הן מתחזקות זו בזו; המקור קושר את ההשוואה לכוונה הנסתרת.'
  ],{
    keywords:['חמש עדויות','15 קווים','בית','שררה','גבול','שילוש','פנים','הפחתה','נקודה','צורה','יתד'],
    baseWeights:{house:5,exaltation:4,bound:3,triplicity:2,face:1,total:15},
    evidenceWeights:[{evidence:'הפחתה',weight:5},{evidence:'נקודה',weight:4},{evidence:'צורה',weight:3},{evidence:'עד רביעי',weight:2},{evidence:'יתד/נוטה מן היתד',weight:1}],
    methodStatus:'REFERENCE_ONLY',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    doNotInfer:['אין למזג שיטה זו עם שבעת העדים בעמ׳ 164; אלו מבנים שונים.','אין להשתמש במשקלים להצבעת רוב בין שיטות דמיר שונות.']
  }));

added.push(rec('foundation.p132.element-values-properties','source-conflict',[132],
  'ערכי היסודות ותכונותיהם — עם סתירה פנימית בין עמ׳ 126 לעמ׳ 132',[
    'בפתיחת עמ׳ 132 נמסרים לבעלי הטבעים קווים: אש 8, אוויר 4, מים 2, עפר 1 — סך הכול 15.',
    'בהמשך אותו עמוד מיוחס לאל־זנאתי סדר אש 1, אוויר 2, מים 3, עפר 4, ונאמר שאל־טרבלסי הסכים עמו.',
    'ייחוס זה אינו תואם את עמ׳ 126, שבו אל־זנאתי = 9/11/14/16, אל־טרבלסי = 1/2/4/8, ובעלי הטבעים = 1/2/3/4.',
    'העמוד מייחס גם תכונות יסוד: אש חום, אוויר לחות, מים קור, עפר יובש; צבעים: אש אדום/צהוב, אוויר אדום, מים לבן, עפר שחור; וכן עונות, חלקי יום ומתכות.'
  ],{
    keywords:['ערכי היסודות','8 4 2 1','1 2 3 4','סתירה','אל־זנאתי','אל־טרבלסי','בעלי הטבעים','צבעים','עונות','מתכות'],
    verificationStatus:'REVIEW_REQUIRED',
    p132LiteralValues:{ahlAlTabaiLines:{fire:8,air:4,water:2,earth:1,total:15},zanati:{fire:1,air:2,water:3,earth:4},trabulsiAgreement:true},
    literalProperties:{qualities:{fire:'חום',air:'לחות',water:'קור',earth:'יובש'},colors:{fire:['אדום','צהוב'],air:['אדום'],water:['לבן'],earth:['שחור']},dayparts:{fire:'בוקר',air:'צהריים',water:'אחר הצהריים',earth:'ערב'},metals:{fire:'זהב',air:'נחושת',water:'כסף',earth:'ברזל'}},
    sourceDiscrepancies:['סתירת מקור פנימית: ייחוסי המספרים בעמ׳ 132 אינם תואמים את שלוש המסורות המפורשות בעמ׳ 126. אין ליישב את הסתירה בלי ראיה נוספת.'],
    methodStatus:'SOURCE_CONFLICT',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    doNotInfer:['אין לבחור אחת משתי מערכות המספרים לפי נוחות הקוד.','אין למחוק את הסתירה או להחליט שזו שגיאת דפוס בלי מקור נוסף.'],
    sourceNote:'The printed p132 was read literally and compared with printed p126. The contradiction is in the source tradition as currently available, so the record remains REVIEW_REQUIRED.'
  }));

added.push(rec('foundation.p133.root-circle','source-diagram',[133],
  'מעגל השורשים והסתעפות הענפים',[
    'המחבר אומר שמתוך היסודות נודעים אש, אוויר, מים ועפר ומציג מעגל של שורשים והסתעפות הענפים.',
    'המעגל נשמר כתרשים מקור; אין להפוך את הגרפיקה לנוסחה שלא פורשה במילים.'
  ],{
    keywords:['מעגל השורשים','הסתעפות הענפים','יסודות','תרשים'],
    operationalRole:'FOUNDATION_KNOWLEDGE',runtimeEligible:false,
    doNotInfer:['אין להמציא קשרים מספריים מתוך התרשים מעבר למה שהמקור מנסח.']
  }));

const MAZAG=[
  {planet:'שמש',arabic:'الشمس',patterns:['2121','1122'],day:'יום ראשון',night:'ליל חמישי'},
  {planet:'נוגה',arabic:'الزهرة',patterns:['1121','2211'],day:'יום שישי',night:'ליל שלישי'},
  {planet:'כוכב חמה',arabic:'عطارد',patterns:['2112','2222'],day:'יום רביעי',night:'ליל ראשון'},
  {planet:'ירח',arabic:'القمر',patterns:['2212','1111'],day:'יום שני',night:'ליל שישי'},
  {planet:'שבתאי',arabic:'زحل',patterns:['2221','1221'],day:'יום שבת',night:'ליל רביעי'},
  {planet:'צדק',arabic:'المشتري',patterns:['2111','1222'],day:'יום חמישי',night:'ליל שני'},
  {planet:'מאדים',arabic:'المريخ',patterns:['2122','1211'],day:'יום שלישי',night:'ליל שבת'},
  {planet:'ראש התלי',arabic:'الرأس',patterns:['1212'],day:null,night:null},
  {planet:'זנב התלי',arabic:'الذنب',patterns:['1112'],day:null,night:null}
];
added.push(rec('shibutz.p133-134.mazag-planet-map','placement-map',[133,134],
  'השיבוץ הרביעי — שיבוץ המזג: צורות, כוכבים, ראש וזנב',[
    'השיר והטבלה המודפסת נקראים יחד ומחלקים את כל 16 הצורות באופן חד־ערכי בין שבעת הכוכבים וראש/זנב התלי.',
    'המחבר מכריע במפורש במחלוקת: נלחם/ג׳ודלה שייך לנוגה, ונקי הלחי שייך למאדים.',
    'שבתאי כולל שפל ראש וסוהר/עקלה (המכונה כאן الثقاف); צדק כולל סף נכנס ונשוא ראש; ראש התלי הוא ממון יוצא וזנב התלי הוא סף יוצא.',
    'המקור מוסר גם ימי ולילות שבעת הכוכבים.'
  ],{
    keywords:['שיבוץ המזג','שמש','נוגה','כוכב חמה','ירח','שבתאי','צדק','מאדים','ראש התלי','זנב התלי'],
    verificationStatus:'REVIEW_REQUIRED',planetMap:MAZAG,
    sourceDiscrepancies:['הסריקה המודפסת משלימה חלוקה של 16/16, בעוד טבלת v57 הזמינה מציגה בחלק מן השורות ייצוג חסר של הצורות/הצמתים. יש להשלים את v57 מן הטבלה המודפסת, בלי לשנות את מפת המקור.'],
    methodStatus:'SOURCE_MAP',operationalRole:'FOUNDATION_KNOWLEDGE',runtimeEligible:false,
    doNotInfer:['אין להשתמש בגרסת טבלה חלקית כראיה לכך שכוכב מחזיק צורה אחת בלבד.','אין להפעיל את השיבוץ כמנוע כללי לכל שאלה; הוא שכבת ייחוס שתיקרא רק כאשר שיטה ראשית דורשת אותו.'],
    sourceNote:'Printed pp133-134 poem and 9-column table were visually checked together. The 16-pattern partition is source-closed; the record remains REVIEW_REQUIRED only because v57 representation is incomplete relative to the printed table.'
  }));

for(const r of added){
  if(data.records.some(x=>x.entryId===r.entryId)) throw new Error(`duplicate preexisting entryId ${r.entryId}`);
  data.records.push(r);
}

data.sourceConflictQueue=data.sourceConflictQueue||[];
if(!data.sourceConflictQueue.some(x=>x.id==='B07-SOURCE-P126-P132-ELEMENT-ATTRIBUTION')){
  data.sourceConflictQueue.push({
    id:'B07-SOURCE-P126-P132-ELEMENT-ATTRIBUTION',pages:[126,132],status:'OPEN',
    summary:'Printed p126 and p132 attribute incompatible element-number systems to al-Zanati, al-Trabulsi and Ahl al-Tabai. Preserve both literally; do not reconcile without additional source evidence.'
  });
}

data.v57CorrectionQueue=data.v57CorrectionQueue||[];
if(!data.v57CorrectionQueue.some(x=>x.id==='B07-P134-MAZAG-TABLE-COMPLETENESS')){
  data.v57CorrectionQueue.push({
    id:'B07-P134-MAZAG-TABLE-COMPLETENESS',entryId:'shibutz.p133-134.mazag-planet-map',page:134,status:'OPEN',
    summary:'Complete the v57 Shibutz Mazag table from the printed 9-column source so all 16 figures, including Venus second figure, Jupiter second figure, Head and Tail, are represented.'
  });
}

data.downstreamCorrectionQueue=data.downstreamCorrectionQueue||[];
for(const item of [
  {id:'B07-DATA-ELEMENT-TRADITIONS-RUNTIME-PRECEDENCE',pages:[124,125,126,132],status:'DEFERRED_UNTIL_INDEX_COMPLETE',summary:'Existing SHIBUTZ_3_ELEMENT_VALUES usage must not confer runtime authority. Select an element/dhamir method only by approved question intent after source precedence review.'},
  {id:'B07-DHAMIR-NEED-DRIVEN-SELECTION',pages:[124,125,128,130,131],status:'DEFERRED_UNTIL_INDEX_COMPLETE',summary:'Replace any legacy assumption that all dhamir types should run together. Operational dhamir mapping is need-driven: identify only types required for a concrete question intent and select one primary route.'}
]){
  if(!data.downstreamCorrectionQueue.some(x=>x.id===item.id)) data.downstreamCorrectionQueue.push(item);
}

data.schemaVersion='1.8.0';
data.coverage={...(data.coverage||{}),bookEndPage:134,scanPdfEndPage:136,status:'BATCH07_P124_134_INDEXED_WITH_REVIEW_BLOCKERS'};
data.coverage.completedBatches=[...(data.coverage.completedBatches||[]).filter(x=>x!=='BATCH07_P124_134'),'BATCH07_P124_134'];

const json=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
fs.writeFileSync(path,text);

const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch07 p124-134 applied',counts,'records',data.records.length,'v57Queue',data.v57CorrectionQueue.length,'downstreamQueue',data.downstreamCorrectionQueue.length,'sourceConflicts',data.sourceConflictQueue.length);
