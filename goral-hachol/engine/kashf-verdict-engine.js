/**
 * kashf-verdict-engine.js
 *
 * מנוע הפסיקה של כשף-אל-אסראר.
 *
 * השלד — שלב 1 מתוך 6 בארכיטקטורה הנכונה:
 *   1. [קיים] בניית לוח — raml-board-generator.js
 *   2. [קיים] סיווג שאלה — hawi-interpreter.js → TOPIC_MAIN_HOUSES
 *   3. [קיים] הולדת צורות — raml-figures.js::combineRamlPatterns
 *   4. [חדש]  סיווג צורה — kashf-figure-classifier.js
 *   5. [חדש]  פסיקה ← קובץ זה
 *   6. [קיים] נרטיב — goral-conclusion-writer.js (עדיין עצמאי)
 *
 * קובץ זה אינו מחליף שום מנוע קיים.
 * ממשק היצוא: getKashfVerdict(topicId, board) → { verdict, classification, ... }
 */

import { combineRamlPatterns } from './raml-figures.js';
import { classifyFigure }      from './kashf-figure-classifier.js';
import {
  getChapterForTopic,
  VERDICT_TEMPLATES,
} from '../data/sources/kashf-al-asrar/kashf-chapter-map.js';

/**
 * שולף צורה מהלוח לפי מספר בית.
 * board.entries הוא המערך הנכון ב-raml-board-generator.js.
 * @param {object} board
 * @param {number} houseNumber
 * @returns {string|null} pattern
 */
function getHousePattern(board, houseNumber) {
  const entry = (board?.entries || board?.chart || []).find(
    (h) => Number(h.house) === Number(houseNumber)
  );
  return entry?.pattern || null;
}

/**
 * גוזר את צורת-הפסיקה מהבתים הרלוונטיים.
 * @param {object} board
 * @param {number[]} verdictHouses - [bX, bY]  (בדרך כלל [1, K])
 * @returns {{ pattern: string, sourceHousePatterns: string[] }|null}
 */
function deriveVerdictFigure(board, verdictHouses) {
  const patterns = verdictHouses.map((h) => getHousePattern(board, h));
  if (patterns.some((p) => !p)) return null;

  const combined = patterns.reduce((acc, p) =>
    acc ? combineRamlPatterns(acc, p) : p
  , null);

  return { pattern: combined, sourceHousePatterns: patterns };
}

/**
 * בונה טקסט פסיקה עברי מהסיווג ומתבנית הנושא.
 * @param {object} classification - { dakhalKharij, saadNahs }
 * @param {string} verdictType
 * @returns {string}
 */
function buildVerdictHebrew(classification, verdictType) {
  const template = VERDICT_TEMPLATES[verdictType];
  if (!template) return '';

  const { dakhalKharij, saadNahs } = classification;
  const row = template[dakhalKharij]
           || template['mujassad-kharij']  // fallback לכל mujassad
           || null;
  if (!row) return '';

  const quality = (saadNahs === 'saad') ? 'saad'
                : (saadNahs === 'nahs') ? 'nahs'
                : 'mixed';
  return row[quality] || row['mixed'] || '';
}

/**
 * מנוע הפסיקה הראשי של כשף-אל-אסראר.
 *
 * @param {string} topicId  - מזהה הנושא (תואם TOPIC_MAIN_HOUSES)
 * @param {object} board    - לוח גורל שנבנה ע"י raml-board-generator.js
 * @returns {object|null}
 *   {
 *     topicId, kashfChapter, chapterNameHebrew,
 *     verdictHouses,        // [bX, bY] - הבתים שנבדקו
 *     verdictFigurePattern, // הצורה הנגזרת
 *     classification,       // { dakhalKharij, saadNahs, ... }
 *     verdictHebrew,        // משפט פסיקה בעברית
 *     confidence,           // 'explicit' | 'derived' | 'todo'
 *     sourceRef,
 *   }
 */
export function getKashfVerdict(topicId, board) {
  const chapter = getChapterForTopic(topicId);
  if (!chapter) return null;

  const derived = deriveVerdictFigure(board, chapter.verdictHouses);
  if (!derived) return null;

  const classification = classifyFigure(derived.pattern);
  const verdictHebrew  = buildVerdictHebrew(classification, chapter.verdictType);

  return {
    topicId,
    kashfChapter:        chapter.kashfChapter,
    chapterNameHebrew:   chapter.chapterNameHebrew,
    verdictHouses:       chapter.verdictHouses,
    sourceHousePatterns: derived.sourceHousePatterns,
    verdictFigurePattern: derived.pattern,
    classification,
    verdictHebrew,
    confidence:  chapter.confidence,
    sourceRef:   chapter.sourceRef,
  };
}

/**
 * בדיקת תקינות — האם הנושא מכוסה בשיטת כשף-אל-אסראר.
 * @param {string} topicId
 * @returns {boolean}
 */
export function isKashfTopicSupported(topicId) {
  return Boolean(getChapterForTopic(topicId));
}

export default { getKashfVerdict, isKashfTopicSupported };
