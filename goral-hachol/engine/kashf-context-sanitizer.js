/**
 * kashf-context-sanitizer.js
 *
 * פונקציה טהורה: reading (clientContext + topicId + primaryFormula.sourceText +
 * clientHistorySummary אם-קיים) → 5 מבנים מבוקרים. לא נקראת משום מקום עדיין —
 * לא מחוברת ל-narrative-writer/commerce-smart-layer/goral-app.js. ראו
 * KASHF_SAFE_CONTEXT_USAGE_FOR_COMMERCE_PLAN.md.
 *
 * עקרון-על: context הוא מסנן/מתאם-ניסוח, לא מקור-מסקנה. maritalStatus/
 * hasChildren נשארים לא-רלוונטיים כברירת-מחדל שמרנית עד שיהיה ניתוח-שאלה
 * עתידי-מפורש שיודע לזהות סיכון-כספי/פרנסה/התחייבות — לא-מנוחש כאן.
 */

const KNOWN_NONSENSITIVE_DYNFIELD_IDS = new Set(['matter', 'newCity', 'yearForecast']);

function classifyWorkStatus(workStatus, topicId) {
  if (!workStatus) return { relevant: false, reason: 'לא הוזן סטטוס תעסוקתי' };
  if (topicId !== 'commerce') return { relevant: false, reason: 'לא רלוונטי לנושא הנוכחי' };
  if (workStatus === 'self') return { relevant: true, reason: 'עצמאי — רלוונטי-ישיר לשאלת-מסחר' };
  if (workStatus === 'employed') return { relevant: true, reason: 'שכיר — רלוונטי-בזהירות, אין להניח בעלות-עסק' };
  if (workStatus === 'unemployed') return { relevant: true, reason: 'מובטל — רלוונטי-לזהירות/סיכון' };
  if (workStatus === 'retired') return { relevant: true, reason: 'בפנסיה — רלוונטי-חלקי' };
  return { relevant: false, reason: 'ערך לא-מוכר' };
}

function classifyQuesitedName(quesitedName, topicId) {
  if (!quesitedName) return { relevant: false, reason: 'לא הוזן שם-נישאל' };
  if (topicId !== 'commerce') return { relevant: false, reason: 'לא רלוונטי לנושא הנוכחי' };
  return { relevant: true, reason: 'הוזן במפורש בהקשר-עסקה (קונה/מוכר/שותף)' };
}

function classifyDynFields(dynFields) {
  const keys = Object.keys(dynFields || {});
  if (!keys.length) return { relevant: false, reason: 'לא הוזנו שדות-דינמיים', hasContent: false };
  return { relevant: true, reason: `הוזנו ${keys.length} שדה/שדות-דינמיים (${keys.join(', ')})`, hasContent: true };
}

export function sanitizeKashfClientContext(reading) {
  const ctx = reading?.clientContext || {};
  const topicId = reading?.topicId || null;
  const sourceText = reading?.primaryFormula?.sourceText || null;
  const clientHistorySummary = reading?.clientHistorySummary || null;

  const advisorContextNotes = [];
  const clientSafeContext = {};
  const contextRelevance = {};
  const clientWordingAdjustments = [];
  const blockedContextFields = [];

  if (ctx.name) clientSafeContext.name = ctx.name;
  if (ctx.question) clientSafeContext.question = ctx.question;

  if (ctx.gender) {
    clientSafeContext.gender = ctx.gender;
    contextRelevance.gender = { relevant: true, reason: 'צורת פנייה בלבד' };
  }

  // age טרם מיושם באפליקציה (שלב-age הוחזר במלואו) — לא-חלק-מהתוכנית-הזו.
  contextRelevance.age = { relevant: false, reason: 'שדה age טרם מיושם באפליקציה' };

  // phone — חסום תמיד, מבני, בלי-תלות-בערך.
  blockedContextFields.push('phone');
  if (ctx.phone) advisorContextNotes.push({ field: 'phone', note: ctx.phone });

  // parentName — זיהוי/הקשר בלבד, לא לניסוח-ללקוח כברירת-מחדל.
  contextRelevance.parentName = { relevant: false, reason: 'משמש לזיהוי/הקשר בלבד, לא לניסוח' };
  blockedContextFields.push('parentName');
  if (ctx.parentName) advisorContextNotes.push({ field: 'parentName', note: ctx.parentName });

  // maritalStatus / hasChildren — ברירת-מחדל שמרנית (ראו הערת-הכותרת).
  for (const field of ['maritalStatus', 'hasChildren']) {
    contextRelevance[field] = {
      relevant: false,
      reason: 'לא ניתן לקבוע רלוונטיות-לשאלה אוטומטית בשלב הזה — ברירת-מחדל שמרנית',
    };
    blockedContextFields.push(field);
    if (ctx[field]) advisorContextNotes.push({ field, note: ctx[field] });
  }

  // workStatus — רלוונטי ל-commerce בלבד, עם התאמות-ניסוח-זהירות.
  {
    const rel = classifyWorkStatus(ctx.workStatus, topicId);
    contextRelevance.workStatus = rel;
    if (rel.relevant) {
      clientSafeContext.workStatus = ctx.workStatus;
      if (ctx.workStatus === 'self') {
        clientWordingAdjustments.push({ type: 'business-context-allowed', note: 'ניתן להתייחס להכנסה/לקוחות/תזרים כהקשר-רלוונטי' });
      } else if (ctx.workStatus === 'employed') {
        clientWordingAdjustments.push({ type: 'caution-no-business-assumption', note: 'אין להניח שיש ללקוח עסק קיים — הוא שכיר' });
      } else if (ctx.workStatus === 'unemployed') {
        clientWordingAdjustments.push({ type: 'caution-financial-risk', note: 'להדגיש-זהירות וסיכון בטון-הניסוח' });
      }
    } else {
      blockedContextFields.push('workStatus');
      if (ctx.workStatus) advisorContextNotes.push({ field: 'workStatus', note: ctx.workStatus });
    }
  }

  // quesitedName — רק אם חלק-ברור-מהקשר-עסקה.
  {
    const rel = classifyQuesitedName(ctx.quesitedName, topicId);
    contextRelevance.quesitedName = rel;
    if (rel.relevant) {
      clientSafeContext.quesitedName = ctx.quesitedName;
    } else {
      blockedContextFields.push('quesitedName');
      if (ctx.quesitedName) advisorContextNotes.push({ field: 'quesitedName', note: ctx.quesitedName });
    }
  }

  // dynFields — לעולם לא-מצוטט ל-clientSafeContext; רק סימון-רלוונטיות (לפי שמות-שדה
  // בלבד, לא תוכן) + ניתוב תוכן ל-advisorContextNotes בלבד.
  {
    const rel = classifyDynFields(ctx.dynFields);
    contextRelevance.dynFields = rel;
    blockedContextFields.push('dynFields');
    for (const [id, value] of Object.entries(ctx.dynFields || {})) {
      advisorContextNotes.push({
        field: `dynFields.${id}`,
        note: value,
        sensitive: !KNOWN_NONSENSITIVE_DYNFIELD_IDS.has(id),
      });
    }
  }

  // sourceText — advisor-only תמיד, אם-קיים.
  if (sourceText) {
    blockedContextFields.push('sourceText');
    advisorContextNotes.push({ field: 'sourceText', note: sourceText });
  }

  // clientHistorySummary — advisor-only תמיד, אם-קיים; לא-משפיע-על clientWordingAdjustments בשלב הזה.
  if (clientHistorySummary) {
    blockedContextFields.push('clientHistorySummary');
    advisorContextNotes.push({ field: 'clientHistorySummary', note: clientHistorySummary });
  }

  return {
    advisorContextNotes,
    clientSafeContext,
    contextRelevance,
    clientWordingAdjustments,
    blockedContextFields,
  };
}

export default { sanitizeKashfClientContext };

if (typeof module !== 'undefined') {
  module.exports = { sanitizeKashfClientContext };
}
