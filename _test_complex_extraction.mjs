/**
 * בדיקת חילוץ שמות / תאריכים / מקומות מהמנוע
 *
 * מריץ שאלות מורכבות שמפעילות:
 *   1. חילוץ שם (nameLetters) — גנבה, נעדר, רוחני
 *   2. תזמון מדויק (timingEstimate) — האדד
 *   3. כיוון גאוגרפי (directionQuadrant) — נסיעה, מטמון, נעדר
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { interpretHawiQuestionInitial } from './goral-hachol/engine/hawi-interpreter.js';
import { HAWI_FIGURE_NAMES } from './goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js';

const NAMES_BY_ID = Object.fromEntries(HAWI_FIGURE_NAMES.map(f => [f.id, f]));

function buildChartFromBoard(board) {
  return (board.houses || []).map(h => {
    const figureId = h.figureId || null;
    const meta = figureId
      ? (NAMES_BY_ID[figureId] || NAMES_BY_ID[figureId.replace('hawi-figure-', '')] || null)
      : null;
    return {
      house:        h.houseNumber || h.house,
      figureId,
      shortId:      meta?.shortId || null,
      key:          meta?.pattern || null,
      hebrew:       meta?.hebrewName || h.figure?.hebrewName || null,
      fortune:      meta?.fortuneHebrew || null,
      movement:     meta?.movementHebrew || null,
      element:      meta?.elementHebrew || null,
      elementHebrew: meta?.elementHebrew || null,
    };
  });
}

function makeBoard(mothers, topicId, question, clientName = 'שרה') {
  const board = buildRamlBoardFromMothers(mothers);
  board.chart  = buildChartFromBoard(board);
  board.topicId = topicId;
  board.clientContext = { clientName };
  board.question = question;
  return board;
}

// ═══════════════════════════════════════════════════════════════
// שאלות מורכבות — שמות, תאריכים, מקומות
// ═══════════════════════════════════════════════════════════════
const tests = [

  // ── שמות ───────────────────────────────────────────────────
  {
    label: '1. גנבה — מי גנב ושמו',
    question: 'תכשיטים נגנבו מביתי. מי גנב אותם ומה שמו?',
    topicId: 'theft',
    // H1=כבוד נכנס(סעד), H2=לבן(סעד), H3=אדום(נחס), H4=ממון יוצא(נחס)
    mothers: ['2211', '2212', '2122', '1212'],
    focus: 'name',
  },
  {
    label: '2. נעדר — היכן הוא ושמו',
    question: 'בעלי נעדר 5 ימים — היכן הוא ומה שמו האמיתי?',
    topicId: 'missingPerson',
    // H1=סוהר(נחס), H2=נלחם(נחס), H3=כבוד יוצא(סעד), H4=דרך(ממוזג)
    mothers: ['1221', '1121', '1122', '1111'],
    focus: 'name+location',
  },
  {
    label: '3. רוחני — מי גרם לנזק ושמו',
    question: 'מישהו עשה לי כישוף ומונע ממני פרנסה. מי הוא?',
    topicId: 'spiritualDiagnostics',
    // H1=אדום(נחס), H2=סף יוצא(נחס), H3=קהלה(ממוזג), H4=שפל ראש(נחס)
    mothers: ['2122', '1112', '2222', '2221'],
    focus: 'name',
  },
  {
    label: '4. שותפות — שם השותף ומהימנותו',
    question: 'שותף חדש פנה אליי — מה שמו ואפשר לסמוך עליו?',
    topicId: 'partnership',
    mothers: ['2211', '1122', '2121', '1111'],
    focus: 'name',
  },

  // ── תאריכים ─────────────────────────────────────────────────
  {
    label: '5. מחלה — מתי תחלוף',
    question: 'כבר שלושה שבועות אני חולה — מתי אחלים ואשוב לעצמי?',
    topicId: 'illness',
    // H1=לבן(סעד), H2=ממון נכנס(סעד), H3=שפל ראש(נחס), H4=כבוד נכנס(סעד)
    mothers: ['2212', '2121', '2221', '2211'],
    focus: 'timing',
  },
  {
    label: '6. נסיעה — מתי לצאת',
    question: 'אני מתכנן נסיעה עסקית לחו"ל — מתי הזמן הטוב ביותר לצאת?',
    topicId: 'travel',
    // H1=דרך(ממוזג), H2=כבוד יוצא(סעד), H3=ממון יוצא(נחס), H4=נשוא ראש(סעד)
    mothers: ['1111', '1122', '1212', '1222'],
    focus: 'timing',
  },
  {
    label: '7. אסיר — מתי ישוחרר',
    question: 'אחי עצור במעצר — מתי ישוחרר ויחזור הביתה?',
    topicId: 'prisoner',
    // H1=סוהר(נחס), H2=חיבור(ממוזג), H3=ממון נכנס(סעד), H4=לבן(סעד)
    mothers: ['1221', '2112', '2121', '2212'],
    focus: 'timing',
  },

  // ── מקומות ──────────────────────────────────────────────────
  {
    label: '8. מטמון — היכן נמצא',
    question: 'שמעתי שיש מטמון בשדה שרכשתי — באיזה כיוון לחפש?',
    topicId: 'hiddenTreasure',
    // H1=בר הלחי(ממוזג), H2=ממון נכנס(סעד), H3=כבוד נכנס(סעד), H4=לבן(סעד)
    mothers: ['1211', '2121', '2211', '2212'],
    focus: 'location',
  },
  {
    label: '9. נעדר — לאיזה כיוון נסע',
    question: 'בתי יצאה מהבית ולא חזרה — לאיזה כיוון הלכה?',
    topicId: 'missingPerson',
    // H1=נלחם(ממוזג), H2=אדום(נחס), H3=כבוד יוצא(סעד), H4=ממון יוצא(נחס)
    mothers: ['1121', '2122', '1122', '1212'],
    focus: 'location',
  },
  {
    label: '10. נסיעה — לאן ובאיזה כיוון',
    question: 'אני שוקל לעבור לעיר אחרת — לאיזה כיוון טוב לעבור?',
    topicId: 'travel',
    // H1=כבוד נכנס(סעד), H2=נשוא ראש(סעד), H3=לבן(סעד), H4=חיבור(ממוזג)
    mothers: ['2211', '1222', '2212', '2112'],
    focus: 'location',
  },
];

// ─── הרצת בדיקות ─────────────────────────────────────────────
for (const t of tests) {
  console.log('\n' + '═'.repeat(70));
  console.log(`📌 ${t.label}`);
  console.log(`❓ שאלה: ${t.question}`);
  console.log(`🔍 מוקד: ${t.focus}`);
  console.log('─'.repeat(70));

  try {
    const board = makeBoard(t.mothers, t.topicId, t.question);
    const result = interpretHawiQuestionInitial(t.question, board);
    const ba = result.boardAnalysis;

    // ── שמות ──────────────────────────────────────────────────
    if (ba?.nameLetters?.length > 0) {
      console.log('👤 חילוץ שם:');
      for (const nl of ba.nameLetters) {
        console.log(`   ${nl.houseRole} (בית ${nl.houseNumber}): ${nl.figureHebrew} → ${nl.outputHebrew}`);
      }
    }
    if (ba?.alternativeNameExtraction?.results?.length > 0) {
      const altLetters = [...new Set(ba.alternativeNameExtraction.results.flatMap(r => r.letters || []))];
      console.log(`   שיטה משלימה: אותיות — ${altLetters.join(' / ')}`);
    }

    // ── תזמון ─────────────────────────────────────────────────
    if (ba?.timingEstimate) {
      const te = ba.timingEstimate;
      console.log(`⏱  תזמון: ${te.quantity} (${te.dotCount} נקודות × ${te.timingUnits})`);
    }

    // ── כיוון גאוגרפי ─────────────────────────────────────────
    if (ba?.directionQuadrant) {
      const dq = ba.directionQuadrant;
      const domHeb = dq.dominantHebrew || dq.dominant?.hebrewDir || '—';
      const domCount = dq.dominant?.incomingBenefic ?? 0;
      if (domCount > 0) {
        console.log(`🧭 כיוון מומלץ: ${domHeb} (${domCount} צורות סעד נכנסות)`);
      } else {
        console.log(`🧭 כיוון (ללא צורות נכנסות בולטות): ${domHeb}`);
      }
      const byQuadrant = dq.quadrants || [];
      for (const q of byQuadrant) {
        if (q.houses.length > 0) {
          console.log(`   ${q.hebrewDir}: ${q.houses.map(h => `ב${h.house}=${h.figureHebrew}`).join(', ')}`);
        }
      }
    }

    // ── מיקום גנב/נעדר ────────────────────────────────────────
    if (ba?.thiefLocationDetails?.outputHebrew) {
      console.log(`📍 מיקום (בלוג׳ אלאמל): ${ba.thiefLocationDetails.outputHebrew}`);
    }
    if (ba?.treasureLocation?.outputHebrew) {
      console.log(`💎 מיקום מטמון: ${ba.treasureLocation.outputHebrew}`);
    }
    if (ba?.missingPersonAnalysis?.locationHebrew) {
      console.log(`🗺  מיקום נעדר: ${ba.missingPersonAnalysis.locationHebrew}`);
    }

    // ── מסקנה רלוונטית ────────────────────────────────────────
    console.log('\n📄 קטע מהמסקנה הסופית:');
    const conclusion = result.finalConclusionHebrew || '';
    const lines = conclusion.split('\n').filter(l => l.trim());
    // הצג עד 15 שורות רלוונטיות
    lines.slice(0, 15).forEach(l => console.log('  ' + l));
    if (lines.length > 15) console.log(`  … [עוד ${lines.length - 15} שורות]`);

    if (conclusion.includes('null')) {
      console.log('🐛 BUG: המסקנה מכילה "null"');
    }

  } catch (err) {
    console.log(`❌ שגיאה: ${err.message}`);
    console.log(err.stack?.split('\n').slice(0, 4).join('\n'));
  }
}

console.log('\n' + '═'.repeat(70));
console.log('✅ סיום בדיקת חילוץ שמות/תאריכים/מקומות');
