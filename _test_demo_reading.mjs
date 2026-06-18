/**
 * הדגמת קריאה מלאה ללקוח — כמה שאלות נפוצות
 * מציג את המסקנה הסופית בלבד, כמו שהפרשן קורא ללקוח
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { interpretHawiQuestionInitial } from './goral-hachol/engine/hawi-interpreter.js';
import { HAWI_FIGURE_NAMES } from './goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js';

const NAMES_BY_ID = Object.fromEntries(HAWI_FIGURE_NAMES.map(f => [f.id, f]));

function buildChartFromBoard(board) {
  return (board.houses || []).map(h => {
    const figureId = h.figureId || null;
    const meta = figureId ? (NAMES_BY_ID[figureId] || NAMES_BY_ID[figureId.replace('hawi-figure-', '')] || null) : null;
    return {
      house: h.houseNumber || h.house,
      figureId, shortId: meta?.shortId || null, key: meta?.pattern || null,
      hebrew: meta?.hebrewName || null, fortune: meta?.fortuneHebrew || null,
      movement: meta?.movementHebrew || null, element: meta?.elementHebrew || null,
      elementHebrew: meta?.elementHebrew || null,
    };
  });
}

function runReading(label, clientName, question, topicId, mothers) {
  const board = buildRamlBoardFromMothers(mothers);
  board.chart = buildChartFromBoard(board);
  board.topicId = topicId;
  board.clientContext = { clientName };
  board.question = question;
  const result = interpretHawiQuestionInitial(question, board);
  const ba = result.boardAnalysis;

  const SEP = '━'.repeat(60);
  const SEP2 = '─'.repeat(60);

  console.log('\n\n' + '█'.repeat(60));
  console.log(`█  ${label}`);
  console.log('█'.repeat(60));
  console.log(`לקוח: ${clientName}`);
  console.log(`שאלה: "${question}"`);
  console.log(SEP);

  // — לוח תמציתי —
  const h = (n) => ba?.houses?.find(x => x.house === n);
  const fig = (n) => h(n)?.figureHebrew || '—';
  const fort = (n) => h(n)?.fortune || '';
  console.log('לוח גורל החול (בתים מרכזיים):');
  console.log(`  ב1 (השואל):    ${fig(1).padEnd(14)} ${fort(1)}`);
  console.log(`  ב7 (הנשאל/צד ב): ${fig(7).padEnd(14)} ${fort(7)}`);
  console.log(`  ב13 (עד ימין): ${fig(13).padEnd(14)} ${fort(13)}`);
  console.log(`  ב14 (עד שמאל): ${fig(14).padEnd(14)} ${fort(14)}`);
  console.log(`  ב15 (דיין):    ${fig(15).padEnd(14)} ${fort(15)}`);
  console.log(`  ב16 (עאקבה):   ${fig(16).padEnd(14)} ${fort(16)}`);

  // — תזמון —
  if (ba?.timingEstimate) {
    const te = ba.timingEstimate;
    console.log(`\nתזמון (האדד): ${te.quantity}`);
  }

  // — שם (אם רלוונטי) —
  if (ba?.nameLetters?.length > 0) {
    console.log('\nחילוץ שם:');
    for (const nl of ba.nameLetters) {
      console.log(`  ${nl.houseRole}: ${nl.outputHebrew}`);
    }
  }

  // — כיוון (אם רלוונטי) —
  if (ba?.directionQuadrant?.dominantHebrew) {
    const dq = ba.directionQuadrant;
    const domCount = dq.dominant?.incomingBenefic ?? 0;
    if (domCount > 0) console.log(`\nכיוון: ${dq.dominantHebrew} (${domCount} צורות סעד נכנסות)`);
  }

  console.log('\n' + SEP);
  console.log('▶  מסקנה סופית — כמו שמקריאים ללקוח:\n');

  // הדפסת המסקנה — שורה שורה
  const lines = (result.finalConclusionHebrew || '').split('\n');
  for (const line of lines) {
    if (!line.trim()) { console.log(''); continue; }
    // שורות כותרת (━━ ... ━━)
    if (line.startsWith('━━')) { console.log('\n' + line); continue; }
    // שורות **bold**
    if (line.startsWith('**')) { console.log('  ' + line.replace(/\*\*/g, '').toUpperCase()); continue; }
    // שורות • bullet
    if (line.startsWith('  •') || line.startsWith('•')) { console.log(line); continue; }
    console.log(line);
  }

  console.log('\n' + SEP2);
  const grade = result.boardScore?.grade || '—';
  const score = result.boardScore?.score ?? '—';
  console.log(`ציון הלוח: ${score} | פסיקה: ${grade}`);
}

// ═══════════════════════════════════════════════════════════════
// 3 שאלות נפוצות — הדגמה מלאה
// ═══════════════════════════════════════════════════════════════

runReading(
  'שאלה 1: נישואין',
  'מרים',
  'יש לי מועמד לנישואין — האם זה השידוך הנכון בשבילי?',
  'marriage',
  ['2211', '1222', '2112', '2212']  // כבוד נכנס, נשוא ראש, חיבור, לבן
);

runReading(
  'שאלה 2: גנבה',
  'יוסף',
  'נגנבו לי כסף ותכשיטים מהבית — מי גנב ואם יחזרו?',
  'theft',
  ['2122', '1221', '2212', '1111']  // אדום, סוהר, לבן, דרך
);

runReading(
  'שאלה 3: מחלה',
  'רחל',
  'בעלי חולה כבר חודש ולא מתאושש — מה הפרוגנוזה?',
  'illness',
  ['2221', '2122', '1112', '1212']  // שפל ראש, אדום, סף יוצא, ממון יוצא
);
