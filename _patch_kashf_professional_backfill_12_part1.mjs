#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text, 'utf8'); }
function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}
function replaceBetween(text, start, end, replacement, label) {
  const i = text.indexOf(start);
  if (i === -1) throw new Error(`${label}: start anchor not found`);
  const j = text.indexOf(end, i + start.length);
  if (j === -1) throw new Error(`${label}: end anchor not found`);
  if (text.indexOf(start, i + 1) !== -1) throw new Error(`${label}: start anchor is not unique`);
  return text.slice(0, i) + replacement + text.slice(j);
}

const P211_SOURCE_HEBREW = 'בבית השביעי: אם שכנו בו צורות פנימיות, הדבר מורה על יישוב הדעת ועל קיום מצב הנישואין. צורה מזיקה פנימית מורה על עגמת נפש ומריבה, אבל החלק קבוע. צורה מיטיבה חיצונית מורה על נישואין טובים, אך אפשר שתהיה פרידה מפני שהחלק אינו קבוע. צורה מזיקה חיצונית מורה שאין כאן נישואין ראויים, ואם כבר היו — החלק נחתך ונפסק ואין בו טוב. צורה מיטיבה וקבועה מורה על תיקון בית המשכב. צורה מזיקה וקבועה מורה שאין תיקון לבית המשכב, שנמשך רוע בין בני הזוג, ומקורו מן האיש. צורה מיטיבה ומתַהפכת מורה על יישוב, שמחה וששון בבית המשכב, על אהבת אחד מהם לאחר, ועל עושר ועונג. צורה מזיקה ומתַהפכת מורה שאין כאן נישואין, שהדבר הולך לרעה ולפירוד; ובלשון המקור: העזיבה עדיפה.';

// 1) Complete the p211 canonical executor from the full source matrix on scan p211.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let text = read(path);
  const start = '// Kashf v57 p211 — H7 marriage stability/dissolution matrix.\nfunction computeMarriageDissolutionP211(chart) {';
  const end = '// Kashf v57 p249 — return sign for a missing/absent male from angles + judge.';
  const replacement = `// Kashf v57 p211 — complete H7 marriage stability/dissolution matrix.\n// The scan gives all internal/external/fixed/mutable branches. Fixed and mutable\n// figures include Kashf source classes recorded in the catalogue as mixed-benefic\n// or mixed-malefic; for THIS matrix only, their explicit source tendency supplies\n// the سعد/نحس side of the printed branch. This local rule must not leak into\n// methods where mixed figures are intentionally unresolved.\nfunction computeMarriageDissolutionP211(chart) {\n  if (!Array.isArray(chart)) return null;\n  const h7 = findCanonicalHouse(chart, 7);\n  const pattern = h7?.key || h7?.pattern || null;\n  if (!pattern) return null;\n  const classification = classifyCanonicalFigure(pattern);\n  const fortune = classification.saadNahs;\n  const state = classification.dakhalKharij;\n  const sourceValence = fortune === 'saad'\n    ? 'saad'\n    : fortune === 'nahs'\n      ? 'nahs'\n      : classification.mixedTendency === 'saad'\n        ? 'saad'\n        : classification.mixedTendency === 'nahs'\n          ? 'nahs'\n          : null;\n  const sourceValenceBasis = fortune === 'mixed' ? 'mixed-tendency-for-p211-only' : 'pure-fortune';\n\n  let sourceOutcome = 'unresolved';\n  let sourceOutcomeHebrew = 'הצירוף אינו מקבל ענף מפורש בכלל זה';\n\n  if (state === 'dakhil') {\n    if (sourceValence === 'nahs') {\n      sourceOutcome = 'stable-with-quarrel';\n      sourceOutcomeHebrew = 'עגמת נפש ומריבה, אבל מצב הנישואין קבוע';\n    } else if (sourceValence === 'saad') {\n      sourceOutcome = 'stable';\n      sourceOutcomeHebrew = 'יישוב הדעת וקיום מצב הנישואין';\n    }\n  } else if (state === 'kharij' && sourceValence === 'saad') {\n    sourceOutcome = 'good-but-separation-possible';\n    sourceOutcomeHebrew = 'נישואין טובים, אך פרידה אפשרית מפני שהחלק אינו קבוע';\n  } else if (state === 'kharij' && sourceValence === 'nahs') {\n    sourceOutcome = 'breakdown-if-existing';\n    sourceOutcomeHebrew = 'אין כאן נישואין ראויים; ואם כבר היו — החלק נחתך ונפסק ואין בו טוב';\n  } else if (state === 'mujassad-dakhil' && sourceValence === 'saad') {\n    sourceOutcome = 'fixed-benefic-repair';\n    sourceOutcomeHebrew = 'צורה מיטיבה וקבועה — תיקון בית המשכב';\n  } else if (state === 'mujassad-dakhil' && sourceValence === 'nahs') {\n    sourceOutcome = 'fixed-malefic-distress-origin-man';\n    sourceOutcomeHebrew = 'צורה מזיקה וקבועה — אין תיקון לבית המשכב; נמשך רוע בין בני הזוג, ומקורו מן האיש';\n  } else if (state === 'mujassad-kharij' && sourceValence === 'saad') {\n    sourceOutcome = 'mutable-benefic-joy-love-wealth';\n    sourceOutcomeHebrew = 'צורה מיטיבה ומתַהפכת — יישוב, שמחה וששון בבית המשכב; אהבת אחד מהם לאחר; ועושר ועונג';\n  } else if (state === 'mujassad-kharij' && sourceValence === 'nahs') {\n    sourceOutcome = 'mutable-malefic-breakdown-separation';\n    sourceOutcomeHebrew = 'צורה מזיקה ומתַהפכת — אין כאן נישואין; הדבר הולך לרעה ולפירוד; ובלשון המקור: העזיבה עדיפה';\n  }\n\n  const figureHebrew = classification.figureHebrew || h7?.hebrew || h7?.hebrewName || pattern;\n  const unresolvedNote = sourceOutcome === 'unresolved'\n    ? ' המקור אינו נותן בקטע זה דין מפורש לצירוף הנוכחי, ולכן אין להשלים גירושין או יציבות מן הדעת.'\n    : '';\n\n  return {\n    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 211; אימות מול הסריקה הערבית עמ׳ 211',\n    sourceText: P211_SOURCE_HEBREW_RUNTIME,\n    housesUsed: [7],\n    h7Pattern: pattern,\n    h7FigureHebrew: figureHebrew,\n    classification,\n    sourceValence,\n    sourceValenceBasis,\n    sourceOutcome,\n    sourceOutcomeHebrew,\n    positive: null,\n    verdictType: 'marriage-stability-dissolution',\n    outputHebrew: 'בית 7: ' + figureHebrew + ' (' + pattern + ') — ' + (classification.saadNahsHebrew || fortune || 'ללא סיווג') + ', ' + (classification.dakhalKharijHebrew || state || 'ללא מצב') + '. לפי כשף v57 עמ׳ 211: ' + sourceOutcomeHebrew + '.' + unresolvedNote,\n  };\n}\n\n`;
  // Define the source string once in the executor file immediately before the method.
  const withRuntimeConst = replacement.replace(
    'function computeMarriageDissolutionP211(chart) {',
    `const P211_SOURCE_HEBREW_RUNTIME = ${JSON.stringify(P211_SOURCE_HEBREW)};\n\nfunction computeMarriageDissolutionP211(chart) {`,
  );
  text = replaceBetween(text, start, end, withRuntimeConst, 'replace complete p211 executor');
  write(path, text);
}

// 2) Promote the verified missing branches into the operational v57 knowledge layer.
{
  const path = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
  let text = read(path);
  const oldRule = "    hebrewRule: 'בבית השביעי: אם שכנו בו צורות פנימיות, הדבר מורה על יישוב הדעת ועל קיום מצב הנישואין. צורה מזיקה פנימית מורה על עגמת נפש ומריבה, אבל החלק קבוע. צורה מיטיבה חיצונית מורה על נישואין טובים אך אפשר שייפרד ממנה, מפני שהחלק אינו קבוע. צורה מזיקה חיצונית מורה שאין כאן נישואין ראויים, ואם כבר היו — החלק נחתך ונפסק. צורה מיטיבה וקבועה מורה על תיקון בית המשכב.',";
  text = replaceOnce(text, oldRule, `    hebrewRule: ${JSON.stringify(P211_SOURCE_HEBREW)},`, 'p211 v57 full source matrix');
  text = replaceOnce(
    text,
    "    notes: 'יש לשמר את מטריצת מצב הצורה ולא לצמצם אותה למיטיב/מזיק בלבד.',",
    "    verificationNotes: 'הסריקה הערבית עמ׳ 211 משלימה במפורש שלושה ענפים שחסרו בנוסח התפעולי הקודם: מזיק-קבוע, מיטיב-מתהפך ומזיק-מתהפך. הם הועלו ל-v57 רק לאחר אימות המקור.',\n    notes: 'יש לשמר את מטריצת מצב הצורה המלאה. בענפי קבוע/מתהפך משתמשים בנטיית מיטיב/מזיק של צורות ממוזגות רק בתוך p211, משום שבלעדיה אין לצורות הקבועות/מתהפכות את זוג ענפי سعد/نحس שהמקור עצמו מציין. אין להחיל כלל זה על שיטות אחרות.',",
    'p211 v57 verification note',
  );
  write(path, text);
}

// 3) Update canonical method provenance after source closure.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let text = read(path);
  text = replaceOnce(
    text,
    "    notes: 'Canonical p211 marriage stability/dissolution executor is wired from H7 quality plus state. Internal figures support continuation; internal malefic adds quarrel while preserving continuity. External pure benefic gives a good marriage with possible separation; external pure malefic gives the explicit breakdown/cut-off branch. Pure benefic fixed gives the stated repair condition. Unstated mixed/mutable combinations remain unresolved.',",
    "    notes: 'Canonical p211 H7 matrix is source-closed against scan p211. Internal, external, fixed and mutable branches are all implemented. Internal/external figures use their pure source fortune. Fixed/mutable figures require the catalogue mixed tendency to realize the source\'s explicit سعد/نحس split; that promotion is method-local to p211 and must not leak to other methods. Benefic-external remains only possible separation, not certain separation; the adverse mutable source phrase that leaving is preferable is preserved as source wording, not converted into independent advisor advice.',",
    'p211 method registry source closure note',
  );
  write(path, text);
}

console.log('Professional Verdict Safety backfill batch 12 part 1 applied.');
