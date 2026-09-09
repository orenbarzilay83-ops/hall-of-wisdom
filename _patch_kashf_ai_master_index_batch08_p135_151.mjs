#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);
if(data.schemaVersion!=='1.8.0') throw new Error(`expected schema 1.8.0, got ${data.schemaVersion}`);
if(data.records.length!==91) throw new Error(`expected 91 existing records, got ${data.records.length}`);

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

const added=[];

const PLANET_LETTERS=[
  {planet:'שמש',arabic:'الشمس',lettersArabic:['ا','ج','س','ت']},
  {planet:'נוגה',arabic:'الزهرة',lettersArabic:['ب','ط','ع','ث']},
  {planet:'כוכב חמה',arabic:'عطارد',lettersArabic:['ج','ي','ف','ح']},
  {planet:'ירח',arabic:'القمر',lettersArabic:['د','ك','ص','ذ']},
  {planet:'שבתאי',arabic:'زحل',lettersArabic:['ه','ل','ق','ص']},
  {planet:'צדק',arabic:'المشتري',lettersArabic:['و','م','ز','ط']},
  {planet:'מאדים',arabic:'المريخ',lettersArabic:['ز','ن','س','ع']},
];
added.push(rec('shibutz.p135.planet-letters-utility','source-table',[135],
  'תועלת שיבוץ המזג ואותיות שבעת הכוכבים',[
    'המקור אומר שכאשר צורה שורה בבית הכוכב שלה לפי הסדר, היא מקבלת את תכונת הכוכב ואת יומו.',
    'תועלת השיבוץ נמסרת לידיעת מזג השואל והנשאל עליו, לבושם, טעמיהם וריחותיהם; המחבר מפנה להמשך בספרי האסטרולוגיה.',
    'לכל אחד משבעת הכוכבים ארבע אותיות; המקור קושר אותן באופן מסורתי לעילה ולטיפול, וייתכן שיופיעו בשם השואל, הנשאל עליו, החולי או העילה.',
    'טבלת האותיות המודפסת נשמרת כאן באותיות ערביות מדויקות, בלי להחליף אות דומה באות אחרת.'
  ],{
    keywords:['אותיות הכוכבים','שמש','נוגה','عطارد','ירח','שבתאי','צדק','מאדים','עילה','טיפול'],
    verificationStatus:'REVIEW_REQUIRED',planetLetters:PLANET_LETTERS,
    methodStatus:'SOURCE_TABLE',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    outputScope:'תיעוד מקור מסורתי ואחזור בלבד; אין להציג שיוך אותיות כעובדה רפואית או כהוראת טיפול.',
    sourceDiscrepancies:[
      'בטבלת v57 עמ׳ 135 הוחלפו כמה אותיות מקור: عطارد מסתיים במקור ב-ح ולא ע; القمر מסתיים ב-ذ ולא ח; زحل מסתיים ב-ص ולא ז׳. עד תיקון v57 הרשומה נשארת REVIEW_REQUIRED.'
    ],
    doNotInfer:['אין להמיר אותיות ערביות דומות לפי נוחות התעתיק.','אין להפעיל מן הטבלה אבחון או טיפול רפואי.'],
    sourceNote:'Printed p135 table was visually checked cell-by-cell. The source table is closed; REVIEW_REQUIRED is only for the current v57 transcription mismatch.'
  }));

added.push(rec('shibutz.p135-137.zodiac-planet-order','placement-map',[135,136,137],
  'השיבוץ החמישי — שיבוץ המזלות והכוכבים',[
    'המקור מסדר צורות לפי כוכבים ומזלות ומביא שיר ולאחריו טבלת תשעה טורים: מאדים, נוגה, عطارد, ירח, שמש, צדק, שבתאי, ראש וזנב.',
    'בעמ׳ 136 נאמר במפורש שממון יוצא / القبض الخارج חוזר למאדים, ושסף נכנס / العتبة الداخلة חוזר לשבתאי בתוך הקשר זה.',
    'בעמ׳ 137 נאמר ששתי הצורות הנותרות מיוחסות לזנב ולראש: ממון יוצא / قبض خارج וסף יוצא / عتبة خارجة, וששתיהן חוזרות לשבתאי ולמאדים.',
    'זהו שיבוץ ייחוס תשתיתי; אינו הוראה להריץ אסטרולוגיה בכל שאלה.'
  ],{
    keywords:['שיבוץ המזלות','כוכבים','מזלות','ראש התלי','זנב התלי','ממון יוצא','סף יוצא','סף נכנס'],
    verificationStatus:'REVIEW_REQUIRED',methodStatus:'SOURCE_MAP',operationalRole:'FOUNDATION_KNOWLEDGE',runtimeEligible:false,
    sourceDiscrepancies:[
      'עמ׳ 136 מזכיר العتبة الداخلة בהחזרה לשבתאי, ואילו עמ׳ 137, בדיון בשתי הצורות הנותרות לראש/זנב, מזכיר العتبة الخارجة. אין לאחד את שתי האמירות בשקט.',
      'זהות ראש/זנב נשמרת לפי טבלת שיבוץ המזג המפורשת בעמ׳ 134; אמירות ההחזרה בעמ׳ 136-137 נשמרות כשכבה נפרדת.'
    ],
    doNotInfer:['אין להפוך את לשון החזרה לכוכב לזהות חדשה של ראש/זנב.','אין ליישב את עמודים 136-137 באמצעות מסורת חיצונית ללא מקור.']
  }));

const SEASONS=[
  {season:'אביב',zodiac:['טלה','שור','תאומים'],patterns:['2122','1211','2211','1121','2222','2112'],lettersArabic:'ابجد هوز'},
  {season:'קיץ',zodiac:['סרטן','אריה','בתולה'],patterns:['2212','1111','1122','2121','2112'],lettersArabic:'حطي كلمن'},
  {season:'חורף',zodiac:['גדי','דלי','דגים'],patterns:['1221','2221','2111'],lettersArabic:'ثنخذ ضظغ'},
  {season:'סתיו',zodiac:['מאזניים','עקרב','קשת'],patterns:['1121','1211','1222'],lettersArabic:'شعفص قرشت'},
];
added.push(rec('shibutz.p136-137.season-figure-groups','source-figure-groups',[136,137],
  'קבוצות הצורות של ארבע עונות השנה בשיבוץ המזלות',[
    'הסריקה המודפסת מציגה קבוצות צורות גרפיות מפורשות לכל עונה; הן אינן חלוקה חד־ערכית של 16 הצורות, ויש חפיפה בין עונות.',
    'אביב: 2122, 1211, 2211, 1121, 2222, 2112 — שש צורות מפורשות בסריקה.',
    'קיץ: 2212, 1111, 1122, 2121, 2112 — חמש צורות מפורשות בסריקה.',
    'חורף: 1221, 2221, 2111; סתיו: 1121, 1211, 1222. לאחריהן המקור מזכיר שתי צורות נותרות לראש ולזנב.'
  ],{
    keywords:['עונות','אביב','קיץ','חורף','סתיו','קבוצות צורות','שיבוץ המזלות'],
    verificationStatus:'REVIEW_REQUIRED',seasonGroups:SEASONS,
    methodStatus:'SOURCE_MAP',operationalRole:'FOUNDATION_KNOWLEDGE',runtimeEligible:false,
    sourceDiscrepancies:[
      'הטקסט הערבי המנוקה/OCR מחליף את הגרפיקה בתוויות כלליות כגון "שלוש צורות" ואינו מקור אמין למניין הסמלים; הסריקה המודפסת היא הסמכות.',
      'בנתוני SHIBUTZ_5_SEASONS הקיימים אביב הושלם בעבר בהסקה כשלוש צורות [2122,2211,2222]. הסריקה מראה במפורש שש צורות, ולכן ההסקה הישנה פסולה.',
      'v57 עמ׳ 137 מציג מזלות ואותיות עונה אך אינו משמר במלואן את קבוצות הצורות הגרפיות המפורשות.'
    ],
    doNotInfer:['אין לדרוש שכל צורה תופיע בעונה אחת בלבד.','אין להשלים קבוצה לפי elimination כאשר הסריקה מציגה סמלים מפורשים.'],
    sourceNote:'Printed pp136-137 were visually inspected. Figure stacks were decoded row-by-row from dot/line glyphs; auxiliary OCR was not used to infer glyph counts.'
  }));

added.push(rec('foundation.p137.season-letters-zodiac-elements','source-correspondence',[137],
  'אותיות העונות ושלישיות היסודות של המזלות',[
    'אביב: אבجد هوز; קיץ: حطي كلمن; סתיו: شعفص قرشت; חורף: ثنخذ ضظغ — נשמרת כתיבת המקור.',
    'מזלות האש: טלה, אריה, קשת; העפר: שור, בתולה, גדי; האוויר: תאומים, מאזניים, דלי; המים: סרטן, עקרב, דגים.',
    'המקור מציג קשרים אלו כחלק משיבוץ המזלות והעונות.'
  ],{
    keywords:['אותיות העונות','אבגד','יסודות המזלות','אש','עפר','אוויר','מים'],
    seasonLetters:SEASONS.map(({season,lettersArabic})=>({season,lettersArabic})),
    zodiacElements:{fire:['טלה','אריה','קשת'],earth:['שור','בתולה','גדי'],air:['תאומים','מאזניים','דלי'],water:['סרטן','עקרב','דגים']},
    operationalRole:'FOUNDATION_KNOWLEDGE',runtimeEligible:false,
    doNotInfer:['אין לנרמל את רצפי האותיות לפי אבג׳ד חיצוני אם נוסח המקור שונה.']
  }));

const LETTER_TABLE=[
  {primary:'ا',pattern:'1222',secondary:'ف'},
  {primary:'ب',pattern:'2221',secondary:'ص'},
  {primary:'ج',pattern:'2122',secondary:'ق'},
  {primary:'د',pattern:'2212',secondary:'ر'},
  {primary:'ه',pattern:'1122',secondary:'ش'},
  {primary:'و',pattern:'2211',secondary:'ت'},
  {primary:'ز',pattern:'2111',secondary:'ث'},
  {primary:'ح',pattern:'1112',secondary:'خ'},
  {primary:'ط',pattern:'1121',secondary:'ذ'},
  {primary:'ي',pattern:'1211',secondary:'ض'},
  {primary:'ك',pattern:'2121',secondary:'ظ'},
  {primary:'ل',pattern:'1212',secondary:'غ'},
  {primary:'م',pattern:'2222',secondary:null},
  {primary:'ن',pattern:'1221',secondary:null},
  {primary:'س',pattern:'2112',secondary:null},
  {primary:'ع',pattern:'1111',secondary:null},
];
added.push(rec('shibutz.p138-139.letter-figure-table','source-table',[138,139],
  'השיבוץ השישי — טבלת אותיות הצורות',[
    'המקור מציג טבלה של 16 אותיות ראשיות מול 16 הצורות, ובשורה התחתונה 12 אותיות משניות נוספות.',
    'השיר בעמ׳ 139 חוזר על השיוכים ומסביר שהשיבוץ מוציא שמות וטבעים מן האותיות והיסודות.',
    'המקור קובע: לכל צורה המתהפכת שתי אותיות; לכל צורה שאינה מתהפכת אות אחת.',
    'הטבלה נשמרת כמיפוי מקור; אין להחליף אותיות לפי טבלה ממקור אחר.'
  ],{
    keywords:['השיבוץ השישי','שיבוץ האותיות','אותיות הצורות','אבג׳ד','מתהפכת','אינה מתהפכת'],
    letterFigureMap:LETTER_TABLE,
    methodStatus:'SOURCE_TABLE',operationalRole:'FOUNDATION_KNOWLEDGE',runtimeEligible:false,
    doNotInfer:['אין להשתמש בטבלת אותיות ממקור אחר במקום הטבלה המודפסת כאן.','אין להפוך את עצם קיום שתי אותיות לכלל פסיקה בלי שיטה ראשית שבחרה בשיבוץ זה.']
  }));

added.push(rec('reference.p139-140.letter-placement-operative-use','traditional-operative-reference',[139,140],
  'תועלת מסורתית של שיבוץ האותיות והשימוש באותיות מתאימות',[
    'המקור אומר שאם יש עניין נסתר או צורך שקשה להשיגו, נלקחות אותיות המתאימות לדבר לפי השיבוץ.',
    'בדוגמת אהבה בעמ׳ 140: אם בבית התשיעי צורה יוצאת נחסית והעדים מעידים על השגה, הדבר יושג אחרי יגיעה או סיבה; אז המקור מציע פעולה באותיות המתאימות.',
    'המקור מכליל שימוש מסורתי זה ל"הבאת טוב ודחיית רע".'
  ],{
    keywords:['תועלת שיבוץ האותיות','אהבה','בית תשיעי','עדים','הבאת טוב','דחיית רע'],
    methodStatus:'REFERENCE_ONLY',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    outputScope:'תיעוד של פרקטיקה מסורתית בספר בלבד; אינו מסלול פעולה אוטומטי של המערכת.',
    doNotInfer:['אין להפעיל פעולה טקסית/קמיעית אוטומטית.','אין להפוך דוגמת אהבה למסלול פסיקה כללי לכל שאלת זוגיות.']
  }));

added.push(rec('reference.p140-141.letter-nature-schools','quoted-method-comparison',[140,141],
  'שתי מסורות בטבעי האותיות',[
    'המחבר אומר שיש מחלוקת בטבעי האותיות, וההסכמה היא רק ביחס לאותיות האש.',
    'מובאת מסורת של חכמי הערבים וההודים, המבוססת על יחסי אנוש/ג׳אן, דמיון וניגודים.',
    'מולה מובאת מסורת של חכמי יוון והמזרח, המבוססת על האדם ובריאתו, ניגוד ועוינות.',
    'עמ׳ 141 מציג את שתי המסורות זו לצד זו בטבלה; הן נשמרות כשתי שיטות מצוטטות, לא כמפה מאוחדת.'
  ],{
    keywords:['טבעי האותיות','חכמי הערבים וההודים','חכמי יוון והמזרח','מחלוקת','אש'],
    traditions:[{authority:'חכמי הערבים וההודים',status:'QUOTED_SCHOOL_RULE'},{authority:'חכמי יוון והמזרח',status:'QUOTED_SCHOOL_RULE'}],
    methodStatus:'REFERENCE_ONLY',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    doNotInfer:['אין למזג את שתי טבלאות הטבעים למפה אחת.','אין לבחור מסורת לפי הקוד הקיים בלי הכרעת שאלה/מקור מפורשת.']
  }));

const infra=(id,pages,order,title,facts,extra={})=>added.push(rec(id,'placement-order',pages,title,facts,{
  keywords:['סדרי השיבוץ',`סדר ${order}`,...(extra.keywords||[])],
  orderNumber:order,methodStatus:extra.methodStatus||'SOURCE_INFRASTRUCTURE',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
  doNotInfer:['עצם קיום סדר שיבוץ אינו הופך אותו למנוע פסיקה פעיל.','אין להריץ כמה סדרי שיבוץ במקביל ולבצע הצבעת רוב.',...(extra.doNotInfer||[])],
  ...Object.fromEntries(Object.entries(extra).filter(([k])=>!['keywords','methodStatus','doNotInfer'].includes(k)))
}));

infra('shibutz.p142-143.order7-abduh',[142,143],7,'השיבוץ השביעי — אבּדח / אורך / היחידים / דניאל',[
  'ערכי היסודות: אש 1, אוויר 2, מים 4, עפר 8.',
  'הסדר מחשב את נקודות המציאות/היחיד של הצורה ומעמיד את הצורות בסדר אבּדח.',
  'המקור מציין שסדר זה הוא בסיס שממנו יוצאים סדרי הרוחב, העומק וההשבה.'
],{keywords:['אבּדח','אורך','דניאל','1 2 4 8'],elementValues:{fire:1,air:2,water:4,earth:8},countMode:'existence/single-points'});

infra('shibutz.p143-144.order8-width',[143,144],8,'השיבוץ השמיני — שיבוץ הרוחב',[
  'מחברים את מספרי המציאות וההעדר של הצורה.',
  'אם המספר גדול מ-17 מפחיתים 17; ואם אינו עולה על 17 מפחיתים 1; השארית היא מספר הבית.',
  'דוגמת כבוד נכנס: הסכום 18, פחות 17 = 1, ולכן הצורה שוכנת בבית הראשון.'
],{keywords:['רוחב','מציאות','העדר','17','כבוד נכנס'],countMode:'existence+absence',reduction:{threshold:17,subtractIfGreater:17,subtractOtherwise:1},workedExample:{pattern:'2211',total:18,resultHouse:1}});

infra('shibutz.p144-145.order9-depth',[144,145],9,'השיבוץ התשיעי — שיבוץ העומק',[
  'המקור מתבונן בצורת הדמיר ונוטל ממספר המציאות וההעדר שלה.',
  'מן הבית הראשון עד השמיני המספר עולה, ומן השמיני עד השישה־עשר הוא יורד.',
  'בדרך החשבון מפחיתים 16 מן הסכום כשהוא גדול ממנו; השארית היא מספר הבית.',
  'דוגמת כבוד נכנס: 18 פחות 16 = 2, ולכן בבית השני.'
],{keywords:['עומק','דמיר','16','כבוד נכנס'],countMode:'existence+absence',reduction:{subtract:16},workedExample:{pattern:'2211',total:18,resultHouse:2}});

infra('shibutz.p145-146.order10-return',[145,146],10,'השיבוץ העשירי — שיבוץ ההשבה',[
  'נקרא השבה מפני שהוא מחזיר/מחבר את מה שקדם לו: אורך, רוחב ועומק.',
  'החישוב מתואר על מספר ההעדר בלבד לפי ערכי אבּדח.',
  'המקור נותן גם דרך קלה: לקחת את ה-14 מסדר אבּדח וללכת שמאלה לקבלת הרוחב; אחר כך לקחת את ה-16 מן הרוחב כראשון של העומק.'
],{keywords:['השבה','אורך','רוחב','עומק','העדר','דרך קלה'],countMode:'absence-only',shortcut:'Abduh position 14 seeds Width; Width position 16 seeds Depth'});

infra('shibutz.p146-147.order11-bzdj',[146,147],11,'השיבוץ האחד־עשר — סדר בּזדג׳/יזדג׳ לפי נוסח המקור',[
  'ערכי היסודות הנמסרים: אש 2, אוויר 7, מים 4, עפר 8.',
  'החישוב מבוסס על מספר המציאות; אם המספר גדול מ-16 מפחיתים 16, ואם קטן ממנו מספרו הוא הבית.',
  'המקור מוסר את סדר הצורות גם בשיר ובטבלה.'
],{keywords:['בזדג׳','יזדג׳','2 7 4 8'],elementValues:{fire:2,air:7,water:4,earth:8},countMode:'existence',reduction:{subtract:16,whenGreater:true}});

infra('shibutz.p147-149.order12-like-abduh',[147,148,149],12,'הסדר השנים־עשר — שיבוץ כדוגמת אבּדח',[
  'בדרך הראשית הנמסרת: אש 3, אוויר 6, מים 12, עפר 24.',
  'החשבון נעשה על מספר המציאות ובהפחתות של 16 עד למיקום הבית; המקור מתאר הפחתה כפולה כאשר נדרש.',
  'מובאת גם מסורת נוספת נפרדת: אש 7, אוויר 14, מים 28, עפר 56, ומעגל כדוגמת סדר בּזדג׳.',
  'שתי מערכות הערכים נשמרות כשתי מסורות, לא כממוצע ולא כבחירה אוטומטית.'
],{keywords:['כדוגמת אבּדח','3 6 12 24','7 14 28 56'],primaryElementValues:{fire:3,air:6,water:12,earth:24},quotedAlternative:{fire:7,air:14,water:28,earth:56},countMode:'existence'});

infra('shibutz.p149.order13-damaged-name',[149],13,'הסדר השלושה־עשר — שם פגום/״לבן״ בנוסח המקור',[
  'ערכי היסודות: אש 1, אוויר 10, מים 100, עפר 1000.',
  'המקור אומר שדרך החישוב היא כדרך סדר בּזדג׳/יזדג׳.',
  'הערת המקור המודפס מציינת "بياض في الأصل"; לכן שם הסדר אינו נשמר ככותרת ודאית ויש להפריד בין הנתונים המספריים ובין שם העריכה.'
],{keywords:['1 10 100 1000','بياض في الأصل'],verificationStatus:'REVIEW_REQUIRED',elementValues:{fire:1,air:10,water:100,earth:1000},nameStatus:'DAMAGED_OR_EDITORIAL',sourceDiscrepancies:['שם הסדר אינו בטוח; המספרים והדרך ניתנים במקור, אך הכינוי ״לבן״ הוא שימור/הערת נוסח ולא כותרת מקור ודאית.']});

infra('shibutz.p149-150.order14-aiqa-al-tariq',[149,150],14,'הסדר הארבעה־עשר — שיבוץ أوقع/أيقع الطريق',[
  'ערכי היסודות: אש 9, אוויר 200, מים 10, עפר 100.',
  'הדרך נמסרת על דגם סדר בּזדג׳/יזדג׳ ומלווה בשיר ובטבלת סדר הצורות.',
  'יש לשמר את שם המקור גם אם התרגום העברי ״הדרך נופלת״ הוא פירוש עזר בלבד.'
],{keywords:['الطريق','9 200 10 100'],elementValues:{fire:9,air:200,water:10,earth:100},nameStatus:'SOURCE_ARABIC_PRESERVED'});

infra('shibutz.p150-151.order15-ibn-mahfuf',[150,151],15,'הסדר החמישה־עשר — שיבוץ אבן מחפוף אל־מנג׳ם',[
  'המקור מוסר את הסדר בשיר ובטבלה מלאה של רצף הצורות.',
  'בקטע זה לא נמסרת מערכת ערכי יסוד עצמאית או נוסחת הפחתה חדשה כמו בסדרים 7-14.',
  'לכן הרשומה משמרת את הסדר כתשתית מקור ואינה ממציאה אלגוריתם שאינו כתוב.'
],{keywords:['אבן מחפוף','ابن محفوف المنجم','שיר','טבלת סדר'],algorithmStatus:'SEQUENCE_ONLY_NO_NEW_FORMULA_FOUND',doNotInfer:['אין להמציא ערכי יסוד או נוסחת חישוב לסדר 15.']});

added.push(rec('reference.p151.sixteen-vs-fifteen-placement-count','source-conflict',[151],
  'חתימת סדרי השיבוץ — ״שישה־עשר״ מול חמישה־עשר סדרים שנמנו בפועל',[
    'הטקסט אומר: אלו שישה־עשר סדרי שיבוץ ויש לשמרם בעל־פה.',
    'הערת המקור המודפס קובעת במפורש: כך במקור, אף שמספר השיבוצים שנזכרו הוא חמישה־עשר.',
    'מעמ׳ 104 עד 151 נמצאו חמישה־עשר סדרים בעלי כותרת/מספור מובחנים.',
    'אין להמציא סדר שישה־עשר בתוך שער 3 כדי להתאים את המניין למשפט החתימה.'
  ],{
    keywords:['שישה־עשר סדרי שיבוץ','חמישה־עשר','סתירת מניין','עמוד 151'],
    verificationStatus:'REVIEW_REQUIRED',methodStatus:'SOURCE_CONFLICT',operationalRole:'REFERENCE_ONLY',runtimeEligible:false,
    sourceDiscrepancies:['המקור אומר 16 אך הערת הדפוס עצמה מציינת שנמנו בפועל 15. המחלוקת נשמרת פתוחה.'],
    doNotInfer:['אין לקדם את שיבוץ ההפכים מעמ׳ 189 אוטומטית לסדר 16 בלי ראיה מפורשת.','אין לשנות את מספור הסדרים 1-15 כדי לסגור את החשבון.'],
    sourceNote:'Printed p151 and its footnote were visually checked. This is a source/editorial count discrepancy, not a missing-index guess.'
  }));

for(const r of added){
  if(data.records.some(x=>x.entryId===r.entryId)) throw new Error(`duplicate preexisting entryId ${r.entryId}`);
  data.records.push(r);
}

// Corrections that must be made to v57 only after source indexing is stable.
data.v57CorrectionQueue=data.v57CorrectionQueue||[];
for(const item of [
  {id:'B08-P135-PLANET-LETTERS-V57',entryId:'shibutz.p135.planet-letters-utility',page:135,status:'OPEN',summary:'Correct v57 planet-letter table from printed p135: Mercury عطارد ends ح; Moon القمر ends ذ; Saturn زحل ends ص. Preserve all Arabic letters exactly.'},
  {id:'B08-P136-137-SEASON-FIGURE-GROUPS-V57',entryId:'shibutz.p136-137.season-figure-groups',page:137,status:'OPEN',summary:'Restore the explicit printed seasonal figure groups in v57. Spring has six printed figures and Summer five; do not replace the glyph groups with a three-per-season simplification.'}
]){
  if(!data.v57CorrectionQueue.some(x=>x.id===item.id)) data.v57CorrectionQueue.push(item);
}

// Downstream source-data correction discovered by direct scan verification.
data.downstreamCorrectionQueue=data.downstreamCorrectionQueue||[];
if(!data.downstreamCorrectionQueue.some(x=>x.id==='B08-SHIB-5-SEASON-MAP-SOURCE-CORRECTION')){
  data.downstreamCorrectionQueue.push({
    id:'B08-SHIB-5-SEASON-MAP-SOURCE-CORRECTION',pages:[136,137],status:'DEFERRED_UNTIL_INDEX_COMPLETE',
    summary:'Correct SHIBUTZ_5_SEASONS and all consumers. Printed source gives Spring=[2122,1211,2211,1121,2222,2112], Summer=[2212,1111,1122,2121,2112], Winter=[1221,2221,2111], Autumn=[1121,1211,1222]. The old Spring-by-elimination partition is invalid; seasonal groups overlap.'
  });
}

// Preserve genuine source conflicts instead of synthesizing a solution.
data.sourceConflictQueue=data.sourceConflictQueue||[];
for(const item of [
  {id:'B08-SOURCE-P136-P137-NODE-RETURN-WORDING',pages:[136,137],status:'OPEN',summary:'p136 mentions Qabd Kharij→Mars and Ataba Dakhila→Saturn; p137 names the two remaining Head/Tail figures as Qabd Kharij and Ataba Kharija and says they return to Saturn/Mars. Keep statements separate; p134 remains authority for Head/Tail identity.'},
  {id:'B08-SOURCE-P151-SIXTEEN-VS-FIFTEEN',pages:[151],status:'OPEN',summary:'Closing text says sixteen placement orders, while the printed footnote itself notes that only fifteen were mentioned. Do not invent or renumber an order to force closure.'}
]){
  if(!data.sourceConflictQueue.some(x=>x.id===item.id)) data.sourceConflictQueue.push(item);
}

data.schemaVersion='1.9.0';
data.coverage={...(data.coverage||{}),bookEndPage:151,scanPdfEndPage:153,status:'BATCH08_P135_151_INDEXED_WITH_REVIEW_BLOCKERS'};
data.coverage.completedBatches=[...(data.coverage.completedBatches||[]).filter(x=>x!=='BATCH08_P135_151'),'BATCH08_P135_151'];

data.gateStatus={...(data.gateStatus||{}),gate3PlacementOrders:{status:'SOURCE_INDEX_COMPLETE_WITH_OPEN_SOURCE_CONFLICTS',throughPage:151,distinctOrdersEnumerated:15,sourceClosingClaim:16,operationalizationDeferred:true}};

const json=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
fs.writeFileSync(path,text);

const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch08 p135-151 applied',counts,'records',data.records.length,'v57Queue',data.v57CorrectionQueue.length,'downstreamQueue',data.downstreamCorrectionQueue.length,'sourceConflicts',data.sourceConflictQueue.length);
