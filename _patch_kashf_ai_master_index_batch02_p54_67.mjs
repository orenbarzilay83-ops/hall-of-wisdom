#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);
if(data.schemaVersion!=='1.2.1') throw new Error(`expected schema 1.2.1, got ${data.schemaVersion}`);
if(data.records.length!==23) throw new Error(`expected 23 existing Batch01 records, got ${data.records.length}`);

const F=(pattern,name,arabic)=>({pattern,name,arabic});
const refs=(pages)=>pages.map(p=>`kashf-v57-draft.html#p${p}`);
const source=(bookPages,note,extra={})=>({printedBookPages:bookPages,scanPdfPages:bookPages.map(p=>p+2),v57Checked:true,printedScanChecked:true,note,...extra});
const rec=(entryId,entryType,bookPages,topic,criticalFacts,extra={})=>({
  entryId,entryType,bookPages,scanPdfPages:bookPages.map(p=>p+2),v57Anchors:refs(bookPages),topic,
  keywords:extra.keywords||[],criticalFacts,outputScope:extra.outputScope||'חומר יסוד לאחזור AI; אינו פסק עצמאי אלא אם המקור מנסח הליך מפורש.',
  doNotInfer:extra.doNotInfer||[],sourceDiscrepancies:extra.sourceDiscrepancies||[],verificationStatus:extra.verificationStatus||'VERIFIED',
  sourceVerification:source(bookPages,extra.sourceNote||'v57 was checked against the printed Arabic scan; only source-supported facts are indexed.',extra.sourceExtra||{}),
  ...Object.fromEntries(Object.entries(extra).filter(([k])=>!['keywords','outputScope','doNotInfer','sourceDiscrepancies','verificationStatus','sourceNote','sourceExtra'].includes(k)))
});

const added=[];
added.push(rec('figures.p54.framework','definition-framework',[54],
  'השער השני — מסגרת תכונות שש־עשרה הצורות',[
    'המקור פותח מערכת תכונות רב־ממדית: מיטיב/מזיק/נוטה/ממוזג; אמהות/בנות/נולדות/מאזנים; עולה/שוקע/מתרומם/יורד; אש/אוויר/מים/עפר; מבט/דיבור/חיבור/פירוד; זכר/נקבה/אנדרוגינוס; ריק/מלא; פנימי/חיצוני/מתהפך/קבוע; מדבר/שותק; מבקש/מבוקש; קל/כבד; לילי/יומי; ויחסי שליש/ריבוע/שישית.',
    'אין לצמצם את תכונות הצורה לשדה בינארי יחיד.'
  ],{keywords:['16 צורות','תכונות הצורות','מיטיב','מזיק','מבקש','מבוקש'],doNotInfer:['אין להפיק מכאן ערכי צורה פרטניים לפני רשומות הסיווג הספציפיות.']}));

const benefic=[F('2211','כבוד נכנס','نصرة داخلة'),F('2121','ממון נכנס','قبض داخل'),F('2111','סף נכנס','عتبة داخلة'),F('1122','כבוד יוצא','نصرة خارجة'),F('1222','נשוא ראש','الأحيان')];
const malefic=[F('1212','ממון יוצא','قبض خارج'),F('1112','סף יוצא','عتبة خارجة'),F('1221','סוהר','العقلة'),F('2122','אדום','الحمرة'),F('2221','שפל ראש','الأنكيس')];
const leanBenefic=[F('1121','נלחם','جودلة'),F('1211','נקי הלחי','نقي الخد'),F('2212','לבן','البياض')];
const mixedLeanMalefic=[F('2222','קהלה','الجماعة'),F('2112','חיבור','الاجتماع'),F('1111','דרך','الطريق')];
added.push(rec('figures.p55-57.fortune-system','classification-system',[55,56,57],
  'מערכת המיטיב, המזיק, הנוטה והממוזג',[
    'המקור מונה חמש צורות מיטיבות, חמש מזיקות, שלוש נוטות למיטיב ושלוש ממוזגות הנוטות למזיק.',
    'הדין אינו סטטי בלבד: שכנות, הולדה משני הורים ועדויות עשויות לחזק או לשנות את הנטייה.',
    'המקור מזכיר גם נוסח חלוקה משולשת חלופי; אין למחוק את מערכת ארבע הקטגוריות בגללו.'
  ],{keywords:['סעד','נחס','מיטיב','מזיק','ממוזג','נוטה'],fortuneGroups:{benefic,malefic,leanBenefic,mixedLeanMalefic},doNotInfer:['אין לקרוס ממוזג למיטיב/מזיק גלובלי.','אין להחיל שינוי הקשר בלי העדים/ההולדה שהמקור דורש.']}));

const movementGroups={
  internal:[F('2211','כבוד נכנס','نصرة داخلة'),F('2111','סף נכנס','عتبة داخلة'),F('2121','ממון נכנס','قبض داخل'),F('2221','שפל ראש','الأنكيس')],
  external:[F('1122','כבוד יוצא','نصرة خارجة'),F('1212','ממון יוצא','قبض خارج'),F('1222','נשוא ראש','الأحيان'),F('1112','סף יוצא','عتبة خارجة')],
  mutable:[F('1121','נלחם','جودلة'),F('1211','נקי הלחי','نقي الخد'),F('1221','סוהר','العقلة'),F('1111','דרך','الطريق')],
  fixed:[F('2222','קהלה','الجماعة'),F('2112','חיבור','الاجتماع'),F('2122','אדום','الحمرة'),F('2212','לבן','البياض')]
};
added.push(rec('figures.p57-59.movement','classification-system',[57,58,59],
  'פנימי, חיצוני, מתהפך וקבוע',[
    'פנימי: אש סתומה ועפר פתוח; חיצוני: אש פתוחה ועפר סתום; מתהפך: אש ועפר פתוחים; קבוע: אש ועפר סתומים.',
    'המקור מוסיף הבדלה בתוך המתהפכות והקבועות בין קביעות/התהפכות בדין ובמקום.',
    'לפנימיות ולחיצוניות מצורפות תכונות של מלא/ריק, לילה/יום, שותק/מדבר ומבוקש/מבקש.'
  ],{keywords:['פנימי','חיצוני','מתהפך','קבוע'],movementGroups,doNotInfer:['אין להסיק תנועת מקום ותנועת דין כאותו שדה; המקור מבחין ביניהן.']}));

const genderGroups={
  female:[F('2121','ממון נכנס','قبض داخل'),F('2111','סף נכנס','عتبة داخلة'),F('2211','כבוד נכנס','نصرة داخلة'),F('2212','לבן','البياض'),F('1211','נקי הלחי','نقي الخد'),F('2221','שפל ראש','الأنكيس')],
  male:[F('1122','כבוד יוצא','نصرة خارجة'),F('1212','ממון יוצא','قبض خارج'),F('1112','סף יוצא','عتبة خارجة'),F('1222','נשוא ראש','الأحيان'),F('1121','נלחם','جودلة'),F('2122','אדום','الحمرة')],
  androgynous:[F('2112','חיבור','الاجتماع'),F('2222','קהלה','الجماعة'),F('1221','סוהר','العقلة'),F('1111','דרך','الطريق')]
};
added.push(rec('figures.p59-60.gender-daynight','classification-system',[59,60],
  'זכר, נקבה, אנדרוגינוס; יום, לילה, דיבור ושתיקה',[
    'שש צורות נקביות הן ליליות ושותקות; שש זכריות הן יומיות ומדברות.',
    'ארבע הצורות הנותרות אינן מורות זכר או נקבה אלא אנדרוגינוס/خناثا.',
    'לבן הוא חריג נקבי קבוע ומבוקש; נקי הלחי נקבית מתהפכת ומבקשת; אדום זכרי קבוע ומבוקש; נלחם זכרי מתהפך ומבקש.',
    'המקור מביא גם דעה חלופית: צורות אש ואוויר זכריות ומים נקביות; אין להשלים את העפר אם אינו נמסר באותו משפט.'
  ],{keywords:['זכר','נקבה','אנדרוגינוס','יומי','לילי','מדבר','שותק'],genderGroups,doNotInfer:['אין להכריח את ארבע האנדרוגיניות לזכר או נקבה.']}));

const celestialGroups={
  rising:[F('2121','ממון נכנס','قبض داخل'),F('2111','סף נכנס','عتبة داخلة'),F('1211','נקי הלחי','نقي الخد'),F('1222','נשוא ראש','الأحيان')],
  setting:[F('1121','נלחם','جودلة'),F('2221','שפל ראש','الأنكيس'),F('2211','כבוד נכנס','نصرة داخلة'),F('2122','אדום','الحمرة')],
  ascending:[F('1122','כבוד יוצא','نصرة خارجة'),F('2212','לבן','البياض'),F('1212','ממון יוצא','قبض خارج'),F('1112','סף יוצא','عتبة خارجة')],
  descending:[F('1111','דרך','الطريق'),F('1221','סוהר','العقلة'),F('2112','חיבור','الاجتماع'),F('2222','קהלה','الجماعة')]
};
added.push(rec('figures.p60-61.celestial-motion','classification-system',[60,61],
  'עולות, שוקעות, מתרוממות ויורדות בגלגל',[
    'ארבע קבוצות של ארבע צורות מחלקות את כל 16 הצורות.',
    'בלוח: האמהות מקבילות לעולות/מזרח; הבנות לשוקעות/מערב; הנולדות למתרוממות/דרום; המאזנים ליורדות/צפון.',
    'כאשר צורה מקבוצת הגלגל המתאימה מופיעה בקבוצת הלוח המקבילה — המקור אומר שהדין חזק.'
  ],{keywords:['עולות','שוקעות','מתרוממות','יורדות','אמהות','בנות','נולדות','מאזנים'],celestialGroups}));

const elementGroups={
  fireEast:[F('1222','נשוא ראש','الأحيان'),F('1212','ממון יוצא','قبض خارج'),F('1122','כבוד יוצא','نصرة خارجة'),F('1112','סף יוצא','عتبة خارجة')],
  airWest:[F('2122','אדום','الحمرة'),F('2111','סף נכנס','عتبة داخلة'),F('1121','נלחם','جودلة'),F('2112','חיבור','الاجتماع')],
  waterNorth:[F('1111','דרך','الطريق'),F('2212','לבן','البياض'),F('1211','נקי הלחי','نقي الخد'),F('2211','כבוד נכנס','نصرة داخلة')],
  earthSouth:[F('2222','קהלה','الجماعة'),F('2221','שפל ראש','الأنكيس'),F('1221','סוהר','العقلة'),F('2121','ממון נכנס','قبض داخل')]
};
added.push(rec('figures.p61-62.elements-directions','classification-system',[61,62],
  'ארבעת היסודות וארבע הרוחות',[
    'אש = מזרח, אוויר = מערב, מים = צפון, עפר = דרום/קיבלה; ארבע צורות בכל קבוצה.',
    'המקור מקשר: אמהות–מזרח, בנות–מערב, בנות האמהות–צפון, בנות הבנות–דרום.',
    'הבית ה־13 מסומן כשואל (السائل) וה־14 כנשאל/מי ששואלים עליו.'
  ],{keywords:['אש','אוויר','מים','עפר','מזרח','מערב','צפון','דרום'],elementGroups}));

added.push(rec('figures.p63.laugh-cry-weight','definition-set',[63],
  'צוחקות, בוכות, קלות וכבדות',[
    'צוחקת: שורת האש פתוחה ושורת העפר סתומה.',
    'בוכה: שורת האש סתומה ושורת העפר פתוחה.',
    'קלות הן הצורות היחידיות; כבדות הן הצורות הזוגיות.'
  ],{keywords:['צוחקות','בוכות','קלות','כבדות'],doNotInfer:['אין להפוך קל/כבד להערכת טוב/רע; המקור מציגם כתכונה נפרדת.']}));

const pure=['1222','2121','2211','1122','2111','1121','1211','2122','2212','1111','2222','2112'];
const impureHuman=['1221','2221'];
const impureJinn=['1112','1212'];
const impureBoth=['2122'];
added.push(rec('figures.p63.purity','classification-system',[63],
  'הצורות הטהורות והטמאות',[
    'הטבלה הגרפית בעמ׳ 63 מונה 12 צורות טהורות.',
    'סוהר ושפל ראש מיוחסות לטומאת בני אדם; סף יוצא וממון יוצא לטומאת הג׳ין; אדום לטומאת הג׳ין ובני האדם.',
    'אדום מופיעה במקור גם ברשימת הטהורות וגם ברשימת הטמאות — חפיפה מקורית שיש לשמר, לא לתקן בשקט.'
  ],{keywords:['טהור','טמא','ג׳ין','בני אדם'],purityGroups:{pure,impureHuman,impureJinn,impureBoth},doNotInfer:['אין לכפות partition בלעדי בין טהור לטמא: אדום חופפת בשתי הרשימות במקור.'],sourceNote:'The printed graphical lists were checked visually against v57. The source itself places Humra (2122) in both the pure list and the impure-both line; the index preserves this overlap.'}));

const seekerRows=[
  {row:1,pattern:'1222',name:'נשוא ראש',arabic:'طالب العلو غير ممكن ، موجود بالحس والعقل ، ناظر',hebrew:'מבקשת את העלייה; אינה אפשרית, אך מצויה בחוש ובשכל; צופה.'},
  {row:2,pattern:'1212',name:'ממון יוצא',arabic:'طالب غير القصد ، موجود ، غير مفاجيء ، ناظر ، متصل',hebrew:'מבקשת דבר שאינו המכוון; מצויה, אינה באה פתאום; צופה ומחוברת.'},
  {row:3,pattern:'1211',name:'נקי הלחי',arabic:'طالب الشر ضعيف ، والفتن موجودة ، حتى بالوهم ، ناظر ، ناطق',hebrew:'מבקשת הרע; חלשה; והפיתויים מצויים, אף בדמיון; צופה ומדברת.'},
  {row:4,pattern:'1221',name:'סוהר',arabic:'طالب مأخوذ ، موجود ، محصور ، ناظر ، باكي',hebrew:'מבקשת תפוסה; מצויה ומסוגרת; צופה ובוכה.'},
  {row:5,pattern:'1122',name:'כבוד יוצא',arabic:'طالب قوي ، بعيد الثبات ، موجود بالنظر ، والفضل ، ناطق',hebrew:'מבקשת חזקה; רחוקה מן הקביעות; מצויה בעיון ובמעלה; מדברת.'},
  {row:6,pattern:'1112',name:'סף יוצא',arabic:'طالب غير مدرك الموجود ، ذكر ، ناظر ، ناطق ، متحرك',hebrew:'מבקשת שאינה משיגה את המצוי; זכרית; צופה, מדברת ומתנועעת.'},
  {row:7,pattern:'1121',name:'נלחם',arabic:'طالب مفرط ، معتدي ، موجود ، منفعل ، ناظر ، متحرك',hebrew:'מבקשת מופרזת וחורגת מן המידה; מצויה, נפעלת, צופה ומתנועעת.'},
  {row:8,pattern:'1111',name:'דרך',arabic:'طالب موجود ، لايح رأي العين ، ناظر ، ناطق ، متحرك',hebrew:'מבקשת מצויה; אינה נראית בעין; צופה, מדברת ומתנועעת.'}
];
added.push(rec('figures.p64.seeker-table','source-table',[64],
  'טבלת שמונה הצורות המבקשות',[
    'שמונת סמלי הצורות פוענחו חזותית מן הסריקה ונבדקו מול סמלי v57.',
    'סדר השורות הוא 1222, 1212, 1211, 1221, 1122, 1112, 1121, 1111.',
    'בשורה 3 המקור המודפס קורא طالب الشر ضعيف; אין להחליפו ב־طالب النذر על סמך OCR.'
  ],{keywords:['מבקש','طالب','טבלת המבקשות'],seekerRows,sourceExtra:{visualTableChecked:true},sourceNote:'The p64 table was read row-by-row from the printed scan and cross-checked with v57 symbols. Critical row 3 was read directly as طالب الشر ضعيف, overriding conflicting OCR/project text.'}));

const soughtRows=[
  {row:1,pattern:'2221',name:'שפל ראש',arabic:'مطلوب ، معدوم ، سالم ، ناطق الاختبار ، باكي ، متحرك',hebrew:'מבוקשת; נעדרת; שלמה; מדברת בבחינה; בוכה ומתנועעת.'},
  {row:2,pattern:'2222',name:'קהלה',arabic:'مطلوب ، منتظر ، معدوم ، منحضر ، باكي ، صامت',hebrew:'מבוקשת; מצופה; נעדרת וממתינה; בוכה ושותקת.'},
  {row:3,pattern:'2211',name:'כבוד נכנס',arabic:'مطلوب ، متكاثر ، معدوم ، متراخي ، عدم كله',hebrew:'מבוקשת; מתרבה; נעדרת; מתרחקת; העדר כולה.'},
  {row:4,pattern:'2112',name:'חיבור',arabic:'مطلوب ، موجود ، ومطلوبه معدوم ، مقصود',hebrew:'מבוקשת; מצויה, אך המבוקש שלה נעדר; מכוונת.'},
  {row:5,pattern:'2121',name:'ממון נכנס',arabic:'مطلوب ، ملحوق بالشرف ، ناطق',hebrew:'מבוקשת; מחוברת אל הכבוד; מדברת.'},
  {row:6,pattern:'2111',name:'סף נכנס',arabic:'مطلوب ، بالرفق معدم ، أمن ، ناظر ، متحرك',hebrew:'מבוקשת; מבוקשת ברוך/בעדינות; נעדרת; בטוחה; צופה ומתנועעת.'},
  {row:7,pattern:'2212',name:'לבן',arabic:'مطلوب ، مخيل ، متراخي ، بطيء ، متصل بعد حين',hebrew:'מבוקשת; מדומה ומתאחרת; איטית; מתחברת לאחר זמן.'},
  {row:8,pattern:'2122',name:'אדום',arabic:'مطلوب جدا ، معدوم حد ، مقصر ، ناطق بذاته',hebrew:'מבוקשת מאוד; נעדרת עד הקצה; קצרה; מדברת מצד עצמה.'}
];
added.push(rec('figures.p65.sought-pattern-table','source-table',[65],
  'טבלת שמונה הצורות המבוקשות — מיפוי הסמלים',[
    'שמונת סמלי הצורות פוענחו חזותית מן הסריקה ונבדקו מול סמלי v57.',
    'סדר השורות הוא 2221, 2222, 2211, 2112, 2121, 2111, 2212, 2122.',
    'המיפוי החזותי נשמר בנפרד מדיוקי התרגום של תיאורי השורות.'
  ],{keywords:['מבוקש','مطلوب','טבלת המבוקשות'],soughtRows,sourceExtra:{visualTableChecked:true},sourceNote:'The p65 symbols were decoded directly from the printed table and match the symbol order present in v57. Wording nuances are tracked separately instead of contaminating the verified pattern map.'}));

added.push(rec('figures.p65.sought-hebrew-wording','translation-review',[65],
  'טבלת המבוקשות — דיוק תרגום תיאורי השורות',[
    'המיפוי בין שמונה הסמלים לשורות סגור; הבדיקה כאן עוסקת רק בדיוק העברי של כמה ביטויים.',
    'שורה 2 כוללת במקור את המילה منحضر; אין להעלים אותה בתוך "ממתינה" בלי הערת נוסח.',
    'שורה 6: بالرفق معدم דורש ניסוח עברי זהיר; שורה 8: معدوم حد، مقصر אינה זהה בהכרח ל"נעדרת עד הקצה; קצרה".'
  ],{keywords:['מבוקשות','תרגום','منحضر','بالرفق معدم','معدوم حد'],verificationStatus:'REVIEW_REQUIRED',sourceDiscrepancies:['v57 preserves the table and patterns, but rows 2, 6 and 8 contain Arabic wording whose current Hebrew rendering is narrower/unstable. Keep Arabic exact until the v57 wording is formally corrected.'],doNotInfer:['אין לשנות את מיפוי הסמלים בגלל פער תרגום בתיאור.'],sourceNote:'Printed p65 and v57 were compared. The symbol mapping is secure; this separate review record deliberately keeps translation nuances open.'}));

added.push(rec('figures.p65-66.house-gender-context','contextual-rule',[65,66],
  'זכר/נקבה לפי הבית, העדים ורוב נקודות היסודות',[
    'המקור אומר שצורה עשויה לקבל דין זכר או נקבה לפי הבית; בודקים עדים ויחסי בתים.',
    'נקודות האש והאוויר נחשבות זכריות; נקודות המים והעפר נקביות; רוב הנקודות מכריע בין זכר לנקבה.',
    'כאשר המספרים שווים, המקור קושר זאת להעדר فرج حقيقي; יש לשמר את הביטוי הערבי עד סגירת התרגום.',
    'מובאת גם דרך של הולדת צורה מצורת העניין והעד ובדיקת נקודותיה.'
  ],{keywords:['זכר','נקבה','נקודות','فرج حقيقي','עדים'],verificationStatus:'REVIEW_REQUIRED',sourceDiscrepancies:['v57 renders وله فرج حقيقي / no فرج حقيقي as "סימן מין ממשי". This may be interpretive/narrowing; preserve the Arabic phrase in the index until a source-faithful Hebrew wording is approved.'],doNotInfer:['אין לפרש فرج חقيقي באופן אנטומי או מיני מעבר למה שהמקור והתרגום המאושר יתמכו בו.'],sourceNote:'The operational rule is source-clear, but one critical Arabic expression is intentionally left translation-review rather than silently normalized.'}));

added.push(rec('figures.p67.house-fortune-context','contextual-rule',[67],
  'שינוי דין מיטיב/מזיק לפי הבית והעד',[
    'מיטיב בבית מזיק עם עד מזיק בבית מזיק — נעשה מזיק.',
    'מיטיב בבית מזיק עם עד מיטיב בבית מיטיב — נשאר מיטיב.',
    'מזיק בבית מיטיב עם עד מזיק בבית מזיק — נשאר מזיק.',
    'מיטיב בבית מיטיב עם עד מזיק בבית מזיק — נעשה ממוזג.'
  ],{keywords:['מיטיב','מזיק','עד','בית','ממוזג'],doNotInfer:['אין להמיר כלל זה למסווג גלובלי ללא הבית והעד.']}));

added.push(rec('figures.p67.huzuz-examples','worked-examples',[67],
  'דוגמאות חֻצוּץ/חלקי כוח של צורה בבית',[
    'המקור נותן דוגמאות נקודתיות לצורות בבתים ולמספר "חלקים"/יתרונות הנובעים משיבוצים שונים.',
    'נשוא ראש בראשון מובא כדוגמה לארבעה חלקים; כבוד יוצא וממון נכנס בראשון כדוגמאות לשני חלקים; וכן דוגמאות לנלחם, קהלה ולבן.',
    'אלה דוגמאות מקור, לא אלגוריתם כללי של ניקוד כל עוד כל טבלאות השיבוץ התומכות לא מופו.'
  ],{keywords:['חֻצוּץ','חלקים','דוגמאות','בית ראשון','בית רביעי'],doNotInfer:['אין להסיק מערכת scoring מלאה מן הדוגמאות בלבד.']}));

for(const r of added){
  if(data.records.some(x=>x.entryId===r.entryId)) throw new Error(`duplicate entryId ${r.entryId}`);
  data.records.push(r);
}

// Queue only translation corrections for v57; do not mix them with downstream code/data mismatches.
data.v57CorrectionQueue ||= [];
for(const item of [
  {id:'B02-P65-SOUGHT-WORDING',entryId:'figures.p65.sought-hebrew-wording',page:65,status:'OPEN',summary:'Review Hebrew wording of منحضر, بالرفق معدم, and معدوم حد، مقصر while preserving the verified p65 symbol mapping.'},
  {id:'B02-P66-FARAJ-HAQIQI',entryId:'figures.p65-66.house-gender-context',page:66,status:'OPEN',summary:'Preserve and source-review the phrase فرج حقيقي; current v57 "סימן מין ממשי" may be narrower than the printed wording.'}
]) if(!data.v57CorrectionQueue.some(x=>x.id===item.id)) data.v57CorrectionQueue.push(item);

data.downstreamCorrectionQueue ||= [];
for(const item of [
  {id:'B02-DATA-P63-PURITY-OVERLAP',sourceEntryId:'figures.p63.purity',status:'DEFER_UNTIL_INDEX_COMPLETE',target:'goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js',summary:'Current scalar purity field loses the printed-source overlap: Humra 2122 appears in both the pure list and the impure-both attribution.'},
  {id:'B02-DATA-P64-SEEKER-MAP',sourceEntryId:'figures.p64.seeker-table',status:'DEFER_UNTIL_INDEX_COMPLETE',target:'goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js',summary:'Printed/v57 p64 order is 1222,1212,1211,1221,1122,1112,1121,1111; existing data swaps at least row 3/7 and stores OCR "النذر" where scan reads "الشر".'},
  {id:'B02-DATA-P65-SOUGHT-MAP',sourceEntryId:'figures.p65.sought-pattern-table',status:'DEFER_UNTIL_INDEX_COMPLETE',target:'goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js',summary:'Printed/v57 p65 order is 2221,2222,2211,2112,2121,2111,2212,2122; existing source-data row assignments do not match this visual table.'}
]) if(!data.downstreamCorrectionQueue.some(x=>x.id===item.id)) data.downstreamCorrectionQueue.push(item);

data.schemaVersion='1.3.0';
data.coverage.bookEndPage=67;
data.coverage.scanPdfEndPage=69;
data.coverage.status='BATCH02_P54_67_INDEXED_WITH_REVIEW_BLOCKERS';
data.coverage.completedBatches=[...(data.coverage.completedBatches||[]).filter(x=>x!=='BATCH02_P54_67'),'BATCH02_P54_67'];

const json=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
fs.writeFileSync(path,text,'utf8');
const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch02 p54-67 applied',counts,'records',data.records.length,'v57Queue',data.v57CorrectionQueue.length,'downstreamQueue',data.downstreamCorrectionQueue.length);
