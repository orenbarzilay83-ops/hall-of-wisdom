// גורל החול — מנוע בסיס ראשון
// לא קשור לגורל העשיריות.
// כאן אנחנו בונים מנוע נפרד לגמרי לפי שיטת הרמל / Geomantic Shield.

const RAML_FIGURES = {
  "1121": { key: "1121", hebrew: "נלחם", arabic: "", meaning: "" },
  "1222": { key: "1222", hebrew: "נשוא ראש", arabic: "", meaning: "" },
  "2111": { key: "2111", hebrew: "סף נכנס", arabic: "", meaning: "" },
  "2212": { key: "2212", hebrew: "לבן", arabic: "", meaning: "" },

  "1111": { key: "1111", hebrew: "דרך", arabic: "", meaning: "" },
  "1212": { key: "1212", hebrew: "ממון יוצא", arabic: "", meaning: "" },
  "2122": { key: "2122", hebrew: "אדום", arabic: "", meaning: "" },
  "2221": { key: "2221", hebrew: "שפל ראש", arabic: "", meaning: "" },

  "1122": { key: "1122", hebrew: "כבוד יוצא", arabic: "", meaning: "" },
  "1221": { key: "1221", hebrew: "סוהר", arabic: "", meaning: "" },
  "2112": { key: "2112", hebrew: "חיבור", arabic: "", meaning: "" },
  "2211": { key: "2211", hebrew: "כבוד נכנס", arabic: "", meaning: "" },

  "1112": { key: "1112", hebrew: "סף יוצא", arabic: "", meaning: "" },
  "1211": { key: "1211", hebrew: "בר הלחי", arabic: "", meaning: "" },
  "2121": { key: "2121", hebrew: "ממון נכנס", arabic: "", meaning: "" },
  "2222": { key: "2222", hebrew: "קהלה", arabic: "", meaning: "" },
};

// 1 = נקודה אחת
// 2 = שתי נקודות / קו
function ramlNormalizeLine(value) {
  return Number(value) === 2 ? 2 : 1;
}

function ramlFigureKey(fig) {
  return fig.map(ramlNormalizeLine).join("");
}

function ramlFigureInfo(fig) {
  const key = ramlFigureKey(fig);
  return RAML_FIGURES[key] || {
    key,
    hebrew: "צורה לא מזוהה",
    arabic: "",
    meaning: ""
  };
}

// חיבור שתי צורות:
// אם סכום השורה זוגי → 2
// אם סכום השורה אי־זוגי → 1
function ramlCombine(a, b) {
  return [0, 1, 2, 3].map(i => {
    const sum = ramlNormalizeLine(a[i]) + ramlNormalizeLine(b[i]);
    return sum % 2 === 0 ? 2 : 1;
  });
}

// מקבל ארבע אמהות ומוליד את כל לוח גורל החול
function ramlBuildShield(mothers) {
  if (!Array.isArray(mothers) || mothers.length !== 4) {
    throw new Error("צריך להזין בדיוק 4 אמהות.");
  }

  const m = mothers.map(fig => {
    if (!Array.isArray(fig) || fig.length !== 4) {
      throw new Error("כל אם חייבת להיות צורה של 4 שורות.");
    }
    return fig.map(ramlNormalizeLine);
  });

  // 1–4 אמהות
  const h1 = m[0];
  const h2 = m[1];
  const h3 = m[2];
  const h4 = m[3];

  // 5–8 בנות:
  // בת 1 = שורה ראשונה של כל ארבע האמהות
  // בת 2 = שורה שנייה של כל ארבע האמהות
  // וכן הלאה
  const h5 = [h1[0], h2[0], h3[0], h4[0]];
  const h6 = [h1[1], h2[1], h3[1], h4[1]];
  const h7 = [h1[2], h2[2], h3[2], h4[2]];
  const h8 = [h1[3], h2[3], h3[3], h4[3]];

  // 9–12 נכדות / אחייניות
  const h9 = ramlCombine(h1, h2);
  const h10 = ramlCombine(h3, h4);
  const h11 = ramlCombine(h5, h6);
  const h12 = ramlCombine(h7, h8);

  // 13–14 עדים
  const h13 = ramlCombine(h9, h10);
  const h14 = ramlCombine(h11, h12);

  // 15 שופט
  const h15 = ramlCombine(h13, h14);

  // 16 משפט / תוצאה סופית
  const h16 = ramlCombine(h15, h1);

  const houses = [
    h1, h2, h3, h4,
    h5, h6, h7, h8,
    h9, h10, h11, h12,
    h13, h14, h15, h16
  ];

  return houses.map((fig, index) => ({
    house: index + 1,
    figure: fig,
    key: ramlFigureKey(fig),
    ...ramlFigureInfo(fig)
  }));
}

// בדיקה מהירה לדוגמה
function ramlDemo() {
  const mothers = [
    [2, 2, 1, 2],
    [1, 2, 1, 2],
    [1, 1, 2, 2],
    [2, 1, 2, 1],
  ];

  return ramlBuildShield(mothers);
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_FIGURES,
    ramlNormalizeLine,
    ramlFigureKey,
    ramlFigureInfo,
    ramlCombine,
    ramlBuildShield,
    ramlDemo
  };
}

// מחזיר את הלוח מחולק לקבוצות תצוגה לאפליקציה
function ramlGroupShield(chart) {
  const groups = [
    { id: "mothers", title: "האמהות", from: 1, to: 4 },
    { id: "daughters", title: "הבנות", from: 5, to: 8 },
    { id: "granddaughters", title: "הנכדות / בנות הבנות", from: 9, to: 12 },
    { id: "witnesses", title: "העדים", from: 13, to: 14 },
    { id: "judge", title: "השופט", from: 15, to: 15 },
    { id: "sentence", title: "המשפט / התוצאה הסופית", from: 16, to: 16 },
  ];

  return groups.map(group => ({
    ...group,
    houses: chart.filter(h => h.house >= group.from && h.house <= group.to)
  }));
}

function ramlDrawFigureText(fig) {
  return fig.map(v => Number(v) === 1 ? "•" : "• •");
}

if (typeof module !== "undefined") {
  module.exports.ramlGroupShield = ramlGroupShield;
  module.exports.ramlDrawFigureText = ramlDrawFigureText;
}

// יצירת צורת רמל אקראית — לבדיקה ראשונית בלבד
function ramlRandomFigure() {
  return [0, 1, 2, 3].map(() => Math.random() < 0.5 ? 1 : 2);
}

function ramlRandomMothers() {
  return [
    ramlRandomFigure(),
    ramlRandomFigure(),
    ramlRandomFigure(),
    ramlRandomFigure(),
  ];
}

function ramlRandomChart() {
  const mothers = ramlRandomMothers();
  const chart = ramlBuildShield(mothers);
  return {
    mothers,
    chart,
    groups: ramlGroupShield(chart)
  };
}

if (typeof module !== "undefined") {
  module.exports.ramlRandomFigure = ramlRandomFigure;
  module.exports.ramlRandomMothers = ramlRandomMothers;
  module.exports.ramlRandomChart = ramlRandomChart;
}
