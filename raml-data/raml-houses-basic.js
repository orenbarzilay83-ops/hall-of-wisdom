// גורל החול — קובץ ידע בסיסי ל־16 הבתים
// קובץ ידע בלבד. לא מנוע חישוב.
// הפרופילים המלאים של הבתים ייכנסו בהמשך ל־raml-houses-profiles.js

const RAML_HOUSES_BASIC = {
  1:  { number: 1,  hebrew: "בית החיים", arabic: "بيت الحياة", role: "השואל, הגוף, החיים, מצב האדם" },
  2:  { number: 2,  hebrew: "בית הממון", arabic: "بيت المال", role: "ממון, רכוש, פרנסה, מה שיש לאדם" },
  3:  { number: 3,  hebrew: "בית האחים", arabic: "بيت الإخوة", role: "אחים, קרובים, תנועה קרובה, מסרים" },
  4:  { number: 4,  hebrew: "בית ההורים", arabic: "بيت الوالدين", role: "אב, אם, בית, שורש, קרקע" },
  5:  { number: 5,  hebrew: "בית הבנים", arabic: "بيت الأولاد", role: "ילדים, פרי, תוצאה יוצאת" },
  6:  { number: 6,  hebrew: "בית המחלות", arabic: "بيت الأمراض", role: "חולי, חולשה, משרתים, קושי יומי" },
  7:  { number: 7,  hebrew: "בית הזוגיות", arabic: "بيت الزواج", role: "זוגיות, שותפות, הצד שמול השואל" },
  8:  { number: 8,  hebrew: "בית המוות", arabic: "بيت الموت", role: "סוף, פחד, אובדן, שינוי כבד" },
  9:  { number: 9,  hebrew: "בית הנסיעה", arabic: "بيت السفر", role: "דרך רחוקה, נסיעה, לימוד, חוץ" },
  10: { number: 10, hebrew: "בית הכבוד והרוממות", arabic: "بيت العز والرفعة", role: "מעמד, כבוד, הצלחה ציבורית" },
  11: { number: 11, hebrew: "בית התקווה והמשאלות", arabic: "بيت الرجاء والآمال", role: "תקוות, משאלות, עזרה, רווח" },
  12: { number: 12, hebrew: "בית האויבים", arabic: "بيت الأعداء", role: "אויבים, הסתרה, פחדים, מניעות" },
  13: { number: 13, hebrew: "עד ראשון / בית השואל", arabic: "الشاهد الأول / بيت السائل", role: "עד ראשון, מצב השואל, התחלה / עבר / הצד של השואל" },
  14: { number: 14, hebrew: "עד שני / בית הנשאל עליו", arabic: "الشاهد الثاني / بيت المسؤول عنه", role: "עד שני, הדבר הנשאל, הצד שמול השואל" },
  15: { number: 15, hebrew: "השופט", arabic: "الحاكم", role: "הכרעה, תשובה מרכזית, דין הקריאה" },
  16: { number: 16, hebrew: "המשפט / אחרית הדבר", arabic: "العاقبة", role: "אחרית הדבר, תוצאה סופית, השפעת הדין" }
};

function ramlGetHouseBasic(houseNumber) {
  return RAML_HOUSES_BASIC[Number(houseNumber)] || {
    number: Number(houseNumber),
    hebrew: "",
    arabic: "",
    role: ""
  };
}

function ramlListHousesBasic() {
  return Object.keys(RAML_HOUSES_BASIC)
    .map(Number)
    .sort((a, b) => a - b)
    .map(n => RAML_HOUSES_BASIC[n]);
}

if (typeof window !== "undefined") {
  window.RAML_HOUSES_BASIC = RAML_HOUSES_BASIC;
  window.ramlGetHouseBasic = ramlGetHouseBasic;
  window.ramlListHousesBasic = ramlListHousesBasic;
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_HOUSES_BASIC,
    ramlGetHouseBasic,
    ramlListHousesBasic
  };
}
