/**
 * בדיקת נושאים חדשים — loan, lostAnimal, religion, motherRules, spiritualDiagnostics (ניתוב מעודכן)
 * שאלות שלא מופיעות בקבצי הבדיקה הקיימים (_test_engine.mjs, _test_full_topics.mjs)
 * בודק: null, fallback, כפילויות, השפה, איכות מסקנה, "קרא עוד" (finalConclusionHebrew)
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
      house:         h.houseNumber || h.house,
      figureId,
      shortId:       meta?.shortId   || null,
      key:           meta?.pattern   || null,
      hebrew:        meta?.hebrewName || h.figure?.hebrewName || null,
      fortune:       meta?.fortuneHebrew || null,
      movement:      meta?.movementHebrew || null,
      element:       meta?.elementHebrew || null,
      elementHebrew: meta?.elementHebrew || null,
    };
  });
}

function makeBoard(mothers, topicId, question, clientContext = {}) {
  const ctx = { clientName: 'לקוח', gender: 'male', marital: 'married', age: 40, ...clientContext };
  const board = buildRamlBoardFromMothers(mothers);
  board.chart         = buildChartFromBoard(board);
  board.topicId       = topicId;
  board.clientContext = ctx;
  board.question      = question;
  return board;
}

// ─── בדיקות "קרא עוד" ─────────────────────────────────────────────────────────
// בודק ב-finalConclusionHebrew (התוכן שמאחורי "קרא עוד"):
// 1. אין "null" כמחרוזת
// 2. אין "undefined"
// 3. אין fallback גנרי ("אין נתון", "אין מידע", "not found")
// 4. אין כפילות פסקה (אותו משפט מופיע פעמיים)
// 5. יש תוכן (לא ריק)

function auditReadMore(text = '', label = '') {
  const issues = [];
  if (!text || !text.trim()) { issues.push('⛔ קרא עוד — ריק לגמרי'); return issues; }

  if (text.includes('null'))      issues.push('🐛 "null" מחרוזת ב-קרא עוד');
  if (text.includes('undefined')) issues.push('🐛 "undefined" ב-קרא עוד');
  if (/אין נתון|אין מידע|not found|N\/A/i.test(text)) issues.push('⚠️ fallback גנרי ב-קרא עוד');

  // בדיקת כפילות: מחלקים לפסקאות/שורות ומחפשים שורות זהות
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 20);
  const seen = new Set();
  for (const line of lines) {
    if (seen.has(line)) issues.push(`⚠️ כפילות ב-קרא עוד: "${line.slice(0, 60)}..."`);
    seen.add(line);
  }

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < 30) issues.push(`⚠️ קרא עוד קצר מאוד: ${wordCount} מילים`);

  return issues;
}

function auditConclusion(result, expectedTopicId) {
  const issues = [];

  // ניתוב נושא
  if (result.topicId !== expectedTopicId) {
    issues.push(`⚠️ ניתוב שגוי — ציפינו: ${expectedTopicId} | קיבלנו: ${result.topicId}`);
  }

  // null בכל מקום
  const fullText = JSON.stringify(result);
  const nullMatches = fullText.match(/"[^"]*":\s*null/g) || [];
  const criticalNulls = nullMatches.filter(m =>
    m.includes('finalConclusion') || m.includes('clientReading') ||
    m.includes('topicHebrew') || m.includes('boardScore')
  );
  if (criticalNulls.length) issues.push(`🐛 null בשדות קריטיים: ${criticalNulls.join(', ')}`);

  // clientReadingHebrew
  const cr = result.clientReadingHebrew || '';
  if (!cr.trim()) issues.push('⚠️ clientReadingHebrew ריק');
  else if (cr.includes('null')) issues.push('🐛 null ב-clientReadingHebrew');
  else if (cr.trim().split(/\s+/).length < 15) issues.push(`⚠️ clientReadingHebrew קצר: ${cr.trim().split(/\s+/).length} מילים`);

  return issues;
}

// ─── רשימת הבדיקות ─────────────────────────────────────────────────────────────
const tests = [

  // ═══════════════════════ הלוואה (loan) ═══════════════════════════════════════
  {
    label: 'הלוואה — לוח חיובי (loan)',
    question: 'נתתי הלוואה של 50,000 ש"ח לאחי לפני שלושה חודשים — האם הוא ישיב את הכסף ומתי?',
    mothers: ['2211', '1222', '2212', '1111'],  // לבן, כבוד נכנס, נשוא ראש, דרך — סעדים
    topicId: 'loan',
    clientContext: { clientName: 'יוסף', gender: 'male', marital: 'married', age: 52 },
  },
  {
    label: 'הלוואה — לוח שלילי (loan)',
    question: 'חברי ביקש ממני הלוואה גדולה — האם כדאי להלוות לו, האם יחזיר?',
    mothers: ['2221', '2122', '1121', '2222'],  // שפל ראש, אדום, נלחם, קהלה — נחסים
    topicId: 'loan',
    clientContext: { clientName: 'רחל', gender: 'female', marital: 'single', age: 38 },
  },
  {
    label: 'הלוואה — לקוח גרוש עצמאי (loan)',
    question: 'יש לי חוב ישן אצל שותף לשעבר — האם אוכל לגבות את הכסף שמגיע לי?',
    mothers: ['2112', '1211', '2212', '1122'],  // חיבור, בר הלחי, לבן, כבוד יוצא
    topicId: 'loan',
    clientContext: { clientName: 'דוד', gender: 'male', marital: 'divorced', age: 45, workStatus: 'self' },
  },
  {
    label: 'הלוואה — לקוח מבוגר (loan)',
    question: 'האם אכניס ידי לחיסכון שנצבר ואלווה לבתי כסף לקניית דירה?',
    mothers: ['1211', '2121', '2211', '1111'],  // בר הלחי, ממון נכנס, כבוד נכנס, דרך
    topicId: 'loan',
    clientContext: { clientName: 'אסתר', gender: 'female', marital: 'widowed', age: 68 },
  },

  // ═══════════════════════ בהמה אבודה (lostAnimal) ════════════════════════════
  {
    label: 'בהמה אבודה — חמור (lostAnimal)',
    question: 'חמורי ברח מהחצר לפני יומיים — האם יחזור, היכן הוא ובאיזה מצב?',
    mothers: ['1111', '2212', '2121', '1222'],  // דרך, לבן, ממון נכנס, נשוא ראש
    topicId: 'lostAnimal',
    clientContext: { clientName: 'מוחמד', gender: 'male', marital: 'married', age: 55 },
  },
  {
    label: 'בהמה אבודה — פרה לא חוזרת (lostAnimal)',
    question: 'פרתי נעלמה מהדיר לפני שלושה ימים — האם נגנבה, האם תחזור?',
    mothers: ['2221', '1121', '2122', '2222'],  // שפל ראש, נלחם, אדום, קהלה — נחסים
    topicId: 'lostAnimal',
    clientContext: { clientName: 'אברהים', gender: 'male', marital: 'married', age: 60 },
  },
  {
    label: 'בהמה אבודה — כלב (lostAnimal)',
    question: 'הכלב שלנו ברח מהבית — מתי יחזור ואיפה הוא עכשיו?',
    mothers: ['1122', '2112', '1211', '2211'],  // כבוד יוצא, חיבור, בר הלחי, כבוד נכנס
    topicId: 'lostAnimal',
    clientContext: { clientName: 'יעל', gender: 'female', marital: 'single', age: 29 },
  },
  {
    label: 'בהמה אבודה — לקוח צעיר (lostAnimal)',
    question: 'החתול שלי לא חזר הביתה כבר שבוע — האם עדיין חי?',
    mothers: ['2211', '1222', '2121', '1112'],
    topicId: 'lostAnimal',
    clientContext: { clientName: 'שירה', gender: 'female', marital: 'single', age: 22 },
  },

  // ═══════════════════════ דת ואמונה (religion) ════════════════════════════════
  {
    label: 'דת — האם האדם בעל אמונה (religion)',
    question: 'הגבר שמציעים לי לנישואין — האם הוא אדם של אמונה ומידות, האם ניתן לסמוך עליו?',
    mothers: ['2211', '1111', '2212', '1221'],  // כבוד נכנס, דרך, לבן, סוהר
    topicId: 'religion',
    clientContext: { clientName: 'נורה', gender: 'female', marital: 'single', age: 26 },
  },
  {
    label: 'דת — אדם מעט באמונה (religion)',
    question: 'השותף שלי מדבר הרבה על ערכים — האם הוא באמת אדם נאמן ובעל ערכים?',
    mothers: ['2122', '1121', '2221', '1212'],  // אדום, נלחם, שפל ראש, ממון יוצא — נחסים
    topicId: 'religion',
    clientContext: { clientName: 'ג׳מאל', gender: 'male', marital: 'married', age: 44 },
  },
  {
    label: 'דת — עמידה בהבטחה (religion)',
    question: 'השכן שלי הבטיח לי הבטחה חשובה בעניין כסף — האם יעמוד בה?',
    mothers: ['1122', '2112', '1211', '2211'],  // כבוד יוצא, חיבור, בר הלחי, כבוד נכנס
    topicId: 'religion',
    clientContext: { clientName: 'מרים', gender: 'female', marital: 'married', age: 49 },
  },
  {
    label: 'דת — לקוחה מבוגרת (religion)',
    question: 'בתי רוצה להינשא לבחור שאינו מאמין — האם ניתן לסמוך על אופיו ומידותיו?',
    mothers: ['2221', '1112', '2222', '2122'],
    topicId: 'religion',
    clientContext: { clientName: 'חנה', gender: 'female', marital: 'widowed', age: 65 },
  },

  // ═══════════════════════ דין האם (motherRules) ═══════════════════════════════
  {
    label: 'דין האם — מצב טוב (motherRules)',
    question: 'אמי חולה ורחוקה ממני — מה מצבה עכשיו, האם היא בסדר ותתאושש?',
    mothers: ['2212', '1222', '2211', '1111'],  // לבן, נשוא ראש, כבוד נכנס, דרך — סעדים
    topicId: 'motherRules',
    clientContext: { clientName: 'אחמד', gender: 'male', marital: 'married', age: 37 },
  },
  {
    label: 'דין האם — מצב קשה (motherRules)',
    question: 'אמי זקנה ואני דואג לה — האם בריאותה מחמירה, מה הכיוון?',
    mothers: ['2221', '2122', '1121', '2221'],  // שפל ראש, אדום, נלחם, שפל ראש — נחסים
    topicId: 'motherRules',
    clientContext: { clientName: 'שמואל', gender: 'male', marital: 'married', age: 55 },
  },
  {
    label: 'דין האם — שאלת לילה (motherRules)',
    question: 'שאלה זו נשאלת בלילה: מה מצב אמי ברוחנית ובגשמית?',
    mothers: ['1211', '2212', '2121', '2211'],  // בר הלחי, לבן, ממון נכנס, כבוד נכנס
    topicId: 'motherRules',
    clientContext: { clientName: 'פאטמה', gender: 'female', marital: 'married', age: 41 },
  },
  {
    label: 'דין האם — שאלה ממבוגר (motherRules)',
    question: 'אמי בת 85 וסובלת מכאבים — האם ימיה ארוכים וטובים לה?',
    mothers: ['2112', '1121', '2122', '1112'],
    topicId: 'motherRules',
    clientContext: { clientName: 'יעקב', gender: 'male', marital: 'divorced', age: 62 },
  },

  // ═══════════════════════ אבחון רוחני — ניתוב מעודכן (spiritualDiagnostics) ══
  {
    label: 'רוחני — כישוף ועין (spiritualDiagnostics)',
    question: 'כבר שנה שאני מרגיש תקוע — עסק קרס, זוגיות קפאה, שינה מופרעת — האם יש כישוף או עין?',
    mothers: ['2221', '1221', '2112', '2222'],  // שפל ראש בב1 → נלחם, חיבור, קהלה
    topicId: 'spiritualDiagnostics',
    clientContext: { clientName: 'ח׳אלד', gender: 'male', marital: 'married', age: 39 },
  },
  {
    label: 'רוחני — נלחם בב6 (כישוף שתוי) (spiritualDiagnostics)',
    question: 'חושש שאשתי הוכנסה לי כישוף דרך שתייה — האם יש כישוף ואיך זוהה?',
    mothers: ['1121', '2122', '1221', '2221'],  // נלחם עולה לב6 בלוח הזה
    topicId: 'spiritualDiagnostics',
    clientContext: { clientName: 'מוחמד', gender: 'male', marital: 'married', age: 44 },
  },
  {
    label: 'רוחני — קנאה חמורה (spiritualDiagnostics)',
    question: 'אחרי שפתחתי עסק חדש כל דבר נסגר — האם יש קנאה או עין רעה?',
    mothers: ['2122', '2122', '2222', '1112'],  // שתי אדומות + קהלה → קנאה חמורה
    topicId: 'spiritualDiagnostics',
    clientContext: { clientName: 'רנא', gender: 'female', marital: 'single', age: 33 },
  },
  {
    label: 'רוחני — אבחון נקי (ללא פגיעה) (spiritualDiagnostics)',
    question: 'יש לי קשיים בחיים — אני רוצה לדעת האם מדובר בפגיעה רוחנית?',
    mothers: ['2211', '1111', '2212', '1222'],  // לוח חיובי — כבוד נכנס, דרך, לבן, נשוא ראש
    topicId: 'spiritualDiagnostics',
    clientContext: { clientName: 'עמית', gender: 'male', marital: 'single', age: 28 },
  },
  {
    label: 'רוחני — אישה, ג׳ין וקנאה (spiritualDiagnostics)',
    question: 'ממש מאז שנכנסתי לדירה החדשה הרגשתי רע — פחדים, חלומות, עייפות — האם יש דבר רוחני?',
    mothers: ['1221', '2222', '2122', '2221'],  // סוהר (מכשפת), קהלה, אדום, שפל ראש
    topicId: 'spiritualDiagnostics',
    clientContext: { clientName: 'ליאת', gender: 'female', marital: 'married', age: 35 },
  },
];

// ─── הרצה ─────────────────────────────────────────────────────────────────────
let passed = 0, warned = 0, failed = 0;

console.log('═'.repeat(72));
console.log('🧪 בדיקת נושאים חדשים — loan / lostAnimal / religion / motherRules / spiritualDiagnostics');
console.log('═'.repeat(72));

for (const t of tests) {
  console.log('\n' + '─'.repeat(72));
  console.log(`📌 ${t.label}`);
  console.log(`❓ ${t.question}`);
  console.log(`👤 ${t.clientContext.clientName} | ${t.clientContext.gender === 'female' ? 'נקבה' : 'זכר'} | גיל ${t.clientContext.age} | ${t.clientContext.marital}`);

  try {
    const board  = makeBoard(t.mothers, t.topicId, t.question, t.clientContext);
    const result = interpretHawiQuestionInitial(t.question, board);

    const conclusion = result.finalConclusionHebrew || '';
    const cr         = result.clientReadingHebrew   || '';

    // ── בדיקות ──
    const issuesConc = auditConclusion(result, t.topicId);
    const issuesRead = auditReadMore(conclusion, t.label);
    const allIssues  = [...issuesConc, ...issuesRead];

    // ── פלט תוצאות ──
    const h1  = result.boardAnalysis?.houses?.find(h => h.house === 1);
    const h6  = result.boardAnalysis?.houses?.find(h => h.house === 6);
    const h9  = result.boardAnalysis?.houses?.find(h => h.house === 9);
    const h10 = result.boardAnalysis?.houses?.find(h => h.house === 10);
    const h15 = result.boardAnalysis?.houses?.find(h => h.house === 15);

    console.log(`\n🏠 ב1=${h1?.figureHebrew||'—'}(${h1?.fortune||'—'}) | ב6=${h6?.figureHebrew||'—'} | ב9=${h9?.figureHebrew||'—'} | ב10=${h10?.figureHebrew||'—'} | דיין=${h15?.figureHebrew||'—'}(${h15?.fortune||'—'})`);
    console.log(`🏷  topic=${result.topicId} | score=${result.boardScore?.score ?? '—'} | grade=${result.boardScore?.grade ?? '—'}`);

    // בדיקה ייחודית לנושאים
    if (t.topicId === 'loan') {
      const lk = result.boardAnalysis?.loanKashf;
      console.log(`💳 loanKashf: ${lk?.outputHebrew?.slice(0,80) || '⛔ חסר'}`);
    }
    if (t.topicId === 'lostAnimal') {
      const la = result.boardAnalysis?.lostAnimalReturn;
      console.log(`🐾 lostAnimalReturn: ${la?.outputHebrew?.slice(0,80) || '⛔ חסר'}`);
    }
    if (t.topicId === 'religion') {
      const rk = result.boardAnalysis?.religionKashf;
      console.log(`✡️  religionKashf: ${rk?.outputHebrew?.slice(0,80) || '⛔ חסר'}`);
    }
    if (t.topicId === 'motherRules') {
      const mk = result.boardAnalysis?.motherRulesKashf;
      console.log(`👩 motherRulesKashf: ${mk?.outputHebrew?.slice(0,80) || '⛔ חסר'}`);
    }
    if (t.topicId === 'spiritualDiagnostics') {
      const sp = result.spiritualDiagnosis || result.boardAnalysis?.spiritualDiagnosis;
      console.log(`🔮 grade=${sp?.grade||'—'} | isqat=${sp?.isqatResult?.remainder||'—'}(${sp?.isqatResult?.hebrewText||'—'})`);
      const sihr = sp?.sihrDetails;
      if (sihr) console.log(`   כישוף: ${sihr.join(' | ')}`);
    }

    // ── clientReadingHebrew (ריק לקוח) ──
    const crWords = cr.trim().split(/\s+/).length;
    console.log(`\n📖 קרא ללקוח (${crWords} מילים):`);
    cr.split('\n').filter(l => l.trim()).slice(0, 4).forEach(l => console.log('  ' + l));
    if (cr.split('\n').filter(l => l.trim()).length > 4) console.log('  [...]');

    // ── קרא עוד ──
    const concWords = conclusion.trim().split(/\s+/).length;
    console.log(`\n📋 קרא עוד (${concWords} מילים):`);
    conclusion.split('\n').filter(l => l.trim()).slice(0, 6).forEach(l => console.log('  ' + l));
    if (conclusion.split('\n').filter(l => l.trim()).length > 6) console.log('  [...]');

    // ── בעיות ──
    if (allIssues.length) {
      console.log('\n⚠️  בעיות שנמצאו:');
      allIssues.forEach(i => console.log('  ' + i));
      warned++;
    } else {
      console.log('\n✅ עבר ללא בעיות');
      passed++;
    }

  } catch (err) {
    console.log(`❌ שגיאה: ${err.message}`);
    console.log(err.stack?.split('\n').slice(0, 5).join('\n'));
    failed++;
  }
}

console.log('\n' + '═'.repeat(72));
console.log(`✅ עברו: ${passed} | ⚠️  אזהרות: ${warned} | ❌ נכשלו: ${failed} | סה"כ: ${tests.length}`);
