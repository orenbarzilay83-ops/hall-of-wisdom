/**
 * intent-analyzer-hebrew-rules.js
 *
 * Deterministic Hebrew signal/pattern rules for the Intent Analyzer.
 * Patterns only — no logic, no scoring, no state. Consumed by
 * intent-analyzer.js. Each pattern carries a weight: 3 = strong/specific
 * phrase, 2 = moderately specific, 1 = weak/generic (alone, cannot drive
 * high confidence — see intent-analyzer.js::MAX_CONFIDENCE_FOR_WEAK_ONLY_MATCH).
 *
 * Patterns are combined with each other and with word-position (not just
 * bag-of-words) by using multi-word regex fragments rather than isolated
 * keywords, so that e.g. "יצליח" (prediction) and "מצליח" (diagnosis
 * context: "לא מצליח") never collide.
 */

export const INTENT_PATTERNS = {
  prediction: [
    { pattern: /האם[^?]*יצליח/, weight: 3, label: 'prediction:will-succeed-question' },
    { pattern: /יצליח/, weight: 2, label: 'prediction:succeed-form' },
    { pattern: /מה יקרה/, weight: 2, label: 'prediction:what-will-happen' },
    { pattern: /איך יתפתח/, weight: 2, label: 'prediction:how-will-develop' },
    { pattern: /יתפתח/, weight: 1, label: 'prediction:develop-form' },
  ],

  decisionSupport: [
    { pattern: /כדאי לי/, weight: 3, label: 'decisionSupport:worth-it-for-me' },
    { pattern: /האם כדאי/, weight: 3, label: 'decisionSupport:is-it-worth' },
    { pattern: /האם נכון/, weight: 2, label: 'decisionSupport:is-it-right' },
    { pattern: /האם לעשות/, weight: 2, label: 'decisionSupport:whether-to-do' },
    { pattern: /כדאי/, weight: 1, label: 'decisionSupport:worth-it-generic' },
  ],

  stateAssessment: [
    { pattern: /מה מצבו/, weight: 3, label: 'stateAssessment:his-state' },
    { pattern: /מה מצבה/, weight: 3, label: 'stateAssessment:her-state' },
    { pattern: /האם הוא אוהב/, weight: 3, label: 'stateAssessment:does-he-love' },
    { pattern: /האם היא אוהבת/, weight: 3, label: 'stateAssessment:does-she-love' },
    { pattern: /האם יש[^?]*קשר/, weight: 2, label: 'stateAssessment:is-there-a-relationship' },
    { pattern: /האם קיימת/, weight: 2, label: 'stateAssessment:does-it-exist' },
    { pattern: /מה מצב/, weight: 1, label: 'stateAssessment:state-generic' },
  ],

  hiddenThoughtIntent: [
    { pattern: /מה הוא חושב/, weight: 3, label: 'hiddenThoughtIntent:what-he-thinks' },
    { pattern: /מה היא חושבת/, weight: 3, label: 'hiddenThoughtIntent:what-she-thinks' },
    { pattern: /מה (בלבו|בליבו)/, weight: 3, label: 'hiddenThoughtIntent:what-is-on-his-heart' },
    { pattern: /מה הכוונה שלו/, weight: 3, label: 'hiddenThoughtIntent:what-is-his-intention' },
    { pattern: /מה הכוונה שלה/, weight: 3, label: 'hiddenThoughtIntent:what-is-her-intention' },
    { pattern: /מה הוא מרגיש/, weight: 3, label: 'hiddenThoughtIntent:what-he-feels' },
    { pattern: /מה היא מרגישה/, weight: 3, label: 'hiddenThoughtIntent:what-she-feels' },
    { pattern: /(חושב|חושבת) עליי/, weight: 3, label: 'hiddenThoughtIntent:thinks-about-me' },
    { pattern: /מסתיר/, weight: 2, label: 'hiddenThoughtIntent:hiding' },
    { pattern: /מסתירה/, weight: 2, label: 'hiddenThoughtIntent:hiding-fem' },
    { pattern: /(מתכוון|מתכוונת)/, weight: 2, label: 'hiddenThoughtIntent:intends' },
  ],

  timingRequest: [
    { pattern: /מתי/, weight: 3, label: 'timingRequest:when' },
    { pattern: /תוך כמה זמן/, weight: 3, label: 'timingRequest:within-how-long' },
    { pattern: /באיזה חודש/, weight: 3, label: 'timingRequest:which-month' },
    { pattern: /באיזו תקופה/, weight: 3, label: 'timingRequest:which-period' },
    { pattern: /כמה זמן/, weight: 2, label: 'timingRequest:how-long' },
  ],

  investigation: [
    { pattern: /מי גנב/, weight: 3, label: 'investigation:who-stole' },
    { pattern: /מי עשה/, weight: 3, label: 'investigation:who-did' },
    { pattern: /(איפה|היכן) נמצא/, weight: 3, label: 'investigation:where-is' },
    { pattern: /מי אחראי/, weight: 3, label: 'investigation:who-is-responsible' },
    { pattern: /מה באמת קרה/, weight: 3, label: 'investigation:what-really-happened' },
    { pattern: /מי לקח/, weight: 2, label: 'investigation:who-took' },
  ],

  diagnosis: [
    { pattern: /מה מקור הבעיה/, weight: 3, label: 'diagnosis:source-of-problem' },
    { pattern: /למה זה קורה/, weight: 3, label: 'diagnosis:why-is-this-happening' },
    { pattern: /מה הסיבה/, weight: 3, label: 'diagnosis:what-is-the-reason' },
    { pattern: /ממה נובע/, weight: 3, label: 'diagnosis:what-does-it-stem-from' },
    { pattern: /למה[^?]*לא מצליח/, weight: 3, label: 'diagnosis:why-not-succeeding' },
    { pattern: /מדוע/, weight: 2, label: 'diagnosis:why-generic' },
  ],

  compatibility: [
    { pattern: /האם אנחנו מתאימים/, weight: 3, label: 'compatibility:are-we-compatible' },
    { pattern: /האם יש התאמה/, weight: 3, label: 'compatibility:is-there-a-match' },
    { pattern: /האם הקשר מתאים/, weight: 3, label: 'compatibility:is-the-relationship-fitting' },
    { pattern: /מתאימים/, weight: 1, label: 'compatibility:compatible-generic' },
  ],

  outcomeCompletion: [
    { pattern: /האם יושלם/, weight: 3, label: 'outcomeCompletion:will-be-completed' },
    { pattern: /האם יצא לפועל/, weight: 3, label: 'outcomeCompletion:will-materialize' },
    { pattern: /יצא לפועל/, weight: 3, label: 'outcomeCompletion:materialize-form' },
    { pattern: /האם יסתיים/, weight: 3, label: 'outcomeCompletion:will-end' },
    { pattern: /יושלם/, weight: 2, label: 'outcomeCompletion:completed-form' },
    { pattern: /האם אקבל/, weight: 2, label: 'outcomeCompletion:will-i-receive' },
  ],

  comparison: [
    { pattern: /מה עדיף/, weight: 3, label: 'comparison:what-is-preferable' },
    { pattern: /איזו אפשרות/, weight: 3, label: 'comparison:which-option' },
    { pattern: /מי מתאים יותר/, weight: 3, label: 'comparison:who-fits-better' },
    { pattern: /מה לבחור/, weight: 3, label: 'comparison:what-to-choose' },
    { pattern: /עדיף/, weight: 1, label: 'comparison:preferable-generic' },
  ],

  guidance: [
    { pattern: /מה עליי לעשות/, weight: 3, label: 'guidance:what-should-i-do' },
    { pattern: /איך לפעול/, weight: 3, label: 'guidance:how-to-act' },
    { pattern: /מה נכון עבורי/, weight: 3, label: 'guidance:what-is-right-for-me' },
    { pattern: /איך להתקדם/, weight: 3, label: 'guidance:how-to-proceed' },
  ],

  generalForecast: [
    { pattern: /מה צפוי לי/, weight: 3, label: 'generalForecast:what-is-expected-for-me' },
    { pattern: /מה העתיד/, weight: 3, label: 'generalForecast:what-is-the-future' },
    { pattern: /קריאה כללית/, weight: 3, label: 'generalForecast:general-reading' },
    { pattern: /מה יהיה/, weight: 1, label: 'generalForecast:what-will-be-weak' },
  ],
};

export default { INTENT_PATTERNS };
