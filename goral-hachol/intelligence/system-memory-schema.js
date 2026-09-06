/**
 * system-memory-schema.js
 *
 * Schema + validation for IssueEvent, and a Phase-1 in-process store stub
 * (see HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md, חלק ז).
 *
 * This is system memory (issue-tracking across runs), NOT client memory —
 * no relation to clientHistorySummary/client profiles/localStorage.
 *
 * Phase 1: schema/validation + an in-memory (plain array) store only.
 * No real persistence (no DB, no file, no localStorage) — that is a
 * separate, future architectural decision.
 */

import { isMethod, isSeverity, isIssueStatus, isNonEmptyString, isStringArray, isPositiveInteger } from './reading-intelligence-types.js';

/**
 * Builds an IssueEvent object with sane defaults for omitted fields.
 * Does not validate — call validateSystemMemoryEvent() separately.
 */
export function createSystemMemoryEvent(input = {}) {
  const now = new Date().toISOString();
  return {
    issueId: input.issueId,
    firstSeenAt: input.firstSeenAt ?? now,
    lastSeenAt: input.lastSeenAt ?? now,
    method: input.method ?? null,
    questionType: input.questionType ?? null,
    topicId: input.topicId ?? null,
    ruleId: input.ruleId ?? null,
    issueType: input.issueType,
    severity: input.severity,
    occurrenceCount: input.occurrenceCount ?? 1,
    scenarioIds: input.scenarioIds ?? [],
    affectedFiles: input.affectedFiles ?? [],
    sourceEvidence: input.sourceEvidence ?? null,
    currentStatus: input.currentStatus ?? 'open',
    linkedFixCommit: input.linkedFixCommit ?? null,
    regressionTests: input.regressionTests ?? [],
    notes: input.notes ?? '',
  };
}

/**
 * @param {object} event
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSystemMemoryEvent(event) {
  const errors = [];

  if (!event || typeof event !== 'object') {
    return { valid: false, errors: ['system memory event must be an object'] };
  }

  if (!isNonEmptyString(event.issueId)) errors.push('issueId is required and must be a non-empty string');
  if (!isNonEmptyString(event.firstSeenAt)) errors.push('firstSeenAt is required and must be a non-empty string (ISO date)');
  if (!isNonEmptyString(event.lastSeenAt)) errors.push('lastSeenAt is required and must be a non-empty string (ISO date)');
  if (event.method !== null && !isMethod(event.method)) errors.push(`method must be 'kashf', 'hawi', or null (got ${JSON.stringify(event.method)})`);
  if (!isNonEmptyString(event.issueType)) errors.push('issueType is required and must be a non-empty string');
  if (!isSeverity(event.severity)) errors.push(`severity has an unknown value: ${JSON.stringify(event.severity)}`);
  if (!isPositiveInteger(event.occurrenceCount)) errors.push(`occurrenceCount must be a positive integer (got ${JSON.stringify(event.occurrenceCount)})`);
  if (!isStringArray(event.scenarioIds)) errors.push('scenarioIds must be an array of strings');
  if (!isStringArray(event.affectedFiles)) errors.push('affectedFiles must be an array of strings');
  if (!isIssueStatus(event.currentStatus)) errors.push(`currentStatus has an unknown value: ${JSON.stringify(event.currentStatus)}`);
  if (!isStringArray(event.regressionTests)) errors.push('regressionTests must be an array of strings');

  return { valid: errors.length === 0, errors };
}

/**
 * Phase-1 in-process store stub. Plain array, no persistence across
 * process restarts. Real persistence is a separate future decision.
 */
export function createSystemMemoryStore() {
  return { events: [] };
}

export function upsertIssueEvent(store, event) {
  const { valid, errors } = validateSystemMemoryEvent(event);
  if (!valid) throw new Error(`invalid system memory event: ${errors.join('; ')}`);
  const existingIndex = store.events.findIndex((e) => e.issueId === event.issueId);
  if (existingIndex === -1) {
    store.events.push(event);
  } else {
    store.events[existingIndex] = event;
  }
  return store;
}

export function findIssueEvents(store, filter = {}) {
  return store.events.filter((e) =>
    Object.entries(filter).every(([key, value]) => e[key] === value)
  );
}

export default { createSystemMemoryEvent, validateSystemMemoryEvent, createSystemMemoryStore, upsertIssueEvent, findIssueEvents };
