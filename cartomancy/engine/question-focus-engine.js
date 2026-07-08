function detectQuestionFocus(question, root, heart, direction) {
  const q = question.toLowerCase();
  const isYesNo = q.startsWith("\u05D4\u05D0\u05DD") || q.startsWith("will") || q.startsWith("is") || q.startsWith("are") || q.startsWith("can");
  if (isYesNo) {
    return {
      answerCard: direction,
      supportingCard: heart,
      explanation: "\u05D1\u05E9\u05D0\u05DC\u05D5\u05EA \u05DB\u05DF/\u05DC\u05D0 \u05D4\u05E7\u05DC\u05E3 \u05D1\u05E2\u05DE\u05D3\u05EA \u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05D7\u05E9\u05D1 \u05DC\u05EA\u05E9\u05D5\u05D1\u05D4 \u05D4\u05D9\u05E9\u05D9\u05E8\u05D4, \u05D5\u05D4\u05DC\u05D1 \u05DE\u05E1\u05D1\u05D9\u05E8 \u05D0\u05EA \u05D4\u05E1\u05D9\u05D1\u05D4."
    };
  }
  return {
    answerCard: heart,
    supportingCard: direction,
    explanation: "\u05D1\u05E9\u05D0\u05DC\u05D5\u05EA \u05E4\u05EA\u05D5\u05D7\u05D5\u05EA \u05D4\u05DC\u05D1 \u05DE\u05E6\u05D9\u05D2 \u05D0\u05EA \u05D4\u05DE\u05E6\u05D1 \u05D4\u05DE\u05E8\u05DB\u05D6\u05D9 \u05D5\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05DE\u05E8\u05D0\u05D4 \u05DC\u05D0\u05DF \u05D4\u05D3\u05D1\u05E8\u05D9\u05DD \u05DE\u05EA\u05E4\u05EA\u05D7\u05D9\u05DD."
  };
}
export {
  detectQuestionFocus
};
