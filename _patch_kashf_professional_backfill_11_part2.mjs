#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text, 'utf8'); }

function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}

function replaceRegexOnce(text, regex, to, label) {
  const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
  const matches = [...text.matchAll(new RegExp(regex.source, flags))];
  if (matches.length !== 1) throw new Error(`${label}: expected exactly 1 regex match, found ${matches.length}`);
  return text.replace(regex, to);
}

// ---------------------------------------------------------------------------
// 6) Professional safety Golden tests and pending-count update.
// ---------------------------------------------------------------------------
{
  const path = '_test_kashf_professional_verdict_safety.mjs';
  let text = read(path);

  text = replaceOnce(
    text,
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 41, 'certification registry contains forty-one professionally certified methods');",
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 42, 'certification registry contains forty-two professionally certified methods');",
    'certified count 42',
  );

  const p254Tests = [
    "console.log('\\n--- Professional backfill batch 11 — p254 profession source closure ---');",
    '',
    "const p254Venus = buildKashfCanonicalAiBridge({ questionId: 'q-profession', questionText: 'מה המקצוע שלי לפי השיטה?', board: makeBoard({ 9:'1121', 10:'2111', 11:'2111' }) });",
    'const p254VenusExec = p254Venus.canonicalReading?.primaryFormula?.result?.executorResult;',
    "assert(p254Venus.resolution?.kashfMethodId === 'profession.p254.h9Planet', 'p254 profession route selects the exact method');",
    "assert(p254VenusExec?.attributionHebrew === 'נוגה', 'p254 maps Joudala 1121 to Venus from the corrected p133-134 source table');",
    "assert(String(p254VenusExec?.profession || '').includes('דברי הימים'), 'p254 Venus branch returns histories/music craft');",
    "assert(p254VenusExec?.easeOfWorkIndicated === true, 'p254 pure-benefic H10+H11 activates the one-way ease-of-work clause');",
    "assert(String(p254VenusExec?.outputHebrew || '').includes('מלאכתו מעטה בטרחה'), 'p254 ease clause is preserved in the exact executor draft');",
    '',
    "const p254Saturn = buildKashfCanonicalAiBridge({ questionId: 'q-profession', questionText: 'מה המלאכה?', board: makeBoard({ 9:'1221', 10:'2111', 11:'2111' }) });",
    'const p254SaturnExec = p254Saturn.canonicalReading?.primaryFormula?.result?.executorResult;',
    "assert(p254SaturnExec?.attributionHebrew === 'שבתאי', 'p254 maps Aqla/Sohar 1221 to Saturn, not to an unresolved node');",
    "assert(String(p254SaturnExec?.profession || '').includes('חקלאות'), 'p254 Saturn branch returns agriculture/earth work');",
    '',
    "const p254Head = buildKashfCanonicalAiBridge({ questionId: 'q-profession', questionText: 'מה המלאכה?', board: makeBoard({ 9:'1212' }) });",
    "const p254Tail = buildKashfCanonicalAiBridge({ questionId: 'q-profession', questionText: 'מה המלאכה?', board: makeBoard({ 9:'1112' }) });",
    'const p254HeadExec = p254Head.canonicalReading?.primaryFormula?.result?.executorResult;',
    'const p254TailExec = p254Tail.canonicalReading?.primaryFormula?.result?.executorResult;',
    "assert(p254HeadExec?.attributionHebrew === 'ראש התלי' && String(p254HeadExec?.profession || '').includes('דתות'), 'p254 distinguishes Head 1212 and returns the religions/hidden-knowledge branch');",
    "assert(p254TailExec?.attributionHebrew === 'זנב התלי' && String(p254TailExec?.profession || '').includes('בורות'), 'p254 distinguishes Tail 1112 and returns the ignorance/treachery branch');",
    "assert(p254HeadExec?.profession !== p254TailExec?.profession, 'p254 no longer collapses Head and Tail into one ambiguous fallback');",
    '',
    "const p254MixedEase = buildKashfCanonicalAiBridge({ questionId: 'q-profession', questionText: 'מה המלאכה?', board: makeBoard({ 9:'1122', 10:'1121', 11:'2111' }) });",
    'const p254MixedEaseExec = p254MixedEase.canonicalReading?.primaryFormula?.result?.executorResult;',
    "assert(p254MixedEaseExec?.h10Quality === 'mixed', 'p254 Golden case exposes H10 mixed classification');",
    "assert(p254MixedEaseExec?.easeOfWorkIndicated === null, 'p254 mixed H10 does not activate the pure-saad ease clause');",
    "assert(!String(p254MixedEaseExec?.outputHebrew || '').includes('מלאכתו מעטה בטרחה'), 'p254 does not promote mixed testimony into the ease-of-work source branch');",
    "assert(!String(p254MixedEaseExec?.outputHebrew || '').includes('מלאכתו קשה'), 'p254 does not invent the inverse hard-work claim');",
    '',
    "assert(p254Venus.professionalVerdictSafety?.certificationStatus === 'certified', 'p254 passed Professional Verdict Safety source closure');",
    "assert(p254Venus.professionalVerdictSafety?.clientFacingCertified === true, 'p254 exact client-facing explanation is certified');",
    "assert(p254Venus.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p254 remains categorical/non-binary rather than becoming yes/no');",
    "assert(p254Venus.professionalVerdictSafety?.binaryClientVerdictAllowed === false, 'p254 cannot be converted into a yes/no verdict');",
    "assert(p254Venus.professionalVerdictSafety?.authoritativeClientDraftHebrew === p254VenusExec?.outputHebrew, 'p254 safety gate locks the exact source-bounded executor draft');",
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes('profession.p254.h9Planet'), 'p254 profession method is explicitly professionally certified');",
    '',
  ].join('\n');

  text = replaceOnce(
    text,
    '// Two runnable methods remain intentionally uncertified after source/implementation audit.',
    p254Tests + '// One runnable method remains intentionally uncertified after source/implementation audit.',
    'insert p254 professional tests',
  );

  text = replaceRegexOnce(
    text,
    /\/\/ One runnable method remains intentionally uncertified after source\/implementation audit\.\nfor \(const id of \[\n  'marriage\.p211\.dissolutionH7StateMatrix',\n  'profession\.p254\.h9Planet',\n\]\) \{\n  assert\(!KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS\.includes\(id\), id \+ ' remains pending professional source closure'\);\n\}/,
    [
      '// One runnable method remains intentionally uncertified after source/implementation audit.',
      'for (const id of [',
      "  'marriage.p211.dissolutionH7StateMatrix',",
      ']) {',
      "  assert(!KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes(id), id + ' remains pending professional source closure');",
      '}',
    ].join('\n'),
    'reduce pending list to p211',
  );

  write(path, text);
}

// ---------------------------------------------------------------------------
// 7) Canonical routing regression: p254 is no longer a legacy executor.
// ---------------------------------------------------------------------------
{
  const path = '_test_kashf_canonical_routing.mjs';
  let text = read(path);

  text = replaceOnce(
    text,
    '// ── P1 profession method-scoped legacy executor -------------------------',
    '// ── P1 profession source-closed canonical executor ----------------------',
    'routing p254 comment',
  );

  text = replaceOnce(
    text,
    "assert(professionReading.valid === true, 'q-profession executes through canonical legacy allowlist');",
    "assert(professionReading.valid === true, 'q-profession executes through the source-closed canonical p254 executor');\nassert(getKashfMethod('profession.p254.h9Planet')?.executionKind === 'custom-engine', 'p254 no longer depends on the legacy profession helper');",
    'routing p254 execution kind',
  );

  write(path, text);
}
