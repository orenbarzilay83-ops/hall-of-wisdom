/**
 * kashf-dhamir-type4-external.js
 *
 * ═══════════════════════════════════════════════════════════════════════
 * גילוי: תוצאה זו נשענת בחלקה על מקור חיצוני שאינו כשף אל-אסראר.
 * ═══════════════════════════════════════════════════════════════════════
 *
 * משלים את "הסוג הרביעי" בגילוי הכוונה הנסתרת (כשף אל-אסראר, השער
 * הרביעי, עמ' 153-155): "סופרים את חשבון המערך כולו, יודעים את מספרו,
 * ומתבוננים לאיזו אות הוא שייך; ואחר כך מתבוננים לאיזו צורה שייכת אותה
 * אות." כשף עצמו נותן את הכלל אך לא דוגמה מספרית לפעולת ההמרה
 * (מספר → אות), וטווח המספרים האפשרי (~64-128, סכום נקודות 16 בתים)
 * אינו מתיישב עם ערכי אבג'ד רגילים.
 *
 * צעד ה"מספר→אות" מבוצע כאן לפי שיטה מתועדת בספר החיצוני
 * الفلك المشحون في علم الرمل المصون (ראה al-falak-abjad-decomposition.js
 * לפרטי המקור והגילוי המלא) — שולב באישור מפורש של המשתמש (2026-07-07),
 * בתנאי גילוי מלא. צעד "אות→צורה" נשאר מבוסס-כשף במלואו
 * (SHIBUTZ_6_LETTER_TABLE, kashf-shibutzim.js, כשף עמ' 138).
 *
 * ספירת "המערך כולו": לפי הפשט של "כולו" (בניגוד לניסוח השונה של הסוג
 * הראשון, "מן הראשון עד החמישה־עשר ואינם מכניסים בחשבון את השישה־עשר"),
 * כאן נספרות כל 16 הבתים (64 נקודות = כל השורות פרד, עד 128 = כל
 * השורות זוג) — לא מיובאת החרגת-16 מהסוג הראשון בלי אישור מפורש שזו
 * אותה מוסכמת.
 */

import { getHousePattern } from './kashf-formula-engine.js';
import { combineRamlPatterns } from './raml-figures.js';
import { SHIBUTZ_6_LETTER_TABLE, getFigureByLetter } from '../data/sources/kashf-al-asrar/kashf-shibutzim.js';
import {
  decomposeNumberToAbjadLetters,
  resolveByMod28,
  AL_FALAK_SOURCE_DISCLOSURE,
} from '../data/sources/al-falak-al-mashhun/al-falak-abjad-decomposition.js';

export const TYPE4_EXTERNAL_DISCLOSURE_HEBREW =
  'תוצאה זו (שער 4, סוג 4) משתמשת בשיטת המרה חיצונית — מתועדת בספר ' +
  'الفلك المشحون في علم الرمل المصون, לא בכשף אל-אסראר — כדי להשלים ' +
  'פעולת "מספר → אות" שכשף עצמו קובע כללית בלבד וללא דוגמה מספרית. ' +
  'שיוך האות→צורה נשאר מבוסס-כשף במלואו (עמ׳ 138).';

function countBoardTotalPoints(board) {
  let total = 0;
  for (let house = 1; house <= 16; house++) {
    const pattern = getHousePattern(board, house);
    if (!pattern) return null;
    for (const digit of pattern) total += Number(digit);
  }
  return total;
}

export function computeDhamirType4External(board) {
  const totalPoints = countBoardTotalPoints(board);
  if (totalPoints == null) return null;

  const decomposition = decomposeNumberToAbjadLetters(totalPoints);
  const mod28 = resolveByMod28(totalPoints);

  const result = {
    totalPoints,
    isExternalSource: true,
    disclosureHebrew: TYPE4_EXTERNAL_DISCLOSURE_HEBREW,
    sourceBook: AL_FALAK_SOURCE_DISCLOSURE.bookHebrew,
    primaryMethod: null,
    secondaryMethod: null,
  };

  // ── שיטה ראשית: פירוק אבג'די (אל-פלק, המקום הראשי בדוגמה) ──────────────
  if (decomposition.status === 'ok') {
    const letters = decomposition.letters;
    const figures = letters.map((l) => getFigureByLetter(l.hebrew)).filter(Boolean);

    if (figures.length !== letters.length) {
      result.primaryMethod = { status: 'missing_letter_to_figure_mapping', letters };
    } else if (figures.length === 1) {
      result.primaryMethod = {
        status: 'ok',
        method: 'single_abjad_letter',
        letters,
        figures,
        finalFigure: figures[0],
        outputHebrew:
          `סכום נקודות הלוח (${totalPoints}) שייך לאות ${letters[0].hebrew} — ` +
          `אות זו שייכת לצורה ${figures[0].hebrewName} (${figures[0].pattern}). ` +
          `במקום שבו הצורה הזו יושבת בלוח — שם, לפי הספר, מתגלה מחשבת השואל.`,
      };
    } else if (figures.length === 2) {
      const combinedPattern = combineRamlPatterns(figures[0].pattern, figures[1].pattern);
      const combinedFigure = SHIBUTZ_6_LETTER_TABLE.find((e) => e.pattern === combinedPattern);
      result.primaryMethod = {
        status: 'ok',
        method: 'documented_two_letter_reduction',
        letters,
        figures,
        finalFigure: combinedFigure
          ? { pattern: combinedFigure.pattern, hebrewName: combinedFigure.hebrewName }
          : { pattern: combinedPattern, hebrewName: null },
        outputHebrew:
          `סכום נקודות הלוח (${totalPoints}) מתפרק לשתי אותיות: ` +
          `${letters[0].hebrew} (${letters[0].value}) ו-${letters[1].hebrew} (${letters[1].value}). ` +
          `${letters[0].hebrew} שייכת ל${figures[0].hebrewName}, ${letters[1].hebrew} שייכת ל${figures[1].hebrewName}. ` +
          `מהכאתן (חיבור-רמל) יוצאת ${combinedFigure?.hebrewName || combinedPattern} — ` +
          `שם, לפי אל-פלק, מתגלה מחשבת השואל.`,
      };
    } else {
      result.primaryMethod = {
        status: 'needs_verification_multi_letter',
        method: 'abjad_decomposition_more_than_two_letters',
        letters,
        figures,
        note: 'המקור המשלים מדגים הכאת שתי אותיות/שתי צורות בלבד. שלוש אותיות ומעלה לא מוצגות כתוצאה סופית — דורשות אימות נוסף.',
      };
    }
  } else {
    result.primaryMethod = { status: decomposition.status, rest: decomposition.rest };
  }

  // ── שיטה משנית: מודולו 28 ("דעה אחרת" מתועדת באל-פלק, לא ברירת מחדל) ───
  if (mod28.status === 'ok' && mod28.letter) {
    const figure = getFigureByLetter(mod28.letter.hebrew);
    result.secondaryMethod = figure
      ? {
          status: 'ok',
          method: 'secondary_author_opinion_mod28',
          remainder: mod28.remainder,
          letter: mod28.letter,
          figure,
          outputHebrew:
            `שיטה משנית (דעה אחרת, לא ברירת מחדל): ${totalPoints} מודולו 28 = ${mod28.remainder}; ` +
            `האות במיקום זה היא ${mod28.letter.hebrew}, ומובילה לצורה ${figure.hebrewName}.`,
          warning: 'שיטה זו מתועדת כדעה אחרת באל-פלק, לא כברירת מחדל.',
        }
      : { status: 'missing_letter_to_figure_mapping', remainder: mod28.remainder };
  } else {
    result.secondaryMethod = { status: mod28.status, remainder: mod28.remainder };
  }

  return result;
}
