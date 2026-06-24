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
  3:  { pageStart: 182, firstContentPage: 183, pageEnd: 183, topicArabic: 'الأخوة',   topicHebrew: 'האחים / תנועה' },
  4:  { pageStart: 184, firstContentPage: 185, pageEnd: 190, topicArabic: 'الآباء',   topicHebrew: 'האבות, נכסים, נסתרות' },
  5:  { pageStart: 191, firstContentPage: 192, pageEnd: 195, topicArabic: 'الأولاد',  topicHebrew: 'ילדים, הריון' },
  // עמוד 196 = סיום פרק 5 + פתיחת פרק 6 — תוכן מעורב. פרק 6 האמיתי מתחיל בעמוד 197.
  6:  { pageStart: 196, firstContentPage: 197, pageEnd: 203, topicArabic: 'المريض',   topicHebrew: 'החולה, אבוד, בהמות' },
  // עמוד 204 = סיום פרק 6 (קבורה) + פתיחת פרק 7 — תוכן מעורב. פרק 7 האמיתי מתחיל בעמוד 205.
  7:  { pageStart: 204, firstContentPage: 205, pageEnd: 223, topicArabic: 'التزويج',  topicHebrew: 'נישואין, גובר/נגבר, קנייה/מכירה' },
  8:  { pageStart: 224, pageEnd: 234, topicArabic: 'السرقة',   topicHebrew: 'גנבה, הלוואה' },
  // עמוד 236 = סוף פרק 8 (מוות/ירושה). פרק 9 האמיתי מתחיל בעמוד 237.
  9:  { pageStart: 236, firstContentPage: 237, pageEnd: 255, topicArabic: 'السفر',    topicHebrew: 'נסיעה, נעדר, אבוד, חלום, דת' },
  10: { pageStart: 256, pageEnd: 262, topicArabic: 'السلطان',  topicHebrew: 'כבוד, שלטון, משך שררות' },
  // עמוד 263 = סיום דיני מלכים + פתיחת פרק 11. פרק 11 הנקי מתחיל בעמוד 264.
  11: { pageStart: 263, firstContentPage: 264, pageEnd: 270, topicArabic: 'الأصدقاء', topicHebrew: 'חברים, תקווה, אורך חיים, אהבה' },
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

// מנקה את הטקסט ומקצר לתצוגה (תרגום v5 — טקסט נקי ללא markdown)
function excerptTranslation(text, maxLength = 1000) {
  if (!text) return '';
  const cleaned = text
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
    .slice(0, 3);

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
