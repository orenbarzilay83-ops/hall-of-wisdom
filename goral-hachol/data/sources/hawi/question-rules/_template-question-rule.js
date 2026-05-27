/**
 * Template for source-exact question rules.
 *
 * Do not put inferred engine logic here.
 */

export const TEMPLATE_HAWI_QUESTION_RULE = {
  id: "",
  sourceBook: "حاوي العجائب ومظهر الغرائب",
  sourceAuthor: "أحمد ابن زنبل المحلي",
  sourceSectionArabic: "",
  sourceSectionHebrew: "",
  extractionStatus: "draft",
  rules: [
    {
      id: "",
      arabicText: "",
      hebrewTranslation: "",
      houses: [],
      figures: [],
      technicalTerms: [],
      rule: "",
      status: "sourceExact"
    }
  ],
  notes: []
};

if (typeof module !== "undefined") {
  module.exports = { TEMPLATE_HAWI_QUESTION_RULE };
}
