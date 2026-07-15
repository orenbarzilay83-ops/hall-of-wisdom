/**
 * _test_kashf_invalid_json_diagnosis.mjs
 *
 * Diagnostic-only script (no commit target — audit evidence for
 * HALL_WISDOM_KASHF_LIVE_PILOT_CONTEXT_SIZE_AND_JSON_AUDIT_REPORT.md).
 *
 * Reproduces the exact parsing step index.ts performs today
 * (`JSON.parse(aiResult.text)`, no trimming, no fence-stripping) against a
 * catalog of plausible malformed-model-output shapes, to confirm which
 * failure categories are currently indistinguishable (all collapse to the
 * single log value 'invalid-json-response') and to validate a proposed
 * safe single-JSON-object extractor WITHOUT wiring it into production code.
 *
 * No network call. No real API key. No mutation of any existing file.
 */

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

// Exact reproduction of index.ts's current parsing step (lines ~265-271).
function currentParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, error: 'invalid-json-response' }; // ← every case below collapses to this one string today
  }
}

const validObject = { module: 'kashf', confidence: 'high' };
const validJson = JSON.stringify(validObject);

const cases = {
  'markdown fence with json tag': '```json\n' + validJson + '\n```',
  'markdown fence, no tag': '```\n' + validJson + '\n```',
  'leading prose': 'הנה התשובה שלי:\n' + validJson,
  'trailing prose': validJson + '\n\nזו הייתה הביקורת שלי.',
  'truncated (cut mid-object)': validJson.slice(0, Math.floor(validJson.length * 0.6)),
  'trailing comma': '{"module":"kashf","confidence":"high",}',
  'unescaped quote in string value': '{"module":"kashf","advisorDiagnosis":"הוא אמר "לא" בבירור"}',
  'control character in string': '{"module":"kashf","advisorDiagnosis":"שורה1\nשורה2"}', // raw \n instead of \\n
  'two JSON objects concatenated': validJson + validJson,
  'valid JSON, wrapped in outer prose+fence (worst case)': 'הבנתי, הנה הניתוח:\n\n```json\n' + validJson + '\n```\n\nתגיד לי אם צריך עוד.',
};

console.log('\n--- 1. current index.ts behavior: every malformed shape collapses to the same opaque string ---');
for (const [label, text] of Object.entries(cases)) {
  const result = currentParse(text);
  assert(result.ok === false && result.error === 'invalid-json-response', `"${label}" -> currently indistinguishable ('invalid-json-response')`);
}
{
  const result = currentParse(validJson);
  assert(result.ok === true, 'sanity: a clean, unwrapped JSON object still parses fine today');
}

console.log('\n--- 2. proposed safe single-object extractor (diagnostic-only here, NOT wired into index.ts) ---');
// Strips at most one leading/trailing markdown fence and prose OUTSIDE the
// outermost {...} span; does not alter, "fix", or invent any content
// *inside* that span. Rejects (does not attempt to repair) structural
// problems inside the object itself (trailing commas, truncation, etc).
function extractSingleJsonObject(text) {
  if (typeof text !== 'string') return { ok: false, category: 'not-a-string' };
  const trimmed = text.trim();
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first !== -1 && last === -1) {
    return { ok: false, category: 'truncated' }; // opening brace present, no closing brace anywhere
  }
  if (first === -1 || last === -1 || last < first) {
    return { ok: false, category: 'no-json-object-found' };
  }
  const beforeHasSecondObject = trimmed.indexOf('{', first + 1) !== -1 && trimmed.slice(last + 1).includes('{');
  const candidate = trimmed.slice(first, last + 1);
  try {
    const value = JSON.parse(candidate);
    return { ok: true, value, hadSurroundingText: first > 0 || last < trimmed.length - 1 };
  } catch (e) {
    let category = 'unknown-parse-error';
    if (/Unexpected end of JSON input/.test(e.message) || /Unterminated string/i.test(e.message)) category = 'truncated';
    else if (/Unexpected token .*}/.test(e.message) || /trailing comma/i.test(e.message)) category = 'trailing-comma-or-structural';
    else if (/Unexpected token/.test(e.message)) category = 'malformed-token';
    return { ok: false, category, rawMessage: undefined }; // never surface e.message raw beyond a coarse category
  }
}

assert(extractSingleJsonObject(cases['markdown fence with json tag']).ok === true, '```json fence -> extractor recovers the object');
assert(extractSingleJsonObject(cases['markdown fence, no tag']).ok === true, '``` fence (no tag) -> extractor recovers the object');
assert(extractSingleJsonObject(cases['leading prose']).ok === true, 'leading prose -> extractor recovers the object');
assert(extractSingleJsonObject(cases['trailing prose']).ok === true, 'trailing prose -> extractor recovers the object');
assert(extractSingleJsonObject(cases['valid JSON, wrapped in outer prose+fence (worst case)']).ok === true, 'prose+fence combined -> extractor recovers the object');
assert(extractSingleJsonObject(cases['truncated (cut mid-object)']).ok === false && extractSingleJsonObject(cases['truncated (cut mid-object)']).category === 'truncated', 'truncated JSON -> correctly rejected as truncated, not silently patched');
assert(extractSingleJsonObject(cases['trailing comma']).ok === false, 'trailing comma -> correctly rejected, not silently repaired');
assert(extractSingleJsonObject(validJson).ok === true, 'sanity: clean JSON still extracts correctly');

const recovered = extractSingleJsonObject(cases['markdown fence with json tag']);
assert(JSON.stringify(recovered.value) === JSON.stringify(validObject), 'recovered object is byte-identical to the original professional content — extractor does not alter field values');

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. אישור: (1) כל תבנית-כשל שנבדקה מתכווצת היום לאותה מחרוזת אטומה יחידה ב-index.ts; (2) extractSingleJsonObject המוצע (לא מחובר לקוד production כאן) משחזר בהצלחה JSON שעטוף ב-markdown-fence/פרוזה, ודוחה (לא "מתקן") קטיעה/פסיק עודף בלי להמציא תוכן.');
