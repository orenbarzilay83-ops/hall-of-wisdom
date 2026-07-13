/**
 * goral-qa-scenarios.js
 *
 * רשימת תרחישי-בדיקה קבועה ל-Oren Smart Advisor — Goral QA Brain.
 * כל תרחיש = שאלה אמיתית + method + topicId אמיתי (מ-kashf-topic-rules.js /
 * hawi-interpreter.js) + מחשבת-אמהות אמיתית (משולבת מ-combos שכבר עבדו
 * בקבצים הקיימים בריפו, עם combos נוספים שנבדקו ישירות מול buildRamlBoardFromMothers
 * לפני ההוספה לקובץ הזה — אין המצאת-נתונים).
 *
 * Phase 4 (הרחבה 20 -> 60, 30 Kashf / 30 Hawi): כל תרחיש כולל גם expectedQuestionType
 * (מ-goral-question-taxonomy.js) ו-expectedRequiredRules/expectedForbiddenClientSections/
 * expectedAdvisorOnlySections, הנגזרים אוטומטית מ-goral-rule-applicability-matrix.js +
 * goral-question-taxonomy.js — לא מוקלדים-ידנית פר-תרחיש, כדי שלא ייווצר עותק-שני
 * שעלול לסטות מהמקור-האמיתי (המטריצה עצמה).
 */

import { RULE_CATEGORIES, getApplicability } from '../brain/goral-rule-applicability-matrix.js';
import { getQuestionType } from '../brain/goral-question-taxonomy.js';

// combos מאומתים ממקומות קיימים בריפו (_test_kashf_commerce_smart_layer.mjs ואחרים).
const MOTHERS_A = ['1112', '2122', '1121', '2211'];
const MOTHERS_B = ['1211', '2121', '2112', '1222'];
const MOTHERS_C = ['1122', '1212', '1122', '2221'];
const MOTHERS_D = ['2111', '1121', '2212', '1112'];
const MOTHERS_E = ['2211', '1222', '2121', '1211'];
// combos נוספים (Phase 4) — כל 16 הצורות התקפות, שולבו ונבדקו ישירות מול
// buildRamlBoardFromMothers (ראו _test_goral_knowledge_decision_brain_phase4.mjs)
// לפני שנוספו לכאן.
const MOTHERS_F = ['1111', '2222', '1212', '2121'];
const MOTHERS_G = ['1221', '2112', '1122', '2211'];
const MOTHERS_H = ['2212', '1121', '2111', '1222'];
const MOTHERS_I = ['1112', '1211', '2122', '2221'];
const MOTHERS_J = ['2111', '2212', '1221', '1112'];

function deriveExpectedMetadata(expectedQuestionType, method) {
  const expectedRequiredRules = RULE_CATEGORIES.filter(
    (cat) => getApplicability(expectedQuestionType, method, cat) === 'required'
  );
  const expectedAdvisorOnlySections = RULE_CATEGORIES.filter(
    (cat) => getApplicability(expectedQuestionType, method, cat) === 'advisorOnly'
  );
  const taxonomyDef = getQuestionType(expectedQuestionType);
  const expectedForbiddenClientSections = taxonomyDef?.forbiddenClientSections || [];
  return { expectedQuestionType, expectedRequiredRules, expectedAdvisorOnlySections, expectedForbiddenClientSections };
}

function scenario(base) {
  return { ...base, ...deriveExpectedMetadata(base.expectedQuestionType, base.method) };
}

const RAW_SCENARIOS = [
  // ── 1. עסק / הצלחה (businessSuccess) ────────────────────────────
  { id: 'commerce-kashf', category: 'commerce', method: 'kashf', topicId: 'commerce',
    question: 'האם העסק החדש יצליח?', mothers: MOTHERS_A, expectedQuestionType: 'businessSuccess' },
  { id: 'commerce-hawi', category: 'commerce', method: 'hawi', topicId: 'commerce',
    question: 'האם העסק החדש יצליח?', mothers: MOTHERS_B, expectedQuestionType: 'businessSuccess' },
  { id: 'business-partnership-kashf', category: 'commerce', method: 'kashf', topicId: 'partnership',
    question: 'האם השותפות העסקית תצליח?', mothers: MOTHERS_F, expectedQuestionType: 'businessSuccess' },
  { id: 'business-shop-kashf', category: 'commerce', method: 'kashf', topicId: 'commerce',
    question: 'האם כדאי לי לפתוח את החנות?', mothers: MOTHERS_G, expectedQuestionType: 'businessSuccess' },

  // ── 2. אהבה / זוגיות (loveRelationship) ──────────────────────────
  { id: 'love-kashf', category: 'loveIntention', method: 'kashf', topicId: 'marriage',
    question: 'מה הוא מרגיש כלפיי?', mothers: MOTHERS_C, expectedQuestionType: 'loveRelationship' },
  { id: 'love-hawi', category: 'loveIntention', method: 'hawi', topicId: 'loveHate',
    question: 'האם הוא אוהב אותי?', mothers: MOTHERS_D, expectedQuestionType: 'loveRelationship' },
  { id: 'love-marriage-hawi', category: 'loveIntention', method: 'hawi', topicId: 'marriage',
    question: 'האם הקשר שלנו יחזיק מעמד?', mothers: MOTHERS_H, expectedQuestionType: 'loveRelationship' },
  { id: 'love-truth-hawi', category: 'loveIntention', method: 'hawi', topicId: 'loveHate',
    question: 'האם היא אוהבת אותי באמת?', mothers: MOTHERS_I, expectedQuestionType: 'loveRelationship' },

  // ── 3. עיתוי (timing) ────────────────────────────────────────────
  { id: 'timing-kashf', category: 'timing', method: 'kashf', topicId: 'completion',
    question: 'מתי הדבר שביקשתי יקרה?', mothers: MOTHERS_E, expectedQuestionType: 'timing' },
  { id: 'timing-hawi', category: 'timing', method: 'hawi', topicId: 'completion',
    question: 'מתי המצב שלי ישתפר?', mothers: MOTHERS_A, expectedQuestionType: 'timing' },
  { id: 'timing-marriage-kashf', category: 'timing', method: 'kashf', topicId: 'marriage',
    question: 'מתי אתחתן?', mothers: MOTHERS_J, expectedQuestionType: 'timing' },

  // ── 4. רוחני (spiritual) ─────────────────────────────────────────
  { id: 'spiritual-kashf', category: 'spiritual', method: 'kashf', topicId: 'spiritualDiagnostics',
    question: 'האם יש עליי כישוף?', mothers: MOTHERS_B, expectedQuestionType: 'spiritual' },
  { id: 'spiritual-hawi', category: 'spiritual', method: 'hawi', topicId: 'spiritualDiagnostics',
    question: 'האם יש עליי עין הרע?', mothers: MOTHERS_C, expectedQuestionType: 'spiritual' },
  { id: 'spiritual-evil-spirit-hawi', category: 'spiritual', method: 'hawi', topicId: 'spiritualDiagnostics',
    question: 'האם יש עליי רוח רעה?', mothers: MOTHERS_F, expectedQuestionType: 'spiritual' },

  // ── 5. חולי / בריאות (health) ────────────────────────────────────
  { id: 'illness-kashf', category: 'illness', method: 'kashf', topicId: 'illness',
    question: 'מה מצב הבריאות שלי?', mothers: MOTHERS_D, expectedQuestionType: 'health' },
  { id: 'illness-hawi', category: 'illness', method: 'hawi', topicId: 'illness',
    question: 'האם אחלים מהמחלה?', mothers: MOTHERS_E, expectedQuestionType: 'health' },
  { id: 'illness-relapse-kashf', category: 'illness', method: 'kashf', topicId: 'illness',
    question: 'האם המחלה תחזור?', mothers: MOTHERS_G, expectedQuestionType: 'health' },

  // ── 6. השלמת עניין (completion) ──────────────────────────────────
  { id: 'completion-kashf', category: 'completion', method: 'kashf', topicId: 'completion',
    question: 'האם הדבר שביקשתי יצא לפועל?', mothers: MOTHERS_A, expectedQuestionType: 'completion' },
  { id: 'completion-hawi', category: 'completion', method: 'hawi', topicId: 'completion',
    question: 'האם הדבר יושלם?', mothers: MOTHERS_B, expectedQuestionType: 'completion' },
  { id: 'completion-plan-hawi', category: 'completion', method: 'hawi', topicId: 'completion',
    question: 'האם התוכנית שלי תצא לפועל?', mothers: MOTHERS_H, expectedQuestionType: 'completion' },

  // ── 7. נסיעה (travel) ─────────────────────────────────────────────
  { id: 'travel-kashf', category: 'travel', method: 'kashf', topicId: 'travel',
    question: 'האם הנסיעה שלי תהיה מוצלחת?', mothers: MOTHERS_C, expectedQuestionType: 'travel' },
  { id: 'travel-hawi', category: 'travel', method: 'hawi', topicId: 'travel',
    question: 'האם כדאי לי לנסוע עכשיו?', mothers: MOTHERS_D, expectedQuestionType: 'travel' },
  { id: 'travel-return-kashf', category: 'travel', method: 'kashf', topicId: 'travel',
    question: 'האם אחזור בשלום מהנסיעה?', mothers: MOTHERS_I, expectedQuestionType: 'travel' },

  // ── 8. כסף / פרנסה (moneyLivelihood) ──────────────────────────────
  { id: 'money-kashf', category: 'money', method: 'kashf', topicId: 'money',
    question: 'האם ארוויח כסף השנה?', mothers: MOTHERS_E, expectedQuestionType: 'moneyLivelihood' },
  { id: 'money-hawi', category: 'money', method: 'hawi', topicId: 'commerce',
    question: 'האם המצב הכלכלי שלי ישתפר?', mothers: MOTHERS_A, expectedQuestionType: 'moneyLivelihood' },
  { id: 'money-yearly-hawi', category: 'money', method: 'hawi', topicId: 'yearlyForecast',
    question: 'האם השנה תהיה טובה כלכלית?', mothers: MOTHERS_J, expectedQuestionType: 'moneyLivelihood' },

  // ── 9. אויבים / יריבים (enemiesConflict) ──────────────────────────
  { id: 'enemies-kashf', category: 'enemies', method: 'kashf', topicId: 'enemies',
    question: 'האם יש לי אויב שמזיק לי?', mothers: MOTHERS_B, expectedQuestionType: 'enemiesConflict' },
  { id: 'enemies-hawi', category: 'enemies', method: 'hawi', topicId: 'enemies',
    question: 'מי עומד נגדי?', mothers: MOTHERS_C, expectedQuestionType: 'enemiesConflict' },
  { id: 'enemies-dispute-kashf', category: 'enemies', method: 'kashf', topicId: 'disputes',
    question: 'האם אנצח במריבה?', mothers: MOTHERS_F, expectedQuestionType: 'enemiesConflict' },

  // ── 10. שאלה כללית (general) ──────────────────────────────────────
  { id: 'general-kashf', category: 'general', method: 'kashf', topicId: 'generalReading',
    question: 'מה המצב הכללי שלי?', mothers: MOTHERS_D, expectedQuestionType: 'general' },
  { id: 'general-hawi', category: 'general', method: 'hawi', topicId: 'generalReading',
    question: 'מה מצבי הכללי כרגע?', mothers: MOTHERS_E, expectedQuestionType: 'general' },
  { id: 'general-foundations-hawi', category: 'general', method: 'hawi', topicId: 'foundations',
    question: 'מהם היסודות הקובעים את מצבי כעת?', mothers: MOTHERS_G, expectedQuestionType: 'general' },

  // ── 11. כוונה/מחשבה נסתרת (hiddenThoughtIntent) ───────────────────
  { id: 'hidden-intent-marriage-kashf', category: 'hiddenIntent', method: 'kashf', topicId: 'marriage',
    question: 'מה הוא באמת חושב עליי?', mothers: MOTHERS_H, expectedQuestionType: 'hiddenThoughtIntent' },
  { id: 'hidden-intent-partnership-kashf', category: 'hiddenIntent', method: 'kashf', topicId: 'partnership',
    question: 'האם השותף שלי מסתיר ממני משהו?', mothers: MOTHERS_I, expectedQuestionType: 'hiddenThoughtIntent' },
  { id: 'hidden-intent-lovehate-hawi', category: 'hiddenIntent', method: 'hawi', topicId: 'loveHate',
    question: 'האם הוא מרמה אותי?', mothers: MOTHERS_J, expectedQuestionType: 'hiddenThoughtIntent' },
  { id: 'hidden-intent-partnership-hawi', category: 'hiddenIntent', method: 'hawi', topicId: 'partnership',
    question: 'מה השותף שלי מתכנן בסתר?', mothers: MOTHERS_A, expectedQuestionType: 'hiddenThoughtIntent' },

  // ── 12. אבדה/גניבה (lostObject) ────────────────────────────────────
  { id: 'lost-theft-kashf', category: 'lostObject', method: 'kashf', topicId: 'theft',
    question: 'מי גנב לי את הטבעת?', mothers: MOTHERS_B, expectedQuestionType: 'lostObject' },
  { id: 'lost-animal-kashf', category: 'lostObject', method: 'kashf', topicId: 'lostAnimal',
    question: 'האם אמצא את הכלב האבוד שלי?', mothers: MOTHERS_C, expectedQuestionType: 'lostObject' },
  { id: 'lost-theft-hawi', category: 'lostObject', method: 'hawi', topicId: 'theft',
    question: 'האם אחזיר את החפץ הגנוב?', mothers: MOTHERS_D, expectedQuestionType: 'lostObject' },
  { id: 'lost-treasure-hawi', category: 'lostObject', method: 'hawi', topicId: 'hiddenTreasure',
    question: 'האם אמצא את החפץ האבוד?', mothers: MOTHERS_E, expectedQuestionType: 'lostObject' },

  // ── 13. אופי/טבע אדם (personCharacter) ─────────────────────────────
  { id: 'character-partner-kashf', category: 'personCharacter', method: 'kashf', topicId: 'marriage',
    question: 'איזה מין אדם הוא בן הזוג שלי?', mothers: MOTHERS_F, expectedQuestionType: 'personCharacter' },
  { id: 'character-partnership-kashf', category: 'personCharacter', method: 'kashf', topicId: 'partnership',
    question: 'האם השותף העסקי שלי אדם ישר?', mothers: MOTHERS_G, expectedQuestionType: 'personCharacter' },
  { id: 'character-partner-hawi', category: 'personCharacter', method: 'hawi', topicId: 'marriage',
    question: 'מה האופי האמיתי של בן הזוג שלי?', mothers: MOTHERS_H, expectedQuestionType: 'personCharacter' },
  { id: 'character-loyalty-hawi', category: 'personCharacter', method: 'hawi', topicId: 'loveHate',
    question: 'האם הוא אדם נאמן?', mothers: MOTHERS_I, expectedQuestionType: 'personCharacter' },

  // ── 14. נישואין (marriage) ──────────────────────────────────────────
  { id: 'marriage-year-kashf', category: 'marriage', method: 'kashf', topicId: 'marriage',
    question: 'האם אני אתחתן השנה?', mothers: MOTHERS_J, expectedQuestionType: 'marriage' },
  { id: 'marriage-match-kashf', category: 'marriage', method: 'kashf', topicId: 'marriage',
    question: 'האם השידוך הזה מתאים לי?', mothers: MOTHERS_A, expectedQuestionType: 'marriage' },
  { id: 'marriage-success-hawi', category: 'marriage', method: 'hawi', topicId: 'marriage',
    question: 'האם הנישואין שלי יצליחו?', mothers: MOTHERS_B, expectedQuestionType: 'marriage' },
  { id: 'marriage-current-hawi', category: 'marriage', method: 'hawi', topicId: 'marriage',
    question: 'האם כדאי לי להתחתן עם בן הזוג הנוכחי?', mothers: MOTHERS_C, expectedQuestionType: 'marriage' },

  // ── 15. הריון וילדים (pregnancyChildren) ────────────────────────────
  { id: 'pregnancy-soon-kashf', category: 'pregnancyChildren', method: 'kashf', topicId: 'children',
    question: 'האם אכנס להריון בקרוב?', mothers: MOTHERS_D, expectedQuestionType: 'pregnancyChildren' },
  { id: 'children-status-kashf', category: 'pregnancyChildren', method: 'kashf', topicId: 'children',
    question: 'מה מצב הילדים שלי?', mothers: MOTHERS_E, expectedQuestionType: 'pregnancyChildren' },
  { id: 'pregnancy-hawi', category: 'pregnancyChildren', method: 'hawi', topicId: 'childrenPregnancy',
    question: 'האם אזכה להיריון?', mothers: MOTHERS_F, expectedQuestionType: 'pregnancyChildren' },
  { id: 'children-future-hawi', category: 'pregnancyChildren', method: 'hawi', topicId: 'childrenPregnancy',
    question: 'מה עתיד הילדים שלי?', mothers: MOTHERS_G, expectedQuestionType: 'pregnancyChildren' },

  // ── 16. שררה ומשפט (legalAuthority) ──────────────────────────────────
  { id: 'authority-role-kashf', category: 'legalAuthority', method: 'kashf', topicId: 'authorityState',
    question: 'האם אקבל את התפקיד?', mothers: MOTHERS_H, expectedQuestionType: 'legalAuthority' },
  { id: 'legal-dispute-kashf', category: 'legalAuthority', method: 'kashf', topicId: 'disputes',
    question: 'האם אנצח בתביעה המשפטית?', mothers: MOTHERS_I, expectedQuestionType: 'legalAuthority' },
  { id: 'authority-senior-role-hawi', category: 'legalAuthority', method: 'hawi', topicId: 'authorityState',
    question: 'האם אתמנה לתפקיד הבכיר?', mothers: MOTHERS_J, expectedQuestionType: 'legalAuthority' },
  { id: 'legal-process-hawi', category: 'legalAuthority', method: 'hawi', topicId: 'disputes',
    question: 'מה תוצאות ההליך המשפטי שלי?', mothers: MOTHERS_A, expectedQuestionType: 'legalAuthority' },

  // ── 17. עבודה וקריירה (workCareer) ────────────────────────────────────
  { id: 'career-new-job-kashf', category: 'workCareer', method: 'kashf', topicId: 'authorityState',
    question: 'האם אקבל את העבודה החדשה?', mothers: MOTHERS_B, expectedQuestionType: 'workCareer' },
  { id: 'career-independent-kashf', category: 'workCareer', method: 'kashf', topicId: 'commerce',
    question: 'האם כדאי לי לפתוח עסק עצמאי כמקור פרנסה?', mothers: MOTHERS_C, expectedQuestionType: 'workCareer' },
  { id: 'career-job-loss-hawi', category: 'workCareer', method: 'hawi', topicId: 'authorityState',
    question: 'האם אני עומד לאבד את העבודה?', mothers: MOTHERS_D, expectedQuestionType: 'workCareer' },
  { id: 'career-new-position-hawi', category: 'workCareer', method: 'hawi', topicId: 'commerce',
    question: 'האם כדאי לי לעבור למשרה חדשה?', mothers: MOTHERS_E, expectedQuestionType: 'workCareer' },
];

export const GORAL_QA_SCENARIOS = RAW_SCENARIOS.map(scenario);

export default { GORAL_QA_SCENARIOS };
