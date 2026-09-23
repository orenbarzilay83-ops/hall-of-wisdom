/**
 * tests/raml-seasonal-astro-profile-engine.test.js
 *
 * Direct tests for raml-data/raml-seasonal-astro-profile-engine.js.
 * Kashf-only, source-verified fields (season / seasonZodiacCandidates /
 * element / planet / temperament) — singleZodiacSign and relationship.*
 * are contractually always OPEN/null (no source rule resolves a single
 * zodiac sign per figure, and no source rule was found for querent-vs-
 * quesited relationship logic — see KASHF_RISING_SIGN_ENGINE_RESEARCH_AND_PLAN.md
 * and KASHF_EXTERNAL_ZODIAC_SOURCE_AUDIT.md).
 *
 * Not wired to hawi-interpreter.js, raml-spiritual-diagnostics-engine.js,
 * buildBoardAnalysis, UI, or any routing. Node-only test, no network.
 */

const path = require('path');
const { execFileSync } = require('child_process');
const { ramlBuildSeasonalAstroProfile } = require('../raml-data/raml-seasonal-astro-profile-engine.js');

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

function chartOf(figureAtHouse1, figureAtHouse7) {
  return [
    { house: 1, key: figureAtHouse1 },
    { house: 7, key: figureAtHouse7 },
  ];
}

// ── 1. Figure from one explicit season group (autumn-only: 1222) ──────────
console.log('\n--- 1. Figure from one explicit season group ---');
{
  const profile = ramlBuildSeasonalAstroProfile(chartOf('1222', '2211'));
  assert(profile.querent.season.value === 'סתיו', 'querent (1222) unique season is סתיו');
  assert(Array.isArray(profile.querent.season.values) && profile.querent.season.values.length === 1, 'querent (1222) has one season candidate');
  assert(profile.querent.season.status === 'VERIFIED', 'querent (1222) season status is VERIFIED');
  assert(profile.querent.seasonZodiacCandidates.status === 'VERIFIED', 'querent (1222) zodiac candidates status is VERIFIED');
  assert(profile.querent.seasonZodiacCandidates.values.length === 3, 'querent (1222) has exactly 3 zodiac candidates');
}

// ── 2. Spring is explicit; source-overlap must stay unresolved ──────────────
console.log('\n--- 2. Explicit spring + overlapping season groups ---');
{
  const springOnly = ramlBuildSeasonalAstroProfile(chartOf('2211', '1222'));
  assert(springOnly.querent.season.value === 'אביב', 'querent (2211) unique season is אביב');
  assert(springOnly.querent.season.status === 'VERIFIED', 'querent (2211) spring status is VERIFIED, not reconstructed');

  const overlap = ramlBuildSeasonalAstroProfile(chartOf('1121', '2211'));
  assert(overlap.querent.season.value === null, 'querent (1121) does not auto-pick one season from an overlap');
  assert(overlap.querent.season.status === 'VERIFIED_OVERLAP', 'querent (1121) overlap is explicitly marked');
  assert(
    JSON.stringify(overlap.querent.season.values) === JSON.stringify(['אביב', 'סתיו']),
    'querent (1121) preserves both explicit source seasons: אביב + סתיו'
  );
  assert(overlap.querent.seasonZodiacCandidates.status === 'VERIFIED_OVERLAP', 'overlap propagates to zodiac candidates');
  assert(overlap.querent.seasonZodiacCandidates.values.length === 6, 'overlap keeps the six zodiac candidates from both seasons');
}

// ── 3. Figure with a VERIFIED planet (1121 -> venus) ───────────────────────
console.log('\n--- 3. Figure with a VERIFIED planet ---');
{
  const profile = ramlBuildSeasonalAstroProfile(chartOf('1121', '2211'));
  assert(profile.querent.planet.status === 'VERIFIED', 'querent (1121) planet status is VERIFIED');
  assert(profile.querent.planet.value && profile.querent.planet.value.key === 'venus', 'querent (1121) planet is venus');
  assert(profile.querent.temperament.status === 'VERIFIED', 'querent (1121) temperament status is VERIFIED (reused from raml-temperament-engine)');
}

// ── 4. Figure with NO resolved planet (2211 כבוד נכנס — SHIBUTZ_4_UNRESOLVED_NOTE) ──
console.log('\n--- 4. Figure with no resolved planet ---');
{
  const profile = ramlBuildSeasonalAstroProfile(chartOf('2211', '1121'));
  assert(profile.querent.planet.status === 'OPEN', 'querent (2211) planet status is OPEN (no verified planet match)');
  assert(profile.querent.planet.value === null, 'querent (2211) planet.value is null when OPEN');
  assert(profile.querent.temperament.status === 'OPEN', 'querent (2211) temperament status is OPEN (mirrors planet OPEN state)');
  assert(profile.querent.temperament.value === null, 'querent (2211) temperament.value is null when OPEN');
}

// ── 5. Querent and quesited resolve independently, including overlap ─────────
console.log('\n--- 5. Querent and quesited resolved independently ---');
{
  const profile = ramlBuildSeasonalAstroProfile(chartOf('1121', '2211'));
  assert(profile.querent.figureKey === '1121', 'querent figureKey matches house 1');
  assert(profile.quesited.figureKey === '2211', 'quesited figureKey matches house 7');
  assert(profile.querent.season.value === null, 'querent overlap is not collapsed');
  assert(profile.quesited.season.value === 'אביב', 'quesited unique spring remains resolved');
}

// ── 6. Querent and quesited share the SAME element (both מים) ──────────────
console.log('\n--- 6. Querent and quesited share the same element ---');
{
  // 1111 (דרך) and 1211 (בר הלחי) both map to מים in FIGURE_ELEMENTS_MAP
  const profile = ramlBuildSeasonalAstroProfile(chartOf('1111', '1211'));
  assert(profile.querent.element.value === 'מים', 'querent (1111) element is מים');
  assert(profile.quesited.element.value === 'מים', 'quesited (1211) element is מים');
  assert(profile.querent.element.value === profile.quesited.element.value, 'querent and quesited elements match (same-element case)');
}

// ── 7. Querent and quesited have DIFFERENT elements ─────────────────────────
console.log('\n--- 7. Querent and quesited have different elements ---');
{
  // 1112 (סף יוצא) -> אש ; 1121 (נלחם) -> רוח
  const profile = ramlBuildSeasonalAstroProfile(chartOf('1112', '1121'));
  assert(profile.querent.element.value === 'אש', 'querent (1112) element is אש');
  assert(profile.quesited.element.value === 'רוח', 'quesited (1121) element is רוח');
  assert(profile.querent.element.value !== profile.quesited.element.value, 'querent and quesited elements differ (different-element case)');
}

// ── 8. singleZodiacSign is ALWAYS OPEN/null, for every figure, no exceptions ─
console.log('\n--- 8. singleZodiacSign never resolves to a computed sign ---');
{
  const ALL_16_PATTERNS = [
    '1111', '1112', '1121', '1122', '1211', '1212', '1221', '1222',
    '2111', '2112', '2121', '2122', '2211', '2212', '2221', '2222',
  ];
  let allOpen = true;
  for (const pattern of ALL_16_PATTERNS) {
    const profile = ramlBuildSeasonalAstroProfile(chartOf(pattern, pattern));
    if (
      profile.querent.singleZodiacSign.status !== 'OPEN' ||
      profile.querent.singleZodiacSign.value !== null ||
      profile.quesited.singleZodiacSign.status !== 'OPEN' ||
      profile.quesited.singleZodiacSign.value !== null
    ) {
      allOpen = false;
      console.error(`  (figure ${pattern} broke the OPEN/null guarantee)`);
    }
  }
  assert(allOpen, 'singleZodiacSign is OPEN and null for all 16 figures, with no exception');
}

// ── 9. No use of zodiacHebrew — structural + provenance check ──────────────
console.log('\n--- 9. No use of zodiacHebrew (Ramal Shastra) anywhere in the engine ---');
{
  const fs = require('fs');
  const engineSource = fs.readFileSync(
    path.join(__dirname, '..', 'raml-data', 'raml-seasonal-astro-profile-engine.js'),
    'utf8'
  );
  assert(!/zodiacHebrew/i.test(engineSource), 'engine source text does not reference zodiacHebrew');
  assert(!/kashf-figure-names/i.test(engineSource), 'engine source text does not import kashf-figure-names.js');

  const profile = ramlBuildSeasonalAstroProfile(chartOf('1121', '2211'));
  const provenanceSourceIds = [
    profile.querent.season.provenance.sourceId,
    profile.querent.seasonZodiacCandidates.provenance.sourceId,
    profile.querent.element.provenance.sourceId,
    profile.querent.planet.provenance.sourceId,
    profile.querent.temperament.provenance.sourceId,
  ];
  const allowedSourceIds = new Set(['kashf-shibutzim', 'kashf-pending-extraction', 'raml-temperament-engine']);
  assert(
    provenanceSourceIds.every(id => allowedSourceIds.has(id)),
    'every returned provenance.sourceId is one of the three approved Kashf-sourced modules only'
  );
}

// ── 10. No automatic conversion from candidates to one sign/season ──────────
console.log('\n--- 10. No automatic reduction of seasonal candidates ---');
{
  const unique = ramlBuildSeasonalAstroProfile(chartOf('1222', '2211'));
  assert(unique.querent.seasonZodiacCandidates.values.length === 3, 'unique season keeps 3 zodiac candidates');
  assert(unique.querent.singleZodiacSign.value === null, 'singleZodiacSign stays null with 3 candidates');

  const overlap = ramlBuildSeasonalAstroProfile(chartOf('1121', '2211'));
  assert(overlap.querent.seasonZodiacCandidates.values.length === 6, 'overlap keeps all 6 zodiac candidates');
  assert(overlap.querent.season.value === null, 'overlap does not reduce two seasons to one');
  assert(overlap.querent.singleZodiacSign.value === null, 'singleZodiacSign stays null with overlapping seasons');
}

// ── 11. provenance present on every field ────────────────────────────────────
console.log('\n--- 11. provenance and status preserved on every field ---');
{
  const profile = ramlBuildSeasonalAstroProfile(chartOf('1121', '2211'));
  for (const role of ['querent', 'quesited']) {
    const subject = profile[role];
    for (const field of ['season', 'seasonZodiacCandidates', 'element', 'planet', 'temperament']) {
      const entry = subject[field];
      assert(typeof entry.status === 'string' && entry.status.length > 0, `${role}.${field}.status is a non-empty string`);
      assert(entry.provenance && typeof entry.provenance === 'object', `${role}.${field}.provenance is present`);
      assert(typeof entry.provenance.sourceId === 'string', `${role}.${field}.provenance.sourceId is present`);
      assert(typeof entry.provenance.status === 'string', `${role}.${field}.provenance.status is present`);
    }
    assert(subject.singleZodiacSign.status === 'OPEN', `${role}.singleZodiacSign.status is OPEN`);
    assert(typeof subject.singleZodiacSign.reason === 'string', `${role}.singleZodiacSign.reason is present`);
  }
  for (const relField of ['elementCompatibility', 'planetaryRelationship', 'temperamentRelationship']) {
    const entry = profile.relationship[relField];
    assert(entry.status === 'OPEN' && entry.value === null, `relationship.${relField} is OPEN/null as contractually required`);
    assert(typeof entry.reason === 'string', `relationship.${relField}.reason is present`);
  }
}

// ── 12. Node loading ─────────────────────────────────────────────────────────
console.log('\n--- 12. Node loading ---');
assert(typeof ramlBuildSeasonalAstroProfile === 'function', 'ramlBuildSeasonalAstroProfile loads via require() in Node');

// ── 13. Browser (window) export check ────────────────────────────────────────
console.log('\n--- 13. Browser export check (simulated window global) ---');
{
  try {
    const engineAbsPath = path.join(__dirname, '..', 'raml-data', 'raml-seasonal-astro-profile-engine.js');
    const out = execFileSync(
      process.execPath,
      ['-e', `global.window = {}; const m = require(${JSON.stringify(engineAbsPath)}); if (typeof window.ramlBuildSeasonalAstroProfile !== 'function') { console.error('NO_WINDOW_EXPORT'); process.exit(1); } console.log('WINDOW_EXPORT_OK');`],
      { encoding: 'utf8' }
    );
    assert(out.includes('WINDOW_EXPORT_OK'), 'window.ramlBuildSeasonalAstroProfile is assigned when a window global exists');
  } catch (error) {
    assert(false, `window export check did not run cleanly: ${error.message}`);
  }
}

console.log(`\n${failures === 0 ? '✓ ALL PASSED' : `✗ ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
