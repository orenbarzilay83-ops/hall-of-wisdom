/**
 * kashf-canonical-narrative-writer.js
 *
 * P0 renderer for the canonical Kashf path.
 *
 * Unlike kashf-narrative-writer.js, this writer is METHOD-scoped rather than
 * TOPIC-scoped. It must not add topic-level guidance, alt formulas, broad
 * supporting checks, Dhamir, witnesses, or any other material that was not
 * executed by the selected canonical method.
 */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function verdictClass(positive) {
  if (positive === true) return 'positive';
  if (positive === false) return 'negative';
  return 'neutral';
}

function verdictHeading(positive) {
  if (positive === true) return 'תשובת כשף: חיובית';
  if (positive === false) return 'תשובת כשף: שלילית';
  return 'תשובת כשף: אינה חד־משמעית';
}

function resultSummary(reading) {
  const result = reading?.primaryFormula?.result;
  if (!result) return '';

  const figure = escapeHtml(result.resultFigureName || result.resultPattern || '');
  const pattern = result.resultPattern ? ` (${escapeHtml(result.resultPattern)})` : '';
  const classification = result.classification || {};
  const detail = classification.dakhalKharijHebrew
    || classification.saadNahsHebrew
    || '';

  if (!figure && !detail) return '';
  return `${figure}${pattern}${detail ? ` — ${escapeHtml(detail)}` : ''}`;
}

function sourceLabel(reading) {
  const pages = reading?.source?.sourcePages || [];
  if (!pages.length) return 'כשף אל-אסרר';
  return `כשף אל-אסרר, עמ׳ ${pages.map(escapeHtml).join('–')}`;
}

/**
 * Render only evidence produced by ONE canonical method.
 *
 * @param {object} reading output of buildKashfReadingByQuestionId/ByMethod
 * @returns {string} HTML
 */
export function writeCanonicalKashfReading(reading) {
  if (!reading || reading.valid !== true) {
    const message = escapeHtml(
      reading?.userMessage
      || reading?.error
      || 'שיטת כשף לשאלה זו אינה זמינה כרגע להפעלה.'
    );
    return `<div class="kashf-reading-output canonical-kashf-reading blocked">
      <div class="kashf-reading-error">${message}</div>
    </div>`;
  }

  const verdict = reading.verdict || reading.primaryFormula?.verdict || {};
  const positive = verdict.positive;
  const cls = verdictClass(positive);
  const heading = verdictHeading(positive);
  const verdictText = escapeHtml(verdict.text || 'ללא הכרעה מפורשת');
  const question = escapeHtml(reading.clientContext?.question || '');
  const name = escapeHtml(reading.clientContext?.name || '');
  const result = resultSummary(reading);
  const formula = reading.primaryFormula || {};
  const houses = Array.isArray(formula.houses) ? formula.houses.join(', ') : '';
  const sourceText = escapeHtml(formula.sourceText || '');
  const source = escapeHtml(sourceLabel(reading));

  const lead = name
    ? `${name}${question ? ` — בתשובה לשאלה: „${question}”` : ''}`
    : (question ? `השאלה: „${question}”` : '');

  const execution = reading.canonicalExecution || {};
  const methodId = escapeHtml(reading.kashfMethodId || '');
  const intentId = escapeHtml(reading.kashfIntentId || '');

  return `<div class="kashf-reading-output canonical-kashf-reading">
    <div class="verdict-box ${cls}" style="direction:rtl;">
      <div class="verdict-title">${escapeHtml(heading)}</div>
      <div class="verdict-body">${verdictText}</div>
    </div>

    <div class="client-reading-panel" style="direction:rtl; margin:18px 0 10px; border:2px solid #b8860b; border-radius:8px; background:#fffef5; padding:18px 20px;">
      <div style="font-weight:700; font-size:13px; color:#7a5c00; letter-spacing:0.5px; margin-bottom:10px; border-bottom:1px solid #e8d080; padding-bottom:6px;">📖 קרא ללקוח</div>
      <div style="font-size:16px; line-height:2; color:#2c2c2c;">
        ${lead ? `<p style="margin:0 0 8px;">${lead}</p>` : ''}
        <p style="margin:0;"><strong>הפסיקה:</strong> ${verdictText}</p>
        ${result ? `<p style="margin:8px 0 0;">הצורה שהתקבלה: ${result}.</p>` : ''}
      </div>
    </div>

    <button class="details-toggle" onclick="const p=this.nextElementSibling;p.hidden=!p.hidden;this.textContent=p.hidden?'קרא עוד ▼':'סגור ▲'">קרא עוד ▼</button>
    <div hidden>
      <div class="details-panel" style="direction:rtl;">
        <p><strong>השיטה הקנונית:</strong> ${methodId}</p>
        <p><strong>כוונת כשף:</strong> ${intentId}</p>
        ${houses ? `<p><strong>בתי החישוב:</strong> ${escapeHtml(houses)}</p>` : ''}
        ${sourceText ? `<p><strong>כלל המקור:</strong> ${sourceText}</p>` : ''}
        <p><strong>מקור:</strong> ${source}</p>
        <p><strong>בקרת ניתוב:</strong> הופעלה שיטה קנונית אחת בלבד${Array.isArray(execution.methodsExecuted) ? ` (${escapeHtml(execution.methodsExecuted.join(', '))})` : ''}.</p>
      </div>
    </div>

    <div class="kashf-reading-footer">
      <p>${source}</p>
      <p class="kashf-disclaimer">הקריאה מבוססת על השיטה הקנונית שנבחרה מן המקור לשאלה זו בלבד. אין להסתמך עליה כהחלטה יחידה בעניינים חשובים.</p>
    </div>
  </div>`;
}

export default { writeCanonicalKashfReading };
