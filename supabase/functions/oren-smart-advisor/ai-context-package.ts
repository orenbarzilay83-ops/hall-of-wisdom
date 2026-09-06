// supabase/functions/oren-smart-advisor/ai-context-package.ts
//
// AI Context Package — המעטפת (envelope) הגנרית, Domain-agnostic, שכל
// payload-ל-AI חי עובר-דרכה. עקבי עם Shared Core
// (HALL_WISDOM_LIVE_INTELLIGENCE_FIRST_USABLE_VERSION_PLAN.md, "הבהרת-מוצר
// מחייבת" § Shared Core): AI Gateway/AI Provider אינם-יודעים-פרטי-Domain —
// רק `readingContext` הוא-הבָּג הספציפי-ל-Domain (עבור reading.goralHachol:
// question/board/engineOutput/activatedRuleIds/rejectedRuleIds/sourceEvidence;
// עבור reading.cards, בעתיד: question/spread/selectedCards/engineOutput/וכו' —
// **ללא שינוי במעטפת עצמה, וללא שינוי בלוגיקת-השער** ב-index.ts).
//
// self-contained, אין imports.

export const AI_CONTEXT_PACKAGE_VERSION = 'ai-context-package-v1';

// Domains רשמיים (עקבי עם התוכנית) — ערך-נתמך-כרגע: reading.goralHachol
// בלבד. reading.cards ו-siteMaintenance מתועדים-כאן-מראש כדי-שהוספתם
// העתידית לא-תדרוש-שינוי-מבנה, רק handler נוסף ב-index.ts (module נוסף
// בשער-הקיים, לא Gateway נפרד — ר' התוכנית, Shared Core).
export type AiDomain = 'reading.goralHachol' | 'reading.cards' | 'siteMaintenance';

export interface AiContextPackage {
  // --- מעטפת גנרית — זהה לכל Domain, אינה-משתנה-בין-קריאות-עתידיות ---
  payloadVersion: string;
  readingId?: string;
  domain: AiDomain;
  method: string; // 'kashf' | 'hawi' | 'cartomancy' (עתידי) | ...
  questionType?: string;
  primaryIntent?: string;
  readingStrategy?: unknown; // Reading Strategy Builder output, כפי-שהוא, לא-מחושב-מחדש כאן
  readingPlan?: unknown; // Reading Planner output, כפי-שהוא
  decisionSummary?: string; // Rule Decision Engine::decisionSummary — תבנית-דטרמיניסטית, לעולם לא chain-of-thought

  // --- בָּג ספציפי-ל-Domain בלבד — הצורה הפנימית שלו משתנה-לפי-Domain ---
  readingContext: Record<string, unknown>;
}

// בדיקת-תקינות-מעטפת גנרית — לא-בודקת את תוכן readingContext (זה תפקיד
// ה-handler הספציפי-ל-Domain/method, ר' index.ts).
export function isValidAiContextPackageEnvelope(payload: unknown): payload is AiContextPackage {
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  return (
    typeof p.payloadVersion === 'string' && p.payloadVersion.length > 0 &&
    typeof p.domain === 'string' && p.domain.length > 0 &&
    typeof p.method === 'string' && p.method.length > 0 &&
    !!p.readingContext && typeof p.readingContext === 'object'
  );
}

export default { AI_CONTEXT_PACKAGE_VERSION, isValidAiContextPackageEnvelope };
