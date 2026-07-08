/**
 * _test_kashf_archive_save.mjs
 *
 * בדיקות-חובה לשלב א' של KASHF_CONTEXT_COLLECTOR_IMPLEMENTATION_PLAN.md:
 * שמירת קריאות-כשף לארכיון עם method: "kashf", בלי לשבור חאווי, בלי
 * ערבוב לא-מסומן, ועם fallback ל-"hawi" לרשומות ישנות בלי method.
 *
 * מריץ עם mock ל-localStorage (Node אין לו localStorage מובנה) — לא נוגע
 * בשום דבר אמיתי, לא רשת, לא דפדפן.
 */

// ── mock localStorage ─────────────────────────────────────────────────────
class MemoryStorage {
  constructor() { this.store = {}; }
  getItem(key) { return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
}
globalThis.localStorage = new MemoryStorage();

const {
  saveGoralReadingToArchive,
  saveKashfReadingToArchive,
  getGoralClientHistory,
  summarizeGoralClientHistory,
  clearGoralArchive,
} = await import('./goral-hachol/engine/goral-client-archive.js');

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

clearGoralArchive();

// ── 1. קריאת כשף נשמרת לארכיון עם method: "kashf" ───────────────────────
console.log('\n--- 1. שמירת קריאת כשף ---');
{
  const kashfReading = {
    valid: true,
    topicId: 'commerce',
    topicHebrewName: 'מסחר',
    clientContext: { name: 'ראובן', question: 'האם העסק ירוויח?', age: '', gender: '' },
    primaryFormula: { verdict: { text: 'רוב הסימנים נוטים לחיוב.', positive: true } },
    commerceSmartLayer: { clientWording: 'בית המבקש בעסקה מראה חיבור — מיטיבה.' },
  };
  const result = saveKashfReadingToArchive(kashfReading);
  assert(result.ok === true, 'saveKashfReadingToArchive מחזיר ok:true');
  assert(result.record.method === 'kashf', 'הרשומה שנשמרה מסומנת method: "kashf"');
  assert(result.record.clientName === 'ראובן', 'שם הלקוח נלקח מ-clientContext.name (לא clientName)');
  assert(result.record.topicId === 'commerce', 'topicId נשמר נכון');
  assert(result.record.conclusion.includes('חיבור'), 'conclusion נלקח מ-commerceSmartLayer.clientWording');
}

// ── 2. קריאת חאווי עדיין נשמרת כמו קודם ──────────────────────────────────
console.log('\n--- 2. שמירת קריאת חאווי (רגרסיה) ---');
{
  const reading = { clientContext: { clientName: 'שמעון' }, question: 'מה מצב הכסף?' };
  const interpretation = { topicHebrew: 'ממון', topicId: 'money', finalConclusionHebrew: 'מסקנה לדוגמה' };
  const result = saveGoralReadingToArchive(reading, interpretation);
  assert(result.ok === true, 'saveGoralReadingToArchive ממשיך לעבוד');
  assert(result.record.method === 'hawi', 'רשומת-חאווי חדשה מסומנת method: "hawi"');
  assert(result.record.clientName === 'שמעון', 'שם הלקוח נשמר נכון (מ-clientContext.clientName)');
  assert(result.record.conclusion === 'מסקנה לדוגמה', 'תוכן-המסקנה זהה למבנה הקודם (לא השתנה)');
}

// ── 3. רשומה ישנה בלי method מזוהה כ-hawi fallback ───────────────────────
console.log('\n--- 3. רשומה ישנה בלי method (legacy fallback) ---');
{
  const archive = JSON.parse(localStorage.getItem('goralHacholClientReadingsArchive_v1_local'));
  archive.push({
    id: 'legacy-1', createdAt: '2026-01-01T00:00:00.000Z',
    // בכוונה בלי method — מדמה רשומה שנוצרה לפני השינוי
    clientName: 'לקוח-ישן', clientContext: { clientName: 'לקוח-ישן' },
    question: 'שאלה ישנה', topicHebrew: 'כללי', topicId: 'general',
    conclusion: 'מסקנה ישנה',
  });
  localStorage.setItem('goralHacholClientReadingsArchive_v1_local', JSON.stringify(archive));

  const hawiHistory = getGoralClientHistory('לקוח-ישן'); // ברירת-מחדל = 'hawi'
  assert(hawiHistory.length === 1, 'רשומה ישנה בלי method מזוהה תחת ברירת-המחדל "hawi"');

  const kashfHistory = getGoralClientHistory('לקוח-ישן', 'kashf');
  assert(kashfHistory.length === 0, 'אותה רשומה ישנה לא נספרת כ-"kashf"');
}

// ── 4. clientHistorySummary לא נשבר ───────────────────────────────────────
console.log('\n--- 4. summarizeGoralClientHistory (ברירת-מחדל, ללא ארגומנט method) ---');
{
  const summary = summarizeGoralClientHistory('שמעון');
  assert(typeof summary === 'object' && summary !== null, 'מחזיר object');
  assert(summary.total === 1, 'total סופר רק את רשומת-החאווי של שמעון (אין לו קריאות-כשף)');
  assert(typeof summary.summaryHebrew === 'string' && summary.summaryHebrew.length > 5, 'summaryHebrew תקין כמו קודם');
  assert(Array.isArray(summary.repeatedTopics) && Array.isArray(summary.repeatedSpiritualFlags), 'מבנה-השדות הקיים (repeatedTopics/repeatedSpiritualFlags) לא השתנה');
}

// ── 5. אין ערבוב לא-מסומן בין hawi/kashf ──────────────────────────────────
console.log('\n--- 5. בדיקת אי-ערבוב: לקוח עם קריאות משתי השיטות ---');
{
  clearGoralArchive();
  saveGoralReadingToArchive(
    { clientContext: { clientName: 'לקוח-משולב' }, question: 'ש1' },
    { topicHebrew: 'ממון', topicId: 'money', finalConclusionHebrew: 'מ1' }
  );
  saveGoralReadingToArchive(
    { clientContext: { clientName: 'לקוח-משולב' }, question: 'ש2' },
    { topicHebrew: 'בריאות', topicId: 'health', finalConclusionHebrew: 'מ2' }
  );
  saveKashfReadingToArchive({
    valid: true, topicId: 'commerce', topicHebrewName: 'מסחר',
    clientContext: { name: 'לקוח-משולב', question: 'ש3' },
    primaryFormula: { verdict: { text: 'v', positive: true } },
  });

  const defaultSummary = summarizeGoralClientHistory('לקוח-משולב'); // ברירת-מחדל = hawi בלבד
  assert(defaultSummary.total === 2, 'ברירת-המחדל (ללא ציון method) סופרת רק 2 קריאות-חאווי — קריאת-הכשף לא "דולפת" לתוך הנרטיב-הקיים של חאווי בלי ציון מפורש');

  const allHistory = getGoralClientHistory('לקוח-משולב', 'all');
  assert(allHistory.length === 3, 'עם method:"all" מפורש רואים את כל 3 הקריאות (2 חאווי + 1 כשף)');
  assert(allHistory.filter(h => h.method === 'kashf').length === 1, 'בדיוק קריאת-כשף אחת מסומנת נכון בתוך "all"');
  assert(allHistory.filter(h => h.method === 'hawi').length === 2, 'בדיוק 2 קריאות-חאווי מסומנות נכון בתוך "all"');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. שמירת-כשף לארכיון עובדת, חאווי לא נשבר, אין ערבוב לא-מסומן, fallback ל-legacy עובד.');
