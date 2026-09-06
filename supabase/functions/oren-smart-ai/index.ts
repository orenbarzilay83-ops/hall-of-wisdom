// supabase/functions/oren-smart-ai/index.ts
//
// שלד בלבד — לא נפרס (supabase functions deploy לא בוצע בשלב הזה, אין
// secret אמיתי, אין חיבור-AI חי). שלד ל-Edge Function גנרית שתשמש
// בעתיד כ-Runtime AI לכל מודולי האפליקציה (חאווי, כשף, קלפים,
// עשיריות) — כרגע רק מודול הקלפים (`cartomancy`) יש לו prompt אמיתי,
// ראו ai/prompts/*.md. חאווי וכשף הם stub מפורש ונדחים בבירור למטה.
//
// הערות-deploy עתידיות (לא מבוצעות בשלב הזה, ורק לאחר אישור אורן משה):
//   supabase functions deploy oren-smart-ai
//   supabase secrets set ANTHROPIC_API_KEY=<מפתח-חדש-אחרי-סבב, לא הישן שבוטל>
//
// הערת-מבנה חשובה: Supabase Edge Functions (Deno) לא תומך ביבוא
// קבצים שנמצאים מחוץ לתיקיית supabase/functions/ (או ל-_shared/
// שבתוכה) בזמן deploy אמיתי. הייבוא היחסי למטה מבטא את *כוונת*
// המבנה (קריאה ל-ai/provider/anthropic-provider.js כמקור-אמת יחיד) —
// בעת deploy בפועל, הקובץ יצטרך להיות מסונכרן/מועתק אל
// supabase/functions/_shared/anthropic-provider.js. זה לא נעשה כאן —
// זו הערה לשלב הבא, לא פעולה שבוצעה.

import { callAnthropic } from '../../../ai/provider/anthropic-provider.js';

interface RuntimeRequestBody {
  module?: string;
  userMessage?: string;
  // engineConclusion הוא פלט-המנוע הדטרמיניסטי — מקור-האמת היחיד.
  // ה-AI (אם יצליח) רק מנסח אותו מחדש; אם ייכשל — הוא מוחזר כמות שהוא.
  engineConclusion?: string;
}

const STUB_MARKER = 'STUB — לא מיושם';
const MODEL = 'claude-sonnet-5';

const PROMPT_PATHS: Record<string, string> = {
  cartomancy: '../../../ai/prompts/cartomancy-runtime.md',
  hawi: '../../../ai/prompts/hawi-runtime.md',
  kashf: '../../../ai/prompts/kashf-runtime.md',
};

async function loadPromptForModule(
  moduleName: string | undefined,
): Promise<{ ok: true; content: string } | { ok: false; error: string }> {
  if (!moduleName || !(moduleName in PROMPT_PATHS)) {
    return { ok: false, error: 'unknown-module' };
  }

  let content: string;
  try {
    content = await Deno.readTextFile(new URL(PROMPT_PATHS[moduleName], import.meta.url));
  } catch {
    return { ok: false, error: 'prompt-file-not-found' };
  }

  if (content.includes(STUB_MARKER)) {
    // חאווי/כשף כרגע stub בכוונה — נכשלים בבירור, לא טוענים תוכן חלקי.
    return { ok: false, error: 'module-not-implemented-stub-only' };
  }

  return { ok: true, content };
}

Deno.serve(async (req: Request) => {
  let body: RuntimeRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid-json' }), { status: 400 });
  }

  const { module: moduleName, userMessage, engineConclusion } = body;

  // המנוע הדטרמיניסטי הוא מקור-האמת. בלי engineConclusion אין מה
  // לנסח מחדש — לא ממציאים תוכן משום צד.
  if (!engineConclusion) {
    return new Response(
      JSON.stringify({ ok: false, fallback: true, error: 'missing-engine-conclusion' }),
      { status: 200 },
    );
  }

  const prompt = await loadPromptForModule(moduleName);
  if (!prompt.ok) {
    // כשל מוקדם (מודול לא-נתמך/stub/prompt חסר) -> fallback, לא 500.
    // הצד הקורא מציג את engineConclusion כמו שהוא.
    return new Response(
      JSON.stringify({ ok: false, fallback: true, error: prompt.error, conclusion: engineConclusion }),
      { status: 200 },
    );
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  const result = await callAnthropic({
    apiKey,
    model: MODEL,
    system: prompt.content,
    userMessage: userMessage || engineConclusion,
  });

  if (!result.ok) {
    // נפילה-חזרה חובה: fallback:true + פלט-המנוע הדטרמיניסטי. לעולם
    // לא שגיאה ריקה או מסך-שבור ללקוח.
    return new Response(
      JSON.stringify({ ok: false, fallback: true, error: result.error, conclusion: engineConclusion }),
      { status: 200 },
    );
  }

  return new Response(JSON.stringify({ ok: true, conclusion: result.text }), { status: 200 });
});
