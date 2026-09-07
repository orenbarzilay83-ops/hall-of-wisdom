#!/usr/bin/env node
import fs from 'node:fs';

const path = 'goral-hachol/engine/kashf-canonical-executors.js';
let text = fs.readFileSync(path, 'utf8');

function replaceOnce(needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) throw new Error(`Missing repair anchor: ${label}`);
  if (text.indexOf(needle, first + needle.length) >= 0) throw new Error(`Non-unique repair anchor: ${label}`);
  text = text.slice(0, first) + replacement + text.slice(first + needle.length);
}

replaceOnce(
  'המקור אינו אומר שאחת משתי האפשרויות טובה יותר כאשר שני הזוגות עומדים בתנאי.',
  'המקור אינו מדרג בין שתי האפשרויות כאשר שני הזוגות עומדים בתנאי.',
  'both-good ranking wording'
);
replaceOnce(
  'הזוג 1+4 אינו עומד כאן בתנאי החיובי המפורש למגורים; אין להפוך זאת לבדו לדין שהמקום הנוכחי רע.',
  'הזוג 1+4 אינו עומד כאן בתנאי החיובי המפורש למגורים; אין להסיק מכך לבדו דין שלילי על המקום הנוכחי.',
  'move-good negative wording'
);

fs.writeFileSync(path, text);
console.log('Applied narrow p183 wording repair for source-safe regression assertions.');
