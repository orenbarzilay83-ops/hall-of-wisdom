#!/usr/bin/env node
import fs from 'node:fs';

const OLD_ID = 'love.p205.directLoveH1PlacementH15';
const NEW_ID = 'love.p205.directLoveH1PlacementH5Relation';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text); }
function replaceOnce(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) throw new Error('Missing patch anchor: ' + label);
  if (text.indexOf(needle, first + needle.length) >= 0) throw new Error('Non-unique patch anchor: ' + label);
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}
function replaceAllChecked(text, needle, replacement, label) {
  if (!text.includes(needle)) throw new Error('Missing global patch target: ' + label);
  return text.split(needle).join(replacement);
}
function blockByStart(text, startNeedle, label) {
  const start = text.indexOf(startNeedle);
  if (start < 0) throw new Error('Missing block start: ' + label);
  const endMarker = '\n  }),';
  const endAt = text.indexOf(endMarker, start);
  if (endAt < 0) throw new Error('Missing block end: ' + label);
  const end = endAt + endMarker.length;
  return { start, end, block: text.slice(start, end) };
}
function replaceBlock(text, startNeedle, mutator, label) {
  const { start, end, block } = blockByStart(text, startNeedle, label);
  return text.slice(0, start) + mutator(block) + text.slice(end);
}

// 1) Canonical registry: rename the method and formally demote it from source-ready
// until the p205 relation semantics are closed. No executor is activated here.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  s = replaceAllChecked(s, OLD_ID, NEW_ID, 'canonical p205 method id');
  s = replaceBlock(s, `  '${NEW_ID}': method({`, (block) => {
    block = replaceOnce(block, "    kashfRuntimeStatus: 'ready',", "    kashfRuntimeStatus: 'repair-required',", 'p205 canonical runtime status');
    block = block.replace(/\n    notes: '[^\n]*',/, "\n    notes: 'Primary scan p205 reads H5 (الخامس المطلوب), not H15. The H1 figure is judged by its recurrence/placement, but the printed negative list names 6,8,3,12 while the standard cadents are 3,6,9,12. The source then says to inspect H5, called the sought, relative to the ascendant; a bad relation means aversion, while the final phrase \"وإن كان في قبضتك\" is not mechanically closed. Runtime remains blocked until the placement anomaly, نسبة relation and قبضتك clause are source-closed. Do not substitute p204 attention or p264 friendship/love.',");
    return block;
  }, 'p205 canonical block');
  write(path, s);
}

// 2) Question routes: q-love and its explicit alias stay mapped to the exact
// p205 source method, but now expose repair-required and cannot execute.
{
  const path = 'goral-hachol/registry/kashf-question-route-registry.js';
  let s = read(path);
  s = replaceAllChecked(s, OLD_ID, NEW_ID, 'question-route p205 method id');
  for (const qid of ['q-love', 'q-love-desire']) {
    s = replaceBlock(s, `  '${qid}': route({`, (block) => {
      block = replaceOnce(block, "    kashfRuntimeStatus: 'ready',", "    kashfRuntimeStatus: 'repair-required',", qid + ' status');
      return block;
    }, qid + ' route block');
  }
  write(path, s);
}

// 3) Hebrew operational knowledge: preserve the scan-supported wording and
// explicitly record every unresolved point. We do not pretend the v57 draft
// artifact itself has already been repaired; runtime remains hard-stopped.
{
  const path = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
  let s = read(path);
  s = replaceAllChecked(s, OLD_ID, NEW_ID, 'v57 knowledge p205 method id');
  s = replaceBlock(s, `  '${NEW_ID}': knowledge({`, (block) => {
    block = block.replace(
      /    hebrewRule: '[^\n]*',/,
      "    hebrewRule: 'האם אדם זה אוהב אותך? התבונן בצורת הבית הראשון. אם אותה צורה נמצאת ביתדות, יש לו רצון בך. אם היא נמצאת בקבוצת הבתים שהמקור מכנה כאן נופלים ומונה במפורש כ־6, 8, 3, 12 — הוא מתרחק ממך ומבקש אחר. לאחר מכן התבונן בבית החמישי, המכונה כאן המבוקש, ביחס לבית הראשון. אם היחס רע — הוא שונא אותך ומתרחק ממך. הסיפא \"ואם הוא באחיזתך\" נשמרת כלשונה ואינה מקבלת פסק נוסף עד שהמונח ייסגר.',"
    );
    block = replaceOnce(
      block,
      "    arabicVerificationPages: [205],",
      "    arabicVerificationPages: [205],\n    verificationNotes: 'אימות מול הסריקה המודפסת בעמ׳ 205: כתוב \"الخامس المطلوب\" — הבית החמישי, לא החמישה־עשר. באותו משפט מודפס גם רצף הבתים 6,8,3,12 תחת הכינוי \"הנופלים\", בעוד חלוקת הנופלים הסטנדרטית בספר היא 3,6,9,12; אין לתקן את 8 ל־9 בשקט. גם הפעולה המדויקת של \"نسبة رديئة\" והסיפא \"وإن كان في قبضتك\" טרם נסגרו מכנית. נוסח v57 הקיים שהזכיר H15 מסומן כאן כפער תעתוק/‏OCR ודורש תיקון מפורש במקור v57 עצמו.',",
      'p205 Arabic verification line'
    );
    if (/\n    notes: '[^\n]*',/.test(block)) {
      block = block.replace(/\n    notes: '[^\n]*',/, "\n    notes: 'שכבת הידע מתעדת את תיקון H5 ואת הסתירות במקום להחליק אותן. השיטה נשארת repair-required ואינה רשאית להפיק פסק אהבה עד שסמנטיקת החזרה של צורת H1, רשימת הבתים החריגה, יחס H5↔H1 והביטוי \"באחיזתך\" ייסגרו מן המקור.',");
    } else {
      block = block.replace(/\n  \}\),$/, "\n    notes: 'שכבת הידע מתעדת את תיקון H5 ואת הסתירות במקום להחליק אותן. השיטה נשארת repair-required ואינה רשאית להפיק פסק אהבה עד שסמנטיקת החזרה של צורת H1, רשימת הבתים החריגה, יחס H5↔H1 והביטוי \"באחיזתך\" ייסגרו מן המקור.',\n  }),");
    }
    return block;
  }, 'p205 v57 knowledge block');
  write(path, s);
}

// 4) Retrieval: rename every anti-mixing reference and add a precise p205
// knowledge record hint. Retrieval remains informational; it cannot authorize runtime.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  s = replaceAllChecked(s, OLD_ID, NEW_ID, 'retrieval p205 method id');
  const anchor = "  'marriage.p211.dissolutionH7StateMatrix': {";
  const override = `  '${NEW_ID}': {\n    aliases: ['האם הוא אוהב אותי', 'האם אדם זה אוהב אותי', 'האם הוא אוהב אותך', 'אהבה ישירה', 'האם יש לו רצון בי'],\n    doNotMixWith: ['love.p204.attentionFireRows1713', 'love.p206.womanFavorH7H11ThenH5', 'marriage.p211.dissolutionH7StateMatrix'],\n    houses: [1, 5],\n  },\n`;
  s = replaceOnce(s, anchor, override + anchor, 'p205 retrieval override anchor');
  write(path, s);
}

// 5) Audit document: make the original count explicitly historical and append
// the formal p205 repair decision, so later work does not repeat the H15 error.
{
  const path = 'HALL_WISDOM_KASHF_REMAINING_7_SOURCE_CLOSURE_AUDIT.md';
  let s = read(path);
  s = replaceAllChecked(s, OLD_ID, NEW_ID, 'audit p205 method id');
  s = s.replace(
    '> מטרת המסמך: סגירת מקור לפני מימוש עבור שבע השיטות הקנוניות שנותרו עם `kashfRuntimeStatus: \'ready\'` אך `executorStatus: \'pending\'` לאחר Easy Batch 04.',
    '> מטרת המסמך בעת פתיחת הביקורת: סגירת מקור לפני מימוש עבור שבע השיטות הקנוניות שנותרו אז עם `kashfRuntimeStatus: \'ready\'` אך `executorStatus: \'pending\'` לאחר Easy Batch 04. סטטוסים שהשתנו בעקבות הביקורת מתועדים בהמשך.'
  );
  const followup = `\n\n---\n\n## עדכון סגירה — p205 אהבה (2026-09-08)\n\nלאחר בדיקה ישירה של הסריקה המודפסת, השיטה \`${NEW_ID}\` **הורדה מ-\`ready\` ל-\`repair-required\`**.\n\nהממצאים המחייבים:\n\n- הסריקה אומרת במפורש \`الخامس المطلوب\` — **הבית החמישי**, ולא הבית החמישה־עשר. האזכור H15 ב-v57 הקיים הוא פער תעתוק/‏OCR ואינו יכול להמשיך לשמש כאילו אומת.\n- ענף הפתיחה מתייחס לצורת הטאלע/בית 1 כשהיא נמצאת בבתים אחרים; אין לפרש את המשפט כאילו עצם היות בית 1 יתד הוא התנאי, מפני שזה טריוויאלי.\n- המקור מונה תחת \`السواقط\` את הבתים **6, 8, 3, 12**. זו רשימה שאינה תואמת לחלוקת הנופלים הסטנדרטית **3, 6, 9, 12**. נשמרת הסתירה; אין לתקן 8→9 מן הדעת.\n- \`نسبة رديئة\` מוכיח שיש לשפוט יחס בין H5 לבין הטאלע, אבל הפעולה המדויקת של היחס אינה מפורשת בקטע p205 עצמו. פרקי היחסים/ההשוואה בעמ׳ 127–128 הם הקשר רלוונטי, אך טרם הוכח שהם בדיוק הפעולה שאליה p205 מפנה.\n- הסיפא \`وإن كان في قبضتك\` קיימת בסריקה, אך אינה מוסרת כאן פסק מלא שניתן לתרגם בבטחה לאלגוריתם. היא נשמרת ללא השלמה.\n\nמסקנה: אין executor פעיל ל-p205 בשלב זה. q-love ו-q-love-desire נשארים ממופים לשיטה המדויקת לצורכי ידע/traceability, אך runtime ו-AI verdict נשארים חסומים עד לסגירת ארבעת הסעיפים לעיל.\n`;
  if (!s.includes('## עדכון סגירה — p205 אהבה (2026-09-08)')) s += followup;
  write(path, s);
}

// 6) Canonical contract tests for the repaired source boundary.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  const anchor = "const professionV57 = getKashfV57Knowledge('profession.p254.h9Planet');";
  const tests = `// ── p205 direct-love source repair: H5, not H15; runtime hard stop -----\nconst p205LoveMethod = getKashfMethod('${NEW_ID}');\nassert(p205LoveMethod?.kashfRuntimeStatus === 'repair-required', 'p205 direct-love is repair-required after scan verification');\nassert(p205LoveMethod?.runtimeAllowed === false && p205LoveMethod?.executorStatus === 'pending', 'p205 direct-love cannot run while relation semantics are unresolved');\nassert(getKashfMethod('${OLD_ID}') == null, 'obsolete H15 p205 method id is removed');\nassertRoute('q-love', {\n  ok: true,\n  canRunKashf: false,\n  kashfIntentId: 'love.doesPersonLoveMe',\n  kashfMethodId: '${NEW_ID}',\n  kashfRuntimeStatus: 'repair-required',\n  runtimeAllowed: false,\n  executorStatus: 'pending',\n});\nconst p205LoveAlias = resolveKashfRouteByQuestionId('q-love-desire');\nassert(p205LoveAlias.aliasOf === 'q-love', 'q-love-desire remains an explicit alias of q-love');\nassert(p205LoveAlias.kashfMethodId === '${NEW_ID}' && p205LoveAlias.canRunKashf === false, 'q-love-desire inherits the repaired p205 hard stop');\nconst p205LoveV57 = getKashfV57Knowledge('${NEW_ID}');\nassert(p205LoveV57?.v57?.hebrewRule.includes('בבית החמישי'), 'p205 Hebrew operational knowledge now records H5 from the primary scan');\nassert(!p205LoveV57?.v57?.hebrewRule.includes('בבית החמישה־עשר'), 'p205 Hebrew operational knowledge no longer states H15');\nassert(p205LoveV57?.arabicVerification?.notes?.includes('6,8,3,12'), 'p205 verification notes preserve the printed 6,8,3,12 anomaly');\nassert(p205LoveV57?.arabicVerification?.notes?.includes('3,6,9,12'), 'p205 verification notes preserve the standard-cadent comparison instead of silently normalizing');\n\n`;
  s = replaceOnce(s, anchor, tests + anchor, 'canonical p205 test anchor');
  write(path, s);
}

// 7) Retrieval tests: repaired p205 remains discoverable as knowledge but not runnable.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let s = read(path);
  const anchor = "const pendingKnowledgeRecord = getKashfAiRetrievalRecord('mother.p257.statusDayNight');";
  const tests = `const p205RepairRecord = getKashfAiRetrievalRecord('${NEW_ID}');\nassert(p205RepairRecord != null, 'repaired p205 direct-love remains indexed for knowledge retrieval');\nassert(getKashfAiRetrievalRecord('${OLD_ID}') == null, 'obsolete H15 p205 retrieval id is absent');\nassert(p205RepairRecord?.kashfRuntimeStatus === 'repair-required', 'p205 retrieval exposes repair-required source status');\nassert(p205RepairRecord?.runtimeAllowed === false && p205RepairRecord?.executorStatus === 'pending', 'p205 retrieval cannot promote the blocked executor');\nassert(p205RepairRecord?.questionIds.includes('q-love'), 'p205 retrieval stays linked to q-love');\nassert(JSON.stringify(p205RepairRecord?.houses) === JSON.stringify([1,5]), 'p205 retrieval exposes H1 and corrected H5 as the primary source scope');\nassert(p205RepairRecord?.v57?.hebrewRule.includes('בבית החמישי'), 'p205 retrieval carries corrected H5 Hebrew knowledge');\n\n`;
  s = replaceOnce(s, anchor, tests + anchor, 'retrieval p205 test anchor');
  write(path, s);
}

// 8) Live bridge test: an explicit love question resolves authoritatively but
// cannot authorize an AI verdict while the source contract is under repair.
{
  const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
  let s = read(path);
  const anchor = '// 4b. Newly activated p167 route is available to the live AI only through its';
  const tests = `// 4a. p205 source repair is visible to the live bridge but cannot execute.\nconst p205RepairLive = buildKashfCanonicalAiBridge({\n  questionId: 'q-love',\n  questionText: 'האם הוא אוהב אותי?',\n  board: BOARD,\n});\nassert(p205RepairLive.resolution.kashfMethodId === '${NEW_ID}', 'q-love resolves the corrected p205 H5-relation method id');\nassert(p205RepairLive.resolution.kashfRuntimeStatus === 'repair-required', 'q-love bridge exposes repair-required status');\nassert(p205RepairLive.resolution.executorStatus === 'pending', 'q-love bridge preserves pending executor state');\nassert(p205RepairLive.aiVerdictAllowed === false, 'AI cannot issue a p205 love verdict while source semantics remain unresolved');\nassert(p205RepairLive.canonicalReading.canRunKashf === false, 'canonical p205 runtime remains hard-stopped');\nassert(p205RepairLive.canonicalRetrieval?.v57?.hebrewRule?.includes('בבית החמישי'), 'live p205 retrieval exposes corrected H5 knowledge');\n\n`;
  s = replaceOnce(s, anchor, tests + anchor, 'live bridge p205 test anchor');
  write(path, s);
}

console.log('Kashf p205 source-repair patch applied.');
