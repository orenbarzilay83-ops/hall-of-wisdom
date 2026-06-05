import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { interpretHawiQuestionInitial } from './goral-hachol/engine/hawi-interpreter.js';

function run(label, mothers, question, topicId) {
  console.log('\n' + '═'.repeat(70));
  console.log(`▶ ${label}`);
  console.log(`  שאלה: ${question}`);
  console.log(`  נושא: ${topicId}`);
  console.log(`  אמהות: ${mothers.join(' | ')}`);
  console.log('─'.repeat(70));

  try {
    const board = buildRamlBoardFromMothers(mothers);
    board.topicId = topicId;

    const result = interpretHawiQuestionInitial(question, board);

    console.log('\n📋 פסיקת הדיין:');
    console.log(result.judgeVerdict?.verdictHebrew || result.judgeVerdict?.finalHebrew || JSON.stringify(result.judgeVerdict));

    console.log('\n📜 מסקנה סופית:');
    console.log(result.finalConclusionHebrew || '⚠️  null/ריק');

    if (result.spiritualDiagnosis?.grade && result.spiritualDiagnosis.grade !== 'mostly-clear') {
      console.log('\n🔮 אבחון רוחני:');
      console.log(result.spiritualDiagnosis.finalHebrew || '—');
    }

    // Check for nulls in key fields
    const nullChecks = {
      judgeVerdict: result.judgeVerdict,
      finalConclusionHebrew: result.finalConclusionHebrew,
      topicId: result.topicId,
      boardAnalysis: result.boardAnalysis?.hasBoard,
      boardScore: result.boardScore?.score,
    };
    const nullFields = Object.entries(nullChecks).filter(([, v]) => v == null || v === '').map(([k]) => k);
    if (nullFields.length) {
      console.log(`\n⚠️  שדות null: ${nullFields.join(', ')}`);
    }

  } catch (err) {
    console.error(`❌ שגיאה: ${err.message}`);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 1. גנבה — מי גנב, איפה הגנבה, שם הגנב, תיאורו
// ══════════════════════════════════════════════════════════════════════════
run(
  'גנבה מורכבת',
  ['humra', 'aqla', 'nakis', 'tariq'],
  'גנבו ממני כסף מהבית, מי הגנב ואיפה הוא, ומה שם הגנב ואיך הוא נראה',
  'theft'
);

// ══════════════════════════════════════════════════════════════════════════
// 2. חיזוי שנתי — יוקר, גשם, מלחמות, מחלות
// ══════════════════════════════════════════════════════════════════════════
run(
  'חיזוי שנתי',
  ['bayad', 'nusra-kharija', 'judla', 'qabd-dakhil'],
  'מה צפוי השנה מבחינת גשם, יוקר וזול, מלחמות ומחלות כלליות',
  'yearlyForecast'
);

// ══════════════════════════════════════════════════════════════════════════
// 3. נעדר — האם חי, איפה, מתי חוזר
// ══════════════════════════════════════════════════════════════════════════
run(
  'אדם נעדר',
  ['tariq', 'humra', 'ijtima', 'bayad'],
  'אדם יצא ולא חזר, האם הוא חי או מת, איפה הוא נמצא, מתי יחזור',
  'missingPerson'
);

// ══════════════════════════════════════════════════════════════════════════
// 4. אבחון רוחני — כישוף, עין, ג׳ין
// ══════════════════════════════════════════════════════════════════════════
run(
  'אבחון רוחני חזק',
  ['aqla', 'nakis', 'aqla', 'humra'],
  'יש לי כישוף או עין הרע, האם מדובר בג׳ין ומה סוגו',
  'spiritualDiagnostics'
);

// ══════════════════════════════════════════════════════════════════════════
// 5. שאלת נישואין — האם יצליחו, מתי, אופי השותף
// ══════════════════════════════════════════════════════════════════════════
run(
  'נישואין מורכבת',
  ['judla', 'nusra-dakhila', 'bayad', 'ataba-kharija'],
  'האם אצליח להינשא, מתי, ואיך יהיה בן הזוג שלי',
  'marriage'
);

// ══════════════════════════════════════════════════════════════════════════
// 6. חולה — מה המחלה, האם יחלים, מה הסיבה
// ══════════════════════════════════════════════════════════════════════════
run(
  'שאלת חולי',
  ['humra', 'ijtima', 'aqla', 'judla'],
  'אדם חולה מאוד, מה המחלה שלו, האם ימות או יחלים, ומה הסיבה לחולי',
  'illness'
);

// ══════════════════════════════════════════════════════════════════════════
// 7. מולד — תיאור אדם לפי לוחו
// ══════════════════════════════════════════════════════════════════════════
run(
  'מולד / נולד',
  ['hayyan', 'bayad', 'tariq', 'nusra-kharija'],
  'תאר לי את האדם שנולד היום לפי לוח מולדו',
  'birthNativity'
);

console.log('\n' + '═'.repeat(70));
console.log('✅ סיום בדיקות');
