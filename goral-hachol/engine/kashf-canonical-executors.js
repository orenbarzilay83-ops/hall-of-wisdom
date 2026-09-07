/**
 * kashf-canonical-executors.js
 *
 * Method-scoped executors for the canonical Kashf runtime.
 *
 * This is an explicit allowlist: a legacy helper may run here only after its
 * exact source method has been audited and mapped to one kashfMethodId.
 * Merely existing in kashf-pending-extraction.js does NOT authorize runtime
 * use.
 */

import { computeProfessionH9Kashf } from './kashf-pending-extraction.js';

const LEGACY_EXECUTORS = Object.freeze({
  'profession.p254.h9Planet': computeProfessionH9Kashf,
});

function toLegacyChart(board) {
  if (Array.isArray(board)) return board;
  if (Array.isArray(board?.entries)) return board.entries;
  const error = new Error('Canonical legacy executor requires a board entries array');
  error.code = 'KASHF_CANONICAL_BOARD_ADAPTER_FAILED';
  throw error;
}

export function hasCanonicalLegacyExecutor(kashfMethodId) {
  return typeof LEGACY_EXECUTORS[kashfMethodId] === 'function';
}

export function executeCanonicalLegacyMethod(kashfMethodId, board) {
  const executor = LEGACY_EXECUTORS[kashfMethodId];
  if (typeof executor !== 'function') {
    const error = new Error(`No approved canonical legacy executor for ${kashfMethodId}`);
    error.code = 'KASHF_CANONICAL_EXECUTOR_NOT_APPROVED';
    throw error;
  }

  return executor(toLegacyChart(board));
}

export function listApprovedCanonicalLegacyExecutors() {
  return Object.keys(LEGACY_EXECUTORS);
}

export default {
  hasCanonicalLegacyExecutor,
  executeCanonicalLegacyMethod,
  listApprovedCanonicalLegacyExecutors,
};
