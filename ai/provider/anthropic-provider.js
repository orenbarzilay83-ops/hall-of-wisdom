// ai/provider/anthropic-provider.js
//
// שכבת-adapter דקה לקריאת Anthropic Messages API — ללא SDK, ללא מפתח
// מוטמע, ללא מודל מקובע. נועד לרוץ בהקשר שרת/edge בלבד (Deno/Node) —
// לעולם לא נטען על-ידי הדפדפן, לא מקושר משום קובץ HTML באתר.
//
// לעולם לא זורקת חריגה — תמיד מחזירה { ok, text } או { ok:false, error },
// כדי שהקורא יוכל ליפול-חזרה לפלט המנוע הדטרמיניסטי בלי try/catch נוסף.

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export async function callAnthropic({ apiKey, model, system, userMessage, maxTokens = 1200 }) {
  if (!apiKey) {
    return { ok: false, error: 'missing-api-key' };
  }
  if (!model) {
    return { ok: false, error: 'missing-model' };
  }
  if (!userMessage) {
    return { ok: false, error: 'missing-user-message' };
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: system || '',
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `http-${response.status}` };
    }

    const data = await response.json();
    const block = Array.isArray(data?.content) ? data.content.find((c) => c?.type === 'text') : null;
    const text = block?.text;

    if (!text) {
      return { ok: false, error: 'empty-response' };
    }

    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: err?.message || 'network-error' };
  }
}
