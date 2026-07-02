/**
 * kashf-narrative-writer.js
 *
 * כותב נרטיב עברי מלא מתוצאת מנוע הקריאה.
 * מפיק HTML מובנה עם קטעים לפי שיטת כשף אל-אסרר.
 *
 * מקורות:
 *   כשף אל-אסרר המצונה — פרקים 1-12 של "השער השישי" (עמ׳ 166-276)
 */

// ── עזרי HTML ─────────────────────────────────────────────────────────────

function card(title, body, cls = '') {
  return `<div class="kashf-reading-card ${cls}">${title ? `<h3 class="kashf-card-title">${title}</h3>` : ''}${body}</div>`;
}

function verdictBadge(positive) {
  if (positive === true)  return '<span class="kashf-verdict-badge positive">מיטיב ✦</span>';
  if (positive === false) return '<span class="kashf-verdict-badge negative">מזיק ✦</span>';
  return '<span class="kashf-verdict-badge neutral">ספק ✦</span>';
}

function figureTag(pattern, name) {
  if (!pattern) return '';
  return `<span class="kashf-figure-tag">${name || pattern} <code>${pattern}</code></span>`;
}

function houseRow(h) {
  const qualClass = h.quality === 'saad' ? 'saad' : h.quality === 'nahs' ? 'nahs' : 'mixed';
  return `<div class="kashf-house-row">
    <span class="kashf-house-label">${h.houseName}</span>
    <span class="kashf-house-figure ${qualClass}">${h.figureName || h.pattern}
      <span class="kashf-house-meta">${h.qualityHebrew} · ${h.dakhalKharijHebrew}</span>
    </span>
  </div>`;
}

function sourceQuote(text) {
  if (!text) return '';
  return `<blockquote class="kashf-source-quote">"${text}"</blockquote>`;
}

// ── כותב קטע נוסחה ────────────────────────────────────────────────────────

function writePrimaryVerdictSection(reading) {
  const { primaryFormula, topicHebrewName } = reading;
  if (!primaryFormula) return '';

  const { result, verdict, sourceText, houses, type } = primaryFormula;
  if (!verdict) return '';

  const housesLabel = houses ? `בתים ${houses.join(' + ')}` : '';
  let formulaDesc = '';

  if (type === 'fire-row-assemble') {
    formulaDesc = `<p class="kashf-formula-desc">נוסחת "ראש" — לוקחים שורת-האש מ: ${housesLabel}</p>`;
  } else if (type === 'assemble') {
    formulaDesc = `<p class="kashf-formula-desc">נוסחת "העמד מהם צורה" — מ: ${housesLabel}</p>`;
  } else if (type === 'combine') {
    formulaDesc = `<p class="kashf-formula-desc">נוסחת חיבור — מ: ${housesLabel}</p>`;
  } else if (type === 'house-quality') {
    formulaDesc = `<p class="kashf-formula-desc">הערכת בית ${houses?.[0]} ישירות</p>`;
  }

  let resultLine = '';
  if (result?.resultPattern) {
    resultLine = `<p class="kashf-result-figure">הצורה שיצאה: ${figureTag(result.resultPattern, result.resultFigureName)}</p>`;
    if (result.classification) {
      resultLine += `<p class="kashf-result-class">${result.classification.dakhalKharijHebrew} · ${result.classification.saadNahsHebrew}</p>`;
    }
  } else if (result?.counts) {
    const { saad, nahs, mixed } = result.counts;
    resultLine = `<p class="kashf-result-figure">ספירת בתים: מיטיב ${saad} · מזיק ${nahs} · ממוזג ${mixed}</p>`;
  }

  const body = `
    ${formulaDesc}
    ${resultLine}
    <div class="kashf-verdict-main">
      ${verdictBadge(verdict.positive)}
      <p class="kashf-verdict-text">${verdict.text}</p>
    </div>
    ${sourceQuote(sourceText)}
  `;

  return card(`פסיקת הנוסחה הראשית — ${topicHebrewName}`, body, 'primary-verdict');
}

function writeAltVerdictSection(reading) {
  const { altFormula } = reading;
  if (!altFormula || !altFormula.verdict) return '';

  const { result, verdict, sourceText, houses, type } = altFormula;
  let formulaDesc = '';
  if (houses) formulaDesc = `<p class="kashf-formula-desc">נוסחה חלופית — בתים ${houses.join(' + ')}</p>`;

  let resultLine = '';
  if (result?.resultPattern) {
    resultLine = `<p class="kashf-result-figure">הצורה: ${figureTag(result.resultPattern, result.resultFigureName)}</p>`;
  }

  const body = `
    ${formulaDesc}
    ${resultLine}
    <div class="kashf-verdict-alt">
      ${verdictBadge(verdict.positive)}
      <p class="kashf-verdict-text">${verdict.text}</p>
    </div>
    ${sourceQuote(sourceText)}
  `;

  return card('נוסחה חלופית — בדיקה משלימה', body, 'alt-verdict');
}

// ── כותב בדיקות תומכות ────────────────────────────────────────────────────

function writeSupportingFinding(finding) {
  if (finding.error) {
    return `<div class="kashf-supporting-item error"><strong>${finding.label}</strong>: שגיאה — ${finding.error}</div>`;
  }

  let detail = '';
  const { checkType } = finding;

  if (checkType === 'house-quality') {
    const cls = finding.quality === 'saad' ? 'saad' : finding.quality === 'nahs' ? 'nahs' : 'mixed';
    detail = `בית ${finding.houseNum}: ${figureTag('', finding.figureName)} — <span class="${cls}">${finding.qualityHebrew}</span>`;
  } else if (checkType === 'count-quality') {
    const { counts, summary } = finding;
    detail = `${summary} (מיטיב: ${counts?.saad}, מזיק: ${counts?.nahs}, ממוזג: ${counts?.mixed})`;
  } else if (checkType === 'house-dakhal-kharij') {
    detail = `בית ${finding.houseNum}: ${finding.dakhalKharijHebrew}`;
  } else if (checkType === 'house-gender') {
    detail = `בית ${finding.houseNum}: ${finding.genderHebrew}`;
  } else if (checkType === 'house-element') {
    detail = `בית ${finding.houseNum}: יסוד ${finding.elementHebrew} — כיוון ${finding.direction}`;
  } else if (checkType === 'element-pair') {
    detail = `סוג מחלה: ${finding.illnessType || '—'}`;
  } else if (checkType === 'house-figure-description') {
    detail = `בית ${finding.houseNum}: ${figureTag(finding.pattern, finding.figureName)} — ${finding.classification?.dakhalKharijHebrew || ''}`;
  } else if (checkType === 'house-in-house-check') {
    detail = finding.matches
      ? `בית ${finding.mainHouse} נמצא בבית ${finding.targetHouse} — הדין חל`
      : `בית ${finding.mainHouse} אינו בבית ${finding.targetHouse}`;
  }

  return `<div class="kashf-supporting-item">
    <div class="kashf-supporting-label">${finding.label}</div>
    <div class="kashf-supporting-detail">${detail}</div>
    ${sourceQuote(finding.sourceText)}
  </div>`;
}

function writeSupportingSections(reading) {
  const { supportingFindings } = reading;
  if (!supportingFindings || supportingFindings.length === 0) return '';

  const items = supportingFindings.map(writeSupportingFinding).join('');
  return card('ניתוח מעמיק — בדיקות תומכות', items, 'supporting');
}

// ── תיאור בתים מרכזיים ────────────────────────────────────────────────────

function writeKeyHousesSection(reading) {
  const { keyHouseReadings } = reading;
  if (!keyHouseReadings || keyHouseReadings.length === 0) return '';

  const rows = keyHouseReadings
    .filter(h => !h.error)
    .map(houseRow)
    .join('');

  if (!rows) return '';
  return card('מפת הבתים המרכזיים', rows, 'key-houses');
}

// ── כותב אזהרות לוח ───────────────────────────────────────────────────────

function writeBoardWarnings(reading) {
  const { boardValidation } = reading;
  if (!boardValidation || boardValidation.warnings?.length === 0) return '';

  const items = (boardValidation.warnings || []).map(w =>
    `<div class="kashf-board-warning ${w.severity}">
      <strong>${w.severity === 'critical' ? '⚠ חריג חמור' : '⚑ הערה'}</strong>:
      ${w.hebrewMessage}
    </div>`
  ).join('');

  return card('הערות על הלוח', items, 'board-warnings');
}

// ── כותב כותרת ראשית ──────────────────────────────────────────────────────

function writeHeader(reading) {
  const { topicHebrewName, topicDescription, sourceRef, clientContext, overallPositive } = reading;

  const clientLine = clientContext?.name
    ? `<p class="kashf-client-line">לקוח: <strong>${clientContext.name}</strong>${clientContext.age ? `, גיל ${clientContext.age}` : ''}</p>`
    : '';

  const questionLine = clientContext?.question
    ? `<p class="kashf-question-line">שאלה: <em>${clientContext.question}</em></p>`
    : '';

  const overallBadge = overallPositive === true
    ? '<div class="kashf-overall positive">◈ הלוח נוטה לטובה</div>'
    : overallPositive === false
      ? '<div class="kashf-overall negative">◈ הלוח נוטה לאי-טובה</div>'
      : '<div class="kashf-overall neutral">◈ הלוח מורכב</div>';

  return `<div class="kashf-reading-header">
    <div class="kashf-reading-title">
      <span class="kashf-reading-badge">גורל החול · שיטת כשף</span>
      <h2>${topicHebrewName}</h2>
      ${topicDescription ? `<p class="kashf-topic-desc">${topicDescription}</p>` : ''}
    </div>
    ${clientLine}
    ${questionLine}
    ${overallBadge}
    <div class="kashf-source-ref">מקור: ${sourceRef}</div>
  </div>`;
}

// ── כותב מקור הסיום ────────────────────────────────────────────────────────

function writeFooter(reading) {
  const { sourceRef, topicHebrewName } = reading;
  return `<div class="kashf-reading-footer">
    <p>גורל החול · ${topicHebrewName} · ${sourceRef}</p>
    <p class="kashf-disclaimer">הקריאה מבוססת על ספר "כשף אל-אסרר המצונה" בלבד. אין להסתמך עליה כהחלטה יחידה בעניינים חשובים.</p>
  </div>`;
}

// ── פונקציה ראשית ─────────────────────────────────────────────────────────

/**
 * מפיק HTML מלא עבור קריאת כשף.
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
    writePrimaryVerdictSection(reading),
    writeAltVerdictSection(reading),
    writeSupportingSections(reading),
    writeKeyHousesSection(reading),
    writeFooter(reading),
  ];

  return `<div class="kashf-reading-output">${sections.filter(Boolean).join('\n')}</div>`;
}

export default { writeKashfReading };
