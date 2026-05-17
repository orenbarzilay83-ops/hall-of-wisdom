/**
 * Index for extracted source sections from:
 * حاوي العجائب ومظهر الغرائب
 */

const HAWI_SOURCE_INDEX = {
  sourceId: "hawi-al-ajaib-wa-muzhir-al-gharaib",
  status: "building-source-index",
  sections: [
    {
      id: "hawi-houses-16",
      file: "./foundations/hawi-houses-16.js",
      arabicTitle: "باب شرح البيوت الستة عشر بيتا",
      hebrewTitle: "שער פירוש שישה־עשר הבתים",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-marriage",
      file: "./question-rules/hawi-question-marriage.js",
      arabicTitle: "باب في أمر الزواج",
      hebrewTitle: "שער בעניין נישואין",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-commerce",
      file: "./question-rules/hawi-question-commerce.js",
      arabicTitle: "باب البيع والشراء",
      hebrewTitle: "שער מכירה וקנייה",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-love-hate",
      file: "./question-rules/hawi-question-love-hate.js",
      arabicTitle: "باب في المحبة والبغضة",
      hebrewTitle: "שער אהבה ושנאה",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-illness",
      file: "./question-rules/hawi-question-illness.js",
      arabicTitle: "باب في أمر المريض",
      hebrewTitle: "שער בעניין החולה",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-disputes",
      file: "./question-rules/hawi-question-disputes.js",
      arabicTitle: "الباب الثامن في الخصومات",
      hebrewTitle: "שער הסכסוכים",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-fear",
      file: "./question-rules/hawi-question-fear.js",
      arabicTitle: "الباب التاسع باب الخوف",
      hebrewTitle: "שער הפחד",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-travel",
      file: "./question-rules/hawi-question-travel.js",
      arabicTitle: "باب السفر / المسافر",
      hebrewTitle: "שער הנסיעה / הנוסע",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-completion",
      file: "./question-rules/hawi-question-completion.js",
      arabicTitle: "هل يتم هذا الأمر وتنقضي الحاجة",
      hebrewTitle: "שער האם הדבר יושלם והצורך יתמלא",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-enemies",
      file: "./question-rules/hawi-question-enemies.js",
      arabicTitle: "باب في أمر العداوة",
      hebrewTitle: "שער האויבות",
      extractionStatus: "partial-extracted-needs-next-pass"
    },
    {
      id: "hawi-question-children-pregnancy",
      file: "./question-rules/hawi-question-children-pregnancy.js",
      arabicTitle: "باب الولد / الحمل",
      hebrewTitle: "שער ילד והיריון",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-question-hidden-treasure",
      file: "./question-rules/hawi-question-hidden-treasure.js",
      arabicTitle: "الباب السادس عشر — في الخبيئة",
      hebrewTitle: "שער החבוי / מטמון",
      extractionStatus: "extracted-in-chat-needs-file-entry"
    },
    {
      id: "hawi-figure-transits",
      file: "./figure-transits/",
      arabicTitle: "ترحيل الأشكال الستة عشر في الستة عشر بيتا",
      hebrewTitle: "הצבת שש־עשרה הצורות בשישה־עשר הבתים",
      extractionStatus: "not-started-next"
    }
  ]
};

if (typeof module !== "undefined") {
  module.exports = { HAWI_SOURCE_INDEX };
}
