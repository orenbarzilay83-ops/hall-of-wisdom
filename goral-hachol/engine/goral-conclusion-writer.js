function clean(value = '') {
  return String(value || '').trim();
}

const MARITAL_LABELS = {
  married:   'נשוי/ה',
  single:    'רווק/ה',
  divorced:  'גרוש/ה',
  widowed:   'אלמן/ה',
  coupled:   'בזוגיות',
  separated: 'פרוד/ה',
};

const WORK_LABELS = {
  employed:       'שכיר/ה',
  self:           'עצמאי/ת',
  unemployed:     'מחפש/ת עבודה',
  retired:        'בפנסיה',
  'between-jobs': 'בין עבודות',
};

const CHILDREN_LABELS = {
  yes: 'יש ילדים',
  no:  'אין ילדים',
};

function formatClientProfile(clientContext = {}) {
  const parts = [];
  const marital  = MARITAL_LABELS[clientContext.maritalStatus]  || null;
  const work     = WORK_LABELS[clientContext.workStatus]         || null;
  const children = CHILDREN_LABELS[clientContext.hasChildren]   || null;
  if (marital)  parts.push(marital);
  if (work)     parts.push(work);
  if (children) parts.push(children);
  return parts.length ? parts.join(', ') : null;
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

  const quesited = clean(clientContext.quesitedName);

  if (name) {
    parts.push(`הקריאה נעשית עבור ${name}${parent ? `, ${parent}` : ''}.`);
  }

  if (quesited) {
    parts.push(`הנשאל עליו: ${quesited}.`);
  }

  const profile = formatClientProfile(clientContext);
  if (profile) {
    parts.push(`פרופיל: ${profile}.`);
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

  if (topicId === 'marriage') {
    return 'לכן הדגש הוא על מצב שני הצדדים: בית 1 לשואל ובית 7 לצד השני, ועל מה שמקשר או מפריד ביניהם לפי הלוח.';
  }

  if (topicId === 'illness') {
    return 'לכן הדגש הוא על מצב החולה, כוח המחלה, ואם הלוח מראה פתח לריפוי או לשינוי.';
  }

  if (topicId === 'disputes') {
    return 'לכן הדגש הוא על כוח כל צד, מי עומד בעמדה חזקה יותר, ומה מראה הדיין לגבי הכרעת הסכסוך.';
  }

  if (topicId === 'enemies') {
    return 'לכן הדגש הוא על כוח האויב לעומת השואל, האם יש סכנה ממשית, ומה מגן על השואל לפי הלוח.';
  }

  if (topicId === 'fear') {
    return 'לכן הדגש הוא אם הפחד מבוסס על מציאות בלוח, מה מקורו, ואם יש פתיחה או הגנה בסוף הדרך.';
  }

  if (topicId === 'commerce') {
    return 'לכן הדגש הוא על כוח העסקה, מצב הכסף, מי המרוויח ומי המפסיד, ואם הלוח מראה הצלחה עסקית.';
  }

  if (topicId === 'loveHate') {
    return 'לכן הדגש הוא על הקשר בין שני הצדדים, כוח הרגש מכל צד, ואם הלוח מראה חיבור או ניתוק.';
  }

  if (topicId === 'completion') {
    return 'לכן הדגש הוא על הכרעת הדיין — האם הדבר יסתיים כראוי, יעוכב, או יתפרק לחלוטין.';
  }

  if (topicId === 'theft') {
    return 'לכן הדגש הוא על שלוש שאלות: מי גנב (זיהוי לפי בית 7 ובית 8), האם החפץ יחזור (לפי הדיין וכיוון הצורה בבית 7), ואיפה הגנב כעת (לפי חזרות הצורה בלוח וסוג האדם שהוא).';
  }

  if (topicId === 'yearlyForecast') {
    return 'לכן הדגש הוא על שלושה אפיקים: תחזית הדיין לאחרית השנה, כוחות הכוכבים ביתדות שמשפיעים על מחירים ותנועות, ודין הגשם לפי מיקום הלבנה ונוגה בלוח.';
  }

  if (topicId === 'authorityState') {
    return 'לכן הדגש הוא על שלושה פרמטרים: יציבות בית 1 ובית 10, כוח האויב מבית 7, וחזרת בתים 1, 5, 11, 15 כסימן לחזרה לתפקיד.';
  }

  if (topicId === 'birthNativity') {
    return 'לכן הדגש הוא על בית הטאלע (בית 1) ועל חזרת הצורה שלו בבתים אחרים — כל חזרה מגלה פן נוסף מגורל האדם ומשפיע על פרשנות הקריאה.';
  }

  if (topicId === 'siblings') {
    return 'לכן הדגש הוא על בית 3 (האח / השכן) ועל מצבו ביחס לשואל — האם יש קשר, עזרה, קושי, או ריחוק בין הצדדים.';
  }

  if (topicId === 'deathInheritance') {
    return 'לכן הדגש הוא על בית 8 (מוות / ירושה) ועל כוח הדיין — הוא הקובע אם מדובר בסכנה ממשית, בירושה, בפחד גדול, או בשינוי גורל עמוק.';
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
    marriage:
      'בעניין נישואין וזוגיות, הקריאה בודקת את מצב השואל ובית 7 כדליל הצד השני, את ההתאמה ביניהם, ואת הסימנים לחיבור, כבוד או קושי.',
    illness:
      'בעניין החולה, הקריאה בודקת את בית 1 כדליל החולה, בית 6 כדליל המחלה, ובית 8 כדליל הסכנה — ומה מראה הדיין לגבי מהלך המחלה.',
    disputes:
      'בעניין הסכסוך או התביעה, הקריאה בודקת את כוח השואל לעומת יריבו, את מצב כל צד בלוח, ומה הדיין פוסק על הניצחון.',
    enemies:
      'בעניין האויב, הקריאה בודקת את כוח האויב, מקומו בלוח, את מה שמגן על השואל, ואת תוצאת העימות לפי הדיין.',
    fear:
      'בעניין הפחד, הקריאה בודקת אם הסכנה ממשית לפי הלוח, מה מקורה, ואם הדרך בסוף מובילה לבטחה או להמשך קושי.',
    commerce:
      'בעניין מסחר, קנייה ומכירה, הקריאה בודקת את בית 1 כדליל השואל, בית 2 כדליל הממון, בית 7 כדליל הצד השני, ובית 10 כדליל תוצאת העסקה.',
    loveHate:
      'בעניין אהבה ושנאה, הקריאה בודקת את הקשר הרגשי בין הצדדים, מי אוהב ומי שונא, ומה הלוח מראה על עתיד הקשר.',
    completion:
      'בעניין האם הדבר יושלם, הקריאה מתמקדת בעיקר בדיין — בית 15 — שהוא הפסיקה הסופית, ובעדים שמחזקים או מחלישים את הכרעתו.',
    prisoner:
      'בעניין האסיר, הקריאה בודקת אם בית 1 מחובר לבית 12 ואם יש דליל יציאה. בית 5 ובית 15 קובעים את גורל האסיר לפי הספר.',
    partnership:
      'בעניין השותפות, הקריאה בודקת את בית 1 (השואל), בית 7 (השותף), ובית 2 ו-10 (הממון ותוצאת העסקה). ההתאמה בין בית 1 לבית 7 היא לב הקריאה.',
    seaVoyage:
      'בעניין מסע הים, הקריאה בודקת את בית 1 (הנוסע), בית 9 (המסע), ובית 8 ו-12 (הסכנה). יש חוקים ספציפיים לסכנות ים שונים מנסיעה יבשתית.',
    theft:
      'בשאלת הגנבה, הקריאה בודקת שלושה דברים עיקריים: מי הגנב (בית 7 לזיהוי, בית 8 לתיאור), האם החפץ הגנוב יחזור (לפי הדיין, התחסיל, וכיוון הצורה בבית 7 — נכנסת או יוצאת), ומה מסגיר את זהות הגנב (חזרת צורות בלוח, תיאור הגוף ואותיות השם).',
    siblings:
      'בעניין האח, השכן או הקרוב, הקריאה בודקת את בית 3 כדליל הנשאל עליו, ואת הקשר בינו לבין השואל (בית 1). הדיין קובע את תוצאת הקשר ואת כיוון ההשפעה.',
    deathInheritance:
      'בעניין מוות, ירושה או שינוי גורל גדול, הקריאה בודקת את בית 8 כדליל המוות והירושה, בית 7 כדליל הצד השני (הנפטר או היורש), ובית 2 לגבי הממון. הדיין קובע את המסקנה הסופית.',
  };

  return openings[topicId] || `בעניין ${topicHebrew}, הקריאה בודקת את הבית המרכזי, העדים, הדיין והשלמת הדין.`;
}

function describeCoreHouses(analysis, topicId, question) {
  if (!analysis || !analysis.hasBoard) {
    return 'עדיין אין לוח מלא, ולכן אי אפשר לתת מסקנה מלאה מתוך הצורות.';
  }

  const focus = analysis.focusHouse;
  const judge = analysis.judge;
  const sentence = analysis.sentence;
  const witnesses = analysis.witnesses || [];

  const dhamir = analysis.dhamirHouse || null;
  const dhamirMizan = analysis.dhamirByMizan || null;
  const boardScore = analysis.boardScore || null;
  const parts = [];

  // שלמות הלוח — רק אם חסר (הלוח השלם מוצג בפסיקה הראשית)
  if (boardScore && !boardScore.isComplete) {
    parts.push(`⚠ ${boardScore.hebrewSummary}`);
  }

  if (focus) {
    const figureName = focus.figureHebrew || 'שאינה מזוהה בשם';
    const transitMeaning = focus.transit?.meaning;
    const transitPart = transitMeaning ? `: ${transitMeaning}` : '';
    let focusLine = `הבית המרכזי בית ${focus.house} — ${figureName}${transitPart}`;
    if (focus.isAdversarial) {
      const tone = focus.fortune || '';
      const adversarialNote = tone === 'נחס'
        ? ' [בית הצד שכנגד — נחס בבית זה = חולשה של הצד השני, טוב לשואל]'
        : tone === 'סעד'
        ? ' [בית הצד שכנגד — סעד בבית זה = הצד השני חזק]'
        : ' [בית הצד שכנגד — יש להפוך את הפרשנות: מה שרע לצד זה טוב לשואל]';
      focusLine += adversarialNote;
    }
    parts.push(focusLine);
  }

  if (witnesses.length) {
    const witnessLines = witnesses.map((w) => {
      const wName = w.figureHebrew || 'צורה לא מזוהה';
      const wTransit = w.transit?.meaning;
      const wTransitPart = wTransit ? `: ${wTransit}` : '';
      return `בית ${w.house} — ${wName}${wTransitPart}`;
    });
    parts.push(`העדים: ${witnessLines.join(' ו־')}`);
  }

  if (judge) {
    const judgeName = judge.figureHebrew || 'צורה לא מזוהה';
    const judgeFortune = judge.fortune ? ` [${judge.fortune}]` : '';
    const judgeTransit = judge.transit?.meaning;
    const judgeTransitPart = judgeTransit
      ? `: ${judgeTransit}`
      : ' [מעבר הצורה לבית 15 לא מפורש במקור — פסיקה לפי מזל כללי]';
    parts.push(
      `הדיין בית 15 — ${judgeName}${judgeFortune}${judgeTransitPart}`
    );
  }

  if (sentence) {
    parts.push(
      `בית 16 — משלים: ${sentence.figureHebrew || 'צורה לא מזוהה'}, מראה את אחרית הדין.`
    );
  }

  if (dhamirMizan && dhamirMizan.traces.length > 0) {
    const traceLines = dhamirMizan.traces.map((t) => {
      const fortune = t.dhamirFortune ? ` [${t.dhamirFortune}]` : '';
      return `  שורת ${t.rowElement} → בית ${t.dhamirHouseNumber} — ${t.dhamirHebrew}${fortune}`;
    });
    const dhamirFort = dhamirMizan.primaryFortune || '';
    const dhamirTone = dhamirFort.includes('סעד') ? 1 : dhamirFort.includes('נחס') ? -1 : 0;
    const judgeToneLocal = judge ? (judge.fortune?.includes('סעד') ? 1 : judge.fortune?.includes('נחס') ? -1 : 0) : 0;
    let dhamirConcord = '';
    if (dhamirTone !== 0 && judgeToneLocal !== 0) {
      const confirming = (judgeToneLocal > 0 && dhamirTone > 0) || (judgeToneLocal < 0 && dhamirTone < 0);
      dhamirConcord = confirming ? ' ✓ מאשר את הדיין.' : ' ⚠ סותר את הדיין — שים לב.';
    }
    parts.push(
      `הדמיר (שרשרת הגזירה):\n${traceLines.join('\n')}\n  → הדמיר העיקרי: בית ${dhamirMizan.primaryHouseNumber} — כל הדין שם.${dhamirConcord}`
    );
  } else if (dhamir) {
    const dhamirFortune = dhamir.fortune ? ` [${dhamir.fortune}]` : '';
    const dhamirTone = (dhamir.fortune || '').includes('סעד') ? 1 : (dhamir.fortune || '').includes('נחס') ? -1 : 0;
    const judgeToneLocal = judge ? (judge.fortune?.includes('סעד') ? 1 : judge.fortune?.includes('נחס') ? -1 : 0) : 0;
    let dhamirConcord = '';
    if (dhamirTone !== 0 && judgeToneLocal !== 0) {
      const confirming = (judgeToneLocal > 0 && dhamirTone > 0) || (judgeToneLocal < 0 && dhamirTone < 0);
      dhamirConcord = confirming ? ' ✓ מאשר את הדיין.' : ' ⚠ סותר את הדיין — שים לב.';
    }
    parts.push(
      `הדמיר (נהמת האמהות): בית ${dhamir.houseNumber} — ${dhamir.figureHebrew}${dhamirFortune}. הצורה שבה נפל הדמיר — כל הדין נמצא בה לפי המקור.${dhamirConcord}`
    );
  }

  const h1Analysis = analysis.house1Analysis || null;
  if (h1Analysis) {
    const lines = h1Analysis.summaryLines.map((l) => `  ${l}`).join('\n');
    parts.push(`מצב השואל (בית הטאלע):\n${lines}`);
  }

  const ittisalat = analysis.ittisalat || null;
  if (ittisalat && ittisalat.summaryLines && ittisalat.summaryLines.length > 0) {
    const connectionStatus = ittisalat.isConnected
      ? 'יש חיבור בין השואל לעניין'
      : 'אין חיבור ישיר בין השואל לעניין';
    const lines = ittisalat.summaryLines.map((l) => `  ${l}`).join('\n');
    parts.push(`איתיסלאת (${connectionStatus}):\n${lines}`);
  }

  const topicConn = analysis.topicConnections || null;
  if (topicConn && topicConn.checks && topicConn.checks.length > 0) {
    const lines = topicConn.checks.map((c) => `  ${c.hebrewShort}`).join('\n');
    parts.push(`בדיקות נושא — ${topicConn.topicHebrew || topicConn.topicId}:\n${lines}`);
  }

  const tahasil = analysis.tahasil || null;
  if (tahasil) {
    parts.push(`תחסיל — האם הדבר ייגמר:\n  ${tahasil.tahasilHebrew}`);
    if (tahasil.hayulaActive) {
      parts.push(`  ⚠ ${tahasil.hayulaHebrew}`);
    }
  }

  const nameLetters = analysis.nameLetters;
  if (Array.isArray(nameLetters) && nameLetters.length > 0) {
    const nameLines = nameLetters.map((nl) =>
      `  ${nl.houseRole} (בית ${nl.houseNumber} — ${nl.figureHebrew}): ${nl.outputHebrew}`
    );
    parts.push(`הוצאת שם (תסקין עבדוה):\n${nameLines.join('\n')}`);
  }

  const authAnalysis = analysis.authorityStateAnalysis;
  if (authAnalysis) {
    parts.push(`ניתוח שלטון (שער מלכים, חאוי עמ׳ 36-38):\n${authAnalysis.outputHebrew}`);
  }

  const yearlyAnalysis = analysis.yearlyForecastAnalysis;
  if (yearlyAnalysis) {
    parts.push(`ניתוח טאלע השנה (חאוי עמ׳ 60-62):\n${yearlyAnalysis.outputHebrew}`);
  }

  const birthAnalysis = analysis.birthNativityAnalysis;
  if (birthAnalysis) {
    parts.push(`שער המולד (חאוי עמ׳ 51-58):\n${birthAnalysis.outputHebrew}`);
  }

  const triangles = analysis.trianglesEnrichment;
  if (triangles) {
    parts.push(`ניתוח משולשים (שער המשולשים, חאוי עמ׳ 59):\n${triangles.outputHebrew}`);
  }

  const illnessDiag = analysis.illnessElementDiagnosis;
  if (illnessDiag) {
    parts.push(`אבחון מחלה לפי יסוד (בלוג' אלאמל פרק 5):\n  ${illnessDiag.outputHebrew.replace(/\n/g, '\n  ')}`);
  }

  const thiefLoc = analysis.thiefLocationDetails;
  if (thiefLoc) {
    parts.push(`זיהוי הגנב (בלוג' אלאמל פרק 19):\n  ${thiefLoc.outputHebrew.replace(/\n/g, '\n  ')}`);
  }

  const enemyHH = analysis.enemyInHousehold;
  if (enemyHH) {
    parts.push(`גילוי אויב בסביבה (בלוג' אלאמל עמ' 64):\n  ${enemyHH.outputHebrew}`);
  }

  const marriageForecast = analysis.marriageFigureForecast;
  if (marriageForecast) {
    parts.push(`פסיקת נישואין לפי צורה שולטת (בלוג' אלאמל פרק 33):\n  ${marriageForecast.outputHebrew}`);
  }

  const yearlyForecast = analysis.yearlyFigureForecast;
  if (yearlyForecast) {
    parts.push(`תחזית שנתית לפי צורה שולטת (בלוג' אלאמל עמ' 25):\n  ${yearlyForecast.outputHebrew}`);
  }

  const altName = analysis.alternativeNameExtraction;
  if (altName) {
    parts.push(`חילוץ שם — שיטה 5 (בלוג' אלאמל עמ' 13-15):\n${altName.outputHebrew}`);
  }

  const physThief = analysis.physicalDescriptionThief;
  if (physThief) {
    parts.push(`תיאור פיזי — הגנב / האויב (בלוג' אלאמל עמ' 65-71):\n  ${physThief.outputHebrew}`);
  }

  const physMissing = analysis.physicalDescriptionMissing;
  if (physMissing) {
    parts.push(`תיאור פיזי — הנעדר (בלוג' אלאמל עמ' 65-71):\n  ${physMissing.outputHebrew}`);
  }

  const prisoner = analysis.prisonerAnalysis;
  if (prisoner) {
    parts.push(`ניתוח אסיר/כלא (בלוג' אלאמל עמ' 28, 57):\n${prisoner.lines.map((l) => `  ${l}`).join('\n')}`);
  }

  const seaRisks = analysis.seaVoyageRisks;
  if (seaRisks) {
    parts.push(seaRisks.outputHebrew);
  }

  // HAWI_DHAMIR_DIRECTIONS_VALIDATION — נסיעה כפויה/רצונית
  const forcedTravel = analysis.forcedTravelAnalysis;
  if (forcedTravel) {
    parts.push(`סוג הנסיעה (חאוי עמ׳ 33):\n  ${forcedTravel.hebrewNote}`);
  }

  // HAWI_INTRODUCTION_MAHW_THABAT — יסודות בנושא foundations
  const foundations = analysis.foundationsDisplay;
  if (foundations) {
    parts.push(`יסודות גורל החול (${foundations.sourceRef}):\n${foundations.lines.map((l) => '  ' + l).join('\n')}`);
  }

  // --- GROUP B: topic-specific analysis sections ---

  // childrenPregnancy: house 5 fertility analysis
  if (topicId === 'childrenPregnancy') {
    const h5 = getHouseFromBoard(analysis, 5);
    const h1 = getHouseFromBoard(analysis, 1);
    if (h5) {
      const h5Fortune = h5.fortune || '';
      const h5Name = h5.figureHebrew || h5.figureKey || '';
      const isFertile = h5Fortune.includes('סעד');
      const isBarren = h5Fortune.includes('נחס');
      const sameAsH1 = h1 && h5.figureKey === h1.figureKey;
      const verdictLine = isFertile
        ? `בית 5 (ילדים) — ${h5Name} [סעד]: סימן להיריון / לידה אפשרית.`
        : isBarren
        ? `בית 5 (ילדים) — ${h5Name} [נחס]: עיכוב בהיריון, ייתכן קושי.`
        : `בית 5 (ילדים) — ${h5Name}: מצב ביניים — יש לבדוק את העדים.`;
      parts.push(`אבחון פריון (בית 5):\n  ${verdictLine}${sameAsH1 ? '\n  ⚠ צורת בית 5 זהה לבית 1 — קשר ישיר בין השואל לעניין הילדים.' : ''}`);
    }
  }

  // travel: house 9 detailed + dangers
  if (topicId === 'travel') {
    const h9 = getHouseFromBoard(analysis, 9);
    const h8 = getHouseFromBoard(analysis, 8);
    const h12 = getHouseFromBoard(analysis, 12);
    if (h9) {
      const h9Fortune = h9.fortune || '';
      const h9Dir = h9.directionHebrew || '';
      const dangerHouses = [];
      if (h8?.fortune?.includes('נחס')) dangerHouses.push(`בית 8 (${h8.figureHebrew}) — סכנה`);
      if (h12?.fortune?.includes('נחס')) dangerHouses.push(`בית 12 (${h12.figureHebrew}) — אויב נסתר`);
      const dangerNote = dangerHouses.length ? `\n  ⚠ בתי סכנה: ${dangerHouses.join(' | ')}` : '';
      parts.push(`ניתוח מסלול נסיעה (בית 9):\n  בית 9 — ${h9.figureHebrew} [${h9Fortune}]${h9Dir ? ', כיוון: ' + h9Dir : ''}${dangerNote}`);
    }
  }

  // disputes: house 1 vs house 7 power comparison
  if (topicId === 'disputes') {
    const h1 = getHouseFromBoard(analysis, 1);
    const h7 = getHouseFromBoard(analysis, 7);
    if (h1 && h7) {
      const h1Saad = h1.fortune?.includes('סעד') ? 1 : h1.fortune?.includes('נחס') ? -1 : 0;
      const h7Saad = h7.fortune?.includes('סעד') ? 1 : h7.fortune?.includes('נחס') ? -1 : 0;
      const h1Tone = h1Saad > 0 ? 'חזק [סעד]' : h1Saad < 0 ? 'חלש [נחס]' : 'ביניים';
      const h7Tone = h7Saad > 0 ? 'חזק [סעד]' : h7Saad < 0 ? 'חלש [נחס]' : 'ביניים';
      const advantage = (h1Saad > h7Saad) ? '→ יתרון לשואל' : (h1Saad < h7Saad) ? '→ יתרון ליריב' : '→ כוחות שקולים';
      parts.push(`כוח הצדדים בסכסוך:\n  שואל (בית 1 — ${h1.figureHebrew}): ${h1Tone}\n  יריב (בית 7 — ${h7.figureHebrew}): ${h7Tone}\n  ${advantage}`);
    }
  }

  // commerce: houses 2 and 10 success/failure
  if (topicId === 'commerce') {
    const h2 = getHouseFromBoard(analysis, 2);
    const h10 = getHouseFromBoard(analysis, 10);
    if (h2 || h10) {
      const lines = [];
      if (h2) lines.push(`  בית 2 (ממון) — ${h2.figureHebrew} [${h2.fortune || 'ביניים'}]: ${h2.fortune?.includes('סעד') ? 'כסף זמין, עסקה ממונית חיובית' : h2.fortune?.includes('נחס') ? 'חסרון כספי, עסקה בסיכון' : 'מצב ממוני בינוני'}`);
      if (h10) lines.push(`  בית 10 (תוצאת עסקה) — ${h10.figureHebrew} [${h10.fortune || 'ביניים'}]: ${h10.fortune?.includes('סעד') ? 'תוצאה חיובית, רווח' : h10.fortune?.includes('נחס') ? 'תוצאה שלילית, הפסד' : 'תוצאה בינונית'}`);
      if (h2 && h10) {
        const bothSaad = h2.fortune?.includes('סעד') && h10.fortune?.includes('סעד');
        const bothNahs = h2.fortune?.includes('נחס') && h10.fortune?.includes('נחס');
        lines.push(bothSaad ? '  → שני הבתים טובים — עסקה מומלצת' : bothNahs ? '  → שני הבתים רעים — הימנע מהעסקה' : '  → מצב מעורב — נדרשת זהירות');
      }
      parts.push(`ניתוח עסקה (בית 2 + בית 10):\n${lines.join('\n')}`);
    }
  }

  // fear: source of fear per houses
  if (topicId === 'fear') {
    const h1 = getHouseFromBoard(analysis, 1);
    const h7 = getHouseFromBoard(analysis, 7);
    const h12 = getHouseFromBoard(analysis, 12);
    const h8 = getHouseFromBoard(analysis, 8);
    const fearSources = [];
    if (h7?.fortune?.includes('נחס')) fearSources.push(`בית 7 (${h7.figureHebrew}) — פחד מאויב גלוי`);
    if (h12?.fortune?.includes('נחס')) fearSources.push(`בית 12 (${h12.figureHebrew}) — פחד מאויב נסתר`);
    if (h8?.fortune?.includes('נחס')) fearSources.push(`בית 8 (${h8.figureHebrew}) — פחד ממות/אסון`);
    if (h1?.fortune?.includes('נחס')) fearSources.push(`בית 1 (${h1.figureHebrew}) — חולשה ייתכן מקור הפחד בשואל עצמו`);
    if (fearSources.length) {
      parts.push(`מקור הפחד:\n${fearSources.map(s => '  ' + s).join('\n')}`);
    } else {
      parts.push('מקור הפחד: לפי הלוח — אין בתי נחס ברורים. הפחד ייתכן מגזים.');
    }
  }

  // loveHate: love/hate strength + what separates
  if (topicId === 'loveHate') {
    const h1 = getHouseFromBoard(analysis, 1);
    const h7 = getHouseFromBoard(analysis, 7);
    if (h1 && h7) {
      const h1Tone = h1.fortune?.includes('סעד') ? 'אהבה חיובית' : h1.fortune?.includes('נחס') ? 'שנאה / דחייה' : 'רגש מעורב';
      const h7Tone = h7.fortune?.includes('סעד') ? 'אהבה חיובית' : h7.fortune?.includes('נחס') ? 'שנאה / דחייה' : 'רגש מעורב';
      const sameKey = h1.figureKey === h7.figureKey;
      const separator = sameKey
        ? '  → שני הצדדים חולקים אותה צורה — מראה הדדיות.'
        : h1.fortune?.includes('סעד') && h7.fortune?.includes('נחס')
        ? '  → אהבה חד-צדדית: השואל אוהב, הצד השני שונא.'
        : h1.fortune?.includes('נחס') && h7.fortune?.includes('סעד')
        ? '  → אהבה חד-צדדית: הצד השני אוהב, השואל שונא.'
        : '  → בדוק חיבורי האיתיסאלאת בין בית 1 לבית 7 לפירוט.';
      parts.push(`כוח הרגש:\n  שואל (בית 1 — ${h1.figureHebrew}): ${h1Tone}\n  הצד השני (בית 7 — ${h7.figureHebrew}): ${h7Tone}\n${separator}`);
    }
  }

  // completion: tahasil-based analysis (tahasil already shown above, but add specific verdict)
  if (topicId === 'completion') {
    const judgeLocal = analysis.judge;
    const tahasilLocal = analysis.tahasil;
    if (judgeLocal || tahasilLocal) {
      const judgeVerd = judgeLocal?.fortune?.includes('סעד') ? 'הדיין פוסק לטובה' : judgeLocal?.fortune?.includes('נחס') ? 'הדיין פוסק לרעה' : 'הדיין אינו חד-משמעי';
      const tahasilVerd = tahasilLocal?.tahasilStatus === 'achieved'
        ? 'התחסיל: הדבר יסתיים ✓'
        : tahasilLocal?.tahasilStatus === 'not-achieved'
        ? 'התחסיל: הדבר לא יסתיים ✗'
        : 'התחסיל: מצב ביניים';
      parts.push(`ניתוח השלמה:\n  ${judgeVerd}\n  ${tahasilVerd}`);
    }
  }

  // --- GROUP C: enriched skeleton topics ---

  // partnership: house 1 vs 7 compatibility + house 2/10 for money
  if (topicId === 'partnership') {
    const h1 = getHouseFromBoard(analysis, 1);
    const h7 = getHouseFromBoard(analysis, 7);
    const h2 = getHouseFromBoard(analysis, 2);
    const h10 = getHouseFromBoard(analysis, 10);
    if (h1 && h7) {
      const h1F = h1.fortune || '';
      const h7F = h7.fortune || '';
      const compatible = (h1F.includes('סעד') && h7F.includes('סעד')) ? 'שני הצדדים חזקים — שותפות טובה'
        : (h1F.includes('נחס') && h7F.includes('נחס')) ? 'שני הצדדים חלשים — שותפות מסוכנת'
        : 'מצב מעורב — בדוק תנאים לפני כניסה';
      const moneyNote = (h2 && h10) ? `\n  ממון (בית 2 — ${h2.figureHebrew}) / תוצאה (בית 10 — ${h10.figureHebrew}): ${h2.fortune?.includes('סעד') && h10.fortune?.includes('סעד') ? 'רווח מצופה' : h2.fortune?.includes('נחס') || h10.fortune?.includes('נחס') ? 'סיכון כלכלי' : 'ממוצע'}` : '';
      parts.push(`ניתוח שותפות:\n  שואל (בית 1 — ${h1.figureHebrew}): ${h1F || 'ביניים'}\n  שותף (בית 7 — ${h7.figureHebrew}): ${h7F || 'ביניים'}\n  → ${compatible}${moneyNote}`);
    }
  }

  // siblings: house 3 analysis + connection to house 1
  if (topicId === 'siblings') {
    const h3 = getHouseFromBoard(analysis, 3);
    const h1 = getHouseFromBoard(analysis, 1);
    if (h3) {
      const h3F = h3.fortune || '';
      const sameKey = h1 && h3.figureKey === h1.figureKey;
      const connectionNote = sameKey ? '\n  → צורת בית 3 זהה לבית 1 — קשר חזק מאוד, אחווה ממשית.' : '';
      parts.push(`ניתוח האח/השכן (בית 3):\n  בית 3 — ${h3.figureHebrew} [${h3F || 'ביניים'}]: ${h3F.includes('סעד') ? 'קשר חיובי, תמיכה' : h3F.includes('נחס') ? 'קושי בקשר, ריחוק' : 'קשר בינוני'}${connectionNote}`);
    }
  }

  // deathInheritance: house 8 + 7 + 2 analysis
  if (topicId === 'deathInheritance') {
    const h8 = getHouseFromBoard(analysis, 8);
    const h7 = getHouseFromBoard(analysis, 7);
    const h2 = getHouseFromBoard(analysis, 2);
    if (h8) {
      const h8F = h8.fortune || '';
      const h7Note = h7 ? `\n  היורש/הנפטר (בית 7 — ${h7.figureHebrew}): ${h7.fortune?.includes('סעד') ? 'מצב חיובי' : h7.fortune?.includes('נחס') ? 'מצב קשה' : 'ביניים'}` : '';
      const h2Note = h2 ? `\n  הירושה הכספית (בית 2 — ${h2.figureHebrew}): ${h2.fortune?.includes('סעד') ? 'ממון זמין' : h2.fortune?.includes('נחס') ? 'ממון חסום או בסכסוך' : 'ביניים'}` : '';
      parts.push(`ניתוח מוות/ירושה (בית 8):\n  בית 8 — ${h8.figureHebrew} [${h8F || 'ביניים'}]: ${h8F.includes('סעד') ? 'סכנה נמוכה / ירושה זמינה' : h8F.includes('נחס') ? 'סכנה ממשית / ירושה מסובכת' : 'מצב בינוני'}${h7Note}${h2Note}`);
    }
  }

  // מה בלב השואל — מוצג לכל נושא לפי שיטת חזרת הצורה הראשונה (بلوغ الامل פ׳ 17)
  const firstFigRep = analysis.firstFigureRepetition;
  if (firstFigRep) {
    parts.push(firstFigRep.outputHebrew);
  }

  const timing = analysis.timingEstimate;
  if (timing) {
    parts.push(timing.outputHebrew);
  }

  return parts.join('\n');
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
      const houseLabel = r.house != null ? `בית ${r.house}` : r.role;
      const roleLabel = r.house != null ? ` (${r.role})` : '';
      return `${houseLabel}${roleLabel}${figure}: ${signals}`;
    });

  return important.filter(Boolean).join('\n');
}

function getHouseFromBoard(boardData, houseNumber) {
  if (!boardData || !Array.isArray(boardData.houses)) return null;
  return boardData.houses.find((h) => Number(h.house) === Number(houseNumber)) || null;
}

function houseDescription(house) {
  if (!house) return null;
  const name = house.figureHebrew || 'לא מזוהה';
  const transit = house.transit?.meaning;
  return transit ? `${name}: ${transit}` : name;
}

function recommendationByTopic(topicId, grade, boardAnalysis, question) {
  if (topicId === 'travel') {
    const house9 = getHouseFromBoard(boardAnalysis, 9);
    const house9Desc = houseDescription(house9);
    let base = '';
    if (grade === 'positive') base = 'לכן אפשר לשקול יציאה, אבל עדיין לבדוק זמן, דרך ואנשים מעורבים.';
    else if (grade === 'negative') base = 'לכן לא מומלץ למהר לנסיעה. עדיף לדחות, לבדוק מחדש או לשנות תנאים.';
    else base = 'לכן ההמלצה היא לא למהר: לבדוק את התנאים, הדרך והזמן לפני החלטה.';
    if (house9Desc) base += ` בדוק בית 9 (נסיעה): ${house9Desc}`;
    return base;
  }

  if (topicId === 'missingPerson') {
    const house8 = getHouseFromBoard(boardAnalysis, 8);
    const house8Desc = houseDescription(house8);
    let base = 'לכן צריך לקרוא בזהירות את סימני החזרה, העיכוב והפחד, ולא להסתפק בסימן אחד בלבד.';
    if (house8Desc) base += ` בדוק בית 8 (מות/אובדן): ${house8Desc}`;
    return base;
  }

  if (topicId === 'childrenPregnancy') {
    const house5 = getHouseFromBoard(boardAnalysis, 5);
    const house5Desc = houseDescription(house5);
    const jumla = boardAnalysis?.jumlaAnalysis;
    const parts = [];

    if (jumla?.childDiagnosis) {
      parts.push(jumla.childDiagnosis.outputHebrew);
    }

    let base = 'לכן יש לבדוק את בית הילדים, העדים והדיין יחד, ורק אז להכריע לגבי אפשרות ההיריון או סימני זכר ונקבה.';
    if (house5Desc) base += ` בדוק בית 5 (ילדים): ${house5Desc}`;
    parts.push(base);
    return parts.join('\n');
  }

  if (topicId === 'hiddenTreasure') {
    const tl = boardAnalysis?.treasureLocation;
    if (!tl) return 'לכן צריך לבדוק אם הדבר באמת קיים, אם הוא חסום או שמור, ומה הכיוון שהלוח נותן לחיפוש.';

    const parts = [];

    parts.push(tl.presenceHebrew);

    if (tl.locationHebrew) {
      const figName = tl.house1Hebrew || tl.house1Pattern;
      if (tl.presenceVerdict === 'not-found' && tl.locationRule?.resultHebrew) {
        parts.push(`צורת בית 1 (${figName}): ${tl.locationHebrew}`);
      } else if (tl.presenceVerdict !== 'not-found') {
        parts.push(`צורת בית 1 (${figName}) — מיקום לפי המקור: ${tl.locationHebrew}`);
      }
    }

    return parts.join('\n');
  }

  if (topicId === 'spiritualDiagnostics') {
    const houseIndex = boardAnalysis?.spiritualDiagnosticsHouseIndex;
    const jumla = boardAnalysis?.jumlaAnalysis;
    const lines = ['לכן נכון להמשיך באבחון מדויק לפי הבתים והצורות, ולא לקבוע רק לפי תחושה או פחד.'];

    if (jumla?.illnessDiagnosis) {
      const d = jumla.illnessDiagnosis;
      if (d.isSorcery) {
        lines.push(`⚠ ${d.outputHebrew} — יש לבדוק סימנים נוספים לכישוף לפי אבחון הבתים.`);
      } else {
        lines.push(d.outputHebrew);
      }
    }

    if (houseIndex?.findings?.length) {
      const alerts = houseIndex.alerts || [];
      if (alerts.length) {
        lines.push(`בתים רגישים עם צורות נחסיות: ${alerts.map(a => `בית ${a.houseNumber} (${a.figureHebrew}) — ${a.hebrewTerms.slice(0,2).join(', ')}`).join(' | ')}`);
      }
      const top = houseIndex.findings.slice(0, 4);
      for (const f of top) {
        lines.push(`בית ${f.houseNumber} (${f.figureHebrew}): ${f.hebrewTerms.slice(0,3).join(', ')}`);
      }
    }

    return lines.join('\n');
  }

  if (topicId === 'marriage') {
    const house7 = getHouseFromBoard(boardAnalysis, 7);
    const house7Desc = houseDescription(house7);
    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה נטייה חיובית לנישואין — בדוק את בית 7 ואת ההתאמה.';
    else if (grade === 'negative') base = 'לכן הלוח מראה קושי או מניעה — יש לדון בצורות בפירוט לפני החלטה.';
    else base = 'לכן התמונה מעורבת — יש לבדוק את שני הצדדים בנפרד ואת הקשר ביניהם.';
    if (house7Desc) base += ` בדוק בית 7 (הצד השני): ${house7Desc}`;
    return base;
  }

  if (topicId === 'illness') {
    const house6 = getHouseFromBoard(boardAnalysis, 6);
    const house6Desc = houseDescription(house6);
    const jumla = boardAnalysis?.jumlaAnalysis;
    const parts = [];

    if (jumla?.illnessDiagnosis) {
      const d = jumla.illnessDiagnosis;
      parts.push(d.isSorcery
        ? `⚠ ${d.outputHebrew} — יש לשקול בדיקת אבחון רוחני.`
        : d.outputHebrew);
    }

    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה נטייה לשיפור ולהחלמה.';
    else if (grade === 'negative') base = 'לכן הלוח מראה מחלה קשה — יש לפעול בזהירות ולבדוק את בית 8.';
    else base = 'לכן המחלה בלוח מעורבת — לא ניתן לקבוע בוודאות.';
    if (house6Desc) base += ` בדוק בית 6 (המחלה): ${house6Desc}`;
    parts.push(base);

    return parts.join('\n');
  }

  if (topicId === 'disputes') {
    const house7 = getHouseFromBoard(boardAnalysis, 7);
    const house7Desc = houseDescription(house7);
    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה יתרון לשואל בסכסוך — הצד שלו חזק יותר.';
    else if (grade === 'negative') base = 'לכן הלוח מראה עמדה חלשה — מומלץ לשקול פשרה לפני הכרעה.';
    else base = 'לכן הסכסוך מאוזן — לא ניתן להכריע בקלות לאחד הצדדים.';
    if (house7Desc) base += ` בדוק בית 7 (הצד השני): ${house7Desc}`;
    return base;
  }

  if (topicId === 'theft') {
    const house7 = getHouseFromBoard(boardAnalysis, 7);
    const house8 = getHouseFromBoard(boardAnalysis, 8);
    const house4 = getHouseFromBoard(boardAnalysis, 4);
    const thiefLocation = boardAnalysis?.thiefLocationDetails;
    const nameLetters   = boardAnalysis?.nameLetters;
    const altName       = boardAnalysis?.alternativeNameExtraction;

    const isOutgoing = house7?.directionHebrew === 'יוצא';
    const isIncoming = house7?.directionHebrew === 'נכנס';

    const lines = [];

    let returnVerdict;
    if (grade === 'positive' || grade === 'cautiously-positive') {
      returnVerdict = isIncoming
        ? 'הדיין נוטה לטובה, והצורה בבית 7 נכנסת — הגנב עדיין בסביבה. יש סיכוי טוב לאיתור החפץ.'
        : isOutgoing
        ? 'הדיין נוטה לטובה אך הצורה יוצאת — הגנב כבר התרחק. החזרת החפץ אפשרית אך תדרוש מאמץ.'
        : 'הדיין נוטה לטובה — יש סיכוי לאיתור החפץ הגנוב ולגילוי הגנב.';
    } else if (grade === 'negative' || grade === 'cautiously-negative') {
      returnVerdict = isOutgoing
        ? 'הדיין נוטה לרעה, והצורה יוצאת — הגנב ברח, החפץ הגנוב כנראה לא יחזור.'
        : 'הדיין מצביע על קושי — קשה לאתר את הגנב, החפץ עלול לא לחזור.';
    } else {
      returnVerdict = isIncoming
        ? 'הלוח מעורב, אך הצורה בבית 7 נכנסת — הגנב עדיין בסביבה. כדאי לנסות לאתרו.'
        : isOutgoing
        ? 'הלוח מעורב, אך הצורה יוצאת — הגנב כבר עזב. הסיכויים לאיתור נמוכים.'
        : 'הלוח מעורב — יש לבדוק את כיוון הצורה בבית 7 ואת פסיקת הדיין לפני הכרעה.';
    }
    lines.push(returnVerdict);

    if (thiefLocation?.findings?.length > 0) {
      const uniqueTypes = [...new Set(thiefLocation.findings.map(f => f.thiefType))];
      for (const type of uniqueTypes) {
        lines.push(`לפי חזרת הצורות בלוח: ${type}.`);
      }
    }

    if (Array.isArray(nameLetters) && nameLetters.length > 0) {
      const h7Entry = nameLetters.find(n => n.houseNumber === 7);
      const h8Entry = nameLetters.find(n => n.houseNumber === 8);
      if (h7Entry?.letters?.length > 0) {
        const firstLetters = h7Entry.letters.join(' / ');
        if (h8Entry?.letters?.length > 0) {
          const secondLetters = h8Entry.letters.join(' / ');
          const combos = h7Entry.letters.flatMap(l7 => h8Entry.letters.map(l8 => l7 + l8)).join(' / ');
          lines.push(`שם הגנב: האות הראשונה — ${firstLetters}, האות השנייה — ${secondLetters} (שם מתחיל ב: ${combos})`);
        } else {
          lines.push(`שם הגנב: שמו מתחיל ב: ${firstLetters}`);
        }
      }
      if (altName?.results?.length > 0) {
        const altLetters = [...new Set(altName.results.flatMap(r => r.letters || []))];
        if (altLetters.length > 0) {
          lines.push(`שיטה משלימה (בתים 1, 4, 12): אותיות — ${altLetters.join(' / ')}`);
        }
      }
    }

    if (house4) {
      const h4Transit = house4.transit?.meaning;
      if (h4Transit) lines.push(`מקום הגנבה (בית 4 — ${house4.figureHebrew || ''}): ${h4Transit}`);
    }

    if (grade === 'positive' || grade === 'cautiously-positive') {
      lines.push('ההמלצה: לחקור בין הסביבה הקרובה לפי הסימנים שהלוח מסמן — הסיכוי לאיתור קיים. יש להתמקד באנשים שתואמים את התיאור הפיזי ואת אותיות השם שעלו בלוח.');
    } else if (grade === 'negative' || grade === 'cautiously-negative') {
      lines.push('ההמלצה: יש לשקול אם כדאי להמשיך בחיפוש — הלוח מצביע על קושי ממשי. ניתן לנסות לעמת את האנשים שתואמים את הסימנים, אך ציפיות ריאליות נדרשות.');
    } else {
      lines.push('ההמלצה: לחקור בין המוכרים הקרובים ולא למהר לוותר — הלוח אינו חד-משמעי. המיקוד יהיה לפי אותיות השם, הסוג האנושי שעלה, ומיקום הגנבה.');
    }

    return lines.join('\n');
  }

  if (topicId === 'enemies') {
    const house7  = getHouseFromBoard(boardAnalysis, 7);
    const house9  = getHouseFromBoard(boardAnalysis, 9);
    const house12 = getHouseFromBoard(boardAnalysis, 12);
    const house7Name  = house7?.figureHebrew  || null;
    const house9Name  = house9?.figureHebrew  || null;
    const house12Name = house12?.figureHebrew || null;

    const lines = [];

    // Is this a theft question? detect from question keywords in the broader result
    // We identify theft by checking if house 7 is the "thief" focus
    const theftKeywords = ['גנב', 'גנבה', 'גנוב', 'נגנב', 'גניבה', 'מי גנב'];
    const questionText = String(question || '');
    const isTheftQuestion = theftKeywords.some((k) => questionText.includes(k));

    if (isTheftQuestion && house7) {
      const transitMeaning = house7.transit?.meaning || '';
      const element = house7.elementHebrew || house7.element || '';

      let thiefDesc = `הגנב מיוצג על ידי "${house7Name}" בבית 7.`;

      if (transitMeaning) {
        thiefDesc += ` לפי מעבר הצורה: ${transitMeaning}`;
      }

      if (element.includes('אוויר') || element.includes('רוח')) {
        thiefDesc += ' — אדם קרוב או בן הבית / שכן.';
      } else if (element.includes('אש')) {
        thiefDesc += ' — אדם בעל סמכות, גברי ובעל נחישות.';
      } else if (element.includes('עפר')) {
        thiefDesc += ' — אדם קרוב, ייתכן קרוב משפחה או אדם מוכר.';
      } else if (element.includes('מים')) {
        thiefDesc += ' — אדם שיש לו קשר רגשי או קשר עם הבית.';
      }

      // Entering/exiting: נשוא/שפל/כבוד נכנס = thief still near; ממון יוצא/סף יוצא = already left
      const exitFigures = ['ממון יוצא', 'סף יוצא', 'כבוד יוצא', 'שפל ראש'];
      const enterFigures = ['ממון נכנס', 'סף נכנס', 'כבוד נכנס', 'נשוא ראש'];
      if (exitFigures.some((f) => house7Name?.includes(f.split(' ')[0]))) {
        thiefDesc += ' הצורה יוצאת — הגנב/החפץ כבר התרחק.';
      } else if (enterFigures.some((f) => house7Name?.includes(f.split(' ')[0]))) {
        thiefDesc += ' הצורה נכנסת — הגנב עדיין קרוב, הדבר עשוי לחזור.';
      }

      lines.push(thiefDesc);

      if (house9Name) {
        lines.push(`בית 9 (${house9Name}): ייתכן קשר לגורם נסתר נוסף.`);
      }
      if (house12Name) {
        lines.push(`בית 12 (${house12Name}): מורה על מה שנסתר — חפץ/אדם שמוסתר.`);
      }
    } else {
      let base = '';
      if (grade === 'positive') base = 'לכן הלוח מראה שהשואל עומד בעמדה חזקה לעומת האויב.';
      else if (grade === 'negative') base = 'לכן הלוח מראה אויב חזק — יש להיזהר ולא להתמודד ישירות.';
      else base = 'לכן מצב האויב מעורב — יש לדון בכל צורה בנפרד.';
      if (house7Name) base += ` בית 7 (האויב): ${house7Name}${house7.transit?.meaning ? ` — ${house7.transit.meaning}` : ''}.`;
      if (house12Name) base += ` בית 12 (אויבים נסתרים): ${house12Name}.`;
      lines.push(base);
    }

    return lines.join('\n');
  }

  if (topicId === 'fear') {
    const house12 = getHouseFromBoard(boardAnalysis, 12);
    const house12Desc = houseDescription(house12);
    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה שהסכנה לא ממשית או שיש הגנה — הפחד גדול מהמציאות.';
    else if (grade === 'negative') base = 'לכן הלוח מראה שיש בסיס ממשי לפחד — יש לנהוג בזהירות.';
    else base = 'לכן הסיכון בלוח מעורב — אין הכרעה ברורה לכאן או לכאן.';
    if (house12Desc) base += ` בדוק בית 12 (פחד ואויבים): ${house12Desc}`;
    return base;
  }

  if (topicId === 'commerce') {
    const house2 = getHouseFromBoard(boardAnalysis, 2);
    const house2Desc = houseDescription(house2);
    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה נטייה לרווח — הדרך לעסקה פתוחה.';
    else if (grade === 'negative') base = 'לכן הלוח מראה הפסד או חסימה — לא זמן מתאים לעסקה זו.';
    else base = 'לכן תוצאת העסקה מעורבת — יש לבדוק את בית 2 ובית 7 בנפרד.';
    if (house2Desc) base += ` בדוק בית 2 (הממון): ${house2Desc}`;
    return base;
  }

  if (topicId === 'loveHate') {
    const house7 = getHouseFromBoard(boardAnalysis, 7);
    const house7Desc = houseDescription(house7);
    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה נטייה לחיבה ולקרבה — יש חיבור בין הצדדים.';
    else if (grade === 'negative') base = 'לכן הלוח מראה שנאה או ניתוק — אין חיבור בין הצדדים בלוח זה.';
    else base = 'לכן הרגש מעורב — יש צדדים חיוביים ושליליים בקשר.';
    if (house7Desc) base += ` בדוק בית 7 (הצד השני): ${house7Desc}`;
    return base;
  }

  if (topicId === 'completion') {
    return 'לכן הכרעת הדיין היא העיקר — אם הדיין סעד הדבר יושלם, ואם נחס יש מניעה. העדים מחזקים או מחלישים.';
  }

  if (topicId === 'prisoner') {
    const house5 = getHouseFromBoard(boardAnalysis, 5);
    const house12 = getHouseFromBoard(boardAnalysis, 12);
    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה נטייה לשחרור — יש סיכוי ליציאת האסיר.';
    else if (grade === 'negative') base = 'לכן הלוח מראה המשך מאסר — אין סימן ברור ליציאה.';
    else base = 'לכן המצב מעורב — יש לבדוק את בית 5 ובית 15 בנפרד.';
    if (house5) base += ` בית 5 (גורל האסיר): ${houseDescription(house5) || house5.figureHebrew || ''}.`;
    if (house12) base += ` בית 12 (הכלא): ${houseDescription(house12) || house12.figureHebrew || ''}.`;
    return base;
  }

  if (topicId === 'partnership') {
    const house7 = getHouseFromBoard(boardAnalysis, 7);
    const house2 = getHouseFromBoard(boardAnalysis, 2);
    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה שותפות מוצלחת — יש התאמה בין הצדדים.';
    else if (grade === 'negative') base = 'לכן הלוח מראה קושי בשותפות — יש לדון בתנאים לפני כניסה.';
    else base = 'לכן השותפות מעורבת — יש לבדוק את בית 7 ובית 2 בנפרד.';
    if (house7) base += ` בית 7 (השותף): ${houseDescription(house7) || ''}.`;
    if (house2) base += ` בית 2 (הממון): ${houseDescription(house2) || ''}.`;
    return base;
  }

  if (topicId === 'seaVoyage') {
    const house9 = getHouseFromBoard(boardAnalysis, 9);
    const house8 = getHouseFromBoard(boardAnalysis, 8);
    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה מסע ים בטוח — אפשר לצאת.';
    else if (grade === 'negative') base = 'לכן הלוח מראה סכנה בים — יש לשקול דחיית המסע.';
    else base = 'לכן המסע מעורב — יש לבדוק את בית 9 ובית 8 בנפרד.';
    if (house9) base += ` בית 9 (המסע): ${houseDescription(house9) || ''}.`;
    if (house8) base += ` בית 8 (הסכנה): ${houseDescription(house8) || ''}.`;
    return base;
  }

  if (topicId === 'yearlyForecast') {
    // describeCoreHouses already renders yearlyAnalysis.outputHebrew (element, planets, rain, region)
    // and yearlyFigureForecast.outputHebrew. Add only the final verdict here.
    if (grade === 'positive' || grade === 'cautiously-positive') {
      return 'לכן השנה מבטיחה בכלל — הכיוון הכללי לטובה.';
    } else if (grade === 'negative' || grade === 'cautiously-negative') {
      return 'לכן יש להיזהר — השנה מביאה קשיים, ויש לנהוג בזהירות ולחסוך.';
    }
    return 'לכן השנה מעורבת — יש תקופות טובות ותקופות קשות. כדאי לתכנן בזהירות.';
  }

  if (topicId === 'authorityState') {
    // describeCoreHouses already rendered authAnalysis.outputHebrew (verdict + signals)
    // add only scopeNote + grade-based conclusion here
    const authAnalysis = boardAnalysis?.authorityStateAnalysis;
    const lines = [];

    if (authAnalysis?.scopeNote) {
      lines.push(`היקף השאלה לפי המקור: ${authAnalysis.scopeNote}`);
    }

    if (grade === 'positive' || grade === 'cautiously-positive') {
      lines.push('הלוח מראה יציבות בתפקיד.');
    } else if (grade === 'negative' || grade === 'cautiously-negative') {
      lines.push('הלוח מצביע על סכנה לתפקיד — יש לבדוק בית 7 ובית 15.');
    } else {
      lines.push('מצב התפקיד מעורב — הדיין לא מכריע לכאן או לכאן, יש לעקוב.');
    }

    return lines.join('\n');
  }

  if (topicId === 'birthNativity') {
    // describeCoreHouses already rendered birthAnalysis.outputHebrew (tali + findings)
    // add only the grade-based conclusion here
    if (grade === 'positive' || grade === 'cautiously-positive') {
      return 'הדיין נוטה לטובה — הגורל הכללי של האדם בתקופה זו לטובה.';
    } else if (grade === 'negative' || grade === 'cautiously-negative') {
      return 'הדיין מצביע על קושי — יש לחזק את בית 1 ולזהות איזה בית מקשה.';
    }
    return 'הגורל מעורב — חלק מהחזרות חיוביות וחלק שליליות. יש לקרוא כל בית בנפרד.';
  }

  if (topicId === 'siblings') {
    const house3 = getHouseFromBoard(boardAnalysis, 3);
    const house7 = getHouseFromBoard(boardAnalysis, 7);
    const lines = [];

    if (grade === 'positive' || grade === 'cautiously-positive') {
      lines.push('הלוח מראה קשר חיובי — יש נטייה לשיתוף פעולה, עזרה, או חיבור בין הצדדים.');
    } else if (grade === 'negative' || grade === 'cautiously-negative') {
      lines.push('הלוח מראה קושי בקשר — יש מחלוקת, ריחוק, או מניעה בין הצדדים.');
    } else {
      lines.push('הקשר מעורב — יש חיבור חלקי, אבל גם מרחק או קושי מסוים.');
    }

    const h3Desc = houseDescription(house3);
    if (h3Desc) lines.push(`מצב האח/השכן (בית 3): ${h3Desc}`);
    const h7Desc = houseDescription(house7);
    if (h7Desc) lines.push(`בדיקה נוספת מבית 7: ${h7Desc}`);

    return lines.join('\n');
  }

  if (topicId === 'deathInheritance') {
    const house8 = getHouseFromBoard(boardAnalysis, 8);
    const house7 = getHouseFromBoard(boardAnalysis, 7);
    const house2 = getHouseFromBoard(boardAnalysis, 2);
    const lines = [];

    if (grade === 'positive' || grade === 'cautiously-positive') {
      lines.push('הדיין נוטה לטובה — אם מדובר בחשש מוות, הסכנה נמוכה. אם מדובר בירושה, יש נטייה לקבלתה.');
    } else if (grade === 'negative' || grade === 'cautiously-negative') {
      lines.push('הדיין מצביע על קושי — יש לשים לב לבית 8 ולכוחו. אם מדובר בירושה, ייתכנו עיכובים או מחלוקות.');
    } else {
      lines.push('הדין מעורב — יש לבדוק את בית 8 ובית 7 בנפרד כדי להכריע.');
    }

    const h8Desc = houseDescription(house8);
    if (h8Desc) lines.push(`מוות / ירושה (בית 8): ${h8Desc}`);
    const h7Desc = houseDescription(house7);
    if (h7Desc) lines.push(`הצד השני — יורש / נפטר (בית 7): ${h7Desc}`);
    const h2Desc = houseDescription(house2);
    if (h2Desc) lines.push(`ממון הירושה (בית 2): ${h2Desc}`);

    return lines.join('\n');
  }

  return 'לכן המסקנה צריכה להיקבע לפי שילוב הבית המרכזי, העדים, הדיין והכללים שנבדקו.';
}

function tahasilParagraph(boardAnalysis) {
  const tahasil = boardAnalysis?.tahasil;
  if (!tahasil || tahasil.tahasilStatus === undefined) return '';

  const strengthLabels = {
    strong: 'חזקה',
    medium: 'בינונית',
    weak:   'חלשה',
    none:   '',
  };

  const lines = [];

  if (tahasil.tahasilStatus === 'none') {
    lines.push(`לפי בדיקת התחסיל (שאלת ההגעה): ${tahasil.tahasilHebrew}`);
  } else {
    const strength = strengthLabels[tahasil.tahasilStrength] || '';
    const label = strength ? ` (הגעה ${strength})` : '';
    lines.push(`לפי בדיקת התחסיל${label}: ${tahasil.tahasilHebrew}`);
  }

  if (tahasil.hayulaActive && tahasil.hayulaHebrew) {
    lines.push(`אך יש לשים לב: ${tahasil.hayulaHebrew}`);
  }

  return lines.join(' ');
}

function dhamirParagraph(boardAnalysis, judgeVerdict) {
  const dhamirMizan = boardAnalysis?.dhamirByMizan;
  const dhamirH = boardAnalysis?.dhamirHouse;
  const dhamirFort = dhamirMizan?.primaryFortune || dhamirH?.fortune || '';
  if (!dhamirFort) return '';

  const dhamirTone = dhamirFort.includes('סעד') ? 1 : dhamirFort.includes('נחס') ? -1 : 0;
  const judgeTone = judgeVerdict?.judgeTone ?? 0;
  if (dhamirTone === 0 || judgeTone === 0) return '';

  const confirming = (judgeTone > 0 && dhamirTone > 0) || (judgeTone < 0 && dhamirTone < 0);
  const dhamirHouseNum = dhamirMizan?.primaryHouseNumber || dhamirH?.houseNumber || '';
  const dhamirFigure = dhamirMizan?.primaryHebrew || dhamirH?.figureHebrew || '';

  const timing = boardAnalysis?.timingEstimate;
  const timingNote = timing ? ` עיתוי (האדד): ${timing.dotCount} נקודות → ${timing.dotCount} ${timing.unit} (${timing.tierHebrew || timing.timingUnits}).` : '';

  if (confirming) {
    return `הדמיר (בית ${dhamirHouseNum}${dhamirFigure ? ` — ${dhamirFigure}` : ''}): ${dhamirFort} — מאשר את הדיין ומחזק את הפסיקה. כשהדמיר מסכים עם הדיין, הוא מוסיף ודאות לתשובה.${timingNote}`;
  } else {
    return `הדמיר (בית ${dhamirHouseNum}${dhamirFigure ? ` — ${dhamirFigure}` : ''}): ${dhamirFort} — סותר את הדיין. כשהדמיר מנוגד לדיין, יש לקחת בחשבון שהמצב עשוי להשתנות, או שיש כוחות פנימיים שמעכבים את הגעת התשובה.${timingNote}`;
  }
}

function boardScoreParagraph(boardAnalysis) {
  const bScore = boardAnalysis?.boardScore;
  if (!bScore) return '';
  if (bScore.isComplete) return '';
  return `לוח חסר: ${bScore.hebrewSummary}. כשהלוח חסר (פחות מ-96 נקודות), השאלה עשויה להישאר לא פתורה, או שהתשובה תאחר להתברר.`;
}


// ─── NARRATIVE CONCLUSION — text the practitioner reads to the client ────────

function figureFortuneTone(fortune) {
  if (!fortune) return 0;
  const f = String(fortune);
  if (f === 'סעד') return 2;
  if (f.includes('ממוזג-סעד')) return 1;
  if (f === 'נחס') return -2;
  if (f.includes('ממוזג-נחס')) return -1;
  if (f.includes('סעד')) return 1;
  if (f.includes('נחס')) return -1;
  return 0;
}

function askerOpeningLine(h1Fortune, clientName) {
  const t = figureFortuneTone(h1Fortune);
  const prefix = clientName ? `${clientName}, ` : '';
  if (t >= 2) return `${prefix}הלוח רואה אותך בעמדה חזקה וטובה.`;
  if (t === 1) return `${prefix}הלוח רואה אותך עם יתרון מסוים — לא מושלם, אבל טוב.`;
  if (t === -1) return `${prefix}הלוח מראה שהמצב שלך לא פשוט כרגע — יש קושי בנקודת הפתיחה.`;
  if (t <= -2) return `${prefix}הלוח מראה חולשה ממשית בנקודת הפתיחה שלך — כדאי לחכות או לחזק את עמדתך.`;
  return `${prefix}הלוח רואה אותך במצב מאוזן — לא חזק ולא חלש.`;
}

// essence derived directly from figure Hebrew names — no invented meanings
const FIGURE_ESSENCE = {
  'כבוד נכנס': 'כוח וכבוד',
  'ממון נכנס':  'ממון שזורם לעברך',
  'לבן':        'בהירות ורוגע',
  'חיבור':      'קשרים וחיבורים',
  'דרך':        'דרך פתוחה',
  'סף נכנס':    'פתח חדש שנפתח',
  'נשוא ראש':   'הצלחה ועלייה',
  'קהלה':       'ריבוי ותנועה',
  'שפל ראש':    'שפלות וחולשה',
  'אדום':       'לחץ וסכנה',
  'בר הלחי':    'הפסד',
  'נלחם':       'מאבק ולחץ',
  'סוהר':       'עצירה ומגבלה',
  'כבוד יוצא':  'כבוד שחולף',
  'ממון יוצא':  'ממון שיוצא',
  'סף יוצא':    'חיפוש מוצא',
};

const TOPIC_FOCUS_LABEL = {
  commerce:          'בית הממון (בית 2)',
  marriage:          'בית בן/בת הזוג (בית 7)',
  illness:           'בית המחלה (בית 6)',
  disputes:          'בית היריב (בית 7)',
  enemies:           'בית האויב (בית 7)',
  fear:              'בית הפחד (בית 12)',
  loveHate:          'בית הצד השני (בית 7)',
  missingPerson:     'בית הנעדר (בית 7)',
  travel:            'בית המסע (בית 9)',
  childrenPregnancy: 'בית הילדים (בית 5)',
  hiddenTreasure:    'בית המקום הנסתר (בית 4)',
  yearlyForecast:    'בית הגורל (בית 10)',
  authorityState:    'בית הסמכות (בית 10)',
  birthNativity:     'בית הגורל (בית 10)',
  prisoner:          'בית המאסר (בית 12)',
  partnership:       'בית השותף (בית 7)',
  seaVoyage:         'בית המסע הימי (בית 9)',
  theft:             'בית הגנב (בית 7)',
  siblings:          'בית האחים (בית 3)',
  deathInheritance:  'בית המוות והירושה (בית 8)',
};

function speakNote(house) {
  const s = house?.figureState?.speakingState;
  if (s === 'silent')   return 'שותק — כוחו מוחלש';
  if (s === 'speaking') return 'מדבר — בעוצמה מלאה';
  return null;
}

function buildKashfVerdictBlock(kashfVerdict, kashfSupportAnalysis) {
  if (!kashfVerdict) return null;
  const lines = [];
  lines.push(`━━ פסיקת כשף-אל-אסראר ━━`);
  lines.push(`${kashfVerdict.verdictHebrew}`);
  if (kashfSupportAnalysis?.supportSummaryHebrew) {
    lines.push('');
    lines.push(kashfSupportAnalysis.supportSummaryHebrew);
  }
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  return lines.join('\n');
}

function buildNarrativeByTopic(result) {
  const { topicId, boardAnalysis, judgeVerdict, clientContext, kashfVerdict, kashfSupportAnalysis } = result;
  if (!boardAnalysis?.hasBoard) return null;
  if (topicId === 'spiritualDiagnostics') return null;

  const name     = clean(clientContext?.clientName || '');
  const paras    = [];
  const push     = (p) => { if (p && clean(p)) paras.push(clean(p)); };

  // ── 0. KASHF-AL-ASRAR VERDICT BLOCK (if available) ──────────────
  const kashfBlock = buildKashfVerdictBlock(kashfVerdict, kashfSupportAnalysis);
  if (kashfBlock) push(kashfBlock);

  // ── 0.5. CONFIDENCE TONE MODIFIER ───────────────────────────────
  // רמת הביטחון מ-kashfSupportAnalysis צובעת את טון הנרטיב שמופיע אחרי
  const confidenceLevel = kashfSupportAnalysis?.confidence?.level;
  if (confidenceLevel === 'mixed') {
    push('⚠ יש כוחות מנוגדים בלוח — הפסיקה הראשית נכונה אך לא בוודאות מלאה. יש לקרוא את הפרטים לפני הכרעה.');
  } else if (confidenceLevel === 'weak') {
    push('⚠ הפסיקה הראשית מוחלשת — רוב הכוחות (עדים / דיין) סותרים אותה. יש לנהוג בזהירות ולא לפסוק בוודאות מלאה.');
  } else if (confidenceLevel === 'neutral') {
    push('הכוחות בלוח בלתי-מוכרעים — אין עדיפות ברורה לכיוון מסוים. המסקנה דורשת בדיקה נוספת.');
  } else if (confidenceLevel === 'moderate') {
    push('יש תמיכה חלקית בפסיקה — הכיוון נכון אך לא כל הכוחות מסכימים. מומלץ לבדוק עוד.');
  }
  // very-strong / strong / null — ממשיכים ללא הערה

  const hFig     = (h) => clean(h?.figureHebrew || '');
  const hFort    = (h) => clean(h?.fortune || '');
  const hTransit = (h) => clean(h?.transit?.meaning || '');
  const hTone    = (h) => figureFortuneTone(h?.fortune);
  const hHazz    = (h) => (h?.hazzStrength && h?.hazzCount > 0) ? ` [חַ'ט: ${h.hazzStrength}]` : '';
  const hMeta    = (h) => {
    const parts = [];
    if (h?.zodiacHebrew)  parts.push(`מזל: ${h.zodiacHebrew}`);
    if (h?.ichchhaHebrew) parts.push(`אופי: ${h.ichchhaHebrew}`);
    return parts.length ? ` (${parts.join(' | ')})` : '';
  };

  const h1       = getHouseFromBoard(boardAnalysis, 1);
  const judge    = boardAnalysis.judge   || getHouseFromBoard(boardAnalysis, 15);
  const sentence = boardAnalysis.sentence || getHouseFromBoard(boardAnalysis, 16);
  const w13      = boardAnalysis.witnesses?.[0] || getHouseFromBoard(boardAnalysis, 13);
  const w14      = boardAnalysis.witnesses?.[1] || getHouseFromBoard(boardAnalysis, 14);
  const focus    = boardAnalysis.focusHouse;
  const focusNum = boardAnalysis.focusHouseNumber;

  // ── 0.7. QUESITED NAME ───────────────────────────────────────────
  const quesitedName = clean(clientContext?.quesitedName || '');
  if (quesitedName) push(`הנשאל עליו: ${quesitedName}.`);

  // ── 1. THE JUDGE (H15) — THE RULING ─────────────────────────────
  if (judge) {
    const fig     = hFig(judge);
    const fort    = hFort(judge);
    const transit = hTransit(judge);
    const speak   = speakNote(judge);
    const tone    = hTone(judge);
    const toneWord = tone > 0 ? 'חיובית' : tone < 0 ? 'שלילית' : 'מעורבת';
    const namePrefix = name ? `${name} — ` : '';

    const parts = [];
    parts.push(`${namePrefix}הדיין (בית 15): ${fig}${hHazz(judge)}${hMeta(judge)}${fort ? `, ${fort}` : ''} — פסיקה ${toneWord}.`);
    if (speak)   parts.push(`הדיין ${speak}.`);
    if (transit) parts.push(`חאוי: ${transit}`);

    push(parts.join(' '));
  }

  // ── 2. WITNESSES (H13, H14) ──────────────────────────────────────
  {
    const jTone = hTone(judge);
    const wLines = [];

    const descW = (w, label, num) => {
      if (!w) return;
      const fig = hFig(w), fort = hFort(w), transit = hTransit(w), speak = speakNote(w);
      const tone = hTone(w);
      const agreeNote = jTone !== 0
        ? ((jTone > 0 && tone > 0) || (jTone < 0 && tone < 0) ? 'מחזק את הדיין' : 'מנוגד לדיין')
        : null;

      let line = `${label} (בית ${num}): ${fig}${hHazz(w)}${hMeta(w)}${fort ? `, ${fort}` : ''}`;
      if (speak)     line += `, ${speak}`;
      if (agreeNote) line += ` [${agreeNote}]`;
      if (transit)   line += `. חאוי: ${transit}`;
      wLines.push(line);
    };

    descW(w13, 'עד ראשון', 13);
    descW(w14, 'עד שני', 14);

    const wt = boardAnalysis.witnessTestimony;
    if (wt?.w13?.hebrewSummary) {
      wLines.push(`עדות בית 13 (על בתים 1, 9): ${wt.w13.hebrewSummary}`);
    }
    if (wt?.w14?.hebrewSummary) {
      wLines.push(`עדות בית 14 (על בתים 5, 6, 11): ${wt.w14.hebrewSummary}`);
    }

    const w13t = hTone(w13), w14t = hTone(w14), jt = hTone(judge);
    if (w13 && w14 && jt !== 0) {
      const eitherOpp = (jt > 0 && (w13t < 0 || w14t < 0)) || (jt < 0 && (w13t > 0 || w14t > 0));
      if (eitherOpp) {
        wLines.push('לפי חאוי: גם כשהעדים מנוגדים לדיין — הדיין הוא הקובע. הניגוד מלמד שיש כוחות בלוח שמעכבים, והדרך תהיה פחות ישירה.');
      }
    }

    if (wLines.length) push(wLines.join('\n'));
  }

  // ── 2.5. SENTENCE (H16 — עאקבה) ─────────────────────────────────
  if (sentence) {
    const fig     = hFig(sentence);
    const fort    = hFort(sentence);
    const transit = hTransit(sentence);
    const tone    = hTone(sentence);
    const jTone   = hTone(judge);
    const confirm = (jTone !== 0 && tone !== 0)
      ? ((jTone > 0 && tone > 0) || (jTone < 0 && tone < 0) ? 'מאשרת את הדיין' : 'מנוגדת לדיין')
      : null;

    const parts = [];
    parts.push(`עאקבה (בית 16 — ${fig}${fort ? `, ${fort}` : ''}): אחרית הדין.`);
    if (confirm) parts.push(`[${confirm}]`);
    if (transit) parts.push(`חאוי: ${transit}`);
    push(parts.join(' '));
  }

  // ── 2.7. ELEMENT YES/NO (ספירת יסודות) ─────────────────────────
  if (result.elementYesNo) {
    push(`ספירת יסודות (כן/לא): ${result.elementYesNo.hebrewSummary}`);
  }

  // ── 2.8. FIGURE × HOUSE INTERACTIONS (מזל מחוזק/מוחלש) ─────────
  {
    const interactionLines = [];
    for (const h of (boardAnalysis.houses || [])) {
      const ix = h.figureHouseInteraction;
      if (!ix) continue;
      const num = Number(h.house);
      if (num >= 13) continue; // witnesses/judge handled separately
      const fig = hFig(h);
      if (!fig) continue;
      if (ix.code !== 'mixed' && ix.code !== 'neutral-good' && ix.code !== 'neutral-bad') {
        interactionLines.push(`בית ${num} (${fig}): ${ix.hebrewLabel} — ${ix.note}`);
      }
    }
    if (interactionLines.length) {
      push('שילוב צורה × בית:\n' + interactionLines.join('\n'));
    }
  }

  // ── 3. H1 — THE QUESTIONER ──────────────────────────────────────
  if (h1) {
    const fig = hFig(h1), fort = hFort(h1), transit = hTransit(h1), speak = speakNote(h1);
    const nameLabel = name || 'השואל';
    const profile = formatClientProfile(clientContext);
    const parts = [];

    parts.push(`${nameLabel} (בית 1): ${fig}${hHazz(h1)}${hMeta(h1)}${fort ? `, ${fort}` : ''}.`);
    if (profile) parts.push(`פרופיל: ${profile}.`);
    if (speak)   parts.push(`בית 1 ${speak}.`);
    if (transit) parts.push(`חאוי: ${transit}`);
    if (h1.seekerSoughtHebrew) parts.push(`מצב השואל: ${h1.seekerSoughtHebrew}.`);

    push(parts.join(' '));
  }

  // ── 4. FOCUS HOUSE ───────────────────────────────────────────────
  if (focus && Number(focus.house) !== 1 && Number(focus.house) !== 15) {
    const fig = hFig(focus), fort = hFort(focus), transit = hTransit(focus), speak = speakNote(focus);
    const label = TOPIC_FOCUS_LABEL[topicId] || `הבית המרכזי (בית ${focusNum})`;
    const parts = [];

    parts.push(`${label}: ${fig}${hHazz(focus)}${hMeta(focus)}${fort ? `, ${fort}` : ''}.`);
    if (speak)   parts.push(`${speak}.`);
    if (transit) parts.push(`חאוי: ${transit}`);
    if (focus.seekerSoughtHebrew) parts.push(`מצב הנדרש: ${focus.seekerSoughtHebrew}.`);

    push(parts.join(' '));
  }

  // ── 5. ADDITIONAL MAIN HOUSES ────────────────────────────────────
  const skipNums = new Set([1, 13, 14, 15, 16, Number(focusNum)].filter(Boolean));
  const addHouses = (boardAnalysis.houses || []).filter((h) => !skipNums.has(Number(h.house)));

  if (addHouses.length) {
    const addLines = [];
    for (const h of addHouses) {
      const fig = hFig(h), fort = hFort(h), transit = hTransit(h), speak = speakNote(h);
      if (!fig && !fort) continue;
      let line = `בית ${h.house}: ${fig}${hHazz(h)}${fort ? `, ${fort}` : ''}`;
      if (speak)   line += ` [${speak}]`;
      if (transit) line += `. חאוי: ${transit}`;
      addLines.push(line);
    }
    if (addLines.length) push(addLines.join('\n'));
  }

  // ── 6. ITTISALAT — CONNECTION CHECK ─────────────────────────────
  const ittisalat = boardAnalysis.ittisalat;
  if (ittisalat) {
    const q2f = ittisalat.questioner_to_focus;
    const q2j = ittisalat.questioner_to_judge;
    const lines = [];

    if (q2f && Number(focusNum) !== 1) {
      if (q2f.type !== 'none') {
        lines.push(`חיבור בין בית 1 לבית ${focusNum}: ${q2f.hebrewShort}${q2f.quality ? ` (${q2f.quality})` : ''}.`);
      } else {
        lines.push(`אין חיבור בין בית 1 לבית ${focusNum} — גם אם הדיין חיובי, הדבר עלול לא להגיע בלי גורם מחבר.`);
      }
    }
    if (q2j && q2j.type !== 'none' && Number(focusNum) !== 15) {
      lines.push(`קשר בין בית 1 לדיין: ${q2j.hebrewShort}.`);
    }

    if (lines.length) push(lines.join(' '));
  }

  // ── 7. TAHASIL ───────────────────────────────────────────────────
  push(tahasilParagraph(boardAnalysis));

  // ── 8. DHAMIR ────────────────────────────────────────────────────
  push(dhamirParagraph(boardAnalysis, judgeVerdict));

  // ── 9. TOPIC RULES (חוקי חאוי לנושא) ────────────────────────────
  const checks = (boardAnalysis.topicConnections?.checks || []);
  if (checks.length) {
    const ruleLines = checks.map((c) => c.hebrewShort);
    push('בדיקות חאוי לנושא:\n' + ruleLines.join('\n'));
  }

  // ── 10. ניתוח ספציפי לפי כשף — תפקידי בתים (Task 11) ─────────────
  const roles = boardAnalysis.specificRolesHebrew || [];
  if (roles.length) {
    push('ניתוח בתים לפי כשף אל-אסראר:\n' + roles.join('\n'));
  }

  // ── 11. תובנה מספר הכשף שער שישי (Task 10) ──────────────────────
  const kbi = boardAnalysis.kashfBookInsight;
  if (kbi?.firstExcerpt) {
    push(`מקור — ${kbi.sourceRef}:\n${kbi.firstExcerpt}`);
  }

  return paras.length ? paras.join('\n\n') : null;
}

// ─── SPIRITUAL DIAGNOSTICS NARRATIVE ────────────────────────────────────────

function isJinnRelatedDiagnosis(sd) {
  if (!sd) return false;
  const r = sd.isqatResult?.remainder;
  if (r === 1 || r === 3) return true;
  const matches = [...(sd.specificMatches || []), ...(sd.openingMatches || [])];
  return matches.some((m) =>
    (m.diagnosisHebrew || '').includes('ג׳ין') ||
    (m.diagnosisHebrew || '').includes('אחיזה') ||
    (m.diagnosisHebrew || '').includes('קרין') ||
    (m.meaningHebrew   || '').includes('ג׳ין') ||
    (m.meaningHebrew   || '').includes('אחיזה') ||
    (m.meaningHebrew   || '').includes('קרין')
  );
}

function buildSpiritualNarrative(result) {
  const { boardAnalysis, spiritualDiagnosis, judgeVerdict, clientContext, kashfVerdict, kashfSupportAnalysis } = result;
  if (!boardAnalysis?.hasBoard) return null;

  const sd    = spiritualDiagnosis || {};
  const name  = clean(clientContext?.clientName || '');
  const paras = [];
  const push  = (p) => { if (p && clean(p)) paras.push(clean(p)); };

  // האבחון הרוחני המפורט הוא הסמכות לנושא זה — הכשף (2 בתים בלבד) אינו מתאים

  const hFig     = (h) => clean(h?.figureHebrew || '');
  const hFort    = (h) => clean(h?.fortune || '');
  const hTransit = (h) => clean(h?.transit?.meaning || '');

  const judge = boardAnalysis.judge        || getHouseFromBoard(boardAnalysis, 15);
  const w13   = boardAnalysis.witnesses?.[0] || getHouseFromBoard(boardAnalysis, 13);
  const w14   = boardAnalysis.witnesses?.[1] || getHouseFromBoard(boardAnalysis, 14);
  const h1    = getHouseFromBoard(boardAnalysis, 1);
  const h4    = getHouseFromBoard(boardAnalysis, 4);
  const h6    = getHouseFromBoard(boardAnalysis, 6);
  const h8    = getHouseFromBoard(boardAnalysis, 8);
  const h9    = getHouseFromBoard(boardAnalysis, 9);
  const h12   = getHouseFromBoard(boardAnalysis, 12);

  // Pre-build match map for inline display in spiritual houses
  const allMatches  = [...(sd.specificMatches || []), ...(sd.openingMatches || [])];
  const matchByHouse = {};
  for (const m of allMatches) {
    const n = Number(m.house);
    if (!isNaN(n)) {
      if (!matchByHouse[n]) matchByHouse[n] = [];
      matchByHouse[n].push(m);
    }
  }
  const seenBaseIds = new Set();

  // ── 1. OVERALL GRADE ─────────────────────────────────────────────
  {
    const gradeMap = {
      'strong-suspicion': 'הלוח מראה סימנים חזקים לפגיעה רוחנית.',
      'medium-suspicion': 'הלוח מראה חשד בינוני לפגיעה רוחנית — ייתכן שיש משהו, אך אין הכרעה חד-משמעית.',
      'weak-suspicion':   'הלוח מראה סימנים חלשים בלבד — אין הכרעה ברורה לכאן או לכאן.',
      'mostly-clear':     'הלוח אינו מראה סימנים ברורים לפגיעה רוחנית.',
      'mixed':            'הלוח מעורב — יש לבדוק את הפרטים לפני כל הכרעה.',
    };
    const namePrefix = name ? `${name} — ` : '';
    push(`${namePrefix}${gradeMap[sd.grade] || gradeMap['mixed']}`);
  }

  // ── 2. JUDGE (H15) — transit relevant here (outcome meaning) ─────
  if (judge) {
    const fig     = hFig(judge);
    const fort    = hFort(judge);
    const transit = hTransit(judge);
    const speak   = speakNote(judge);
    const tone    = figureFortuneTone(judge?.fortune);
    const toneWord = tone > 0 ? 'חיובית' : tone < 0 ? 'שלילית' : 'מעורבת';
    const parts = [];
    parts.push(`הדיין (בית 15): ${fig}${fort ? `, ${fort}` : ''} — פסיקה ${toneWord}.`);
    if (speak)   parts.push(`הדיין ${speak}.`);
    if (transit) parts.push(`חאוי: ${transit}`);
    push(parts.join(' '));
  }

  // ── 3. WITNESSES — agree/oppose only, no topic-specific transit ───
  {
    const jTone  = figureFortuneTone(judge?.fortune);
    const wLines = [];

    const descW = (w, label, num) => {
      if (!w) return;
      const fig   = hFig(w);
      const fort  = hFort(w);
      const speak = speakNote(w);
      const tone  = figureFortuneTone(w?.fortune);
      const agreeNote = jTone !== 0
        ? (((jTone > 0 && tone > 0) || (jTone < 0 && tone < 0)) ? 'מחזק את הדיין' : 'מנוגד לדיין')
        : null;
      let line = `${label} (בית ${num}): ${fig}${fort ? `, ${fort}` : ''}`;
      if (speak)     line += `, ${speak}`;
      if (agreeNote) line += ` [${agreeNote}]`;
      wLines.push(line);
    };

    descW(w13, 'עד ראשון', 13);
    descW(w14, 'עד שני', 14);
    if (wLines.length) push(wLines.join('\n'));
  }

  // ── 4. H1 — PATIENT (no transit — generic transits not relevant) ──
  if (h1) {
    const fig     = hFig(h1);
    const fort    = hFort(h1);
    const speak   = speakNote(h1);
    const nameLabel = name || 'השואל';
    const profile   = formatClientProfile(clientContext);
    const parts     = [];
    parts.push(`${nameLabel} (בית 1 — החולה): ${fig}${fort ? `, ${fort}` : ''}.`);
    if (profile) parts.push(`פרופיל: ${profile}.`);
    if (speak)   parts.push(`בית 1 ${speak}.`);
    push(parts.join(' '));
  }

  // ── 5. SPIRITUAL HOUSES — source rules instead of generic transit ─
  {
    const shDefs = [
      { h: h6,  role: 'בית המחלה',   num: 6  },
      { h: h9,  role: 'בית המכשף',   num: 9  },
      { h: h4,  role: 'בית התרופה',  num: 4  },
      { h: h8,  role: 'בית הגוף',    num: 8  },
      { h: h12, role: 'בית האויבים', num: 12 },
    ];
    const shLines = [];
    for (const { h, role, num } of shDefs) {
      if (!h || !hFig(h)) continue;
      const fig   = hFig(h);
      const fort  = hFort(h);
      const speak = speakNote(h);
      let line = `${role} (בית ${num}): ${fig}${fort ? `, ${fort}` : ''}`;
      if (speak) line += ` [${speak}]`;

      // Show source-based rule meaning instead of generic Hawi transit
      const houseMatches = matchByHouse[num] || [];
      const ruleTexts = [];
      for (const m of houseMatches) {
        const baseId = String(m.ruleId || '').replace(/-h\d+$/, '');
        if (!seenBaseIds.has(baseId)) {
          seenBaseIds.add(baseId);
          const txt = clean(m.meaningHebrew || m.diagnosisHebrew || '');
          if (txt) ruleTexts.push(txt);
        }
      }
      if (ruleTexts.length) line += '\n  → ' + ruleTexts.join(' ');
      shLines.push(line);
    }
    if (shLines.length) push(shLines.join('\n'));
  }

  // ── 6. DIAGNOSTIC METHODS ─────────────────────────────────────────
  {
    const isqat  = sd.isqatResult;
    const jinn   = sd.jinnTypeResult;
    const organ  = sd.organDiagnosisResult;
    const dParts = [];

    if (isqat?.hebrewText) {
      dParts.push(
        `ספירת הנקודות הפתוחות בלוח (שיטת 7×7): ${isqat.openCount} נקודות — שאר ${isqat.remainder}.\n${isqat.hebrewText}`
      );
    }

    if (isJinnRelatedDiagnosis(sd) && jinn?.hebrewText) {
      dParts.push(`סוג הג׳ין (15×4 — לפי יסוד הדיין): ${jinn.hebrewText}`);
    }

    const isPhysical = (isqat?.remainder ?? 0) >= 4;
    if ((isPhysical || !isqat) && organ?.hebrewText) {
      dParts.push(
        `סוג המחלה הגופנית (יסוד בית 6 ובית 8): ${organ.hebrewText}${organ.organHebrew ? ` — איבר: ${organ.organHebrew}` : ''}`
      );
    }

    if (dParts.length) push(dParts.join('\n'));
  }

  // ── 7. ITTISALAT ──────────────────────────────────────────────────
  const ittisalat = boardAnalysis.ittisalat;
  if (ittisalat) {
    const q2f  = ittisalat.questioner_to_focus;
    const q2j  = ittisalat.questioner_to_judge;
    const fNum = boardAnalysis.focusHouseNumber;
    const iLines = [];

    if (q2f && fNum) {
      if (q2f.type !== 'none') {
        iLines.push(
          `חיבור בין השואל לבית המחלה (בית ${fNum}): ${q2f.hebrewShort}${q2f.quality ? ` (${q2f.quality})` : ''}.`
        );
      } else {
        iLines.push(`אין חיבור ישיר בין השואל לבית המחלה (בית ${fNum}).`);
      }
    }
    if (q2j && q2j.type !== 'none') {
      iLines.push(`קשר בין השואל לדיין: ${q2j.hebrewShort}.`);
    }
    if (iLines.length) push(iLines.join(' '));
  }

  // ── 8. TAHASIL ───────────────────────────────────────────────────
  push(tahasilParagraph(boardAnalysis));

  // ── 9. DHAMIR ────────────────────────────────────────────────────
  push(dhamirParagraph(boardAnalysis, judgeVerdict));

  // ── 10. REMAINING MATCHES (not yet shown in spiritual houses) ────
  const SPIRITUAL_HOUSE_NUMS = new Set([4, 6, 8, 9, 12]);
  const remainingMatches = allMatches.filter((m) => {
    if (SPIRITUAL_HOUSE_NUMS.has(Number(m.house))) return false;
    const baseId = String(m.ruleId || '').replace(/-h\d+$/, '');
    return !seenBaseIds.has(baseId);
  });
  if (remainingMatches.length) {
    const mLines = remainingMatches.map((m) => {
      const pos = m.house === 15 ? 'הדיין'
                : m.house === 13 ? 'עד ראשון'
                : m.house === 14 ? 'עד שני'
                : m.house != null ? `בית ${m.house}`
                : m.role || '';
      const fig     = m.figureHebrew ? ` (${m.figureHebrew})` : '';
      const meaning = clean(m.meaningHebrew || m.diagnosisHebrew || '');
      return meaning ? `${pos}${fig}: ${meaning}` : null;
    }).filter(Boolean);
    if (mLines.length) push('סימנים נוספים מהמקור:\n' + mLines.join('\n'));
  }

  return paras.length ? paras.join('\n\n') : null;
}

// ─── SHORT CLIENT VERDICT — topic-aware, 3-6 sentence answer ─────────────────
// This is the always-visible verdict. It answers the SPECIFIC question the
// client asked, not a generic positive/negative/mixed.

export function writeShortClientVerdict(result) {
  const { topicId, boardAnalysis, judgeVerdict: jv, kashfVerdict, kashfSupportAnalysis, clientContext } = result;

  if (!boardAnalysis?.hasBoard) return null;
  if (topicId === 'spiritualDiagnostics') return null;

  const name     = clean(clientContext?.clientName || '');
  const quesited = clean(clientContext?.quesitedName || '');
  const lines    = [];

  const judge    = boardAnalysis.judge    || getHouseFromBoard(boardAnalysis, 15);
  const h1       = getHouseFromBoard(boardAnalysis, 1);
  const jTone    = figureFortuneTone(judge?.fortune);

  const kashfText  = kashfVerdict?.verdictHebrew || '';
  const confLevel  = kashfSupportAnalysis?.confidence?.level || '';

  function fortHebrew(h) {
    const f = h?.fortune || '';
    if (f.includes('סעד')) return 'סימן טוב';
    if (f.includes('נחס')) return 'סימן קשה';
    return 'סימן ממוזג';
  }

  function figLine(h, label) {
    if (!h) return '';
    return `${label}: "${h.figureHebrew || ''}" — ${fortHebrew(h)}.`;
  }

  switch (topicId) {

    case 'theft': {
      const h7 = getHouseFromBoard(boardAnalysis, 7);
      const nameLetters = boardAnalysis.nameLetters || [];
      const h7Letters   = nameLetters.find(n => n.houseNumber === 7);
      const isIncoming  = h7?.directionHebrew === 'נכנס';
      const isOutgoing  = h7?.directionHebrew === 'יוצא';

      if (h7) lines.push(`הגנב מיוצג בלוח על ידי "${h7.figureHebrew || ''}" (בית 7) — ${fortHebrew(h7)}.`);
      if (isIncoming) lines.push('הצורה נכנסת — הגנב עדיין בסביבתך ולא רחק.');
      else if (isOutgoing) lines.push('הצורה יוצאת — הגנב כבר התרחק ממקומו.');
      if (h7Letters?.letters?.length > 0) lines.push(`שמו מתחיל ב: ${h7Letters.letters.join(' / ')}.`);
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין נוטה לחיוב — יש סיכוי לאתר את החפץ הגנוב.');
      else if (jTone < 0) lines.push('הדיין פוסק לשלילה — קשה להחזיר את החפץ.');
      else lines.push('הדיין ממוזג — אפשרות החזרה לא ברורה.');
      break;
    }

    case 'missingPerson': {
      const h7 = getHouseFromBoard(boardAnalysis, 7);
      const qSubj = quesited || 'הנעדר';
      const isIncoming = h7?.directionHebrew === 'נכנס';
      const isOutgoing = h7?.directionHebrew === 'יוצא';

      if (h7) {
        const h7Tone = figureFortuneTone(h7.fortune);
        const statusNote = h7Tone > 0 ? 'בחיים, מצב לא גרוע' : h7Tone < 0 ? 'מצב קשה או סכנה' : 'מצב לא ברור';
        lines.push(`${qSubj} מיוצג/ת בלוח על ידי "${h7.figureHebrew || ''}" (בית 7) — ${statusNote}.`);
      }
      if (isIncoming) lines.push('הצורה נכנסת — יש סיכוי לחזרה, הנעדר לא רחוק.');
      else if (isOutgoing) lines.push('הצורה יוצאת — הנעדר התרחק, החזרה פחות קרובה.');
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: יש תקווה לחזרה.');
      else if (jTone < 0) lines.push('הדיין: אין סימן ברור לחזרה.');
      else lines.push('הדיין ממוזג — הלוח לא מכריע לגבי החזרה.');
      break;
    }

    case 'illness': {
      const h6 = getHouseFromBoard(boardAnalysis, 6);
      const h8 = getHouseFromBoard(boardAnalysis, 8);
      const qSubj = quesited || name || 'החולה';

      if (h1) lines.push(figLine(h1, `${qSubj} (בית 1)`));
      if (h6) lines.push(figLine(h6, 'המחלה (בית 6)'));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: פסיקה חיובית — יש נטייה להחלמה.');
      else if (jTone < 0) lines.push('הדיין: פסיקה קשה — המחלה חמורה, יש לנקוט זהירות.');
      else lines.push('הדיין ממוזג — ההחלמה לא ודאית.');
      if (h8 && figureFortuneTone(h8.fortune) < 0) lines.push(`⚠ בית הסכנה (בית 8 — "${h8.figureHebrew}") — יש לשים לב לסימן סכנה.`);
      break;
    }

    case 'marriage': {
      const h7 = getHouseFromBoard(boardAnalysis, 7);
      const qSubj = quesited || 'הצד השני';
      const ittisal = boardAnalysis.ittisalat?.questioner_to_focus;

      if (h7) lines.push(figLine(h7, `${qSubj} (בית 7)`));
      if (ittisal && ittisal.type !== 'none') lines.push(`חיבור בין הצדדים: ${ittisal.hebrewShort}.`);
      else if (ittisal) lines.push('אין חיבור ישיר בין הצדדים בלוח — עיכוב אפשרי.');
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: הנישואין יתממשו — הלוח נוטה לחיוב.');
      else if (jTone < 0) lines.push('הדיין: יש מניעה — הנישואין לא סביר שיתממשו בקרוב.');
      else lines.push('הדיין ממוזג — הנישואין אפשריים, אך לא ודאיים.');
      break;
    }

    case 'disputes': {
      const h7 = getHouseFromBoard(boardAnalysis, 7);
      const qSubj = quesited || 'היריב';
      const h1Tone = figureFortuneTone(h1?.fortune);
      const h7Tone = figureFortuneTone(h7?.fortune);

      if (h1) lines.push(figLine(h1, `${name || 'השואל'} (בית 1)`));
      if (h7) lines.push(figLine(h7, `${qSubj} (בית 7 — היריב)`));
      if (h1Tone > h7Tone) lines.push('השואל במצב חזק יותר מהיריב בלוח.');
      else if (h1Tone < h7Tone) lines.push('היריב במצב חזק יותר — יש לשקול עמדות.');
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: הכרעה לטובת השואל — הסיכויים לצדו.');
      else if (jTone < 0) lines.push('הדיין: הכרעה לרעת השואל — יש לשקול פשרה.');
      else lines.push('הדיין ממוזג — ייתכן פשרה, אין הכרעה חדה.');
      break;
    }

    case 'travel':
    case 'seaVoyage': {
      const h9 = getHouseFromBoard(boardAnalysis, 9);
      const h8 = getHouseFromBoard(boardAnalysis, 8);
      const label = topicId === 'seaVoyage' ? 'מסע הים (בית 9)' : 'המסע (בית 9)';

      if (h9) lines.push(figLine(h9, label));
      if (h8 && figureFortuneTone(h8.fortune) < 0) lines.push(`⚠ בית 8 (${h8.figureHebrew}) — יש סימן לסכנה בדרך.`);
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: המסע בטוח — אפשר לצאת.');
      else if (jTone < 0) lines.push('הדיין: יש סכנה — כדאי לדחות את המסע.');
      else lines.push('הדיין ממוזג — המסע אפשרי, אך יש לבדוק תנאים.');
      break;
    }

    case 'childrenPregnancy': {
      const h5 = getHouseFromBoard(boardAnalysis, 5);

      if (h5) lines.push(figLine(h5, 'בית הילדים (בית 5)'));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: יש נטייה לחיוב — הריון או ילד אפשרי.');
      else if (jTone < 0) lines.push('הדיין: יש עיכוב — ההריון לא קרוב כרגע.');
      else lines.push('הדיין ממוזג — ייתכן הריון, אך לא ברור מתי.');
      break;
    }

    case 'deathInheritance': {
      const h8 = getHouseFromBoard(boardAnalysis, 8);
      const h2 = getHouseFromBoard(boardAnalysis, 2);

      if (h8) lines.push(figLine(h8, 'בית המוות והירושה (בית 8)'));
      if (h2) lines.push(figLine(h2, 'הממון / הירושה (בית 2)'));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: פסיקה חיובית — סכנת המוות נמוכה. הירושה זמינה.');
      else if (jTone < 0) lines.push('הדיין: פסיקה קשה — יש סכנה ממשית. הירושה עלולה להיות מסובכת.');
      else lines.push('הדיין ממוזג — המצב לא ברור, יש לעקוב.');
      break;
    }

    case 'partnership': {
      const h7 = getHouseFromBoard(boardAnalysis, 7);
      const qSubj = quesited || 'השותף';

      if (h1) lines.push(figLine(h1, `${name || 'השואל'} (בית 1)`));
      if (h7) lines.push(figLine(h7, `${qSubj} (בית 7)`));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: השותפות תצלח — יש כיוון חיובי.');
      else if (jTone < 0) lines.push('הדיין: השותפות מסוכנת — יש לנהוג בזהירות.');
      else lines.push('הדיין ממוזג — השותפות אפשרית, אך יש לבדוק תנאים.');
      break;
    }

    case 'enemies': {
      const h7  = getHouseFromBoard(boardAnalysis, 7);
      const h12 = getHouseFromBoard(boardAnalysis, 12);
      const qSubj = quesited || 'האויב';
      const h1Tone = figureFortuneTone(h1?.fortune);
      const h7Tone = figureFortuneTone(h7?.fortune);

      if (h7) lines.push(figLine(h7, `${qSubj} (בית 7)`));
      if (h12 && figureFortuneTone(h12.fortune) < 0) lines.push(`⚠ בית 12 (${h12.figureHebrew}) — אויב נסתר חזק.`);
      if (h1Tone > h7Tone) lines.push('השואל חזק יותר מהאויב בלוח.');
      else if (h1Tone < h7Tone) lines.push('האויב חזק יותר — יש לנהוג בזהירות.');
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: הסכנה מהאויב מוגבלת — יש הגנה.');
      else if (jTone < 0) lines.push('הדיין: האויב בעמדה חזקה — יש לנקוט הגנה ממשית.');
      else lines.push('הדיין ממוזג — יש לעקוב אחר מצב האויב.');
      break;
    }

    case 'fear': {
      const h12 = getHouseFromBoard(boardAnalysis, 12);

      if (h12) lines.push(figLine(h12, 'מקור הפחד (בית 12)'));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: הפחד לא מבוסס לחלוטין — הסכנה קטנה מהמדומה.');
      else if (jTone < 0) lines.push('הדיין: יש ממשות לפחד — יש לנקוט זהירות ממשית.');
      else lines.push('הדיין ממוזג — יש אמת חלקית בפחד, אך לא כולו ממשי.');
      break;
    }

    case 'commerce': {
      const h2  = getHouseFromBoard(boardAnalysis, 2);
      const h10 = getHouseFromBoard(boardAnalysis, 10);

      if (h2)  lines.push(figLine(h2, 'הממון (בית 2)'));
      if (h10) lines.push(figLine(h10, 'תוצאת העסקה (בית 10)'));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: עסקה מומלצת — יש נטייה לרווח.');
      else if (jTone < 0) lines.push('הדיין: עסקה מסוכנת — הפסד אפשרי.');
      else lines.push('הדיין ממוזג — יש לבדוק תנאים לפני עסקה.');
      break;
    }

    case 'loveHate': {
      const h7 = getHouseFromBoard(boardAnalysis, 7);
      const qSubj = quesited || 'הצד השני';

      if (h1) lines.push(figLine(h1, `${name || 'השואל'} (בית 1)`));
      if (h7) lines.push(figLine(h7, `${qSubj} (בית 7)`));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: יש קרבה וחיבה — הקשר חיובי.');
      else if (jTone < 0) lines.push('הדיין: יש שנאה או ניתוק — הקשר מאתגר.');
      else lines.push('הדיין ממוזג — הרגש מעורב משני הצדדים.');
      break;
    }

    case 'completion': {
      const tahasil = boardAnalysis.tahasil;

      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: הדבר יושלם — הלוח נוטה לחיוב.');
      else if (jTone < 0) lines.push('הדיין: הדבר לא יושלם — יש מניעה.');
      else lines.push('הדיין ממוזג — השלמת הדבר לא ודאית.');
      if (tahasil?.tahasilHebrew) lines.push(`בדיקת ההגעה: ${tahasil.tahasilHebrew}.`);
      break;
    }

    case 'hiddenTreasure': {
      const h4 = getHouseFromBoard(boardAnalysis, 4);
      const tl = boardAnalysis?.treasureLocation;

      if (tl?.presenceHebrew) lines.push(tl.presenceHebrew);
      if (h4) lines.push(figLine(h4, 'מיקום אפשרי (בית 4)'));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: הדבר החבוי קיים ויש גישה אפשרית.');
      else if (jTone < 0) lines.push('הדיין: הדבר החבוי חסום — קשה להגיע אליו.');
      else lines.push('הדיין ממוזג — קיומו ונגישותו לא ברורים.');
      break;
    }

    case 'prisoner': {
      const h12 = getHouseFromBoard(boardAnalysis, 12);
      const h5  = getHouseFromBoard(boardAnalysis, 5);

      if (h12) lines.push(figLine(h12, 'הכלא (בית 12)'));
      if (h5)  lines.push(figLine(h5, 'גורל האסיר (בית 5)'));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: יש סיכוי לשחרור.');
      else if (jTone < 0) lines.push('הדיין: המאסר ימשך — אין סימן ברור ליציאה.');
      else lines.push('הדיין ממוזג — גורל האסיר לא ברור.');
      break;
    }

    case 'siblings': {
      const h3 = getHouseFromBoard(boardAnalysis, 3);
      const qSubj = quesited || 'האח/השכן';

      if (h3) lines.push(figLine(h3, `${qSubj} (בית 3)`));
      if (h1) lines.push(figLine(h1, `${name || 'השואל'} (בית 1)`));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: הקשר חיובי — יש שיתוף פעולה ועזרה.');
      else if (jTone < 0) lines.push('הדיין: הקשר קשה — יש מחלוקת או ריחוק.');
      else lines.push('הדיין ממוזג — הקשר בינוני, אין הכרעה ברורה.');
      break;
    }

    case 'yearlyForecast': {
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('השנה: מבטיחה בכלל — הכיוון הכללי לטובה.');
      else if (jTone < 0) lines.push('השנה: קשה — יש להיזהר ולחסוך.');
      else lines.push('השנה: מעורבת — יש תקופות טובות וקשות.');
      const yearly = boardAnalysis.yearlyForecastAnalysis;
      if (yearly?.outputHebrew) {
        const firstLine = yearly.outputHebrew.split('\n')[0];
        if (firstLine) lines.push(firstLine);
      }
      break;
    }

    case 'authorityState': {
      const h10 = getHouseFromBoard(boardAnalysis, 10);

      if (h10) lines.push(figLine(h10, 'בית הסמכות / התפקיד (בית 10)'));
      if (h1)  lines.push(figLine(h1, `${name || 'השואל'} (בית 1)`));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: התפקיד יציב — אין סכנה ממשית.');
      else if (jTone < 0) lines.push('הדיין: התפקיד בסכנה — יש לנהוג בזהירות.');
      else lines.push('הדיין ממוזג — מצב התפקיד לא ברור.');
      break;
    }

    case 'birthNativity': {
      if (h1) lines.push(figLine(h1, `${name || 'השואל'} (בית 1 — הטאלע)`));
      if (kashfText) lines.push(kashfText);
      else if (jTone > 0) lines.push('הדיין: גורל חיובי — הכוחות בתקופה זו לטובה.');
      else if (jTone < 0) lines.push('הדיין: גורל קשה — יש קשיים בתקופה זו.');
      else lines.push('הדיין ממוזג — גורל מאוזן בתקופה זו.');
      break;
    }

    default: {
      if (h1) lines.push(figLine(h1, `${name || 'השואל'} (בית 1)`));
      if (kashfText) lines.push(kashfText);
      else if (jv?.hebrewShort) lines.push(`הדיין: ${jv.hebrewShort}`);
      else if (jTone > 0) lines.push('הדיין פוסק לחיוב.');
      else if (jTone < 0) lines.push('הדיין פוסק לשלילה.');
      else lines.push('הדיין ממוזג — אין הכרעה חד-משמעית.');
      break;
    }
  }

  // Confidence warning
  if (confLevel === 'weak') {
    lines.push('⚠ הפסיקה מוחלשת — רוב הכוחות בלוח מתנגדים לה. יש לנהוג בזהירות.');
  } else if (confLevel === 'mixed') {
    lines.push('⚠ יש כוחות מנוגדים בלוח — הפסיקה נכונה אך לא בוודאות מלאה.');
  }

  return lines.filter(l => l !== undefined && l !== null).join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────

export function writeHumanGoralConclusion(result) {
  const topicId = result.topicId;
  const topicHebrew = result.topicHebrew;
  const grade = result.boardScore?.grade || 'mixed';
  const isSpiritualTopic = topicId === 'spiritualDiagnostics';
  const judgeVerdict = result.judgeVerdict || result.boardScore?.judgeVerdict || null;
  const question = clean(result.question);

  // ── Narrative path (client-facing text) ─────────────────────────
  if (!isSpiritualTopic) {
    const narrative = buildNarrativeByTopic(result);
    if (narrative && clean(narrative)) return narrative;
  }

  // ── Spiritual diagnostics: full narrative format ────────────────
  if (isSpiritualTopic) {
    const narrative = buildSpiritualNarrative(result);
    if (narrative && clean(narrative)) return narrative;
    return clientContextParagraph(result.clientContext, question) ||
           'לא התקבל לוח מלא — לא ניתן לפסוק ללא לוח.';
  }

  // ── Fallback: technical format (no board or unknown topic) ───────
  const isMiQuestion = /^מי[\s,]/.test(question);
  let verdictParagraph = '';
  if (topicId === 'theft') {
    const house7 = result.boardAnalysis?.houses?.find(h => Number(h.house) === 7);
    const house7Fig = house7?.figureHebrew || '';
    const isIncoming = house7?.directionHebrew === 'נכנס';
    const isOutgoing = house7?.directionHebrew === 'יוצא';
    const dirNote = isIncoming ? ' — צורה נכנסת, הגנב עדיין בסביבה'
                  : isOutgoing ? ' — צורה יוצאת, הגנב כבר עזב' : '';
    if (grade === 'positive' || grade === 'cautiously-positive') {
      verdictParagraph = `הלוח נוטה לטובה — יש סיכוי לגלות את הגנב ולאתר את החפץ. בית 7 (${house7Fig}${dirNote}) מציין את הגנב — פרטים בהמשך.`;
    } else if (grade === 'negative' || grade === 'cautiously-negative') {
      verdictParagraph = `הלוח מצביע על קושי — החפץ עלול לא לחזור. בית 7 (${house7Fig}${dirNote}) מציין את הגנב — פרטים בהמשך.`;
    } else {
      verdictParagraph = `הלוח מעורב — אפשרות החזרת החפץ אינה ברורה. בית 7 (${house7Fig}${dirNote}) מציין את הגנב — פרטים בהמשך.`;
    }
  } else if (isMiQuestion && topicId === 'enemies') {
    const house7 = result.boardAnalysis?.houses?.find(h => h.house === 7);
    const house7Fig = house7?.figureHebrew || '';
    verdictParagraph = (grade === 'positive' || grade === 'cautiously-positive')
      ? `הלוח מאפשר זיהוי — יש סיכוי לגלות את מי שעומד מאחורי הגניבה או הפגיעה. בית 7${house7Fig ? ` (${house7Fig})` : ''} מציין את הגנב — פרטים בהמשך.`
      : `הלוח מצביע על קושי בזיהוי — הגנב נסתר או קשה לאיתור. בית 7${house7Fig ? ` (${house7Fig})` : ''} מציין את הגנב — פרטים בהמשך.`;
  } else if (judgeVerdict?.hebrewFull) {
    verdictParagraph = judgeVerdict.hebrewFull;
  } else if (result.boardScore?.hebrew) {
    verdictParagraph = result.boardScore.hebrew;
  }

  const elementYesNo = result.elementYesNo || null;
  const elementParagraph = elementYesNo
    ? `ספירת יסודות (כן/לא): ${elementYesNo.hebrewSummary}`
    : '';

  const paragraphs = [
    clientContextParagraph(result.clientContext, question),
    clientHistoryParagraph(result.clientHistorySummary),
    boardScoreParagraph(result.boardAnalysis),
    verdictParagraph,
    elementParagraph,
    dhamirParagraph(result.boardAnalysis, judgeVerdict),
    tahasilParagraph(result.boardAnalysis),
    topicOpening(topicId, topicHebrew),
    questionFocusParagraph(topicId, result.clientContext),
    describeCoreHouses(result.boardAnalysis, topicId, question),
    spiritualParagraph(result.spiritualDiagnosis, topicId),
    recommendationByTopic(topicId, grade, result.boardAnalysis, question),
  ].filter((p) => clean(p));

  return paragraphs.join('\n\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// writeClientReadingHebrew — נרטיב נקי ללקוח, ללא מינוח טכני
// ─────────────────────────────────────────────────────────────────────────────

function fortToWord(fortune) {
  if (!fortune) return 'מעורב';
  if (fortune.includes('סעד')) return 'טוב';
  if (fortune.includes('נחס')) return 'קשה';
  return 'מעורב';
}

function essenceOf(h) {
  if (!h) return '';
  return FIGURE_ESSENCE[h.figureHebrew] || h.figureHebrew || '';
}

function firstSentence(text) {
  if (!text) return '';
  // Strip Arabic characters so they don't appear in client-facing text
  const noArabic = text.replace(/[؀-ۿݐ-ݿ]+/g, '').replace(/\s{2,}/g, ' ').trim();
  return noArabic.split(/[.;\n]/)[0].trim();
}

function gradeToVerdict(grade) {
  switch (grade) {
    case 'positive':             return 'הלוח נוטה לטובה — יש כיוון חיובי ברור.';
    case 'cautiously-positive':  return 'הלוח נוטה לטובה, אך בזהירות — הדרך אינה פשוטה לגמרי.';
    case 'negative':             return 'הלוח מצביע על קשיים — הכיוון הכללי שלילי.';
    case 'cautiously-negative':  return 'הלוח מצביע על עיכובים ואתגרים, אך לא חסום לגמרי.';
    default:                     return 'הלוח מאוזן — התשובה מעורבת ותלויה בנסיבות.';
  }
}

export function writeClientReadingHebrew(result) {
  const { topicId, boardAnalysis, clientContext, kashfVerdict, kashfSupportAnalysis } = result;
  if (!boardAnalysis?.hasBoard) return null;

  const name      = clean(clientContext?.clientName || '');
  const quesited  = clean(clientContext?.quesitedName || '');
  const grade     = result.boardScore?.grade || 'mixed';
  const confLevel = kashfSupportAnalysis?.confidence?.level;
  const timing    = boardAnalysis.timingEstimate;
  const nameLetters   = boardAnalysis.nameLetters || [];
  const dirQ          = boardAnalysis.directionQuadrant;
  const treasureLoc   = boardAnalysis.treasureLocation;
  const missingPerson = boardAnalysis.missingPersonAnalysis;
  const thiefLoc      = boardAnalysis.thiefLocationDetails;

  const judge    = boardAnalysis.judge    || getHouseFromBoard(boardAnalysis, 15);
  const sentence = boardAnalysis.sentence || getHouseFromBoard(boardAnalysis, 16);
  const h1  = getHouseFromBoard(boardAnalysis, 1);
  const h2  = getHouseFromBoard(boardAnalysis, 2);
  const h4  = getHouseFromBoard(boardAnalysis, 4);
  const h5  = getHouseFromBoard(boardAnalysis, 5);
  const h6  = getHouseFromBoard(boardAnalysis, 6);
  const h7  = getHouseFromBoard(boardAnalysis, 7);
  const h8  = getHouseFromBoard(boardAnalysis, 8);
  const h9  = getHouseFromBoard(boardAnalysis, 9);
  const h10 = getHouseFromBoard(boardAnalysis, 10);
  const h11 = getHouseFromBoard(boardAnalysis, 11);
  const h12 = getHouseFromBoard(boardAnalysis, 12);

  const jTone = figureFortuneTone(judge?.fortune);

  const paras = [];
  const push  = (p) => { if (p && clean(p)) paras.push(clean(p)); };

  // ── 1. פתיחה אישית ─────────────────────────────────────────────
  const prefix = name ? `${name}, ` : '';

  // ── 2. פסיקה ראשית ─────────────────────────────────────────────
  const mainVerdict = kashfVerdict?.verdictHebrew || gradeToVerdict(grade);
  push(`${prefix}${mainVerdict}`);

  // ── 3. רמת ביטחון ──────────────────────────────────────────────
  if (confLevel === 'weak') {
    push('כדאי לדעת: הכוחות בלוח אינם חד-משמעיים, ולכן הפסיקה אינה בטוחה לחלוטין. מומלץ לחזור ולשאול שנית אחרי מספר ימים.');
  } else if (confLevel === 'mixed') {
    push('הפסיקה נכונה בכללה, אך הדרך לא תהיה ישירה — יש כוחות שיעכבו או יסבכו.');
  }

  // ── 4. נרטיב לפי נושא ──────────────────────────────────────────

  switch (topicId) {

    case 'marriage': {
      const h7Fort = fortToWord(h7?.fortune);
      const qName  = quesited || 'הצד השני';
      if (h7) {
        const h7Transit = firstSentence(h7.transit?.meaning);
        push(h7Fort === 'טוב'
          ? `${qName} מופיע בלוח בסימן טוב${h7Transit ? ` — ${h7Transit}` : ''}.`
          : h7Fort === 'קשה'
          ? `${qName} מופיע בלוח בסימן קשה${h7Transit ? ` — ${h7Transit}` : ''} — יש סימנים שמחייבים בחינה נוספת.`
          : `${qName} מופיע בלוח בסימן מעורב — הלוח אינו חד-משמעי לגביו.`);
      }
      // הדיין — רק אם אין kasf verdict שסותר
      if (!kashfVerdict?.verdictHebrew) {
        if (jTone > 0) push('הדיין נוטה לחיוב: הזיווג יכול להצליח.');
        else if (jTone < 0) push('הדיין פוסק לשלילה: הלוח אינו תומך בנישואין אלו בשלב זה.');
        else push('הדיין ממוזג: התוצאה תלויה בהחלטות ובמאמץ שיושקעו.');
      }
      if (h8) {
        const h8Fort = fortToWord(h8?.fortune);
        push(`מצב הממון והמשפחה של הצד השני: ${h8Fort === 'טוב' ? 'נראה יציב ומבטיח' : h8Fort === 'קשה' ? 'יש סימנים לקשיים כלכליים' : 'מעורב'}.`);
      }
      break;
    }

    case 'theft': {
      const isIncoming = h7?.directionHebrew === 'נכנס';
      const isOutgoing  = h7?.directionHebrew === 'יוצא';
      if (jTone > 0) {
        push(isIncoming
          ? 'הגנב עדיין בסביבתך ולא ברח רחוק — יש סיכוי ממשי לאיתור.'
          : isOutgoing
          ? 'הגנב כבר התרחק, אך עדיין יש סיכוי לאיתור אם תפעל במהירות.'
          : 'יש סיכוי לאיתור הגנב והחפץ הגנוב.');
      } else {
        push(isOutgoing
          ? 'הגנב כבר ברח ולא נמצא בסביבה — הסיכויים להחזרת החפץ נמוכים.'
          : 'הסיכוי להחזרת החפץ קטן — הלוח לא מראה פתח ברור לאיתור.');
      }
      const h7Letters = nameLetters.find(n => n.houseNumber === 7);
      const h8Letters = nameLetters.find(n => n.houseNumber === 8);
      if (h7Letters?.letters?.length > 0) {
        const firstL  = h7Letters.letters.join(' / ');
        const secondL = h8Letters?.letters?.length > 0 ? `, האות השנייה: ${h8Letters.letters.join(' / ')}` : '';
        push(`שם הגנב מתחיל ב: ${firstL}${secondL}.`);
      }
      if (thiefLoc?.findings?.length > 0) {
        const types = [...new Set(thiefLoc.findings.map(f => f.thiefType))];
        const typeText = types[0];
        if (typeText && !typeText.startsWith('יש ')) {
          push(`לפי הלוח, הגנב ${typeText}.`);
        } else if (typeText) {
          push(`לפי הלוח: ${typeText}.`);
        }
      }
      if (h4) {
        const h4Ess = essenceOf(h4);
        push(`החפץ הגנוב נמצא כנראה במקום של ${h4Ess}.`);
      }
      break;
    }

    case 'illness': {
      if (h6) {
        const h6Fort = fortToWord(h6?.fortune);
        const h6Transit = firstSentence(h6.transit?.meaning);
        push(h6Fort === 'קשה'
          ? `המחלה בלוח מופיעה בצורה קשה — ${h6Transit || 'יש לה אחיזה חזקה בגוף'}.`
          : `המחלה מופיעה כ${h6Fort} — ${h6Transit || 'לא בחריפות מלאה'}.`);
      }
      if (h8) {
        const h8Fort = fortToWord(h8?.fortune);
        push(h8Fort === 'טוב'
          ? 'הפרוגנוזה חיובית — הלוח מראה כיוון של החלמה.'
          : h8Fort === 'קשה'
          ? 'הפרוגנוזה מדאיגה — הלוח מצביע על מצב חמור שדורש תשומת לב רפואית דחופה.'
          : 'הפרוגנוזה מעורבת — ייתכן שיפור הדרגתי, אך לא החלמה מהירה.');
      }
      if (h2) {
        const h2Fort = fortToWord(h2?.fortune);
        push(`מבחינת הטיפול והרפואה: ${h2Fort === 'טוב' ? 'יש סיכוי טוב שהטיפול יצליח' : h2Fort === 'קשה' ? 'הטיפול עלול להיות קשה או יקר' : 'הטיפול יידרש סבלנות'}.`);
      }
      break;
    }

    case 'missingPerson': {
      const isAlive = missingPerson?.isAlive;
      if (isAlive === true)  push('הלוח מצביע על כך שהנעדר בחיים ובריא.');
      else if (isAlive === false) push('⚠ הלוח מצביע על סכנה לחיי הנעדר — מומלץ לפעול בדחיפות.');
      else if (h1) {
        const h1Fort = fortToWord(h1?.fortune);
        push(h1Fort === 'טוב'
          ? 'הלוח מצביע על כך שהנעדר בסדר.'
          : 'הלוח מצביע על כך שהנעדר במצב קשה.');
      }
      if (dirQ?.dominantHebrew && (dirQ.dominant?.incomingBenefic ?? 0) > 0) {
        push(`הכיוון שכדאי לחפש: ${dirQ.dominantHebrew}.`);
      } else if (dirQ?.dominantHebrew) {
        push(`הלוח מצביע על כיוון ${dirQ.dominantHebrew} כמקום שקשור לנעדר.`);
      }
      const nlMissing = nameLetters.find(n => n.houseNumber === 7);
      if (nlMissing?.letters?.length > 0) {
        push(`שמו מתחיל ב: ${nlMissing.letters.join(' / ')}.`);
      }
      if (jTone > 0) push('הדיין מצביע על חזרה — יש סיכוי שהנעדר יחזור.');
      else if (jTone < 0) push('הדיין מצביע על עיכוב בחזרה — הנסיבות מורכבות.');
      break;
    }

    case 'travel': {
      if (h9) {
        const h9Fort = fortToWord(h9?.fortune);
        push(h9Fort === 'טוב'
          ? 'הלוח מראה שהנסיעה מובילה לכיוון טוב — יש פתיחה ברורה.'
          : h9Fort === 'קשה'
          ? 'הלוח מראה מכשולים בנסיעה — כדאי לשקול מחדש את העיתוי.'
          : 'הלוח מעורב לגבי הנסיעה — לא כל הדרכים פתוחות.');
      }
      if (dirQ?.dominantHebrew && (dirQ.dominant?.incomingBenefic ?? 0) > 0) {
        push(`הכיוון המומלץ לנסיעה: ${dirQ.dominantHebrew}.`);
      }
      if (h12) {
        const h12Fort = fortToWord(h12?.fortune);
        if (h12Fort === 'קשה') push('יש סימן למכשולים נסתרים בדרך — מומלץ להיות ערני.');
      }
      if (!kashfVerdict?.verdictHebrew) {
        if (jTone > 0) push('הדיין פוסק לחיוב: הנסיעה תצלח בסופו של דבר.');
        else if (jTone < 0) push('הדיין פוסק לשלילה: הנסיעה עלולה לא להשיג את מטרתה.');
      }
      break;
    }

    case 'seaVoyage': {
      if (h9) {
        const h9Fort = fortToWord(h9?.fortune);
        push(h9Fort === 'טוב'
          ? 'הלוח מראה שהמסע הימי בטוח ויצלח.'
          : h9Fort === 'קשה'
          ? 'הלוח מצביע על סכנה בים — מומלץ לשקול ברצינות את הנסיעה.'
          : 'הלוח מעורב לגבי בטיחות המסע.');
      }
      if (h8) {
        const h8Fort = fortToWord(h8?.fortune);
        if (h8Fort === 'קשה') push('⚠ בית המוות/הסכנה מצביע על סיכון ממשי — יש לנקוט אמצעי זהירות.');
      }
      if (jTone > 0) push('הדיין: הנסיעה תסתיים בשלום.');
      else if (jTone < 0) push('הדיין: יש ספק ביחס לבטיחות הנסיעה.');
      break;
    }

    case 'hiddenTreasure': {
      if (treasureLoc?.presenceHebrew) push(treasureLoc.presenceHebrew);
      else if (jTone > 0) push('הלוח מצביע על כך שיש ממשות לדבר החבוי.');
      else if (jTone < 0) push('הלוח מצביע על כך שהדבר החבוי חסום או לא קיים.');
      if (dirQ?.dominantHebrew && (dirQ.dominant?.incomingBenefic ?? 0) > 0) {
        push(`הכיוון לחיפוש: ${dirQ.dominantHebrew}.`);
      }
      if (h4) {
        push(`הדבר קשור לקרקע מכיוון ${essenceOf(h4)}.`);
      }
      break;
    }

    case 'prisoner': {
      const h12Fort = fortToWord(h12?.fortune);
      const h5Fort  = fortToWord(h5?.fortune);
      push(h12Fort === 'קשה'
        ? 'הלוח מראה שמצב הכלא כבד — הנסיבות לא קלות לשחרור.'
        : 'הלוח מראה שהמאסר אינו בעוצמה מלאה.');
      push(h5Fort === 'טוב'
        ? 'יש סיכוי טוב לשחרור — הסימנים תומכים ביציאה.'
        : h5Fort === 'קשה'
        ? 'הסיכוי לשחרור מהיר קטן — ייתכן שייקח זמן.'
        : 'שחרור אפשרי, אך לא ודאי.');
      const nlPrisoner = nameLetters.find(n => n.houseNumber === 12);
      if (nlPrisoner?.letters?.length > 0) {
        push(`הגורם שמחזיק אותו בכלא — שמו מתחיל ב: ${nlPrisoner.letters.join(' / ')}.`);
      }
      if (jTone > 0) push('הדיין פוסק לחיוב — השחרור יבוא.');
      else if (jTone < 0) push('הדיין מצביע על כך שהשחרור יתעכב.');
      break;
    }

    case 'commerce': {
      if (h2) {
        const h2Fort = fortToWord(h2?.fortune);
        push(h2Fort === 'טוב'
          ? 'הממון בלוח נראה טוב — הסחורה/ההשקעה נושאת פנים חיוביות.'
          : h2Fort === 'קשה'
          ? 'הממון בלוח מצביע על סכנת הפסד — כדאי לבחון מחדש.'
          : 'הממון מעורב — לא הפסד ולא ריווח ברור.');
      }
      if (h10) {
        const h10Fort = fortToWord(h10?.fortune);
        push(h10Fort === 'טוב'
          ? 'תוצאת העסקה נראית חיובית — יש נטייה לרווח ולהצלחה.'
          : h10Fort === 'קשה'
          ? 'תוצאת העסקה עלולה להיות מאכזבת — כדאי לנהל משא ומתן זהיר.'
          : 'תוצאת העסקה לא ברורה — לשמור על גמישות.');
      }
      if (jTone > 0) push('הדיין תומך בעסקה — מומלץ להמשיך.');
      else if (jTone < 0) push('הדיין מתנגד לעסקה — כדאי לחכות או לשנות תנאים.');
      break;
    }

    case 'childrenPregnancy': {
      if (h5) {
        const h5Fort = fortToWord(h5?.fortune);
        push(h5Fort === 'טוב'
          ? 'הלוח מראה פתיחה חיובית בנושא הילדים/ההריון — יש סימן טוב.'
          : h5Fort === 'קשה'
          ? 'הלוח מצביע על קשיים בנושא זה — ייתכן שיידרש טיפול רפואי.'
          : 'הלוח מעורב — יש אפשרות, אך לא ודאות.');
      }
      if (h11) {
        const h11Fort = fortToWord(h11?.fortune);
        push(h11Fort === 'טוב'
          ? 'הסיכויים להגשמת התקווה טובים.'
          : h11Fort === 'קשה'
          ? 'התקוות מאתגרות — ייתכן שיידרש סבלנות ועמידה.'
          : 'התקוות אפשריות אך תלויות בגורמים נוספים.');
      }
      if (jTone > 0) push('הדיין פוסק לחיוב — יש סיכוי ממשי.');
      else if (jTone < 0) push('הדיין לא תומך בשלב זה — אולי עוד לא הזמן הנכון.');
      break;
    }

    case 'enemies': {
      const qName = quesited || 'האויב';
      if (h7) {
        const h7Fort = fortToWord(h7?.fortune);
        push(h7Fort === 'קשה'
          ? `${qName} נמצא בעמדה חלשה — כוחו מוגבל.`
          : h7Fort === 'טוב'
          ? `${qName} נמצא בעמדה חזקה — יש לקחת אותו ברצינות.`
          : `${qName} בעמדה מעורבת.`);
      }
      if (h12) {
        const h12Fort = fortToWord(h12?.fortune);
        if (h12Fort === 'קשה') push('יש סכנה נסתרת שעדיין לא גלויה — כדאי להיות ערני.');
      }
      if (jTone > 0) push('הדיין פוסק לטובתך — אתה בעמדה הטובה יותר.');
      else if (jTone < 0) push('הדיין מצביע על כך שהאויב מחזיק ביד העליונה כרגע.');
      break;
    }

    case 'disputes': {
      const h1Fort = fortToWord(h1?.fortune);
      const h7Fort = fortToWord(h7?.fortune);
      push(h1Fort === 'טוב' && h7Fort === 'קשה'
        ? 'הלוח מציג אותך בעמדה חזקה יותר מהצד השני — יש לך יתרון בסכסוך.'
        : h1Fort === 'קשה' && h7Fort === 'טוב'
        ? 'הלוח מציג את הצד השני בעמדה חזקה — כדאי לשקול פשרה.'
        : 'הלוח מראה שהסכסוך מאוזן — התוצאה תלויה בהתפתחויות.');
      if (jTone > 0) push('הדיין פוסק לטובתך — יש יתרון ברור.');
      else if (jTone < 0) push('הדיין לא פוסק לטובתך — שקול מחדש את הגישה.');
      break;
    }

    case 'loveHate': {
      const qName2 = quesited || 'הצד השני';
      if (h7) {
        const h7Fort = fortToWord(h7?.fortune);
        push(h7Fort === 'טוב'
          ? `${qName2} מופיע בלוח בסימן חיובי — נראה שיש רגש אמיתי.`
          : h7Fort === 'קשה'
          ? `${qName2} מופיע בלוח בסימן קשה — ייתכן שהרגשות לא כנים.`
          : `${qName2} מופיע בלוח באופן מעורב — הרגשות מורכבים.`);
      }
      if (jTone > 0) push('הדיין מצביע על קרבה וחיבה — הקשר יכול להתפתח.');
      else if (jTone < 0) push('הדיין מצביע על ניתוק — הקשר בעייתי.');
      break;
    }

    case 'authorityState': {
      if (h10) {
        const h10Fort = fortToWord(h10?.fortune);
        push(h10Fort === 'טוב'
          ? 'עמדת השלטון/התפקיד נראית יציבה ומחוזקת.'
          : h10Fort === 'קשה'
          ? 'עמדת השלטון/התפקיד מאוימת — יש כוחות שמנסים לערער אותה.'
          : 'מצב השלטון/התפקיד תלוי בהתפתחויות.');
      }
      if (jTone > 0) push('הדיין מצביע על המשך ויציבות.');
      else if (jTone < 0) push('הדיין מצביע על שינוי — ייתכן שחרור מהתפקיד.');
      break;
    }

    case 'yearlyForecast': {
      if (h1) {
        const h1Fort = fortToWord(h1?.fortune);
        push(h1Fort === 'טוב'
          ? 'השנה הקרובה מתחילה בסימן חיובי עבורך.'
          : h1Fort === 'קשה'
          ? 'השנה הקרובה תביא אתגרים — כדאי להתכונן ולתכנן.'
          : 'השנה הקרובה מעורבת — יהיו עליות וירידות.');
      }
      if (h2) {
        const h2Fort = fortToWord(h2?.fortune);
        push(`מצב הפרנסה: ${h2Fort === 'טוב' ? 'צפויה שנה טובה מבחינה כלכלית' : h2Fort === 'קשה' ? 'כדאי לשמור על כסף ולא לסכן השקעות' : 'הכנסה לא קבועה — שנה מעורבת כלכלית'}.`);
      }
      break;
    }

    case 'fear': {
      if (h12) {
        const h12Fort = fortToWord(h12?.fortune);
        push(h12Fort === 'קשה'
          ? 'הלוח מאשר שיש מקור ממשי לחשש — אין להתעלם ממנו.'
          : 'הלוח מראה שהפחד גדול מהמציאות — הסכנה פחות ממשית ממה שנראית.');
      }
      if (jTone > 0) push('הדיין מצביע על כך שהסכנה תחלוף — יש הגנה.');
      else if (jTone < 0) push('הדיין מאשר את הסכנה — נקוט אמצעי זהירות.');
      break;
    }

    case 'spiritualDiagnostics': {
      const grad = result.boardScore?.grade;
      push(grad === 'strong-suspicion' || grad === 'medium-suspicion'
        ? 'הלוח מראה סימנים לפגיעה רוחנית — מומלץ לטפל בכך.'
        : 'הלוח לא מראה סימנים חזקים לפגיעה רוחנית.');
      break;
    }

    case 'siblings':
    case 'deathInheritance': {
      if (jTone > 0) push('הדיין פוסק לחיוב בשאלה זו.');
      else if (jTone < 0) push('הדיין פוסק לשלילה — יש מכשולים בדרך.');
      else push('הדיין ממוזג — התוצאה לא ודאית.');
      break;
    }

    case 'generalReading':
    case 'foundations':
    case 'birthNativity':
    case 'completion':
    case 'partnership': {
      if (h1) {
        const h1Fort = fortToWord(h1?.fortune);
        push(askerOpeningLine(h1?.fortune, ''));
      }
      if (jTone > 0) push('הדיין פוסק לחיוב — הכיוון הכללי תומך.');
      else if (jTone < 0) push('הדיין פוסק לשלילה — כדאי לחכות לזמן טוב יותר.');
      else push('הדיין ממוזג — יש לנהוג בזהירות.');
      break;
    }

    default: {
      if (jTone > 0) push('הדיין פוסק לחיוב.');
      else if (jTone < 0) push('הדיין פוסק לשלילה.');
      break;
    }
  }

  // ── 5. תזמון ────────────────────────────────────────────────────
  if (timing?.quantity) {
    push(`מבחינת עיתוי — הלוח מצביע על כ-${timing.quantity}.`);
  }

  // ── 6. אות שם (נושאים שלא טופלו בסעיף 4) ───────────────────────
  const unhandledLetterTopics = ['spiritualDiagnostics', 'authorityState', 'prisoner', 'partnership'];
  if (unhandledLetterTopics.includes(topicId)) {
    for (const nl of nameLetters) {
      push(`${nl.houseRole}: ${nl.outputHebrew}.`);
    }
  }

  // ── 7. סיום נושא-ספציפי ─────────────────────────────────────────
  // כשיש פסיקת כשף — היא קובעת את הטון, לא ה-grade של המנוע
  const kashfPolarity = kashfVerdict?.classification?.saadNahs;
  const isPositive = kashfPolarity === 'saad'
    || (!kashfPolarity && (grade === 'positive' || grade === 'cautiously-positive'));
  const isNegative = kashfPolarity === 'nahs'
    || (!kashfPolarity && (grade === 'negative' || grade === 'cautiously-negative'));

  const closingByTopic = {
    marriage:           isPositive ? 'בסיכום: יש בסיס לקחת צעד קדימה עם שמירה על עיניים פקוחות.'
                                   : isNegative ? 'בסיכום: כדאי לקחת עוד זמן לפני ההחלטה — הלוח מצביע על כך שהשלב עדיין לא בשל.'
                                   : 'בסיכום: אין תשובה חד-משמעית — המשך להכיר לפני שמחליטים.',
    theft:              isPositive ? 'בסיכום: פעל מהר — ככל שתחקור מהר יותר, הסיכוי גדל.'
                                   : 'בסיכום: נסה לחקור בסביבה הקרובה, אך היה מציאותי לגבי הסיכויים.',
    illness:            isPositive ? 'בסיכום: יש סיבה לאופטימיות — המשך בטיפול ובעצות הרופא.'
                                   : 'בסיכום: המחלה תלווה אותו עוד תקופה — חשוב לדאוג לתמיכה ולטיפול רציף.',
    travel:             isPositive ? 'בסיכום: הנסיעה יכולה להצליח — תכנן טוב ולך.'
                                   : 'בסיכום: שקול לדחות את הנסיעה או לשנות את עיתויה.',
    seaVoyage:          isPositive ? 'בסיכום: המסע נראה בטוח — נסע בשלום.'
                                   : 'בסיכום: נקוט בכל אמצעי הבטיחות, ושקול אם הנסיעה הכרחית.',
    missingPerson:      isPositive ? 'בסיכום: יש תקווה לחזרה — המשך לחפש בכיוון שהלוח מצביע.'
                                   : 'בסיכום: המצב מורכב — פנה לגורמים מקצועיים ואל תאבד תקווה.',
    hiddenTreasure:     isPositive ? 'בסיכום: שווה לחפש בכיוון שהלוח מצביע עליו.'
                                   : 'בסיכום: הלוח לא מחזק את קיום המטמון — התקדם בזהירות.',
    prisoner:           isPositive ? 'בסיכום: יש סיכוי לשחרור — המשך לטפל בעניין משפטית.'
                                   : 'בסיכום: ייתכן שהשחרור יתעכב — יש להמשיך לפעול ולא לוותר.',
    commerce:           isPositive ? 'בסיכום: העסקה נראית טובה — המשך לנהל משא ומתן ולסגור.'
                                   : 'בסיכום: אל תמהר לסגור — בדוק מחדש את התנאים לפני חתימה.',
    childrenPregnancy:  isPositive ? 'בסיכום: יש פתיחה — כדאי להמשיך לנסות ולהיות אופטימי.'
                                   : 'בסיכום: ייתכן שיידרש עוד זמן — פנה לרפואה ואל תוותר.',
    enemies:            isPositive ? 'בסיכום: אתה בעמדה טובה — פעל בביטחון.'
                                   : 'בסיכום: היה זהיר — האויב בעמדת כוח כרגע.',
    disputes:           isPositive ? 'בסיכום: יש לך יתרון — המשך לטפל בעניין בנחישות.'
                                   : 'בסיכום: שקול פשרה לפני הכרעה סופית.',
    loveHate:           isPositive ? 'בסיכום: הקשר יכול להתפתח — תן לו סיכוי.'
                                   : 'בסיכום: יש לשים לב לאותות שהלוח מראה לגבי כנות הצד השני.',
    authorityState:     isPositive ? 'בסיכום: עמדת השלטון יציבה — אין סיבה לדאגה מיידית.'
                                   : 'בסיכום: יש להיערך לאפשרות של שינוי — טפל בבעיות מוקדם.',
    yearlyForecast:     isPositive ? 'בסיכום: השנה הקרובה מבטיחה — נצל את ההזדמנויות.'
                                   : 'בסיכום: שנה מאתגרת בפתח — תכנן, חסוך, והיה שמרן.',
    fear:               isPositive ? 'בסיכום: הלוח מראה שהסכנה תחלוף — היה ערני אך לא משותק.'
                                   : 'בסיכום: יש לטפל במקור הפחד ברצינות — אל תתעלם.',
  };

  const closingLine = closingByTopic[topicId]
    || (isPositive ? 'בסיכום: הלוח מראה כיוון חיובי. פעל בבטחה, אך שים לב לפרטים שהוזכרו.'
      : isNegative ? 'בסיכום: הלוח מראה עיכוב. מומלץ לא למהר ולבדוק מחדש.'
      : 'בסיכום: הלוח לא חד-משמעי — פעל בזהירות ובדוק שוב אם הנסיבות ישתנו.');
  push(closingLine);

  return paras.join('\n\n');
}

export default {
  writeHumanGoralConclusion,
  writeShortClientVerdict,
  writeClientReadingHebrew,
};

if (typeof module !== 'undefined') {
  module.exports = { writeHumanGoralConclusion, writeShortClientVerdict, writeClientReadingHebrew };
}
