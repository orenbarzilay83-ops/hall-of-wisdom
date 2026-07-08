/**
 * _test_oren_advisor_panel_ui.mjs
 *
 * בדיקה אמיתית-בדפדפן (Playwright+Chromium, זמין בסביבת-ההרצה הזו) של
 * לוח-היועץ-הפנימי (Oren Smart Advisor Brain) שנוסף ל-goral-hachol.html/
 * goral-app.js. לא-מריצה זרימת-קריאה-מלאה (בחירת-אמהות וכו') — בודקת
 * ישירות את שתי-הפונקציות (buildMockOrenAdvisorBrainOutput/
 * renderOrenAdvisorPanel) בהקשר-הדף-האמיתי, עם reading מלאכותי-אך-ריאלי.
 *
 * שרת-סטטי מקומי-בלבד (http.createServer, ללא-חבילות-חיצוניות). אין
 * קריאת-רשת-חיצונית: כל בקשות-הדף נחסמות/נצפות כדי-לוודא שכפתור-ההעתקה
 * לא-שולח-כלום לרשת. אין AI, אין secret, אין deploy.
 */

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

// ── Playwright: ניסיון-רזולוציה-רגיל, ואם-לא-זמין — נתיב-הגלובלי-הידוע
// בסביבת-ההרצה-הזו (Claude Code Remote, ראו הערות-הסביבה). אם גם-זה
// נכשל, הבדיקה מדווחת-בבירור ויוצאת בלי-לקרוס-בשקט.
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  try {
    ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs'));
  } catch (err) {
    console.error('✗ Playwright לא-זמין בסביבה הזו — לא ניתן להריץ בדיקת-UI-בדפדפן.');
    console.error('  (הבדיקות האחרות ב-repo, כולל כל בדיקות ה-JS הטהורות, אינן-תלויות ב-Playwright ואינן-מושפעות.)');
    process.exit(1);
  }
}

// שרת-סטטי מינימלי לשורש-הריפו — כדי שיבואי-ES-Modules-יחסיים
// (import('/goral-hachol/engine/...')) יעבדו כמו-שהם-יעבדו-בפריסה-אמיתית.
const ROOT = path.resolve(__dirname);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = path.join(ROOT, urlPath === '/' ? '/goral-hachol.html' : urlPath);
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    const data = await readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}`;

const browser = await chromium.launch();
const page = await browser.newPage();

// ── מעקב-רשת: כל הבקשות שנשלחות מהדף, כדי-לוודא שכפתור-ההעתקה לא-שולח-כלום ──
const requestsDuringInteraction = [];
let trackingActive = false;
page.on('request', (req) => { if (trackingActive) requestsDuringInteraction.push(req.url()); });

// mock ל-clipboard — Playwright/Chromium חוסם clipboard-API-אמיתי-כברירת-מחדל
// ללא-הרשאות; מחליפים אותו במעקב-מקומי-בלבד כדי-לוודא-שהכפתור-קורא-לו.
// גם קובעים sessionStorage.userId-מזויף כדי-שמשמר-ה-login-הקיים (בראש-הדף)
// לא-יפנה-החוצה לפני-שהסקריפט-הראשי בכלל נטען — זה לא-שינוי-לקוד-האתר,
// רק-מצב-דפדפן-מקומי-לבדיקה-הזו.
await page.addInitScript(() => {
  window.__clipboardCalls = [];
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: async (text) => { window.__clipboardCalls.push(text); } },
    configurable: true,
  });
  sessionStorage.setItem('userId', 'test-uid-not-real');
});

// מיירטים את /supabase-client.js כדי-שבדיקת-ה-session (בתחתית-הדף, module-script
// נפרד ולא-קשור-לפאנל) לא-תפנה-אמיתית ל-Supabase ולא-תפנה-החוצה מהדף —
// מחזירים session-מזויף-מקומי-בלבד, בלי-לגעת-בקובץ-האמיתי-בריפו.
await page.route('**/supabase-client.js', (route) => route.fulfill({
  contentType: 'text/javascript',
  body: `export const supabase = {
    auth: {
      getSession: async () => ({ data: { session: { user: { id: 'test-uid-not-real', email: 'test@example.invalid' } } } }),
      signOut: async () => {},
    },
  };`,
}));

await page.goto(`${baseUrl}/goral-hachol.html`, { waitUntil: 'load' });

// ── 1. פאנל מופיע רק אחרי שיש קריאת-כשף (לפני-כן: ריק לגמרי) ────────────
console.log('\n--- 1. הפאנל ריק לפני-קריאה ---');
{
  const html = await page.$eval('#orenAdvisorPanel', (el) => el.innerHTML.trim());
  assert(html === '', 'orenAdvisorPanel ריק-לגמרי לפני שנקרא render');
}

// בונים reading מלאכותי-אך-ריאלי (במבנה זהה-למה-שמוחזר מ-buildKashfReading
// אחרי חיבור commerceSmartLayer) — לא-דורש-הרצת-אשף-הבחירה-המלא.
const fakeReading = {
  topicId: 'commerce',
  clientContext: { name: 'בדיקה', question: 'שאלה', quesitedName: 'שם-נישאל-לבדיקה' },
  commerceSmartLayer: {
    clientWording: 'בית המבקש בעסקה מראה חיבור — מזיקה.',
    practicalGuidance: 'עדיף להמתין או לבחון תנאים אחרים לפני שממשיכים.',
    certaintyLevel: 'medium',
  },
};

// ── 2. הרצת buildMockOrenAdvisorBrainOutput + renderOrenAdvisorPanel בהקשר-הדף ──
// כולל showScreen('kashf-reading') — כמו-בזרימה-האמיתית, שם הפאנל נרנדר
// בדיוק-כש-המסך-הזה הופך-לפעיל (ראו goral-app.js, ענף-הכשף ב-runReading).
const mockOutput = await page.evaluate(async (reading) => {
  const out = await window.buildMockOrenAdvisorBrainOutput(reading);
  window.renderOrenAdvisorPanel(out);
  window.showScreen('kashf-reading');
  return out;
}, fakeReading);

// ── 4. mock output כולל את 12 המפתחות ───────────────────────────────────
console.log('\n--- 4. 12 מפתחות ה-output ---');
{
  const REQUIRED_KEYS = ['module', 'advisorDiagnosis', 'clientAnswerDraft', 'engineCritique', 'missingKnowledgeOrRules', 'recommendedFix', 'codeInstructionForClaude', 'safetyNotes', 'privacyBlockedFields', 'nextBestAction', 'confidence', 'needsOrenDecision'];
  const hasAll = REQUIRED_KEYS.every((k) => k in mockOutput);
  assert(hasAll, `mock output כולל את כל 12 המפתחות (חסרים: ${REQUIRED_KEYS.filter((k) => !(k in mockOutput)).join(',') || 'none'})`);
  assert(mockOutput.codeInstructionForClaude.needed === true, 'quesitedName-לא-מנוצל → codeInstructionForClaude.needed === true (תרחיש-הדגמה)');
}

// ── 2 (המשך). הפאנל מכווץ כברירת-מחדל אחרי-render ───────────────────────
console.log('\n--- 2. מכווץ כברירת-מחדל ---');
{
  const bodyHidden = await page.$eval('#orenAdvisorBody', (el) => el.hidden);
  assert(bodyHidden === true, 'orenAdvisorBody מכווץ (hidden) מיד-אחרי-render, בלי-לחיצה');
  const panelHtml = await page.$eval('#orenAdvisorPanel', (el) => el.innerHTML);
  assert(panelHtml.includes('🔒') && panelHtml.includes('בינת אורן — לוח יועץ פנימי'), 'הכותרת המדויקת מופיעה, כולל 🔒');
  assert(panelHtml.includes('מצב בדיקה / MOCK — לא AI חי'), 'ה-badge המדויק מופיע');
}

// ── 3. פתיחת הפאנל מציגה את 7 האזורים ───────────────────────────────────
console.log('\n--- 3. פתיחה + 7 אזורים ---');
{
  await page.click('#orenAdvisorToggle');
  const bodyHiddenAfterClick = await page.$eval('#orenAdvisorBody', (el) => el.hidden);
  assert(bodyHiddenAfterClick === false, 'לחיצה על הכותרת פותחת את הפאנל (hidden=false)');

  const sectionTitles = await page.$$eval('.oren-advisor-section h4', (els) => els.map((e) => e.textContent));
  const expectedPrefixes = ['1. אבחון ליועץ', '2. טיוטת תשובה ללקוח', '3. ביקורת מנוע', '4. חוקים/ידע חסרים', '5. הוראה לקלוד קוד', '6. בטיחות ופרטיות', '7. פעולה מומלצת'];
  assert(sectionTitles.length === 7, `יש בדיוק 7 אזורים (בפועל: ${sectionTitles.length})`);
  const allMatch = expectedPrefixes.every((prefix, i) => sectionTitles[i]?.startsWith(prefix));
  assert(allMatch, `כל 7 הכותרות תואמות לסדר-הנדרש (בפועל: ${JSON.stringify(sectionTitles)})`);
}

// ── בדיקות-בטיחות: אין phone/dynFields-רגישים/sourceText/clientHistory גולמי ──
console.log('\n--- בטיחות: אין מידע-רגיש גולמי בפאנל ---');
{
  const panelText = await page.$eval('#orenAdvisorPanel', (el) => el.textContent);
  assert(!/05\d{8}/.test(panelText), 'אין דפוס-מספר-טלפון בפאנל');
  assert(!panelText.includes('sourceText'), 'אין הצגת sourceText גולמי');
  assert(!panelText.includes('clientHistorySummary'), 'אין הצגת clientHistorySummary גולמי');
}

// ── 5+6. כפתור-העתקה — clipboard בלבד, אין קריאת-רשת ─────────────────────
console.log('\n--- 5+6. כפתור העתקה ---');
{
  trackingActive = true;
  await page.click('#orenAdvisorCopyBtn');
  await page.waitForTimeout(150); // מספיק-זמן-לכל-בקשת-רשת-אפשרית-להירשם, אם-הייתה-קורית
  trackingActive = false;

  const clipboardCalls = await page.evaluate(() => window.__clipboardCalls);
  assert(clipboardCalls.length === 1, `הכפתור קרא ל-clipboard.writeText בדיוק פעם-אחת (בפועל: ${clipboardCalls.length})`);
  assert(clipboardCalls[0]?.includes('kashf-commerce-smart-layer.js'), 'התוכן-שהועתק כולל את הקובץ-לבדיקה מה-mock-instruction');

  const newRequestsAfterClick = requestsDuringInteraction.filter((u) => !u.startsWith(baseUrl));
  assert(newRequestsAfterClick.length === 0, `אין שום בקשת-רשת-חיצונית כתוצאה-מלחיצת-הכפתור (בפועל: ${JSON.stringify(newRequestsAfterClick)})`);
}

// ── 6 (הרחבה). מקרה-שני: engineCritique.hasProblem=false → אין כפתור-העתקה ──
console.log('\n--- מקרה-נגד: כשאין codeInstructionForClaude.needed, אין כפתור ---');
{
  const cleanReading = { topicId: 'money', clientContext: { name: 'בדיקה', question: 'שאלה' }, commerceSmartLayer: null };
  await page.evaluate(async (reading) => {
    const out = await window.buildMockOrenAdvisorBrainOutput(reading);
    window.renderOrenAdvisorPanel(out);
  }, cleanReading);
  const copyBtnExists = await page.$('#orenAdvisorCopyBtn');
  assert(copyBtnExists === null, 'כשאין codeInstructionForClaude.needed, כפתור-ההעתקה כלל-לא-מופיע ב-DOM');
}

// ── 8. אין שינוי בפלט-הקריאה-הרגיל (kashfReadingOutput נשאר-נפרד-לחלוטין) ──
console.log('\n--- 8. kashfReadingOutput לא-הושפע מהפאנל ---');
{
  const outputHtml = await page.$eval('#kashfReadingOutput', (el) => el.innerHTML.trim());
  assert(outputHtml === '', 'kashfReadingOutput נשאר ריק (לא-נגענו-בו כלל בבדיקה הזו) — מוכיח שהפאנל כתב רק ל-orenAdvisorPanel');
}

await browser.close();
server.close();

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. הפאנל ריק-לפני-קריאה, מכווץ-כברירת-מחדל, נפתח-ומציג 7-אזורים, מכיל 12-מפתחות, אין מידע-רגיש-גולמי, כפתור-ההעתקה עובד רק-דרך clipboard.writeText בלי-שום-קריאת-רשת, ולא-מופיע-כלל כש-לא-נדרש.');
