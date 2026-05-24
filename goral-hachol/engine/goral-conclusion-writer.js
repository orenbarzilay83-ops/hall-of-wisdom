function clean(value = '') {
  return String(value || '').trim();
}

function getGradeText(grade) {
  const map = {
    positive: 'הקריאה נוטה לטובה',
    'cautiously-positive': 'הקריאה נוטה לטובה, אבל בזהירות',
    mixed: 'הקריאה מעורבת',
    'cautiously-negative': 'הקריאה נוטה לעיכוב או קושי',
    negative: 'הקריאה מצביעה על קושי משמעותי',
    'strong-suspicion': 'יש סימנים חזקים לפגיעה רוחנית',
    'medium-suspicion': 'יש סימנים בינוניים לחשד רוחני',
    'weak-suspicion': 'יש סימנים חלשים או מעורבים',
    'mostly-clear': 'אין סימן חזק לפגיעה רוחנית',
  };

  return map[grade] || 'הקריאה דורשת בדיקה זהירה';
}

function describeTone(score = 0) {
  if (score >= 5) return 'הכיוון הכללי של הלוח תומך במהלך, ויש יותר סימנים שמחזקים מאשר סימנים שמעכבים.';
  if (score >= 2) return 'יש פתיחה מסוימת לטובה, אבל היא לא מספיק חזקה כדי לפעול בלי בדיקה נוספת.';
  if (score <= -5) return 'הלוח מצביע על חסימה או התנגדות ברורה, ולכן לא נכון למהר לפעולה.';
  if (score <= -2) return 'יש סימני עיכוב, חשש או קושי, גם אם לא מדובר בחסימה מוחלטת.';
  return 'הלוח מאוזן או מעורב, ולכן צריך לקרוא את הפרטים ולא להסתפק בתשובה של כן או לא.';
}

function clientContextParagraph(clientContext = {}, question = '') {
  const name = clean(clientContext.clientName);
  const parent = clean(clientContext.parentName);
  const age = clean(clientContext.ageOrLifeStage);
  const context = clean(clientContext.consultationContext);
  const q = clean(question);

  const parts = [];

  if (name) {
    parts.push(`הקריאה נעשית עבור ${name}${parent ? `, ${parent}` : ''}.`);
  }

  if (age) {
    parts.push(`הנתון של הגיל או שלב החיים חשוב כאן: ${age}.`);
  }

  if (context) {
    parts.push(`הרקע שהובא לקריאה הוא: ${context}.`);
  }

  if (q) {
    parts.push(`השאלה שנשאלה בפועל היא: "${q}".`);
  }

  if (!parts.length) {
    return '';
  }

  return parts.join(' ');
}

function questionFocusParagraph(topicId, clientContext = {}) {
  const context = clean(clientContext.consultationContext);

  if (topicId === 'spiritualDiagnostics') {
    return 'לכן האבחון לא ניגש לשאלה בצורה כללית, אלא מחפש האם הקושי שייך לגוף האדם, לאויב נסתר, לקנאה, לאחיזה, לעין או לפגיעה רוחנית אחרת.';
  }

  if (topicId === 'travel') {
    return 'לכן הדגש הוא לא רק אם הדרך פתוחה, אלא האם הדרך מתאימה לאדם הזה בזמן הזה ובתנאים שהובאו.';
  }

  if (topicId === 'childrenPregnancy') {
    return 'לכן הדגש הוא על מצב האדם והשאלה האישית, ולא רק על סימן כללי של ילד או היריון.';
  }

  if (topicId === 'hiddenTreasure') {
    return 'לכן הדגש הוא אם הדבר החבוי שייך לשואל, אם יש אליו גישה, ואם הלוח מראה חסימה או פתיחה.';
  }

  if (topicId === 'missingPerson') {
    return 'לכן הדגש הוא על מצב האדם הנעדר, אפשרות חזרתו, ומה מעכב או מסתיר את הדבר.';
  }

  if (context) {
    return 'לכן המסקנה נקראת לפי ההקשר האישי של הלקוח ולא רק לפי שם הצורה שעלתה.';
  }

  return '';
}


function clientHistoryParagraph(history) {
  if (!history || !history.total) {
    return '';
  }

  const parts = [];

  parts.push(history.summaryHebrew);

  if (Array.isArray(history.repeatedTopics) && history.repeatedTopics.length) {
    const topics = history.repeatedTopics
      .map((item) => `${item.topic} (${item.count} פעמים)`)
      .join(', ');
    parts.push(`יש נושאים שחוזרים אצל הלקוח: ${topics}.`);
  }

  if (Array.isArray(history.repeatedSpiritualFlags) && history.repeatedSpiritualFlags.length) {
    parts.push('יש חזרה של סימנים רוחניים או דפוסי חשד בקריאות קודמות, ולכן צריך לבדוק אם מדובר בדפוס מתמשך ולא במקרה חד־פעמי.');
  }

  return parts.join(' ');
}

function topicOpening(topicId, topicHebrew) {
  const openings = {
    travel:
      'בעניין הנסיעה, הקריאה בודקת לא רק אם לצאת או לא, אלא גם את הדרך עצמה, את הסכנות, את העיכובים ואת האפשרות לחזרה בשלום.',
    missingPerson:
      'בעניין הנעדר, הקריאה מתמקדת בשאלה האם יש חזרה, עיכוב, פחד, חולי או סימן שמראה מה מצבו.',
    childrenPregnancy:
      'בעניין ילדים והריון, הקריאה בודקת את אפשרות ההיריון, את מצב ההחזקה, את סימני הזכר והנקבה ואת העדים שתומכים או מחלישים.',
    hiddenTreasure:
      'בעניין המטמון או הדבר החבוי, הקריאה בודקת אם יש ממשות בדבר, האם הוא שמור או חסום, ומה הכיוון הכללי של החיפוש.',
    yearlyForecast:
      'בעניין השנה, הקריאה מסתכלת על המגמה הכללית: שפע או יוקר, גשם או יובש, יציבות או טלטלה.',
    authorityState:
      'בעניין שלטון, תפקיד או סמכות, הקריאה בודקת אם הדבר עומד, נחלש, חוזר למקומו או הולך להתפרק.',
    birthNativity:
      'בעניין המולד או מצב האדם, הקריאה בודקת את שורש האדם, מזלו, כוחו, הקשיים שלו והדברים שמלווים אותו לאורך הדרך.',
    spiritualDiagnostics:
      'באבחון הרוחני, הקריאה בודקת אם הקושי נראה רגיל וטבעי בלבד, או שיש סימנים לפגיעה רוחנית, קנאה, עין, כישוף, אחיזה או אויב נסתר.',
  };

  return openings[topicId] || `בעניין ${topicHebrew}, הקריאה בודקת את הבית המרכזי, העדים, הדיין והשלמת הדין.`;
}

function describeCoreHouses(analysis) {
  if (!analysis || !analysis.hasBoard) {
    return 'עדיין אין לוח מלא, ולכן אי אפשר לתת מסקנה מלאה מתוך הצורות.';
  }

  const focus = analysis.focusHouse;
  const judge = analysis.judge;
  const sentence = analysis.sentence;
  const witnesses = analysis.witnesses || [];

  const parts = [];

  if (focus) {
    parts.push(
      `הבית המרכזי הוא בית ${focus.house}, ושם מופיעה הצורה ${focus.figureHebrew || 'שאינה מזוהה בשם'}; זהו המקום שמחזיק את גוף השאלה.`
    );
  }

  if (witnesses.length) {
    const witnessText = witnesses
      .map((w) => `בית ${w.house} עם ${w.figureHebrew || 'צורה לא מזוהה'}`)
      .join(' ו־');
    parts.push(`העדים הם ${witnessText}, והם מראים את הכיוון שממנו הדין מקבל חיזוק או התנגדות.`);
  }

  if (judge) {
    parts.push(
      `הדיין בבית 15 הוא ${judge.figureHebrew || 'צורה לא מזוהה'}, ולכן הוא משמש כמרכז הפסיקה של הלוח.`
    );
  }

  if (sentence) {
    parts.push(
      `בית 16 — משלים בבית 16 הוא ${sentence.figureHebrew || 'צורה לא מזוהה'}, והוא מראה איך הדבר נוטה להיסגר בסוף.`
    );
  }

  return parts.join(' ');
}

function spiritualVerdict(spiritualDiagnosis) {
  if (!spiritualDiagnosis || !spiritualDiagnosis.hasBoard) return '';
  const grade = spiritualDiagnosis.grade;
  const finalHebrew = spiritualDiagnosis.finalHebrew || '';

  if (grade === 'strong-suspicion') {
    return `פסיקה: כן — הלוח מראה סימנים חזקים לפגיעה רוחנית. ${finalHebrew}`;
  }
  if (grade === 'medium-suspicion') {
    return `פסיקה: ייתכן — יש חשד בינוני לפגיעה רוחנית, אך אין הכרעה מוחלטת. ${finalHebrew}`;
  }
  if (grade === 'weak-suspicion') {
    return `פסיקה: ספק — הסימנים חלשים או מעורבים. ${finalHebrew}`;
  }
  if (grade === 'mostly-clear') {
    return `פסיקה: לא — אין סימן חזק לפגיעה רוחנית בלוח זה. ${finalHebrew}`;
  }
  return finalHebrew;
}

function spiritualParagraph(spiritualDiagnosis, topicId) {
  if (!spiritualDiagnosis || !spiritualDiagnosis.active || !spiritualDiagnosis.hasBoard) {
    return '';
  }

  const grade = spiritualDiagnosis.grade;

  const shouldShow =
    topicId === 'spiritualDiagnostics' ||
    grade === 'strong-suspicion' ||
    grade === 'medium-suspicion';

  if (!shouldShow) {
    return '';
  }

  const reasons = spiritualDiagnosis.mainReasons || [];

  const important = reasons
    .filter((r) => r.score > 0)
    .slice(0, 4)
    .map((r) => {
      const figure = r.figureHebrew ? ` — צורה: ${r.figureHebrew}` : '';
      const signals = (r.signals || []).join(' ');
      return `בית ${r.house} (${r.role})${figure}: ${signals}`;
    });

  return important.filter(Boolean).join('\n');
}

function recommendationByTopic(topicId, grade) {
  if (topicId === 'travel') {
    if (grade === 'positive') return 'לכן אפשר לשקול יציאה, אבל עדיין לבדוק זמן, דרך ואנשים מעורבים.';
    if (grade === 'negative') return 'לכן לא מומלץ למהר לנסיעה. עדיף לדחות, לבדוק מחדש או לשנות תנאים.';
    return 'לכן ההמלצה היא לא למהר: לבדוק את התנאים, הדרך והזמן לפני החלטה.';
  }

  if (topicId === 'missingPerson') {
    return 'לכן צריך לקרוא בזהירות את סימני החזרה, העיכוב והפחד, ולא להסתפק בסימן אחד בלבד.';
  }

  if (topicId === 'childrenPregnancy') {
    return 'לכן יש לבדוק את בית הילדים, העדים והדיין יחד, ורק אז להכריע לגבי אפשרות ההיריון או סימני זכר ונקבה.';
  }

  if (topicId === 'hiddenTreasure') {
    return 'לכן צריך לבדוק אם הדבר באמת קיים, אם הוא חסום או שמור, ומה הכיוון שהלוח נותן לחיפוש.';
  }

  if (topicId === 'spiritualDiagnostics') {
    return 'לכן נכון להמשיך באבחון מדויק לפי הבתים והצורות, ולא לקבוע רק לפי תחושה או פחד.';
  }

  return 'לכן המסקנה צריכה להיקבע לפי שילוב הבית המרכזי, העדים, הדיין והכללים שנבדקו.';
}

export function writeHumanGoralConclusion(result) {
  const topicId = result.topicId;
  const topicHebrew = result.topicHebrew;
  const grade = result.boardScore?.grade || 'mixed';
  const score = result.boardScore?.score || 0;
  const isSpiritualTopic = topicId === 'spiritualDiagnostics';
  const judgeVerdict = result.judgeVerdict || result.boardScore?.judgeVerdict || null;

  // Leading verdict paragraph
  let verdictParagraph = '';
  if (isSpiritualTopic) {
    verdictParagraph = spiritualVerdict(result.spiritualDiagnosis);
  } else if (judgeVerdict?.hebrewFull) {
    verdictParagraph = judgeVerdict.hebrewFull;
  } else if (result.boardScore?.hebrew) {
    verdictParagraph = result.boardScore.hebrew;
  }

  const paragraphs = [
    clientContextParagraph(result.clientContext, result.question),
    clientHistoryParagraph(result.clientHistorySummary),
    verdictParagraph,
    topicOpening(topicId, topicHebrew),
    questionFocusParagraph(topicId, result.clientContext),
    describeCoreHouses(result.boardAnalysis),
    spiritualParagraph(result.spiritualDiagnosis, topicId),
    recommendationByTopic(topicId, grade),
  ].filter((p) => clean(p));

  return paragraphs.join('\n\n');
}

export default {
  writeHumanGoralConclusion,
};

if (typeof module !== 'undefined') {
  module.exports = { writeHumanGoralConclusion };
}
