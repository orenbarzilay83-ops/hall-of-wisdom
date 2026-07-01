// גורל החול — קובץ ידע בסיסי לצורות
// מקור עבודה: كشف الأسرار في علم الحروف والأفلاك — עמ' 68–94, 95–97, 133
// לא כולל אותיות, מספרים, סורות, צדקה, זבח.
// חודשים עבריים ואותיות עבריות יושלמו בקבצים נפרדים בהמשך.

const RAML_FORMS_BASIC = {
  "1222": {
    key: "1222",
    hebrew: "נשוא ראש",
    arabic: "الأحيان / الضاحك",
    statusHebrew: "טוב",
    planet: "צדק",
    zodiac: "קשת",
    element: "אש",
    direction: "מזרח",
    color: "צהוב ולבן",
    taste: "מתוק",
    bodyPart: "ראש",
    source: "כשף אל-אסרר עמ' 68–69"
  },

  "2122": {
    key: "2122",
    hebrew: "אדום",
    arabic: "الحمرة",
    statusHebrew: "רע",
    planet: "מאדים",
    zodiac: "עקרב",
    element: "אוויר",
    direction: "מערב",
    color: "אדום",
    taste: "מרירות",
    bodyPart: "כבד",
    source: "כשף אל-אסרר עמ' 79–80"
  },

  "1122": {
    key: "1122",
    hebrew: "כבוד יוצא",
    arabic: "النصرة الخارجة",
    statusHebrew: "טוב",
    planet: "שמש",
    zodiac: "אריה",
    element: "אש",
    direction: "מזרח",
    color: "ירוק ולבן",
    taste: "מרירות",
    bodyPart: "ירך ימין",
    source: "כשף אל-אסרר עמ' 82–85"
  },

  "2212": {
    key: "2212",
    hebrew: "לבן",
    arabic: "البياض",
    statusHebrew: "נטייה לטוב",
    planet: "לבנה",
    zodiac: "סרטן",
    element: "מים",
    direction: "צפון",
    color: "לבן",
    taste: "בלי טעם",
    bodyPart: "בטן",
    source: "כשף אל-אסרר עמ' 81–82"
  },

  "1212": {
    key: "1212",
    hebrew: "ממון יוצא",
    arabic: "القبض الخارج",
    statusHebrew: "רע",
    planet: "ראש",
    zodiac: "דלי",
    element: "אש",
    direction: "מזרח",
    color: "צהוב",
    taste: "חמוץ ומלוח",
    bodyPart: "רקה שמאלית",
    source: "כשף אל-אסרר עמ' 71"
  },

  "2112": {
    key: "2112",
    hebrew: "חיבור",
    arabic: "الاجتماع",
    statusHebrew: "נטייה לטוב",
    planet: "כוכב / מרקורי",
    zodiac: "תאומים",
    element: "אוויר",
    direction: "מערב",
    color: "צהוב וירוק",
    taste: "מתוק",
    bodyPart: "נחיר ימין / שכמות",
    source: "כשף אל-אסרר עמ' 91–92"
  },

  "1112": {
    key: "1112",
    hebrew: "סף יוצא",
    arabic: "العتبة الخارجة / راية الحزن",
    statusHebrew: "רע",
    planet: "זנב",
    zodiac: "גדי",
    element: "אוויר",
    direction: "מערב",
    color: "צהוב וירוק",
    taste: "מאוסים",
    bodyPart: "קרסול שמאל",
    source: "כשף אל-אסרר עמ' 86–88"
  },

  "2221": {
    key: "2221",
    hebrew: "שפל ראש",
    arabic: "الأنكيس / المنكوس",
    statusHebrew: "רע",
    planet: "שבתאי",
    zodiac: "דלי",
    element: "עפר",
    direction: "דרום",
    color: "שחור",
    taste: "מר",
    bodyPart: "האחור",
    source: "כשף אל-אסרר עמ' 78–79"
  },

  "1221": {
    key: "1221",
    hebrew: "סוהר",
    arabic: "العقلة / الشقاف",
    statusHebrew: "רע",
    planet: "שבתאי",
    zodiac: "גדי",
    element: "עפר",
    direction: "דרום",
    color: "שחור",
    taste: "חמוץ ומלוח",
    bodyPart: "יד שמאל",
    source: "כשף אל-אסרר עמ' 76–77"
  },

  "2121": {
    key: "2121",
    hebrew: "ממון נכנס",
    arabic: "القبض الداخل",
    statusHebrew: "טוב",
    planet: "שמש",
    zodiac: "אריה",
    element: "עפר",
    direction: "דרום",
    color: "לבן",
    taste: "חמוץ",
    bodyPart: "מוח",
    source: "כשף אל-אסרר עמ' 69–70"
  },

  "1121": {
    key: "1121",
    hebrew: "נלחם",
    arabic: "جودلة / كوسج",
    statusHebrew: "נטייה לטוב",
    planet: "נוגה",
    zodiac: "מאזניים",
    element: "אוויר",
    direction: "מזרח",
    color: "אדום",
    taste: "דשן / שמנוני",
    bodyPart: "כתף ימין",
    source: "כשף אל-אסרר עמ' 74–76, 133"
  },

  "2211": {
    key: "2211",
    hebrew: "כבוד נכנס",
    arabic: "النصرة الداخلة",
    statusHebrew: "טוב",
    planet: "נוגה",
    zodiac: "דגים",
    element: "מים",
    direction: "צפון",
    color: "לבן",
    taste: "מתוק",
    bodyPart: "אוזן ימין",
    source: "כשף אל-אסרר עמ' 85–86"
  },

  "1211": {
    key: "1211",
    hebrew: "בר הלחי",
    arabic: "نقي الخد / الأشقر",
    statusHebrew: "נטייה לטוב",
    planet: "מאדים",
    zodiac: "טלה",
    element: "מים",
    direction: "צפון",
    color: "שחרחר-זהבהב",
    taste: "מרירות",
    bodyPart: "כתף שמאל",
    source: "כשף אל-אסרר עמ' 93–94"
  },

  "2111": {
    key: "2111",
    hebrew: "סף נכנס",
    arabic: "العتبة الداخلة / راية الفرح",
    statusHebrew: "טוב",
    planet: "צדק",
    zodiac: "שור",
    element: "אוויר",
    direction: "מערב",
    color: "כחול",
    taste: "מתוק",
    bodyPart: "רגל ימין",
    source: "כשף אל-אסרר עמ' 89–91"
  },

  "1111": {
    key: "1111",
    hebrew: "דרך",
    arabic: "الطريق",
    statusHebrew: "נטייה לטוב",
    planet: "לבנה",
    zodiac: "סרטן",
    element: "מים",
    direction: "צפון",
    color: "לבן",
    taste: "בלי טעם",
    bodyPart: "רגל שמאל",
    source: "כשף אל-אסרר עמ' 88–89"
  },

  "2222": {
    key: "2222",
    hebrew: "קהלה",
    arabic: "الجماعة",
    statusHebrew: "ביניים",
    planet: "כוכב / מרקורי",
    zodiac: "בתולה",
    element: "עפר",
    direction: "דרום",
    color: "כחול",
    taste: "מאוסים",
    bodyPart: "גב",
    source: "כשף אל-אסרר עמ' 72–74"
  }
};

if (typeof window !== "undefined") {
  window.RAML_FORMS_BASIC = RAML_FORMS_BASIC;
}

if (typeof module !== "undefined") {
  module.exports = { RAML_FORMS_BASIC };
}
