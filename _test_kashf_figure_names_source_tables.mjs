#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
  HAWI_FIGURE_NAMES_BY_ID,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js';

const figure = (pattern) => HAWI_FIGURE_NAMES_BY_ID[pattern];

assert.equal(figure('2122').hebrewName, 'אדום');
assert.equal(figure('2122').purityHebrew, 'טהור וגם טמא-שניהם');

const seekerRows = [
  ['1222', 'נשוא ראש', 'طالب العلو'],
  ['1212', 'ממון יוצא', 'طالب غير القصد'],
  ['1211', 'בר הלחי', 'طالب الشر ضعيف'],
  ['1221', 'סוהר', 'طالب مأخوذ'],
  ['1122', 'כבוד יוצא', 'طالب قوي'],
  ['1112', 'סף יוצא', 'طالب غير مدرك'],
  ['1121', 'נלחם', 'طالب مفرط'],
  ['1111', 'דרך', 'طالب موجود'],
];

for (const [pattern, hebrewName, arabicStart] of seekerRows) {
  assert.equal(figure(pattern).hebrewName, hebrewName);
  assert.ok(figure(pattern).seekerSoughtArabic.startsWith(arabicStart));
  assert.equal(figure(pattern).seekerStatus, 'טאלב');
}

const soughtRows = [
  ['2221', 'שפל ראש', 'مطلوب، معدوم، سالم'],
  ['2222', 'קהלה', 'مطلوب، منتظر'],
  ['2211', 'כבוד נכנס', 'مطلوب، متكاثر'],
  ['2112', 'חיבור', 'مطلوب، موجود'],
  ['2121', 'ממון נכנס', 'مطلوب، ملحوق بالشرف'],
  ['2111', 'סף נכנס', 'مطلوب، بالرفق معدم'],
  ['2212', 'לבן', 'مطلوب، مخيل'],
  ['2122', 'אדום', 'مطلوب جدا'],
];

for (const [pattern, hebrewName, arabicStart] of soughtRows) {
  assert.equal(figure(pattern).hebrewName, hebrewName);
  assert.ok(figure(pattern).seekerSoughtArabic.startsWith(arabicStart));
  assert.equal(figure(pattern).seekerStatus, 'מטלוב');
}

console.log('KASHF p63–65 figure-name source-table tests: PASS');
