#!/usr/bin/env node
import fs from 'node:fs';

const path = '_patch_kashf_professional_backfill_03.mjs';
let text = fs.readFileSync(path, 'utf8');
const oldBlock = "  'אם הוא `blocked` או `isSafe` אינו `true` — `clientAnswerDraft` חייב להיות `null`.',\n  'אם הוא `blocked` או `isSafe` אינו `true` — `clientAnswerDraft` חייב להיות `null`. כאשר `certificationStatus=\"certified\"` ו-`clientFacingCertified=true`, `clientAnswerDraft` אינו ניסוח חופשי: יש להעתיק מילה-במילה ורק את `professionalVerdictSafety.authoritativeClientDraftHebrew`. אסור לקצר, לפרפרז, לרכך, להחמיר, להחליף קטגוריה או להוסיף טענה. אם השדה חסר — `clientAnswerDraft` חייב להיות `null`.',";
const newBlock = "  '**בנוסף, `professionalVerdictSafety.certificationStatus` חייב להיות `certified` ו-`clientFacingCertified` חייב להיות true לפני שמותר להחזיר `clientAnswerDraft`; בכל מצב `pending-backfill`/`not-applicable` הטיוטה חייבת להיות null, גם אם המנוע עצמו runnable.**',\n  '**בנוסף, `professionalVerdictSafety.certificationStatus` חייב להיות `certified` ו-`clientFacingCertified` חייב להיות true לפני שמותר להחזיר `clientAnswerDraft`; בכל מצב `pending-backfill`/`not-applicable` הטיוטה חייבת להיות null, גם אם המנוע עצמו runnable.** כאשר המנוע certified, `clientAnswerDraft` אינו ניסוח חופשי: יש להעתיק מילה-במילה ורק את `professionalVerdictSafety.authoritativeClientDraftHebrew`. אסור לקצר, לפרפרז, לרכך, להחמיר, להחליף קטגוריה או להוסיף טענה. אם השדה חסר — `clientAnswerDraft` חייב להיות `null`.',";
if (!text.includes(oldBlock)) throw new Error('Batch03 patcher markdown-anchor block not found');
text = text.replace(oldBlock, newBlock);
fs.writeFileSync(path, text, 'utf8');
console.log('Batch03 patcher markdown anchor repaired.');
