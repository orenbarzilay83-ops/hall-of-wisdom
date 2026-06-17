/**
 * kashf-book-reader.js
 *
 * שולף טקסט רלוונטי מספר כשף-אל-אסראר לפי נושא שאלה.
 *
 * שער שישי (עמ׳ 166–276): 12 פרקים — כל פרק מכסה בית ונושאיו.
 * מקור: כשף אל-אסראר, תוכן עניינים עמ׳ 277 + Drive ID 1SZ3rxN2AKLeD8ExRoToj67WKr6DIViZR
 */

import { KASHF_AL_ASRAR_PAGES } from '../data/sources/kashf-al-asrar/kashf-al-asrar-book.js';

// ── שער שישי — טווחי עמודים לפי בית ──────────────────────────────────────────
// מקור: תוכן עניינים כשף אל-אסראר, עמ׳ 277
const HOUSE_PAGE_RANGES = {
  1:  { pageStart: 166, pageEnd: 178, topicArabic: 'النفس',    topicHebrew: 'הנפש — השואל' },
  2:  { pageStart: 179, pageEnd: 181, topicArabic: 'المال',    topicHebrew: 'הממון' },
  3:  { pageStart: 182, pageEnd: 183, topicArabic: 'الأخوة',   topicHebrew: 'האחים / תנועה' },
  4:  { pageStart: 184, pageEnd: 190, topicArabic: 'الآباء',   topicHebrew: 'האבות, נכסים, נסתרות' },
  5:  { pageStart: 191, pageEnd: 195, topicArabic: 'الأولاد',  topicHebrew: 'ילדים, הריון' },
  // עמוד 196 = סיום פרק 5 + פתיחת פרק 6 — תוכן מעורב. פרק 6 האמיתי מתחיל בעמוד 197.
  6:  { pageStart: 196, firstContentPage: 197, pageEnd: 203, topicArabic: 'المريض',   topicHebrew: 'החולה, אבוד, בהמות' },
  // עמוד 204 = סיום פרק 6 (קבורה) + פתיחת פרק 7 — תוכן מעורב. פרק 7 האמיתי מתחיל בעמוד 205.
  7:  { pageStart: 204, firstContentPage: 205, pageEnd: 223, topicArabic: 'التزويج',  topicHebrew: 'נישואין, גובר/נגבר, קנייה/מכירה' },
  8:  { pageStart: 224, pageEnd: 234, topicArabic: 'السرقة',   topicHebrew: 'גנבה, הלוואה' },
  9:  { pageStart: 236, pageEnd: 255, topicArabic: 'السفر',    topicHebrew: 'נסיעה, נעדר, אבוד, חלום, דת' },
  10: { pageStart: 256, pageEnd: 262, topicArabic: 'السلطان',  topicHebrew: 'כבוד, שלטון, משך שררות' },
  11: { pageStart: 263, pageEnd: 270, topicArabic: 'الأصدقاء', topicHebrew: 'חברים, תקווה, אורך חיים, אהבה' },
  12: { pageStart: 271, pageEnd: 276, topicArabic: 'الأعداء',  topicHebrew: 'אויבים, כלואים' },
};

// ── מיפוי נושא → בית ראשי בשער השישי ────────────────────────────────────────
const TOPIC_TO_HOUSE = {
  foundations:          1,
  birthNativity:        1,
  completion:           1,
  generalReading:       1,
  commerce:             2,
  deathInheritance:     8,
  siblings:             3,
  hiddenTreasure:       4,
  childrenPregnancy:    5,
  prisoner:             12,
  illness:              6,
  spiritualDiagnostics: 6,
  marriage:             7,
  theft:                8,
  travel:               9,
  missingPerson:        9,
  seaVoyage:            9,
  authorityState:       10,
  yearlyForecast:       10,
  loveHate:             11,
  fear:                 12,
};

// מנקה מרקדאון בסיסי מהתרגום ומקצר לתצוגה
function excerptTranslation(text, maxLength = 500) {
  if (!text) return '';
  const lines = text.split('\n').filter((ln) => {
    const t = ln.trim();
    if (!t) return true; // שמור שורות ריקות לעיבוד ה-replace מאוחר יותר
    // הסר כותרות מרקדאון (### כותרת) — מסיר את כל השורה, לא רק את ה-#
    if (/^#{1,6}\s/.test(t)) return false;
    // הסר שורות מטא-דאטה [נכּתה... עמוד X]
    if (/^\*?\*?\[.*עמוד\s+\d/.test(t)) return false;
    // הסר שורות ציטוט מיותמות שמסתיימות ב-"
    if (t.endsWith('"') && t.length < 120) return false;
    // הסר שורות טבלה
    if (/^\|/.test(t)) return false;
    // הסר שורות המשך/ניווט שאינן משפטים שלמים
    if (/^המשך\s*[—–-]/.test(t)) return false;
    // הסר שורות כותרת שמסתיימות ב-: (תוויות סעיף, לא תוכן אמיתי)
    if (t.endsWith(':') && t.length < 100 && !t.includes('•')) return false;
    // הסר שורות חוק חץ (כלל תנאי מהספר) — לא מיועדות למסקנה
    if (t.includes(' → ') && t.length < 80) return false;
    // הסר שורות כלל-קצרות (כותרות בלבד) ללא פסוק שלם
    if (t.length < 20 && !t.includes('.') && !t.includes(',') && !/^•/.test(t)) return false;
    // הסר שורות ערבית טהורה
    if (/^[؀-ۿ\s().,،:؛؟!]+$/.test(t)) return false;
    if ((t.match(/[؀-ۿ]/g) || []).length / t.length > 0.4) return false;
    return true;
  });
  const cleaned = lines.join('\n')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\|[^\n]*\|/g, '')      // הסרת שורות טבלה שנשארו
    .replace(/^---+\s*$/gm, '')      // הסרת קווי הפרדה
    .replace(/^[-–—]{2,}\s*$/gm, '') // הסרת קווים כפולים
    .replace(/^-\s+/gm, '• ')        // רשימות סימן מינוס → נקודה
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return cleaned.length <= maxLength
    ? cleaned
    : cleaned.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/**
 * מחזיר תובנה מכשף אל-אסראר שער שישי עבור נושא שאלה.
 *
 * @param {string} topicId
 * @returns {{ house, topicId, chapterHebrew, pages, firstExcerpt, sourceRef }|null}
 */
export function getKashfBookInsight(topicId) {
  const houseNum = TOPIC_TO_HOUSE[topicId];
  if (!houseNum) return null;

  const range = HOUSE_PAGE_RANGES[houseNum];
  if (!range) return null;

  // אם פרק זה מתחיל בעמוד גבול (תוכן מעורב מהפרק הקודם) — דלג לעמוד הראשון הנקי
  const contentStart = range.firstContentPage ?? range.pageStart;

  const pages = KASHF_AL_ASRAR_PAGES
    .filter(
      (p) =>
        p.page >= contentStart &&
        p.page <= range.pageEnd &&
        p.sourceStatus === 'explicit-in-source' &&
        p.hebrewTranslation
    )
    .slice(0, 2);

  if (!pages.length) return null;

  return {
    house:          houseNum,
    topicId,
    chapterHebrew:  range.topicHebrew,
    pages: pages.map((p) => ({
      page:         p.page,
      chapterLabel: p.chapterHebrew || '',
      excerpt:      excerptTranslation(p.hebrewTranslation),
    })),
    firstExcerpt:   excerptTranslation(pages[0].hebrewTranslation),
    sourceRef:      `כשף אל-אסראר — שער שישי, פרק ${houseNum}: ${range.topicHebrew} (עמ׳ ${range.pageStart}–${range.pageEnd})`,
  };
}

export default { getKashfBookInsight };
