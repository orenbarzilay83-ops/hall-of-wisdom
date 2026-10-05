/**
 * Kashf p169-170 "need fulfilment" research round.
 *
 * Three items were chased across the full scanned book:
 *   1. "location of the tenth figure" (p169-170 house-class rule) — stays
 *      blocked-by-source: "its owner/lord" (בעליו) is never defined, and H10
 *      is always an angle house by the book's own fixed classification, so
 *      the stated condition cannot be read literally without guessing.
 *   2. definition of "water houses" — fully explicit in source (p43,
 *      p47/p49/p51/p53): houses 3, 7, 11, 15.
 *   3. the water-row-opening rule (p170) — computable and now wired as a
 *      supporting-condition method (not the operational primary for
 *      completion.willComplete, which stays completion.p173.fireRows15910).
 *
 * This file tests what actually became runnable (item 3) and guards that
 * item 1 stays honestly blocked rather than silently "resolved".
 */
import { executeCanonicalCustomMethod, hasCanonicalCustomExecutor, hasCanonicalLegacyExecutor } from './goral-hachol/engine/kashf-canonical-executors.js';
import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { KASHF_AL_ASRAR_PAGES } from './goral-hachol/data/sources/kashf-al-asrar/kashf-al-asrar-book.js';

let passed = 0;
let failed = 0;
function assert(condition, message) {
  if (condition) {
    passed++;
    console.log('✓ ' + message);
  } else {
    failed++;
    console.error('✗ ' + message);
  }
}

function makeBoard(overrides = {}) {
  return {
    entries: Array.from({ length: 16 }, (_, index) => {
      const house = index + 1;
      const pattern = overrides[house] || '2222';
      return { house, houseNumber: house, pattern, key: pattern, hebrewName: pattern };
    }),
    boardValidation: { isValid: true, warnings: [] },
  };
}

console.log('\n--- p170 water-houses executor: all four water rows open ---');
const allOpenBoard = makeBoard({ 3: '2212', 7: '2212', 11: '2212', 15: '2212' });
const allOpenResult = executeCanonicalCustomMethod('needFulfillment.p170.waterHousesRowOpen', allOpenBoard);
assert(hasCanonicalCustomExecutor('needFulfillment.p170.waterHousesRowOpen'), 'p170 water-houses executor is registered and reachable');
assert(allOpenResult.housesUsed.join(',') === '3,7,11,15', 'p170 water-houses executor uses exactly houses 3/7/11/15');
assert(allOpenResult.houses.every((h) => h.waterRowState === 'open'), 'p170 reads the third digit (water row) as open for all four houses');
assert(allOpenResult.allWaterRowsOpen === true, 'p170 all-open condition is detected');
assert(allOpenResult.positive === true, 'p170 all-open water houses judges the request fulfilled');
assert(allOpenResult.outputHebrew.includes('תתקיים'), 'p170 positive branch preserves the source Hebrew verdict wording');
assert(allOpenResult.sourceRef === 'כשף אל-אסרר עמ׳ 170', 'p170 result cites the exact source page');

console.log('\n--- p170 water-houses executor: one water row closed ---');
const oneClosedBoard = makeBoard({ 3: '2212', 7: '2212', 11: '2222', 15: '2212' });
const oneClosedResult = executeCanonicalCustomMethod('needFulfillment.p170.waterHousesRowOpen', oneClosedBoard);
assert(oneClosedResult.houses.find((h) => h.houseNumber === 11).waterRowState === 'joined', 'p170 reads H11 water row as closed/joined when the digit is 2');
assert(oneClosedResult.allWaterRowsOpen === false, 'p170 a single closed water house breaks the all-open condition');
assert(oneClosedResult.positive === false, 'p170 one closed water house judges the request prevented for this asker');
assert(oneClosedResult.outputHebrew.includes('נמנעת'), 'p170 negative branch preserves the source Hebrew verdict wording');

console.log('\n--- p170 water-houses executor: missing board data ---');
assert(executeCanonicalCustomMethod('needFulfillment.p170.waterHousesRowOpen', { entries: [] }) === null, 'p170 executor returns null rather than guessing when houses are missing');

console.log('\n--- registry metadata: water-houses stays a supporting check, not a second primary ---');
const waterMethod = getKashfMethod('needFulfillment.p170.waterHousesRowOpen');
assert(waterMethod.kashfRuntimeStatus === 'ready', 'water-houses method is registered as ready');
assert(waterMethod.executorStatus === 'ready', 'water-houses method executor status is ready');
assert(waterMethod.methodRole === 'supporting-condition', 'water-houses method is a supporting condition, not a second canonical-operational method');
assert(waterMethod.runtimeAllowed === false, 'water-houses method is not auto-selected as the operational primary for completion.willComplete');
assert(waterMethod.kashfIntentId === 'completion.willComplete', 'water-houses method is indexed under the same intent as p173, by design, for future routing review');

console.log('\n--- registry metadata: H10 "owner/lord" item stays honestly blocked ---');
const h10Method = getKashfMethod('needFulfillment.p169-170.h10OwnerHouseClass');
assert(h10Method.kashfRuntimeStatus === 'blocked-by-source', 'H10 owner/lord item is registered as blocked-by-source, not silently absent');
assert(h10Method.methodRole === 'unresolved', 'H10 owner/lord item carries the unresolved method role');
assert(h10Method.runtimeAllowed === false, 'H10 owner/lord item cannot run');
assert(h10Method.executorStatus === 'not-applicable', 'H10 owner/lord item has no executor status');
assert(!hasCanonicalCustomExecutor('needFulfillment.p169-170.h10OwnerHouseClass'), 'H10 owner/lord item has no custom executor implementation');
assert(!hasCanonicalLegacyExecutor('needFulfillment.p169-170.h10OwnerHouseClass'), 'H10 owner/lord item has no legacy executor implementation either');

console.log('\n--- full registry validation still passes ---');
const validation = validateKashfMethodRegistry();
assert(validation.valid === true, 'adding both p169-170 entries keeps the canonical method registry internally valid');
assert(validation.errors.length === 0, 'no new validator errors were introduced');

console.log('\n--- kashf-al-asrar-book.js p169/p170 sync with the batch10-audited correction ---');
const p169 = KASHF_AL_ASRAR_PAGES.find((p) => p.page === 169);
const p170 = KASHF_AL_ASRAR_PAGES.find((p) => p.page === 170);
assert(p169.hebrewTranslation.trim().endsWith('הדבר קרוב'), 'book.js p169 now ends at the printed page break, matching kashf-v57-draft.html');
assert(!p169.hebrewTranslation.includes('בעליו'), 'book.js p169 does not duplicate the owner/lord clause that belongs on p170');
assert(p170.hebrewTranslation.includes('בעליו'), 'book.js p170 now restores the "its owner/lord" clause that was missing before this sync');
assert(p170.hebrewTranslation.includes('ועוד: התבונן בבתי המים'), 'book.js p170 now restores the separate water-houses check that was missing before this sync');
assert(p170.hebrewTranslation.includes('שורת יסוד האש של הבית השלושה־עשר סתומה — יש מבט הדדי'), 'book.js p170 gaze rule now matches the batch10-corrected H1-closed reciprocal-gaze branch');

console.log(`\nKashf p169-170 need-fulfilment tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
