#!/usr/bin/env node
import fs from 'node:fs';

const OLD = 'love.p205.directLoveH1PlacementH5Relation';
const CORRECT = 'love.p205.directLoveH1PlacementH15';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text, 'utf8'); }
function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}
function replaceAllRequired(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count < 1) throw new Error(`${label}: expected at least 1 literal match, found 0`);
  return text.split(from).join(to);
}
function replaceSection(text, start, end, replacement, label) {
  const i = text.indexOf(start);
  if (i === -1) throw new Error(`${label}: start anchor not found`);
  const j = text.indexOf(end, i + start.length);
  if (j === -1) throw new Error(`${label}: end anchor not found`);
  return text.slice(0, i) + replacement + text.slice(j);
}

// 1) Operational v57: correct the visual-scan reading back to H15.
{
  const path = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
  let text = read(path);
  text = replaceAllRequired(text, OLD, CORRECT, 'v57 p205 method id');
  const start = `  '${CORRECT}': knowledge({`;
  const end = "  'marriage.p210.generalMarriageH1H2H7H8H10Judge': knowledge({";
  const block = [
    `  '${CORRECT}': knowledge({`,
    `    kashfMethodId: '${CORRECT}',`,
    '    page: 205,',
    "    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',",
    "    heading: 'האם אדם זה אוהב אותך?',",
    "    hebrewRule: 'האם אדם זה אוהב אותך? התבונן בצורת הטאלע/בית הראשון. אם אותה צורה נמצאת ביתדות, יש לו רצון בך. אם היא נמצאת בקבוצת הבתים שהמקור מכנה כאן נופלים ומונה במפורש כ־6, 8, 3, 12 — הוא מתרחק ממך ומבקש אחר. לאחר מכן התבונן בבית החמישה־עשר ביחס לטאלע. אם היחס רע — הוא אינו אוהב אותך. הסיפא \"ואם הוא באחיזתך\" נשמרת כלשונה ואינה מקבלת פסק נוסף עד שהמונח ייסגר.',",
    '    supportingPages: [43, 44, 45],',
    '    arabicVerificationPages: [205],',
    "    verificationNotes: 'אימות חזותי חוזר מול הסריקה המודפסת של עמ׳ 205 (PDF page 145) מראה בבירור: \"انظر البيت الخامس عشر بالنسبة إلى الطالع\" — הבית החמישה־עשר ביחס לטאלע. הקריאה הקודמת \"الخامس المطلوب\" הייתה שגיאת פענוח של שכבת הטקסט/ביקורת ואינה נתמכת בתמונה. רצף הבתים 6,8,3,12 אכן מודפס תחת הכינוי נופלים, אף שחלוקת הנופלים הסטנדרטית במקום אחר היא 3,6,9,12; אין לתקן את 8 ל־9 בלי מקור. הפעולה המדויקת של \"نسبة رديئة\" והסיפא \"وإن كان في قبضتك\" עדיין אינן סגורות מכנית.',",
    "    notes: 'H15 הוחזר במפורש לאחר בדיקה חזותית של הסריקה. השיטה נשארת repair-required: עדיין צריך לסגור את מנגנון מציאת צורת הטאלע ביתדות/בבתים המנויים, את חריגת 8 מול 9, את יחס H15↔טאלע ואת הביטוי \"באחיזתך\". אין להפיק פסק אהבה לפני סגירתם.',",
    '  }),',
    '',
  ].join('\n');
  text = replaceSection(text, start, end, block, 'replace p205 v57 block');
  write(path, text);
}

// 2) Canonical registry: restore H15 method identity and corrected blocker note.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let text = read(path);
  text = replaceAllRequired(text, OLD, CORRECT, 'canonical p205 method id');
  const oldNote = "    notes: 'Primary scan p205 reads H5 (الخامس المطلوب), not H15. The H1 figure is judged by its recurrence/placement, but the printed negative list names 6,8,3,12 while the standard cadents are 3,6,9,12. The source then says to inspect H5, called the sought, relative to the ascendant; a bad relation means aversion, while the final phrase \"وإن كان في قبضتك\" is not mechanically closed. Runtime remains blocked until the placement anomaly, نسبة relation and قبضتك clause are source-closed. Do not substitute p204 attention or p264 friendship/love.',";
  const newNote = "    notes: 'Visual recheck of the printed p205 scan confirms H15: انظر البيت الخامس عشر بالنسبة إلى الطالع. The prior H5 repair was based on a text-layer misread and is reversed. The H1/ascendant figure is judged by recurrence/placement; the printed negative list still names 6,8,3,12 while the standard cadents are 3,6,9,12. Runtime remains blocked until that placement anomaly, the H15↔ascendant نسبة relation, and the final وإن كان في قبضتك clause are source-closed. Do not substitute p204 attention or p206 favor/desire.',";
  text = replaceOnce(text, oldNote, newNote, 'canonical p205 corrected note');
  write(path, text);
}

// 3) Route registry and safety references: restore the canonical H15 id, but remain blocked.
for (const path of [
  'goral-hachol/registry/kashf-question-route-registry.js',
  'goral-hachol/intelligence/kashf-professional-verdict-safety.js',
]) {
  let text = read(path);
  text = replaceAllRequired(text, OLD, CORRECT, `${path} p205 id`);
  write(path, text);
}

// 4) Retrieval scope: H1 + H15, not H1 + H5.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let text = read(path);
  text = replaceAllRequired(text, OLD, CORRECT, 'retrieval p205 id');
  const anchor = `  '${CORRECT}': {\n    aliases: ['האם הוא אוהב אותי', 'האם אדם זה אוהב אותי', 'האם הוא אוהב אותך', 'אהבה ישירה', 'האם יש לו רצון בי'],\n    doNotMixWith: ['love.p204.attentionFireRows1713', 'love.p206.womanFavorH7H11ThenH5', 'marriage.p211.dissolutionH7StateMatrix'],\n    houses: [1, 5],\n  },`;
  const corrected = `  '${CORRECT}': {\n    aliases: ['האם הוא אוהב אותי', 'האם אדם זה אוהב אותי', 'האם הוא אוהב אותך', 'אהבה ישירה', 'האם יש לו רצון בי'],\n    doNotMixWith: ['love.p204.attentionFireRows1713', 'love.p206.womanFavorH7H11ThenH5', 'marriage.p211.dissolutionH7StateMatrix'],\n    houses: [1, 15],\n  },`;
  text = replaceOnce(text, anchor, corrected, 'retrieval p205 H15 houses');
  write(path, text);
}

// 5) Retrieval tests: reverse the mistaken H5 assertions.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let text = read(path);
  text = replaceAllRequired(text, OLD, CORRECT, 'retrieval tests p205 id');
  text = replaceOnce(
    text,
    `assert(getKashfAiRetrievalRecord('${CORRECT}') == null, 'obsolete H15 p205 retrieval id is absent');`,
    `assert(getKashfAiRetrievalRecord('${OLD}') == null, 'mistaken H5 p205 retrieval id is absent');`,
    'retrieval obsolete-id assertion',
  );
  text = replaceOnce(text, "assert(JSON.stringify(p205RepairRecord?.houses) === JSON.stringify([1,5]), 'p205 retrieval exposes H1 and corrected H5 as the primary source scope');", "assert(JSON.stringify(p205RepairRecord?.houses) === JSON.stringify([1,15]), 'p205 retrieval exposes H1 and visually verified H15 as the primary source scope');", 'retrieval H15 scope test');
  text = replaceOnce(text, "assert(p205RepairRecord?.v57?.hebrewRule.includes('בבית החמישי'), 'p205 retrieval carries corrected H5 Hebrew knowledge');", "assert(p205RepairRecord?.v57?.hebrewRule.includes('בבית החמישה־עשר'), 'p205 retrieval carries visually verified H15 Hebrew knowledge');", 'retrieval H15 knowledge test');
  write(path, text);
}

// 6) Canonical routing tests: H15 is restored, H5 repair id must disappear.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let text = read(path);
  text = replaceAllRequired(text, OLD, CORRECT, 'canonical tests p205 id');
  text = replaceOnce(text, '// ── p205 direct-love source repair: H5, not H15; runtime hard stop -----', '// ── p205 visual-scan correction: H15 restored; runtime hard stop -------', 'canonical p205 comment');
  text = replaceOnce(
    text,
    `assert(getKashfMethod('${CORRECT}') == null, 'obsolete H15 p205 method id is removed');`,
    `assert(getKashfMethod('${OLD}') == null, 'mistaken H5 p205 method id is removed');`,
    'canonical obsolete-id assertion',
  );
  write(path, text);
}

// 7) Live bridge tests: keep fail-closed status but point at source-correct H15 id.
{
  const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
  let text = read(path);
  text = replaceAllRequired(text, OLD, CORRECT, 'live bridge p205 id');
  text = replaceAllRequired(text, 'corrected p205 H5-relation method id', 'visually verified p205 H15-relation method id', 'live bridge assertion wording');
  write(path, text);
}

// 8) Correct the source-closure audit itself. Preserve the historical mistake as superseded evidence.
{
  const path = 'HALL_WISDOM_KASHF_REMAINING_7_SOURCE_CLOSURE_AUDIT.md';
  let text = read(path);
  const start = '## 6. `love.p205.directLoveH1PlacementH5Relation`';
  const end = '## 7. `inheritance.p180.elementComposite`';
  const section = [
    `## 6. \`${CORRECT}\``,
    '',
    '### ממצא מקור מתוקן — בדיקה חזותית חוזרת',
    'בדיקה חזותית ישירה של תמונת הסריקה בעמ׳ 205 מתקנת את מסקנת הביקורת הקודמת. בשורה המודפסת כתוב בבירור:',
    '',
    '> `انظر البيت الخامس عشر بالنسبة إلى الطالع`',
    '',
    'כלומר: **התבונן בבית החמישה־עשר ביחס לטאלע**. הקריאה הקודמת `الخامس المطلوب` / H5 נבעה משגיאת פענוח של שכבת הטקסט ואינה נתמכת בתמונה. לכן אין פער H5↔H15; H15 הוא הקריאה המחייבת.',
    '',
    '### מה סגור',
    '- השאלה היא אהבה ישירה: האם אדם זה אוהב אותך.',
    '- צורת הטאלע/בית 1 נבדקת לפי הימצאותה/חזרתה ביתדות לעומת קבוצת בתים שלילית.',
    '- המקור המודפס מונה בענף השלילי 6, 8, 3, 12 בדיוק כך; אין להחליף 8 ב־9 רק כדי להתאים לחלוקת הנופלים הרגילה.',
    '- בית היחס בשלב הבא הוא H15, לא H5.',
    '- `نسبة رديئة` ביחס H15↔טאלע נותן במפורש ענף שלילי: אינו אוהב אותך.',
    '',
    '### חסמים שנותרו',
    '1. צריך לקבע מכנית כיצד נמדדת הימצאות/חזרת צורת הטאלע ביתדות ובקבוצת 6,8,3,12.',
    '2. צריך לסגור את פעולת `نسبة رديئة` לפי מערכת היחסים של הספר, בלי להמציא evaluator.',
    '3. הסיפא `وإن كان في قبضتك` נקטעת/אינה מפורשת די הצורך בקטע הזמין, ולכן אין להשלים לה פסק מן הדעת.',
    '',
    '### סטטוס החלטה',
    '`VISUAL SOURCE IDENTITY CORRECTED TO H15 / RELATION SEMANTICS STILL NOT CLOSED`',
    '',
    'השיטה נשארת `repair-required` ו־`runtimeAllowed:false`. התיקון הנוכחי הוא תיקון מקור/traceability בלבד, לא היתר להפעיל executor.',
    '',
    '---',
    '',
  ].join('\n');
  text = replaceSection(text, start, end, section, 'audit p205 section');

  text = replaceAllRequired(text, OLD, CORRECT, 'audit p205 id everywhere');
  text = text.replace(
    /## עדכון סגירה — p205 אהבה \(2026-09-08\)[\s\S]*$/,
    [
      '## תיקון לביקורת p205 — 2026-09-09',
      '',
      'העדכון מ־2026-09-08 שקבע כי הסריקה אומרת H5 מבוטל. בדיקה חזותית חוזרת של העמוד המודפס מראה `البيت الخامس عشر` — H15. כל registry/test/traceability שנבנו על תיקון H5 הוחזרו ל-H15. שאר החסמים הסמנטיים נשארים בתוקף, ולכן השיטה עדיין חסומה לביצוע.',
      '',
    ].join('\n'),
  );
  write(path, text);
}

console.log('p205 visual-scan H15 correction applied; runtime remains fail-closed.');
