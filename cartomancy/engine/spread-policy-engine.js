function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}
function looksLikeYesNoQuestion(question) {
  const clean = normalizeText(question);
  return clean.includes("?") || clean.startsWith("\u05D4\u05D0\u05DD") || clean.startsWith("\u05D0\u05DD ");
}
function looksLikeSpecificQuestion(question) {
  const clean = normalizeText(question);
  if (!clean) return false;
  return looksLikeYesNoQuestion(clean) || /מה יקרה|מה יהיה|מה צפוי|איך זה יתפתח|איך הוא מרגיש|איך היא מרגישה|מה הוא מרגיש|מה היא מרגישה|האם אצליח|האם אתקבל|האם נצליח|האם נחזור|האם יש|האם כדאי|כדאי לי|נכון לי|מה מצב/.test(
    clean
  );
}
function getSpreadPolicy(spreadType) {
  if (spreadType === "past-present-future") {
    return {
      spreadType,
      mode: "general-reading",
      allowsSpecificQuestion: false,
      allowsYesNoQuestion: false,
      requiresGeneralReading: true,
      displayName: "\u05E4\u05E8\u05D9\u05E1\u05EA \u05E2\u05D1\u05E8/\u05D4\u05D5\u05D5\u05D4/\u05E2\u05EA\u05D9\u05D3",
      recommendedPrompt: "\u05E7\u05E8\u05D9\u05D0\u05D4 \u05DB\u05DC\u05DC\u05D9\u05EA"
    };
  }
  const displayName = spreadType === "four" ? "\u05E4\u05E8\u05D9\u05E1\u05EA 4 \u05E7\u05DC\u05E4\u05D9\u05DD" : spreadType === "five" ? "\u05E4\u05E8\u05D9\u05E1\u05EA 5 \u05E7\u05DC\u05E4\u05D9\u05DD" : "\u05E4\u05E8\u05D9\u05E1\u05EA 3 \u05E7\u05DC\u05E4\u05D9\u05DD";
  return {
    spreadType,
    mode: "focused-question",
    allowsSpecificQuestion: true,
    allowsYesNoQuestion: true,
    requiresGeneralReading: false,
    displayName,
    recommendedPrompt: "\u05DB\u05EA\u05D5\u05D1 \u05D0\u05EA \u05D4\u05E9\u05D0\u05DC\u05D4 \u05D4\u05DE\u05DE\u05D5\u05E7\u05D3\u05EA \u05E9\u05DC\u05DA"
  };
}
function getDefaultQuestionForSpread(spreadType) {
  const policy = getSpreadPolicy(spreadType);
  return policy.requiresGeneralReading ? "\u05E7\u05E8\u05D9\u05D0\u05D4 \u05DB\u05DC\u05DC\u05D9\u05EA" : "";
}
function validateQuestionForSpread(spreadType, rawQuestion) {
  const policy = getSpreadPolicy(spreadType);
  const question = normalizeText(rawQuestion);
  if (!question) {
    return {
      isValid: false,
      normalizedQuestion: "",
      message: "\u05D1\u05E4\u05E8\u05D9\u05E1\u05EA 3 \u05E7\u05DC\u05E4\u05D9\u05DD \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D6\u05D9\u05DF \u05E9\u05D0\u05DC\u05D4 \u05DE\u05DE\u05D5\u05E7\u05D3\u05EA."
    };
  }
  return {
    isValid: true,
    normalizedQuestion: question,
    message: ""
  };
}
function isQuestionCompatibleWithSpread(spreadType, question) {
  return validateQuestionForSpread(spreadType, question).isValid;
}
export {
  getDefaultQuestionForSpread,
  getSpreadPolicy,
  isQuestionCompatibleWithSpread,
  validateQuestionForSpread
};
