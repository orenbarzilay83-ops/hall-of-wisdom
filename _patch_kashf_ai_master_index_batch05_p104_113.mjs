#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);
if(data.schemaVersion!=='1.5.0') throw new Error(`expected schema 1.5.0, got ${data.schemaVersion}`);
if(data.records.length!==59) throw new Error(`expected 59 existing records, got ${data.records.length}`);

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

const MOSHAV=[
  ['1222','נשוא ראש','الأحيان'],['2121','ממון נכנס','قبض داخل'],['1212','ממון יוצא','قبض خارج'],['2222','קהלה','الجماعة'],
  ['1121','נלחם','الجودلة'],['1221','סוהר','العقلة'],['2221','שפל ראש','الأنكيس'],['2122','אדום','الحمرة'],
  ['2212','לבן','البياض'],['1122','כבוד יוצא','نصرة خارجة'],['2211','כבוד נכנס','نصرة داخلة'],['1112','סף יוצא','عتبة خارجة'],
  ['1111','דרך','الطريق'],['2111','סף נכנס','عتبة داخلة'],['2112','חיבור','الاجتماع'],['1211','נקי הלחי','نقي الخد']
].map(([pattern,name,arabic],i)=>({house:i+1,pattern,name,arabic}));

const NUMBER_ORDER=[
  ['1121','נלחם','الجودلة',1],['1222','נשוא ראש','الأحيان',3],['2111','סף נכנס','عتبة داخلة',6],['2212','לבן','البياض',10],
  ['1211','נקי הלחי','نقي الخد',15],['1112','סף יוצא','عتبة خارجة',21],['2122','אדום','الحمرة',28],['2221','שפל ראש','الأنكيس',36],
  ['2121','ממון נכנס','قبض داخل',45],['1221','סוהר','العقلة',55],['2112','חיבור','الاجتماع',66],['1111','דרך','الطريق',78],
  ['2211','כבוד נכנס','نصرة داخلة',91],['1212','ממון יוצא','قبض خارج',105],['2222','קהלה','الجماعة',120],['1122','כבוד יוצא','نصرة خارجة',136]
].map(([pattern,name,arabic,number],i)=>({position:i+1,pattern,name,arabic,number}));

const MONEY=[
  [1,1,null],[2,3,null],[3,6,null],[4,10,null],[5,15,null],[6,21,null],[7,29,null],[8,36,null],
  [9,45,70],[10,55,300],[11,66,600],[12,79,700],[13,105,3000],[14,110,4000],[15,120,6000],[16,136,10000]
].map(([house,value,altValue])=>({house,value,altValue}));

const added=[];
added.push(rec('shibutz.p104.framework','definition-framework',[104],
  'השער השלישי — הגדרת השיבוץ ומניין סדרי השיבוץ',[
    'המקור מגדיר שיבוץ כסידור של שש־עשרה צורות בשורה אחת באופן המורה על התקשרותן; שתיים, שלוש או ארבע צורות בלבד אינן נקראות שיבוץ.',
    'המחבר אומר שכלל סדרי השיבוץ הוא 96, ובספר זה יזכיר 16 סדרי שיבוץ בלבד, משום שלא מצא זולתם.',
    'השער פותח בשיבוץ הראשון: שיבוץ המושב.'
  ],{keywords:['השער השלישי','שיבוץ','96 סדרים','16 סדרי שיבוץ'],doNotInfer:['אין להסיק מכאן ששישה־עשר סדרים אכן מפורטים ללא חסר בגוף השער; זו הצהרת המחבר שיש לשמר בנפרד ממיפוי הכיסוי.']}));

added.push(rec('shibutz.p104-105.moshav-order','placement-order',[104,105],
  'השיבוץ הראשון — שיבוץ המושב',[
    'הטבלה המודפסת מעמידה את כל 16 הצורות במושבן לפי סדר קבוע; כאשר צורה שוכנת בביתה בסדר זה, המקור מייחס לכך גילוי של הכוונה הנסתרת וחיזוק כוח הבית.',
    'המקור מביא דעה חלופית שלפיה נקי הלחי בבית 13 ודרך בבית 16, אך אומר שהראשון נכון יותר; החלופה אינה נבלעת בטבלה הראשית.'
  ],{keywords:['שיבוץ המושב','מושב','סוד הכוונות','16 צורות'],placements:MOSHAV,
    rejectedVariant:{rawSummary:'נאמר: נקי הלחי בבית 13 ודרך בבית 16; הראשון נכון יותר.',placements:[{pattern:'1211',house:13},{pattern:'1111',house:16}]},
    doNotInfer:['אין לערבב בין שיבוץ המושב הזה לבין טבלת מעלה/מושב/גבול/פנים שבעמ׳ 97–99.','אין להחליף את הטבלה הראשית בחלופה שנדחתה.'],sourceNote:'Printed p104 text and the p105 visual 16-cell table were checked; the main order and rejected variant are stored separately.'}));

added.push(rec('shibutz.p105-107.number-duration-order','placement-order',[105,106,107],
  'השיבוץ השני — סדר המספר ומשך־הזמן',[
    'המקור נותן סדר בן 16 צורות עם מספרים מצטברים 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136.',
    'ארבעת המקומות הראשונים מזרחיים, הבאים מערביים, אחריהם דרומיים והאחרונים צפוניים.',
    'בעמ׳ 107 נשמרת מחלוקת: יש המחליפים את ממון נכנס וכבוד יוצא בין המקום התשיעי לשישה־עשר; אין למזג את שתי הגרסאות.'
  ],{keywords:['שיבוץ המספר','משך הזמן','מספר מצטבר','רוחות'],numberOrder:NUMBER_ORDER,
    directionGroups:[{positions:[1,2,3,4],direction:'מזרח'},{positions:[5,6,7,8],direction:'מערב'},{positions:[9,10,11,12],direction:'דרום'},{positions:[13,14,15,16],direction:'צפון'}],
    reportedVariant:{swap:[{pattern:'2121',position:16},{pattern:'1122',position:9}],status:'reported-competing-view'},
    doNotInfer:['אין להחליף את הסדר המודפס בחלופה המובאת כדעה אחרת.']}));

added.push(rec('shibutz.p107-108.cumulative-number-method','calculation-rule',[107,108],
  'דרך חישוב המספר המצטבר',[
    'המקור מורה לקחת את מספרה של כל צורה ולהוסיף עליו את חלק/מספר הצורות שקדמו לה.',
    'בדוגמה: נלחם 1; נשוא ראש 2 ועוד 1 = 3; סף נכנס 3 ועוד 3 = 6; לבן 4 ועוד 6 = 10; וכך עד סוף הסדר.',
    'הסדרה שקולה למספרים המשולשיים n(n+1)/2, אך נוסחה אלגברית זו היא תיאור נגזר מן הדוגמאות ולא לשון המקור.'
  ],{keywords:['חישוב מצטבר','1 3 6 10','מספר משולשי'],procedure:['קח את הערך הבסיסי של מיקום הצורה בסדר.','הוסף אליו את הסכום המצטבר שקדם לו.','המשך לפי סדר 1–16.'],derivedFormula:{expression:'n(n+1)/2',sourceStatus:'derived-from-explicit-examples-not-source-wording'},doNotInfer:['אין להציג את הנוסחה האלגברית כציטוט מן הספר.']}));

added.push(rec('shibutz.p108-109.author-number-resolution','author-resolution',[108,109],
  'הכרעת המחבר במחלוקת המספר ומשך־הזמן',[
    'המחבר מציג שתי דעות: המספר/משך־הזמן לצורות בלבד, או לבתים בלבד, ומדגים מדוע כל אחת לבדה אינה נכונה.',
    'הכרעתו: כאשר צורה שוכנת בביתה לפי סדר שיבוץ זה, המספר ומשך־הזמן שייכים לבית ולצורה יחד.',
    'כאשר הצורה אינה בביתה, המקור אומר: بل نأخذ هواء الهواء، ونولد منهم شكلا — לוקחים "אוויר האוויר" ומולידים מהם צורה, ואז דנים לפי המספר/הצער/היום.',
    'המנגנון המדויק של هواء الهواء אינו נסגר כאן ברמת פעולה מכנית ולכן נשמר כפער תפעולי ולא מושלם מן הקוד.'
  ],{keywords:['הכרעת המחבר','מספר','משך זמן','هواء الهواء','אוויר האוויר'],operationalStatus:'PARTIAL_UNRESOLVED_HAWA_AL_HAWA',unresolvedMechanism:'هواء الهواء',doNotInfer:['אין לזהות את هواء الهواء עם helper או זוג בתים קיים בלי מקור מפורש.','אין להשתמש בקוד הקיים כדי להשלים את המנגנון החסר.']}));

added.push(rec('shibutz.p109-110.direction-rule','direction-rule',[109,110],
  'כלל הרוחות בשיבוץ המספר',[
    'צורה מזרחית באמהות מורה שהמבוקש במזרח; מערבית בבנות — במערב; דרומית בנולדות — בדרום; צפונית במאזנים — בצפון.',
    'כאשר יש ריבוי בכיוון אחד, הדין לרוב.',
    'כאשר מופיעות שתי צורות בשני כיוונים, מובאת דעה שהמבוקש ביניהם; המחבר קובע כנכון יותר להוליד מן השתיים צורה ולבדוק באיזה רבע מן הלוח היא שורה.',
    'אם הצורה אינה נמצאת בלוח, בודקים לאיזה רבע מארבעת הרבעים היא שייכת, ושם המבוקש.'
  ],{keywords:['מזרח','מערב','דרום','צפון','רוחות','רבעים'],doNotInfer:['אין להפוך את דעת "בין שני הכיוונים" להכרעת המחבר.','אין להגדיר את ארבעת הרבעים מחדש לפי קוד אם המקור המקומי אינו נותן כאן מיפוי נוסף.']}));

const DURATION=[
  [1,1,'יום'],[2,3,'ימים'],[3,6,'ימים'],[4,10,'ימים'],[5,1,'שבוע'],[6,3,'שבועות'],[7,6,'שבועות'],[8,10,'שבועות'],
  [9,1,'חודש'],[10,3,'חודשים'],[11,6,'חודשים'],[12,10,'חודשים'],[13,1,'שנה'],[14,3,'שנים'],[15,6,'שנים'],[16,10,'שנים']
].map(([house,value,unit])=>({house,value,unit}));
added.push(rec('shibutz.p110.duration-by-house','source-table',[110],
  'מן מקור אחר — שיבוץ המספר והערכת משך־הזמן לפי בתים',[
    'המקור האחר מחלק את האמהות לימים, הבנות לשבועות, הנולדות לחודשים והמאזנים לשנים.',
    'הבתים 1–4 מקבלים 1,3,6,10 ימים; 5–8 מקבלים 1,3,6,10 שבועות; 9–12 מקבלים 1,3,6,10 חודשים; 13–16 מקבלים 1,3,6,10 שנים.'
  ],{keywords:['משך זמן','ימים','שבועות','חודשים','שנים','מן מקור אחר'],durationByHouse:DURATION,doNotInfer:['אין למזג אוטומטית טבלה זו עם המספר הקנוני של הצורות; המקור מציג אותה כקטע ממקור אחר.']}));

added.push(rec('shibutz.p111.money-number-table','source-table',[111],
  'מן מקור אחר — ערכי הבתים במספר ובממון',[
    'הסריקה המודפסת נותנת לבית 7 ערך 29 — לא 28.',
    'לבית 11: 66, ובנוסחה אחרת 600.',
    'לבית 12: 79, ובנוסחה אחרת 700.',
    'המספרים החלופיים נשמרים כמסורת נפרדת מן הערכים הראשיים.'
  ],{keywords:['ממון','דרהם','דינר','מספר הבית','נוסחה אחרת'],moneyByHouse:MONEY,verificationStatus:'REVIEW_REQUIRED',
    sourceDiscrepancies:['v57 הנוכחי מציג לבית 7 את הערך 28 במקום 29 בקטע עמ׳ 111.','v57 הנוכחי מציג לבית 11 חלופה 760 במקום 600.','v57 הנוכחי מציג לבית 12 חלופה 770 במקום 700.'],
    doNotInfer:['אין לתקן את עמ׳ 106 ל־29: עמ׳ 106 הוא סדר אחר ובו 28; הפער הוא מסורת מקומית של עמ׳ 111.'],sourceNote:'Printed p111 was re-read number by number. The record remains REVIEW_REQUIRED only because v57 currently disagrees in three numeric fields.'}));

added.push(rec('shibutz.p112.lisan-al-amr','operational-rule',[112],
  'לשון העניין — הכרעה, זמן ועדות',[
    'המקור אומר שכל הדין הוא לפי כוח העדים.',
    'לשון העניין מתוארת כבית השמיני, הנולד מן הבית הראשון ומבית הכוונה/הضمير; במקום שבו היא חוזרת — הדין בו מוחלט.',
    'נוסח פעולה נוסף באותו עמוד מתאר את לשון העניין כצורה המתקבלת מהכאת בית הכוונה בשלישיו — החמישי והתשיעי; שתי הלשונות נשמרות ואינן מאוחדות בשקט.',
    'אם הצורה נמצאת ביתדות — הדין בהווה; אם ב־مائل الأوتاد — בעתיד; אם ב־الزائل الساقط عن الوتد — בעבר.',
    'מיטיב מורה על השגה במהירות; מזיק על היפוכה; קבוע על עצירה/השהיה; מתהפך על היפוכה; ויש להתחשב בשליש כעד.'
  ],{keywords:['לשון העניין','لسان الأمر','בית שמיני','מائل الأوتاد','עבר הווה עתיד','עד'],verificationStatus:'REVIEW_REQUIRED',
    structuralStates:[{arabic:'الأوتاد',judgment:'הווה/מצב נוכחי'},{arabic:'مائل الأوتاد',judgment:'עתיד'},{arabic:'الزائل الساقط عن الوتد',judgment:'עבר'}],
    sourceDiscrepancies:['v57 הנוכחי מתרגם את ענף מائل الأوتاد כתוצאה סמנטית "בעתיד" בלי לשמר שהטריגר הוא סיווג בית מבני; הדבר עלול לגרום ל־AI לאבד את תנאי ההפעלה.'],
    doNotInfer:['אין למחוק אחת משתי לשונות ההפקה של לשון העניין כדי ליישר את המקור.','אין להחליף את מائل الأوتاد במילת זמן בלבד בתוך חוזה תפעולי.'],sourceNote:'Printed p112 was read line by line; REVIEW_REQUIRED is caused by loss of the structural trigger in current v57, not by uncertainty in the Arabic wording.'}));

const ZANATI=[
  {figure:'שפל ראש',pattern:'2221',sourceCategory:'שבועות',house:4,targetCategory:'ימים',figureNumber:36,houseNumber:10,operation:'subtract',result:26,unit:'דרהם/דינר לפי הדוגמה'},
  {figure:'סף נכנס',pattern:'2111',sourceCategory:'ימים',house:7,targetCategory:'שבועות',figureNumber:6,addedFigure:'אדום',addedPattern:'2122',addedNumber:28,operation:'add',result:34,unit:'יום או דרהם/דינר'},
  {figure:'דרך',pattern:'1111',sourceCategory:'שנים',house:8,targetCategory:'שבועות',resultText:'שנה ושלושה ימים; או אלף ושלושה דרהמים/דינרים'},
  {figure:'נשוא ראש',pattern:'1222',sourceCategory:'ימים',house:13,targetCategory:'שנים',operation:'subtract',resultText:'מפחיתים מן השנה שלושה ימים ודנים בשארית'}
];
added.push(rec('shibutz.p113.al-zanati-examples','quoted-authority-examples',[113],
  'דברי אל־זנאתי במספר — דוגמאות מעשיות',[
    'שפל ראש, צורת שבוע, בבית 4 של הימים: 36 פחות 10 = 26.',
    'סף נכנס בבית 7: 6 ועוד מספר אדום 28 = 34.',
    'דרך, צורת שנים, בבית 8: שנה ושלושה ימים, או אלף ושלושה בממון.',
    'נשוא ראש, צורת ימים, בבית 13 של השנים: מפחיתים מן השנה שלושה ימים ודנים בשארית.',
    'הכלל הכללי של אל־זנאתי ממשיך לעמ׳ 114; אין להתייחס לעמ׳ 113 כיחידה סגורה של כל שיטתו.'
  ],{keywords:['אל־זנאתי','מספר','משך זמן','דוגמאות'],examples:ZANATI,continuationRequired:[114],verificationStatus:'REVIEW_REQUIRED',
    sourceDiscrepancies:['v57 הנוכחי משבש את דוגמת נשוא ראש ומנסח הפחתה מן "שישה"; המקור המודפס אומר במפורש: نقص من السنة، ثلاثة أيام — הפחת מן השנה שלושה ימים.'],
    doNotInfer:['אין להסמיך את כלל אל־זנאתי המלא לפני מיפוי המשכו בעמ׳ 114.','אין להפוך את ארבע הדוגמאות לפורמולה כללית מעבר למה שהמקור מוסר.'],sourceNote:'Printed p113 was checked line by line. The source example is clear; the record remains REVIEW_REQUIRED because v57 is wrong in the Ahyan example and the rule continues on p114.'}));

for(const r of added){
  if(data.records.some(x=>x.entryId===r.entryId)) throw new Error(`duplicate existing entry ${r.entryId}`);
  data.records.push(r);
}

data.v57CorrectionQueue ||= [];
data.v57CorrectionQueue.push(
  {id:'B05-P111-MONEY-NUMBERS',entryId:'shibutz.p111.money-number-table',page:111,status:'OPEN',summary:'In the p111 from-another-source money/number table, restore H7=29, H11 alternate=600, H12 alternate=700. Do not alter the distinct p106 canonical sequence where position 7=28.'},
  {id:'B05-P112-MAIL-AWTAD',entryId:'shibutz.p112.lisan-al-amr',page:112,status:'OPEN',summary:'Restore the structural trigger مائل الأوتاد in the future branch; do not reduce it to the semantic word future.'},
  {id:'B05-P113-AHYAN-YEAR',entryId:'shibutz.p113.al-zanati-examples',page:113,status:'OPEN',summary:'Correct the Ahyan example to subtract three days from one year, and mark that al-Zanati rule continues on p114.'}
);

data.downstreamCorrectionQueue ||= [];
data.downstreamCorrectionQueue.push(
  {id:'B05-DATA-P111-MONEY-TABLE',sourceEntryId:'shibutz.p111.money-number-table',status:'DEFER_UNTIL_INDEX_COMPLETE',target:'goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js',summary:'SHIBUTZ_2_MONEY_BY_HOUSE currently carries p111 H7=28 and alternate 760/770 for H11/H12; printed p111 is 29, 600, 700. Keep this scoped apart from p106 canonical values.'},
  {id:'B05-P112-LISAN-STRUCTURE',sourceEntryId:'shibutz.p112.lisan-al-amr',status:'DEFER_UNTIL_INDEX_COMPLETE',target:'goral-hachol/engine/kashf-leshon-hainyan.js',summary:'Review downstream logic for preserving the source structural state מائل الأوتاد as the trigger for future judgment rather than collapsing it to a semantic label.'}
);

data.indexPolicyNotes ||= [];
data.indexPolicyNotes.push({id:'B05-SHIBUẒ-SCOPE',note:'Chapter 3 contains competing and quoted traditions. Main order, rejected/reported alternatives, author resolutions, and material introduced as from another book are stored as separate source scopes and must not be silently merged.'});

data.schemaVersion='1.6.0';
data.coverage.bookEndPage=113;
data.coverage.scanPdfEndPage=115;
data.coverage.status='BATCH05_P104_113_INDEXED_WITH_REVIEW_BLOCKERS';
data.coverage.completedBatches ||= [];
if(!data.coverage.completedBatches.includes('BATCH05_P104_113')) data.coverage.completedBatches.push('BATCH05_P104_113');

const json=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
text=text.replace('<b>מצב Batch 01:</b>','<b>מצב האינדקס:</b>');
fs.writeFileSync(path,text);
const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch05 p104-113 applied',counts,'records',data.records.length,'v57Queue',data.v57CorrectionQueue.length,'downstreamQueue',data.downstreamCorrectionQueue.length);
