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

// ─── עזר: ספירת נקודות צורה (חפיף=1, ת'קיל=2) ───────────────────────────────
function countDots(pattern) {
  if (!pattern) return 0;
  return pattern.split('').reduce((sum, ch) => sum + (ch === '2' ? 2 : 1), 0);
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
      methodHebrew:'שיטת המאזן',
      pattern:     entry.pattern,
      houseNumber: sourceHouse,
      nameHebrew:  entry.hebrewName || entry.pattern,
      tracedRow:   r,
    };
  }
  return null;
}

// ─── דמיר שיטה 3: חרכת הערד (תנועת-הרוחב) ───────────────────────────────────
// מקור: כשף אל-אסראר עמוד 152 — פנים שני
// "קח את מספר היסודות שבמיזאן, הלך בהם מן-15 אל-1, וכן הלאה עד שתעמוד"
// כלומר: סכום נקודות בית 15 = N, ספירה אחורה N צעדים החל מ-15
function computeDhamirHarkatAlArd(board) {
  const judgePattern = getPattern(board, 15);
  if (!judgePattern) return null;
  const n = countDots(judgePattern);
  if (!n) return null;
  let pos = 15;
  for (let i = 0; i < n; i++) {
    pos = pos === 1 ? 16 : pos - 1;
  }
  const entry = getHouseEntry(board, pos);
  if (!entry) return null;
  return {
    method:      'harkat-al-ard',
    methodHebrew:'שיטת ספירת נקודות המאזן',
    pattern:     entry.pattern,
    houseNumber: pos,
    nameHebrew:  entry.hebrewName || entry.pattern,
    dotCount:    n,
    sourceRef:   'כשף אל-אסראר עמוד 152 — פנים שני: ספירת נקודות המיזאן, הליכה מ-15 לאחור',
  };
}

// ─── דמיר שיטה 4: ג'והריין ───────────────────────────────────────────────────
// מקור: כשף אל-אסראר עמוד 153 — פנים רביעי
// "ספור חפיף+ת'קיל ב-15 בתים (לא 16), צרף הכל, השלך 12 פעמים, ספור מהראשון"
// כלומר: סכום כל הנקודות מ-H1 עד H15, חלוקת שארית ב-12, הבית המתאים = דמיר
function computeDhamirJawharayn(board) {
  let total = 0;
  for (let i = 1; i <= 15; i++) {
    const p = getPattern(board, i);
    if (p) total += countDots(p);
  }
  if (!total) return null;
  let pos = total % 12;
  if (pos === 0) pos = 12;
  const entry = getHouseEntry(board, pos);
  if (!entry) return null;
  return {
    method:      'jawharayn',
    methodHebrew:'שיטת שני היסודות (קל וכבד)',
    pattern:     entry.pattern,
    houseNumber: pos,
    nameHebrew:  entry.hebrewName || entry.pattern,
    totalDots:   total,
    sourceRef:   'כשף אל-אסראר עמוד 153 — פנים רביעי: ספירת נקודות ב-15 בתים ÷ 12, ספירה מ-1',
  };
}

// ─── בחירת דמיר לפי הרוב ─────────────────────────────────────────────────────
// מקור: כשף אל-אסראר עמוד 155 — "תאסוף ותכריע לפי הרוב"
function pickDhamirByMajority(candidates) {
  const valid = candidates.filter(Boolean);
  if (!valid.length) return null;
  const counts = {};
  for (const d of valid) {
    const h = d.houseNumber;
    if (!counts[h]) counts[h] = [];
    counts[h].push(d);
  }
  let best = null;
  let bestCount = 0;
  for (const methods of Object.values(counts)) {
    if (methods.length > bestCount) {
      bestCount = methods.length;
      // עדיפות: מיזאן > חרכת-ערד > אלכסון > ג'והריין
      best = methods.find((d) => d.method === 'mizan')
          || methods.find((d) => d.method === 'harkat-al-ard')
          || methods.find((d) => d.method === 'diagonal')
          || methods[0];
      best = { ...best, agreementCount: methods.length, methodsAgreed: methods.map((m) => m.methodHebrew) };
    }
  }
  return best;
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
  else {
    // כל הצורות (עדים + דיין) הן אנדרוגינוס — אין להן כיוון ברור (נכנס/יוצא)
    // מדד חלופי: ספירת מזל (מיטיב/מזיק) של שלושת הכוחות
    const saadCount = [w13, w14, judge].filter((h) => h?.saadNahs === 'saad').length;
    const nahsCount = [w13, w14, judge].filter((h) => h?.saadNahs === 'nahs').length;
    if (saadCount >= 2) {
      level = 'neutral-saad';
      labelHebrew = `צורות ניטרליות — מזל העדים והדיין נוטה למיטיב (${saadCount}/3)`;
    } else if (nahsCount >= 2) {
      level = 'neutral-nahs';
      labelHebrew = `צורות ניטרליות — מזל העדים והדיין נוטה למזיק (${nahsCount}/3)`;
    } else {
      level = 'neutral';
      labelHebrew = 'צורות ניטרליות — הכוחות ממוזגים, אין נטייה ברורה';
    }
  }

  return { level, labelHebrew, confirms, contradicts };
}

// ─── סיכום עברי ──────────────────────────────────────────────────────────────
function buildSupportSummary(primaryVerdict, w13, w14, judge, sentence, dhamir, confidence) {
  const lines = [];

  lines.push('**ניתוח כוחות הלוח:**');

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
    lines.push(`• אחרית (ב16 — ${sentence.nameHebrew}): ${sentence.dakhalKharijHebrew} | ${sentence.saadNahsHebrew}`);
  }

  lines.push('');
  lines.push(`**הכרעה:** ${confidence.labelHebrew}`);

  if (dhamir) {
    const dk  = classifyFigure(dhamir.pattern);
    const dhFortune = dk.saadNahs === 'saad' ? 'מיטיב' : dk.saadNahs === 'nahs' ? 'מזיק' : 'ממוזג';
    const dhAgrees  = agreesWithVerdict(dk, primaryVerdict?.classification?.dakhalKharij);
    const agreedBy  = dhamir.methodsAgreed?.length > 1
      ? ` [${dhamir.agreementCount} שיטות מסכימות: ${dhamir.methodsAgreed.join(', ')}]`
      : ` [שיטה: ${dhamir.methodHebrew}]`;
    lines.push(`**הכוונה הנסתרת (— ב${dhamir.houseNumber} — ${dhamir.nameHebrew}):** ${dhFortune} — ${agreementHebrew(dhAgrees)}${agreedBy}`);
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
  const sentence  = analyzeHouse(board, 16, 'אחרית הדבר — התוצאה הסופית');

  // דמיר: 4 שיטות לפי כשף אל-אסראר עמ' 151-155 → הכרעה לפי הרוב
  const dhamirCandidates = [
    computeDhamirMizan(board),
    computeDhamirHarkatAlArd(board),
    computeDhamirDiagonal(board),
    computeDhamirJawharayn(board),
  ];
  const dhamir = pickDhamirByMajority(dhamirCandidates);
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

    // דמיר — הכרעה מ-4 שיטות (כשף אל-אסראר עמ' 151-155)
    dhamir: dhamir
      ? {
          ...dhamir,
          classification: dhaminClassification,
          agreesWithVerdict: agreesWithVerdict(dhaminClassification, verdictDK),
        }
      : null,
    dhamirAllMethods: dhamirCandidates.filter(Boolean).map((d) => ({
      method:      d.method,
      methodHebrew:d.methodHebrew,
      houseNumber: d.houseNumber,
      nameHebrew:  d.nameHebrew,
      pattern:     d.pattern,
    })),

    // הכרעה
    confidence,
    supportSummaryHebrew,
  };
}

export default { getKashfSupportAnalysis };
