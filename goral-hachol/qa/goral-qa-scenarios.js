/**
 * goral-qa-scenarios.js
 *
 * רשימת תרחישי-בדיקה קבועה ל-Oren Smart Advisor — Goral QA Brain (שלב 2).
 * כל תרחיש = שאלה אמיתית + method + topicId אמיתי (מ-kashf-topic-rules.js /
 * hawi-interpreter.js) + מחשבת-אמהות אמיתית (אותם combos שכבר נבדקו
 * ועובדים בקבצי _test_kashf_*.mjs הקיימים בריפו — אין המצאת-נתונים).
 *
 * category — 10 קטגוריות-שאלה כפי שהוגדר ב-OREN_SMART_ADVISOR_GORAL_QA_BRAIN_PLAN.md §A.
 * כל קטגוריה מיוצגת פעם אחת בכשף ופעם אחת בחאווי (20 תרחישים).
 */

// combos מאומתים ממקומות קיימים בריפו (_test_kashf_commerce_smart_layer.mjs
// ואחרים) — לא מומצאים, רק ממוחזרים כדי שהלוח תמיד יתבנה בהצלחה.
const MOTHERS_A = ['1112', '2122', '1121', '2211'];
const MOTHERS_B = ['1211', '2121', '2112', '1222'];
const MOTHERS_C = ['1122', '1212', '1122', '2221'];
const MOTHERS_D = ['2111', '1121', '2212', '1112'];
const MOTHERS_E = ['2211', '1222', '2121', '1211'];

export const GORAL_QA_SCENARIOS = [
  // ── 1. עסק / הצלחה ──────────────────────────────────────────────
  { id: 'commerce-kashf', category: 'commerce', method: 'kashf', topicId: 'commerce',
    question: 'האם העסק החדש יצליח?', mothers: MOTHERS_A },
  { id: 'commerce-hawi', category: 'commerce', method: 'hawi', topicId: 'commerce',
    question: 'האם העסק החדש יצליח?', mothers: MOTHERS_B },

  // ── 2. אהבה / כוונת אדם ──────────────────────────────────────────
  { id: 'love-kashf', category: 'loveIntention', method: 'kashf', topicId: 'marriage',
    question: 'מה הוא מרגיש כלפיי?', mothers: MOTHERS_C },
  { id: 'love-hawi', category: 'loveIntention', method: 'hawi', topicId: 'loveHate',
    question: 'האם הוא אוהב אותי?', mothers: MOTHERS_D },

  // ── 3. עיתוי ───────────────────────────────────────────────────
  { id: 'timing-kashf', category: 'timing', method: 'kashf', topicId: 'completion',
    question: 'מתי הדבר שביקשתי יקרה?', mothers: MOTHERS_E },
  { id: 'timing-hawi', category: 'timing', method: 'hawi', topicId: 'completion',
    question: 'מתי המצב שלי ישתפר?', mothers: MOTHERS_A },

  // ── 4. רוחני ───────────────────────────────────────────────────
  { id: 'spiritual-kashf', category: 'spiritual', method: 'kashf', topicId: 'spiritualDiagnostics',
    question: 'האם יש עליי כישוף?', mothers: MOTHERS_B },
  { id: 'spiritual-hawi', category: 'spiritual', method: 'hawi', topicId: 'spiritualDiagnostics',
    question: 'האם יש עליי עין הרע?', mothers: MOTHERS_C },

  // ── 5. חולי / בריאות ──────────────────────────────────────────
  { id: 'illness-kashf', category: 'illness', method: 'kashf', topicId: 'illness',
    question: 'מה מצב הבריאות שלי?', mothers: MOTHERS_D },
  { id: 'illness-hawi', category: 'illness', method: 'hawi', topicId: 'illness',
    question: 'האם אחלים מהמחלה?', mothers: MOTHERS_E },

  // ── 6. השלמת עניין ────────────────────────────────────────────
  { id: 'completion-kashf', category: 'completion', method: 'kashf', topicId: 'completion',
    question: 'האם הדבר שביקשתי יצא לפועל?', mothers: MOTHERS_A },
  { id: 'completion-hawi', category: 'completion', method: 'hawi', topicId: 'completion',
    question: 'האם הדבר יושלם?', mothers: MOTHERS_B },

  // ── 7. נסיעה ───────────────────────────────────────────────────
  { id: 'travel-kashf', category: 'travel', method: 'kashf', topicId: 'travel',
    question: 'האם הנסיעה שלי תהיה מוצלחת?', mothers: MOTHERS_C },
  { id: 'travel-hawi', category: 'travel', method: 'hawi', topicId: 'travel',
    question: 'האם כדאי לי לנסוע עכשיו?', mothers: MOTHERS_D },

  // ── 8. כסף / פרנסה ────────────────────────────────────────────
  { id: 'money-kashf', category: 'money', method: 'kashf', topicId: 'money',
    question: 'האם ארוויח כסף השנה?', mothers: MOTHERS_E },
  { id: 'money-hawi', category: 'money', method: 'hawi', topicId: 'commerce',
    question: 'האם המצב הכלכלי שלי ישתפר?', mothers: MOTHERS_A },

  // ── 9. אויבים / יריבים ────────────────────────────────────────
  { id: 'enemies-kashf', category: 'enemies', method: 'kashf', topicId: 'enemies',
    question: 'האם יש לי אויב שמזיק לי?', mothers: MOTHERS_B },
  { id: 'enemies-hawi', category: 'enemies', method: 'hawi', topicId: 'enemies',
    question: 'מי עומד נגדי?', mothers: MOTHERS_C },

  // ── 10. שאלה כללית ────────────────────────────────────────────
  { id: 'general-kashf', category: 'general', method: 'kashf', topicId: 'generalReading',
    question: 'מה המצב הכללי שלי?', mothers: MOTHERS_D },
  { id: 'general-hawi', category: 'general', method: 'hawi', topicId: 'generalReading',
    question: 'מה מצבי הכללי כרגע?', mothers: MOTHERS_E },
];

export default { GORAL_QA_SCENARIOS };
