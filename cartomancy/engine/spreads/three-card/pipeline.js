import { analyzeSpread } from "./rules.js";
import { decideThreeCardReading } from "./decide.js";
import { synthesize } from "./synthesis.js";
function buildThreeCardReading(root, heart, direction, question) {
  const signals = analyzeSpread(root, heart, direction, question);
  const decision = decideThreeCardReading(signals);
  return synthesize(root, heart, direction, signals, decision);
}
export {
  buildThreeCardReading
};
