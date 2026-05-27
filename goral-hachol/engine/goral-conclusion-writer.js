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

  let verdictParagraph = '';
  if (isSpiritualTopic) {
    verdictParagraph = spiritualVerdict(result.spiritualDiagnosis);
  } else if (topicId === 'theft') {
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
