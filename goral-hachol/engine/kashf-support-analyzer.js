/**
 * kashf-support-analyzer.js
 *
 * Layer 5: ניתוח תמיכה — עדים, דיין, עאקבה, דמיר
 *
 * מקבל לוח + פסיקה ראשית (מ-kashf-verdict-engine) →
 * מחזיר: האם הכוחות תומכים? מה ההכרעה הסופית? מה הגורם הנסתר?
 *
 * לא מחליף שום מנוע קיים. additive בלבד.
 */

import { classifyFigure } from './kashf-figure-classifier.js';

// עץ ההורים לגזירת הלוח (לשיטת מיזאן לדמיר)
const PARENT_PAIRS = {
  9:  [1, 2],
  10: [3, 4],
  11: [5, 6],
  12: [7, 8],
  13: [9, 10],
  14: [11, 12],
  15: [13, 14],
};

function getHouseEntry(board, houseNumber) {
  return (board?.entries || board?.chart || []).find(
    (h) => Number(h.house) === Number(houseNumber)
  ) || null;
}

function getPattern(board, houseNumber) {
  return getHouseEntry(board, houseNumber)?.pattern || null;
}

// ─── דמיר שיטה 1: אלכסון האמהות ─────────────────────────────────────────────
// מכל אמא i (i=1..4) לוקחים את שורה i-1 (אש/אוויר/מים/אדמה)
// 4 הסיביות יוצרות תבנית → מחפשים אותה על הלוח
function computeDhamirDiagonal(board) {
  const rows = [];
  for (let i = 1; i <= 4; i++) {
    const p = getPattern(board, i);
    if (!p) return null;
    rows.push(p[i - 1]);
  }
  const targetPattern = rows.join('');
  const allHouses = (board?.entries || board?.chart || [])
    .map(h => ({ house: h.house, pattern: h.pattern, name: h.hebrewName }));
  const found = allHouses.find((h) => h.pattern === targetPattern);
  if (!found) return null;
  return {
    method:      'diagonal',
    methodHebrew:'שיטת אלכסון האמהות',
    pattern:     targetPattern,
    houseNumber: Number(found.house),
    nameHebrew:  found.name || targetPattern,
  };
}

// ─── דמיר שיטה 2: תסיירת המיזאן ─────────────────────────────────────────────
// מהדיין (ב15) — לכל שורה שהיא '1' בצורת הדיין
// עוקב אחורה בעץ ההורים עד לאמא/בת (ב1–ב8)
function traceToSource(board, houseNum, rowIndex) {
  if (houseNum <= 8) return houseNum;
  const [left, right] = PARENT_PAIRS[houseNum] || [];
  if (!left) return null;
  if (getPattern(board, left)?.[rowIndex]  === '1') return traceToSource(board, left,  rowIndex);
  if (getPattern(board, right)?.[rowIndex] === '1') return traceToSource(board, right, rowIndex);
  return null;
}

function computeDhamirMizan(board) {
  const judgePattern = getPattern(board, 15);
  if (!judgePattern) return null;

  for (let r = 0; r < 4; r++) {
    if (judgePattern[r] !== '1') continue;
    const sourceHouse = traceToSource(board, 15, r);
    if (!sourceHouse) continue;
    const entry = getHouseEntry(board, sourceHouse);
    if (!entry) continue;
    return {
      method:      'mizan',
      methodHebrew:'שיטת תסיירת המיזאן',
      pattern:     entry.pattern,
      houseNumber: sourceHouse,
      nameHebrew:  entry.hebrewName || entry.pattern,
      tracedRow:   r,
    };
  }
  return null;
}

// ─── ניתוח בית יחיד ──────────────────────────────────────────────────────────
function analyzeHouse(board, houseNumber, roleHebrew) {
  const entry = getHouseEntry(board, houseNumber);
  if (!entry) return null;
  const classification = classifyFigure(entry.pattern);
  return {
    houseNumber,
    roleHebrew,
    pattern:              entry.pattern,
    nameHebrew:           entry.hebrewName || entry.pattern,
    dakhalKharij:         classification.dakhalKharij,
    saadNahs:             classification.saadNahs,
    dakhalKharijHebrew:   classification.dakhalKharijHebrew,
    saadNahsHebrew:       classification.saadNahsHebrew,
  };
}

// ─── האם עד/דיין מסכים עם הפסיקה הראשית? ────────────────────────────────────
// "מסכים" = שניהם כיוון אחד (שניהם יוצאים או שניהם נכנסים)
// mujassad = ניטרלי (לא מאשר ולא סותר)
function agreesWithVerdict(houseClassification, verdictDakhalKharij) {
  const h = houseClassification?.dakhalKharij;
  const v = verdictDakhalKharij;
  if (!h || !v) return 'neutral';
  const hDir = h.startsWith('kharij') ? 'kharij' : h.startsWith('dakhil') ? 'dakhil' : 'mujassad';
  const vDir = v.startsWith('kharij') ? 'kharij' : v.startsWith('dakhil') ? 'dakhil' : 'mujassad';
  if (vDir === 'mujassad' || hDir === 'mujassad') return 'neutral';
  return hDir === vDir ? 'confirms' : 'contradicts';
}

function agreementHebrew(agreement) {
  return {
    confirms:    'מחזק את הפסיקה',
    contradicts: 'סותר את הפסיקה',
    neutral:     'ניטרלי',
  }[agreement] || '';
}

// ─── רמת ביטחון כוללת ────────────────────────────────────────────────────────
function computeConfidence(verdictDK, w13, w14, judge) {
  const checks = [w13, w14, judge].map((h) => agreesWithVerdict(h, verdictDK));
  const confirms    = checks.filter((c) => c === 'confirms').length;
  const contradicts = checks.filter((c) => c === 'contradicts').length;

  let level, labelHebrew;
  if (confirms === 3)                        { level = 'very-strong'; labelHebrew = 'פסיקה חזקה מאוד — שלושת הכוחות תומכים'; }
  else if (confirms === 2 && contradicts === 0) { level = 'strong';    labelHebrew = 'פסיקה חזקה — רוב הכוחות תומכים'; }
  else if (confirms >= 1 && contradicts === 0)  { level = 'moderate';  labelHebrew = 'פסיקה בינונית — יש תמיכה חלקית'; }
  else if (confirms > 0 && contradicts > 0)     { level = 'mixed';     labelHebrew = 'פסיקה מעורבת — כוחות נגד כוחות'; }
  else if (contradicts >= 2)                    { level = 'weak';      labelHebrew = 'פסיקה חלשה — רוב הכוחות מתנגדים'; }
  else                                          { level = 'neutral';   labelHebrew = 'פסיקה ניטרלית — הכוחות בלתי-מוכרעים'; }

  return { level, labelHebrew, confirms, contradicts };
}

// ─── סיכום עברי ──────────────────────────────────────────────────────────────
function buildSupportSummary(primaryVerdict, w13, w14, judge, sentence, dhamir, confidence) {
  const lines = [];

  lines.push(`**פסיקה ראשית:** ${primaryVerdict?.verdictHebrew || ''}`);
  lines.push('');

  lines.push('**שכבת תמיכה:**');

  if (w13) {
    const ag = agreesWithVerdict(w13, primaryVerdict?.classification?.dakhalKharij);
    lines.push(`• עד ימין (ב13 — ${w13.nameHebrew}): ${w13.dakhalKharijHebrew} | ${w13.saadNahsHebrew} — ${agreementHebrew(ag)}`);
  }
  if (w14) {
    const ag = agreesWithVerdict(w14, primaryVerdict?.classification?.dakhalKharij);
    lines.push(`• עד שמאל (ב14 — ${w14.nameHebrew}): ${w14.dakhalKharijHebrew} | ${w14.saadNahsHebrew} — ${agreementHebrew(ag)}`);
  }
  if (judge) {
    const ag = agreesWithVerdict(judge, primaryVerdict?.classification?.dakhalKharij);
    lines.push(`• דיין (ב15 — ${judge.nameHebrew}): ${judge.dakhalKharijHebrew} | ${judge.saadNahsHebrew} — ${agreementHebrew(ag)}`);
  }
  if (sentence) {
    lines.push(`• עאקבה (ב16 — ${sentence.nameHebrew}): ${sentence.dakhalKharijHebrew} | ${sentence.saadNahsHebrew}`);
  }

  lines.push('');
  lines.push(`**הכרעה:** ${confidence.labelHebrew}`);

  if (dhamir) {
    const dk  = classifyFigure(dhamir.pattern);
    const dhFortune = dk.saadNahs === 'saad' ? 'סעד' : dk.saadNahs === 'nahs' ? 'נחס' : 'ממוזג';
    const dhAgrees  = agreesWithVerdict(dk, primaryVerdict?.classification?.dakhalKharij);
    lines.push(`**גורם נסתר (דמיר — ב${dhamir.houseNumber} — ${dhamir.nameHebrew}):** ${dhFortune} — ${agreementHebrew(dhAgrees)}`);
  }

  return lines.join('\n');
}

// ─── פונקציה ראשית ───────────────────────────────────────────────────────────
/**
 * ניתוח שכבת התמיכה לפסיקת כשף-אל-אסראר.
 *
 * @param {object} board        - לוח מ-raml-board-generator.js
 * @param {object} kashfVerdict - תוצאת getKashfVerdict()
 * @returns {object|null}
 */
export function getKashfSupportAnalysis(board, kashfVerdict) {
  if (!board || !kashfVerdict) return null;

  const verdictDK = kashfVerdict.classification?.dakhalKharij;

  const witness13 = analyzeHouse(board, 13, 'עד ימין — צד השואל');
  const witness14 = analyzeHouse(board, 14, 'עד שמאל — צד העניין');
  const judge     = analyzeHouse(board, 15, 'דיין — ההכרעה הסופית');
  const sentence  = analyzeHouse(board, 16, 'עאקבה — התוצאה הסופית');

  // דמיר: מיזאן קודם, אלכסון כגיבוי
  const dhamir = computeDhamirMizan(board) || computeDhamirDiagonal(board);
  const dhaminClassification = dhamir ? classifyFigure(dhamir.pattern) : null;

  const confidence = computeConfidence(verdictDK, witness13, witness14, judge);

  const supportSummaryHebrew = buildSupportSummary(
    kashfVerdict, witness13, witness14, judge, sentence, dhamir, confidence
  );

  return {
    // עדים
    witness13,
    witness14,
    witnessesAgree:
      witness13 && witness14
        ? agreesWithVerdict(witness13, witness14.dakhalKharij) === 'confirms'
        : null,

    // דיין ועאקבה
    judge,
    sentence,

    // דמיר
    dhamir: dhamir
      ? {
          ...dhamir,
          classification: dhaminClassification,
          agreesWithVerdict: agreesWithVerdict(dhaminClassification, verdictDK),
        }
      : null,

    // הכרעה
    confidence,
    supportSummaryHebrew,
  };
}

export default { getKashfSupportAnalysis };
