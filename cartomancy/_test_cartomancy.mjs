// Smoke test for the ported cartomancy engine (vanilla ES modules, no build).
// Run: node cartomancy/_test_cartomancy.mjs
import { DECK, findCardById } from './engine/cartomancy-data.js';
import { interpretThreeCardSpread } from './engine/three-card-interpreter.js';
import { interpretSpread } from './engine/reading-engine.js';
import { validateQuestionForSpread } from './engine/spread-policy-engine.js';

function pick(id) {
  const c = findCardById ? findCardById(id) : DECK.find(x => x.id === id);
  if (!c) throw new Error('card not found: ' + id);
  return c;
}

let failures = 0;
function ok(cond, label) { console.log((cond ? '  ok  ' : ' FAIL ') + label); if (!cond) failures++; }

console.log('DECK size:', DECK.length);
ok(DECK.length === 52, 'DECK has 52 cards');

const root = pick('9♥');       // 9 of hearts (the "wish" card)
const heart = pick('A♠');      // ace of spades
const direction = pick('K♦');  // king of diamonds
const question = 'האם הקשר הזוגי שלי יתקדם?'; // "will my relationship advance?"

const insight = interpretThreeCardSpread(question, root, heart, direction, {});
ok(insight && typeof insight === 'object', 'interpretThreeCardSpread returned an object');
console.log('  three-card insight keys:', Object.keys(insight).join(','));

const viaSpread = interpretSpread('three', [root, heart, direction], question, 'love');
ok(viaSpread && typeof viaSpread === 'object', 'interpretSpread("three", ...) returned an object');

const v = validateQuestionForSpread(question, 'three');
ok(v !== undefined, 'validateQuestionForSpread returned a value');

console.log(failures === 0 ? '\nALL CARTOMANCY ENGINE TESTS PASSED' : `\n${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
