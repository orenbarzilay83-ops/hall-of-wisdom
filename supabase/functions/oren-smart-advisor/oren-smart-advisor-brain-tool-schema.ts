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
    'Submit the structured advisor-only critique of a single already-computed Kashf reading. Never client-facing. Must be called exactly once, with every field present, including the professional verdict audit.',
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
      verdictAudit: {
        type: 'object',
        properties: {
          methodId: { type: 'string' },
          engineVerdictPolarity: { type: 'string', enum: ['positive', 'negative', 'non-binary', 'blocked'] },
          clientDraftPolarity: { type: 'string', enum: ['positive', 'negative', 'non-binary', 'none'] },
          usedOnlyAuthorizedVerdictSource: { type: 'boolean' },
          inventedInverseRule: { type: 'boolean' },
          mixedUnselectedMethod: { type: 'boolean' },
          unsupportedClientClaims: { type: 'array', items: { type: 'string' } },
        },
        required: ['methodId', 'engineVerdictPolarity', 'clientDraftPolarity', 'usedOnlyAuthorizedVerdictSource', 'inventedInverseRule', 'mixedUnselectedMethod', 'unsupportedClientClaims'],
        additionalProperties: false,
      },
    },
    required: [
      'module', 'advisorDiagnosis', 'clientAnswerDraft', 'engineCritique',
      'missingKnowledgeOrRules', 'recommendedFix', 'codeInstructionForClaude',
      'safetyNotes', 'privacyBlockedFields', 'nextBestAction', 'confidence', 'needsOrenDecision', 'verdictAudit',
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
  verdictAudit: {
    methodId: string;
    engineVerdictPolarity: 'positive' | 'negative' | 'non-binary' | 'blocked';
    clientDraftPolarity: 'positive' | 'negative' | 'non-binary' | 'none';
    usedOnlyAuthorizedVerdictSource: boolean;
    inventedInverseRule: boolean;
    mixedUnselectedMethod: boolean;
    unsupportedClientClaims: string[];
  };
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

  const va = obj.verdictAudit;
  if (!va || typeof va !== 'object' || Array.isArray(va)) return { ok: false, category: 'missing-or-wrong-type:verdictAudit' };
  const vaObj = va as Record<string, unknown>;
  if (typeof vaObj.methodId !== 'string' || !vaObj.methodId) return { ok: false, category: 'wrong-type:verdictAudit.methodId' };
  if (!['positive', 'negative', 'non-binary', 'blocked'].includes(vaObj.engineVerdictPolarity as string)) return { ok: false, category: 'wrong-type:verdictAudit.engineVerdictPolarity' };
  if (!['positive', 'negative', 'non-binary', 'none'].includes(vaObj.clientDraftPolarity as string)) return { ok: false, category: 'wrong-type:verdictAudit.clientDraftPolarity' };
  if (typeof vaObj.usedOnlyAuthorizedVerdictSource !== 'boolean') return { ok: false, category: 'wrong-type:verdictAudit.usedOnlyAuthorizedVerdictSource' };
  if (typeof vaObj.inventedInverseRule !== 'boolean') return { ok: false, category: 'wrong-type:verdictAudit.inventedInverseRule' };
  if (typeof vaObj.mixedUnselectedMethod !== 'boolean') return { ok: false, category: 'wrong-type:verdictAudit.mixedUnselectedMethod' };
  if (!isStringArray(vaObj.unsupportedClientClaims)) return { ok: false, category: 'wrong-type:verdictAudit.unsupportedClientClaims' };

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
      verdictAudit: {
        methodId: vaObj.methodId as string,
        engineVerdictPolarity: vaObj.engineVerdictPolarity as 'positive' | 'negative' | 'non-binary' | 'blocked',
        clientDraftPolarity: vaObj.clientDraftPolarity as 'positive' | 'negative' | 'non-binary' | 'none',
        usedOnlyAuthorizedVerdictSource: vaObj.usedOnlyAuthorizedVerdictSource as boolean,
        inventedInverseRule: vaObj.inventedInverseRule as boolean,
        mixedUnselectedMethod: vaObj.mixedUnselectedMethod as boolean,
        unsupportedClientClaims: vaObj.unsupportedClientClaims as string[],
      },
    },
  };
}

export interface VerdictAlignmentResult { ok: boolean; category?: string }

/**
 * Deterministic post-AI semantic gate. The model must explicitly audit the
 * polarity it used, and the server compares that audit to the engine-created
 * Professional Verdict Safety block. Any mismatch fails closed.
 */
export function validateKashfAdvisorVerdictAlignment(
  output: KashfAdvisorOutput | undefined,
  safety: unknown,
): VerdictAlignmentResult {
  if (!output) return { ok: false, category: 'missing-advisor-output' };
  if (!safety || typeof safety !== 'object' || Array.isArray(safety)) return { ok: false, category: 'missing-professional-verdict-safety' };
  const s = safety as Record<string, unknown>;
  const audit = output.verdictAudit;
  if (s.isSafe !== true) return { ok: false, category: 'professional-verdict-safety-not-safe' };
  if (typeof s.kashfMethodId !== 'string' || audit.methodId !== s.kashfMethodId) return { ok: false, category: 'verdict-method-mismatch' };
  if (audit.engineVerdictPolarity !== s.authoritativePolarity) return { ok: false, category: 'engine-polarity-mismatch' };
  if (audit.usedOnlyAuthorizedVerdictSource !== true) return { ok: false, category: 'unauthorized-verdict-source-used' };
  if (audit.inventedInverseRule !== false) return { ok: false, category: 'invented-inverse-rule' };
  if (audit.mixedUnselectedMethod !== false) return { ok: false, category: 'mixed-unselected-method' };
  if (audit.unsupportedClientClaims.length !== 0) return { ok: false, category: 'unsupported-client-claim' };

  const polarity = String(s.authoritativePolarity || 'blocked');
  const hasDraft = output.clientAnswerDraft !== null && output.clientAnswerDraft.trim().length > 0;
  const clientFacingCertified = s.certificationStatus === 'certified' && s.clientFacingCertified === true;
  const exactDraftRequired = s.clientDraftExactMatchRequired === true;
  const authoritativeDraft = typeof s.authoritativeClientDraftHebrew === 'string' ? s.authoritativeClientDraftHebrew.trim() : '';
  if (!hasDraft && audit.clientDraftPolarity !== 'none') return { ok: false, category: 'client-draft-polarity-without-draft' };
  if (!clientFacingCertified && hasDraft) return { ok: false, category: 'uncertified-client-draft' };
  if (clientFacingCertified && exactDraftRequired !== true) return { ok: false, category: 'missing-exact-client-draft-contract' };
  if (hasDraft && !authoritativeDraft) return { ok: false, category: 'missing-authoritative-client-draft' };
  if (hasDraft && output.clientAnswerDraft!.trim() !== authoritativeDraft) return { ok: false, category: 'client-draft-not-exact-engine-text' };
  if (polarity === 'positive' || polarity === 'negative') {
    if (hasDraft && s.binaryClientVerdictAllowed !== true) return { ok: false, category: 'binary-client-verdict-not-allowed' };
    if (hasDraft && audit.clientDraftPolarity !== polarity) return { ok: false, category: 'client-draft-polarity-mismatch' };
  } else if (polarity === 'non-binary') {
    if (audit.clientDraftPolarity === 'positive' || audit.clientDraftPolarity === 'negative') return { ok: false, category: 'invented-binary-client-verdict' };
    if (hasDraft && audit.clientDraftPolarity !== 'non-binary') return { ok: false, category: 'non-binary-draft-audit-mismatch' };
  } else {
    if (hasDraft || audit.clientDraftPolarity !== 'none') return { ok: false, category: 'blocked-method-client-draft' };
  }
  return { ok: true };
}

export default { KASHF_ADVISOR_TOOL_NAME, KASHF_ADVISOR_TOOL_DEFINITION, validateKashfAdvisorOutput, validateKashfAdvisorVerdictAlignment };
