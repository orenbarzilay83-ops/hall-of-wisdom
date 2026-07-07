/**
 * kashf-narrative-writer.js — נרטיב מלא לשיטת חשיפת הסודות הנצורים (כשף אל-אסרר)
 *
 * מפיק HTML מלא: כותרת, פסקאות נרטיב עשירות, ניתוח עדים ודיין, ומסקנה.
 * מקור יחיד: ספר כשף אל-אסרר — השער השישי (עמ׳ 166–276).
 */

import { getFigureAppearance } from './kashf-figure-appearance.js';
import { getSaadNahs } from './kashf-figure-classifier.js';
import { HOUSE_NAMES } from './kashf-reading-engine.js';

// שם הבית + נושאו (למשל "בית שני — הממון") — אותה טבלת בתים המשמשת בכל
// האפליקציה (kashf-reading-engine.js), רק מציגים כאן את חלק הנושא בלבד.
function houseTopicOnly(houseNum) {
  const full = HOUSE_NAMES[houseNum] || '';
  const idx = full.indexOf('—');
  return idx === -1 ? full : full.slice(idx + 1).trim();
}

// ── עזרי טקסט ─────────────────────────────────────────────────────────────

function c(val = '') { return String(val || '').trim(); }

// הלקוח לא אמור לראות ציטוטי עמוד, "מקור:", או מילים בערבית בתוך הקריאה —
// אלו שייכים לקוד/למקורות בלבד. כמה פונקציות ב-kashf-pending-extraction.js
// אורגות ציטוט עמוד בסוגריים לתוך ה-outputHebrew עצמו (למשל "...מתפייס
// (כשף עמ' 271)"); המקור נשאר מתועד בקוד/ב-sourceText של הבדיקה. מסירים כל
// סוגריים/מרובעים שמכילים ציטוט עמוד (לא רק "כשף עמ'"), וכל טקסט ערבי, בעת
// התצוגה בלבד.
function stripInlineCitations(text) {
  return String(text || '')
    .replace(/\s*[[(][^\])]*עמ['׳״][^\])]*[\])]/g, '')
    .replace(/[؀-ۿ]+/g, '')
    .replace(/\s*\(\s*\d+\s*נקודות\s*\)/g, '')
    .replace(/\s*→\s*/g, ' — ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

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

  const { type, houses, result, verdict } = primaryFormula;
  const fn = firstName(c(clientContext?.name));

  const formulaDesc = describeFormulaType(type, houses);
  const resultDesc  = describeFormulaResult(result);
  const verdictText = stripInlineCitations(verdict?.text || '');

  const parts = [];
  parts.push(`לפי כללי ספר כשף אל-אסרר, ${formulaDesc}.`);
  if (resultDesc) parts.push(resultDesc + '.');
  if (verdictText) parts.push(`<strong>הפסיקה:</strong> ${verdictText}.`);

  return `<p class="kashf-prose-paragraph">${parts.join(' ')}</p>`;
}

// ── פסקת נוסחה חלופית ────────────────────────────────────────────────────

function writeAltPara(reading) {
  const { altFormula } = reading;
  if (!altFormula?.verdict) return '';

  const { type, houses, result, verdict } = altFormula;
  const formulaDesc = describeFormulaType(type, houses);
  const resultDesc  = describeFormulaResult(result);
  const verdictText = stripInlineCitations(verdict?.text || '');

  const parts = [`<strong>בדיקת אימות נוספת:</strong> ${formulaDesc}.`];
  if (resultDesc) parts.push(resultDesc + '.');
  if (verdictText) parts.push(verdictText + '.');

  return `<p class="kashf-prose-paragraph">${parts.join(' ')}</p>`;
}

// ── פסקת ניתוח תומך ───────────────────────────────────────────────────────

function findingSentence(f) {
  if (f.error) return null;

  if (f.checkType === 'house-quality') {
    const q = qualityWord(f.quality);
    const fig = f.figureName || '';
    return `<strong>${f.label}:</strong> בית ${f.houseNum} הכיל את הצורה ${fig}${q ? ` — ${q}` : ''}.`;
  }
  if (f.checkType === 'count-quality') {
    const houses = (f.houses || []).join(', ');
    return `<strong>${f.label}</strong> (בתים ${houses}): ${f.summary}.`;
  }
  if (f.checkType === 'house-element') {
    return `<strong>${f.label}:</strong> יסוד בית ${f.houseNum} הוא ${f.elementHebrew || ''} — כיוון ${f.direction || ''}.`;
  }
  if (f.checkType === 'element-pair') {
    const illnessClean = (f.illnessType || '—').replace(/\s*\(כשף.*?\)/g, '');
    return `<strong>${f.label}:</strong> ${illnessClean}.`;
  }
  if (f.checkType === 'house-in-house-check') {
    const res = f.matches
      ? `בית ${f.mainHouse} נמצא בבית ${f.targetHouse} — הדין חל`
      : `בית ${f.mainHouse} אינו בבית ${f.targetHouse}`;
    return `<strong>${f.label}:</strong> ${res}.`;
  }
  if (f.checkType === 'house-figure-description') {
    const app = getFigureAppearance(f.pattern);
    const fig = f.figureName || '';
    let text = `<strong>${f.label}:</strong> הצורה <strong>${fig}</strong> בבית ${f.houseNum}`;
    if (app) {
      text += ` — ${app.appearance}`;
      if (app.occupation) text += `; עיסוק: ${app.occupation}`;
      if (app.nameLetters?.length) {
        const letters = app.nameLetters.join(', ');
        text += `. <em>אותיות השם: ${letters}</em>`;
      }
    }
    return text + '.';
  }
  if (f.checkType === 'house-gender') {
    return `<strong>${f.label}:</strong> בית ${f.houseNum} — ${f.genderHebrew || ''}.`;
  }
  if (f.checkType === 'house-dakhal-kharij') {
    return `<strong>${f.label}:</strong> בית ${f.houseNum} — ${f.dakhalKharijHebrew || ''}.`;
  }
  if (f.checkType === 'pattern-lookup') {
    return `<strong>${f.label}:</strong> בית ${f.houseNum} — ${f.valueLabel || ''}.`;
  }
  if (f.checkType === 'figure-in-house-group') {
    const housesStr = (f.houses || []).join(', ');
    const res = f.found
      ? `נמצאה באחד הבתים (${(f.foundHouses || []).join(', ')} מתוך ${housesStr})`
      : `לא נמצאה באף אחד מהבתים (${housesStr})`;
    return `<strong>${f.label}:</strong> ${res}.`;
  }
  if (f.checkType === 'legacy-fn') {
    if (!f.outputHebrew) return null;
    const body = stripInlineCitations(f.outputHebrew).split('\n').map(stripInlineCitations).filter(Boolean).join('<br>');
    return `<strong>${f.label}:</strong><br>${body}`;
  }
  return `<strong>${f.label}:</strong> ${f.summary || f.dakhalKharijHebrew || f.qualityHebrew || '—'}.`;
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

// ── מחשבת השואל (דמיר) ────────────────────────────────────────────────────
// השער הרביעי בכשף אל-אסרר, עמ' 151-155 — עצמאי מהנושא הנבחר.

function writeDhamirPara(reading) {
  const { dhamir } = reading;
  const winner = dhamir?.winner;
  if (!winner) return '';

  const q = qualityWord(winner.pattern ? getSaadNahs(winner.pattern) : null);
  const houseLabel = `בית ${winner.houseNumber}`;
  const houseTopic = houseTopicOnly(winner.houseNumber);
  const meaningNote = houseTopic && winner.houseNumber !== 1
    ? `<p class="kashf-dhamir-meaning">כלומר: מה שבאמת מעסיק את השואל הוא <strong>${houseTopic}</strong> — גם אם השאלה שנשאלה עסקה בנושא אחר.</p>`
    : (winner.houseNumber === 1
      ? `<p class="kashf-dhamir-meaning">כלומר: מה שבאמת מעסיק את השואל הוא מצבו האישי הכללי — בלי נושא צדדי נסתר.</p>`
      : '');
  const agreementNote = winner.agreementCount > 1
    ? `<span class="kashf-dhamir-agreement">${winner.agreementCount} משיטות ההכרעה הסכימו על בית זה (${winner.methodsAgreed.join(', ')})</span>`
    : `<span class="kashf-dhamir-agreement">לפי שיטת "${winner.methodHebrew}"</span>`;

  const extras = reading.dhamirExtras || {};
  const extraLines = [
    extras.sodHaDhamirim,
    extras.honestyCheck,
    extras.querentSubject,
    extras.timingByThirds,
    extras.temperament,
    extras.timingByMadad,
    extras.timingEstimate,
  ]
    .filter((x) => x && x.outputHebrew && !x.error)
    .map((x) => `<p class="kashf-dhamir-extra">${stripInlineCitations(x.outputHebrew).split('\n').map(stripInlineCitations).filter(Boolean).join('<br>')}</p>`)
    .join('');

  return `<div class="kashf-reading-card dhamir">
    <h3 class="kashf-card-title">מחשבת השואל (הדמיר)</h3>
    <p class="kashf-dhamir-body">
      מחשבת השואל האמיתית מתגלה ב<strong>${houseLabel}</strong> — הצורה <strong>${winner.nameHebrew || ''}</strong> (${winner.pattern || ''})${q ? ` — ${q}` : ''}.
      ${agreementNote}
    </p>
    ${meaningNote}
    ${extraLines}
  </div>`;
}

// ── שער 4 סוג 4: משלים חיצוני (לא כשף אל-אסרר) ───────────────────────────
// חושב ב-kashf-reading-engine.js (reading.dhamirType4External) אך אינו
// מוצג בקריאה — כל תוכנו הוא שרשור חישוב-מספר-לאות שאין דרך להציג ללקוח
// בלי לחשוף את החישוב עצמו. נשאר זמין לשימוש פנימי בלבד.

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
    const wt = reading.witnessTestimony;
    if (wt && !wt.error) {
      if (wt.w13?.hebrewSummary) parts.push(`עדות עד ראשון (בית 13, על בית השואל ובית התשיעי): ${stripInlineCitations(wt.w13.hebrewSummary)}.`);
      if (wt.w14?.hebrewSummary) parts.push(`עדות עד שני (בית 14, על בתי הילדים/מחלה/תקווה): ${stripInlineCitations(wt.w14.hebrewSummary)}.`);
    }
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

// ── תיבת תשובה קצרה (כן/לא/לא ודאי) ─────────────────────────────────────────
// אותה שפת עיצוב כמו לוח חאווי (verdict-box/verdict-label/verdict-answer/verdict-detail).

function writeShortVerdictBox(reading) {
  const { overallPositive, primaryFormula, clientContext } = reading;
  const question = c(clientContext?.question);
  const verdictText = overallPositive === true ? 'כן' : overallPositive === false ? 'לא' : 'לא ודאי';
  const vClass = overallPositive === true ? 'verdict-yes' : overallPositive === false ? 'verdict-no' : 'verdict-maybe';
  const detail = stripInlineCitations(primaryFormula?.verdict?.text || '');

  const questionLine = question
    ? `<p style="direction:rtl; text-align:center; font-size:14px; color:#444; margin:0 0 8px;">השאלה שנשאלה: <em>${question}</em></p>`
    : '';

  return `${questionLine}<div class="verdict-box ${vClass}">
    <div class="verdict-label">תשובה לשאלה</div>
    <div class="verdict-answer">${verdictText}</div>
    ${detail ? `<div class="verdict-detail">${detail}</div>` : ''}
  </div>`;
}

// ── עובדה מזהה מתוך הבדיקות התומכות (למשל "מי האויב", "תיאור הגנב") ─────────
// כדי שהמסקנה הקצרה תיתן מידע קונקרטי ולא רק פסיקה כללית.

function findKeyDescriptiveFact(reading) {
  const findings = reading.supportingFindings || [];
  const f = findings.find((x) => x.checkType === 'house-figure-description' && !x.error);
  if (!f) return '';
  const app = getFigureAppearance(f.pattern);
  if (!app?.appearance) return '';
  let text = app.appearance;
  if (app.occupation) text += `; עיסוק: ${app.occupation}`;
  return `<strong>${f.label}:</strong> ${text}.`;
}

// ── פסקת מסקנה (קרא ללקוח) ──────────────────────────────────────────────────
// אותה שפת עיצוב כמו לוח חאווי (client-reading-panel).

function writeConclusionPara(reading) {
  const {
    topicId, clientContext, overallPositive,
    primaryFormula, altFormula, keyHouseReadings,
  } = reading;

  const name     = c(clientContext?.name);
  const fn       = firstName(name);
  const h15      = keyHouseReadings?.find(h => h.houseNum === 15);
  const isFemale = clientContext?.gender === 'female' || clientContext?.gender === 'נקבה';

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
      positive: `הנסיעה מבורכת לפי הלוח. הדרך פתוחה ויש יותר תמיכה מאשר מכשולים. ${isFemale ? 'יכולה' : 'יכול'} לצאת לדרך בטוח.`,
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
    lostAnimal: {
      positive: 'יש סיכוי טוב שהבהמה תשוב. הלוח מצביע על אפשרות מציאה.',
      negative: 'הסיכוי לאיתור נמוך לפי הלוח. כדאי להיערך לאפשרות שהיא לא תחזור.',
      neutral:  'מצב לא ודאי — כדאי להמשיך לחפש באופן פעיל ולא להתייאש מוקדם מדי.',
    },
    enemies: {
      positive: 'אין אויב ממשי, או שהשואל הוא הצד החזק במאבק. אין סיבה לפחד.',
      negative: 'יש אויב ממשי, והלוח מורה שהוא הצד החזק כרגע. כדאי לנהוג בזהירות ולא לחשוף מהלכים.',
      neutral:  'המצב מול האויב מעורב — לא הפסד ברור ולא ניצחון ברור. כדאי לשמור על ערנות מבלי להיגרר לעימות מיותר.',
    },
    fear: {
      positive: 'הפחד גדול מהמציאות. אין בסיס ממשי לסכנה, ואפשר להירגע.',
      negative: 'יש בסיס ממשי לחשש. כדאי לנהוג בזהירות ולא לזלזל בסימנים.',
      neutral:  'המצב מעורב — יש לשים לב לסימנים מבלי להיכנס לבהלה.',
    },
    hiddenTreasure: {
      positive: 'הדבר הנסתר נמצא במקומו ונגיש. יש סיכוי טוב למצוא אותו.',
      negative: 'הדבר הנסתר אינו במקומו, או שהגישה אליו קשה. כדאי לא להשקיע מאמץ מיותר בחיפוש הזה.',
      neutral:  'המצב אינו ודאי — ייתכן שהדבר קיים אך מציאתו תדרוש מאמץ נוסף.',
    },
    motherRules: {
      positive: 'מצב האם טוב ויציב. אין סיבה לדאגה מיוחדת בעת הזאת.',
      negative: 'מצב האם קשה. כדאי לתת תשומת לב ותמיכה בעת הזאת.',
      neutral:  'מצב האם מעורב — יש גם טוב וגם קושי. כדאי לעקוב מקרוב.',
    },
    parentsProperty: {
      positive: 'מצב ההורים והנכסים טוב. יש יציבות ואין סיבה לדאגה.',
      negative: 'יש קושי במצב ההורים או בנכסים. כדאי לבדוק את המצב מקרוב ולא לדחות טיפול נדרש.',
      neutral:  'המצב מעורב — יש יציבות בחלק אחד וקושי באחר.',
    },
    partnership: {
      positive: 'השותפות טובה ומומלצת. יש בסיס טוב לשיתוף פעולה.',
      negative: 'השותפות מזיקה או בעייתית. כדאי לחשוב פעמיים לפני שממשיכים בה.',
      neutral:  'השותפות מעורבת — יש בה גם יתרונות וגם חסרונות. כדאי לבחון את התנאים לעומק לפני החלטה.',
    },
    spiritualDiagnostics: {
      positive: 'אין סימנים לפעולה רוחנית שלילית. הקשיים נובעים מסיבות טבעיות ולא מכישוף או עין הרע.',
      negative: 'יש סימנים לפעולה רוחנית שלילית. מומלץ לפנות לבעל ידע מתאים ולא להתמודד עם זה לבד.',
      neutral:  'הסימנים אינם חד-משמעיים. כדאי לעקוב אחר הסימפטומים ולא למהר למסקנות.',
    },
    yearlyForecast: {
      positive: 'התחזית לשנה טובה — יש סימני זול ושפע.',
      negative: 'התחזית לשנה קשה — יש סימני יוקר ומחסור. כדאי להיערך מראש ולחסוך.',
      neutral:  'התחזית מעורבת — חלק מהשנה טוב וחלק קשה יותר.',
    },
    dream: {
      positive: 'החלום מבשר טוב. אין צורך לדאוג ממנו.',
      negative: 'החלום מבשר רע. כדאי לשים לב לאזהרה שבו, אך לא להיבהל ממנה.',
      neutral:  'משמעות החלום אינה חד-משמעית — ייתכן שהוא סתם חלום ולא בשורה.',
    },
  };

  const dir = overallPositive === true ? 'positive' : overallPositive === false ? 'negative' : 'neutral';
  const guidance = TOPIC_GUIDANCE[topicId]?.[dir]
    || (dir === 'positive' ? 'הכיוון הכללי טוב.' : dir === 'negative' ? 'הכיוון הכללי מאתגר.' : 'הכיוון הכללי מורכב.');

  const judgeNote = h15
    ? (() => {
        const fig = h15.figureName;
        if (h15.quality === 'saad') {
          if (overallPositive === false)
            return ` אולם הדיין — הצורה ${fig} — מרמז על אפשרות שיפור בהמשך הדרך.`;
          if (overallPositive === null)
            return ` הדיין — הצורה ${fig} — מוסיף גוון חיובי להכרעה המורכבת.`;
          return ` הדיין — הצורה ${fig} — מחזק את הכיוון החיובי.`;
        }
        if (h15.quality === 'nahs') {
          if (overallPositive === true)
            return ` אולם הדיין — הצורה ${fig} — מזהיר מפני קשיים אפשריים בהמשך.`;
          if (overallPositive === null)
            return ` הדיין — הצורה ${fig} — מוסיף גוון שלילי להכרעה המורכבת.`;
          return ` הדיין — הצורה ${fig} — מדגיש את הקושי שבמצב.`;
        }
        return ` הדיין — הצורה ${fig} — מוסיף מורכבות להכרעה.`;
      })()
    : '';

  const opening = fn ? `${fn} — ` : '';
  const text = `${opening}${guidance}${judgeNote}`;
  const keyFact = findKeyDescriptiveFact(reading);

  return `<div class="client-reading-panel" style="direction:rtl; margin:18px 0 10px; border:2px solid #b8860b; border-radius:8px; background:#fffef5; padding:18px 20px;">
    <div style="font-weight:700; font-size:13px; color:#7a5c00; letter-spacing:0.5px; margin-bottom:10px; border-bottom:1px solid #e8d080; padding-bottom:6px;">📖 קרא ללקוח</div>
    <div style="font-size:16px; line-height:2; color:#2c2c2c;">
      <p style="margin:0;">${text}</p>
      ${keyFact ? `<p style="margin:12px 0 0;">${keyFact}</p>` : ''}
    </div>
  </div>`;
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

  // תשובה קצרה + קריאה ללקוח — תמיד גלויות, באותה שפת עיצוב כמו לוח חאווי
  const shortVerdictHtml = writeShortVerdictBox(reading);
  const clientReadingHtml = writeConclusionPara(reading);

  // הפירוט הטכני המלא — מאחורי "קרא עוד" (כמו בלוח חאווי)
  const detailSections = [
    writeHeader(reading),
    writeBoardWarnings(reading),
    writeOpeningPara(reading),
    writeVerdictPara(reading),
    writeAltPara(reading),
    writeSupportingPara(reading),
    writeKeyHousesPara(reading),
    writeDhamirPara(reading),
    writeWitnessJudgePara(reading),
  ].filter(Boolean).join('\n');

  const footerHtml = `<div class="kashf-reading-footer">
      <p>חשיפת הסודות הנצורים (כשף אל-אסרר) · ${reading.topicHebrewName}</p>
      <p class="kashf-disclaimer">הקריאה מבוססת אך ורק על ספר "כשף אל-אסרר". אין להסתמך עליה כהחלטה יחידה בעניינים חשובים.</p>
    </div>`;

  return `<div class="kashf-reading-output">
    ${shortVerdictHtml}
    ${clientReadingHtml}
    <button class="details-toggle" onclick="const p=this.nextElementSibling;p.hidden=!p.hidden;this.textContent=p.hidden?'קרא עוד ▼':'סגור ▲'">קרא עוד ▼</button>
    <div hidden><div class="details-panel">${detailSections}</div></div>
    ${footerHtml}
  </div>`;
}

export default { writeKashfReading };
