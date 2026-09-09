#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text, 'utf8'); }

function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}

function replaceRegexOnce(text, regex, to, label) {
  const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
  const matches = [...text.matchAll(new RegExp(regex.source, flags))];
  if (matches.length !== 1) throw new Error(`${label}: expected exactly 1 regex match, found ${matches.length}`);
  return text.replace(regex, to);
}

// ---------------------------------------------------------------------------
// 8) Status document: 42/43 and only p211 remains.
// ---------------------------------------------------------------------------
{
  const path = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
  let text = read(path);

  text = replaceOnce(text, '- מוסמכים מקצועית לאחר Batch 10: **41/43**.', '- מוסמכים מקצועית לאחר Batch 11: **42/43**.', 'status certified 42');
  text = replaceOnce(text, '- ממתינים להסמכה רטרואקטיבית: **2/43**.', '- ממתינים להסמכה רטרואקטיבית: **1/43**.', 'status pending 1');

  const rowAnchor = "| missing.p248-249.lifeH1H4H9Outcome | certified | PV-BF10-P248-* |";
  const rowIndex = text.indexOf(rowAnchor);
  if (rowIndex === -1) throw new Error('status p248 row anchor not found');
  const rowEnd = text.indexOf('\n', rowIndex);
  if (rowEnd === -1) throw new Error('status p248 row line ending not found');
  text = text.slice(0, rowEnd + 1)
    + "| profession.p254.h9Planet | certified | PV-BF11-P254-* | H9 נקבע מטבלת הייחוס המלאה עמ׳ 133–134: נלחם→נוגה, סוהר→שבתאי, ראש=1212, זנב=1112; H10/H11 הם רק סייג חד-כיווני של קלות ודורשים שני מיטיבים טהורים |\n"
    + text.slice(rowEnd + 1);

  text = replaceRegexOnce(
    text,
    /\n### profession\.p254\.h9Planet\n\n- מיפוי סוג המקצוע[\s\S]*?השיטה נשארת \*\*pending-backfill\*\*\.\n/,
    '\n',
    'remove old p254 pending block',
  );

  text = replaceOnce(
    text,
    'לאחר Batch 10 נותרו שני runnable methods ללא הסמכה: `marriage.p211.dissolutionH7StateMatrix` ו-`profession.p254.h9Planet`. שניהם נשארים חסומים ל-clientAnswerDraft עד Source Closure ייעודי.',
    'לאחר Batch 10 נותרו שני runnable methods ללא הסמכה: `marriage.p211.dissolutionH7StateMatrix` ו-`profession.p254.h9Planet`. שניהם נשארו חסומים ל-clientAnswerDraft עד Source Closure ייעודי.',
    'preserve historical batch10 sentence',
  );

  text += [
    '',
    '## Batch 11 — p254 Profession complete attribution closure',
    '',
    'Batch 11 סגר את `profession.p254.h9Planet` מול הסריקה והטבלה בעמ׳ 133–134 והדין בעמ׳ 254. התברר שהמפה הישנה הייתה חסרה ואף שייכה שתי צורות למקומות שגויים: נלחם (1121) שייך לנוגה, סוהר (1221) לשבתאי, ראש התלי הוא ממון יוצא (1212), וזנב התלי הוא סף יוצא (1112). לאחר התיקון מתקבלת חלוקה מלאה של כל 16 הצורות.',
    '',
    'המבצע הועבר מ-legacy helper ל-`custom-engine` קנוני. H9 לבדו קובע את סוג המלאכה לפי הייחוס; H10/H11 מפעילים רק את הסייג החד-כיווני "מלאכתו מעטה בטרחה" כאשר שניהם מיטיבים טהורים. צורה ממוזגת אינה מקודמת למיטיב, וכישלון התנאי אינו מתהפך לקביעה שהמלאכה קשה. ראש וזנב התלי מקבלים שני ענפים נפרדים ולא fallback מעורפל.',
    '',
    'לאחר Batch 11 המצב הוא **42/43**. ה-runnable method היחיד שנותר ללא הסמכה מקצועית הוא `marriage.p211.dissolutionH7StateMatrix`.',
    '',
  ].join('\n');

  write(path, text);
}

console.log('Professional Verdict Safety backfill batch 11 patch applied.');
