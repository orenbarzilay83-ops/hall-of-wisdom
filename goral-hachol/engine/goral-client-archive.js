const STORAGE_KEY = 'goralHacholClientReadingsArchive_v1';

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
  return String(clientContext.clientName || '').trim() || 'לקוח ללא שם';
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

export function getGoralClientHistory(clientName) {
  const name = String(clientName || '').trim();

  if (!name) return [];

  return getGoralArchive().filter((item) =>
    String(item.clientName || '').trim() === name
  );
}

export function summarizeGoralClientHistory(clientName) {
  const history = getGoralClientHistory(clientName);

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
  deleteGoralArchiveRecord,
  clearGoralArchive,
  getGoralClientHistory,
  summarizeGoralClientHistory,
};

if (typeof module !== 'undefined') {
  module.exports = {
    getGoralArchive,
    saveGoralReadingToArchive,
    deleteGoralArchiveRecord,
    clearGoralArchive,
    getGoralClientHistory,
    summarizeGoralClientHistory,
  };
}
