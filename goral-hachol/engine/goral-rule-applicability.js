/**
 * goral-rule-applicability.js
 *
 * Question-Aware Section Filter — משותף לכשף אל-אסראר ולחאווי.
 *
 * עיקרון (ראו GORAL_RULE_APPLICABILITY_AUDIT.md): לא כל מה שמחושב צריך
 * להופיע בפלט-ללקוח. הקובץ הזה לא מחשב שום דבר בעצמו ולא נוגע בשום מנוע —
 * הוא רק מחליט, לפי method+topicId+mode, אילו "sections" מותר להציג ללקוח.
 * ברירת המחדל לכל section שלא רשום כאן במפורש היא showToClient:true
 * (לא לשנות התנהגות קיימת של דברים שלא אושרו לגיטינג).
 *
 * הרחבה: אין topicId מאושר עדיין לדמיר, לא בכשף ולא בחאווי (ראו האודיט —
 * אין topicId בכשף שעוסק במפורש ב"מה בלב האדם"; loveHate בחאווי הוא
 * מועמד שדווח אך לא הופעל בלי אישור נפרד). לכן הרשימות למטה ריקות בכוונה.
 */

// method → Set(topicId) שבהם דמיר מותר להיות client-facing.
// ריק בכוונה עד אישור מפורש (ראו GORAL_RULE_APPLICABILITY_AUDIT.md §א.7, §ג).
const DHAMIR_CLIENT_VISIBLE_TOPICS = {
  kashf: new Set([]),
  hawi: new Set([]),
};

/**
 * @param {object} params
 * @param {'kashf'|'hawi'} params.method
 * @param {string} params.topicId
 * @param {string} params.sectionId - כרגע נתמך: 'dhamir'
 * @param {'client'|'advisor'} [params.mode='client']
 * @returns {{ showToClient: boolean, keepAdvisorOnly: boolean }}
 */
export function getSectionVisibility({ method, topicId, sectionId, mode = 'client' }) {
  if (mode === 'advisor') {
    return { showToClient: true, keepAdvisorOnly: false };
  }

  if (sectionId === 'dhamir') {
    const visibleTopics = DHAMIR_CLIENT_VISIBLE_TOPICS[method];
    const isVisible = !!visibleTopics && visibleTopics.has(topicId);
    return { showToClient: isVisible, keepAdvisorOnly: !isVisible };
  }

  // כל section אחר שלא טופל כאן — לא משנים התנהגות קיימת.
  return { showToClient: true, keepAdvisorOnly: false };
}

export default { getSectionVisibility };
