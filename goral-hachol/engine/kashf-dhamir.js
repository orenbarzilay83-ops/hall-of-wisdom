/**
 * kashf-dhamir.js
 *
 * גילוי מחשבת השואל (הדמיר) — שיטת כשף אל-אסראר, השער הרביעי (עמ' 151-155).
 * "המאזן" = בית 15 (הדיין) — מאומת ישירות מול המקור, עמ' 152:
 * "לוקחים את מספר היסודות שבמאזן, ומוליכים אותו מן הבית החמישה־עשר אל הראשון".
 *
 * שלוש השיטות כאן שוחזרו ואומתו מחדש מקובץ kashf-support-analyzer.js
 * (שנמחק כ"מנוע-צל" לפני שהועברו כראוי) — הלוגיקה כבר השתמשה נכון בבית 15,
 * רק לא חוברה מעולם למנוע החי. שיטה רביעית ("אלכסון האמהות") שהייתה
 * באותו קובץ לא שוחזרה כאן — לא נמצא לה ציטוט עמוד מפורש בספר בבדיקה הזו.
 *
 * מקור: כשף אל-אסראר המצונה, השער הרביעי — עמ' 151-155
 */

import { getHousePattern, getHouseEntry, getFigureHebrewName } from './kashf-formula-engine.js';

const PARENT_PAIRS = {
  9:  [1, 2],
  10: [3, 4],
  11: [5, 6],
  12: [7, 8],
  13: [9, 10],
  14: [11, 12],
  15: [13, 14],
};

function countDots(pattern) {
  if (!pattern) return 0;
  return pattern.split('').reduce((sum, ch) => sum + (ch === '2' ? 2 : 1), 0);
}

function traceToSource(board, houseNum, rowIndex) {
  if (houseNum <= 8) return houseNum;
  const [left, right] = PARENT_PAIRS[houseNum] || [];
  if (!left) return null;
  if (getHousePattern(board, left)?.[rowIndex] === '1') return traceToSource(board, left, rowIndex);
  if (getHousePattern(board, right)?.[rowIndex] === '1') return traceToSource(board, right, rowIndex);
  return null;
}

/**
 * הסוג הראשון, הפנים הראשונות — "תנועת האורך" (עמ' 151-152).
 * לכל שורה יחידית (='1') בצורת המאזן (בית 15) — עוקבים אחורה בעץ ההורים
 * (13/14 → 9/10/11/12 → 1-8) עד שמגיעים לאם/בת שמקורה בה נקודה זו.
 *
 * מקור: "מוליכים את הנקודה מן המאזן עד המקום שבו היא עומדת באמהות או
 * בבנות... והטוב יותר הוא לקחת את הנקודה השנייה מן המאזן... דרך זו
 * נקראת תנועת האורך."
 */
export function computeDhamirMizan(board) {
  const judgePattern = getHousePattern(board, 15);
  if (!judgePattern) return null;

  for (let r = 0; r < 4; r++) {
    if (judgePattern[r] !== '1') continue;
    const sourceHouse = traceToSource(board, 15, r);
    if (!sourceHouse) continue;
    const entry = getHouseEntry(board, sourceHouse);
    if (!entry) continue;
    return {
      method: 'mizan',
      methodHebrew: 'שיטת המאזן (תנועת האורך)',
      sourceRef: 'כשף אל-אסראר עמ׳ 151-152 — הסוג הראשון, הפנים הראשונות',
      pattern: entry.pattern,
      houseNumber: sourceHouse,
      nameHebrew: entry.hebrewName || getFigureHebrewName(entry.pattern),
      tracedRow: r,
    };
  }
  return null;
}

/**
 * הסוג הראשון, הפנים השניות — "תנועת הרוחב" (עמ' 152).
 * סופרים את נקודות המאזן (בית 15), ומהלכים אחורה N צעדים החל מבית 15
 * (15→14→...→1→16→15...).
 *
 * מקור: "לוקחים את מספר היסודות שבמאזן, ומוליכים אותו מן הבית
 * החמישה־עשר אל הראשון, וכן הלאה, עד המקום שבו הוא עומד... דרך זו
 * נקראת תנועת הרוחב."
 */
export function computeDhamirHarkatAlArd(board) {
  const judgePattern = getHousePattern(board, 15);
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
    method: 'harkat-al-ard',
    methodHebrew: 'תנועת הרוחב (ספירת נקודות המאזן)',
    sourceRef: 'כשף אל-אסראר עמ׳ 152 — הסוג הראשון, הפנים השניות',
    pattern: entry.pattern,
    houseNumber: pos,
    nameHebrew: entry.hebrewName || getFigureHebrewName(entry.pattern),
    dotCount: n,
  };
}

/**
 * הסוג הראשון, הפנים הרביעיות — "ג'והריין" / קל וכבד (עמ' 153).
 * סופרים חפיף+ת'קיל (קל+כבד) בבתים 1-15 בלבד (לא 16), מפחיתים 12-12,
 * ומשליכים את הנשאר מבית 1.
 *
 * מקור: "סופרים את נקודות שני היסודות — הקל והכבד — מתוך המערך שנערך,
 * מן הראשון עד החמישה־עשר, ואינם מכניסים בחשבון את השישה־עשר. מצרפים
 * את המספר, מפחיתים אותו שנים־עשר שנים־עשר, ומה שנותר משליכים מן
 * הבית הראשון עד המקום שבו הוא עומד."
 */
export function computeDhamirJawharayn(board) {
  let total = 0;
  for (let i = 1; i <= 15; i++) {
    const p = getHousePattern(board, i);
    if (p) total += countDots(p);
  }
  if (!total) return null;
  let pos = total % 12;
  if (pos === 0) pos = 12;
  const entry = getHouseEntry(board, pos);
  if (!entry) return null;
  return {
    method: 'jawharayn',
    methodHebrew: 'שני היסודות (קל וכבד)',
    sourceRef: 'כשף אל-אסראר עמ׳ 153 — הסוג הראשון, הפנים הרביעיות',
    pattern: entry.pattern,
    houseNumber: pos,
    nameHebrew: entry.hebrewName || getFigureHebrewName(entry.pattern),
    totalDots: total,
  };
}

/**
 * מריץ את שלוש השיטות ומכריע לפי הרוב (עמ' 155: "תאסוף... ותכריע לפי הרוב").
 * מחזיר גם את כל המועמדים וגם את ההכרעה, כדי שנתיב ההצגה יוכל להראות
 * את כל הראיות ולא רק את המסקנה.
 */
export function computeDhamirByMajority(board) {
  const candidates = [
    computeDhamirMizan(board),
    computeDhamirHarkatAlArd(board),
    computeDhamirJawharayn(board),
  ].filter(Boolean);

  if (!candidates.length) {
    return { candidates: [], winner: null, agreementCount: 0 };
  }

  const counts = {};
  for (const c of candidates) {
    (counts[c.houseNumber] ||= []).push(c);
  }

  let winner = null;
  let bestCount = 0;
  for (const group of Object.values(counts)) {
    if (group.length > bestCount) {
      bestCount = group.length;
      winner = group.find((c) => c.method === 'mizan')
        || group.find((c) => c.method === 'harkat-al-ard')
        || group[0];
      winner = { ...winner, agreementCount: group.length, methodsAgreed: group.map((c) => c.methodHebrew) };
    }
  }

  return { candidates, winner, agreementCount: bestCount };
}

export default { computeDhamirMizan, computeDhamirHarkatAlArd, computeDhamirJawharayn, computeDhamirByMajority };
