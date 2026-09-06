// גורל החול — מנוע אפיון המזג של השואל והנשאל
// מקור שיטתי: חשיפת הסודות הנצורים, עמ' 133–135 (تسكين المزاج).
// המנוע אינו מנחש מזל או תכונה שלא הופיעו במאגר המאומת.

let RAML_ASTRO_DATA = {};

try {
  if (typeof require === "function") {
    RAML_ASTRO_DATA = require("./raml-astro-correspondences.js");
  }
} catch (error) {
  RAML_ASTRO_DATA = {};
}

if (typeof window !== "undefined") {
  RAML_ASTRO_DATA = {
    ...RAML_ASTRO_DATA,
    RAML_PLANETARY_TEMPERAMENT:
      RAML_ASTRO_DATA.RAML_PLANETARY_TEMPERAMENT ||
      window.RAML_PLANETARY_TEMPERAMENT,
    ramlPlanetByFigureKey:
      RAML_ASTRO_DATA.ramlPlanetByFigureKey ||
      window.ramlPlanetByFigureKey
  };
}

const FIGURE_NAMES_HEBREW = {
  "1121": "נלחם",
  "1222": "נשוא ראש",
  "2111": "סף נכנס",
  "2212": "לבן",
  "1111": "דרך",
  "1212": "ממון יוצא",
  "2122": "אדום",
  "2221": "שפל ראש",
  "1122": "כבוד יוצא",
  "1221": "סוהר",
  "2112": "חיבור",
  "2211": "כבוד נכנס",
  "1112": "סף יוצא",
  "1211": "בר הלחי",
  "2121": "ממון נכנס",
  "2222": "קהלה"
};

function normalizeFigureKey(input) {
  if (typeof input === "string") {
    const key = input.replace(/[^12]/g, "");
    return key.length === 4 ? key : null;
  }

  if (Array.isArray(input) && input.length === 4) {
    return input.map(value => Number(value) === 2 ? "2" : "1").join("");
  }

  if (input && typeof input === "object") {
    return normalizeFigureKey(
      input.key || input.pattern || input.figure || input.figureKey
    );
  }

  return null;
}

function getPlanetByFigureKey(figureKey) {
  const resolver = RAML_ASTRO_DATA.ramlPlanetByFigureKey;
  if (typeof resolver === "function") {
    return resolver(figureKey);
  }

  const planets = RAML_ASTRO_DATA.RAML_PLANETARY_TEMPERAMENT || {};
  for (const [key, planet] of Object.entries(planets)) {
    if (Array.isArray(planet.figures) && planet.figures.includes(figureKey)) {
      return { key, ...planet };
    }
  }

  return null;
}

function buildSubjectProfile(subject, role) {
  const figureKey = normalizeFigureKey(subject);

  if (!figureKey) {
    return {
      role,
      status: "INVALID_INPUT",
      figureKey: null,
      message: "לא התקבלה צורת רמל תקינה בת ארבע שורות."
    };
  }

  const planet = getPlanetByFigureKey(figureKey);

  if (!planet) {
    return {
      role,
      status: "OPEN",
      figureKey,
      figureName: FIGURE_NAMES_HEBREW[figureKey] || "צורה לא מזוהה",
      planet: null,
      message: "לצורה זו טרם נמצא שיוך כוכבי מאומת במאגר הפעיל."
    };
  }

  return {
    role,
    status: "VERIFIED",
    figureKey,
    figureName: FIGURE_NAMES_HEBREW[figureKey] || figureKey,
    planet: {
      key: planet.key,
      hebrew: planet.hebrew,
      arabic: planet.arabic,
      day: planet.day,
      night: planet.night,
      letters: Array.isArray(planet.letters) ? [...planet.letters] : []
    },
    sourcePages: Array.isArray(planet.sourcePages)
      ? [...planet.sourcePages]
      : [133, 134, 135]
  };
}

/**
 * מפיק אפיון נפרד לשואל ולנשאל.
 * ברירת המחדל: בית 1 = השואל, בית 7 = הנשאל/הצד שמנגד.
 * ניתן למסור quesitedHouse אחר לפי routing של סוג השאלה.
 */
function ramlBuildTemperamentProfile(chart, options = {}) {
  if (!Array.isArray(chart)) {
    throw new Error("ramlBuildTemperamentProfile: chart חייב להיות מערך בתים.");
  }

  const querentHouse = Number(options.querentHouse || 1);
  const quesitedHouse = Number(options.quesitedHouse || 7);

  const findHouse = houseNumber => chart.find(item =>
    Number(item && (item.houseNumber || item.house)) === houseNumber
  );

  const querent = buildSubjectProfile(findHouse(querentHouse), "querent");
  const quesited = buildSubjectProfile(findHouse(quesitedHouse), "quesited");

  const verifiedCount = [querent, quesited]
    .filter(profile => profile.status === "VERIFIED").length;

  return {
    engine: "raml-temperament-engine",
    sourceMethod: "تسكين المزاج",
    sourcePages: [133, 134, 135],
    status: verifiedCount === 2
      ? "VERIFIED"
      : verifiedCount === 1
        ? "PARTIAL"
        : "OPEN",
    houses: {
      querent: querentHouse,
      quesited: quesitedHouse
    },
    querent,
    quesited,
    warnings: [
      "זהו מנוע אפיון כוכבי־מזגי; הוא אינו מכריע לבדו את תשובת השאלה.",
      "אין להסיק ממנו מזל, עונה או גורל צומח ללא מנוע נפרד ומאומת."
    ]
  };
}

function ramlTemperamentSummary(profile) {
  if (!profile || typeof profile !== "object") {
    return "לא הופק אפיון מזג.";
  }

  const describe = subject => {
    if (!subject || subject.status !== "VERIFIED" || !subject.planet) {
      return "לא נמצא שיוך מאומת";
    }

    return `${subject.figureName} — ${subject.planet.hebrew}`;
  };

  return `השואל: ${describe(profile.querent)}; הנשאל: ${describe(profile.quesited)}.`;
}

if (typeof window !== "undefined") {
  window.ramlBuildTemperamentProfile = ramlBuildTemperamentProfile;
  window.ramlTemperamentSummary = ramlTemperamentSummary;
}

if (typeof module !== "undefined") {
  module.exports = {
    normalizeFigureKey,
    getPlanetByFigureKey,
    ramlBuildTemperamentProfile,
    ramlTemperamentSummary
  };
}
