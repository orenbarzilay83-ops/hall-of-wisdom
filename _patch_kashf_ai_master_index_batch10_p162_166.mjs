import fs from 'node:fs';

const PATH='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(PATH,'utf8');
const RX=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(RX);
if(!m) throw new Error('master index JSON block missing');
const d=JSON.parse(m[1]);
if(d.schemaVersion!=='2.0.0') throw new Error(`expected schema 2.0.0, got ${d.schemaVersion}`);
if(d.records.length!==121) throw new Error(`expected 121 records, got ${d.records.length}`);

const scan=ps=>ps.map(p=>p+2);
const anchors=ps=>ps.map(p=>`kashf-v57-draft.html#p${p}`);
const R=(entryId,entryType,pages,topic,criticalFacts,x={})=>({
  entryId,entryType,bookPages:pages,scanPdfPages:scan(pages),v57Anchors:anchors(pages),topic,
  keywords:x.keywords||[],criticalFacts,
  outputScope:x.outputScope||'ידע מקור לאחזור AI; אינו הופך לבדו למסלול פסק פעיל.',
  doNotInfer:x.doNotInfer||[],sourceDiscrepancies:x.sourceDiscrepancies||[],
  verificationStatus:x.verificationStatus||'VERIFIED',
  sourceVerification:{printedBookPages:pages,scanPdfPages:scan(pages),v57Checked:true,printedScanChecked:true,visualLineByLineChecked:true,note:x.note||'v57 was compared against the enlarged printed Arabic scan.'},
  methodStatus:x.methodStatus||'SOURCE_RULE',operationalRole:x.operationalRole||'REFERENCE_ONLY',runtimeEligible:false,
  ...(x.extra||{})
});

const added=[];

added.push(R('gate5.p162.kahala-derekh-movement-arrow','figure-context-rule',[162],
  'קהלה ודרך — חץ התנועה והשקט',[
    'קהלה בבית פנימי ובקרבה לצורות פנימיות מורה על רווחה ושמחה; בקרבה לחיצוניות מזיקות התועלת מתאחרת; בקרבה לפנימית מיטיבה הטוב קרוב.',
    'דרך כוללת במקור سهم الحركة וסهم السكون — חץ התנועה וחץ השקט — לפי קשר/חיבור; היא עשויה להיראות נעה, שקטה או מקולקלת.',
    'כאשר דרך מתחברת לצורות חיצוניות היא מתוארת כמקולקלת; באמהות ובבנות היא مطلق, ובשמונה הבתים האחרים יש לה כוח, פעולה, תנועה ושקט לפי חיבור והיפרדות.'
  ],{
    keywords:['קהלה','דרך','חץ התנועה','חץ השקט','חיבור','היפרדות','פנימי','חיצוני'],
    operationalRole:'FOUNDATION_KNOWLEDGE',
    doNotInfer:['אין להפוך את המונחים חיבור/היפרדות לאלגוריתם חדש מעבר לדוגמאות המפורשות.','אין להסיק שדרך תמיד חיובית או תמיד שלילית.']
  }));

added.push(R('gate5.p162-163.derekh-house-rules','house-conditional-rules',[162,163],
  'דרך בבתים — תנאי הורים ודין תנועה',[
    'H9: אם H1 פנימי ו-H2 חיצוני — נסיעה/בקשה מצד נעדר עם בלבול; אם H1 חיצוני ו-H2 פנימי — הנעדר מגיע בקרוב אך דבר יוצא מידו.',
    'H10: השאלה על מלאכה/עבודה; אם H3 חיצוני ו-H4 פנימי המקור אומר שהדין מתהפך, בלי לפרט כאן את ענף הבסיס ההפוך.',
    'H12: H7 פנימי + H8 חיצוני — מצוקה/מאסר קשה אך שחרור מהיר; H7 חיצוני + H8 פנימי — אין שחרור ויש תוספת קושי.',
    'H13: המקור המודפס קובע H9 פנימי + H10 חיצוני → חזרה מהירה מן הנסיעה; H9 חיצוני + H10 פנימי → עיכוב בנסיעה והישארות זמן רב.',
    'H11: H5 פנימי + H6 חיצוני → פחד על החולה; H5 חיצוני + H6 פנימי → החולה משתפר במהירות וגם המבוקש מתקבל.',
    'H14: H11 פנימי + H12 חיצוני → המצוקה מתחלפת במנוחה.',
    'H15: H13 פנימי + H14 פנימי, כאשר יש מבוקש → המבוקש אינו מתקבל והחולה בפחד ובלבול; H13 חיצוני + H14 פנימי → טוב או שלום.',
    'H16: H15 פנימי + H1 חיצוני → טובה, אושר, שמחה ונסיעה מבורכת.'
  ],{
    keywords:['דרך','H9','H10','H11','H12','H13','H14','H15','H16','פנימי','חיצוני','נסיעה','חולה'],
    verificationStatus:'REVIEW_REQUIRED',
    methodStatus:'SOURCE_RULE_WITH_V57_MISMATCH',operationalRole:'REFERENCE_ONLY',
    sourceDiscrepancies:['בעמ׳ 163 v57 הופך את ענף H13: הוא כותב H9 חיצוני + H10 פנימי = חזרה מהירה. בסריקה המודפסת כתוב להפך: H9 פנימי + H10 חיצוני = חזרה מהירה; H9 חיצוני + H10 פנימי = עיכוב ארוך.'],
    doNotInfer:['אין להשתמש בגרסת v57 ההפוכה לצורך runtime עד תיקונה.','אין להמציא את ענף הבסיס של H10 רק משום שהמקור אומר ״הדין מתהפך״.'],
    note:'Printed p163 was enlarged and read word-for-word. The H9/H10 polarity branch is source-closed and contradicts current v57/clean-text transcription.'
  }));

added.push(R('gate5.p163.fastest-figures','figure-ranking',[163],
  'הצורות המהירות בהשגה ובכניסה',[
    'המקור מגדיר את דרך כמהירה ביותר בהשגה ובכניסה.',
    'אחריה כבוד נכנס / النصرة الداخلة; שתי הצורות מוצגות כמורות על השגה מהירה יחסית.'
  ],{
    keywords:['דרך','כבוד נכנס','מהירות','השגה','כניסה'],
    operationalRole:'FOUNDATION_KNOWLEDGE',
    doNotInfer:['אין להפוך דירוג מהירות זה למדד זמן מספרי ללא כלל מקור נוסף.']
  }));

added.push(R('gate5.p164.figure-desire-rules','figure-context-rule',[164],
  'דיני תועלת, תקווה והשגה בצורות נבחרות',[
    'נקי הלחי מתואר כבעל ריבוי תקוות והפוגות ממושכות, אך תועלתו מועטה.',
    'סף נכנס מורה על ריבוי תועלת.',
    'כבוד יוצא מתואר במיעוט השגה ובריבוי עמל; התאוות/המבוקשים ניתנים רק כאשר הצורות בבתים מיטיבים, ובבתים מזיקים אין מתקבל דבר.'
  ],{
    keywords:['נקי הלחי','סף נכנס','כבוד יוצא','תועלת','תקווה','השגה','בתים מיטיבים','בתים מזיקים'],
    operationalRole:'FOUNDATION_KNOWLEDGE',
    doNotInfer:['אין להפוך כל תיאור כללי של צורה לפסק עצמאי ללא הקשר שאלה ובית.']
  }));

added.push(R('gate5.p164.seven-witnesses','witness-scheme',[164],
  'שבעת עדי החכמה — H9 עד H15; H16 נוסף לדמיר',[
    'המקור מונה שבעה עדים בדיוק: H9, H10, H11, H12, H13, H14, H15.',
    'H16 אינו אחד משבעת העדים; הוא נוסף כדי לדעת בו את הכוונה הנסתרת של השואל.',
    'אם רבות בעדים צורות מיטיבות — דנים על פיהן; אם גוברות צורות מזיקות — דנים על פיהן.',
    'אם הצורה המכריעה מן הקבועות והיא פנימית — הדבר מתקבל אך מתאחר.'
  ],{
    keywords:['שבעת עדי החכמה','H9','H10','H11','H12','H13','H14','H15','H16','דמיר'],
    extra:{witnessHouses:[9,10,11,12,13,14,15],hiddenIntentionHouse:16,verdictRole:'supporting-finding'},
    methodStatus:'SOURCE_WITNESS_SCHEME',operationalRole:'SUPPORTING_ONLY',
    doNotInfer:['אין לספור H16 בתוך שבעת העדים.','אין להפוך את שיטת העדים למסלול ראשי לכל שאלה; היא שכבת עדות מסייעת בלבד עד למיפוי תפעולי מפורש.','אין למזג אותה עם שיטות עדים אחרות כהצבעת רוב.']
  }));

added.push(R('gate5.p164.figure-proximity-core','proximity-rules',[164],
  'קרבת הצורות — כללי הליבה בעמ׳ 164',[
    'קרבת צורת מאדים לצורת נוגה מקבלת במקור משמעות מינית מסורתית.',
    'אדום בקרבה לצורה משובחת מורה על זהב ולבושים אדומים; בקרבה מזיקה מורה על דם/הריגה והאבדה אינה חוזרת.',
    'נקי הלחי החוזר פעמיים או שלוש מורה על פחד; נקי הלחי בקרבה לממון יוצא מורה על فتنة/תנועה בהקשר מגונה.'
  ],{
    keywords:['קרבת הצורות','מאדים','נוגה','אדום','נקי הלחי','ממון יוצא'],
    methodStatus:'SOURCE_PROXIMITY_RULES',operationalRole:'REFERENCE_ONLY',
    doNotInfer:['אין להפעיל את כללי הקרבה עד שיוגדר במערכת באופן מקור-נאמן מה נחשב ״קרבה״ בין צורות.','אין להסיק זהות אדם או אירוע ממשי מן הקרבה לבדה.']
  }));

added.push(R('gate5.p165.figure-proximity-extended','proximity-rules',[165],
  'קרבת הצורות — כללים מורחבים בעמ׳ 165',[
    'סף יוצא אם הופיע בשני מקומות בהקשר חולה — המקור נותן דין חומרה קיצוני.',
    'דרך עם צורה מיטיבה → דרך שלום; עם צורה מגונה → דרך פחד.',
    'קהלה עם דומה לה → צבאות; עם סוהר/الثقاف או לבן → خلاص حامل; סוהר עם אדום → דינרים אדומים; עם לבן → דרהמים; עם צורה נקבית → אישה הרה.',
    'נשוא ראש עם צורה משובחת בהקשר חולה → אין פחד; עם שפל ראש → ספר/דבר שחור ולבן; ב-H10/H1/H5 → ראש/אדם נכבד; בשאלת נישואי אישה → יופי גלוי.',
    'כבוד נכנס עם סוהר/צורה נשית → השאלה על אישה.',
    'כבוד יוצא עם אדום → דבר מתכתי שנכנס באש; עם דומה לה → אבדה; עם סף נכנס → מלבוש; עם לבן → הדחה/סילוק.'
  ],{
    keywords:['סף יוצא','דרך','קהלה','סוהר','אדום','לבן','שפל ראש','נשוא ראש','כבוד נכנס','כבוד יוצא','קרבת הצורות'],
    verificationStatus:'REVIEW_REQUIRED',methodStatus:'SOURCE_PROXIMITY_RULES_WITH_AMBIGUITY',operationalRole:'REFERENCE_ONLY',
    sourceDiscrepancies:['באמצע דין שפל ראש/חולה בעמ׳ 165 מופיע רצף מקור תחבירי קשה: "وخرج المريض، طال مرضه، وإن كان خارجا، خيف عليه من الهلاك". v57 משמר רק את הענף הברור של צורה חיצונית ופחד מאבדון. אין להשלים את החלק האמצעי בלי ראיה נוספת.'],
    doNotInfer:['אין להמציא משמעות לחלק התחבירי הבעייתי.','אין להפעיל כללי קרבה לפני הגדרה חישובית מקור-נאמן של קרבה.'],
    note:'Printed p165 was checked visually. Most pair rules are clear; only the Ankis/patient middle clause remains source-ambiguous.'
  }));

added.push(R('gate5.p166.general-combination-indicators','question-intent-method-candidates',[166],
  'פרק כולל לסימנים רבים — צירופי בתים לפי סוג שאלה',[
    'מבוקש כללי: מולידים צורה מן H1+H4.',
    'נוסע: H1+H9; התוצאה מורה על מצבו וכוחו בנסיעה.',
    'חולה: H1+H8.',
    'שהייה או מעבר: H1+H15; תוצאה פנימית → נשאר, חיצונית → נוסע.',
    'עבד/משרת: H6+H16; אסיר: H2+H12.',
    'זכר או נקבה: H1+H4; צורה זכרית → זכר, נקבית → נקבה.',
    'נעדר: H1+H16; הטוב/הרע ומצבו נידונים מן התוצאה.'
  ],{
    keywords:['H1+H4','H1+H9','H1+H8','H1+H15','H6+H16','H2+H12','H1+H16','נוסע','חולה','נעדר','אסיר'],
    methodStatus:'SOURCE_METHOD_CANDIDATES',operationalRole:'PRIMARY_CANDIDATES',
    extra:{questionIntentCandidates:[
      {questionIntent:'general-desired-matter',houses:[1,4],status:'PRIMARY_CANDIDATE',runtimeEligible:false},
      {questionIntent:'traveler-state',houses:[1,9],status:'PRIMARY_CANDIDATE',runtimeEligible:false},
      {questionIntent:'patient-state',houses:[1,8],status:'PRIMARY_CANDIDATE',runtimeEligible:false},
      {questionIntent:'stay-or-move',houses:[1,15],status:'PRIMARY_CANDIDATE',runtimeEligible:false,polarity:{dakhil:'stays',kharij:'travels'}},
      {questionIntent:'servant-state',houses:[6,16],status:'PRIMARY_CANDIDATE',runtimeEligible:false},
      {questionIntent:'prisoner-state',houses:[2,12],status:'PRIMARY_CANDIDATE',runtimeEligible:false},
      {questionIntent:'absent-person-state',houses:[1,16],status:'PRIMARY_CANDIDATE',runtimeEligible:false}
    ]},
    doNotInfer:['PRIMARY_CANDIDATE אינו אישור runtime; יש לבחור מסלול ראשי אחד לפי intent רק לאחר השלמת האינדקס.','אין להריץ כמה מן הצירופים יחד לשאלה אחת בלי הוראת מקור מפורשת.']
  }));

added.push(R('gate6.p166.transition','gate-transition',[166],
  'מעבר לשער השישי — דיני שנים־עשר הבתים',[
    'בעמ׳ 166 מסתיים הפרק הכולל ונפתח השער השישי: דין שנים־עשר הבתים, מפורט לשנים־עשר פרקים.',
    'הפרק הראשון הוא בדינים על הנפש ומה שנלווה לה; תוכנו המלא שייך ל-Batch הבא.'
  ],{
    keywords:['השער השישי','12 בתים','הנפש','פרק ראשון'],methodStatus:'SOURCE_GATE',operationalRole:'FOUNDATION_KNOWLEDGE',
    doNotInfer:['אין לספח לבאץ׳ זה את דיני הנפש שמתחילים לאחר כותרת המעבר.']
  }));

for(const r of added){
  if(d.records.some(x=>x.entryId===r.entryId)) throw new Error(`duplicate ${r.entryId}`);
  d.records.push(r);
}

d.v57CorrectionQueue=d.v57CorrectionQueue||[];
if(!d.v57CorrectionQueue.some(x=>x.id==='B10-P163-DEREKH-H13-PARENT-POLARITY')) d.v57CorrectionQueue.push({
  id:'B10-P163-DEREKH-H13-PARENT-POLARITY',entryId:'gate5.p162-163.derekh-house-rules',page:163,status:'OPEN',
  summary:'Correct v57 p163 H13 branch to printed source: H9 dakhil + H10 kharij = quick return; H9 kharij + H10 dakhil = delay/long travel. Current v57 has these reversed.'
});

d.downstreamCorrectionQueue=d.downstreamCorrectionQueue||[];
for(const item of [
  {id:'B10-DEREKH-H13-POLARITY-DOWNSTREAM',pages:[163],status:'DEFERRED_UNTIL_INDEX_COMPLETE',summary:'Audit any DEREKH_HOUSE_RULES/runtime data for the p163 H9/H10 parent-polarity reversal; printed scan is authoritative.'},
  {id:'B10-SEVEN-WITNESSES-SUPPORTING-ROLE',pages:[164],status:'DEFERRED_UNTIL_INDEX_COMPLETE',summary:'Seven Witnesses H9-H15 are a supporting witness scheme; H16 is separate for dhamir. Do not auto-route as a primary method or merge with other witness systems.'},
  {id:'B10-PROXIMITY-NO-RUNTIME-WITHOUT-DEFINITION',pages:[164,165],status:'DEFERRED_UNTIL_INDEX_COMPLETE',summary:'Do not wire figure-proximity rules until a source-faithful computational definition of proximity is established.'}
]) if(!d.downstreamCorrectionQueue.some(x=>x.id===item.id)) d.downstreamCorrectionQueue.push(item);

d.sourceConflictQueue=d.sourceConflictQueue||[];
if(!d.sourceConflictQueue.some(x=>x.id==='B10-SOURCE-P165-ANKIS-PATIENT-CLAUSE')) d.sourceConflictQueue.push({
  id:'B10-SOURCE-P165-ANKIS-PATIENT-CLAUSE',pages:[165],status:'OPEN',
  summary:'Printed p165 Ankis/patient sentence contains a syntactically unclear middle clause. Preserve literal uncertainty; do not reconstruct by symmetry or from downstream code.'
});

d.gateStatus={...(d.gateStatus||{}),gate5FoundationalFigures:{pages:[161,162,163,164,165,166],indexed:true,runtimeOperationalizationDeferred:true,sevenWitnesses:[9,10,11,12,13,14,15],hiddenIntentionHouse:16,proximityRuntimeAllowed:false,derekhP163V57PolarityMismatch:true}};
d.schemaVersion='2.1.0';
d.coverage={...(d.coverage||{}),bookEndPage:166,scanPdfEndPage:168,status:'BATCH10_P162_166_INDEXED_WITH_REVIEW_BLOCKERS'};
d.coverage.completedBatches=[...(d.coverage.completedBatches||[]).filter(x=>x!=='BATCH10_P162_166'),'BATCH10_P162_166'];

const json=JSON.stringify(d,null,2);
text=text.replace(RX,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
fs.writeFileSync(PATH,text);
const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,d.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch10 applied',counts,'records',d.records.length,'v57',d.v57CorrectionQueue.length,'downstream',d.downstreamCorrectionQueue.length,'conflicts',d.sourceConflictQueue.length);
