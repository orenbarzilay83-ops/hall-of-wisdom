const _uid = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('userId')) || 'local';
const STORAGE_KEY = `goralHacholClientReadingsArchive_v1_${_uid}`;

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return `goral-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeClientName(clientContext = {}) {
  return String(clientContext.clientName || clientContext.name || '').trim() || 'לקוח ללא שם';
}

export function getGoralArchive() {
  if (typeof localStorage === 'undefined') return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  const data = safeJsonParse(raw, []);

  return Array.isArray(data) ? data : [];
}

export function saveGoralReadingToArchive(reading, interpretation) {
  if (typeof localStorage === 'undefined') {
    return { ok: false, reason: 'localStorage unavailable' };
  }

  const archive = getGoralArchive();
  const clientContext = reading?.clientContext || {};

  const record = {
    id: makeId(),
    createdAt: nowIso(),
    method: 'hawi',
    clientName: normalizeClientName(clientContext),
    clientContext,
    question: reading?.question || '',
    topicHebrew: interpretation?.topicHebrew || reading?.topic?.hebrew || '',
    topicId: interpretation?.topicId || reading?.topic?.id || '',
    focusHouseNumber: reading?.focusHouseNumber || interpretation?.boardAnalysis?.focusHouseNumber || null,
    conclusion: interpretation?.finalConclusionHebrew || interpretation?.conclusionDraftHebrew || '',
    spiritualDiagnosis: interpretation?.spiritualDiagnosis || null,
    boardScore: interpretation?.boardScore || null,
    chart: reading?.chart || [],
    interpretation,
  };

  archive.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(archive));

  return { ok: true, record, total: archive.length };
}

// שמירת קריאת כשף אל-אסרר לארכיון (מקבילה ל-saveGoralReadingToArchive, אך
// מותאמת למבנה-השונה-לגמרי של kashfReading — ראו KASHF_CONTEXT_COLLECTOR_IMPLEMENTATION_PLAN.md §4).
// לא נוגעת בחישוב הכשף עצמו — רק קוראת מהתוצאה הקיימת ושומרת תמצית.
export function saveKashfReadingToArchive(kashfReading) {
  if (typeof localStorage === 'undefined') {
    return { ok: false, reason: 'localStorage unavailable' };
  }
  if (!kashfReading || !kashfReading.valid) {
    return { ok: false, reason: 'invalid kashf reading' };
  }

  const archive = getGoralArchive();
  const clientContext = kashfReading.clientContext || {};

  const record = {
    id: makeId(),
    createdAt: nowIso(),
    method: 'kashf',
    clientName: normalizeClientName(clientContext),
    clientContext,
    question: clientContext.question || '',
    topicHebrew: kashfReading.topicHebrewName || '',
    topicId: kashfReading.topicId || '',
    focusHouseNumber: null,
    conclusion: kashfReading.commerceSmartLayer?.clientWording || kashfReading.primaryFormula?.verdict?.text || '',
    spiritualDiagnosis: null,
    boardScore: null,
    chart: [],
    interpretation: null,
  };

  archive.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(archive));

  return { ok: true, record, total: archive.length };
}

// The supplemental spiritual reading has its own source and cannot be stored
// as a Kashf or Hawi verdict. Preserve the board and individual book evidence.
export function saveQawlSpiritualReadingToArchive(reading, qawlReading) {
  if (typeof localStorage === 'undefined') return { ok: false, reason: 'localStorage unavailable' };
  if (!qawlReading?.valid || qawlReading.sourceVolume !== 'al-qawl-al-jami') {
    return { ok: false, reason: 'invalid al-Qawl reading' };
  }
  const archive = getGoralArchive();
  const clientContext = reading?.clientContext || {};
  const evidence = [
    qawlReading.isqatEvidence?.text,
    ...(qawlReading.directEvidence || []).map(e => e.text),
    qawlReading.jinnTypeEvidence?.text,
    qawlReading.qarinEvidence?.text,
  ].filter(Boolean);
  const record = {
    id: makeId(), createdAt: nowIso(), method: 'qawl',
    clientName: normalizeClientName(clientContext), clientContext,
    question: reading?.question || clientContext.question || '',
    topicHebrew: 'בדיקה רוחנית — אל־קול אל־ג׳אמיע', topicId: 'spiritualDiagnostics',
    focusHouseNumber: null,
    conclusion: evidence.length ? evidence.join('\n') : 'לא נמצאה עדות מפורשת בכללים שנבדקו; אין בכך פסק שאין פגיעה.',
    spiritualDiagnosis: { ...qawlReading, verdict: null }, boardScore: null,
    chart: reading?.chart || [], interpretation: null,
  };
  archive.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(archive));
  return { ok: true, record, total: archive.length };
}

export function deleteGoralArchiveRecord(id) {
  if (typeof localStorage === 'undefined') return { ok: false };

  const archive = getGoralArchive();
  const next = archive.filter((item) => item.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return { ok: true, total: next.length };
}

export function clearGoralArchive() {
  if (typeof localStorage === 'undefined') return { ok: false };

  localStorage.removeItem(STORAGE_KEY);
  return { ok: true };
}

// method: undefined/'hawi' (ברירת-מחדל, שומר על ההתנהגות הקיימת של חאווי
// ומתעלם משקט מקריאות-כשף כדי לא לשנות את הנרטיב הקיים), 'kashf', או 'all'.
// רשומות ישנות בלי method מטופלות כ-'hawi' (fallback).
export function getGoralClientHistory(clientName, method) {
  const name = String(clientName || '').trim();

  if (!name) return [];

  const matches = getGoralArchive().filter((item) =>
    String(item.clientName || '').trim() === name
  );

  if (method === 'all') return matches;

  const wantMethod = method || 'hawi';
  return matches.filter((item) => (item.method || 'hawi') === wantMethod);
}

export function summarizeGoralClientHistory(clientName, method) {
  const history = getGoralClientHistory(clientName, method);

  if (!history.length) {
    return {
      clientName,
      total: 0,
      summaryHebrew: 'אין עדיין קריאות קודמות ללקוח זה.',
      repeatedTopics: [],
      repeatedSpiritualFlags: [],
    };
  }

  const topicCounts = {};
  const spiritualCounts = {};

  for (const item of history) {
    if (item.topicHebrew) {
      topicCounts[item.topicHebrew] = (topicCounts[item.topicHebrew] || 0) + 1;
    }

    const grade = item.spiritualDiagnosis?.grade;
    if (grade) {
      spiritualCounts[grade] = (spiritualCounts[grade] || 0) + 1;
    }
  }

  const repeatedTopics = Object.entries(topicCounts)
    .filter(([, count]) => count > 1)
    .map(([topic, count]) => ({ topic, count }));

  const repeatedSpiritualFlags = Object.entries(spiritualCounts)
    .filter(([, count]) => count > 1)
    .map(([grade, count]) => ({ grade, count }));

  return {
    clientName,
    total: history.length,
    repeatedTopics,
    repeatedSpiritualFlags,
    summaryHebrew:
      history.length === 1
        ? 'נמצאה קריאה קודמת אחת ללקוח זה. אפשר להשוות בזהירות את הנושא, הדיין והמסקנה.'
        : `נמצאו ${history.length} קריאות קודמות ללקוח זה. כדאי לבדוק דפוסים חוזרים בנושאים, בבית המרכזי, בדיין ובאבחון הרוחני.`,
  };
}

export default {
  getGoralArchive,
  saveGoralReadingToArchive,
  saveKashfReadingToArchive,
  saveQawlSpiritualReadingToArchive,
  deleteGoralArchiveRecord,
  clearGoralArchive,
  getGoralClientHistory,
  summarizeGoralClientHistory,
};

if (typeof module !== 'undefined') {
  module.exports = {
    getGoralArchive,
    saveGoralReadingToArchive,
    saveKashfReadingToArchive,
    saveQawlSpiritualReadingToArchive,
    deleteGoralArchiveRecord,
    clearGoralArchive,
    getGoralClientHistory,
    summarizeGoralClientHistory,
  };
}
