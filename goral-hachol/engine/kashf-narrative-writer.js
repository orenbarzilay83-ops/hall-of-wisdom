/**
 * kashf-narrative-writer.js — נרטיב מלא לשיטת חשיפת הסודות הנצורים (כשף אל-אסרר)
 *
 * מפיק HTML מלא: כותרת, פסקאות נרטיב עשירות, ניתוח עדים ודיין, ומסקנה.
 * מקור יחיד: ספר כשף אל-אסרר — השער השישי (עמ׳ 166–276).
 */

// ── עזרי טקסט ─────────────────────────────────────────────────────────────

function c(val = '') { return String(val || '').trim(); }

function qualityWord(q) {
  return { saad: 'מיטיבה', nahs: 'מזיקה', mixed: 'ממוזגת' }[q] || '';
}

function qualityAdj(q) {
  return { saad: 'חיובי', nahs: 'שלילי', mixed: 'מורכב' }[q] || '';
}

function dakhalWord(dk) {
  return {
    kharij:          'חיצונית',
    dakhil:          'פנימית',
    'mujassad-kharij': 'חיצונית (מוגשמת)',
    'mujassad-dakhil': 'פנימית (מוגשמת)',
  }[dk] || '';
}

function firstName(name) {
  if (!name) return '';
  return name.split(' ')[0];
}

// ── כיצד לתאר סוג נוסחה ────────────────────────────────────────────────────

function describeFormulaType(type, houses) {
  const h = (houses || []).join(' ו-');
  if (type === 'fire-row-assemble') return `לוקחים שורת-האש מהבתים ${h} ומרכיבים מהן צורה (נוסחת "ראש")`;
  if (type === 'assemble')         return `מרכיבים צורה מכלל שורות הבתים ${h}`;
  if (type === 'combine')          return `מחברים את הבתים ${h} להולדת צורה`;
  if (type === 'house-quality')    return `בודקים את טיב בית ${houses?.[0]}`;
  if (type === 'count-quality')    return `סופרים מיטיב/מזיק בבתים ${h}`;
  return `נוסחה על הבתים ${h}`;
}

// ── תיאור תוצאת נוסחה ──────────────────────────────────────────────────────

function describeFormulaResult(result) {
  if (!result) return '';
  if (result.resultPattern && result.resultFigureName) {
    const q  = qualityWord(result.classification?.saadNahs);
    const dk = dakhalWord(result.classification?.dakhalKharij);
    return `יצאה הצורה <strong>${result.resultFigureName}</strong> (${result.resultPattern}) — ${q}${dk ? ` ו${dk}` : ''}`;
  }
  if (result.counts) {
    const { saad = 0, nahs = 0, mixed = 0 } = result.counts;
    return `נמצאו: ${saad} בתים מיטיבים, ${nahs} בתים מזיקים, ${mixed} בתים ממוזגים`;
  }
  return '';
}

// ── כותרת ─────────────────────────────────────────────────────────────────

function writeHeader(reading) {
  const { topicHebrewName, topicDescription, clientContext, overallPositive } = reading;
  const name    = c(clientContext?.name);
  const question = c(clientContext?.question);
  const ageStr  = clientContext?.age ? `, גיל ${clientContext.age}` : '';

  const badge   = `<span class="kashf-reading-badge">חשיפת הסודות הנצורים · כשף אל-אסרר</span>`;
  const h2      = `<h2>${topicHebrewName}</h2>`;
  const desc    = topicDescription ? `<p class="kashf-topic-desc">${topicDescription}</p>` : '';
  const clientLine = name
    ? `<p class="kashf-client-line">לקוח: <strong>${name}</strong>${ageStr}</p>` : '';
  const qLine   = question
    ? `<p class="kashf-question-line">שאלה: <em>${question}</em></p>` : '';

  const cls = overallPositive === true ? 'positive' : overallPositive === false ? 'negative' : 'neutral';
  const overallText = overallPositive === true
    ? '◈ הלוח מראה כיוון חיובי'
    : overallPositive === false
      ? '◈ הלוח מראה עיכוב או קושי'
      : '◈ הלוח מורכב — יש לדקדק בפרטים';

  return `<div class="kashf-reading-header">
    <div class="kashf-reading-title">${badge}${h2}${desc}</div>
    ${clientLine}${qLine}
    <div class="kashf-overall ${cls}">${overallText}</div>
    <div class="kashf-source-ref">מקור: ספר כשף אל-אסרר — השער השישי (עמ׳ 166–276)</div>
  </div>`;
}

// ── אזהרות לוח ────────────────────────────────────────────────────────────

function writeBoardWarnings(reading) {
  const warnings = reading.boardValidation?.warnings || [];
  if (!warnings.length) return '';
  const items = warnings.map(w =>
    `<div class="kashf-board-warning ${w.severity || 'warning'}">
      <strong>${w.severity === 'critical' ? '⚠ חריג חמור' : '⚑ הערה על הלוח'}</strong>:
      ${w.hebrewMessage}
    </div>`
  ).join('');
  return `<div class="kashf-reading-card board-warnings"><h3 class="kashf-card-title">הערות על הלוח</h3>${items}</div>`;
}

// ── פסקת פתיחה ────────────────────────────────────────────────────────────

function writeOpeningPara(reading) {
  const { topicId, topicHebrewName, clientContext } = reading;
  const name = c(clientContext?.name);
  const q    = c(clientContext?.question);

  const INTROS = {
    illness:          'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא החולה בודקת שלושה דברים: מאיפה המחלה, עד כמה היא חמורה, ומה הסיכוי לריפוי. הספר קובע שיש לבדוק את בית הראשון (כוח החולה), בית השישי (טבע המחלה) ובית השמיני (פרוגנוזה). בנוסף, עדי הלוח ודיינו מוסיפים שכבת ניתוח על הכיוון הכולל.',
    marriage:         'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא הנישואין מציבה מול בית השואל (1) את בית בן/בת הזוג (7), ובוחנת מה מחבר ומה מפריד. הספר מלמד שכאשר שני הבתים מיטיבים ומתחברים זה לזה, הנישואין מתקיימים. הדיין (בית 15) מוסיף את הכרעת הסיום.',
    travel:           'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא הנסיעה בודקת לא רק אם לנסוע, אלא את טיב הדרך, מה מחכה בסופה, ואת מצב הנוסע לפי בתי הנסיעה — תשיעי, שלישי, חמישי.',
    missingPerson:    'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא הנעדר בודקת אם הוא חי, היכן הוא, ואת אפשרות חזרתו. הספר מורה לבדוק את בית השביעי (מצב הנעדר), התשיעי (הדרך), והשמיני (חשש למוות).',
    authorityState:   'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא הכבוד והשררה בוחנת את עמדת השואל מול הסמכות דרך בית הראשון ובית העשירי. הספר קובע שאם הצורה שיצאה מהחיבור ביניהם היא מכוכבי הטוב — המינוי יתקיים.',
    commerce:         'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא המסחר בודקת את כיוון תנועת הממון — פנימה אל השואל (נכנס, מיטיב) או החוצה (יוצא, מזיק). בית השני (ממון) ובית העשירי (פרנסה) הם המרכזיים.',
    theft:            'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא הגנבה בודקת שלוש שאלות: מי גנב (בית 7), היכן הגנב עכשיו (פנים/חוץ), והאם הדבר הגנוב יוחזר (בית 8 ודיין).',
    disputes:         'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא הסכסוך בוחנת את כוח כל צד — השואל בבית ראשון, הצד שכנגד בבית שביעי — ואת הדיין שמכריע.',
    money:            'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא הממון בודקת את כיוון תנועת הכסף — האם הוא נכנס לשואל או יוצא ממנו.',
    children:         'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא הילדים בודקת את בית החמישי ומשמעות הצורה שבו — מין, חיוניות, וסיכוי הריון.',
    loan:             'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא ההלוואה בודקת אם החוב יוחזר, ואם ראוי כלל לתת את ההלוואה.',
    deathInheritance: 'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא המוות והירושה בודקת את בית השמיני — מה שבא מן המוות, סכנה, ירושה, או ביטחון.',
    prisoner:         'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא האסיר בודקת את כוח הכלא (בית 12) מול כוח השחרור, ואת מה שמסומן בבית השישה-עשר.',
    siblings:         'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא האחים בודקת את הקשר בין השואל (בית 1) לאח (בית 3).',
    relocation:       'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא המעבר בודקת אם המקום החדש מביא ברכה, לפי בית הרביעי ובית החמישה-עשר.',
    religion:         'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא הדת בודקת את עומק האמונה על פי בית השלישי ובית התשיעי.',
    completion:       'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא השלמת העניין בודקת אם הדבר שנשאל עליו יצא לפועל, על פי שורות-האש ובית הדיין.',
    generalReading:   'שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בקריאה כוללת בודקת את מצב השואל בשלמותו — ממונו, בריאותו, יחסיו ואחריתו.',
  };

  const intro = INTROS[topicId] || `שיטת חשיפת הסודות הנצורים לפי ספר כשף אל-אסרר בנושא ${topicHebrewName} מנתחת את הלוח לפי כללי הספר.`;

  const lead = name
    ? `הקריאה נעשית עבור <strong>${name}</strong>${q ? `, בתשובה לשאלה: "${q}". ` : '. '}`
    : (q ? `השאלה שנשאלה: "${q}". ` : '');

  return `<p class="kashf-prose-paragraph">${lead}${intro}</p>`;
}

// ── פסקת הנוסחה הראשית ────────────────────────────────────────────────────

function writeVerdictPara(reading) {
  const { primaryFormula, clientContext } = reading;
  if (!primaryFormula?.verdict) return '';

  const { type, houses, result, verdict, sourceText } = primaryFormula;
  const fn = firstName(c(clientContext?.name));

  const formulaDesc = describeFormulaType(type, houses);
  const resultDesc  = describeFormulaResult(result);
  const verdictText = verdict?.text || '';

  const srcShort = sourceText
    ? (sourceText.length > 140 ? sourceText.slice(0, 137) + '...' : sourceText)
    : '';

  const parts = [];
  parts.push(`לפי כללי ספר כשף אל-אסרר, ${formulaDesc}.`);
  if (resultDesc) parts.push(resultDesc + '.');
  if (verdictText) parts.push(`<strong>הפסיקה:</strong> ${verdictText}.`);
  if (srcShort) parts.push(`<em>לפי הספר: "${srcShort}"</em>`);

  return `<p class="kashf-prose-paragraph">${parts.join(' ')}</p>`;
}

// ── פסקת נוסחה חלופית ────────────────────────────────────────────────────

function writeAltPara(reading) {
  const { altFormula } = reading;
  if (!altFormula?.verdict) return '';

  const { type, houses, result, verdict, sourceText } = altFormula;
  const formulaDesc = describeFormulaType(type, houses);
  const resultDesc  = describeFormulaResult(result);
  const verdictText = verdict?.text || '';
  const srcShort    = sourceText
    ? (sourceText.length > 120 ? sourceText.slice(0, 117) + '...' : sourceText)
    : '';

  const parts = [`<strong>בדיקת אימות נוספת:</strong> ${formulaDesc}.`];
  if (resultDesc) parts.push(resultDesc + '.');
  if (verdictText) parts.push(verdictText + '.');
  if (srcShort) parts.push(`<em>מקור: "${srcShort}"</em>`);

  return `<p class="kashf-prose-paragraph">${parts.join(' ')}</p>`;
}

// ── פסקת ניתוח תומך ───────────────────────────────────────────────────────

function findingSentence(f) {
  if (f.error) return null;

  const srcShort = f.sourceText
    ? (f.sourceText.length > 100 ? f.sourceText.slice(0, 97) + '...' : f.sourceText)
    : '';
  const srcNote = srcShort ? ` — <em>מקור: "${srcShort}"</em>` : '';

  if (f.checkType === 'house-quality') {
    const q = qualityWord(f.quality);
    const fig = f.figureName || '';
    return `<strong>${f.label}:</strong> בית ${f.houseNum} הכיל את הצורה ${fig}${q ? ` — ${q}` : ''}${srcNote}.`;
  }
  if (f.checkType === 'count-quality') {
    const houses = (f.houses || []).join(', ');
    return `<strong>${f.label}</strong> (בתים ${houses}): ${f.summary}${srcNote}.`;
  }
  if (f.checkType === 'house-element') {
    return `<strong>${f.label}:</strong> יסוד בית ${f.houseNum} הוא ${f.elementHebrew || ''} — כיוון ${f.direction || ''}${srcNote}.`;
  }
  if (f.checkType === 'element-pair') {
    return `<strong>${f.label}:</strong> ${f.illnessType || '—'}${srcNote}.`;
  }
  if (f.checkType === 'house-in-house-check') {
    const res = f.matches
      ? `בית ${f.mainHouse} נמצא בבית ${f.targetHouse} — הדין חל`
      : `בית ${f.mainHouse} אינו בבית ${f.targetHouse}`;
    return `<strong>${f.label}:</strong> ${res}${srcNote}.`;
  }
  if (f.checkType === 'house-figure-description') {
    const dk = dakhalWord(f.classification?.dakhalKharij);
    return `<strong>${f.label}:</strong> בית ${f.houseNum} הכיל <strong>${f.figureName || ''}</strong>${dk ? ` — ${dk}` : ''}${srcNote}.`;
  }
  if (f.checkType === 'house-gender') {
    return `<strong>${f.label}:</strong> בית ${f.houseNum} — ${f.genderHebrew || ''}${srcNote}.`;
  }
  if (f.checkType === 'house-dakhal-kharij') {
    return `<strong>${f.label}:</strong> בית ${f.houseNum} — ${f.dakhalKharijHebrew || ''}${srcNote}.`;
  }
  return `<strong>${f.label}:</strong> ${f.summary || f.dakhalKharijHebrew || f.qualityHebrew || '—'}${srcNote}.`;
}

function writeSupportingPara(reading) {
  const findings = reading.supportingFindings || [];
  if (!findings.length) return '';

  const sentences = findings.map(findingSentence).filter(Boolean);
  if (!sentences.length) return '';

  return `<div class="kashf-supporting-section">
    <p class="kashf-supporting-title">ניתוח תומך לפי ספר כשף אל-אסרר</p>
    <div class="kashf-supporting-body">${sentences.map(s => `<p class="kashf-supporting-item-prose">${s}</p>`).join('')}</div>
  </div>`;
}

// ── מפת הבתים המרכזיים ────────────────────────────────────────────────────

function writeKeyHousesPara(reading) {
  const { keyHouseReadings } = reading;
  if (!keyHouseReadings?.length) return '';

  const mainHouses = keyHouseReadings.filter(h => !h.error && h.houseNum <= 12);
  if (!mainHouses.length) return '';

  const rows = mainHouses.map(h => {
    const q  = qualityWord(h.quality);
    const dk = dakhalWord(h.dakhalKharij);
    const qClass = h.quality === 'saad' ? 'saad' : h.quality === 'nahs' ? 'nahs' : 'mixed';
    return `<div class="kashf-house-row">
      <span class="kashf-house-label">${h.houseName}</span>
      <span class="kashf-house-figure ${qClass}">
        ${h.figureName || ''} (${h.pattern || ''})
        <span class="kashf-house-meta">${q}${dk ? ` · ${dk}` : ''}</span>
      </span>
    </div>`;
  });

  return `<div class="kashf-reading-card key-houses">
    <h3 class="kashf-card-title">מפת הבתים המרכזיים</h3>
    ${rows.join('')}
  </div>`;
}

// ── פסקת עדים ודיין ───────────────────────────────────────────────────────

function writeWitnessJudgePara(reading) {
  const { keyHouseReadings } = reading;
  if (!keyHouseReadings?.length) return '';

  const h13 = keyHouseReadings.find(h => h.houseNum === 13);
  const h14 = keyHouseReadings.find(h => h.houseNum === 14);
  const h15 = keyHouseReadings.find(h => h.houseNum === 15);

  if (!h13 && !h14 && !h15) return '';

  const parts = [];

  if (h13 && h14) {
    const q13 = qualityWord(h13.quality);
    const q14 = qualityWord(h14.quality);
    parts.push(
      `שני העדים שמסכמים את הלוח: <strong>עד ראשון (בית 13)</strong> — ` +
      `${h13.figureName || ''} (${q13 || ''}); ` +
      `<strong>עד שני (בית 14)</strong> — ${h14.figureName || ''} (${q14 || ''}).`
    );
  } else if (h13) {
    parts.push(`עד ראשון (בית 13): ${h13.figureName || ''} — ${qualityWord(h13.quality) || ''}.`);
  } else if (h14) {
    parts.push(`עד שני (בית 14): ${h14.figureName || ''} — ${qualityWord(h14.quality) || ''}.`);
  }

  if (h15) {
    const q15 = qualityWord(h15.quality);
    const judgeVerdict =
      h15.quality === 'saad'  ? 'הדיין מיטיב — הוא מצביע על כיוון חיובי להכרעה הסופית' :
      h15.quality === 'nahs'  ? 'הדיין מזיק — הוא מורה על קושי וכיוון שלילי' :
                                 'הדיין ממוזג — ההכרעה אינה חד-משמעית';
    parts.push(
      `<strong>הדיין (בית 15)</strong>: ${h15.figureName || ''} (${h15.pattern || ''}) — ${q15}. ${judgeVerdict}.`
    );
    parts.push(
      'לפי ספר כשף אל-אסרר, הדיין הוא ה"מאזן" — ההכרעה הסופית של הלוח. ' +
      'הוא נוצר מחיבור שני העדים, ומורה על אחרית העניין יותר מכל בית אחר.'
    );
  }

  if (!parts.length) return '';

  return `<p class="kashf-prose-paragraph">${parts.join(' ')}</p>`;
}

// ── פסקת מסקנה ────────────────────────────────────────────────────────────

function writeConclusionPara(reading) {
  const {
    topicId, clientContext, overallPositive,
    primaryFormula, altFormula, keyHouseReadings,
  } = reading;

  const name = c(clientContext?.name);
  const fn   = firstName(name);
  const h15  = keyHouseReadings?.find(h => h.houseNum === 15);

  const TOPIC_GUIDANCE = {
    illness: {
      positive: 'הסימנים שעלו בלוח מצביעים על אפשרות החלמה. חשוב להמשיך בטיפול ולתת לגוף מנוחה מספקת. המחלה אינה בשיאה ויש סיכוי שתשכך.',
      negative: 'הלוח מורה על מצב קשה. המחלה חמורה ויש לא להתמהמה בטיפול. יש לפנות לרופא מנוסה בלא דיחוי ולא לזלזל בסימנים.',
      neutral:  'הלוח מורכב ואינו נותן תשובה חד-משמעית. מצב החולה מאוזן — יש גם סיכוי לריפוי וגם חשש. יש לעקוב בקפידה.',
    },
    marriage: {
      positive: 'הלוח מראה כיוון חיובי לנישואין. הדרך פתוחה, ועם הכוונה הנכונה — הקשר יכול לפרוח ולהצליח.',
      negative: 'הלוח מורה על קשיים. כדאי לבחון את הנסיבות לעומק לפני ההחלטה. לא כל קשר שנראה טוב מבחוץ מבורך מבפנים.',
      neutral:  'הלוח מעורב — יש סימנים טובים וגם מאתגרים. ההחלטה תלויה בנסיבות הפרטיות ובמה שכל צד מוכן לתת.',
    },
    travel: {
      positive: 'הנסיעה מבורכת לפי הלוח. הדרך פתוחה ויש יותר תמיכה מאשר מכשולים. יכול לצאת לדרך בטוח.',
      negative: 'הלוח מורה על קשיים בנסיעה. כדאי לשקול עיכוב או שינוי תכנון. אם חייבים לנסוע — להיזהר במיוחד.',
      neutral:  'הנסיעה אפשרית אך יש לה מכשולים. יש לתכנן היטב, לא לצאת ללא הכנה, ולהיות מוכן לשינויים בדרך.',
    },
    missingPerson: {
      positive: 'יש סיכוי טוב לחזרת הנעדר. הלוח מצביע על תנועה לכיוון הבית. יש לא לוותר ולהמשיך בחיפוש.',
      negative: 'הלוח מורה על חשש לגבי הנעדר. יש לאמץ את המאמצים בחיפוש ולפנות לכל הערוצים האפשריים.',
      neutral:  'מצב הנעדר אינו ברור מהלוח. יש להמשיך לחפש ולא לוותר — אך גם להכין את הלב לכל אפשרות.',
    },
    authorityState: {
      positive: 'המינוי או העמדה יתקיימו לפי הלוח. הזמן הוא זמן טוב לפעולה ולבקשת קידום.',
      negative: 'הלוח מורה על קשיים בשררה. כדאי לצפות למעבר ולא לעמדה יציבה כרגע. להתאזר בסבלנות.',
      neutral:  'מצב השררה מורכב. יש לפעול בזהירות, לבנות תמיכה לפני כל צעד, ולא להיגרר לעימות.',
    },
    commerce: {
      positive: 'הלוח מראה מסחר מבורך ורווחי. זה זמן טוב לעסקאות ולהשקעות.',
      negative: 'הלוח מורה על הפסדים. כדאי לדחות עסקאות גדולות לזמן אחר ולשמור על מה שיש.',
      neutral:  'המסחר אפשרי אך לא ודאי. יש לבדוק כל עסקה לפרטיה ולא לפעול מתוך שיקולים רגשיים.',
    },
    completion: {
      positive: 'הדבר שנשאל עליו ישולם ויצא לפועל. הלוח תומך במהלך — הזמן מתאים.',
      negative: 'הלוח מורה שהדבר לא יושלם בקלות. יש לבחון מחדש את האסטרטגיה ואת הנסיבות.',
      neutral:  'ההשלמה אפשרית אך עם עיכובים. סבלנות ויציבות יסייעו יותר מכל מאמץ נוסף.',
    },
    generalReading: {
      positive: 'המצב הכולל נוטה לטובה. הלוח מראה יותר תמיכה מאשר חסימה — זמן טוב לפעולה.',
      negative: 'המצב הכולל נוטה לקשיים. כדאי לפעול בזהירות, לא לקחת סיכונים מיותרים.',
      neutral:  'המצב מורכב ומעורב. יש לבחון כל תחום בנפרד ולא להסיק מסקנות כוללות.',
    },
    theft: {
      positive: 'יש סיכוי לאחזר את הגניבה. הלוח מצביע על פתח לשחזר את האבוד.',
      negative: 'הסיכוי לאחזר את הגניבה נמוך. כדאי לקבל את ההפסד ולבנות מחדש.',
      neutral:  'אחזור חלקי אפשרי. לא הכל אבוד, אך גם לא הכל יוחזר. לחפש פשרה.',
    },
    disputes: {
      positive: 'יש סיכוי לפיוס או לניצחון. הלוח מראה כוח לצד השואל.',
      negative: 'הסכסוך קשה. כדאי לחפש פשרה ולא לדחוף לעימות ישיר.',
      neutral:  'הסכסוך יכול ללכת לכל כיוון. פשרה היא האפשרות הטובה ביותר.',
    },
    loan: {
      positive: 'החוב יוחזר. הלוח מראה שהלווה מסוגל ורוצה להחזיר.',
      negative: 'יש קושי בהחזרת ההלוואה. כדאי לבקש ביטחונות נוספים ולא לחכות בשקט.',
      neutral:  'החזרה אפשרית אך עם עיכובים. סבלנות נדרשת.',
    },
    deathInheritance: {
      positive: 'הלוח מורה על ביטחון וירושה. אין לפחד — יש הגנה על השואל.',
      negative: 'הלוח מורה על חשש. יש לדאוג לעניינים מבעוד מועד ולא לדחות.',
      neutral:  'המצב מורכב ודורש בחינה נוספת.',
    },
    prisoner: {
      positive: 'יש סיכוי לשחרור. הלוח מצביע על תנועה לכיוון החופש.',
      negative: 'הלוח מורה על המשך מאסר. יש לחפש דרכים חוקיות לשינוי המצב.',
      neutral:  'שחרור אפשרי עם תנאים. יש לפעול דרך הערוצים הנכונים.',
    },
    siblings: {
      positive: 'הקשר עם האח טוב. יש הסכמה ותמיכה הדדית.',
      negative: 'קיים קלקול ביחסים. כדאי לפנות לדיאלוג ולא לעימות.',
      neutral:  'היחסים מורכבים. זמן ודיאלוג יכולים לשפר.',
    },
    relocation: {
      positive: 'המעבר מבורך. המקום החדש יביא איתו שינוי לטובה.',
      negative: 'המעבר אינו מומלץ בזמן הזה. כדאי להמתין לזמן מתאים יותר.',
      neutral:  'המעבר אפשרי אך לא ברור אם הוא מבורך.',
    },
    children: {
      positive: 'הלוח מורה על אפשרות טובה להריון. הזמן מתאים לעניין זה.',
      negative: 'הלוח מורה על קשיים. כדאי לחכות לזמן טוב יותר.',
      neutral:  'האפשרות קיימת אך לא ודאית. יש להמשיך לנסות.',
    },
    religion: {
      positive: 'הלוח מורה על אדם בעל אמונה ויראת שמים.',
      negative: 'הלוח מורה על ריחוק מדת ואמונה.',
      neutral:  'האמונה מעורבת — יש גם יש.',
    },
    money: {
      positive: 'הממון נכנס. זמן טוב לרכוש ולהרוויח.',
      negative: 'הממון יוצא. כדאי לשמור ולא לבזבז.',
      neutral:  'מצב הממון מאוזן. אין ריווח גדול ואין הפסד גדול.',
    },
    missingAnimal: {
      positive: 'יש סיכוי לאיתור הבהמה. הלוח מצביע על אפשרות מציאה.',
      negative: 'הסיכוי לאיתור נמוך לפי הלוח.',
      neutral:  'מצב לא ודאי — יש לחפש באופן פעיל.',
    },
  };

  const dir = overallPositive === true ? 'positive' : overallPositive === false ? 'negative' : 'neutral';
  const guidance = TOPIC_GUIDANCE[topicId]?.[dir]
    || (dir === 'positive' ? 'הכיוון הכללי טוב.' : dir === 'negative' ? 'הכיוון הכללי מאתגר.' : 'הכיוון הכללי מורכב.');

  const judgeNote = h15
    ? (() => {
        const fig = h15.figureName;
        if (h15.quality === 'saad') {
          return overallPositive === false
            ? ` אולם הדיין — הצורה ${fig} — מרמז על אפשרות שיפור בהמשך הדרך.`
            : ` הדיין — הצורה ${fig} — מחזק את הכיוון החיובי.`;
        }
        if (h15.quality === 'nahs') {
          return overallPositive === true
            ? ` אולם הדיין — הצורה ${fig} — מזהיר מפני קשיים אפשריים בהמשך.`
            : ` הדיין — הצורה ${fig} — מדגיש את הקושי שבמצב.`;
        }
        return ` הדיין — הצורה ${fig} — מוסיף מורכבות להכרעה.`;
      })()
    : '';

  const opening = fn ? `${fn} — ` : '';

  return `<p class="kashf-prose-paragraph kashf-conclusion"><strong>מסקנת הקריאה:</strong> ${opening}${guidance}${judgeNote}</p>`;
}

// ── פונקציה ראשית ─────────────────────────────────────────────────────────

/**
 * מפיק HTML מלא עבור קריאת חשיפת הסודות הנצורים (כשף אל-אסרר).
 *
 * @param {object} reading - תוצר buildKashfReading
 * @returns {string} HTML
 */
export function writeKashfReading(reading) {
  if (!reading || !reading.valid) {
    return `<div class="kashf-reading-error">שגיאה בקריאה: ${reading?.error || 'נתונים חסרים'}</div>`;
  }

  const sections = [
    writeHeader(reading),
    writeBoardWarnings(reading),
    writeOpeningPara(reading),
    writeVerdictPara(reading),
    writeAltPara(reading),
    writeSupportingPara(reading),
    writeKeyHousesPara(reading),
    writeWitnessJudgePara(reading),
    writeConclusionPara(reading),
    `<div class="kashf-reading-footer">
      <p>חשיפת הסודות הנצורים (כשף אל-אסרר) · ${reading.topicHebrewName} · ספר כשף אל-אסרר — השער השישי</p>
      <p class="kashf-disclaimer">הקריאה מבוססת אך ורק על ספר "כשף אל-אסרר" — השער השישי (עמ׳ 166–276). אין להסתמך עליה כהחלטה יחידה בעניינים חשובים.</p>
    </div>`,
  ];

  return `<div class="kashf-reading-output">${sections.filter(Boolean).join('\n')}</div>`;
}

export default { writeKashfReading };
