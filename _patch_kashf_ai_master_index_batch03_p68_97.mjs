#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);
if(data.schemaVersion!=='1.3.0') throw new Error(`expected schema 1.3.0, got ${data.schemaVersion}`);
if(data.records.length!==37) throw new Error(`expected 37 existing records, got ${data.records.length}`);

const pages=(a,b=a)=>Array.from({length:b-a+1},(_,i)=>a+i);
const scanPages=(ps)=>ps.map(p=>p+2);
const anchors=(ps)=>ps.map(p=>`kashf-v57-draft.html#p${p}`);
const profile=(ordinal,pattern,hebrewName,arabicName,start,end,attrs,indications=[],conflicts=[],notes=[])=>({
  entryId:`figures.p${start}-${end}.profile.${pattern}`,
  entryType:'figure-profile',
  ordinal,pattern,hebrewName,arabicName,
  bookPages:pages(start,end),scanPdfPages:scanPages(pages(start,end)),v57Anchors:anchors(pages(start,end)),
  topic:`פרופיל הצורה ${hebrewName}`,
  keywords:[hebrewName,arabicName,'פרופיל צורה','תיאור הצורה','טבע הצורה'],
  localProfileAttributes:attrs,
  generalIndications:indications,
  criticalFacts:[`זהו פרופיל מקומי של ${hebrewName} בפרק תיאור שש־עשרה הצורות, ואינו מחליף אוטומטית סיווגי יסוד שנמסרו קודם בספר.`,...notes],
  crossChapterConflicts:conflicts,
  excludedScope:['בתי השיר, מספרים, אותיות ושיוכי כוכב/יום שלא נבדקו בנפרד אינם מוסמכים מכוח רשומת הליבה הזאת.'],
  doNotInfer:['אין ליישב סתירה פנימית בין פרק זה לבין עמ׳ 55–63 על פי היגיון, קוד או מסורת חיצונית.','אין להפוך תיאור כללי של הצורה לפסק עצמאי לשאלת לקוח בלי כלל מקור מפורש.'],
  sourceDiscrepancies:[],verificationStatus:'VERIFIED',
  sourceVerification:{printedBookPages:pages(start,end),scanPdfPages:scanPages(pages(start,end)),v57Checked:true,printedScanChecked:true,scope:'core-profile-only',note:'Core profile attributes were re-read from v57 and/or the printed Arabic scan; verse/correspondence material is deliberately excluded from this certification.'}
});

const added=[];
added.push(profile(1,'1222','נשוא ראש','الأحيان',68,69,
 {direction:'מזרח',season:'אביב',humor:'דמי',temperature:'חם',moisture:'לח',temperament:'ממוזג',fortune:'מיטיב',movement:'חיצוני',celestialMotion:'מתרומם',weight:null,time:'יומי',gender:'זכר',bond:'קשור',state:'ער',element:'אש'},
 ['מלכים וראשי עם','ממון וקשרים','כבוד ופרנסה','נישואין וילדים','מסע ותנועה','מסגדים ונדרים']));

added.push(profile(2,'2121','ממון נכנס','القبض الداخل',69,70,
 {direction:'דרום',element:'עפר',season:'אביב',temperature:'חם',moisture:'לח',temperament:'ממוזג',humor:'צהובת־מרה',fortune:'מיטיב',movement:'פנימי',celestialMotion:'מתרומם',weight:'כבד',time:'לילי',gender:'נקבה',stability:'קבוע',bond:'קשור',state:'רוחני'},
 ['קבלת ממון וגביית חוב','שותפות','פרנסה','דברים הנכנסים ליד','מגונה לנסיעה'],[],['ברשימת בעלי החיים המקור כולל الحمر = חמורים; אין לקרוא זאת כ״אדומות״.']));

added.push(profile(3,'1212','ממון יוצא','القبض الخارج',71,71,
 {element:'אש',direction:'מזרח',season:'סתיו',temperature:'קר',moisture:'יבש',temperament:'לא ממוזג',humor:'צהובת־מרה',fortune:'מזיק',movement:'חיצוני',celestialMotion:'נופל',weight:'קל',time:'יומי',gender:'זכר',bond:'פתור',composition:'ממוזג מאוויר ועפר'},
 ['רשעים ומחלוקת','אלימות','מקומות רוח ואש','ריבויו מורה במקור על מצוקה','מיעוטו יכול להורות על שמחה וקיום']));

added.push(profile(4,'2222','קהלה','الجماعة',72,73,
 {element:'עפר',direction:'דרום',time:'לילי',timeDetail:'לפנות בוקר',movement:'לא פנימי ולא חיצוני לפי פרופיל זה',temperature:'קר',moisture:'יבש',gender:'נקבה',age:'בינוני',fortune:'ממוזג בכל המצבים'},
 ['קבוצות וצבאות','אסיפות','שמחה ועצב','נשים','גשמים ושיטפונות','זרעים ומסחר','קנייה ומכירה ובהמות'],
 ['בעמ׳ 57–59 קהלה מסווגת קבועה; בפרופיל המקומי כאן נאמר שאינה פנימית ואינה חיצונית.','בעמ׳ 59–60 קהלה נכללת בארבע האנדרוגיניות; בפרופיל המקומי כאן היא נקבית.']));

added.push(profile(5,'1121','נלחם','الجودلة',74,75,
 {elementPrimary:'אוויר',direction:'מזרח',time:'לילי',gender:'זכר',movement:'חיצוני',elementSecondaryPrinted:'מים',fortune:'נוטה למיטיב',stability:'מתהפך',speech:'מדבר'},
 ['תחבולה ובגידה','כלי ברזל ונשק','יציאה ותנועה','נישואין','שילוב שמחה ורע'],
 ['המקור המודפס בפרופיל זה אומר גם هوائي וגם مائي; האינדקס משמר את שתי המילים ואינו מתקן אחת מהן.']));

added.push(profile(6,'1221','סוהר','العقلة',76,77,
 {season:'סתיו',temperature:'קר',temperament:'לא ממוזג',humor:'שחורת־מרה',fortune:'מזיק',celestialMotion:'נופל',stability:'מתהפך',weight:'כבד',time:'לילי',gender:'נקבה',bond:'קשור',state:'מגושם',element:'עפר'},
 ['שפלות ומחלה','מאסר וכלא','מים ומערות','אוצרות ומחסנים','שקים ומטבע','בגדים ונכסים וערים','מיעוטו ביד טוב מריבויו']));

added.push(profile(7,'2221','שפל ראש','الأنكيس',77,78,
 {season:'סתיו',temperature:'קר',moisture:'יבש',element:'עפר',direction:'דרום',gender:'נקבה',fortune:'מזיק',celestialMotion:'נופל',weight:'כבד',time:'לילי',state:'מגושם',earthy:true},
 ['אנשים שפלים','שחור וחושך','ציד ועבדים','מרחצאות וחרקים','בארות עמוקות ומים רעים','חקלאות וקרקע','מיעוטו טוב מריבויו']));

added.push(profile(8,'2122','אדום','الحمرة',79,80,
 {gender:'זכר',time:'יומי',direction:'מערב',element:'אוויר',fortune:'מזיק',movement:'פנימי'},
 ['מקצועות אש','פזיזות ומידות רעות','מסע וזרות','קברים','דם והקזה','רופאים ומנתחים','זהב','כל דבר אדום','מיעוטו טוב מריבויו'],
 ['עמ׳ 63 משמר חפיפה פנימית במקור: אדום מופיע ברשימת הטהורות וגם מיוחס לטומאת הג׳ין ובני האדם; אין להפוך זאת לשדה בלעדי.']));

added.push(profile(9,'2212','לבן','البياض',81,82,
 {fortune:'ממוזג נוטה למיטיב',movement:'פנימי',gender:'נקבה',time:'יומי',direction:'צפון',element:'מים'},
 ['עצים ופירות','ימים וגשמים','טובות ורווח','שליחים וחדשות','הריון לבנות','אסיר ובשורה','כותנה ותכריכים','מוהר ופרנסה'],
 ['בעמ׳ 57–59 לבן מסווג קבוע; בפרופיל המקומי כאן הוא פנימי.','בעמ׳ 59–60 קבוצת הנקבות מתוארת כלילית; בפרופיל המקומי של לבן כתוב במפורש نهاري = יומי.']));

added.push(profile(10,'1122','כבוד יוצא','نصرة خارجة',82,85,
 {element:'אש',direction:'מזרח',movement:'חיצוני',fortune:'מיטיב',gender:'זכר',time:'יומי',temperament:'ממוזג',humor:'צהובת־מרה',celestialMotion:'יורד',weight:'קל',stability:'מתהפך',bond:'קשור'},
 ['מלכים ונכבדים','שררה ושלטון','אור וזוהר','מסחר רווחי','השגת מטרות','אבות ואחים','מגונה בנסיעה'],[],['המספר שבסיום השיר נקרא במקור עשר + עשר + מאה = 120; הוא מחוץ לליבת הפרופיל.']));

added.push(profile(11,'2211','כבוד נכנס','نصرة داخلة',85,86,
 {element:'מים',direction:'צפון',season:'חורף',temperature:'קר',moisture:'לח',temperament:'ממוזג',humor:'ליחתי',fortune:'מיטיב',movement:'פנימי',weight:'קל',stability:'קבוע',time:'לילי',gender:'נקבה',bond:'פתור',state:'מגושם'},
 ['יופי ושלמות','שרים ובעלי מעלה','ברית ונאמנות','נישואין','בהמות וכלי רכיבה','ממון הנכנס ליד','מקומות טובים ומסגדים','בטחון ונסיעה']));

added.push(profile(12,'1112','סף יוצא','عتبة خارجة',86,88,
 {element:'אוויר',direction:'מערב',time:'לילי',gender:'זכר',movement:'חיצוני',fortune:'מזיק',temperature:'קר',moisture:'יבש',temperament:'לא ממוזג',humor:'שחורת־מרה',celestialMotion:'נופל',weight:'קל',stability:'מתהפך',bond:'קשור',composition:'ממוזג ממים ועפר'},
 ['רע וקלקול','מיעוט פרנסה וריבוי תנועה','מסע ביבשה ובים','חולה','מסחר','שחרור מכבלים ומאסר','מלחמות ומהומות','מבנים גבוהים']));

added.push(profile(13,'1111','דרך','الطريق',88,89,
 {element:'מים',season:'חורף',temperature:'קר',moisture:'לח',temperament:'ממוזג',humor:'ליחתי',fortune:'ממוזג בין מיטיב למזיק',movement:'פנימי וחיצוני לפי פרופיל זה',weight:'קל',stability:'מתהפך',time:'לילי',gender:'נקבה',state:'מתقاعد',bond:'פתור',planetaryBanner:'הירח'},
 ['פרופיל קצר; המקור קושר אותה לירח וליום שני'],
 ['בעמ׳ 59–60 דרך נכללת בארבע האנדרוגיניות; בפרופיל המקומי כאן היא נקבית.']));

added.push(profile(14,'2111','סף נכנס','عتبة داخلة',89,91,
 {fortune:'מיטיב',movement:'פנימי',gender:'נקבה',time:'לילי',element:'אוויר',direction:'מערב',season:'אביב',temperature:'חם',moisture:'לח',temperament:'ממוזג',humor:'דמי'},
 ['נשים ושעשועים','משקאות ונוי','נדיבות','דיבור ומחלוקת','תאווה וטרדת לב','לוויות ובכי','ממון ופרנסה','צדיקים ודגלים','מים וארמונות'],[],['מן העופות המקור אומר القمري والبلبل; v57 הנוכחי משמר זאת כ״תור ובולבול״.']));

added.push(profile(15,'2112','חיבור','الاجتماع',91,93,
 {fortune:'ממוזג',movement:'פנימי',gender:'זכר',time:'לילי',element:'אוויר',direction:'מערב',season:'אביב',temperature:'חם',moisture:'לח',temperament:'ממוזג',contextuality:'הפרופיל אומר שהוא נוטה יחד למיטיב/מזיק, פנימי/חיצוני, מתרומם/נופל, קל/כבד, קבוע/מתהפך'},
 ['חדשות','מדעים שונים','אסטרונומיה והנדסה','גורל החול','כתיבה ונאום','מסחר ותחבולה','מטבע','אסיפות וספרים','אוצרות ורוחות'],
 ['בעמ׳ 55–63 חיבור מקבל סיווגי בסיס ממוקדים יותר; הפרופיל המקומי כאן מדגיש במפורש הקשריות וטווח של קטבים מנוגדים.']));

added.push(profile(16,'1211','נקי הלחי','نقي الخد',93,95,
 {fortune:'ממוזג נוטה למיטיב',movement:'פנימי',gender:'נקבה',time:'לילי',element:'מים',direction:'צפון'},
 ['נישואין','ריבוי דיבור','תאווה','כתיבה וצחות לשון','מחלוקת ועוינות','מיעוטו טוב מריבויו'],
 ['בעמ׳ 57–59 נקי הלחי מסווג מתהפך; בפרופיל המקומי כאן הוא פנימי.'],['בתי השיר הנמשכים עד ראש עמ׳ 95 אינם חלק מהסמכת ליבת הפרופיל.']));

const pairs=[
 {a:'1222',aName:'נשוא ראש',aRaw:'سعد، ذكر، خفيف، متحرك، ناري، خارج، معتدل، دموي، نهاري، شرقي، مربوط، فارغ',b:'2221',bName:'שפל ראש',bRaw:'نحس، أنثى، مظلم، ثقيل، جنوبي، ساقط، ليلي، مجسد، ملآن'},
 {a:'2212',aName:'לבן',aRaw:'ممتزج، مائل إلى السعد، خفيف، متحرك، مؤنث، داخل، نهاري، شمالي، مائي',b:'2122',bName:'אדום',bRaw:'نحس، ذكر، جامد، متحرك حركة ضعيفة، نهاري، غربي، هوائي، داخل، ثابت'},
 {a:'1121',aName:'נלחם',aRaw:'سعد، خفيف، منقلب، مجسد مع الذكور والإناث، هوائي، مذكر، خارج، ناطق، شرقي، ليلي؛ وقيل: مائل إلى السعد',b:'1211',bName:'נקי הלחי',bRaw:'قيل نحس؛ وقيل سعد، ممتزج، يميل إلى السعد، داخل، مؤنث، ليلي، مائي، شمالي؛ وقيل منقلب مع السعود والنحوس والذكور والإناث'},
 {a:'2111',aName:'סף נכנס',aRaw:'سعد، خفيف، متحرك، جامد، مجسد، داخل، مؤنث، ليلي، هوائي',b:'1112',bName:'סף יוצא',bRaw:'نحس، ثقيل، متحرك حركة ضعيفة، مذكر، هوائي، غربي، ليلي، خارج، مربوط'},
 {a:'1122',aName:'כבוד יוצא',aRaw:'سعد، مذكر، مجسد، ناري، قوي، ناطق، شرقي، خارج، خفيف، مربوط',b:'2211',bName:'כבוד נכנס',bRaw:'سعد، خفيف، أنثى، متحرك، داخل، مائي، ليلي، مؤنث، محلول، مجسد'},
 {a:'2121',aName:'ממון נכנס',aRaw:'سعيد، ثقيل، جامد، مؤنث، ترابي، داخل، ليلي، مربوط',b:'1212',bName:'ממון יוצא',bRaw:'نحس، خفيف، متحرك، قوي، ذكر، أسود، مظلم، ناري، شرقي، خارج، ساقط، محلول'},
 {a:'2112',aName:'חיבור',aRaw:'ممتزج، داخل، مذكر، ثابت، مائي، مائل إلى السعد والنحس، والداخل والخارج، والخفيف والثقيل',b:'1221',bName:'סוהר',bRaw:'نحس، ثقيل، أسود، مظلم، جامد، ساقط، منقلب، ليلي، مربوط، مجسد، ترابي'},
 {a:'2222',aName:'קהלה',aRaw:'ترابي، ممتزج، يميل إلى السعد والنحس، مذكر، أسود، مظلم',b:'1111',bName:'דרך',bRaw:'ممتزج في السعد والنحس، والداخل والخارج، خفيف، منقلب، ليلي، محلول، مؤنث، متحرك'}
];
added.push({
 entryId:'figures.p95-97.approximate-natures',entryType:'paired-figure-summary',bookPages:[95,96,97],scanPdfPages:[97,98,99],v57Anchors:anchors([95,96,97]),
 topic:'מן מקור אחר — טבעי הצורות בקירוב וזוגות הניגוד',keywords:['טבעי הצורות בקירוב','נגדו','זוגות צורות','16 צורות'],
 criticalFacts:['הקטע מציג שמונה זוגות של צורה וניגודה, וביחד מכסה את כל שש־עשרה הצורות.','הנוסח מכיל בכוונה תכונות שנראות סותרות, כגון جامد + متحرك; הן נשמרות ולא מנורמלות.','עמ׳ 97 מסיים את הקטע ואז פותח פרק חדש: במעלות/שְרַף הצורות, מושבן, מזגן ופניהן.'],
 oppositePairs:pairs,doNotInfer:['אין להמיר את רשימת ״נגדו״ לטבלת fortune/movement גלובלית.','אין למחוק מילים סותרות או להכפיל משמעות לפי קוד קיים.'],sourceDiscrepancies:[],verificationStatus:'VERIFIED',
 sourceVerification:{printedBookPages:[95,96,97],scanPdfPages:[97,98,99],v57Checked:true,printedScanChecked:true,visualLineByLineChecked:true,note:'The eight opposite pairs were read directly from the enlarged printed pages 95–97; the next chapter heading begins on p97, fixing the Batch03 boundary.'}
});

for(const r of added){if(data.records.some(x=>x.entryId===r.entryId)) throw new Error(`duplicate ${r.entryId}`)}
data.records.push(...added);
data.schemaVersion='1.4.0';
data.coverage.bookEndPage=97; data.coverage.scanPdfEndPage=99; data.coverage.status='BATCH03_P68_97_VERIFIED_CORE_PROFILES';
data.coverage.completedBatches=[...(data.coverage.completedBatches||[]),'BATCH03_P68_97'];
data.indexPolicyNotes=[...(data.indexPolicyNotes||[]),{id:'B03-PROFILE-SCOPE',note:'Individual-profile statements on pp68–95 are stored as localProfileAttributes. When they conflict with earlier classification tables, both are preserved; no silent global normalization.'}];
data.downstreamCorrectionQueue=data.downstreamCorrectionQueue||[];
for(const item of [
 {id:'B03-JAMAA-LOCAL-CONFLICT',sourcePages:[72,73],status:'DEFER_UNTIL_INDEX_COMPLETE',summary:'Jamaa local profile says female and neither internal nor external; do not overwrite earlier fixed/androgynous taxonomy without a scoped rule.'},
 {id:'B03-JOUDALA-DUAL-ELEMENT',sourcePages:[74,75],status:'DEFER_UNTIL_INDEX_COMPLETE',summary:'Joudala profile prints both هوائي and مائي; downstream single-element fields must not silently choose one.'},
 {id:'B03-BAYAD-LOCAL-CONFLICT',sourcePages:[81,82],status:'DEFER_UNTIL_INDEX_COMPLETE',summary:'Bayad local profile says internal and diurnal; differs from earlier fixed/nocturnal grouping.'},
 {id:'B03-TARIQ-LOCAL-CONFLICT',sourcePages:[88,89],status:'DEFER_UNTIL_INDEX_COMPLETE',summary:'Tariq local profile says female while earlier taxonomy groups it as androgynous.'},
 {id:'B03-IJTIMA-CONTEXTUAL',sourcePages:[91,92,93],status:'DEFER_UNTIL_INDEX_COMPLETE',summary:'Ijtima local profile explicitly spans opposing categories; downstream classifiers must retain source scope/context.'},
 {id:'B03-NAQI-LOCAL-CONFLICT',sourcePages:[93,94,95],status:'DEFER_UNTIL_INDEX_COMPLETE',summary:'Naqi al-Khadd local profile says internal while earlier movement taxonomy says mutable.'}
]) if(!data.downstreamCorrectionQueue.some(x=>x.id===item.id)) data.downstreamCorrectionQueue.push(item);

const json=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
fs.writeFileSync(path,text,'utf8');
const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch03 p68-97 applied',counts,'records',data.records.length,'downstreamQueue',data.downstreamCorrectionQueue.length);
