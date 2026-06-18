/**
 * Full engine test — runs real boards for each major topic
 * and prints finalConclusionHebrew + topicId + grade + bugs observed.
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { interpretHawiQuestionInitial } from './goral-hachol/engine/hawi-interpreter.js';

// ─── buildChartFromBoard (copied from ui/goral-hachol-ui.js, inline for test) ─
import { HAWI_FIGURE_NAMES } from './goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js';
const NAMES_BY_ID = Object.fromEntries(HAWI_FIGURE_NAMES.map(f => [f.id, f]));
const NAMES_BY_PATTERN = Object.fromEntries(HAWI_FIGURE_NAMES.map(f => [f.pattern, f]));

function buildChartFromBoard(board) {
  return (board.houses || []).map(h => {
    const figureId = h.figureId || null;
    const meta = figureId
      ? (NAMES_BY_ID[figureId] || NAMES_BY_ID[figureId.replace('hawi-figure-', '')] || null)
      : null;
    return {
      house: h.houseNumber || h.house,
      figureId,
      shortId: meta?.shortId || null,
      key: meta?.pattern || null,
      hebrew: meta?.hebrewName || h.figure?.hebrewName || null,
      fortune: meta?.fortuneHebrew || null,
      movement: meta?.movementHebrew || null,
      element: meta?.elementHebrew || null,
      elementHebrew: meta?.elementHebrew || null,
    };
  });
}

function makeBoard(mothers, topicId, question, clientName = 'ראובן') {
  const board = buildRamlBoardFromMothers(mothers);
  board.chart = buildChartFromBoard(board);
  board.topicId = topicId;
  board.clientContext = { clientName };
  board.question = question;
  return board;
}

// ─── 16 figure patterns ───────────────────────────────────────────────────────
// 1111=דרך  1112=סף יוצא  1121=נלחם  1122=כבוד יוצא
// 1211=בר הלחי  1212=ממון יוצא  1221=סוהר  1222=נשוא ראש
// 2111=סף נכנס  2112=חיבור  2121=ממון נכנס  2122=אדום
// 2211=כבוד נכנס  2212=לבן  2221=שפל ראש  2222=קהלה

// ─── Test cases ───────────────────────────────────────────────────────────────
const tests = [
  {
    label: 'גניבה (מי גנב)',
    question: 'מי גנב לי את הספר כתב היד מהבית',
    // H1=חיבור(2112) H2=דרך(1111) H3=שפל ראש(2221) H4=כבוד יוצא(1122)
    mothers: ['2112', '1111', '2221', '1122'],
    topicId: 'theft',
  },
  {
    label: 'נישואין',
    question: 'האם זה הזמן להתחתן עם השידוך שהוצע לי',
    // H1=כבוד נכנס (טוב) H2=נשוא ראש H3=חיבור H4=לבן
    mothers: ['2211', '1222', '2112', '2212'],
    topicId: 'marriage',
  },
  {
    label: 'מחלה',
    question: 'האם המחלה שלי תחלוף ואחלים',
    // H1=שפל ראש (נחס) H2=אדום H3=סף יוצא H4=ממון יוצא
    mothers: ['2221', '2122', '1112', '1212'],
    topicId: 'illness',
  },
  {
    label: 'נסיעה',
    question: 'האם מומלץ לנסוע לחו"ל בחודש הבא',
    // H1=דרך (טוב לנסיעה) H2=נלחם H3=כבוד יוצא H4=ממון נכנס
    mothers: ['1111', '1121', '1122', '2121'],
    topicId: 'travel',
  },
  {
    label: 'נעדר',
    question: 'האח שלי נעדר כבר שלושה ימים — האם הוא בסדר ויחזור',
    // H1=נשוא ראש H2=לבן H3=חיבור H4=סוהר
    mothers: ['1222', '2212', '2112', '1221'],
    topicId: 'missingPerson',
  },
  {
    label: 'אבחון רוחני (כישוף)',
    question: 'האם עשו עלי כישוף שמונע ממני להצליח',
    // H1=אדום H2=סף נכנס H3=קהלה H4=שפל ראש (נחסים חזקים)
    mothers: ['2122', '2111', '2222', '2221'],
    topicId: 'spiritualDiagnostics',
  },
  {
    label: 'מטמון נסתר',
    question: 'האם יש אוצר קבור בשדה שרכשתי',
    // H1=בר הלחי H2=ממון נכנס H3=כבוד נכנס H4=לבן
    mothers: ['1211', '2121', '2211', '2212'],
    topicId: 'hiddenTreasure',
  },
  {
    label: 'שלטון / מדינה (authorityState)',
    question: 'האם השר ישמור על תפקידו לאחר הבחירות',
    // H1=כבוד יוצא H2=ממון יוצא H3=שפל ראש H4=אדום
    mothers: ['1122', '1212', '2221', '2122'],
    topicId: 'authorityState',
  },
  {
    label: 'תחזית שנתית (yearlyForecast)',
    question: 'מה צפוי לי השנה בפרנסה ובבריאות',
    // H1=ממון נכנס H2=נשוא ראש H3=לבן H4=חיבור
    mothers: ['2121', '1222', '2212', '2112'],
    topicId: 'yearlyForecast',
  },
  {
    label: 'מולד / נטיביטי (birthNativity)',
    question: 'מה אומר הלוח על אופי ועתיד הנולד',
    // H1=נלחם H2=כבוד נכנס H3=דרך H4=בר הלחי
    mothers: ['1121', '2211', '1111', '1211'],
    topicId: 'birthNativity',
  },
  {
    label: 'מסחר',
    question: 'האם כדאי לי להשקיע כסף בעסקה עם השותף',
    // H1=ממון נכנס H2=כבוד נכנס H3=נשוא ראש H4=לבן
    mothers: ['2121', '2211', '1222', '2212'],
    topicId: 'commerce',
  },
  {
    label: 'ילדים / הריון',
    question: 'האם אשתי תיכנס להריון השנה',
    mothers: ['2211', '1222', '2212', '2121'],
    topicId: 'childrenPregnancy',
  },
  {
    label: 'אסיר / כלא',
    question: 'האם בני האסור ייצא מהכלא בקרוב',
    mothers: ['1221', '2112', '1222', '2121'],
    topicId: 'prisoner',
  },
  {
    label: 'שותפות / ערבות',
    question: 'האם כדאי להיכנס לשותפות עסקית עם חבר',
    mothers: ['2211', '1111', '2121', '1122'],
    topicId: 'partnership',
  },
  {
    label: 'מסע ים',
    question: 'האם המסע בספינה בטוח וכדאי לצאת',
    mothers: ['1111', '2122', '1222', '2112'],
    topicId: 'seaVoyage',
  },
  {
    label: 'גנבה (theft — נושא נפרד)',
    question: 'נגנב לי הארנק — מי גנב ואיפה הוא',
    mothers: ['2122', '1221', '2212', '1111'],
    topicId: 'theft',
  },
  {
    label: 'סכסוך / תביעה (disputes)',
    question: 'יש לי ריב עם השכן על הגבול — מי ינצח בבית משפט',
    mothers: ['2211', '1222', '2121', '1112'],
    topicId: 'disputes',
  },
  {
    label: 'פחד / סכנה (fear)',
    question: 'אני מפחד מהאיום שקיבלתי — האם יש סכנה ממשית',
    mothers: ['2221', '1212', '1121', '2122'],
    topicId: 'fear',
  },
  {
    label: 'אהבה ושנאה (loveHate)',
    question: 'האם האיש הזה אוהב אותי באמת או שהוא עושה מניפולציה',
    mothers: ['2211', '2122', '1111', '1221'],
    topicId: 'loveHate',
  },
  {
    label: 'השלמת הדבר (completion)',
    question: 'האם הפרויקט שהתחלתי יסתיים בהצלחה',
    mothers: ['2121', '2212', '2211', '1122'],
    topicId: 'completion',
  },
  {
    label: 'אחים / שכנים (siblings)',
    question: 'האם אחי יעזור לי בזמן הצרה',
    mothers: ['1211', '2121', '1122', '2212'],
    topicId: 'siblings',
  },
  {
    label: 'מוות / ירושה (deathInheritance)',
    question: 'האם אקבל את ירושת הדוד שנפטר',
    mothers: ['1222', '2212', '2121', '1111'],
    topicId: 'deathInheritance',
  },
  {
    label: 'יסודות גורל החול (foundations)',
    question: 'מה הם יסודות גורל החול וכיצד עובד הלוח',
    mothers: ['2112', '1111', '2212', '1221'],
    topicId: 'foundations',
  },
  {
    label: 'פתיחה כללית (generalReading)',
    question: 'תן לי תמונה כללית של מצבי בכל תחומי החיים',
    // H1=כבוד נכנס(2211/סעד) H2=ממון יוצא(1212/נחס) H3=לבן(2212/סעד) H4=נלחם(1121/נחס)
    mothers: ['2211', '1212', '2212', '1121'],
    topicId: 'generalReading',
  },
];

// ─── Run all tests ─────────────────────────────────────────────────────────────
for (const t of tests) {
  console.log('\n' + '═'.repeat(70));
  console.log(`📌 נושא: ${t.label}`);
  console.log(`❓ שאלה: ${t.question}`);
  console.log('─'.repeat(70));
  try {
    const board = makeBoard(t.mothers, t.topicId, t.question);
    const result = interpretHawiQuestionInitial(t.question, board);

    // Print key diagnostics
    console.log(`🏷  topicId מזוהה: ${result.topicId} (ביטחון: ${result.confidence})`);
    console.log(`⭐ ציון: ${result.boardScore?.score ?? 'N/A'} | דרגה: ${result.boardScore?.grade ?? 'N/A'}`);

    // Print boards houses 1, 7, 15
    const h1  = result.boardAnalysis?.houses?.find(h => h.house === 1);
    const h7  = result.boardAnalysis?.houses?.find(h => h.house === 7);
    const h15 = result.boardAnalysis?.houses?.find(h => h.house === 15);
    console.log(`🏠 בית 1: ${h1?.figureHebrew ?? '—'} (${h1?.fortune ?? '—'})`);
    console.log(`🏠 בית 7: ${h7?.figureHebrew ?? '—'} (${h7?.fortune ?? '—'})`);
    console.log(`🏠 בית 15 (דיין): ${h15?.figureHebrew ?? '—'} (${h15?.fortune ?? '—'})`);

    // Check for null bug
    const conclusion = result.finalConclusionHebrew || '';
    const hasNullBug = conclusion.includes('null');
    if (hasNullBug) {
      console.log('🐛 BUG: המסקנה מכילה "null"');
      console.log('   >> ' + conclusion.split('\n').filter(l => l.includes('null')).join('\n   >> '));
    }

    // Print final conclusion
    console.log('\n📄 מסקנה סופית:');
    conclusion.split('\n').forEach(line => {
      if (line.trim()) console.log('  ' + line);
    });

    // Check topic routing
    if (result.topicId !== t.topicId) {
      console.log(`⚠️  נושא לא תואם! ציפינו: ${t.topicId}, קיבלנו: ${result.topicId}`);
    }

    // Check conclusion depth
    const wordCount = conclusion.trim().split(/\s+/).length;
    if (wordCount < 20) {
      console.log(`⚠️  מסקנה קצרה מאוד: ${wordCount} מילים`);
    }

  } catch (err) {
    console.log(`❌ שגיאה: ${err.message}`);
    console.log(err.stack?.split('\n').slice(0, 5).join('\n'));
  }
}

console.log('\n' + '═'.repeat(70));
console.log('✅ סיום ריצת הבדיקות');
