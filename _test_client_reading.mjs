import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { interpretHawiQuestionInitial } from './goral-hachol/engine/hawi-interpreter.js';
import { HAWI_FIGURE_NAMES } from './goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js';

const NAMES_BY_ID = Object.fromEntries(HAWI_FIGURE_NAMES.map(f => [f.id, f]));
function buildChartFromBoard(board) {
  return (board.houses || []).map(h => {
    const figureId = h.figureId || null;
    const meta = figureId ? (NAMES_BY_ID[figureId] || NAMES_BY_ID[figureId.replace('hawi-figure-', '')] || null) : null;
    return { house: h.houseNumber || h.house, figureId, shortId: meta?.shortId || null,
      key: meta?.pattern || null, hebrew: meta?.hebrewName || null, fortune: meta?.fortuneHebrew || null,
      movement: meta?.movementHebrew || null, element: meta?.elementHebrew || null, elementHebrew: meta?.elementHebrew || null };
  });
}
function makeBoard(mothers, topicId, question, clientName) {
  const board = buildRamlBoardFromMothers(mothers);
  board.chart = buildChartFromBoard(board);
  board.topicId = topicId;
  board.clientContext = { clientName };
  board.question = question;
  return board;
}

const tests = [
  { label: 'נישואין', client: 'מרים', question: 'יש לי מועמד לנישואין — האם זה השידוך הנכון בשבילי?', topicId: 'marriage', mothers: ['2211','1222','2112','2212'] },
  { label: 'גנבה',   client: 'יוסף', question: 'נגנבו לי כסף ותכשיטים מהבית — מי גנב ואם יחזרו?', topicId: 'theft',   mothers: ['2122','1221','2212','1111'] },
  { label: 'מחלה',   client: 'רחל',  question: 'בעלי חולה כבר חודש ולא מתאושש — מה הפרוגנוזה?',  topicId: 'illness', mothers: ['2221','2122','1112','1212'] },
  { label: 'נסיעה',  client: 'אהרון', question: 'האם כדאי לנסוע לחו"ל לעסקים בחודש הבא?',          topicId: 'travel',  mothers: ['1111','1122','1212','1222'] },
  { label: 'נעדר',   client: 'דינה',  question: 'בעלי נעדר שלושה ימים — היכן הוא ואם יחזור?',      topicId: 'missingPerson', mothers: ['1221','1121','1122','1111'] },
];

for (const t of tests) {
  const board = makeBoard(t.mothers, t.topicId, t.question, t.client);
  const result = interpretHawiQuestionInitial(t.question, board);
  console.log('\n' + '═'.repeat(60));
  console.log(`📌 ${t.label} — ${t.client}`);
  console.log('─'.repeat(60));
  console.log('▶ קריאה ללקוח (נרטיב נקי):\n');
  console.log(result.clientReadingHebrew || '— אין נרטיב —');
}
console.log('\n' + '═'.repeat(60));
console.log('✅ סיום');
