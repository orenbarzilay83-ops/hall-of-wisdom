// supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts
//
// פורט מקומי, self-contained, של ai/provider/anthropic-provider.js —
// חי בתוך תיקיית ה-Edge Function עצמה ולא מיובא חוצה-ריפו (ראו
// HALL_WISDOM_GORAL_QA_LIVE_AI_INTEGRATION_PLAN.md §2.3/§3 —
// deploy-safety, אותו לקח כמו goral_qa_mock_evaluator.ts).
//
// זהה-בלוגיקה למקור: fetch גולמי, בלי SDK, בלי מפתח-מוטמע, בלי
// מודל-מקובע (model תמיד פרמטר-נכנס). לעולם לא זורקת חריגה — תמיד
// מחזירה {ok,text} או {ok:false,error}. error לעולם לא כולל את ה-apiKey
// או כל תוכן-גולמי-של-תגובת-שגיאה (רק סוג-שגיאה מסווג).

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export interface CallAnthropicEdgeParams {
  apiKey: string;
  model: string;
  system: string;
  userMessage: string;
  maxTokens?: number;
}

export interface CallAnthropicEdgeResult {
  ok: boolean;
  text?: string;
  error?: string;
  usage?: { inputTokens: number; outputTokens: number };
}

export async function callAnthropicEdge(params: CallAnthropicEdgeParams): Promise<CallAnthropicEdgeResult> {
  const { apiKey, model, system, userMessage, maxTokens = 1200 } = params;

  if (!apiKey) return { ok: false, error: 'missing-api-key' };
  if (!model) return { ok: false, error: 'missing-model' };
  if (!userMessage) return { ok: false, error: 'missing-user-message' };

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
      // סוג-שגיאה מסווג בלבד — לא-מחזירים גוף-תגובה גולמי (עלול להכיל
      // מידע-פנימי-לא-נחוץ).
      return { ok: false, error: `http-${response.status}` };
    }

    const data = await response.json();
    const block = Array.isArray(data?.content) ? data.content.find((c: { type?: string }) => c?.type === 'text') : null;
    const text = block?.text;

    if (!text) return { ok: false, error: 'empty-response' };

    const inputTokens = data?.usage?.input_tokens;
    const outputTokens = data?.usage?.output_tokens;
    const usage = (typeof inputTokens === 'number' && typeof outputTokens === 'number')
      ? { inputTokens, outputTokens }
      : undefined;

    return { ok: true, text, usage };
  } catch {
    // לא-מחזירים err.message הגולמי — עלול (בתיאוריה, בהתאם ל-runtime)
    // לכלול פרטי-בקשה. סוג-שגיאה כללי בלבד.
    return { ok: false, error: 'network-error' };
  }
}

export default { callAnthropicEdge };
