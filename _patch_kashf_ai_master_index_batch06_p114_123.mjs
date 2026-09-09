#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);
if(data.schemaVersion!=='1.6.0') throw new Error(`expected schema 1.6.0, got ${data.schemaVersion}`);
if(data.records.length!==69) throw new Error(`expected 69 existing records, got ${data.records.length}`);

const scan=(ps)=>ps.map(p=>p+2);
const anchors=(ps)=>ps.map(p=>`kashf-v57-draft.html#p${p}`);
const rec=(entryId,entryType,bookPages,topic,criticalFacts,extra={})=>({
  entryId,entryType,bookPages,scanPdfPages:scan(bookPages),v57Anchors:anchors(bookPages),topic,
  keywords:extra.keywords||[],criticalFacts,
  operationalRole:extra.operationalRole||'REFERENCE_ONLY',
  runtimeEligible:extra.runtimeEligible??false,
  outputScope:extra.outputScope||'חומר מקור לאחזור AI; עצם הופעתו בספר אינה הופכת אותו למנוע פעיל.',
  doNotInfer:extra.doNotInfer||[],sourceDiscrepancies:extra.sourceDiscrepancies||[],
  verificationStatus:extra.verificationStatus||'VERIFIED',
  sourceVerification:{printedBookPages:bookPages,scanPdfPages:scan(bookPages),v57Checked:true,printedScanChecked:true,visualLineByLineChecked:true,note:extra.sourceNote||'v57 was compared with the printed Arabic scan; literal source anomalies were preserved rather than normalized.'},
  ...Object.fromEntries(Object.entries(extra).filter(([k])=>!['keywords','operationalRole','runtimeEligible','outputScope','doNotInfer','sourceDiscrepancies','verificationStatus','sourceNote'].includes(k)))
});

// Need-driven method selection policy: source coverage != runtime activation.
data.methodSelectionPolicy={
  version:'1.0',
  principle:'ONE_PRIMARY_METHOD_PER_QUESTION_INTENT',
  rules:[
    'עצם הופעת שיטה בספר אינה מעניקה לה רשות ריצה.',
    'שיטות מצוטטות של חכמים אחרים, נוסחים אחרים וחומר לימודי נשמרים באינדקס אך ברירת המחדל שלהם היא REFERENCE_ONLY ו-runtimeEligible=false.',
    'שיטה נבחרת להפעלה רק כאשר מטרת השאלה דורשת אותה והיא הוגדרה כמסלול הראשי המתאים לאותו intent.',
    'אין להריץ כמה שיטות מקבילות ולבצע הצבעת רוב, אלא אם המקור עצמו דורש במפורש חיבור בין שיטות.',
    'בצ׳מיר/דמיר אין מטרה למפות או להפעיל את כל הסוגים; ממפים תפעולית רק סוגים הנחוצים לשאלות שהמערכת צריכה לענות עליהן.'
  ],
  operationalRoles:['PRIMARY','AUTHOR_PREFERRED','PRIMARY_CANDIDATE','REFERENCE_ONLY','REJECTED','UNRESOLVED_PRECEDENCE','FOUNDATION']
};

const p113=data.records.find(r=>r.entryId==='shibutz.p113.al-zanati-examples');
if(!p113) throw new Error('p113 al-Zanati record missing');
p113.operationalRole='REFERENCE_ONLY';
p113.runtimeEligible=false;
p113.selectionNote='דברי אל־זנאתי נשמרים כחלק מן הספר, אך אינם מופעלים אוטומטית ואינם מתחרים במסלול הראשי.';

const dalailRows=[
  ['1121','נלחם',7,4,null,306],['1222','נשוא ראש',7,2,14,208],['2111','סף נכנס',5,6,3,201],['2212','לבן',5,8,4,15],
  ['1211','נקי הלחי',7,3,201,51],['1112','סף יוצא',5,9,45,6],['2122','אדום',1,1,7,4],['2221','שפל ראש',5,7,35,1],
  ['2121','ממון נכנס',6,3,18,306],['1221','סוהר',8,8,64,200],['2112','חיבור',60,4,24,500],['1111','דרך',4,10,4,915],
  ['2211','כבוד נכנס',6,7,201,708],['1212','ממון יוצא',6,5,301,606],['2222','קהלה',6,5,3,505],['1122','כבוד יוצא',6,6,306,405]
].map(([pattern,name,length,width,depth,number],i)=>({position:i+1,pattern,name,length,width,depth,number}));

const hayati=[
  ['1121','נלחם',1],['1222','נשוא ראש',3],['2111','סף נכנס',6],['2212','לבן',10],['1211','נקי הלחי',15],['1112','סף יוצא',21],['2122','אדום',28],['2221','שפל ראש',36],
  ['2121','ממון נכנס',45],['1221','סוהר',55],['2112','חיבור',66],['2211','כבוד נכנס',78],['1111','דרך',91],['1212','ממון יוצא',105],['2222','קהלה',120],['1122','כבוד יוצא',139]
].map(([pattern,name,days])=>({pattern,name,days}));

const winds=[
  [1,'شرق الشرق','מזרח המזרח'],[2,'غرب الشرق','מערב המזרח'],[3,'بحر الشرق','ים המזרח'],[4,'قبل الشرق','דרום/קיבלה של המזרח'],
  [5,'شرق الغرب','מזרח המערב'],[6,'غرب الغرب','מערב המערב'],[7,'بحر الغرب','ים המערב'],[8,'قبل الغرب','דרום/קיבלה של המערב'],
  [9,'شرق البحر','מזרח הים'],[10,'غرب البحر','מערב הים'],[11,'بحر البحر','ים הים'],[12,'قبل البحر','דרום/קיבלה של הים'],
  [13,'شرق القبل','מזרח הדרום/קיבלה'],[14,'غرب القبل','מערב הדרום/קיבלה'],[15,'بحر القبل','ים הדרום/קיבלה'],[16,'قبل القبل','דרום/קיבלה של הדרום/קיבלה']
].map(([house,arabic,hebrew])=>({house,arabic,hebrew}));

const elementOrder=[
  ['1222','נשוא ראש'],['2122','אדום'],['2212','לבן'],['2221','שפל ראש'],['2112','חיבור'],['1112','סף יוצא'],['1121','נלחם'],['1211','נקי הלחי'],
  ['2111','סף נכנס'],['1111','דרך'],['2222','קהלה'],['1122','כבוד יוצא'],['1212','ממון יוצא'],['1221','סוהר'],['2121','ממון נכנס'],['2211','כבוד נכנס']
].map(([pattern,name],i)=>({position:i+1,pattern,name}));

const added=[];
added.push(rec('shibutz.p114.al-zanati-continuation','quoted-authority-continuation',[114],
  'השלמת דברי אל־זנאתי מן העמוד הקודם',[
    'הקטע ממשיך את דברי אל־זנאתי מן עמ׳ 113 ואומר שאם צורה שוכנת בבית, מוסיפים עליה את בעל הבית.',
    'המחבר מתאר זאת כסוד שנשענו עליו בעלי מסורות רבים ולא גילו אותו אלא ברמז.'
  ],{keywords:['אל־זנאתי','השלמה','בעל הבית'],operationalRole:'REFERENCE_ONLY',runtimeEligible:false,doNotInfer:['אין להפוך את דברי אל־זנאתי למסלול ברירת־מחדל לשאלות מספר/משך.']}));

added.push(rec('shibutz.p114-115.dalail-al-fadl-table','external-source-table',[114,115],
  'מן ספר דלאיל אל־פצל — טבלת אורך, רוחב, עומק ומספר',[
    'הספר מייחס את הטבלה במפורש לספר אחר: دلايل الفضل في علم الرمل.',
    'הסריקה המודפסת מכילה ערכים חריגים שאינם תמיד שווים למכפלת אורך×רוחב; הם נשמרים כפי שנדפסו.',
    'דוגמאות קריטיות: סף נכנס עומק 3; נקי הלחי עומק 201; חיבור אורך 60; דרך עומק 4; כבוד נכנס עומק 201; ממון יוצא עומק 301; כבוד יוצא עומק 306.'
  ],{keywords:['דלאיל אל־פצל','אורך','רוחב','עומק','מספר'],operationalRole:'REFERENCE_ONLY',runtimeEligible:false,printedRows:dalailRows,verificationStatus:'REVIEW_REQUIRED',
    sourceDiscrepancies:['v57 מנרמל חלק גדול מערכי העומק לפי אורך×רוחב ומחליף בכך את המספרים המודפסים.','בשורה הראשונה העומק מודפס כריק; אין להשלים אותו ל־28 בלי הערת נוסח מפורשת.'],
    doNotInfer:['אין לתקן את הטבלה לפי נוסחת עמ׳ 116.','אין להשתמש בטבלת מקור חיצוני זו כמנוע פעיל בלי בחירה מפורשת.']}));

added.push(rec('shibutz.p115-117.hayati-days','attributed-numbering-table',[115,116,117],
  'מניין ימי החיאתי לכל צורה',[
    'המניין מתחיל בנלחם=1, נשוא ראש=3, סף נכנס=6 וממשיך בסדרה שנמסרה עד כבוד יוצא=139.',
    'כבוד נכנס=78, דרך=91, ממון יוצא=105, קהלה=120 וכבוד יוצא=139.',
    'מניין זה נשמר כמסורת נפרדת ואינו זהה אוטומטית לסדרת המספר שבעמ׳ 105–107, שבה כבוד יוצא=136.'
  ],{keywords:['חיאתי','ימי החיאתי','139'],operationalRole:'REFERENCE_ONLY',runtimeEligible:false,hayatiDays:hayati,doNotInfer:['אין ליישב 139 מול 136 באמצעות בחירה שרירותית; אלו הקשרים שונים במקור.']}));

added.push(rec('shibutz.p117.time-ranks-literal','source-taxonomy',[117],
  'הרבעים ומדרגות הזמן — הנוסח המודפס המילולי',[
    'המקור המודפס אומר: ארבע האמהות = הרבע המזרחי = מדרגות הימים.',
    'המקור המודפס אומר: הבנות = הרבע המערבי = מדרגות החודשים.',
    'המקור המודפס אומר: המאזנים = הרבע הדרומי/קיבלה = מדרגות השנים.',
    'במשפט הפותח הזה אין אזכור מפורש לנולדות/منشآت.'
  ],{keywords:['רבעים','ימים','חודשים','שנים','אמהות','בנות','מאזנים'],operationalRole:'FOUNDATION',runtimeEligible:false,verificationStatus:'REVIEW_REQUIRED',
    sourceDiscrepancies:['v57 שינה את הבנות ל״מדרגות השבועות״ והוסיף את הנולדות כ״רבע הים / מדרגות החודשים״; זה מתאים למבנה שמופיע במקומות אחרים בספר אך אינו הנוסח המודפס של המשפט בעמ׳ 117.'],
    doNotInfer:['אין לתקן את עמ׳ 117 לפי הסימטריה או לפי עמ׳ 115 בלי הערת נוסח.']}));

added.push(rec('shibutz.p117.sixteen-winds','house-direction-table',[117],
  'שש־עשרה הרוחות לפי הבתים',[
    'המקור מונה לכל אחד מ־16 הבתים כיוון מורכב בתוך הרבע שלו, מן شرق الشرق בבית 1 ועד قبل القبل בבית 16.',
    'הטבלה היא מפת בתים/רוחות ואינה כשלעצמה שיטת פסק.'
  ],{keywords:['16 רוחות','شرق الشرق','بحر البحر','قبل القبل'],operationalRole:'FOUNDATION',runtimeEligible:false,winds}));

added.push(rec('shibutz.p117-119.add-subtract-example','calculation-example',[117,118,119],
  'כלל ההוספה והגריעה ודוגמת הממון',[
    'המקור נותן כללי הוספה/גריעה כאשר צורות של יחידת זמן אחת יושבות במדרגות של יחידת זמן אחרת.',
    'בדוגמה על ממון: קהלה=120, מוסיפים 6 של הבית הרביעי ומקבלים 126; מפחיתים 3.',
    'לאחר ההפחתה הספר המודפס כותב במילים: ألف ومائة وثلاثة وعشرون = 1123, אך מיד מפחית על 28 ומקבל שארית 11; שארית 11 מתאימה ל־123 ולא ל־1123.',
    'האנומליה נשמרת כטעות/סתירת נוסח אפשרית ואינה מתוקנת בשקט.'
  ],{keywords:['הוספה','גריעה','126','1123','123','ממון'],operationalRole:'PRIMARY_CANDIDATE',runtimeEligible:false,verificationStatus:'REVIEW_REQUIRED',
    arithmeticTrace:{base:120,houseAdd:6,afterAdd:126,subtract:3,printedAfterSubtract:1123,arithmeticallyExpectedAfterSubtract:123,nextReductionBase:28,sourceRemainder:11},
    sourceDiscrepancies:['v57 מציג 123 ומעלים את ألف המודפס; האינדקס שומר גם את הנוסח המודפס וגם את הסתירה החשבונית.'],doNotInfer:['אין להחליט שהמחבר התכוון בוודאות ל־123 ללא הערת נוסח.']}));

added.push(rec('shibutz.p119-120.duration-points-method','calculation-method',[119,120],
  'דרך משך־הזמן בנקודות והדרך המספרית לפי מדרגות',[
    'מונים את נקודות ארבע האמהות, זוג ויחיד, מפחיתים שש־עשרה שש־עשרה, ואת השארית מוליכים מן הבית הראשון.',
    'במקום שבו מסתיים המניין בודקים את הצורה ואת יסודה; האמהות מורות שעות/ימים, הבנות ימים/שבועות והמאזנים חודשים/שנים.',
    'הנוסח המודפס בעמ׳ 119 חוזר בטעות/חריגה על המילה الأمهات גם בענף של שבועות/חודשים; v57 החליף אותה בנולדות.',
    'בדרך המספר: אמהות=אחדות, בנות=עשרות, נולדות=מאות, מאזנים=אלפים.',
    'בדוגמת אדום בעמ׳ 120 המקור אומר במקום השנים ألفا درهم — אלפיים דרהם, בהתאם למספר שתיים; v57 מציג אלף.'
  ],{keywords:['משך הזמן','נקודות','16','אמהות','בנות','נולדות','מאזנים','אלפיים דרהם'],operationalRole:'PRIMARY_CANDIDATE',runtimeEligible:false,verificationStatus:'REVIEW_REQUIRED',
    structuralScale:{mothers:'שעות/ימים',daughters:'ימים/שבועות',spawned:'שבועות/חודשים לפי ההקשר והדוגמאות',balances:'חודשים/שנים'},numericScale:{mothers:1,daughters:10,spawned:100,balances:1000},humraExample:{pointValue:2,mothersMoney:2,daughtersMoney:20,spawnedMoney:200,balancesMoney:2000},
    sourceDiscrepancies:['v57 מנרמל את החזרה השנייה של الأمهات בעמ׳ 119 לנולדות.','v57 מתרגם ألفا درهم בעמ׳ 120 כאלף במקום אלפיים.'],doNotInfer:['אין להפעיל את השיטה אוטומטית לכל שאלת זמן/מספר עד שתיבחר כנתיב הראשי המתאים.']}));

added.push(rec('shibutz.p121.al-zanati-al-layth-distance','quoted-authority-methods',[121],
  'דברי אל־זנאתי ואל־לית׳ על מרחקים',[
    'אל־זנאתי: אוספים את כל היחידים מן הצורה הראשונה עד החמש־עשרה, מפחיתים 16, ומוליכים את השארית על הבתים; אמהות=שיבר, בנות=אמה, נולדות=באע, מאזנים=פרסה.',
    'אל־לית׳ מביא דרך קרובה אך תולה את יחידת המידה בשורש הצורה שבה נעצר המספר.',
    'שתי הדרכים מובאות בשם חכמים אחרים ומיד אחריהן נאמר: رجع إلى النسخة الأولى — חזרה לנוסחה הראשונה.'
  ],{keywords:['אל־זנאתי','אל־לית׳','שיבר','אמה','באע','פרסה','מרחק'],operationalRole:'REFERENCE_ONLY',runtimeEligible:false,doNotInfer:['אין להריץ את שתי דרכי המרחק במקביל ואין לבחור אחת מהן בלי צורך תפעולי מפורש.']}));

added.push(rec('shibutz.p121-123.elements-order','placement-order',[121,122,123],
  'השיבוץ השלישי — שיבוץ היסודות',[
    'הטבלה המודפסת מסדרת 16 צורות בסדר יסודות קבוע.',
    'המחבר מציין שיש מחלוקת רבה אך יביא את מה שסמכו עליו הראשונים ומה שנהגו בו האחרונים.',
    'ערכי היסוד הם: אש=1, אוויר=2, מים=3, עפר=4; שורש היסודות הוא דרך וסכומם 10.',
    'צורות היסוד לדוגמה: נשוא ראש=אש 1, אדום=אוויר 2, לבן=מים 3, שפל ראש=עפר 4.',
    'אם יש בצורה שניים או שלושה יסודות, נוטלים לכל יסוד את חלקו לפי הסדר; המשך הכלל בעמ׳ 123 אומר שכל יסוד הבא מוסיף עשרה על קודמו.'
  ],{keywords:['השיבוץ השלישי','שיבוץ היסודות','אש 1','אוויר 2','מים 3','עפר 4','דרך 10'],operationalRole:'PRIMARY_CANDIDATE',runtimeEligible:false,elementOrder,elementValues:{fire:1,air:2,water:3,earth:4},rootPattern:'1111',doNotInfer:['גם אם נתוני שיבוץ זה כבר קיימים בקוד, אין מכאן הרשאה להפעיל כל סוג דמיר שמשתמש בהם.']}));

added.push(rec('foundation.p123.point-polarity-lexicon','definition',[123],
  'הנקודה המוחלטת והיפוכה — מילון מצבים',[
    'הנקודה המוחלטת נקראת במקור: نقطة, مفردة, محلولة, حية, موجودة, خفيفة.',
    'היפוכה בן שתי הנקודות נקרא: نقطتين, مزدوجة, مربوطة, معدومة, ميتة, ثقيلة.',
    'המונחים נשמרים כמערכת ניגודים של המקור ואינם מוחלפים במונח בינארי יחיד.'
  ],{keywords:['נקודה מוחלטת','נקודה קשורה','יחיד','זוג','חיה','מתה','קלה','כבדה'],operationalRole:'FOUNDATION',runtimeEligible:false,absoluteTerms:['نقطة','مفردة','محلولة','حية','موجودة','خفيفة'],pairedTerms:['نقطتين','مزدوجة','مربوطة','معدومة','ميتة','ثقيلة']}));

added.push(rec('foundation.p123.bound-point-element-associations','source-correspondence-table',[123],
  'הנקודה הקשורה — שיוכי היסודות',[
    'המקור קושר: אש=ראייה, אוויר=דיבור, מים=חיבור, עפר=פירוד.',
    'כיוונים: אש=מזרח, אוויר=מערב, מים=צפון, עפר=דרום.',
    'ממון: אש=דרהם, אוויר=חצי דרהם, מים=רבע דרהם, עפר=שמינית דרהם.',
    'מידות במקור: אש=שיבר, אוויר=אמה, מים=באע/פישוק ידיים, עפר=קומה.',
    'צבעים במקור: אש=לבן, אוויר=אדום, מים=ירוק, עפר=שחור.',
    'תכונות הסיום במקור: אש=طريف, אוויר=لطيف, מים=خفيف, עפר=كثيف.'
  ],{keywords:['שיוכי יסודות','שיבר','באע','קומה','לבן','אדום','ירוק','שחור'],operationalRole:'FOUNDATION',runtimeEligible:false,verificationStatus:'REVIEW_REQUIRED',
    associations:{fire:{direction:'east',money:'1 dirham',measure:'shibr',color:'white',qualityArabic:'طريف'},air:{direction:'west',money:'1/2 dirham',measure:'dhira',color:'red',qualityArabic:'لطيف'},water:{direction:'north',money:'1/4 dirham',measure:'baa',color:'green',qualityArabic:'خفيف'},earth:{direction:'south',money:'1/8 dirham',measure:'qama',color:'black',qualityArabic:'كثيف'}},
    sourceDiscrepancies:['v57 מחליף בין מים לעפר במידות: נותן לעפר באע ולמים קומה, בעוד המקור המודפס אומר מים=באע ועפר=קומה.','v57 מחליף בין אוויר למים בצבעים: המקור אומר אוויר=אדום ומים=ירוק.','v57 מתרגם طريف כ״חדה״; יש להשאיר את המילה לבדיקה מילונית/נוסחית ולא לנחש.'],doNotInfer:['אין להמיר את طريف ל״חד״ או לכל תכונה אחרת ללא אימות לשוני.']}));

for(const r of added){if(data.records.some(x=>x.entryId===r.entryId)) throw new Error(`duplicate new entry ${r.entryId}`);data.records.push(r);}

data.v57CorrectionQueue=data.v57CorrectionQueue||[];
data.v57CorrectionQueue.push(
  {id:'B06-P114-115-DALAIL-PRINTED',entryId:'shibutz.p114-115.dalail-al-fadl-table',page:'114-115',status:'OPEN',summary:'Restore the printed Dalail al-Fadl table literally; do not normalize depth/length values by multiplication.'},
  {id:'B06-P117-TIME-RANKS-LITERAL',entryId:'shibutz.p117.time-ranks-literal',page:117,status:'OPEN',summary:'Preserve printed daughters=months and omission of spawned group in the opening sentence; add note rather than silently harmonizing.'},
  {id:'B06-P118-PRINTED-1123',entryId:'shibutz.p117-119.add-subtract-example',page:118,status:'OPEN',summary:'Printed text says 1123 after 126-3, while the following remainder 11 implies 123; preserve as a textual/arithmetic anomaly.'},
  {id:'B06-P119-REPEATED-MOTHERS',entryId:'shibutz.p119-120.duration-points-method',page:119,status:'OPEN',summary:'Printed source repeats الأمهات in the weeks/months branch; current v57 silently changes it to spawned figures.'},
  {id:'B06-P120-TWO-THOUSAND',entryId:'shibutz.p119-120.duration-points-method',page:120,status:'OPEN',summary:'Translate ألفا درهم in the Humra example as two thousand dirhams, not one thousand.'},
  {id:'B06-P123-ELEMENT-ASSOCIATIONS',entryId:'foundation.p123.bound-point-element-associations',page:123,status:'OPEN',summary:'Correct v57 element measure/color swaps and leave طريف unresolved until linguistically verified.'}
);

data.downstreamCorrectionQueue=data.downstreamCorrectionQueue||[];
data.downstreamCorrectionQueue.push(
  {id:'B06-OPS-ATTRIBUTED-METHODS',sourcePages:[113,114,121],status:'DEFER_UNTIL_INDEX_COMPLETE',summary:'Al-Zanati, al-Layth and other attributed/variant methods are REFERENCE_ONLY by default; do not auto-run or vote them against the selected primary method.'},
  {id:'B06-DHAMIR-NEED-DRIVEN',sourcePages:[121,122,123],status:'DEFER_UNTIL_INDEX_COMPLETE',summary:'SHIBUTZ_3_ELEMENT_VALUES may support a needed dhamir intent, but its presence in code must not cause all dhamir types to run. Select only question-relevant operational types.'}
);

data.indexPolicyNotes=data.indexPolicyNotes||[];
data.indexPolicyNotes.push({id:'B06-METHOD-SELECTION',note:'Source-complete indexing is separate from runtime selection. External authors, alternate methods and study material remain searchable but inactive unless a concrete question intent requires them and a single primary route is chosen.'});

data.schemaVersion='1.7.0';
data.coverage.bookEndPage=123;
data.coverage.scanPdfEndPage=125;
data.coverage.status='BATCH06_P114_123_INDEXED_WITH_REVIEW_BLOCKERS';
data.coverage.completedBatches=[...(data.coverage.completedBatches||[]),'BATCH06_P114_123'];

const json=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
fs.writeFileSync(path,text);
const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch06 p114-123 applied',counts,'records',data.records.length,'v57Queue',data.v57CorrectionQueue.length,'downstreamQueue',data.downstreamCorrectionQueue.length);
