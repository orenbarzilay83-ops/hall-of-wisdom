export const HAWI_FIGURE_STATE_HAYYAN = {
  id: 'hawi-figure-state-hayyan',
  figureId: 'hawi-figure-hayyan',
  shortFigureId: 'hayyan',
  arabicName: 'الحيان / الأحيان',
  hebrewName: 'נשוא ראש',
  sourceBook: 'الفلك المشحون في علم الرمل المصون',
  sourceAuthor: null,
  sourceSectionArabic: 'باب الأشكال الصامتة والأشكال الناطقة — باب السعد والنحس والممتزج',
  sourceSectionHebrew: 'שער הצורות השותקות והמדברות — שער הטוב והרע והמעורב',
  sourcePages: [],
  sourceType: 'global-figure-classification',
  extractionStatus: 'global-classification-from-falak-mashun',
  noteHebrew: 'צורה בודדת שאינה נכנסת למיזן. מצבה קבוע בכל הבתים: מדברת וטובה תמיד.',
  states: [
    { house: 1,  arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 2,  arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 3,  arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 4,  arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 5,  arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 6,  arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 7,  arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 8,  arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 9,  arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 10, arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 11, arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 12, arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 13, arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 14, arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 15, arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
    { house: 16, arabicText: [], hebrewTranslation: [], speakingState: 'speaking', fortuneState: 'benefic', effectHebrew: 'מדבר וטוב.', sourceStatus: 'global-classification-fixed' },
  ],
  summary: {
    housesLength: 16,
    explicitCoverage: 'global',
    notExplicit: [],
    sourcePages: [],
    status: 'global-classification-fixed-falak-mashun',
  },
};

export function getHawiFigureStateHayyanHouse(house) {
  const houseNumber = Number(house);
  if (!Number.isInteger(houseNumber) || houseNumber < 1 || houseNumber > 16) return null;
  return HAWI_FIGURE_STATE_HAYYAN.states.find((state) => state.house === houseNumber) || null;
}

export default { HAWI_FIGURE_STATE_HAYYAN };
if (typeof module !== 'undefined') module.exports = { HAWI_FIGURE_STATE_HAYYAN };
