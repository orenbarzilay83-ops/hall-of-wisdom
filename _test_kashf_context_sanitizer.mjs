/**
 * _test_kashf_context_sanitizer.mjs
 *
 * בדיקות-חובה ל-kashf-context-sanitizer.js לפי KASHF_SAFE_CONTEXT_USAGE_FOR_COMMERCE_PLAN.md.
 * הפונקציה עדיין לא-מחוברת לשום פלט בפועל — הבדיקות בודקות אותה בבידוד,
 * ובנוסף מריצות מחדש את בדיקות-הרגרסיה הקודמות כדי לוודא שאין שינוי-פלט.
 */

import { sanitizeKashfClientContext } from './goral-hachol/engine/kashf-context-sanitizer.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

// ── 1. phone נחסם תמיד ────────────────────────────────────────────────────
console.log('\n--- 1. phone נחסם תמיד ---');
{
  const withPhone = sanitizeKashfClientContext({ topicId: 'commerce', clientContext: { name: 'א', phone: '0501234567' } });
  const withoutPhone = sanitizeKashfClientContext({ topicId: 'commerce', clientContext: { name: 'א' } });
  assert(withPhone.blockedContextFields.includes('phone'), 'phone חסום כשיש ערך');
  assert(withoutPhone.blockedContextFields.includes('phone'), 'phone חסום גם כשאין ערך (חסימה מבנית)');
  assert(withPhone.clientSafeContext.phone === undefined, 'phone לעולם לא ב-clientSafeContext');
  assert(withPhone.advisorContextNotes.some(n => n.field === 'phone' && n.note === '0501234567'), 'phone מופיע ב-advisorContextNotes כשיש ערך');
}

// ── 2+3. dynFields רגישים לא נכנסים ל-clientSafeContext, אבל משפיעים על contextRelevance ─
console.log('\n--- 2+3. dynFields ---');
{
  const result = sanitizeKashfClientContext({
    topicId: 'commerce',
    clientContext: { name: 'רות', dynFields: { symptoms: 'כאב-ראש חמור', matter: 'עסקת נדל"ן' } },
  });
  assert(result.clientSafeContext.dynFields === undefined, 'dynFields לא נכנס בכלל ל-clientSafeContext');
  assert(Object.keys(result.clientSafeContext).every(k => k !== 'symptoms' && k !== 'matter'), 'אין דליפה של תוכן-dynFields כשדות-שטוחים ב-clientSafeContext');
  assert(result.contextRelevance.dynFields.relevant === true, 'dynFields מסומן relevant כשיש תוכן');
  assert(!result.contextRelevance.dynFields.reason.includes('כאב-ראש חמור'), 'ה-reason לא מכיל את התוכן-המילולי, רק שמות-שדה');
  assert(result.contextRelevance.dynFields.reason.includes('symptoms'), 'ה-reason מזכיר את שם-השדה (לא התוכן)');
  const symptomsNote = result.advisorContextNotes.find(n => n.field === 'dynFields.symptoms');
  assert(symptomsNote?.sensitive === true, 'symptoms מסומן sensitive:true (לא ברשימת הבלתי-רגישים)');
  const matterNote = result.advisorContextNotes.find(n => n.field === 'dynFields.matter');
  assert(matterNote?.sensitive === false, 'matter מסומן sensitive:false (ברשימת הידועים-כלא-רגישים)');
}

// ── 4. employed לא מקבל ניסוח של בעל עסק ──────────────────────────────────
console.log('\n--- 4. employed ---');
{
  const result = sanitizeKashfClientContext({ topicId: 'commerce', clientContext: { name: 'א', workStatus: 'employed' } });
  assert(result.clientSafeContext.workStatus === 'employed', 'workStatus=employed כן נכנס ל-clientSafeContext (רלוונטי, בזהירות)');
  const adj = result.clientWordingAdjustments.find(a => a.type === 'caution-no-business-assumption');
  assert(!!adj, 'קיימת התאמת-זהירות מפורשת caution-no-business-assumption');
  assert(!result.clientWordingAdjustments.some(a => a.type === 'business-context-allowed'), 'employed לא מקבל business-context-allowed (זה רק ל-self)');
}

// ── 5. self מקבל סימון רלוונטיות למסחר כאשר topicId הוא commerce ──────────
console.log('\n--- 5. self + commerce ---');
{
  const commerceResult = sanitizeKashfClientContext({ topicId: 'commerce', clientContext: { name: 'א', workStatus: 'self' } });
  assert(commerceResult.contextRelevance.workStatus.relevant === true, 'self רלוונטי כש-topicId=commerce');
  assert(commerceResult.clientWordingAdjustments.some(a => a.type === 'business-context-allowed'), 'self מקבל business-context-allowed');

  const otherTopicResult = sanitizeKashfClientContext({ topicId: 'money', clientContext: { name: 'א', workStatus: 'self' } });
  assert(otherTopicResult.contextRelevance.workStatus.relevant === false, 'self לא-רלוונטי כש-topicId אינו commerce');
  assert(otherTopicResult.clientSafeContext.workStatus === undefined, 'workStatus לא נכנס ל-clientSafeContext כשהנושא לא commerce');
}

// ── 6. maritalStatus/hasChildren לא נכנסים ל-clientSafeContext ────────────
console.log('\n--- 6. maritalStatus/hasChildren ---');
{
  const result = sanitizeKashfClientContext({
    topicId: 'commerce',
    clientContext: { name: 'א', maritalStatus: 'married', hasChildren: 'yes' },
  });
  assert(result.clientSafeContext.maritalStatus === undefined, 'maritalStatus לא נכנס ל-clientSafeContext (ברירת-מחדל שמרנית)');
  assert(result.clientSafeContext.hasChildren === undefined, 'hasChildren לא נכנס ל-clientSafeContext (ברירת-מחדל שמרנית)');
  assert(result.contextRelevance.maritalStatus.relevant === false, 'maritalStatus מסומן לא-רלוונטי');
  assert(result.contextRelevance.hasChildren.relevant === false, 'hasChildren מסומן לא-רלוונטי');
}

// ── 7. quesitedName נכנס רק בהקשר עסקה ─────────────────────────────────────
console.log('\n--- 7. quesitedName ---');
{
  const commerceWithQuesited = sanitizeKashfClientContext({ topicId: 'commerce', clientContext: { name: 'א', quesitedName: 'השותף' } });
  assert(commerceWithQuesited.clientSafeContext.quesitedName === 'השותף', 'quesitedName נכנס כש-topicId=commerce ויש ערך');

  const otherTopicWithQuesited = sanitizeKashfClientContext({ topicId: 'health', clientContext: { name: 'א', quesitedName: 'מישהו' } });
  assert(otherTopicWithQuesited.clientSafeContext.quesitedName === undefined, 'quesitedName לא נכנס כש-topicId אינו commerce');

  const commerceNoQuesited = sanitizeKashfClientContext({ topicId: 'commerce', clientContext: { name: 'א' } });
  assert(commerceNoQuesited.clientSafeContext.quesitedName === undefined, 'quesitedName לא נכנס כשאין ערך, גם ב-commerce');
}

// ── 8. clientHistorySummary נשאר advisor-only ──────────────────────────────
console.log('\n--- 8. clientHistorySummary ---');
{
  const summary = { total: 3, summaryHebrew: 'נמצאו 3 קריאות...' };
  const result = sanitizeKashfClientContext({ topicId: 'commerce', clientContext: { name: 'א' }, clientHistorySummary: summary });
  assert(result.clientSafeContext.clientHistorySummary === undefined, 'clientHistorySummary לא ב-clientSafeContext');
  assert(result.blockedContextFields.includes('clientHistorySummary'), 'clientHistorySummary ב-blockedContextFields');
  assert(result.advisorContextNotes.some(n => n.field === 'clientHistorySummary' && n.note === summary), 'clientHistorySummary מגיע advisor-only, כאובייקט המקורי');
  assert(!result.clientWordingAdjustments.some(a => JSON.stringify(a).includes('history')), 'clientHistorySummary לא-משפיע על clientWordingAdjustments בשלב הזה');
}

// ── 9. הפונקציה טהורה ───────────────────────────────────────────────────
console.log('\n--- 9. טוהר הפונקציה ---');
{
  const input = {
    topicId: 'commerce',
    clientContext: { name: 'א', workStatus: 'self', phone: '050', dynFields: { matter: 'x' } },
    clientHistorySummary: { total: 1 },
  };
  const inputSnapshotBefore = JSON.stringify(input);
  const r1 = sanitizeKashfClientContext(input);
  const r2 = sanitizeKashfClientContext(input);
  assert(JSON.stringify(r1) === JSON.stringify(r2), 'אותו input מחזיר אותו output (deep-equal)');
  assert(JSON.stringify(input) === inputSnapshotBefore, 'ה-input עצמו לא-שונה (אין side effects/mutation)');
}

// ── 10+11. חיבור-נכון-בהיקף-המצומצם + כל בדיקות-הרגרסיה הקודמות עדיין עוברות ──
// עודכן: kashf-commerce-smart-layer.js כן-מייבא את ה-sanitizer (שלב-החיבור
// המאושר, ראו commit נפרד) — narrative-writer.js/goral-app.js עדיין-לא,
// כפי שהיקף-השלב הזה דורש (commerce בלבד, לא narrative כללי, לא UI).
console.log('\n--- 10+11. חיבור-מצומצם-לcommerce-בלבד + רגרסיה ---');
{
  const fs = await import('node:fs');
  const narrativeWriterSrc = fs.readFileSync('./goral-hachol/engine/kashf-narrative-writer.js', 'utf8');
  const commerceLayerSrc = fs.readFileSync('./goral-hachol/engine/kashf-commerce-smart-layer.js', 'utf8');
  const goralAppSrc = fs.readFileSync('./goral-hachol/ui/goral-app.js', 'utf8');
  assert(!narrativeWriterSrc.includes('kashf-context-sanitizer'), 'kashf-narrative-writer.js לא-מייבא את ה-sanitizer (narrative כללי לא-נגע)');
  assert(commerceLayerSrc.includes('kashf-context-sanitizer'), 'kashf-commerce-smart-layer.js כן-מייבא את ה-sanitizer (חיבור מאושר, commerce בלבד)');
  assert(!goralAppSrc.includes('kashf-context-sanitizer'), 'goral-app.js לא-מייבא את ה-sanitizer — אין חיבור-UI/caller ישיר');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. kashf-context-sanitizer.js טהורה, phone/dynFields/maritalStatus/hasChildren חסומים כנדרש, workStatus/quesitedName רלוונטיים-בתנאי, מחוברת ל-commerce בלבד (לא ל-narrative-writer/goral-app.js).');
