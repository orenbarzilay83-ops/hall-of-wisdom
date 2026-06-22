/**
 * Full engine test — runs real boards for each major topic
 * and prints finalConclusionHebrew + topicId + grade + bugs observed.
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { interpretHawiQuestionInitial } from './goral-hachol/engine/hawi-interpreter.js';
import { HAWI_FIGURE_NAMES } from './goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js';

const NAMES_BY_ID      = Object.fromEntries(HAWI_FIGURE_NAMES.map(f => [f.id, f]));

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
      elementHebrew:meta?.elementHebrew || null,
    };
  });
}

function makeBoard(mothers, topicId, question, clientContext = {}) {
  const ctx = { clientName: 'ראובן', ...clientContext };
  const board = buildRamlBoardFromMothers(mothers);
  board.chart         = buildChartFromBoard(board);
  board.topicId       = topicId;
  board.clientContext = ctx;
  board.question      = question;
  return board;
}

// ─── 16 figure patterns ───────────────────────────────────────────────────────
// 1111=דרך      1112=סף יוצא   1121=נלחם      1122=כבוד יוצא
// 1211=בר הלחי  1212=ממון יוצא  1221=סוהר      1222=נשוא ראש
// 2111=סף נכנס  2112=חיבור     2121=ממון נכנס  2122=אדום
// 2211=כבוד נכנס 2212=לבן      2221=שפל ראש   2222=קהלה

// ─── Test cases ───────────────────────────────────────────────────────────────
const tests = [
  // ── 1. גניבה ──────────────────────────────────────────────────────────────
  {
    label:   'גניבה — זיהוי גנב (theft)',
    question:'נגנב לי שעון יקר מהבית לפני שבוע — מי גנב, האם יחזור ואיפה לחפש?',
    mothers: ['2112', '1111', '2221', '1122'],
    topicId: 'theft',
    clientContext: { clientName: 'יוסף', gender: 'male', marital: 'married', age: 45 },
  },

  // ── 2. נישואין ────────────────────────────────────────────────────────────
  {
    label:   'נישואין — כדאיות שידוך (marriage)',
    question:'הוצע לי שידוך מתאים על פניו אבל יש לי ספק בלב — האם זה הזוג המיועד לי?',
    mothers: ['2211', '1222', '2112', '2212'],
    topicId: 'marriage',
    clientContext: { clientName: 'שרה', gender: 'female', marital: 'single', age: 28 },
  },

  // ── 3. מחלה ──────────────────────────────────────────────────────────────
  {
    label:   'מחלה — מקור וסיכוי החלמה (illness)',
    question:'אני סובל מכאבים כרוניים ועייפות קשה מזה שמונה חודשים ואין לרופאים תשובה — מה מקור המחלה ואם אחלים?',
    mothers: ['2221', '2122', '1112', '1212'],
    topicId: 'illness',
    clientContext: { clientName: 'משה', gender: 'male', marital: 'married', age: 55 },
  },

  // ── 4. נסיעה ─────────────────────────────────────────────────────────────
  {
    label:   'נסיעה — ביטחון ותועלת (travel)',
    question:'מתכנן לנסוע לחו"ל לעסקים בחודש הבא — האם הנסיעה בטוחה ותצלח, או שכדאי לדחות?',
    mothers: ['1111', '1121', '1122', '2121'],
    topicId: 'travel',
    clientContext: { clientName: 'דוד', gender: 'male', marital: 'married', age: 38 },
  },

  // ── 5. נעדר ──────────────────────────────────────────────────────────────
  {
    label:   'נעדר — גורל ומיקום (missingPerson)',
    question:'אחי יצא לפני ארבעה ימים ולא חזר ולא ענה לטלפון — האם הוא בסדר, היכן הוא ומתי יחזור?',
    mothers: ['1222', '2212', '2112', '1221'],
    topicId: 'missingPerson',
    clientContext: { clientName: 'רחל', gender: 'female', marital: 'married', age: 35 },
  },

  // ── 6. אבחון רוחני ────────────────────────────────────────────────────────
  {
    label:   'אבחון רוחני — כישוף ועין הרע (spiritualDiagnostics)',
    question:'מזה שנתיים חיי ירדו ממסלולם — פרנסה נסגרה, בריאות נפגעה, זוגיות קורסת — האם יש כישוף, עין הרע או השפעה דמונית?',
    mothers: ['2122', '2111', '2222', '2221'],
    topicId: 'spiritualDiagnostics',
    clientContext: { clientName: 'אחמד', gender: 'male', marital: 'married', age: 42 },
  },

  // ── 7. מטמון נסתר ────────────────────────────────────────────────────────
  {
    label:   'מטמון נסתר (hiddenTreasure)',
    question:'קיבלתי שדה בירושה והמשפחה מספרת שסבא קבר בו כסף — האם יש מטמון ואם כן היכן?',
    mothers: ['1211', '2121', '2211', '2212'],
    topicId: 'hiddenTreasure',
    clientContext: { clientName: 'אברהים', gender: 'male', marital: 'single', age: 30 },
  },

  // ── 8. שלטון ─────────────────────────────────────────────────────────────
  {
    label:   'שלטון ומדינה (authorityState)',
    question:'האם השר ישמור על תפקידו לאחר הבחירות, או שיאבד את כוחו ומעמדו?',
    mothers: ['1122', '1212', '2221', '2122'],
    topicId: 'authorityState',
    clientContext: { clientName: 'יעקב', gender: 'male', marital: 'married', age: 50 },
  },

  // ── 9. תחזית שנתית ───────────────────────────────────────────────────────
  {
    label:   'תחזית שנתית — פרנסה ובריאות (yearlyForecast)',
    question:'מה צפוי לי השנה בפרנסה, בריאות וזוגיות — האם תהיה שנה טובה או שיש להיזהר?',
    mothers: ['2121', '1222', '2212', '2112'],
    topicId: 'yearlyForecast',
    clientContext: { clientName: 'פאטמה', gender: 'female', marital: 'married', age: 40 },
  },

  // ── 10. מולד / נטיביטי ───────────────────────────────────────────────────
  {
    label:   'מולד / נטיביטי (birthNativity)',
    question:'מה הלוח מגלה על אופי, גורל ועתיד הנולד — מה חזקותיו ומה יש להיזהר ממנו?',
    mothers: ['1121', '2211', '1111', '1211'],
    topicId: 'birthNativity',
    clientContext: { clientName: 'תינוק', gender: 'male', marital: 'single', age: 0 },
  },

  // ── 11. מסחר ─────────────────────────────────────────────────────────────
  {
    label:   'מסחר — כדאיות עסקה (commerce)',
    question:'מוצעת לי עסקת נדל"ן גדולה עם שותף חדש — האם ההשקעה תצלח ואוכל לסמוך על השותף?',
    mothers: ['2121', '2211', '1222', '2212'],
    topicId: 'commerce',
    clientContext: { clientName: 'חיים', gender: 'male', marital: 'married', age: 48 },
  },

  // ── 12. ילדים / הריון ────────────────────────────────────────────────────
  {
    label:   'ילדים / הריון (childrenPregnancy)',
    question:'אנחנו מנסים להיכנס להריון כבר שנה וחצי ללא הצלחה — האם יהיו לנו ילדים ומתי?',
    mothers: ['2211', '1222', '2212', '2121'],
    topicId: 'childrenPregnancy',
    clientContext: { clientName: 'לאה', gender: 'female', marital: 'married', age: 33 },
  },

  // ── 13. אסיר / כלא ───────────────────────────────────────────────────────
  {
    label:   'אסיר — שחרור (prisoner)',
    question:'בני נאסר בגין אשמה שאינה נכונה ועומד לדין — האם ישתחרר בקרוב ויצא זכאי?',
    mothers: ['1221', '2112', '1222', '2121'],
    topicId: 'prisoner',
    clientContext: { clientName: 'אם', gender: 'female', marital: 'married', age: 58 },
  },

  // ── 14. שותפות ───────────────────────────────────────────────────────────
  {
    label:   'שותפות עסקית (partnership)',
    question:'מציעים לי להיכנס כשותף שווה בעסק מצליח — האם השותפות תועיל לי, או שיש סיכון?',
    mothers: ['2211', '1111', '2121', '1122'],
    topicId: 'partnership',
    clientContext: { clientName: 'אמיר', gender: 'male', marital: 'single', age: 34 },
  },

  // ── 15. מסע ים ───────────────────────────────────────────────────────────
  {
    label:   'מסע ים (seaVoyage)',
    question:'הספינה יוצאת מחר לנסיעה ארוכה — האם המסע בטוח ומה הגורל מראה לגבי ההגעה בשלום?',
    mothers: ['1111', '2122', '1222', '2112'],
    topicId: 'seaVoyage',
    clientContext: { clientName: 'כלוד', gender: 'male', marital: 'single', age: 29 },
  },

  // ── 16. אויבים ───────────────────────────────────────────────────────────
  {
    label:   'אויבים — מי ינצח (enemies)',
    question:'יש לי שונא שמנסה לפגוע בי בעסקים ובמשפחה מזה שנים — מי יגבר בסוף ואיך להתמודד?',
    mothers: ['2211', '2212', '2121', '1111'],
    topicId: 'enemies',
    clientContext: { clientName: 'יונס', gender: 'male', marital: 'married', age: 44 },
  },

  // ── 17. סכסוך / תביעה ────────────────────────────────────────────────────
  {
    label:   'סכסוך ותביעה משפטית (disputes)',
    question:'יש לי תביעה משפטית כבדה נגד שכן שגרם לי נזק ממון — מי ינצח בבית המשפט ומתי ייגמר?',
    mothers: ['2211', '1222', '2121', '1112'],
    topicId: 'disputes',
    clientContext: { clientName: 'שמעון', gender: 'male', marital: 'divorced', age: 52 },
  },

  // ── 18. פחד / סכנה ───────────────────────────────────────────────────────
  {
    label:   'פחד וסכנה (fear)',
    question:'קיבלתי איומים קשים מגורם לא ידוע — האם הסכנה ממשית וכיצד להישמר?',
    mothers: ['2221', '1212', '1121', '2122'],
    topicId: 'fear',
    clientContext: { clientName: 'נאדיה', gender: 'female', marital: 'single', age: 27 },
  },

  // ── 19. אהבה ושנאה ───────────────────────────────────────────────────────
  {
    label:   'אהבה ושנאה (loveHate)',
    question:'האיש הזה מתנהג בצורה מבלבלת — לפעמים אוהב ולפעמים קר — האם הרגשותיו כלפי אמיתיות?',
    mothers: ['2211', '2122', '1111', '1221'],
    topicId: 'loveHate',
    clientContext: { clientName: 'מירב', gender: 'female', marital: 'single', age: 31 },
  },

  // ── 20. השלמת הדבר ────────────────────────────────────────────────────────
  {
    label:   'השלמת הדבר (completion)',
    question:'יש לי פרויקט גדול שהתחלתי ונתקע — האם יסתיים בהצלחה ומתי יש לצפות לסיום?',
    mothers: ['2121', '2212', '2211', '1122'],
    topicId: 'completion',
    clientContext: { clientName: 'קרים', gender: 'male', marital: 'married', age: 39 },
  },

  // ── 21. אחים / שכנים ─────────────────────────────────────────────────────
  {
    label:   'אחים ושכנים (siblings)',
    question:'יש סכסוך ירושה עם אחי — האם נגיע להסכמה, מי יקבל יותר ואיך תסתיים המחלוקת?',
    mothers: ['1211', '2121', '1122', '2212'],
    topicId: 'siblings',
    clientContext: { clientName: 'זינב', gender: 'female', marital: 'married', age: 46 },
  },

  // ── 22. מוות / ירושה ─────────────────────────────────────────────────────
  {
    label:   'מוות וירושה (deathInheritance)',
    question:'הדוד שלי נפטר לפני חודש ועזב רכוש רב — האם אקבל את חלקי בירושה, או שיש מחלוקת?',
    mothers: ['1222', '2212', '2121', '1111'],
    topicId: 'deathInheritance',
    clientContext: { clientName: 'ג׳מאל', gender: 'male', marital: 'married', age: 43 },
  },

  // ── 23. יסודות ────────────────────────────────────────────────────────────
  {
    label:   'יסודות גורל החול — סקר תחומי חיים (foundations)',
    question:'תן לי מבט כולל על מצבי — מה חזק, מה חלש, ומה הכיוון הכללי בחיי עכשיו?',
    mothers: ['2112', '1111', '2212', '1221'],
    topicId: 'foundations',
    clientContext: { clientName: 'עמרם', gender: 'male', marital: 'married', age: 50 },
  },

  // ── 24. פתיחה כללית ──────────────────────────────────────────────────────
  {
    label:   'פתיחה כללית (generalReading)',
    question:'תן לי תמונה כללית של מצבי בכל תחומי החיים — פרנסה, בריאות, זוגיות ועתיד קרוב',
    mothers: ['2211', '1212', '2212', '1121'],
    topicId: 'generalReading',
    clientContext: { clientName: 'מרים', gender: 'female', marital: 'married', age: 37 },
  },

  // ── 25. לוח קיצוני — כל הצורות נחסות ────────────────────────────────────
  {
    label:   'לוח קיצוני — 4 אמהות נחסות (edge case: all malefic)',
    question:'חיי הרוסים לחלוטין — אבדתי עבודה, בריאות ומשפחה בשנה אחת — מה קורה לי ואיפה נגמר?',
    mothers: ['2221', '1121', '2122', '1112'],  // שפל ראש, נלחם, אדום, סף יוצא — כולם נחסים
    topicId: 'spiritualDiagnostics',
    clientContext: { clientName: 'עלי', gender: 'male', marital: 'divorced', age: 47 },
  },
];

// ─── Run all tests ─────────────────────────────────────────────────────────────
let passed = 0, warned = 0, failed = 0;

for (const t of tests) {
  console.log('\n' + '═'.repeat(70));
  console.log(`📌 נושא: ${t.label}`);
  console.log(`❓ שאלה: ${t.question}`);
  console.log(`👤 לקוח: ${t.clientContext.clientName} | ${t.clientContext.gender === 'female' ? 'נקבה' : 'זכר'} | גיל ${t.clientContext.age} | ${t.clientContext.marital}`);
  console.log('─'.repeat(70));

  try {
    const board  = makeBoard(t.mothers, t.topicId, t.question, t.clientContext);
    const result = interpretHawiQuestionInitial(t.question, board);

    console.log(`🏷  topicId: ${result.topicId} (ביטחון: ${result.confidence})`);
    console.log(`⭐ ציון: ${result.boardScore?.score ?? 'N/A'} | דרגה: ${result.boardScore?.grade ?? 'N/A'}`);

    const h1  = result.boardAnalysis?.houses?.find(h => h.house === 1);
    const h7  = result.boardAnalysis?.houses?.find(h => h.house === 7);
    const h15 = result.boardAnalysis?.houses?.find(h => h.house === 15);
    console.log(`🏠 בית 1 (שואל): ${h1?.figureHebrew ?? '—'} (${h1?.fortune ?? '—'})`);
    console.log(`🏠 בית 7 (שאול עליו): ${h7?.figureHebrew ?? '—'} (${h7?.fortune ?? '—'})`);
    console.log(`🏠 בית 15 (דיין): ${h15?.figureHebrew ?? '—'} (${h15?.fortune ?? '—'})`);

    const conclusion = result.finalConclusionHebrew || '';
    const wordCount  = conclusion.trim().split(/\s+/).length;
    let testWarn     = false;

    // בדיקת null
    if (conclusion.includes('null')) {
      console.log('🐛 BUG: המסקנה מכילה "null"');
      conclusion.split('\n').filter(l => l.includes('null'))
        .forEach(l => console.log('   >> ' + l));
      testWarn = true;
    }

    // בדיקת ניתוב נושא
    if (result.topicId !== t.topicId) {
      console.log(`⚠️  ניתוב שגוי! ציפינו: ${t.topicId} | קיבלנו: ${result.topicId}`);
      testWarn = true;
    }

    // בדיקת אורך מסקנה
    if (wordCount < 20) {
      console.log(`⚠️  מסקנה קצרה: ${wordCount} מילים בלבד`);
      testWarn = true;
    }

    console.log(`\n📄 מסקנה (${wordCount} מילים):`);
    conclusion.split('\n').forEach(line => { if (line.trim()) console.log('  ' + line); });

    testWarn ? warned++ : passed++;

  } catch (err) {
    console.log(`❌ שגיאה: ${err.message}`);
    console.log(err.stack?.split('\n').slice(0, 4).join('\n'));
    failed++;
  }
}

console.log('\n' + '═'.repeat(70));
console.log(`✅ עברו: ${passed} | ⚠️  אזהרות: ${warned} | ❌ נכשלו: ${failed} | סה"כ: ${tests.length}`);
