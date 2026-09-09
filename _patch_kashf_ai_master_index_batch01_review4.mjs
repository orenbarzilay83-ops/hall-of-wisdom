#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);
if(data.schemaVersion!=='1.1.2') throw new Error(`expected schema 1.1.2, got ${data.schemaVersion}`);

function get(id){const r=data.records.find(x=>x.entryId===id);if(!r) throw new Error(`missing ${id}`);return r;}

// p25: structural definition now checked directly against v57 + printed p25.
{
  const r=get('forms.p25.structure-odd-even');
  if(r.verificationStatus!=='REVIEW_REQUIRED') throw new Error('p25 expected REVIEW_REQUIRED');
  r.verificationStatus='VERIFIED';
  r.sourceDiscrepancies=[];
  r.sourceVerification={printedBookPages:[25],scanPdfPages:[27],v57Checked:true,printedScanChecked:true,note:'Printed p25 and v57 agree: every figure has four levels; paired/even is two points and single/odd is one point; the transmitted structure is not to be altered by addition or subtraction. Only these source-bounded structural facts are certified.'};
}

// p41-42: close the visual-table blocker and preserve the exact 1..16 placement map.
{
  const r=get('placement.p41-42.house-letter-binary');
  if(r.verificationStatus!=='REVIEW_REQUIRED') throw new Error('p41-42 expected REVIEW_REQUIRED');
  r.verificationStatus='VERIFIED';
  r.sourceDiscrepancies=[];
  r.criticalFacts=[
    'בנקודה יחידית בלבד: אש=1, אוויר=2, מים=4, עפר=8; נקודה זוגית אינה מוסיפה משקל.',
    'סכום היחידים משכן את הצורה בבית 1–16; כאשר אין נקודה יחידית כלל מתקבלת קהלה בבית 16.',
    'טבלת המקור בעמ׳ 41 מצמידה לכל בית גם אות ערבית מן א עד ע לפי הסדר המפורט במפת השיבוץ.'
  ];
  r.placementMap=[
    {house:1,letter:'ا',pattern:'1222',figure:'נשוא ראש'},
    {house:2,letter:'ب',pattern:'2122',figure:'אדום'},
    {house:3,letter:'ج',pattern:'1122',figure:'כבוד יוצא'},
    {house:4,letter:'د',pattern:'2212',figure:'לבן'},
    {house:5,letter:'ه',pattern:'1212',figure:'ממון יוצא'},
    {house:6,letter:'و',pattern:'2112',figure:'חיבור'},
    {house:7,letter:'ز',pattern:'1112',figure:'סף יוצא'},
    {house:8,letter:'ح',pattern:'2221',figure:'שפל ראש'},
    {house:9,letter:'ط',pattern:'1221',figure:'סוהר'},
    {house:10,letter:'ي',pattern:'2121',figure:'ממון נכנס'},
    {house:11,letter:'ك',pattern:'1121',figure:'נלחם'},
    {house:12,letter:'ل',pattern:'2211',figure:'כבוד נכנס'},
    {house:13,letter:'م',pattern:'1211',figure:'בר הלחי'},
    {house:14,letter:'ن',pattern:'2111',figure:'סף נכנס'},
    {house:15,letter:'س',pattern:'1111',figure:'דרך'},
    {house:16,letter:'ع',pattern:'2222',figure:'קהלה'}
  ];
  r.sourceVerification={printedBookPages:[41,42],scanPdfPages:[43,44],v57Checked:true,printedScanChecked:true,visualTableChecked:true,note:'The printed p41 table was visually decoded column-by-column. Its 16 patterns match the 1/2/4/8 single-point weighting stated on p42 and the Hebrew source rule. The full house-letter-pattern map is stored explicitly so AI does not have to re-read the graphic.'};
}

// p23-24 remains blocked, but the blocker is now exact rather than generic.
{
  const r=get('context.p23-24.comparative-divination');
  r.sourceDiscrepancies=[
    'Printed p24 says علم الكتف and describes stripping meat from the object before inspecting it like a mirror: this is shoulder-blade/scapula divination, not palmistry. v57 currently renders it as ״חכמת כף היד״ and therefore requires correction.',
    'The index must not use the v57 palmistry wording as a source fact. Until v57 is corrected, this record stays REVIEW_REQUIRED.'
  ];
  r.sourceCorrectionRequired={bookPage:24,scanPdfPage:26,arabic:'علم الكتف',currentV57:'חכמת כף היד',requiredHebrew:'חכמת עצם השכמה / בדיקה בעצם השכמה (ניסוח סופי לפי תרגום v57 המאושר)'};
  r.sourceVerification={printedBookPages:[23,24],scanPdfPages:[25,26],v57Checked:true,printedScanChecked:true,note:'Comparison exposed a real translation mismatch at علم الكتف; no silent reconciliation was made.'};
}

// p43-44 remains blocked because v57 collapsed distinct source categories.
{
  const r=get('houses.p43-44.taxonomy');
  r.sourceTaxonomy=[
    {arabic:'الأوتاد',houses:[1,4,7,10],time:'הווה'},
    {arabic:'مائل الأوتاد',houses:[2,5,8,11],time:'עתיד'},
    {arabic:'زايد الأوتاد',houses:[3,6,9],time:'עבר',note:'כך מודפס בסריקה; אין לנרמל בשקט ל־زائل'},
    {arabic:'الساقط',houses:[6,12],time:null,note:'קטגוריה נפרדת במקור; H6 מופיע גם ברשימת زايد الأوتاد וגם כאן'}
  ];
  r.sourceDiscrepancies=[
    'v57 מאחד את H3,H6,H9,H12 תחת ״נופלי היתדות״. בסריקה המודפסת עמ׳ 44 יש הבחנה מפורשת: زايد الأوتاد = H3,H6,H9 ומורה על העבר; الساقط = H6,H12 כרשימה נפרדת.',
    'אין לתקן את החריגות לפי סימטריה. במיוחד H6 מופיע בשתי רשימות במקור, ויש לשמר זאת כהערת נוסח עד תיקון v57.'
  ];
  r.sourceVerification={printedBookPages:[43,44],scanPdfPages:[45,46],v57Checked:true,printedScanChecked:true,note:'The printed taxonomy was re-read visually. The source distinction and H6 overlap are now recorded exactly; v57 still requires correction before certification.'};
}

// p45: preserve the isolated printed word rather than guessing its function.
{
  const r=get('houses.p45.aspects-and-gender');
  r.sourceExactSextileArabic='وأما التسديس ، فهو : من الأول إلى الثالث ، ومن التاسع إلى الحادي عشر ، ومن الرابع إلى الثامن ؛ والثاني ويخص كل تسديس وتدان .';
  r.sourceDiscrepancies=[
    'After the three sextile pairs, the printed source contains the isolated wording ״والثاني״ before ״ويخص كل تسديس وتدان״. v57 omits this word.',
    'Its grammatical/structural function is not secure from the printed sentence alone. Preserve it as a source anomaly; do not invent a fourth pair or silently delete it.'
  ];
  r.sourceVerification={printedBookPages:[45],scanPdfPages:[47],v57Checked:true,printedScanChecked:true,note:'The anomaly is visually certain. The meaning of the isolated والثاني is not resolved, so the record intentionally remains REVIEW_REQUIRED.'};
}

// p46-53: make the two known profile discrepancies exact and keep the rest bounded.
{
  const r=get('houses.p46-53.profiles');
  const h2=r.houseProfiles?.find(h=>h.house===2);
  const h3=r.houseProfiles?.find(h=>h.house===3);
  if(!h2||!h3) throw new Error('H2/H3 profiles missing');
  h2.verificationStatus='REVIEW_REQUIRED';
  h2.sourceDiscrepancy='Printed p47 contains the exact phrase ״وعلى ما يستقبل رضاعه من الأولاد״. v57 reduces this to ״מינקת הילדים״, which is more specific than the Arabic wording securely supports. Preserve the Arabic phrase and do not choose a narrower Hebrew interpretation without a source note.';
  h2.sourceArabicCriticalPhrase='وعلى ما يستقبل رضاعه من الأولاد';
  h3.verificationStatus='REVIEW_REQUIRED';
  h3.sourceDiscrepancy='Printed p47 says ״وهو بيت الأخوة ، والأخوات...״. The word ״המים״ in v57 ״זהו בית המים, האחים...״ is not part of the domain list; ماء الماء appears only immediately before as the name of the figure-in-house relation.';
  h3.requiredCorrection='Remove ״המים״ from the H3 domain list while retaining ״מי המים״ as the preceding relation/name.';
  r.sourceDiscrepancies=[h2.sourceDiscrepancy,h3.sourceDiscrepancy];
  r.sourceVerification={printedBookPages:[46,47,48,49,50,51,52,53],scanPdfPages:[48,49,50,51,52,53,54,55],v57Checked:true,printedScanChecked:true,note:'The known profile blockers are isolated to H2 wording and the extra H3 domain word. They are recorded as source corrections instead of being silently repaired inside the index.'};
}

data.schemaVersion='1.2.0';
data.coverage.status='BATCH01_V57_CORRECTIONS_REQUIRED';
data.v57CorrectionQueue=[
  {id:'B01-P24-KATIF',entryId:'context.p23-24.comparative-divination',page:24,status:'OPEN',summary:'Correct علم الكتف: current v57 says palmistry; printed source describes shoulder-blade/scapula divination.'},
  {id:'B01-P44-TAXONOMY',entryId:'houses.p43-44.taxonomy',page:44,status:'OPEN',summary:'Restore distinct زايد الأوتاد H3/H6/H9 and الساقط H6/H12 instead of collapsing H3/H6/H9/H12.'},
  {id:'B01-P45-WALTHANI',entryId:'houses.p45.aspects-and-gender',page:45,status:'OPEN',summary:'Preserve isolated والثاني after sextile list as a source anomaly; do not infer its function.'},
  {id:'B01-P47-H2',entryId:'houses.p46-53.profiles',page:47,status:'OPEN',summary:'Replace narrow ״מינקת הילדים״ with a source-faithful treatment of وعلى ما يستقبل رضاعه من الأولاد.'},
  {id:'B01-P47-H3',entryId:'houses.p46-53.profiles',page:47,status:'OPEN',summary:'Remove extra ״המים״ from H3 domain list; retain ״מי המים״ only as the preceding relation/name.'}
];

const json=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
fs.writeFileSync(path,text,'utf8');
const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch01 review4 applied',counts,'corrections',data.v57CorrectionQueue.length);
