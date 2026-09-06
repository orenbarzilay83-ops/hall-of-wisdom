/**
 * goral-question-taxonomy.js
 *
 * Initial classification of client question types for both Kashf and Hawi.
 * This is a POLICY/HEURISTIC layer, not a source document — the topicId lists
 * inside each entry are cross-checked against the real engine tables:
 *   - Kashf: KASHF_TOPIC_RULES in goral-hachol/engine/kashf-topic-rules.js
 *   - Hawi:  TOPIC_MAIN_HOUSES in goral-hachol/engine/hawi-interpreter.js
 * Every expectedTopicId below is a real, existing topicId in one of those two
 * tables (verified by direct code reading, not invented).
 *
 * Gaps (no dedicated source topicId exists for a questionType, in one or
 * both methods) are marked explicitly with `gap: true` and a `gapNote` —
 * these are NOT silently filled with a guess.
 */

export const QUESTION_TYPES = {
  businessSuccess: {
    id: 'businessSuccess',
    label: 'הצלחת עסק/מסחר',
    keywords: ['עסק', 'מסחר', 'לקוח', 'למכור', 'לקנות', 'השקעה', 'עסקה', 'חנות'],
    expectedTopicIds: { kashf: ['commerce', 'partnership'], hawi: ['commerce', 'partnership'] },
    requiredRuleCategories: ['houseMeanings', 'verificationRules'],
    optionalRuleCategories: ['witnessesJudge'],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'האם העסק/העסקה יצליחו — לא עיתוי ולא ניתוח נסתר, אלא אם נשאלו במפורש',
  },

  completion: {
    id: 'completion',
    label: 'השלמת עניין',
    keywords: ['יושלם', 'יצליח', 'יצא לפועל', 'יקרה', 'בסוף', 'יגמר'],
    expectedTopicIds: { kashf: ['completion'], hawi: ['completion'] },
    requiredRuleCategories: ['houseMeanings', 'verificationRules'],
    optionalRuleCategories: ['witnessesJudge'],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'האם העניין הנשאל יושלם/יצליח',
  },

  moneyLivelihood: {
    id: 'moneyLivelihood',
    label: 'כסף ופרנסה',
    keywords: ['כסף', 'פרנסה', 'רווח', 'הפסד', 'חוב', 'הלוואה', 'משכורת'],
    expectedTopicIds: { kashf: ['money', 'loan', 'yearlyForecast'], hawi: ['commerce', 'loan', 'yearlyForecast'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['verificationRules', 'witnessesJudge'],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'מצב כלכלי/רווח-הפסד — Hawi אין topicId ייעודי בשם money, ממופה ל-commerce',
    gap: false,
  },

  loveRelationship: {
    id: 'loveRelationship',
    label: 'אהבה וזוגיות',
    keywords: ['אהבה', 'מרגיש', 'זוגיות', 'נישואין', 'בן זוג', 'בת זוג', 'אוהב אותי'],
    expectedTopicIds: { kashf: ['marriage'], hawi: ['loveHate', 'marriage'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['characterNature', 'verificationRules'],
    forbiddenClientSections: ['dhamir', 'timing'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'רגשות/מצב הזוגיות. characterNature (טבע השואל/הנשאל) מותר להופיע כאן — אינו נחשב דליפה (ראו goral-qa-deterministic-checks.js::checkTemperamentLeak, שמדלג במפורש על category==="loveIntention")',
  },

  hiddenThoughtIntent: {
    id: 'hiddenThoughtIntent',
    label: 'כוונה/מחשבה נסתרת',
    keywords: ['מה הוא חושב', 'מה היא חושבת', 'מסתיר', 'כוונה נסתרת', 'האם משקר לי', 'מה באמת קורה'],
    expectedTopicIds: { kashf: [], hawi: [] },
    requiredRuleCategories: ['dhamir'],
    optionalRuleCategories: [],
    forbiddenClientSections: [],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'זהו סוג-השאלה היחיד שבו תוכן ה-דהמיר רלוונטי-במישרין לשאלה עצמה',
    gap: true,
    gapNote:
      'DHAMIR_CLIENT_VISIBLE_TOPICS (goral-rule-applicability.js) ריק לגמרי בשתי השיטות — ' +
      'כלומר גם עבור שאלת-כוונה-נסתרת מפורשת, הלקוח כרגע לא מקבל תוכן-דהמיר ישיר בשום topicId. ' +
      'זה פער ידע אמיתי שדורש החלטת אורן (האם/איך לחשוף דהמיר ללקוח בשאלות מסוג זה) — לא תוקן כאן.',
  },

  timing: {
    id: 'timing',
    label: 'עיתוי',
    keywords: ['מתי', 'כמה זמן', 'באיזה שלב', 'תוך כמה זמן', 'עוד כמה'],
    expectedTopicIds: { kashf: [], hawi: [] },
    requiredRuleCategories: ['timing'],
    optionalRuleCategories: ['houseMeanings'],
    forbiddenClientSections: [],
    advisorOnlySections: [],
    expectedAnswerFocus: 'הערכת עיתוי מפורשת',
    gap: true,
    gapNote:
      'תוכן העיתוי (dhamirExtras.timingByThirds/timingByMadad/timingEstimate ב-Kashf) מקונן כרגע ' +
      'בתוך כרטיס-הדהמיר בלבד ואין מנגנון-הצגה נפרד לו — אם כרטיס-הדהמיר מוסתר (וכרגע הוא תמיד מוסתר), ' +
      'גם שאלת-עיתוי-מפורשת לא מקבלת תשובת-עיתוי ייעודית. פער ידע אמיתי, דורש החלטת אורן.',
  },

  travel: {
    id: 'travel',
    label: 'נסיעה',
    keywords: ['נסיעה', 'לנסוע', 'חופשה', 'טיסה', 'לחו"ל', 'מסע'],
    expectedTopicIds: { kashf: ['travel'], hawi: ['travel', 'seaVoyage'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['verificationRules', 'timing'],
    forbiddenClientSections: ['dhamir', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'האם/מתי כדאי הנסיעה',
  },

  health: {
    id: 'health',
    label: 'בריאות',
    keywords: ['בריאות', 'מחלה', 'חולה', 'להחלים', 'רפואה'],
    expectedTopicIds: { kashf: ['illness'], hawi: ['illness'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['verificationRules', 'witnessesJudge'],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'מצב הבריאות/החלמה',
  },

  spiritual: {
    id: 'spiritual',
    label: 'אבחון רוחני',
    keywords: ['כישוף', 'עין הרע', 'רוח רעה', 'שד', 'עבודה זרה', 'קללה'],
    expectedTopicIds: { kashf: ['spiritualDiagnostics'], hawi: ['spiritualDiagnostics'] },
    requiredRuleCategories: ['spiritual'],
    optionalRuleCategories: ['houseMeanings'],
    forbiddenClientSections: ['timing', 'characterNature'],
    advisorOnlySections: [],
    expectedAnswerFocus: 'אבחון רוחני (כישוף/עין הרע/רוח רעה)',
    notes:
      'ב-Hawi, buildSpiritualNarrative (goral-conclusion-writer.js) קורא ל-dhamirParagraph ' +
      'ללא-תנאי (לא דרך getSectionVisibility) — זו התנהגות-בפועל-קיימת, לא באג שתוקן כאן ' +
      '(לפי הנחיה מפורשת קודמת: "לא לגעת באבחון הרוחני"). המטריצה (goral-rule-applicability-matrix.js) ' +
      'רושמת חריגה מפורשת לתא הזה בלבד: method=hawi + questionType=spiritual → dhamir: "allowed".',
  },

  enemiesConflict: {
    id: 'enemiesConflict',
    label: 'אויבים וסכסוכים',
    keywords: ['אויב', 'מריבה', 'משפט', 'תביעה', 'מזיק לי', 'סכסוך'],
    expectedTopicIds: { kashf: ['enemies', 'disputes'], hawi: ['enemies', 'disputes'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['witnessesJudge', 'verificationRules'],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'מי חזק/מנצח בסכסוך',
  },

  lostObject: {
    id: 'lostObject',
    label: 'אבדה/גניבה',
    keywords: ['אבד', 'גניבה', 'נגנב', 'איפה החפץ', 'מטמון', 'בהמה אבודה'],
    expectedTopicIds: { kashf: ['theft', 'hiddenTreasure', 'lostAnimal'], hawi: ['theft', 'hiddenTreasure', 'lostAnimal'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['verificationRules'],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'מיקום/החזרת החפץ/הגונב',
  },

  general: {
    id: 'general',
    label: 'קריאה כללית',
    keywords: ['מצב כללי', 'מה איתי', 'קריאה כללית', 'מה המצב שלי'],
    expectedTopicIds: { kashf: ['generalReading'], hawi: ['generalReading', 'foundations'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: [],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'סקירה כללית, ללא התמקדות בנושא בודד',
  },

  personCharacter: {
    id: 'personCharacter',
    label: 'אופי/טבע אדם',
    keywords: ['איזה מין אדם', 'האופי שלו', 'האם הוא ישר', 'טבע האדם'],
    expectedTopicIds: { kashf: [], hawi: [] },
    requiredRuleCategories: ['characterNature'],
    optionalRuleCategories: [],
    forbiddenClientSections: ['dhamir', 'timing'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'תיאור אופי/טבע — characterNature מותר להופיע (הוקש נשאל)',
    gap: true,
    gapNote:
      'אין topicId ייעודי לאופי-אדם באף שיטה. בנוסף — checkTemperamentLeak (goral-qa-deterministic-checks.js) ' +
      'מדלג-מבדיקה רק עבור category==="loveIntention", לא עבור personCharacter — כלומר אם ייווצר תרחיש ' +
      'עם category="personCharacter", הבדיקה הדטרמיניסטית הקיימת תסמן תוכן-אופי-לגיטימי כ"דליפה" באופן שגוי. ' +
      'זה פער אמיתי בבדיקה הקיימת, דורש החלטת אורן (להרחיב את הדילוג או להשאיר).',
  },

  marriage: {
    id: 'marriage',
    label: 'נישואין',
    keywords: ['נישואין', 'חתונה', 'להתחתן', 'זיווג', 'שידוך'],
    expectedTopicIds: { kashf: ['marriage'], hawi: ['marriage'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['verificationRules', 'witnessesJudge'],
    forbiddenClientSections: ['dhamir', 'timing'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'האם/מתי הנישואין יתקיימו ומצבם',
  },

  pregnancyChildren: {
    id: 'pregnancyChildren',
    label: 'הריון וילדים',
    keywords: ['ילדים', 'הריון', 'להיכנס להריון', 'לידה'],
    expectedTopicIds: { kashf: ['children'], hawi: ['childrenPregnancy'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['verificationRules'],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'הריון/ילדים — שים לב: ל-Kashf אין topicId childrenPregnancy (רק children); ל-Hawi אין topicId בשם children (רק childrenPregnancy)',
  },

  legalAuthority: {
    id: 'legalAuthority',
    label: 'שררה ומשפט',
    keywords: ['משפט', 'שררה', 'תפקיד', 'מינוי', 'שלטון', 'בית משפט'],
    expectedTopicIds: { kashf: ['authorityState', 'disputes'], hawi: ['authorityState', 'disputes'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['witnessesJudge', 'verificationRules'],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'מצב שררה/הליך משפטי',
  },

  workCareer: {
    id: 'workCareer',
    label: 'עבודה וקריירה',
    keywords: ['עבודה', 'קריירה', 'משרה', 'פיטורים', 'לקבל עבודה'],
    expectedTopicIds: { kashf: ['authorityState', 'commerce'], hawi: ['authorityState', 'commerce'] },
    requiredRuleCategories: ['houseMeanings'],
    optionalRuleCategories: ['verificationRules'],
    forbiddenClientSections: ['dhamir', 'timing', 'characterNature'],
    advisorOnlySections: ['dhamir'],
    expectedAnswerFocus: 'מצב תעסוקתי — אין topicId ייעודי ל"עבודה שכירה" נבדל מ-authorityState/commerce באף מקור',
    gap: true,
    gapNote:
      'אין topicId ייעודי ל"עבודה/קריירה" כמושג-נבדל-מ-שררה/מסחר באף אחד משני המקורות. ' +
      'המיפוי ל-authorityState+commerce הוא קירוב סביר, לא מקור מפורש — דורש אישור אורן.',
  },
};

export function getAllQuestionTypeIds() {
  return Object.keys(QUESTION_TYPES);
}

export function getQuestionType(questionTypeId) {
  return QUESTION_TYPES[questionTypeId] || null;
}

/**
 * Heuristic keyword classifier. Returns 'general' when nothing matches.
 * This is explicitly a low-confidence heuristic, not a source-derived rule —
 * callers must treat the result as a suggestion, not ground truth.
 */
export function classifyQuestionType(questionText, { topicId } = {}) {
  const text = String(questionText || '');
  let bestMatch = null;
  let bestScore = 0;

  for (const qType of Object.values(QUESTION_TYPES)) {
    let score = 0;
    for (const kw of qType.keywords) {
      if (text.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = qType.id;
    }
  }

  if (bestMatch) {
    return { questionTypeId: bestMatch, confidence: 'keyword-match', matchedKeywordCount: bestScore };
  }

  if (topicId) {
    for (const qType of Object.values(QUESTION_TYPES)) {
      const ids = [...(qType.expectedTopicIds.kashf || []), ...(qType.expectedTopicIds.hawi || [])];
      if (ids.includes(topicId)) {
        return { questionTypeId: qType.id, confidence: 'topicId-fallback', matchedKeywordCount: 0 };
      }
    }
  }

  return { questionTypeId: 'general', confidence: 'default-fallback', matchedKeywordCount: 0 };
}

export default { QUESTION_TYPES, getAllQuestionTypeIds, getQuestionType, classifyQuestionType };
