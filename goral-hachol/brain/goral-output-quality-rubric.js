/**
 * goral-output-quality-rubric.js
 *
 * Scoring rubric used by the Decision Brain (deterministic pass) and,
 * later, by an AI evaluator. Each dimension: score 0-4, failure conditions,
 * warning examples, severity mapping. This file defines the rubric shape
 * only — actual scoring logic lives in goral-decision-brain.js.
 */

export const RUBRIC_DIMENSIONS = {
  relevanceToQuestion: {
    id: 'relevanceToQuestion',
    label: 'רלוונטיות לשאלה',
    description: 'האם התשובה עוסקת בנושא שנשאל בפועל, לא בנושא אחר',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: [
      'התשובה עוסקת בנושא שלא נשאל (topicId שגוי ביחס ל-questionType המסווג)',
      'בית שהוא formula-only מתויג בשם התמטי שלו (למשל "בית תשיעי — הדת והנסיעה" בשאלה עסקית)',
    ],
    warningExamples: ['שאלה עסקית שמקבלת תשובה על נסיעה', 'שאלת בריאות שמקבלת תשובה על אויבים'],
    severityMapping: { 0: 'high', 1: 'high', 2: 'medium', 3: 'low', 4: 'none' },
  },

  sourceFaithfulness: {
    id: 'sourceFaithfulness',
    label: 'נאמנות למקור',
    description: 'האם כל טענה מתועדת ל-sourceRulesApplied אמיתי, ללא ניסוח שממציא משמעות',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['sourceRulesApplied ריק לגמרי כשיש טענות תוכן', 'ניסוח שלא תואם את טקסט-המקור המצוטט'],
    warningExamples: ['פסקת מסקנה ללא אף sourceRulesApplied נלווה'],
    severityMapping: { 0: 'high', 1: 'high', 2: 'medium', 3: 'low', 4: 'none' },
  },

  ruleApplicability: {
    id: 'ruleApplicability',
    label: 'התאמת חוקים',
    description: 'האם המנוע הפעיל את קטגוריות-הכלל הנדרשות (requiredRuleCategories) ולא כאלה שאסורות (forbidden)',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['missingRequiredRules לא ריק', 'irrelevantAppliedRules לא ריק'],
    warningExamples: ['שאלת עיתוי שלא כוללת ניתוח timing כלל'],
    severityMapping: { 0: 'high', 1: 'high', 2: 'medium', 3: 'low', 4: 'none' },
  },

  internalConsistency: {
    id: 'internalConsistency',
    label: 'עקביות פנימית',
    description: 'האם primary/alt formula (Kashf) או judge/board-score (Hawi) לא סותרים זה את זה בלי הסבר',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['סתירה בין primaryFormula.verdict לבין altFormula.verdict בלי "בדיקת אימות נוספת" בפלט'],
    warningExamples: ['תשובה חיובית בגוף הטקסט אך shortClientVerdict שלילי'],
    severityMapping: { 0: 'high', 1: 'high', 2: 'medium', 3: 'low', 4: 'none' },
  },

  clientClarity: {
    id: 'clientClarity',
    label: 'בהירות ללקוח',
    description: 'האם הניסוח ברור, בעברית תקנית, ללא מונחים טכניים-פנימיים (checkType, houseNum גולמי וכו׳)',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['מונח-קוד גולמי (למשל "legacy-fn", "dakhal-kharij") מופיע בטקסט ללקוח'],
    warningExamples: ['"combine dakhal-kharij verdict: true" מודבק ישירות לפלט'],
    severityMapping: { 0: 'medium', 1: 'medium', 2: 'low', 3: 'low', 4: 'none' },
  },

  advisorOnlyLeakage: {
    id: 'advisorOnlyLeakage',
    label: 'דליפת מידע ליועץ-בלבד',
    description: 'האם מקטע advisorOnly (dhamir, dhamirType4External, timing/temperament המקוננים) דלף ל-clientOutputHtml',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['DHAMIR_MARKER / TIMING_MARKER / TEMPERAMENT_MARKER נמצאים ב-clientOutputHtml כשאינם מותרים לפי המטריצה'],
    warningExamples: ['"מחשבת השואל" מופיע בפלט ללקוח בשאלה עסקית'],
    severityMapping: { 0: 'high', 1: 'high', 2: 'high', 3: 'medium', 4: 'none' },
  },

  unsupportedClaims: {
    id: 'unsupportedClaims',
    label: 'טענות לא נתמכות',
    description: 'האם יש קביעות בפלט שאין להן שום sourceRulesApplied/evidenceLocation תואם ברישום הידע',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['ruleId שמופיע ב-detectedRuleCategories אך לא קיים ברישום הידע (goral-knowledge-registry.js)'],
    warningExamples: ['הפניה לחוק שלא נמצא ב-KASHF_TOPIC_RULES/TOPIC_MAIN_HOUSES'],
    severityMapping: { 0: 'high', 1: 'high', 2: 'medium', 3: 'low', 4: 'none' },
  },

  contradictionHandling: {
    id: 'contradictionHandling',
    label: 'טיפול בסתירות',
    description: 'כאשר יש סתירה מובנית בין ראיות — האם היא מוצגת ללקוח בכנות ולא מוסתרת',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['checkPrimaryAltContradictionSurfaced flags severity high ולא מוסבר בטקסט'],
    warningExamples: ['פסיקה חד-משמעית כשה-alt formula סותר לגמרי'],
    severityMapping: { 0: 'high', 1: 'medium', 2: 'medium', 3: 'low', 4: 'none' },
  },

  uncertaintyHandling: {
    id: 'uncertaintyHandling',
    label: 'טיפול באי-ודאות',
    description: 'כאשר warnings/boardValidation מצביעים על אי-ודאות — האם זה משתקף בניסוח (לא נטען וודאות-יתר)',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['warnings לא ריק אך clientOutputHtml מנוסח בביטחון מוחלט ללא כל הסתייגות'],
    warningExamples: ['boardValidation.warnings מכיל אזהרה, אך אין לה זכר בטקסט'],
    severityMapping: { 0: 'medium', 1: 'medium', 2: 'low', 3: 'low', 4: 'none' },
  },

  safetyAndPrivacy: {
    id: 'safetyAndPrivacy',
    label: 'בטיחות ופרטיות',
    description: 'אין דלף מידע אישי-רגיש (phone/dynFields/clientHistorySummary) ואין קריאה לפעולה מסוכנת/רפואית/משפטית מוחלטת',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['SENSITIVE_KEYS (goral-qa-ai-payload-builder.js) מזוהים בפלט', 'ניסוח שמחליף ייעוץ רפואי/משפטי מקצועי'],
    warningExamples: ['"תפסיק לקחת תרופות" בפלט', 'מספר טלפון מודבק בטעות לתוך clientOutputHtml'],
    severityMapping: { 0: 'high', 1: 'high', 2: 'high', 3: 'medium', 4: 'none' },
  },

  professionalTone: {
    id: 'professionalTone',
    label: 'טון מקצועי',
    description: 'שפה מכבדת, לא מפחידה/דרמטית-יתר, לא סלנג',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['ניסוח מפחיד/אבסולוטי בנושאי מוות/כישוף/מחלה ללא איזון'],
    warningExamples: ['"אתה בסכנת מוות ודאית" ללא הקשר/איזון'],
    severityMapping: { 0: 'medium', 1: 'medium', 2: 'low', 3: 'low', 4: 'none' },
  },

  actionability: {
    id: 'actionability',
    label: 'ישימות',
    description: 'האם יש ללקוח מענה ברור לשאלה שנשאלה, לא רק תיאור טכני של הלוח',
    scoreScale: [0, 1, 2, 3, 4],
    failureConditions: ['shortClientVerdict/technicalConclusionHebrew ריקים או לא-קיימים'],
    warningExamples: ['פלט שמתאר רק את הצורות בבתים בלי לענות על השאלה'],
    severityMapping: { 0: 'medium', 1: 'medium', 2: 'low', 3: 'low', 4: 'none' },
  },
};

export function getAllRubricDimensionIds() {
  return Object.keys(RUBRIC_DIMENSIONS);
}

export function severityForScore(dimensionId, score) {
  const dim = RUBRIC_DIMENSIONS[dimensionId];
  if (!dim) return 'none';
  const clamped = Math.max(0, Math.min(4, Math.round(score)));
  return dim.severityMapping[clamped] || 'none';
}

export default { RUBRIC_DIMENSIONS, getAllRubricDimensionIds, severityForScore };
