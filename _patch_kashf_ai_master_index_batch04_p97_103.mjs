#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);
if(data.schemaVersion!=='1.4.0') throw new Error(`expected schema 1.4.0, got ${data.schemaVersion}`);
if(data.records.length!==54) throw new Error(`expected 54 existing records, got ${data.records.length}`);

const anchors=(pages)=>pages.map(p=>`kashf-v57-draft.html#p${p}`);
const scan=(pages)=>pages.map(p=>p+2);
const rec=(entryId,entryType,bookPages,topic,criticalFacts,extra={})=>({
  entryId,entryType,bookPages,scanPdfPages:scan(bookPages),v57Anchors:anchors(bookPages),topic,
  keywords:extra.keywords||[],criticalFacts,
  outputScope:extra.outputScope||'חומר מקור לאחזור AI; אין להפוך אותו לפסק עצמאי בלי כלל מקור מפורש.',
  doNotInfer:extra.doNotInfer||[],sourceDiscrepancies:extra.sourceDiscrepancies||[],
  verificationStatus:extra.verificationStatus||'VERIFIED',
  sourceVerification:{
    printedBookPages:bookPages,scanPdfPages:scan(bookPages),v57Checked:true,printedScanChecked:true,
    note:extra.sourceNote||'The printed Arabic scan was re-read visually; source wording is preserved without silent normalization.',
    ...(extra.sourceExtra||{})
  },
  ...Object.fromEntries(Object.entries(extra).filter(([k])=>!['keywords','outputScope','doNotInfer','sourceDiscrepancies','verificationStatus','sourceNote','sourceExtra'].includes(k)))
});

const dignityRows=[
  {pattern:'1121',name:'נלחם',arabic:'الجودلة',maala:1,moshav:5,gvul:9,panim:11,simcha:5,tzaar:7,mezeg:null,note:'צערו נאמר כ״כנגדו, והוא שביעו״.'},
  {pattern:'1222',name:'נשוא ראש',arabic:'الأحيان',maala:2,moshav:1,gvul:1,panim:1,simcha:11,tzaar:null,mezeg:6},
  {pattern:'2111',name:'סף נכנס',arabic:'عتبة داخلة',maala:3,moshav:14,gvul:7,panim:14,simcha:5,tzaar:null,mezeg:2},
  {pattern:'2212',name:'לבן',arabic:'البياض',maala:4,moshav:9,gvul:4,panim:6,simcha:6,tzaar:null,mezeg:null},
  {pattern:'1211',name:'נקי הלחי',arabic:'نقي الخد',maala:5,moshav:16,gvul:9,panim:13,simcha:null,tzaar:null,mezeg:null},
  {pattern:'1112',name:'סף יוצא',arabic:'عتبة خارجة',maala:6,moshav:13,gvul:8,panim:7,simcha:6,tzaar:null,mezeg:null},
  {pattern:'2122',name:'אדום',arabic:'الحمرة',maala:7,moshav:9,gvul:3,panim:2,simcha:null,tzaar:null,mezeg:null},
  {pattern:'2221',name:'שפל ראש',arabic:'الأنكيس',maala:8,moshav:7,gvul:2,panim:8,simcha:12,tzaar:null,mezeg:5},
  {pattern:'2211',name:'כבוד נכנס',arabic:'نصرة داخلة',maala:9,moshav:10,gvul:6,panim:3,simcha:12,tzaar:null,mezeg:null},
  {pattern:'2112',name:'חיבור',arabic:'الإجتماع',maala:11,moshav:15,gvul:15,panim:6,simcha:15,tzaar:null,mezeg:3},
  {pattern:'1122',name:'כבוד יוצא',arabic:'نصرة خارجة',maala:12,moshav:11,gvul:5,panim:12,simcha:null,tzaar:null,mezeg:6},
  {pattern:'1111',name:'דרך',arabic:'الطريق',maala:13,moshav:13,gvul:16,panim:15,simcha:13,tzaar:null,mezeg:5,burj:7},
  {pattern:'1212',name:'ממון יוצא',arabic:'قبض خارج',maala:14,moshav:3,gvul:12,panim:5,simcha:10,tzaar:'opposite-of-10',mezeg:3},
  {pattern:'2222',name:'קהלה',arabic:'جماعة',maala:16,moshav:2,gvul:11,panim:10,simcha:10,tzaar:null,mezeg:9}
];

data.records.push(rec('figures.p97-99.dignities-source-table','source-table',[97,98,99],
  'מעלות, מושבים, גבולות, פנים, שמחות, צערים ומזגים — טבלת המקור המודפסת',[
    'הטבלה המודפסת בעמ׳ 97–99 מונה 14 צורות בלבד; ממון נכנס וסוהר אינם מקבלים בה ערך.',
    'סף יוצא: מעלה 6, מושב 13, גבול 8, פנים 7, שמחה 6.',
    'כבוד נכנס: מעלה 9, מושב 10, גבול 6, פנים 3, שמחה 12.',
    'חיבור מופיע במקור: מעלה 11, מושב 15, גבול 15, פנים 6, שמחה 15, מזג 3.',
    'כבוד יוצא: מעלה 12, מושב 11, גבול 5, פנים 12, מזג 6.',
    'דרך מופיעה במקור: מעלה 13, מושב 13, גבול 16, פנים 15, שמחה 13, בורג׳ 7, מזג 5.',
    'ממון יוצא: מעלה 14, מושב 3, גבול 12, פנים 5, שמחה 10, מזג 3; צערה נאמר ״כנגדו״.',
    'המחבר מייחס את המושב למעגל המושבות, את המעלה למעגל نصير الدين, את הגבול למעגל המספר ואת הפנים למעגל أبجد; לגבי שמחה/צער/מזג הוא אומר שאינו יודע מאילו מעגלים נלקחו.'
  ],{
    keywords:['מעלה','מושב','גבול','פנים','שמחה','צער','מזג','עמ 97','עמ 98','עמ 99'],
    dignityRows,
    omittedFromPrintedTable:[{pattern:'2121',name:'ממון נכנס',arabic:'قبض داخل'},{pattern:'1221',name:'סוהר',arabic:'العقلة'}],
    verificationStatus:'REVIEW_REQUIRED',
    sourceDiscrepancies:[
      'v57 הנוכחי מציג לסף יוצא פנים 8 ושמחה 7, אך הסריקה המודפסת בעמ׳ 98 קוראת בבירור: وجهها السابع؛ فرحها السادس.',
      'v57 הנוכחי מכניס סוהר וממון נכנס לטבלה, אף ששניהם אינם מופיעים בטבלת המקור המודפסת בעמ׳ 97–99.',
      'v57 הנוכחי משמיט את חיבור ואת דרך מן הרצף התפעולי של הטבלה, אף ששניהם מופיעים במפורש בעמ׳ 98–99.',
      'v57 הנוכחי נותן לכבוד יוצא פנים 2 ללא מזג; הסריקה אומרת وجهها الثاني عشر؛ مزاجها السادس.',
      'v57 הנוכחי נותן לממון יוצא פנים 3; הסריקה אומרת وجهها الخامس.',
      'v57 הנוכחי אינו משמר את שמחת כבוד נכנס בבית 12.'
    ],
    doNotInfer:['אין להשלים ערכי ממון נכנס או סוהר מתוך סימטריה, מסורת חיצונית או קוד קיים.','אין להמיר את ״כנגדו״ של צער ממון יוצא לבית מספרי בלי כלל מקור נפרד.'],
    sourceExtra:{visualLineByLineChecked:true,sourceTableRowCount:14}
  }));

const planetJoy=[
  {entity:'צורות שבתאי',raw:'فرح أشكال زحل في فرح أشكال المشتري، في الحادي عشر',house:11,relation:'בשמחת צורות צדק'},
  {entity:'צורות מאדים',raw:'فرح أشكال المريخ في السادس عشر',house:16},
  {entity:'צורות השמש',raw:'فرح أشكال الشمس في التاسع',house:9},
  {entity:'צורות נוגה',raw:'فرح أشكال الزهرة بالخامس',house:5},
  {entity:'צורות כוכב חמה',raw:'فرح أشكال عطارد بالأول',house:1},
  {entity:'צורות הירח',raw:'فرح أشكال القمر بالثالث',house:3},
  {entity:'ראש התלי',raw:'فرح شكل الرأس تابع المشتري',follows:'צדק'},
  {entity:'זנב התלי',raw:'فرح شكل الذنب تابع زحل',follows:'שבתאי'}
];
data.records.push(rec('figures.p100.joy-grief-supplement','supplementary-source-rule',[100],
  'פרק נוסף בשמחת הצורות ובצערן בכלל',[
    'המקור מוסיף מערכת שמחה לפי כוכבים: שבתאי→11 דרך צדק, מאדים→16, שמש→9, נוגה→5, כוכב חמה→1, ירח→3; ראש התלי נמשך אחר צדק וזנב התלי אחר שבתאי.',
    'לאחר מכן מופיעה קבוצת שפל ראש, סוהר, אדום, נקי הלחי, נלחם וכבוד נכנס, בנוסח המודפס: ترح الأشكال ... فرحها بالحادي عشر.',
    'קהלה וחיבור: צערן בשביעי וברביעי־עשר; לבן ודרך: צערן בראשון.',
    'ממון יוצא וסף יוצא נאמר עליהם בהסתייגות: لعله ملحوقات بزحل والمريخ — אולי הם נספחים לשבתאי ולמאדים.'
  ],{
    keywords:['שמחת הצורות','צער הצורות','שבתאי','צדק','מאדים','שמש','נוגה','כוכב חמה','ירח'],planetJoy,
    verificationStatus:'REVIEW_REQUIRED',
    sourceDiscrepancies:[
      'v57 משמיט את שורת נוגה: فرح أشكال الزهرة بالخامس — שמחת צורות נוגה בבית 5.',
      'v57 משמר בסוף רק את סף יוצא כנספח אפשרי לשבתאי/מאדים, אך המקור המודפס מונה גם ממון יוצא וגם סף יוצא.'
    ],
    doNotInfer:['הביטוי ترح الأشكال ... فرحها بالحادي عشر נשמר ככתבו; אין להחליף את המילה فرحها ב״צערן״ כדי ליישר את המשפט.','אין להשתמש בפרק המשלים כדי לדרוס אוטומטית את טבלת עמ׳ 97–99.'],
    sourceExtra:{visualLineByLineChecked:true}
  }));

const monthAssociations=[
  {month:'רמדאן',arabic:'رمضان',figures:['1222']},
  {month:'ג׳ומאדא הראשונה',arabic:'جمادى الأولى',figures:['2121','1112']},
  {month:'ג׳ומאדא האחרונה',arabic:'جمادى الآخرة',figures:['1212']},
  {month:'שוואל',arabic:'شوال',figures:['2222','2212']},
  {month:'רביע הראשון',arabic:'ربيع الأول',figures:['1121']},
  {month:'רביע האחרון',arabic:'ربيع الآخر',figures:['1121','2111']},
  {month:'שעבאן',arabic:'شعبان',figures:['1221','2221']},
  {month:'רג׳ב',arabic:'رجب',figures:['2122']},
  {month:'מוחרם',arabic:'محرم',figures:['2212']},
  {month:'צפר',arabic:'صفر',figures:['1122']},
  {month:'ד׳ו אל־קעדה',arabic:'ذو القعدة',figures:['2211']},
  {month:'ד׳ו אל־חג׳ה',arabic:'ذي الحجة',figures:['2112','1111']}
];
data.records.push(rec('figures.p100-101.month-associations','source-association-table',[100,101],
  'שיוך הצורות לחודשי הלוח המוסלמי',[
    'המקור מאפשר יותר מצורה אחת לאותו חודש ויותר מחודש אחד לאותה צורה; אין להפוך את המפה ליחס אחד־לאחד.',
    'שוואל משויך גם לקהלה וגם ללבן; ג׳ומאדא הראשונה גם לממון נכנס וגם לסף יוצא; רביע האחרון גם לנלחם וגם לסף נכנס.',
    'ד׳ו אל־חג׳ה משויך לחיבור ולדרך.'
  ],{
    keywords:['חודשים','רמדאן','שוואל','מוחרם','רביע','ג׳ומאדא','שעבאן','רג׳ב','צפר','ד׳ו אל־קעדה','ד׳ו אל־חג׳ה'],monthAssociations,
    verificationStatus:'REVIEW_REQUIRED',
    sourceDiscrepancies:[
      'v57 הנוכחי משמיט את שיוך לבן למוחרם ואת העובדה שלבן משויך גם לשוואל.',
      'v57 הנוכחי משמיט את שיוך סף נכנס לרביע האחרון.'
    ],
    doNotInfer:['אין להכריח חודש יחיד לכל צורה או צורה יחידה לכל חודש.'],sourceExtra:{visualLineByLineChecked:true}
  }));

const partnerMap=[{derivedFigure:13,partnerHouse:1},{derivedFigure:14,partnerHouse:7},{derivedFigure:15,partnerHouse:10},{derivedFigure:16,partnerHouse:4}];
const witnessMap=[{witnessFigure:9,houses:[1,5,7]},{witnessFigure:14,houses:[2,6,10]},{witnessFigure:5,houses:[3,7,11]},{witnessFigure:16,houses:[4,8,12]}];
data.records.push(rec('houses.p101-102.partners-witnesses','operational-foundation-rule',[101,102],
  'שותפים ועדים בין הצורות והבתים',[
    'שותפים: הצורה 13 שותפת הבית 1; הצורה 14 שותפת הבית 7; הצורה 15 שותפת הבית 10; הצורה 16 שותפת הבית 4.',
    'עדים לפי המקור המודפס: הצורה 9 מעידה על 1,5,7; הצורה 14 על 2,6,10; הצורה 5 על 3,7,11; הצורה 16 על 4,8,12.',
    'המקור מדגיש שאין לוותר על העדים, בין בטוב ובין ברע.',
    'תולדה משתי צורות שונות היא עד להן ועליהן; הדין נוטה לצד שאליו היא נוטה — מיטיב, מזיק או ממוזג.',
    'העדים מתוארים כסיועי גורל החול, וגם למבטים כניסה גדולה בדין.'
  ],{
    keywords:['שותף','עדים','עדות','13','14','15','16','צורה תשיעית','צורה חמישית'],partnerMap,witnessMap,
    verificationStatus:'REVIEW_REQUIRED',
    sourceDiscrepancies:[
      'v57 הנוכחי קורא את העד השלישי כ״הצורה החמישה־עשר״ ואף מוסיף את הבית 6; בסריקה המודפסת כתוב בבירור الشكل الخامس يشهد على الثالث، والسابع، والحادي عشر — הצורה החמישית מעידה על 3,7,11.',
      'לכן אין להשתמש במיפוי H15→H3/H6/H7/H11 כמיפוי מקור של עמוד 101.'
    ],
    doNotInfer:['אין להחליף את הצורה החמישית בחמישה־עשר מטעמי סימטריה עם 9/14/16.','אין להוסיף בית 6 לרשימת העדות של הצורה 5.'],
    sourceExtra:{visualLineByLineChecked:true,criticalNumeralsDoubleChecked:true}
  }));

const aliasRows=[
  {ordinal:1,pattern:'1222',name:'נשוא ראש',arabic:'الأحيان',aliasesRaw:['الضاحك','الرجل الكبير الهمة']},
  {ordinal:2,pattern:'2121',name:'ממון נכנס',arabic:'قبض داخل',aliasesRaw:['أكموس']},
  {ordinal:3,pattern:'1212',name:'ממון יוצא',arabic:'قبض خارج',aliasesRaw:['الملاع']},
  {ordinal:4,pattern:'2222',name:'קהלה',arabic:'الجماعة',aliasesRaw:['مسدود الكل','أزار','الجمع','السلامة']},
  {ordinal:5,pattern:'1121',name:'נלחם',arabic:'الجودله',aliasesRaw:['الكوسج','الفرج','الأشقر','البشارة']},
  {ordinal:6,pattern:'1221',name:'סוהר',arabic:'العقله',aliasesRaw:['الثقاف']},
  {ordinal:7,pattern:'2221',name:'שפל ראש',arabic:'الأنكيس',aliasesRaw:['النكس','الرجل الدني الأصل']},
  {ordinal:8,pattern:'2122',name:'אדום',arabic:'الحمرة',aliasesRaw:['الدم','مطروش']},
  {ordinal:9,pattern:'2212',name:'לבן',arabic:'البياض',aliasesRaw:['النى']},
  {ordinal:10,pattern:'1122',name:'כבוד יוצא',arabic:'نصرة خارجة',aliasesRaw:['أجليد']},
  {ordinal:11,pattern:'2211',name:'כבוד נכנס',arabic:'نصرة داخلة',aliasesRaw:['تشمير','أبو العاقبة']},
  {ordinal:12,pattern:'1112',name:'סף יוצא',arabic:'عتبة خارجة',aliasesRaw:['ركرزة','راية الفرح']},
  {ordinal:13,pattern:'1111',name:'דרך',arabic:'الطريق',aliasesRaw:['زكيرره داخلة','نار سلت']},
  {ordinal:14,pattern:'2111',name:'סף נכנס',arabic:'عتبة دخله',aliasesRaw:['المرتد','والى']},
  {ordinal:15,pattern:'2112',name:'חיבור',arabic:'الإجتماع',aliasesRaw:['أوزاع']},
  {ordinal:16,pattern:'1211',name:'נקי הלחי',arabic:'نقي الخد',aliasesRaw:[],aliasSourceBlank:true}
];
data.records.push(rec('figures.p102-103.alternative-names','glossary-source-table',[102,103],
  'שמות חלופיים לשש־עשרה הצורות',[
    'המקור מונה את שש־עשרה הצורות לפי סדרן ומוסר להן שמות חלופיים הנהוגים בין חכמי האומנות.',
    'לצורה השש־עשרה, נקי הלחי, המקור משאיר את שדה השם החלופי ריק; אין להשלים שם מהראש.',
    'האינדקס שומר את צורות הכתיב הערביות הגרפיות כפי שנקראו מן הסריקה, בלי לנרמל אותן למסורת חיצונית.'
  ],{
    keywords:['שמות הצורות','שמות חלופיים','כינויים','الأحيان','الجماعة','الجودله','الأنكيس'],aliasRows,
    doNotInfer:['אין להשלים את הכינוי החסר של נקי הלחי.','אין להחליף כתיב ערבי לא ברור בכתיב חיצוני בלי מקור נוסף בתוך הספר.'],
    sourceExtra:{visualLineByLineChecked:true,rawOrthographyPreserved:true}
  }));

const addQueue=(arr,item)=>{if(!arr.some(x=>x.id===item.id)) arr.push(item)};
data.v57CorrectionQueue ||= [];
addQueue(data.v57CorrectionQueue,{id:'B04-P97-99-DIGNITIES',entryId:'figures.p97-99.dignities-source-table',page:98,status:'OPEN',summary:'Rebuild the p97-99 dignity table from the printed scan: Ataba Kharija face=7 joy=6; include Ijtima and Tariq; remove unsupported Aqla/Qabd-Dakhil rows; fix Nusra Kharija face=12 mezeg=6, Qabd Kharij face=5, Nusra Dakhila joy=12.'});
addQueue(data.v57CorrectionQueue,{id:'B04-P100-VENUS-JOY',entryId:'figures.p100.joy-grief-supplement',page:100,status:'OPEN',summary:'Restore Venus joy at house 5 and preserve both Qabd Kharij + Ataba Kharija in the tentative Saturn/Mars attachment clause.'});
addQueue(data.v57CorrectionQueue,{id:'B04-P100-101-MONTHS',entryId:'figures.p100-101.month-associations',page:101,status:'OPEN',summary:'Restore Bayad association with Muharram (in addition to Shawwal) and Ataba Dakhila association with Rabi al-Akhir.'});
addQueue(data.v57CorrectionQueue,{id:'B04-P101-WITNESS-5',entryId:'houses.p101-102.partners-witnesses',page:101,status:'OPEN',summary:'Critical numeral correction: printed source says figure 5 witnesses houses 3,7,11; v57 currently says figure 15 and adds house 6.'});

data.downstreamCorrectionQueue ||= [];
addQueue(data.downstreamCorrectionQueue,{id:'B04-DATA-DIGNITIES-SOURCE-DRIFT',sourceEntryId:'figures.p97-99.dignities-source-table',status:'DEFER_UNTIL_INDEX_COMPLETE',target:'goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js',summary:'Current FIGURE_DIGNITIES is v56-derived and disagrees with the printed p97-99 table in multiple critical rows; do not consume it as canonical before source repair.'});
addQueue(data.downstreamCorrectionQueue,{id:'B04-DATA-JOY-VENUS',sourceEntryId:'figures.p100.joy-grief-supplement',status:'DEFER_UNTIL_INDEX_COMPLETE',target:'goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js',summary:'Supplementary joy map must include Venus at H5 and preserve the two-figure tentative Saturn/Mars clause.'});
addQueue(data.downstreamCorrectionQueue,{id:'B04-DATA-MONTH-MAP',sourceEntryId:'figures.p100-101.month-associations',status:'DEFER_UNTIL_INDEX_COMPLETE',target:'goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js',summary:'Month mapping requires source-first recheck; printed source contains duplicate month associations, including Bayad in Shawwal+Muharram and Ataba Dakhila in Rabi al-Akhir.'});
addQueue(data.downstreamCorrectionQueue,{id:'B04-DATA-WITNESS-NUMERAL',sourceEntryId:'houses.p101-102.partners-witnesses',status:'DEFER_UNTIL_INDEX_COMPLETE',target:'all witness/partner helpers and future engines',summary:'Critical: printed p101 says figure 5 witnesses H3/H7/H11, not figure 15 and not H6. Any downstream witness map must remain blocked until corrected.'});

data.indexPolicyNotes ||= [];
addQueue(data.indexPolicyNotes,{id:'B04-NUMERAL-GATE',note:'For house/figure numerals, certification requires visual numeral re-read from the printed scan; no symmetry-based correction is allowed.'});

data.schemaVersion='1.5.0';
data.coverage.bookEndPage=103;
data.coverage.scanPdfEndPage=105;
data.coverage.status='BATCH04_P97_103_INDEXED_WITH_REVIEW_BLOCKERS';
data.coverage.completedBatches ||= [];
if(!data.coverage.completedBatches.includes('BATCH04_P97_103')) data.coverage.completedBatches.push('BATCH04_P97_103');

const newJson=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${newJson}\n</script>`);
text=text.replace('<b>מצב Batch 01:</b>','<b>מצב האינדקס:</b>');
fs.writeFileSync(path,text,'utf8');

const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch04 p97-103 applied',counts,'records',data.records.length,'v57Queue',data.v57CorrectionQueue.length,'downstreamQueue',data.downstreamCorrectionQueue.length);
