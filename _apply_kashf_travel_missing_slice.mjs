import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const methodPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const routePath = 'goral-hachol/registry/kashf-question-route-registry.js';

let methods = fs.readFileSync(methodPath, 'utf8');
let routes = fs.readFileSync(routePath, 'utf8');

const newMissingAlive = `  'missing.p248-249.lifeH1H4H9Outcome': method({
    kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',
    kashfIntentId: 'missing.aliveOrDead',
    topicId: 'missingPerson',
    sourcePages: [248, 249],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source method selected after provenance review: H1, H4, H9 and the outcome/judge are used for the life/death judgment, with the named death-sign figures in H6/H7/H8/outcome. The previously mapped 3/5/9 recurrence rule belongs to the later al-Multaqat addition and must not be used as the canonical runtime method.',
  }),`;

const oldMissingRegex = /  'missing\.p248\.aliveOrDead': method\(\{[\s\S]*?\n  \}\),\n\n  'enemy\.p271\.h1vsH12'/;
if (oldMissingRegex.test(methods)) {
  methods = methods.replace(oldMissingRegex, `${newMissingAlive}\n\n  'enemy.p271.h1vsH12'`);
}

const methodMarker = '  // ── REPAIR REQUIRED ----------------------------------------------------';
if (!methods.includes('// ── TRAVEL + MISSING canonical slice')) {
  const block = `  // ── TRAVEL + MISSING canonical slice ----------------------------------
  'travel.p238.timeSelectionH9H4': method({
    kashfMethodId: 'travel.p238.timeSelectionH9H4',
    kashfIntentId: 'travel.timeSelection',
    topicId: 'travel',
    sourcePages: [238],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'travel',
    notes: 'Canonical time-selection rule judges a proposed departure time: Road, Ahyan/Nesu Rosh, or Incoming Honor in H9 / the head / querent house, with H4 benefic. The existing timing helper has a named-figure table defect and must not run until repaired. This method does not calculate a future date from nothing.',
  }),

  'travel.p239.profitEarthRowH2': method({
    kashfMethodId: 'travel.p239.profitEarthRowH2',
    kashfIntentId: 'travel.profit',
    topicId: 'travel',
    sourcePages: [239],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source travel-profit method: derive the stated earth-row result and combine/judge it with H2; benefic = profit, mixed = modest pleasant profit, malefic = no good.',
  }),

  'travel.p239.seaOrLandByElement': method({
    kashfMethodId: 'travel.p239.seaOrLandByElement',
    kashfIntentId: 'travel.seaOrLand',
    topicId: 'travel',
    sourcePages: [239],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source mode-of-travel method. Fire => land; air => outbound by sea and return by land; water => sea both ways; earth => land both ways.',
  }),

  'travel.p242.roadDangerH7Element': method({
    kashfMethodId: 'travel.p242.roadDangerH7Element',
    kashfIntentId: 'travel.roadDanger',
    topicId: 'travel',
    sourcePages: [242],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source danger classification uses H7 element: fire=robbers; air=road animals and the like; water=drowning/theft/fighting; earth=snakes/scorpions/ground harms. The current generic element resolver must be verified before reuse.',
  }),

  'travel.p244.returnH1H2H9': method({
    kashfMethodId: 'travel.p244.returnH1H2H9',
    kashfIntentId: 'travel.return',
    topicId: 'travel',
    sourcePages: [244],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source traveler-return rule: H1/H2/H9 benefic incoming figures support a good return; malefics indicate hardship and sometimes no return. H5 is the dedicated return house in the companion rule.',
  }),

  'missing.p249.returnAnglesJudge': method({
    kashfMethodId: 'missing.p249.returnAnglesJudge',
    kashfIntentId: 'missing.return',
    topicId: 'missingPerson',
    sourcePages: [249],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source return rule: benefic incoming figures in the angles indicate return when the judge/outcome also testifies. This answers whether the absent person returns; it is not a timing calculator.',
  }),

  'missing.p249.locationDirectionUnresolved': method({
    kashfMethodId: 'missing.p249.locationDirectionUnresolved',
    kashfIntentId: 'missing.location',
    topicId: 'missingPerson',
    sourcePages: [249, 250],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Body text distinguishes whether the absent person is in the city using the four angles and says to inspect direction, but the exact body-source directional operation is not sufficiently closed. Do not import the later Nuzhat fugitive-direction method.',
  }),

  'travel.external.p246.directionNuzhat': method({
    kashfMethodId: 'travel.external.p246.directionNuzhat',
    kashfIntentId: 'travel.direction',
    topicId: 'travel',
    sourcePages: [246],
    sourceLayer: 'added-from-other-book',
    attributedSourceBook: 'Nuzhat al-Uqul',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Explicit Nuzhat addition: dominant element gives direction (fire east, air west, water sea, earth qibla/south). Knowledge-only by default; no canonical body direction method has been selected.',
  }),

  'travel.external.p247.compareTwoTrips': method({
    kashfMethodId: 'travel.external.p247.compareTwoTrips',
    kashfIntentId: 'travel.compareTwoTrips',
    topicId: 'travel',
    sourcePages: [247],
    sourceLayer: 'added-from-other-book',
    attributedSourceBook: 'Nuzhat al-Uqul',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The two-trips comparison is inside the explicit Nuzhat addition. Retain for learning only unless explicitly selected later.',
  }),

  'fugitive.external.p250.nuzhat': method({
    kashfMethodId: 'fugitive.external.p250.nuzhat',
    kashfIntentId: 'fugitive.capture',
    topicId: 'missingPerson',
    sourcePages: [250],
    sourceLayer: 'added-from-other-book',
    attributedSourceBook: 'Nuzhat al-Uqul',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Fugitive material after the return marker is explicitly from Nuzhat al-Uqul. It must not be executed as body-source Kashf runtime.',
  }),

`;
  if (!methods.includes(methodMarker)) throw new Error('Method insertion marker not found');
  methods = methods.replace(methodMarker, block + methodMarker);
}

const oldMissingRoute = /  'q-missing-alive': route\(\{[\s\S]*?\n  \}\),\n/;
const newMissingRoute = `  'q-missing-alive': route({
    questionId: 'q-missing-alive',
    disposition: 'KEEP',
    kashfIntentId: 'missing.aliveOrDead',
    kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',
    kashfRuntimeStatus: 'ready',
    note: 'Provenance correction: the prior 3/5/9 recurrence method is in the later al-Multaqat addition. This route now points to the selected body-source life/death method from p248-p249.',
  }),
`;
if (oldMissingRoute.test(routes)) routes = routes.replace(oldMissingRoute, newMissingRoute);

const routeMarker = '  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------';
if (!routes.includes('// ── AUDITED TRAVEL + MISSING SLICE')) {
  const block = `  // ── AUDITED TRAVEL + MISSING SLICE -----------------------------------
  'q-travel-timing': route({
    questionId: 'q-travel-timing',
    disposition: 'RENAME',
    kashfIntentId: 'travel.timeSelection',
    kashfMethodId: 'travel.p238.timeSelectionH9H4',
    kashfRuntimeStatus: 'repair-required',
    note: 'Source-safe wording is whether a proposed departure time is favorable. p238 does not calculate an arbitrary future date; the existing timing table also requires repair.',
  }),

  'q-travel-direction': route({
    questionId: 'q-travel-direction',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'travel.direction',
    kashfMethodId: 'travel.external.p246.directionNuzhat',
    kashfRuntimeStatus: 'educational-only',
    note: 'The explicit dominant-element direction method is attributed to Nuzhat al-Uqul. No body-source canonical direction method is selected for runtime.',
  }),

  'q-sea-or-land': route({
    questionId: 'q-sea-or-land',
    disposition: 'KEEP',
    kashfIntentId: 'travel.seaOrLand',
    kashfMethodId: 'travel.p239.seaOrLandByElement',
    kashfRuntimeStatus: 'ready',
  }),

  'q-travel-profit': route({
    questionId: 'q-travel-profit',
    disposition: 'KEEP',
    kashfIntentId: 'travel.profit',
    kashfMethodId: 'travel.p239.profitEarthRowH2',
    kashfRuntimeStatus: 'ready',
  }),

  'q-travel-danger': route({
    questionId: 'q-travel-danger',
    disposition: 'KEEP',
    kashfIntentId: 'travel.roadDanger',
    kashfMethodId: 'travel.p242.roadDangerH7Element',
    kashfRuntimeStatus: 'repair-required',
    note: 'The source method is clear, but the current generic element resolver must be verified before canonical execution.',
  }),

  'q-traveler-return': route({
    questionId: 'q-traveler-return',
    disposition: 'KEEP',
    kashfIntentId: 'travel.return',
    kashfMethodId: 'travel.p244.returnH1H2H9',
    kashfRuntimeStatus: 'ready',
  }),

  'q-missing-location': route({
    questionId: 'q-missing-location',
    disposition: 'BLOCK',
    kashfIntentId: 'missing.location',
    kashfMethodId: 'missing.p249.locationDirectionUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The body source supports in-city/outside-city evidence, but the exact directional operation is not closed. Do not borrow the later Nuzhat fugitive-direction rule.',
  }),

  'q-missing-return': route({
    questionId: 'q-missing-return',
    disposition: 'RENAME',
    kashfIntentId: 'missing.return',
    kashfMethodId: 'missing.p249.returnAnglesJudge',
    kashfRuntimeStatus: 'ready',
    note: 'The selected body method answers whether the absent person returns. The current description also promises WHEN; timing must be removed or handled by a separate verified intent.',
  }),

  'q-fugitive': route({
    questionId: 'q-fugitive',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'fugitive.capture',
    kashfMethodId: 'fugitive.external.p250.nuzhat',
    kashfRuntimeStatus: 'educational-only',
  }),

  'q-lost-animal': route({
    questionId: 'q-lost-animal',
    disposition: 'ALIAS',
    aliasOf: 'q-lost-item',
    kashfIntentId: 'lostItem.return',
    kashfMethodId: 'lostItem.p202.returnH6H8',
    kashfRuntimeStatus: 'ready',
    note: 'p202 is a general lost-thing return rule and can cover a lost animal when the intent is simply whether it returns.',
  }),

  'q-two-trips': route({
    questionId: 'q-two-trips',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'travel.compareTwoTrips',
    kashfMethodId: 'travel.external.p247.compareTwoTrips',
    kashfRuntimeStatus: 'educational-only',
  }),

`;
  if (!routes.includes(routeMarker)) throw new Error('Route insertion marker not found');
  routes = routes.replace(routeMarker, block + routeMarker);
}

fs.writeFileSync(methodPath, methods);
fs.writeFileSync(routePath, routes);

for (const cmd of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const r = spawnSync(cmd[0], cmd[1], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
