#!/usr/bin/env node
import fs from 'node:fs';

const path = '_patch_kashf_professional_backfill_08.mjs';
let text = fs.readFileSync(path, 'utf8');

// Repair the status-document append line whose nested Markdown backticks broke
// the patcher's own template literal.
const lines = text.split('\n');
const idx = lines.findIndex((line) => line.includes('## Batch 08 — p179 Money Source raw-scan closure'));
if (idx < 0) throw new Error('Batch 08 status append line not found');
lines[idx] = "  s += '\\n\\n## Batch 08 — p179 Money Source raw-scan closure\\n\\nBatch 08 סגר את פער המקור של `money.p179.sourceByIncomingHonorHouse` מול הסריקה הראשית. במקום הניסוח העברי הרך \"יש בה צד מיטיב\", המקור הערבי המודפס בעמ׳ 179 אומר במפורש: `وإن كان في الثاني سعد، فاطلب النصرة الداخلة`. לכן ה-executor הקיים, שדרש H2 מיטיב טהור (`saad`) ולא קידם צורה ממוזגת, היה שמרני ונכון. השיטה הוסמכה עם Golden Cases לערוץ H10, לריבוי ערוצים ול-H2 ממוזג שאינו פותח את השער.\\n';";
text = lines.join('\n');

// Batch 07 added policies after p204, so p204 is no longer the final registry
// entry. Anchor the new p179 registration after the actual final Batch-07 entry.
const oldFrom = '"  [P204_ATTENTION_METHOD]: p204AttentionPolicy(),\\n});"';
const oldTo = '"  [P204_ATTENTION_METHOD]: p204AttentionPolicy(),\\n  [P179_MONEY_SOURCE_METHOD]: p179MoneySourcePolicy(),\\n});"';
const newFrom = '"  [P167_HIDDEN_ACTION_METHOD]: p167HiddenActionPolicy(),\\n});"';
const newTo = '"  [P167_HIDDEN_ACTION_METHOD]: p167HiddenActionPolicy(),\\n  [P179_MONEY_SOURCE_METHOD]: p179MoneySourcePolicy(),\\n});"';
if (!text.includes(oldFrom) || !text.includes(oldTo)) throw new Error('Batch 08 p179 registration patch strings not found');
text = text.replace(oldFrom, newFrom).replace(oldTo, newTo);

fs.writeFileSync(path, text, 'utf8');
console.log('Batch 08 patcher bootstrap repairs applied.');
