// supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-tool-schema.ts
//
// Structured-output tool definition + server-side re-validator for
// module:"kashf". Self-contained (no imports), same deploy-safety pattern
// as oren-smart-advisor-brain-prompt.ts.
//
// Why a forced tool call instead of free-text JSON: measured on a real live
// pilot (HALL_WISDOM_KASHF_LIVE_PILOT_CONTEXT_SIZE_AND_JSON_AUDIT_REPORT.md)
// — the model finished generating (6,525 of a 12,000 output-token budget,
// not a max_tokens cutoff) and what it produced did not survive
// `JSON.parse`, most likely a markdown fence or a short lead-in line despite
// an explicit "JSON only" prompt instruction. Anthropic's Messages API can
// validate structured output itself when the model is forced (via
// `tool_choice`) to answer through a single defined tool — this schema IS
// the 12-key output contract already described in
// oren-smart-advisor-brain-prompt.ts, moved into JSON Schema form.
//
// This file only defines the contract and a zero-trust re-validator run
// server-side on tool_use.input — it never calls Anthropic, never parses
// text, never repairs or invents a missing field. A field that is missing,
// wrong-typed, or extra (schema is additionalProperties:false) fails
// validation; nothing is coerced or defaulted in its place.

export const KASHF_ADVISOR_TOOL_NAME = 'submit_hall_wisdom_kashf_analysis';

export const KASHF_ADVISOR_TOOL_DEFINITION = {
  name: KASHF_ADVISOR_TOOL_NAME,
  description:
    'Submit the structured advisor-only critique of a single already-computed Kashf reading. Never client-facing. Must be called exactly once, with every field present.',
  input_schema: {
    type: 'object',
    properties: {
      module: { type: 'string', enum: ['kashf'] },
      advisorDiagnosis: { type: 'string' },
      clientAnswerDraft: { type: ['string', 'null'] },
      engineCritique: {
        type: 'object',
        properties: {
          hasProblem: { type: 'boolean' },
          problems: { type: 'array', items: { type: 'string' } },
          severity: { type: 'string', enum: ['none', 'minor', 'medium', 'major'] },
        },
        required: ['hasProblem', 'problems', 'severity'],
        additionalProperties: false,
      },
      missingKnowledgeOrRules: { type: 'array', items: { type: 'string' } },
      recommendedFix: { type: 'string' },
      codeInstructionForClaude: {
        type: 'object',
        properties: {
          needed: { type: 'boolean' },
          instruction: { type: 'string' },
          filesToInspect: { type: 'array', items: { type: 'string' } },
          filesNotToTouch: { type: 'array', items: { type: 'string' } },
          testsToRun: { type: 'array', items: { type: 'string' } },
        },
        required: ['needed', 'instruction', 'filesToInspect', 'filesNotToTouch', 'testsToRun'],
        additionalProperties: false,
      },
      safetyNotes: { type: 'array', items: { type: 'string' } },
      privacyBlockedFields: { type: 'array', items: { type: 'string' } },
      nextBestAction: { type: 'string' },
      confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
      needsOrenDecision: { type: 'boolean' },
    },
    required: [
      'module', 'advisorDiagnosis', 'clientAnswerDraft', 'engineCritique',
      'missingKnowledgeOrRules', 'recommendedFix', 'codeInstructionForClaude',
      'safetyNotes', 'privacyBlockedFields', 'nextBestAction', 'confidence', 'needsOrenDecision',
    ],
    additionalProperties: false,
  },
  strict: true,
} as const;

export interface KashfAdvisorOutput {
  module: 'kashf';
  advisorDiagnosis: string;
  clientAnswerDraft: string | null;
  engineCritique: { hasProblem: boolean; problems: string[]; severity: 'none' | 'minor' | 'medium' | 'major' };
  missingKnowledgeOrRules: string[];
  recommendedFix: string;
  codeInstructionForClaude: {
    needed: boolean;
    instruction: string;
    filesToInspect: string[];
    filesNotToTouch: string[];
    testsToRun: string[];
  };
  safetyNotes: string[];
  privacyBlockedFields: string[];
  nextBestAction: string;
  confidence: 'low' | 'medium' | 'high';
  needsOrenDecision: boolean;
}

export interface ValidationResult {
  ok: boolean;
  value?: KashfAdvisorOutput;
  category?: string; // classified only — e.g. "missing-field:advisorDiagnosis", "wrong-type:confidence" — never the raw value
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((item) => typeof item === 'string');
}

/**
 * Zero-trust server-side re-validation of tool_use.input. Does not assume
 * the API's `strict:true` schema enforcement was honored end-to-end — every
 * field's presence and type is checked again here. Never coerces, never
 * fills a default, never invents a missing field: any deviation is a
 * rejection with a classified category, not a repair.
 */
export function validateKashfAdvisorOutput(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, category: 'not-an-object' };
  }
  const obj = input as Record<string, unknown>;

  if (obj.module !== 'kashf') return { ok: false, category: 'wrong-type:module' };
  if (typeof obj.advisorDiagnosis !== 'string') return { ok: false, category: 'missing-or-wrong-type:advisorDiagnosis' };
  if (obj.clientAnswerDraft !== null && typeof obj.clientAnswerDraft !== 'string') return { ok: false, category: 'wrong-type:clientAnswerDraft' };

  const ec = obj.engineCritique;
  if (!ec || typeof ec !== 'object' || Array.isArray(ec)) return { ok: false, category: 'missing-or-wrong-type:engineCritique' };
  const ecObj = ec as Record<string, unknown>;
  if (typeof ecObj.hasProblem !== 'boolean') return { ok: false, category: 'wrong-type:engineCritique.hasProblem' };
  if (!isStringArray(ecObj.problems)) return { ok: false, category: 'wrong-type:engineCritique.problems' };
  if (!['none', 'minor', 'medium', 'major'].includes(ecObj.severity as string)) return { ok: false, category: 'wrong-type:engineCritique.severity' };

  if (!isStringArray(obj.missingKnowledgeOrRules)) return { ok: false, category: 'wrong-type:missingKnowledgeOrRules' };
  if (typeof obj.recommendedFix !== 'string') return { ok: false, category: 'missing-or-wrong-type:recommendedFix' };

  const ci = obj.codeInstructionForClaude;
  if (!ci || typeof ci !== 'object' || Array.isArray(ci)) return { ok: false, category: 'missing-or-wrong-type:codeInstructionForClaude' };
  const ciObj = ci as Record<string, unknown>;
  if (typeof ciObj.needed !== 'boolean') return { ok: false, category: 'wrong-type:codeInstructionForClaude.needed' };
  if (typeof ciObj.instruction !== 'string') return { ok: false, category: 'wrong-type:codeInstructionForClaude.instruction' };
  if (!isStringArray(ciObj.filesToInspect)) return { ok: false, category: 'wrong-type:codeInstructionForClaude.filesToInspect' };
  if (!isStringArray(ciObj.filesNotToTouch)) return { ok: false, category: 'wrong-type:codeInstructionForClaude.filesNotToTouch' };
  if (!isStringArray(ciObj.testsToRun)) return { ok: false, category: 'wrong-type:codeInstructionForClaude.testsToRun' };

  if (!isStringArray(obj.safetyNotes)) return { ok: false, category: 'wrong-type:safetyNotes' };
  if (!isStringArray(obj.privacyBlockedFields)) return { ok: false, category: 'wrong-type:privacyBlockedFields' };
  if (typeof obj.nextBestAction !== 'string') return { ok: false, category: 'missing-or-wrong-type:nextBestAction' };
  if (!['low', 'medium', 'high'].includes(obj.confidence as string)) return { ok: false, category: 'wrong-type:confidence' };
  if (typeof obj.needsOrenDecision !== 'boolean') return { ok: false, category: 'wrong-type:needsOrenDecision' };

  return {
    ok: true,
    value: {
      module: 'kashf',
      advisorDiagnosis: obj.advisorDiagnosis,
      clientAnswerDraft: obj.clientAnswerDraft as string | null,
      engineCritique: {
        hasProblem: ecObj.hasProblem,
        problems: ecObj.problems as string[],
        severity: ecObj.severity as 'none' | 'minor' | 'medium' | 'major',
      },
      missingKnowledgeOrRules: obj.missingKnowledgeOrRules as string[],
      recommendedFix: obj.recommendedFix,
      codeInstructionForClaude: {
        needed: ciObj.needed,
        instruction: ciObj.instruction,
        filesToInspect: ciObj.filesToInspect as string[],
        filesNotToTouch: ciObj.filesNotToTouch as string[],
        testsToRun: ciObj.testsToRun as string[],
      },
      safetyNotes: obj.safetyNotes as string[],
      privacyBlockedFields: obj.privacyBlockedFields as string[],
      nextBestAction: obj.nextBestAction,
      confidence: obj.confidence as 'low' | 'medium' | 'high',
      needsOrenDecision: obj.needsOrenDecision,
    },
  };
}

export default { KASHF_ADVISOR_TOOL_NAME, KASHF_ADVISOR_TOOL_DEFINITION, validateKashfAdvisorOutput };
