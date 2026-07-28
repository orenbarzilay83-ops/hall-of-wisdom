// גורל החול — מנוע פרופיל אסטרו-עונתי (Seasonal Astro Profile)
// מקור: כשף אל-אסראר — השיבוץ החמישי (שיבוץ המזלות), עמ' 135-138;
//       תסכین המזג (יסוד), עמ' 124; תסכین המזג (כוכבים), עמ' 133-135.
//
// המנוע אינו מחשב "מזל עולה" (עולה אישי / الطالع) ואינו משייך צורה למזל
// בודד — במקור לא נמצא כלל תפעולי לחישוב עולה-אישי, ולא שיוך חד-ערכי של
// צורה למזל אחד (ראו KASHF_RISING_SIGN_ENGINE_RESEARCH_AND_PLAN.md ו-
// KASHF_EXTERNAL_ZODIAC_SOURCE_AUDIT.md). המידע היחיד שהמקור מספק ברמת
// הצורה הבודדת הוא קבוצת-עונה (3 מזלות מועמדים, לא הכרעה בין השלושה).
//
// אינו משכפל חישוב כוכב/מזג — נעזר ב-raml-temperament-engine.js (require).
// אינו משכפל FIGURE_ELEMENTS_MAP — נעזר ב-kashf-pending-extraction.js (require).
// אינו משכפל SHIBUTZ_5_SEASONS/SHIBUTZ_5_ELEMENT_BY_ZODIAC — נעזר ב-
// kashf-shibutzim.js (require).

let RAML_TEMPERAMENT = {};
let KASHF_SHIBUTZIM = {};
let KASHF_PENDING_EXTRACTION = {};

try {
  if (typeof require === "function") {
    RAML_TEMPERAMENT = require("./raml-temperament-engine.js");
  }
} catch (error) {
  RAML_TEMPERAMENT = {};
}

try {
  if (typeof require === "function") {
    KASHF_SHIBUTZIM = require("../goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js");
  }
} catch (error) {
  KASHF_SHIBUTZIM = {};
}

try {
  if (typeof require === "function") {
    KASHF_PENDING_EXTRACTION = require("../goral-hachol/engine/kashf-pending-extraction.js");
  }
} catch (error) {
  KASHF_PENDING_EXTRACTION = {};
}

if (typeof window !== "undefined") {
  RAML_TEMPERAMENT = {
    ...RAML_TEMPERAMENT,
    ramlBuildTemperamentProfile:
      RAML_TEMPERAMENT.ramlBuildTemperamentProfile ||
      window.ramlBuildTemperamentProfile,
    normalizeFigureKey:
      RAML_TEMPERAMENT.normalizeFigureKey || window.normalizeFigureKey
  };
  KASHF_SHIBUTZIM = {
    ...KASHF_SHIBUTZIM,
    SHIBUTZ_5_SEASONS:
      KASHF_SHIBUTZIM.SHIBUTZ_5_SEASONS || window.SHIBUTZ_5_SEASONS,
    SHIBUTZ_5_ELEMENT_BY_ZODIAC:
      KASHF_SHIBUTZIM.SHIBUTZ_5_ELEMENT_BY_ZODIAC ||
      window.SHIBUTZ_5_ELEMENT_BY_ZODIAC
  };
  KASHF_PENDING_EXTRACTION = {
    ...KASHF_PENDING_EXTRACTION,
    FIGURE_ELEMENTS_MAP:
      KASHF_PENDING_EXTRACTION.FIGURE_ELEMENTS_MAP ||
      window.FIGURE_ELEMENTS_MAP
  };
}

const SEASON_PROVENANCE_BASE = {
  sourceId: "kashf-shibutzim",
  sourceTitle: "כשף אל-אסראר — השיבוץ החמישי: שיבוץ המזלות",
  pageRange: [135, 138],
  ruleId: "SHIBUTZ_5_SEASONS"
};

const ELEMENT_PROVENANCE = {
  sourceId: "kashf-pending-extraction",
  sourceTitle: "כשף אל-אסראר — תסכין המזג (זיהוי טבע לפי בית הדמיר)",
  pageRange: [124],
  ruleId: "FIGURE_ELEMENTS_MAP",
  status: "VERIFIED"
};

const PLANET_PROVENANCE_BASE = {
  sourceId: "raml-temperament-engine",
  sourceTitle: "כשף אל-אסראר — תסכין המזג (כוכבים)",
  pageRange: [133, 134, 135],
  ruleId: "RAML_PLANETARY_TEMPERAMENT"
};

const TEMPERAMENT_PROVENANCE_BASE = {
  sourceId: "raml-temperament-engine",
  sourceTitle: "כשף אל-אסראר — תסכין המזג",
  pageRange: [133, 134, 135],
  ruleId: "ramlBuildTemperamentProfile"
};

const SINGLE_ZODIAC_SIGN_OPEN = {
  value: null,
  status: "OPEN",
  reason:
    "מקור כשף מספק קבוצת עונה בת שלושה מזלות, ולא שיוך חד-ערכי של צורה למזל אחד."
};

function findSeasonGroup(figureKey) {
  const seasons = KASHF_SHIBUTZIM.SHIBUTZ_5_SEASONS || [];
  return seasons.find(
    group => Array.isArray(group.patterns) && group.patterns.includes(figureKey)
  ) || null;
}

function buildSeasonField(figureKey) {
  const group = findSeasonGroup(figureKey);

  if (!group) {
    return {
      value: null,
      status: "OPEN",
      provenance: {
        ...SEASON_PROVENANCE_BASE,
        status: "OPEN",
        note:
          "צורה זו אינה משובצת לאף קבוצת-עונה ב-SHIBUTZ_5_SEASONS (מטופלת בנפרד כ-SHIBUTZ_5_RAS_ZANAB, ראש/זנב התלי)."
      }
    };
  }

  const isReconstructed = Boolean(group.patternNote);
  const status = isReconstructed ? "RECONSTRUCTED" : "VERIFIED";

  return {
    value: group.seasonHebrew,
    status,
    provenance: {
      ...SEASON_PROVENANCE_BASE,
      status,
      ...(isReconstructed ? { note: group.patternNote } : {})
    }
  };
}

function buildSeasonZodiacCandidatesField(figureKey) {
  const group = findSeasonGroup(figureKey);

  if (!group) {
    return {
      values: [],
      status: "OPEN",
      provenance: {
        ...SEASON_PROVENANCE_BASE,
        status: "OPEN",
        note: "אין קבוצת-עונה משויכת לצורה זו."
      }
    };
  }

  const isReconstructed = Boolean(group.patternNote);
  // לפי דרישה מפורשת: גם כאשר קבוצת המזלות של העונה עצמה VERIFIED,
  // אם השיוך של הצורה הספציפית לעונה הוא RECONSTRUCTED — הסטטוס כאן
  // לא יכול להיות VERIFIED (לכל היותר RECONSTRUCTED).
  const status = isReconstructed ? "RECONSTRUCTED" : "VERIFIED";

  return {
    values: Array.isArray(group.zodiacSigns) ? [...group.zodiacSigns] : [],
    status,
    provenance: {
      ...SEASON_PROVENANCE_BASE,
      status,
      ...(isReconstructed ? { note: group.patternNote } : {})
    }
  };
}

function buildElementField(figureKey) {
  const map = KASHF_PENDING_EXTRACTION.FIGURE_ELEMENTS_MAP || {};
  const value = map[figureKey] || null;

  if (!value) {
    return {
      value: null,
      status: "OPEN",
      provenance: {
        ...ELEMENT_PROVENANCE,
        status: "OPEN",
        note: "לא נמצא שיוך יסוד לצורה זו ב-FIGURE_ELEMENTS_MAP."
      }
    };
  }

  return {
    value,
    status: "VERIFIED",
    provenance: { ...ELEMENT_PROVENANCE }
  };
}

function buildPlanetField(temperamentSubjectProfile) {
  const planet = temperamentSubjectProfile && temperamentSubjectProfile.planet;
  const status =
    temperamentSubjectProfile && temperamentSubjectProfile.status === "VERIFIED" && planet
      ? "VERIFIED"
      : "OPEN";

  return {
    value: status === "VERIFIED" ? { ...planet } : null,
    status,
    provenance: {
      ...PLANET_PROVENANCE_BASE,
      status,
      ...(status === "OPEN"
        ? {
            note:
              (temperamentSubjectProfile && temperamentSubjectProfile.message) ||
              "לא נמצא שיוך כוכבי מאומת לצורה זו."
          }
        : {})
    }
  };
}

function buildTemperamentField(temperamentSubjectProfile) {
  if (!temperamentSubjectProfile) {
    return {
      value: null,
      status: "OPEN",
      provenance: {
        ...TEMPERAMENT_PROVENANCE_BASE,
        status: "OPEN",
        note: "לא הופק פרופיל מזג — kashf-temperament-engine לא זמין או קלט לא תקין."
      }
    };
  }

  const status =
    temperamentSubjectProfile.status === "VERIFIED" ? "VERIFIED" : "OPEN";

  return {
    value: status === "VERIFIED" ? { ...temperamentSubjectProfile } : null,
    status,
    provenance: {
      ...TEMPERAMENT_PROVENANCE_BASE,
      status,
      ...(status === "OPEN"
        ? {
            note:
              temperamentSubjectProfile.message ||
              "פרופיל המזג לצורה זו אינו VERIFIED."
          }
        : {})
    }
  };
}

function buildSubjectProfile(role, figureKey, temperamentSubjectProfile) {
  if (!figureKey) {
    return {
      role,
      figureKey: null,
      season: {
        value: null,
        status: "OPEN",
        provenance: { ...SEASON_PROVENANCE_BASE, status: "OPEN", note: "לא התקבלה צורת רמל תקינה." }
      },
      seasonZodiacCandidates: {
        values: [],
        status: "OPEN",
        provenance: { ...SEASON_PROVENANCE_BASE, status: "OPEN", note: "לא התקבלה צורת רמל תקינה." }
      },
      element: {
        value: null,
        status: "OPEN",
        provenance: { ...ELEMENT_PROVENANCE, status: "OPEN", note: "לא התקבלה צורת רמל תקינה." }
      },
      planet: {
        value: null,
        status: "OPEN",
        provenance: { ...PLANET_PROVENANCE_BASE, status: "OPEN", note: "לא התקבלה צורת רמל תקינה." }
      },
      temperament: {
        value: null,
        status: "OPEN",
        provenance: { ...TEMPERAMENT_PROVENANCE_BASE, status: "OPEN", note: "לא התקבלה צורת רמל תקינה." }
      },
      singleZodiacSign: { ...SINGLE_ZODIAC_SIGN_OPEN },
      overallStatus: "OPEN",
      warnings: ["לא התקבלה צורת רמל תקינה בת ארבע שורות עבור תפקיד זה."]
    };
  }

  return {
    role,
    figureKey,
    season: buildSeasonField(figureKey),
    seasonZodiacCandidates: buildSeasonZodiacCandidatesField(figureKey),
    element: buildElementField(figureKey),
    planet: buildPlanetField(temperamentSubjectProfile),
    temperament: buildTemperamentField(temperamentSubjectProfile),
    singleZodiacSign: { ...SINGLE_ZODIAC_SIGN_OPEN },
    // singleZodiacSign תמיד OPEN => הפרופיל כולו לעולם אינו VERIFIED במלואו.
    overallStatus: "PARTIAL",
    warnings: []
  };
}

/**
 * מפיק פרופיל אסטרו-עונתי נפרד לשואל ולנשאל, ללא הכרעת-יחס ביניהם
 * (relationship מוחזר תמיד כ-OPEN — ראו למטה).
 * ברירת המחדל: בית 1 = השואל, בית 7 = הנשאל/הצד שמנגד — זהה למוסכמה
 * הקיימת כבר ב-raml-temperament-engine.js::ramlBuildTemperamentProfile.
 */
function ramlBuildSeasonalAstroProfile(chart, options = {}) {
  if (!Array.isArray(chart)) {
    throw new Error(
      "ramlBuildSeasonalAstroProfile: chart חייב להיות מערך בתים."
    );
  }

  const buildTemperamentProfile = RAML_TEMPERAMENT.ramlBuildTemperamentProfile;
  const normalizeFigureKey = RAML_TEMPERAMENT.normalizeFigureKey;

  const querentHouse = Number(options.querentHouse || 1);
  const quesitedHouse = Number(options.quesitedHouse || 7);

  const temperamentProfile =
    typeof buildTemperamentProfile === "function"
      ? buildTemperamentProfile(chart, { querentHouse, quesitedHouse })
      : null;

  const findHouse = houseNumber =>
    chart.find(
      item => Number(item && (item.houseNumber || item.house)) === houseNumber
    );

  const resolveFigureKey = houseEntry => {
    if (typeof normalizeFigureKey === "function") {
      return normalizeFigureKey(houseEntry);
    }
    if (!houseEntry) return null;
    const raw = houseEntry.key || houseEntry.pattern || houseEntry.figure || houseEntry.figureKey;
    return typeof raw === "string" && /^[12]{4}$/.test(raw) ? raw : null;
  };

  const querentFigureKey = resolveFigureKey(findHouse(querentHouse));
  const quesitedFigureKey = resolveFigureKey(findHouse(quesitedHouse));

  const querent = buildSubjectProfile(
    "querent",
    querentFigureKey,
    temperamentProfile && temperamentProfile.querent
  );
  const quesited = buildSubjectProfile(
    "quesited",
    quesitedFigureKey,
    temperamentProfile && temperamentProfile.quesited
  );

  const relationship = {
    elementCompatibility: {
      value: null,
      status: "OPEN",
      reason: "אין להפעיל יחס ללא כלל תפעולי מפורש ומאומת."
    },
    planetaryRelationship: {
      value: null,
      status: "OPEN",
      reason: "אין להפעיל יחס ללא routing מפורש למקור המתאים."
    },
    temperamentRelationship: {
      value: null,
      status: "OPEN",
      reason: "אין להפעיל יחס ללא כלל תפעולי מפורש ומאומת."
    },
    overallStatus: "OPEN"
  };

  const anyResolved =
    querent.figureKey || quesited.figureKey;

  return {
    engine: "raml-seasonal-astro-profile-engine",
    sourceMethod: "השיבוץ החמישי: שיבוץ המזלות",
    sourcePages: [124, 133, 134, 135, 136, 137, 138],
    houses: { querent: querentHouse, quesited: quesitedHouse },
    querent,
    quesited,
    relationship,
    overallStatus: anyResolved ? "PARTIAL" : "OPEN",
    warnings: [
      "מנוע זה אינו מחשב 'מזל עולה' אישי (Ascendant / الطالع) — לא נמצא במקור כלל תפעולי לכך.",
      "singleZodiacSign מוחזר תמיד כ-OPEN: המקור מספק קבוצת-עונה של שלושה מזלות מועמדים, לא הכרעה בין השלושה.",
      "אין להמיר singleZodiacSign/seasonZodiacCandidates להכרעה אוטומטית של מזל בודד.",
      "זהו מנוע אפיון תומך (supporting evidence) בלבד — אינו מכריע לבדו שום מסקנה סופית."
    ]
  };
}

if (typeof window !== "undefined") {
  window.ramlBuildSeasonalAstroProfile = ramlBuildSeasonalAstroProfile;
}

if (typeof module !== "undefined") {
  module.exports = {
    ramlBuildSeasonalAstroProfile
  };
}
