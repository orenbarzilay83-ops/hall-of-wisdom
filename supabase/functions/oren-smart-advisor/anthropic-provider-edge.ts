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

// ---------------------------------------------------------------------------
// Forced structured-output path (module:"kashf" only)
// ---------------------------------------------------------------------------
// callAnthropicEdge() above (free-text JSON) is left completely unchanged —
// module:"goralQA" and any other future text-based module still use it.
// callAnthropicEdgeWithForcedTool() is a separate function for the one
// module that needs guaranteed-structured output: it defines a single tool
// and forces the model to answer through it (`tool_choice`), so the answer
// arrives as a `tool_use` content block's `.input` — never as free text that
// needs JSON.parse. See HALL_WISDOM_KASHF_LIVE_PILOT_CONTEXT_SIZE_AND_JSON_AUDIT_REPORT.md
// for why: a real live pilot call finished generating (not a max_tokens
// cutoff) and produced text that failed JSON.parse despite an explicit
// "JSON only" prompt instruction.
//
// Never does JSON.parse on any text block. Never accepts a text-only
// response as success. Never extracts JSON from markdown. Never "repairs"
// a malformed tool call. Never invents a missing field — that is the
// caller's (index.ts + oren-smart-advisor-brain-tool-schema.ts) job via
// zero-trust re-validation of tool_use.input, not this function's.

export interface AnthropicToolDefinition {
  name: string;
  description?: string;
  input_schema: Record<string, unknown>;
  strict?: boolean;
}

export interface CallAnthropicEdgeWithToolParams {
  apiKey: string;
  model: string;
  system: string;
  userMessage: string;
  tool: AnthropicToolDefinition;
  maxTokens?: number;
  effort?: string;
}

export interface CallAnthropicEdgeToolDiagnostics {
  stopReason: string;
  contentBlockTypes: string;
  textBlockCount: number;
  toolUseBlockCount: number;
  receivedToolNames: string;
}

export interface CallAnthropicEdgeToolResult {
  ok: boolean;
  toolInput?: Record<string, unknown>;
  error?: string;
  usage?: { inputTokens: number; outputTokens: number };
  diagnostics?: CallAnthropicEdgeToolDiagnostics;
}

interface AnthropicToolUseBlock {
  type?: string;
  name?: string;
  input?: unknown;
}

export async function callAnthropicEdgeWithForcedTool(params: CallAnthropicEdgeWithToolParams): Promise<CallAnthropicEdgeToolResult> {
  const { apiKey, model, system, userMessage, tool, maxTokens = 12000, effort = 'medium' } = params;

  if (!apiKey) return { ok: false, error: 'missing-api-key' };
  if (!model) return { ok: false, error: 'missing-model' };
  if (!userMessage) return { ok: false, error: 'missing-user-message' };
  if (!tool?.name || !tool?.input_schema) return { ok: false, error: 'missing-tool-definition' };

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
        tools: [tool],
        tool_choice: { type: 'tool', name: tool.name },
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `http-${response.status}` };
    }

    const data = await response.json();
    const contentBlocks: AnthropicToolUseBlock[] = Array.isArray(data?.content) ? data.content : [];

    const textBlockCount = contentBlocks.filter((b) => b?.type === 'text').length;
    const toolUseBlocks = contentBlocks.filter((b) => b?.type === 'tool_use');
    const matchingToolUseBlocks = toolUseBlocks.filter((b) => b?.name === tool.name);

    const inputTokens = data?.usage?.input_tokens;
    const outputTokens = data?.usage?.output_tokens;
    const usage = (typeof inputTokens === 'number' && typeof outputTokens === 'number')
      ? { inputTokens, outputTokens }
      : undefined;

    const diagnostics: CallAnthropicEdgeToolDiagnostics = {
      stopReason: typeof data?.stop_reason === 'string' ? data.stop_reason : 'unknown',
      contentBlockTypes: contentBlocks.length > 0
        ? contentBlocks.map((b) => (typeof b?.type === 'string' ? b.type : 'unknown')).join(',')
        : 'none',
      textBlockCount,
      toolUseBlockCount: toolUseBlocks.length,
      receivedToolNames: toolUseBlocks.length > 0
        ? toolUseBlocks.map((b) => (typeof b?.name === 'string' ? b.name : 'unknown')).join(',')
        : 'none',
    };

    // Exactly one matching tool_use block, with an object input, is the only
    // accepted shape. Zero matches, more than one, or a non-object input are
    // all rejected here — never repaired, never guessed.
    if (matchingToolUseBlocks.length !== 1 || typeof matchingToolUseBlocks[0]?.input !== 'object' || matchingToolUseBlocks[0]?.input === null) {
      return { ok: false, error: 'no-single-matching-tool-use', usage, diagnostics };
    }

    return { ok: true, toolInput: matchingToolUseBlocks[0].input as Record<string, unknown>, usage, diagnostics };
  } catch {
    return { ok: false, error: 'network-error' };
  }
}

export default { callAnthropicEdge, callAnthropicEdgeWithForcedTool };
