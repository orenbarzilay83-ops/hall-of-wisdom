#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text, 'utf8'); }
function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}

// 1) Promote the complete p180 inheritance construction into operational v57.
{
  const path = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
  let text = read(path);

  const oldBlock = [
    "    hebrewRule: 'קח את אש החמישי, אוויר השישי, מי השביעי ועפר השני, והוצא מהם צורה. התבונן בצורה: אם היא מחלקו של השואל — אמור לו: אתה יורש אותו. ואם היא מחלקו של הנשאל עליו — אמור: הוא יורש אותך, והאל יודע.',",
    '    supportingPages: [121, 122, 123, 124, 125, 126, 127, 128, 129],',
    '    arabicVerificationPages: [180],',
    "    notes: 'השיטה קובעת איזה צד יורש את האחר; היא אינה מחשבת חלקי ירושה או סכומים.',",
  ].join('\n');

  const newBlock = [
    "    hebrewRule: 'אם שאל השואל על אדם: האם הוא יורש אותי או אני יורש אותו? בנה צורה א׳ מארבע שורות היסוד האלה בדיוק: עפר הבית הראשון, מים הבית השני, אוויר הבית השלישי ואש הבית הרביעי. בנה צורה ב׳ מאש הבית החמישי, אוויר הבית השישי, מים הבית השביעי ועפר הבית השני — כן, הבית השני מופיע כאן שוב במקור. אחר כך הולד צורה ג׳ משתי הצורות א׳+ב׳. רק את צורה ג׳ בודקים: אם היא מחלקו של השואל — אמור לו: אתה יורש אותו; ואם היא מחלקו של הנשאל עליו — אמור: הוא יורש אותך. אין בשיטה זו חישוב חלקי ירושה או סכומים.',",
    '    supportingPages: [53, 57, 58, 59, 60, 64, 65, 172],',
    '    arabicVerificationPages: [180],',
    "    verificationNotes: 'עמ׳ 180 מאשר את כל השרשרת: א׳ = עפר H1 + מים H2 + אוויר H3 + אש H4; ב׳ = אש H5 + אוויר H6 + מים H7 + עפר H2; ג׳ = הולדת א׳+ב׳. עפר H2 בענף השני מודפס במפורש ואסור לתקנו ל-H8 מטעמי סימטריה. עמ׳ 53 מזהה H13 כסائل/H14 כمسؤول; עמ׳ 214 מזהה את H13/H14 כطالب/مطلوب; עמ׳ 57–60 ו-64–65 מחלקים צורות ל-طالب/مطلوب; ועמ׳ 172 מחלק את בתי השואל לאי-זוגיים ואת בתי המבוקש לזוגיים. עם זאת, עמ׳ 180 אינו אומר במפורש באיזו מן החלוקות האלה יש להשתמש כדי להכריע אם צורה ג׳ היא מجزء السائل או מجزء المسؤول, וטבלת 64–65 בקובץ התפעולי אינה משמרת את סמלי הצורות עצמם אלא placeholders. לכן שלב הסיווג הסופי עדיין חסום לביצוע.',",
    "    notes: 'שכבת v57 כוללת כעת את שרשרת החישוב המלאה ואינה חסרה עוד את צורה א׳ או את הולדת א׳+ב׳. השיטה עדיין אינה runnable: אין לבחור מן הדעת בין חלוקת طالب/مطلوب של הצורות, חלוקת H13/H14 או חלוקת בתי אי-זוגי/זוגי לצורך חלק השואל/הנשאל. נדרש מקור שמקבע את מיפוי צורה ג׳ לצד.',",
  ].join('\n');

  text = replaceOnce(text, oldBlock, newBlock, 'p180 complete v57 inheritance construction');
  write(path, text);
}

// 2) Canonical registry: distinguish source construction closure from unresolved final classifier.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let text = read(path);
  text = replaceOnce(
    text,
    "    notes: 'Body-source inheritance method determines which side inherits the other through the stated element-row composites. It does not calculate shares, amounts, or inheritance disputes.',",
    "    notes: 'The p180 construction itself is source-closed: Figure A = earth H1 + water H2 + air H3 + fire H4; Figure B = fire H5 + air H6 + water H7 + earth H2 exactly as printed; Figure C = A+B. Runtime remains blocked because the source then says to classify C as part of the asker or part of the asked person without explicitly naming the mechanical classifier. Other book sections connect asker/asked with H13/H14, طالب/مطلوب, and odd/even house partitions, but choosing among them would still be inference. Do not calculate shares, amounts, or disputes.',",
    'p180 canonical source-closure note',
  );
  write(path, text);
}

// 3) Audit: mark v57 construction as closed, preserve the final side-classification blocker.
{
  const path = 'HALL_WISDOM_KASHF_REMAINING_7_SOURCE_CLOSURE_AUDIT.md';
  let text = read(path);
  text = replaceOnce(
    text,
    '### ממצא חשוב 2 — v57 הנוכחי אינו משקף את כל שרשרת החישוב',
    '### ממצא חשוב 2 — שרשרת החישוב המלאה הועלתה ל-v57',
    'audit p180 heading',
  );
  text = replaceOnce(
    text,
    'ב-v57 knowledge הקיים מופיע בעיקר הצירוף השני (אש H5, אוויר H6, מים H7, עפר H2) והפסק. המקור דורש בפועל:',
    'הביקורת גילתה שב-v57 הישן הופיע בעיקר הצירוף השני והפסק. כעת הידע התפעולי תוקן ומשמר במפורש את כל השרשרת שהמקור דורש:',
    'audit p180 old v57 sentence',
  );
  text = replaceOnce(
    text,
    'לכן שכבת הידע העברית התפעולית אינה מלאה כרגע לשיטה זו, ואסור ל-executor להשלים אותה בשקט מן הערבית.',
    'לכן פער ה-v57 עצמו **נסגר**: אין עוד צורך שה-executor ישלים שלב חישוב מן הערבית. החסם היחיד שנותר הוא איך לסווג את צורה ג׳ כ"חלק השואל" או "חלק הנשאל".',
    'audit p180 closure sentence',
  );
  text = replaceOnce(
    text,
    'באותו ספר קיימות חלוקות של `طالب/مطلوب` וכן כלל של בתי השואל האי-זוגיים מול בתי המבוקש הזוגיים. אלה מועמדים להסביר את "חלק השואל/חלק הנשאל", אך אין בקטע עמ׳ 180 הפניה מפורשת שמאפשרת לבחור ביניהם ללא אימות נוסף.',
    'נמצאו כעת שלוש ראיות מקבילות: (א) עמ׳ 53 קורא ל-H13 `سائل` ול-H14 `مسؤول`; (ב) עמ׳ 214 קורא ל-H13/H14 `طالب/مطلوب`; (ג) עמ׳ 57–60 ו-64–65 מחלקים את הצורות עצמן ל-`طالب/مطلوب`, ובנוסף עמ׳ 172 מחלק את בתי השואל לאי-זוגיים ואת בתי המבוקש לזוגיים. הראיות מחזקות מאוד את הכיוון של `طالب = שואל` ו-`مطلوب = נשאל/מבוקש`, אבל עמ׳ 180 עדיין אינו מפנה במפורש למנגנון שבו צורה ג׳ נעשית "חלק" של צד. יתרה מזו, טבלת 64–65 ב-PDF התפעולי החליפה את סמלי הצורות ב-placeholders, ולכן אין בידינו מיפוי 8+8 מלא שניתן לקודד ללא שחזור מקור נוסף.',
    'audit p180 classifier evidence',
  );
  text = replaceOnce(
    text,
    '`V57 INCOMPLETE + FINAL SIDE-CLASSIFICATION NOT CLOSED`',
    '`V57 CONSTRUCTION CLOSED / FINAL SIDE-CLASSIFICATION NOT CLOSED`',
    'audit p180 status',
  );

  // Keep the project summary consistent with the already-completed p205 visual correction.
  text = replaceOnce(
    text,
    '| love p205 | פער v57↔סריקה | H5/H15 + יחס/قبضة |',
    '| love p205 | זהות H15 נסגרה חזותית | מנגנון היחס H15↔טאלע + רשימת 6,8,3,12 + `في قبضتك` |',
    'audit summary p205 stale row',
  );
  text = replaceOnce(
    text,
    '| inheritance p180 | שרשרת מקור זוהתה | תיקון שכבת v57 + משמעות חלק השואל/הנשאל |',
    '| inheritance p180 | שרשרת החישוב + v57 נסגרו | מיפוי צורה ג׳ ל`جزء السائل/جزء المسؤول` |',
    'audit summary p180 row',
  );
  text = replaceOnce(
    text,
    '1. **love p205** — קודם לסגור את טעות H5/H15 ואת מושגי היחס; כרגע זה פער מקור קונקרטי.\n2. **inheritance p180** — לסגור את v57 ואת `جزء السائل/المسؤول` לפני קוד.',
    '1. **inheritance p180** — שרשרת החישוב ו-v57 כבר נסגרו; נותר לשחזר/לאמת את מיפוי `طالب/مطلوب` של צורה ג׳ אל `جزء السائل/المسؤول`.\n2. **love p205** — H15 כבר אומת חזותית; נותר לסגור את evaluator של היחס ואת `في قبضتك`.',
    'audit recommended order p180/p205',
  );

  text += [
    '',
    '---',
    '',
    '## עדכון מקור — inheritance p180 (2026-09-09)',
    '',
    'שכבת v57 של `inheritance.p180.elementComposite` תוקנה כך שתכיל את כל שרשרת עמ׳ 180, ולא רק את הצירוף השני. התיקון נשאר fail-closed: `runtimeAllowed:false` ו-`executorStatus:pending` נשמרים עד לסגירת `جزء السائل/جزء المسؤول`.',
    '',
    'המקור המשלים מצמצם את הפער: H13/H14 מזוהים בספר הן כשואל/נשאל והן כطالب/مطلوب, וקיימת גם חלוקת צורות طالب/مطلوب. אולם טבלת 64–65 בגרסה הזמינה אינה משמרת את סמלי שמונת הצורות בכל קבוצה, ולכן לא נבנה classifier משוער.',
    '',
  ].join('\n');

  write(path, text);
}

console.log('p180 inheritance source-layer closure applied; final side classifier remains fail-closed.');
