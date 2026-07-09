/**
 * goral-qa-deterministic-checks.js
 *
 * שכבה-1 (דטרמיניסטית, בלי AI) — Oren Smart Advisor: Goral QA Brain (שלב 2).
 * מקבלת פלט-מובנה-אחד (תוצר goral-qa-output-collector.js) ומחזירה רשימת
 * detectedProblems. קוראת בלבד — לא משנה שום reading/result/HTML.
 *
 * המרקרים הטקסטואליים למטה (כמו "עיתוי צפוי:", "טבע השואל:") נלקחים
 * מילולית מתוך outputHebrew אמיתי בקוד הקיים (kashf-pending-extraction.js,
 * kashf-narrative-writer.js) — לא מומצאים.
 */

import { HOUSE_NAMES } from '../engine/kashf-reading-engine.js';

const DHAMIR_MARKER = 'מחשבת השואל';
const TIMING_MARKER = 'עיתוי צפוי:';
const TEMPERAMENT_MARKER = 'טבע השואל:';
const NO_APPLICABILITY_MARKER = 'אין לכלל זה תחולה';

function checkDhamirLeak(collected, problems) {
  const html = collected.clientOutputHtml || '';
  const hiddenByEngine = collected.sectionsHidden.includes('dhamir');
  if (html.includes(DHAMIR_MARKER)) {
    problems.push({
      section: 'dhamir',
      description: hiddenByEngine
        ? 'דמיר/מחשבת-השואל מסומן כ-hidden ע"י goral-rule-applicability אך עדיין מופיע בפלט ללקוח (חוסר-עקביות)'
        : 'דמיר/מחשבת-השואל מוצג ללקוח בשאלה שלא אושרה כרלוונטית-לדמיר',
      evidence: excerptAround(html, DHAMIR_MARKER),
      severity: 'high',
    });
  }
}

function checkTimingLeak(collected, problems) {
  if (collected.category === 'timing') return; // שאלת-עיתוי — עיתוי כן רלוונטי
  const html = collected.clientOutputHtml || '';
  if (html.includes(TIMING_MARKER)) {
    problems.push({
      section: 'dhamirExtras.timing',
      description: `עיתוי-לפי-דמיר מופיע בפלט ללקוח למרות שהקטגוריה היא "${collected.category}" (לא שאלת-עיתוי)`,
      evidence: excerptAround(html, TIMING_MARKER),
      severity: 'medium',
    });
  }
}

function checkTemperamentLeak(collected, problems) {
  const html = collected.clientOutputHtml || '';
  if (collected.category === 'loveIntention') return; // אופי/כוונה — רלוונטי יותר
  if (html.includes(TEMPERAMENT_MARKER)) {
    problems.push({
      section: 'dhamirExtras.temperament',
      description: `"טבע השואל" מופיע בפלט ללקוח למרות שהקטגוריה היא "${collected.category}" (לא שאלת-אופי/כוונה)`,
      evidence: excerptAround(html, TEMPERAMENT_MARKER),
      severity: 'medium',
    });
  }
}

function checkFormulaOnlyHouseLabelLeak(collected, problems) {
  if (collected.method !== 'kashf') return;
  const html = collected.clientOutputHtml || '';
  const keyHouseReadings = collected.raw?.keyHouseReadings || [];
  for (const h of keyHouseReadings) {
    if (!h.isFormulaOnly) continue;
    const topicalName = HOUSE_NAMES[h.houseNum];
    if (topicalName && html.includes(topicalName)) {
      problems.push({
        section: 'keyHouses',
        description: `בית ${h.houseNum} מסומן isFormulaOnly=true אך הכותרת הנושאית המלאה ("${topicalName}") עדיין מופיעה בפלט ללקוח`,
        evidence: excerptAround(html, topicalName),
        severity: 'high',
      });
    }
  }
}

function checkNoApplicabilitySectionShown(collected, problems) {
  const html = collected.clientOutputHtml || '';
  if (html.includes(NO_APPLICABILITY_MARKER)) {
    problems.push({
      section: 'supportingFindings',
      description: 'סעיף ללא-תחולה (legacy-fn עם "אין לכלל זה תחולה") מופיע בפלט ללקוח במקום להיות מוסתר',
      evidence: excerptAround(html, NO_APPLICABILITY_MARKER),
      severity: 'medium',
    });
  }
}

function checkPrimaryAltContradictionSurfaced(collected, problems) {
  if (collected.method !== 'kashf') return; // כרגע מיושם לכשף בלבד — ראו precommit report
  const reading = collected.raw;
  const overallPositive = reading?.overallPositive;
  const altPositive = reading?.altFormula?.verdict?.positive;
  if (typeof overallPositive !== 'boolean' || typeof altPositive !== 'boolean') return;
  if (overallPositive === altPositive) return; // אין סתירה בין הנוסחאות
  const html = collected.clientOutputHtml || '';
  if (!html.includes('בדיקת אימות נוספת')) {
    problems.push({
      section: 'verdict-contradiction',
      description: 'primaryFormula ו-altFormula חלוקים בפסיקה (positive שונה) אך אזהרת-הסתירה לא מופיעה בפלט ללקוח',
      evidence: `overallPositive=${overallPositive}, altFormula.verdict.positive=${altPositive}`,
      severity: 'high',
    });
  }
}

function excerptAround(text, marker, radius = 60) {
  const idx = text.indexOf(marker);
  if (idx === -1) return marker;
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + marker.length + radius);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

/**
 * @param {object} collected - תוצר collectScenarioOutput()
 * @returns {Array<{section,description,evidence,severity}>}
 */
export function runDeterministicChecks(collected) {
  const problems = [];
  checkDhamirLeak(collected, problems);
  checkTimingLeak(collected, problems);
  checkTemperamentLeak(collected, problems);
  checkFormulaOnlyHouseLabelLeak(collected, problems);
  checkNoApplicabilitySectionShown(collected, problems);
  checkPrimaryAltContradictionSurfaced(collected, problems);
  return problems;
}

export default { runDeterministicChecks };
