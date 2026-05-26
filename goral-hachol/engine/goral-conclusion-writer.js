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

  // דמיר — שרשרת הגזירה (שיטה ראשית לפי הספר)
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
    // גיבוי: נהמת האמהות
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

  // ── מצב הטאלע — ניתוח בית 1 ───────────────────────────────────────────────
  const h1Analysis = analysis.house1Analysis || null;
  if (h1Analysis) {
    const lines = h1Analysis.summaryLines.map((l) => `  ${l}`).join('\n');
    parts.push(`מצב השואל (בית הטאלע):\n${lines}`);
  }

  // ── איתיסלאת — חיבורים בין בתים ──────────────────────────────────────────
  const ittisalat = analysis.ittisalat || null;
  if (ittisalat && ittisalat.summaryLines && ittisalat.summaryLines.length > 0) {
    const connectionStatus = ittisalat.isConnected
      ? 'יש חיבור בין השואל לעניין'
      : 'אין חיבור ישיר בין השואל לעניין';
    const lines = ittisalat.summaryLines.map((l) => `  ${l}`).join('\n');
    parts.push(`איתיסלאת (${connectionStatus}):\n${lines}`);
  }

  // ── בדיקות נושא — זוגות בתים לפי סוג השאלה ────────────────────────────────
  const topicConn = analysis.topicConnections || null;
  if (topicConn && topicConn.checks && topicConn.checks.length > 0) {
    const lines = topicConn.checks.map((c) => `  ${c.hebrewShort}`).join('\n');
    parts.push(`בדיקות נושא — ${topicConn.topicHebrew || topicConn.topicId}:\n${lines}`);
  }

  // ── תחסיל ומניעה — שאלת ההגעה המרכזית ──────────────────────────────────
  const tahasil = analysis.tahasil || null;
  if (tahasil) {
    parts.push(`תחסיל — האם הדבר ייגמר:\n  ${tahasil.tahasilHebrew}`);
    if (tahasil.hayulaActive) {
      parts.push(`  ⚠ ${tahasil.hayulaHebrew}`);
    }
  }

  // ── הוצאת שם (استخراج الاسم) ──────────────────────────────────────────
  const nameLetters = analysis.nameLetters;
  if (Array.isArray(nameLetters) && nameLetters.length > 0) {
    const nameLines = nameLetters.map((nl) =>
      `  ${nl.houseRole} (בית ${nl.houseNumber} — ${nl.figureHebrew}): ${nl.outputHebrew}`
    );
    parts.push(`הוצאת שם (תסקין עבדוה):\n${nameLines.join('\n')}`);
  }

  // ── שלטון / בעלי תפקידים ─────────────────────────────────────────────
  const authAnalysis = analysis.authorityStateAnalysis;
  if (authAnalysis) {
    parts.push(`ניתוח שלטון (שער מלכים, חאוי עמ׳ 36-38):\n${authAnalysis.outputHebrew}`);
  }

  // ── טאלע השנה / יוקר וזול / גשם ────────────────────────────────────
  const yearlyAnalysis = analysis.yearlyForecastAnalysis;
  if (yearlyAnalysis) {
    parts.push(`ניתוח טאלע השנה (חאוי עמ׳ 60-62):\n${yearlyAnalysis.outputHebrew}`);
  }

  // ── שער המולד / הנולד ───────────────────────────────────────────────
  const birthAnalysis = analysis.birthNativityAnalysis;
  if (birthAnalysis) {
    parts.push(`שער המולד (חאוי עמ׳ 51-58):\n${birthAnalysis.outputHebrew}`);
  }

  // ── משולשים — כוכבים לפי יסוד ────────────────────────────────────────
  const triangles = analysis.trianglesEnrichment;
  if (triangles) {
    parts.push(`ניתוח משולשים (שער המשולשים, חאוי עמ׳ 59):\n${triangles.outputHebrew}`);
  }

  // ── אבחון מחלה לפי יסוד (בלוג' אלאמל פרק 5) ──────────────────────────
  const illnessDiag = analysis.illnessElementDiagnosis;
  if (illnessDiag) {
    parts.push(`אבחון מחלה לפי יסוד (בלוג' אלאמל פרק 5):\n  ${illnessDiag.outputHebrew.replace(/\n/g, '\n  ')}`);
  }

  // ── זיהוי הגנב לפי חזרת צורות (בלוג' אלאמל פרק 19) ──────────────────
  const thiefLoc = analysis.thiefLocationDetails;
  if (thiefLoc) {
    parts.push(`זיהוי הגנב (בלוג' אלאמל פרק 19):\n  ${thiefLoc.outputHebrew.replace(/\n/g, '\n  ')}`);
  }

  // ── גילוי אויב בסביבה הקרובה (בלוג' אלאמל עמ' 64) ───────────────────
  const enemyHH = analysis.enemyInHousehold;
  if (enemyHH) {
    parts.push(`גילוי אויב בסביבה (בלוג' אלאמל עמ' 64):\n  ${enemyHH.outputHebrew}`);
  }

  // ── פסיקת נישואין לפי צורה שולטת (בלוג' אלאמל פרק 33) ──────────────
  const marriageForecast = analysis.marriageFigureForecast;
  if (marriageForecast) {
    parts.push(`פסיקת נישואין לפי צורה שולטת (בלוג' אלאמל פרק 33):\n  ${marriageForecast.outputHebrew}`);
  }

  // ── צורה ראשונה × חזרות (בלוג' אלאמל פרק 17) ────────────────────────
  const firstFigRep = analysis.firstFigureRepetition;
  if (firstFigRep) {
    parts.push(firstFigRep.outputHebrew);
  }

  // ── עיתוי — מתי יסתיים? (בלוג' אלאמל פרק 7) ─────────────────────────
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
    let base = 'לכן יש לבדוק את בית הילדים, העדים והדיין יחד, ורק אז להכריע לגבי אפשרות ההיריון או סימני זכר ונקבה.';
    if (house5Desc) base += ` בדוק בית 5 (ילדים): ${house5Desc}`;
    return base;
  }

  if (topicId === 'hiddenTreasure') {
    const tl = boardAnalysis?.treasureLocation;
    if (!tl) return 'לכן צריך לבדוק אם הדבר באמת קיים, אם הוא חסום או שמור, ומה הכיוון שהלוח נותן לחיפוש.';

    const parts = [];

    // Presence verdict
    parts.push(tl.presenceHebrew);

    // Figure-in-house-1 location rule
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
    return 'לכן נכון להמשיך באבחון מדויק לפי הבתים והצורות, ולא לקבוע רק לפי תחושה או פחד.';
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
    let base = '';
    if (grade === 'positive') base = 'לכן הלוח מראה נטייה לשיפור ולהחלמה.';
    else if (grade === 'negative') base = 'לכן הלוח מראה מחלה קשה — יש לפעול בזהירות ולבדוק את בית 8.';
    else base = 'לכן המחלה בלוח מעורבת — לא ניתן לקבוע בוודאות.';
    if (house6Desc) base += ` בדוק בית 6 (המחלה): ${house6Desc}`;
    return base;
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
      // Thief identity: figure in house 7 + its transit description
      const transitMeaning = house7.transit?.meaning || '';
      const element = house7.elementHebrew || house7.element || '';

      let thiefDesc = `הגנב מיוצג על ידי "${house7Name}" בבית 7.`;

      if (transitMeaning) {
        thiefDesc += ` לפי מעבר הצורה: ${transitMeaning}`;
      }

      // Element → proximity/relationship clue (from Hawi figure-transit logic)
      if (element.includes('אוויר')) {
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
      // Generic enemy analysis
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

  if (confirming) {
    return `הדמיר (בית ${dhamirHouseNum}${dhamirFigure ? ` — ${dhamirFigure}` : ''}): ${dhamirFort} — מאשר את הדיין ומחזק את הפסיקה. כשהדמיר מסכים עם הדיין, הוא מוסיף ודאות לתשובה.`;
  } else {
    return `הדמיר (בית ${dhamirHouseNum}${dhamirFigure ? ` — ${dhamirFigure}` : ''}): ${dhamirFort} — סותר את הדיין. כשהדמיר מנוגד לדיין, יש לקחת בחשבון שהמצב עשוי להשתנות, או שיש כוחות פנימיים שמעכבים את הגעת התשובה.`;
  }
}

function boardScoreParagraph(boardAnalysis) {
  const bScore = boardAnalysis?.boardScore;
  if (!bScore) return '';
  if (bScore.isComplete) return '';
  return `לוח חסר: ${bScore.hebrewSummary}. כשהלוח חסר (פחות מ-96 נקודות), השאלה עשויה להישאר לא פתורה, או שהתשובה תאחר להתברר.`;
}

export function writeHumanGoralConclusion(result) {
  const topicId = result.topicId;
  const topicHebrew = result.topicHebrew;
  const grade = result.boardScore?.grade || 'mixed';
  const score = result.boardScore?.score || 0;
  const isSpiritualTopic = topicId === 'spiritualDiagnostics';
  const judgeVerdict = result.judgeVerdict || result.boardScore?.judgeVerdict || null;
  const question = clean(result.question);
  const isMiQuestion = /^מי[\s,]/.test(question);

  // Leading verdict paragraph
  let verdictParagraph = '';
  if (isSpiritualTopic) {
    verdictParagraph = spiritualVerdict(result.spiritualDiagnosis);
  } else if (isMiQuestion && topicId === 'enemies') {
    // "מי" questions need identification, not yes/no
    const house7 = result.boardAnalysis?.houses?.find(h => h.house === 7);
    const house7Fig = house7?.figureHebrew || '';
    if (grade === 'positive' || grade === 'cautiously-positive') {
      verdictParagraph = `הלוח מאפשר זיהוי — יש סיכוי לגלות את מי שעומד מאחורי הגניבה או הפגיעה. בית 7${house7Fig ? ` (${house7Fig})` : ''} מציין את הגנב — פרטים בהמשך.`;
    } else {
      verdictParagraph = `הלוח מצביע על קושי בזיהוי — הגנב נסתר או קשה לאיתור. בית 7${house7Fig ? ` (${house7Fig})` : ''} מציין את הגנב — פרטים בהמשך.`;
    }
  } else if (judgeVerdict?.hebrewFull) {
    verdictParagraph = judgeVerdict.hebrewFull;
  } else if (result.boardScore?.hebrew) {
    verdictParagraph = result.boardScore.hebrew;
  }

  const paragraphs = [
    clientContextParagraph(result.clientContext, result.question),
    clientHistoryParagraph(result.clientHistorySummary),
    boardScoreParagraph(result.boardAnalysis),
    verdictParagraph,
    dhamirParagraph(result.boardAnalysis, judgeVerdict),
    tahasilParagraph(result.boardAnalysis),
    topicOpening(topicId, topicHebrew),
    questionFocusParagraph(topicId, result.clientContext),
    describeCoreHouses(result.boardAnalysis, topicId, result.question),
    spiritualParagraph(result.spiritualDiagnosis, topicId),
    recommendationByTopic(topicId, grade, result.boardAnalysis, result.question),
  ].filter((p) => clean(p));

  return paragraphs.join('\n\n');
}

export default {
  writeHumanGoralConclusion,
};

if (typeof module !== 'undefined') {
  module.exports = { writeHumanGoralConclusion };
}
