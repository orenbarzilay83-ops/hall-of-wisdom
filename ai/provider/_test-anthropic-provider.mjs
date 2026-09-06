// ai/provider/_test-anthropic-provider.mjs
//
// בדיקת-mock ידנית ל-callAnthropic. אין כאן קריאת-רשת אמיתית ואין
// מפתח אמיתי — global.fetch מוחלף זמנית בפונקציה מזויפת בכל בדיקה.
// בהשראת _test_engine.mjs הקיים בשורש הריפו (אותה מוסכמת: סקריפט
// node ישיר, בלי framework-בדיקות).

import { callAnthropic } from './anthropic-provider.js';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    failures++;
    console.error(`✗ ${message}`);
  } else {
    console.log(`✓ ${message}`);
  }
}

async function testSuccessPath() {
  const originalFetch = globalThis.fetch;
  let capturedUrl;
  let capturedInit;
  globalThis.fetch = async (url, init) => {
    capturedUrl = url;
    capturedInit = init;
    return {
      ok: true,
      status: 200,
      json: async () => ({ content: [{ type: 'text', text: 'תשובה מדומה' }] }),
    };
  };

  try {
    const result = await callAnthropic({
      apiKey: 'fake-key-not-real',
      model: 'claude-sonnet-5',
      system: 'system prompt',
      userMessage: 'user message',
    });

    assert(result.ok === true, 'מסלול-הצלחה: result.ok === true');
    assert(result.text === 'תשובה מדומה', 'מסלול-הצלחה: הטקסט חוזר כראוי');
    assert(capturedUrl === 'https://api.anthropic.com/v1/messages', 'מסלול-הצלחה: כתובת ה-API נכונה');
    assert(capturedInit.headers['x-api-key'] === 'fake-key-not-real', 'מסלול-הצלחה: header x-api-key מועבר');
    assert(capturedInit.headers['anthropic-version'] === '2023-06-01', 'מסלול-הצלחה: header anthropic-version קיים');
    const sentBody = JSON.parse(capturedInit.body);
    assert(sentBody.model === 'claude-sonnet-5', 'מסלול-הצלחה: המודל בגוף-הבקשה תואם לפרמטר שהועבר (לא מקובע בקוד)');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function testFailurePathHttpError() {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 401 });

  try {
    const result = await callAnthropic({
      apiKey: 'fake-key-not-real',
      model: 'claude-sonnet-5',
      userMessage: 'user message',
    });
    assert(result.ok === false, 'מסלול-כשל (HTTP 401): result.ok === false, לא זרקה חריגה');
    assert(result.error === 'http-401', 'מסלול-כשל (HTTP 401): קוד-השגיאה תואם');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function testFailurePathNetworkThrows() {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error('simulated network failure');
  };

  try {
    const result = await callAnthropic({
      apiKey: 'fake-key-not-real',
      model: 'claude-sonnet-5',
      userMessage: 'user message',
    });
    assert(result.ok === false, 'מסלול-כשל (רשת נופלת): result.ok === false, לא זרקה חריגה החוצה');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function testMissingApiKey() {
  const result = await callAnthropic({ model: 'claude-sonnet-5', userMessage: 'x' });
  assert(result.ok === false && result.error === 'missing-api-key', 'מפתח חסר: נכשל בבירור בלי לנסות לקרוא לרשת');
}

async function testPromptFileIsReadable() {
  const promptPath = path.join(__dirname, '..', 'prompts', 'cartomancy-runtime.md');
  const content = await readFile(promptPath, 'utf8');
  assert(typeof content === 'string' && content.length > 100, 'קובץ cartomancy-runtime.md נקרא כטקסט תקין ואינו ריק');
  assert(!content.includes('sk-ant-'), 'קובץ cartomancy-runtime.md לא מכיל מחרוזת שנראית כמו מפתח-API אמיתי');
}

async function main() {
  await testSuccessPath();
  await testFailurePathHttpError();
  await testFailurePathNetworkThrows();
  await testMissingApiKey();
  await testPromptFileIsReadable();

  console.log('');
  if (failures > 0) {
    console.error(`${failures} בדיקות נכשלו.`);
    process.exit(1);
  }
  console.log('כל הבדיקות עברו. אין קריאת-רשת אמיתית ואין מפתח אמיתי בשום מסלול.');
}

main();
