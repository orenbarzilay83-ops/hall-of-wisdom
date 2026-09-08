#!/usr/bin/env node
import fs from 'node:fs';

const path = '_patch_kashf_professional_backfill_08.mjs';
let text = fs.readFileSync(path, 'utf8');
const lines = text.split('\n');
const idx = lines.findIndex((line) => line.includes('## Batch 08 — p179 Money Source raw-scan closure'));
if (idx < 0) throw new Error('Batch 08 status append line not found');
lines[idx] = "  s += '\\n\\n## Batch 08 — p179 Money Source raw-scan closure\\n\\nBatch 08 סגר את פער המקור של `money.p179.sourceByIncomingHonorHouse` מול הסריקה הראשית. במקום הניסוח העברי הרך \"יש בה צד מיטיב\", המקור הערבי המודפס בעמ׳ 179 אומר במפורש: `وإن كان في الثاني سعد، فاطلب النصرة الداخلة`. לכן ה-executor הקיים, שדרש H2 מיטיב טהור (`saad`) ולא קידם צורה ממוזגת, היה שמרני ונכון. השיטה הוסמכה עם Golden Cases לערוץ H10, לריבוי ערוצים ול-H2 ממוזג שאינו פותח את השער.\\n';";
text = lines.join('\n');
fs.writeFileSync(path, text, 'utf8');
console.log('Batch 08 patcher syntax repaired.');
