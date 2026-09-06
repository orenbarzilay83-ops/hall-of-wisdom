/**
 * tests/hall-wisdom-engine-registry.test.js
 *
 * Direct tests for goral-hachol/registry/hall-wisdom-engine-registry.js —
 * a passive, static, read-only Engine Registry Snapshot. No engine files
 * are imported by this test beyond the registry module itself and Node's
 * own fs (to statically check the registry source text for forbidden
 * imports). No network, no localStorage, no execution of any engine
 * function.
 */

const fs = require('fs');
const path = require('path');
const assert = (cond, msg) => {
  if (!cond) {
    failures += 1;
    console.error(`✗ FAIL: ${msg}`);
  } else {
    console.log(`✓ ${msg}`);
  }
};

let failures = 0;

const REGISTRY_PATH = path.join(__dirname, '..', 'goral-hachol', 'registry', 'hall-wisdom-engine-registry.js');

// ── 1. Loads in Node with no side effects ───────────────────────────────
console.log('\n--- 1. Loads in Node without side effects ---');
let registryModule;
{
  const before = { cwd: process.cwd() };
  registryModule = require(REGISTRY_PATH);
  const after = { cwd: process.cwd() };
  assert(!!registryModule, 'require() of the registry file succeeds');
  assert(before.cwd === after.cwd, 'loading the registry does not change process.cwd() (no fs side effects observed)');
  assert(typeof registryModule.ENGINE_REGISTRY !== 'undefined', 'ENGINE_REGISTRY is exported');
}

const {
  ENGINE_REGISTRY,
  getEngineRegistrySnapshot,
  findRegistryComponentById,
  listRegistryComponentsByCategory,
  listRegistryOpenItems,
} = registryModule;

// ── 2. Registry contains the expected number of components ─────────────
console.log('\n--- 2. Registry size ---');
// HALL_WISDOM_ENGINE_REGISTRY_SPECIFICATION.md §8 sums its own per-section
// row counts to 65 (16+2+5+6+7+15+2+11+1), NOT the 49 claimed in its closing
// line "סה"כ: 49 רכיבים" — a verified spec inconsistency (see
// HALL_WISDOM_ENGINE_REGISTRY_IMPLEMENTATION_REPORT.md). This Snapshot adds
// 2 further components (kundali-engine, komilla-house-signs) per this task's
// explicit instruction (section 5), sourced from
// HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md. Expected total: 67.
assert(ENGINE_REGISTRY.length === 67, `ENGINE_REGISTRY has 67 components (found ${ENGINE_REGISTRY.length})`);

// ── 3. Every record has a unique id ─────────────────────────────────────
console.log('\n--- 3. Unique ids ---');
{
  const ids = ENGINE_REGISTRY.map((r) => r.id);
  const uniqueIds = new Set(ids);
  assert(uniqueIds.size === ids.length, `all ${ids.length} ids are unique (${uniqueIds.size} unique found)`);
  assert(ids.every((id) => typeof id === 'string' && id !== 'OPEN' && id.length > 0), 'no id is OPEN/empty/non-string');
}

// ── 4. No duplicate filePath (unless explicitly documented) ────────────
console.log('\n--- 4. No duplicate filePath ---');
{
  const paths = ENGINE_REGISTRY.map((r) => r.filePath);
  const uniquePaths = new Set(paths);
  assert(uniquePaths.size === paths.length, `all ${paths.length} filePaths are unique (${uniquePaths.size} unique found)`);
  assert(paths.every((p) => typeof p === 'string' && p !== 'OPEN'), 'no filePath is OPEN — every component has a verified path');
}

// ── 5. Controlled vocabularies are respected ────────────────────────────
console.log('\n--- 5. Controlled vocabularies ---');
{
  const ALLOWED_CATEGORY_BASE = [
    'executable-inference-engine', 'facade-partial-orchestrator', 'router', 'narrative-assembler',
    'diagnostics-engine', 'qa-validation-engine', 'dataset-knowledge-module', 'adapter-compatibility-layer',
    'archive-report-layer', 'orphan-module',
  ];
  const isAllowedCategory = (c) => ALLOWED_CATEGORY_BASE.includes(c) || ALLOWED_CATEGORY_BASE.some((b) => c === `${b} (INFERRED)`);
  assert(ENGINE_REGISTRY.every((r) => isAllowedCategory(r.category)),
    'every record.category is one of the 10 controlled-vocabulary values (optionally suffixed "(INFERRED)" per Specification §8 Intelligence Layer)');

  const ALLOWED_SYSTEM = ['kashf', 'hawi', 'shared', 'brain', 'qa', 'intelligence', 'infrastructure'];
  assert(ENGINE_REGISTRY.every((r) => ALLOWED_SYSTEM.includes(r.system)),
    'every record.system is one of the 7 controlled-vocabulary values');

  // OPEN is a legitimate 4th state here (Specification §8 deliberately leaves
  // orphanStatus OPEN for most of the un-audited Intelligence Layer) — it is
  // not a controlled-vocabulary violation, it is an honest "not yet verified".
  const ALLOWED_ORPHAN = ['orphan', 'not-orphan', 'disconnected-by-decision', 'OPEN'];
  assert(ENGINE_REGISTRY.every((r) => ALLOWED_ORPHAN.includes(r.orphanStatus)),
    'every record.orphanStatus is one of the 3 controlled-vocabulary values, or the honest OPEN sentinel');
}

// ── 6. OPEN is never converted into an invented value ───────────────────
console.log('\n--- 6. OPEN preserved, not invented ---');
{
  const openDescriptionRecords = ENGINE_REGISTRY.filter((r) => r.description === 'OPEN');
  assert(openDescriptionRecords.length > 0, 'at least one record legitimately carries description === "OPEN" (not backfilled from filename)');
  const sample = findRegistryComponentById('intent-analyzer-hebrew-rules');
  assert(sample && sample.description === 'OPEN', 'a specific unverified field (intent-analyzer-hebrew-rules.description) is the literal string "OPEN", not a guess');
  assert(sample && sample.evidence.overall === 'OPEN', 'the matching evidence tag is also OPEN, not upgraded to VERIFIED/INFERRED without cause');
}

// ── 7. getEngineRegistrySnapshot returns an immutable copy ─────────────
console.log('\n--- 7. Immutability ---');
{
  const snap1 = getEngineRegistrySnapshot();
  assert(Object.isFrozen(snap1), 'the returned snapshot array is frozen');
  assert(Object.isFrozen(snap1[0]), 'individual records inside the snapshot are frozen');
  assert(snap1 !== ENGINE_REGISTRY, 'the snapshot is not the same reference as the internal ENGINE_REGISTRY');

  let threw = false;
  try {
    snap1.push({ id: 'injected' });
  } catch (e) {
    threw = true;
  }
  assert(threw || snap1.length === ENGINE_REGISTRY.length, 'attempting to mutate the returned snapshot does not grow it (frozen array rejects push)');

  const snap2 = getEngineRegistrySnapshot();
  assert(snap2 !== snap1, 'two separate calls to getEngineRegistrySnapshot() return two distinct object graphs (no shared mutable reference)');
  assert(JSON.stringify(snap1) === JSON.stringify(snap2), 'both snapshots carry identical data (deterministic)');
}

// ── 8. Filtering by category works ──────────────────────────────────────
console.log('\n--- 8. listRegistryComponentsByCategory ---');
{
  const orphans = listRegistryComponentsByCategory('orphan-module');
  assert(orphans.length > 0, 'listRegistryComponentsByCategory("orphan-module") returns at least one record');
  assert(orphans.every((r) => r.category === 'orphan-module'), 'every returned record actually has category === "orphan-module"');
  assert(Object.isFrozen(orphans), 'the filtered result array is frozen (read-only)');

  const none = listRegistryComponentsByCategory('this-category-does-not-exist');
  assert(Array.isArray(none) && none.length === 0, 'an unknown category returns an empty array, not an error or invented data');
}

// ── 9. Lookup by id works ────────────────────────────────────────────────
console.log('\n--- 9. findRegistryComponentById ---');
{
  const found = findRegistryComponentById('kashf-reading-engine');
  assert(!!found, 'findRegistryComponentById("kashf-reading-engine") finds a record');
  assert(found.id === 'kashf-reading-engine', 'the found record has the correct id');

  const missing = findRegistryComponentById('does-not-exist-anywhere');
  assert(missing === null, 'an unknown id returns null, not undefined or an invented record');
}

// ── 10. listRegistryOpenItems returns only records with real openItems ─
console.log('\n--- 10. listRegistryOpenItems ---');
{
  const withOpenItems = listRegistryOpenItems();
  assert(withOpenItems.length > 0, 'at least one record has non-empty openItems');
  assert(withOpenItems.every((r) => Array.isArray(r.openItems) && r.openItems.length > 0),
    'every record returned actually has a non-empty openItems array (not the OPEN string default)');
  const ids = withOpenItems.map((r) => r.id);
  assert(ids.includes('kundali-engine'), 'kundali-engine appears in listRegistryOpenItems() (documented open decision: connect/delete)');
  assert(ids.includes('komilla-house-signs'), 'komilla-house-signs appears in listRegistryOpenItems() (documented open decision: Ramal Shastra identity)');
}

// ── 11. kundali-engine is marked orphan ─────────────────────────────────
console.log('\n--- 11. kundali-engine orphan classification ---');
{
  const rec = findRegistryComponentById('kundali-engine');
  assert(!!rec, 'kundali-engine exists in the registry');
  assert(rec.orphanStatus === 'orphan', 'kundali-engine.orphanStatus === "orphan"');
  assert(rec.category === 'orphan-module', 'kundali-engine.category === "orphan-module"');
  assert(rec.executionStatus === 'disconnected-orphan', 'kundali-engine.executionStatus === "disconnected-orphan"');
}

// ── 12. kashf-ai-context-builder is not marked as connected to live runtime ─
console.log('\n--- 12. kashf-ai-context-builder disconnected-from-live-runtime ---');
{
  const rec = findRegistryComponentById('kashf-ai-context-builder');
  assert(!!rec, 'kashf-ai-context-builder exists in the registry');
  assert(rec.executionStatus !== 'connected-live', 'kashf-ai-context-builder.executionStatus is not "connected-live"');
  assert(!/^connected-partial \(רק דרך qa\/, לא UI\)$/.test(rec.executionStatus),
    'kashf-ai-context-builder.executionStatus does not repeat the unverified Specification claim ("connected-partial (רק דרך qa/, לא UI)") without correction');
  assert(/disconnected/.test(rec.executionStatus), 'kashf-ai-context-builder.executionStatus explicitly states it is disconnected from live runtime');
}

// ── 13. kashf-reading-engine is classified Facade/Partial-Orchestrator ──
console.log('\n--- 13. kashf-reading-engine classification ---');
{
  const rec = findRegistryComponentById('kashf-reading-engine');
  assert(!!rec, 'kashf-reading-engine exists in the registry');
  assert(rec.category === 'facade-partial-orchestrator', 'kashf-reading-engine.category === "facade-partial-orchestrator" (not executable-inference-engine)');
}

// ── 14. No engine files are imported by the registry module itself ─────
console.log('\n--- 14. No engine imports inside the registry file ---');
{
  const src = fs.readFileSync(REGISTRY_PATH, 'utf8');
  // Matches an actual require('...') call with a string argument — not bare
  // "require()" mentions inside prose/knownLimitations strings (which this
  // file legitimately contains, describing OTHER files' require() calls).
  assert(!/\brequire\(\s*['"`]/.test(src), 'the registry file contains zero actual require(\'...\') calls (prose mentions of other files\' require() usage are not code)');
  assert(!/^\s*import\b/m.test(src), 'the registry file contains zero ES import statements');
  assert(!/window\.\w+\s*\(/.test(src), 'the registry file does not call any window.* function (no engine invocation)');
}

// ── Summary ───────────────────────────────────────────────────────────
console.log(`\n${failures === 0 ? '✓ ALL TESTS PASSED' : `✗ ${failures} TEST(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
