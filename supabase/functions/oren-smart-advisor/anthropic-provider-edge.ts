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
//
// Claude Sonnet 5 משתמש ב-Adaptive Thinking (ברירת-מחדל effort:"high"),
// כלומר content יכול לכלול בלוקים מסוג "thinking" לפני בלוק "text" —
// ולפעמים (payload מורכב) כל תקציב-הטוקנים נצרך בחשיבה לפני שמגיעים
// לטקסט בכלל (stop_reason:"max_tokens", אין בלוק-text כלל). הפרסור כאן
// אוסף את *כל* בלוקי ה-text (לא רק content[0]) ומתעלם-בבטחה מ-thinking —
// לעולם לא קורא/מחזיר את תוכן ה-thinking עצמו, רק את סוג-הבלוק (למיון).

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export interface CallAnthropicEdgeParams {
  apiKey: string;
  model: string;
  system: string;
  userMessage: string;
  maxTokens?: number;
  effort?: string;
}

export interface CallAnthropicEdgeResult {
  ok: boolean;
  text?: string;
  error?: string;
  usage?: { inputTokens: number; outputTokens: number };
}

interface AnthropicContentBlock {
  type?: string;
  text?: string;
}

export async function callAnthropicEdge(params: CallAnthropicEdgeParams): Promise<CallAnthropicEdgeResult> {
  const { apiKey, model, system, userMessage, maxTokens = 12000, effort = 'medium' } = params;

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
        output_config: { effort },
      }),
    });

    if (!response.ok) {
      // סוג-שגיאה מסווג בלבד — לא-מחזירים גוף-תגובה גולמי (עלול להכיל
      // מידע-פנימי-לא-נחוץ).
      return { ok: false, error: `http-${response.status}` };
    }

    const data = await response.json();
    const contentBlocks: AnthropicContentBlock[] = Array.isArray(data?.content) ? data.content : [];

    // אוספים *כל* בלוקי type:"text" (לא רק הראשון) ומחברים לפי-הסדר —
    // thinking/redacted_thinking/כל-סוג-אחר מתעלמים-בבטחה, לעולם לא נקרא
    // מהם content.
    const textParts = contentBlocks
      .filter((b) => b?.type === 'text' && typeof b.text === 'string')
      .map((b) => b.text as string);
    const text = textParts.length > 0 ? textParts.join('') : undefined;

    const inputTokens = data?.usage?.input_tokens;
    const outputTokens = data?.usage?.output_tokens;
    const usage = (typeof inputTokens === 'number' && typeof outputTokens === 'number')
      ? { inputTokens, outputTokens }
      : undefined;

    if (!text) {
      // אבחון מסווג בלבד: stop_reason (enum קצר) + סוגי-הבלוקים שהתקבלו
      // (רק type, לעולם לא תוכן). usage (input/output token counts) חוזר
      // גם כאן — מספרים בלבד, לא תוכן-גולמי.
      const stopReason = typeof data?.stop_reason === 'string' ? data.stop_reason : 'unknown';
      const blockTypes = contentBlocks.length > 0
        ? contentBlocks.map((b) => (typeof b?.type === 'string' ? b.type : 'unknown')).join(',')
        : 'none';
      return { ok: false, error: `empty-response:${stopReason}:blocks=${blockTypes}`, usage };
    }

    return { ok: true, text, usage };
  } catch {
    // לא-מחזירים err.message הגולמי — עלול (בתיאוריה, בהתאם ל-runtime)
    // לכלול פרטי-בקשה. סוג-שגיאה כללי בלבד.
    return { ok: false, error: 'network-error' };
  }
}

export default { callAnthropicEdge };
