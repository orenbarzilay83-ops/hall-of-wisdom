import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { interpretHawiQuestionInitial } from './goral-hachol/engine/hawi-interpreter.js';

function sep(title) {
  console.log('\n' + '═'.repeat(70));
  console.log('  ' + title);
  console.log('═'.repeat(70));
}

function runReading({ label, mothers, topicId, question, clientContext = {} }) {
  sep(label);
  try {
    const board = buildRamlBoardFromMothers(mothers);
    board.topicId = topicId;
    board.clientContext = clientContext;

    const result = interpretHawiQuestionInitial(question, board);

    const judge = result.boardAnalysis?.judge || result.boardAnalysis?.houses?.find(h => h.house === 15);
    const witnesses = result.boardAnalysis?.witnesses || [];
    const h1 = result.boardAnalysis?.houses?.find(h => h.house === 1);

    console.log('נושא: ' + result.topicHebrew + '  |  ציון: ' + (result.boardScore?.grade || '—') + '  |  פסיקה: ' + (result.judgeVerdict?.verdict || '—'));
    if (h1)        console.log('בית 1:  ' + (h1.figureHebrew || '—') + ' (' + (h1.fortune || '—') + ')');
    if (judge)     console.log('דיין(15): ' + (judge.figureHebrew || '—') + ' (' + (judge.fortune || '—') + ')');
    if (witnesses[0]) console.log('עד1(13): ' + (witnesses[0].figureHebrew || '—') + ' (' + (witnesses[0].fortune || '—') + ')');
    if (witnesses[1]) console.log('עד2(14): ' + (witnesses[1].figureHebrew || '—') + ' (' + (witnesses[1].fortune || '—') + ')');

    console.log('\n--- מסקנה ---');
    const c = result.finalConclusionHebrew;
    if (c && c.trim()) {
      console.log(c);
    } else {
      console.log('[ריק]');
    }
  } catch (err) {
    console.error('שגיאה: ' + err.message);
  }
}

const boardA = ['1111', '2212', '2112', '1111'];  // דרך, לבן, חיבור, דרך (חיוביים)
const boardB = ['2221', '1211', '2122', '1121'];  // שפל, בר הלחי, אדום, נלחם (שליליים)
const boardC = ['2212', '1222', '2221', '2112'];  // לבן, נשוא ראש, שפל, חיבור (מעורב)
const boardD = ['1121', '2122', '1121', '2122'];  // נלחם, אדום, נלחם, אדום (חוזר)

runReading({ label: '1. מסחר — עסקה עם ספק חדש', mothers: boardA, topicId: 'commerce', question: 'האם כדאי לסגור עסקה עם הספק?', clientContext: { clientName: 'אבי', maritalStatus: 'married', workStatus: 'self' } });
runReading({ label: '2. נישואין — האם הזמן מתאים?', mothers: boardC, topicId: 'marriage', question: 'האם הנישואין יצליחו?', clientContext: { clientName: 'יוסף', maritalStatus: 'single' } });
runReading({ label: '3. מחלה — מה מצב החולה?', mothers: boardB, topicId: 'illness', question: 'האם אבי יחלים?', clientContext: { clientName: 'מרים' } });
runReading({ label: '4. נסיעה — האם לנסוע?', mothers: boardA, topicId: 'travel', question: 'האם הנסיעה לטורקיה בטוחה?', clientContext: { clientName: 'חסן' } });
runReading({ label: '5. ילדים והריון', mothers: boardC, topicId: 'childrenPregnancy', question: 'האם אשתי תיכנס להריון?', clientContext: { clientName: 'עלי', hasChildren: 'no' } });
runReading({ label: '6. אויב — מי פועל נגדי?', mothers: boardB, topicId: 'enemies', question: 'האם יש אויב נגדי בעבודה?', clientContext: { clientName: 'דוד' } });
runReading({ label: '7. אבחון רוחני', mothers: boardD, topicId: 'spiritualDiagnostics', question: 'האם יש עלי עין הרע?', clientContext: { clientName: 'פאטמה' } });
runReading({ label: '8. חלום — האם יתגשם?', mothers: boardA, topicId: 'dreamInterpretation', question: 'ראיתי חלום שמצאתי זהב', clientContext: { clientName: 'אחמד' } });
runReading({ label: '9. אסיר — האם ישוחרר?', mothers: boardB, topicId: 'prisoner', question: 'האם אחי ישוחרר?', clientContext: { clientName: 'ליאת' } });
runReading({ label: '10. פתיחה כללית', mothers: boardC, topicId: 'generalReading', question: 'מה מצבי הכללי?', clientContext: { clientName: 'רחל', maritalStatus: 'divorced', workStatus: 'employed' } });
runReading({ label: '11. סכסוך — האם אנצח?', mothers: boardC, topicId: 'disputes', question: 'האם אנצח בתביעה?', clientContext: { clientName: 'מוחמד' } });
runReading({ label: '12. גנב — מי גנב?', mothers: boardB, topicId: 'theft', question: 'מי גנב לי את הכסף?', clientContext: { clientName: 'שרה' } });
runReading({ label: '13. שותפות', mothers: boardA, topicId: 'partnership', question: 'האם השותפות תצליח?', clientContext: { clientName: 'ניר', workStatus: 'self' } });
runReading({ label: '14. פחד — האם הסכנה אמיתית?', mothers: boardB, topicId: 'fear', question: 'האם יש סכנה אמיתית?', clientContext: { clientName: 'אסתר' } });
runReading({ label: '15. אהבה ושנאה', mothers: boardC, topicId: 'loveHate', question: 'האם הוא אוהב אותי?', clientContext: { clientName: 'נאדיה' } });
