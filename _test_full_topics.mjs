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
  // נושאים קיימים — מבדיקה קודמת
  { label: 'נישואין',        client: 'מרים',  topicId: 'marriage',          question: 'יש לי מועמד לנישואין — האם זה השידוך הנכון?',        mothers: ['2211','1222','2112','2212'] },
  { label: 'מחלה (חיובי)',   client: 'רחל',   topicId: 'illness',           question: 'בעלי חולה חודש — מה הפרוגנוזה?',                    mothers: ['2221','2122','1112','1212'] },
  { label: 'מחלה (שלילי)',   client: 'שמעון', topicId: 'illness',           question: 'בעלי חולה חודש — מה הפרוגנוזה?',                    mothers: ['2122','2221','2212','2122'] },
  { label: 'גנבה',           client: 'יוסף',  topicId: 'theft',             question: 'נגנבו לי כסף ותכשיטים — מי גנב ואם יחזרו?',          mothers: ['2122','1221','2212','1111'] },
  { label: 'נסיעה',          client: 'אהרון', topicId: 'travel',            question: 'האם כדאי לנסוע לחו"ל לעסקים בחודש הבא?',             mothers: ['1111','1122','1212','1222'] },
  { label: 'נעדר',           client: 'דינה',  topicId: 'missingPerson',     question: 'בעלי נעדר שלושה ימים — היכן הוא ואם יחזור?',          mothers: ['1221','1121','1122','1111'] },
  // נושאים חדשים לבדיקה
  { label: 'שותפות (חיובי)', client: 'ניסים', topicId: 'partnership',       question: 'האם כדאי להיכנס לשותפות עסקית עם השכן?',             mothers: ['1122','1122','1212','1111'] },
  { label: 'שותפות (שלילי)', client: 'לאה',   topicId: 'partnership',       question: 'האם כדאי להיכנס לשותפות עסקית עם השכן?',             mothers: ['2222','2211','2122','2221'] },
  { label: 'השלמה (חיובי)',  client: 'עמוס',  topicId: 'completion',        question: 'האם הפרויקט שלי יושלם בזמן?',                        mothers: ['1111','1211','1121','1112'] },
  { label: 'השלמה (שלילי)',  client: 'תמר',   topicId: 'completion',        question: 'האם הפרויקט שלי יושלם בזמן?',                        mothers: ['2222','2122','2212','2221'] },
  { label: 'שבוי',           client: 'רות',   topicId: 'prisoner',          question: 'אחי נעצר — מתי ישתחרר?',                             mothers: ['1212','2121','1221','2112'] },
  { label: 'מחלוקות (חיובי)',client: 'בנימין',topicId: 'disputes',          question: 'יש לי משפט בבית משפט — כיצד יסתיים?',                mothers: ['1122','1211','1121','1222'] },
  { label: 'מחלוקות (שלילי)',client: 'גדעון', topicId: 'disputes',          question: 'יש לי משפט בבית משפט — כיצד יסתיים?',                mothers: ['2211','2122','2221','2212'] },
  { label: 'תחזית שנתית',   client: 'אפרים', topicId: 'yearlyForecast',    question: 'מה צפוי לי בשנה הקרובה מבחינה כלכלית?',              mothers: ['1122','2112','1221','2211'] },
];

for (const t of tests) {
  const board = makeBoard(t.mothers, t.topicId, t.question, t.client);
  const result = interpretHawiQuestionInitial(t.question, board);
  const kv = result.kashfVerdict || {};
  const kText = kv.verdictHebrew || kv.text || '—';
  const pol = kv.classification || {};

  console.log('\n' + '═'.repeat(62));
  console.log(`📌 ${t.label} — ${t.client}`);
  console.log(`   כאשפ: ${kText.slice(0,70)}`);
  console.log(`   פולריות: dakhalKharij=${pol.dakhalKharij||'?'}  isPos=${result.isPositive}  isNeg=${result.isNegative}`);
  console.log('─'.repeat(62));
  console.log(result.clientReadingHebrew || '— אין נרטיב —');
}
console.log('\n' + '═'.repeat(62));
console.log('✅ סיום');
