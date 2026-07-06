/**
 * kashf-book-additions.js
 *
 * פונקציות חדשות שנכתבו ישירות מתוך אימות מול kashf-al-asrar.html (עמ' 174,
 * 272-274), בעקבות בדיקת 135 שאלות מועמדות שהוצעו ע"י צ'אט חיצוני. כל פונקציה
 * כאן מצטטת טקסט-ליבה של הספר עצמו — לא תוספות מאוחרות המיוחסות לחיבור אחר.
 *
 * הוחרג במפורש: "מן התוספת שאינה מגוף הספר" (עמ' 273, פדיון שבוי/אסיר לפי
 * בית 1+13 ו-16+12) ו"מתוספת נֻזְהַת אל־עֻקוּל" (עמ' 274, בית 1+5 וטבלת
 * צורות-גורל) — שני אלה מיוחסים בספר עצמו למקור/חיבור שאינו המחבר הראשי,
 * באותו אופן שבו הוחרג חומר אלזנאתי משער 4 (ראה kashf-dhamir.js).
 *
 * פורמט קלט: אותו chart array כמו kashf-pending-extraction.js
 * ({house, key, hebrew, fortune, direction, movement}).
 */

// כשף אל-אסרר עמ' 272-273 — "כלל מעשי: אדם החושש מעונש"
// "באדם החושש מעונש — ממאסר, ממלקות או מדבר אחר — אם בבית העשירי נמצאת
//  כבוד נכנס, ובחמישי סף נכנס, ובראשון נשוא ראש, ... צריך שיהיה בבית
//  הרביעי סימן מיטיב; ואז אין לחשוש עליו."
export function computeFearOfPunishment(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1), h4 = getH(4), h5 = getH(5), h10 = getH(10);
  if (!h1 || !h4 || !h5 || !h10) return null;

  const signsPresent = h10.key === '2211' && h5.key === '2111' && h1.key === '1222';
  const h4Fortune = String(h4.fortune || '');
  const h4Benefic = h4Fortune.includes('מיטיב') && !h4Fortune.startsWith('ממוזג-מזיק');

  let verdict, outputHebrew;
  if (signsPresent && h4Benefic) {
    verdict = 'no-fear';
    outputHebrew = 'סימני הביטחון מופיעים (כבוד נכנס בעשירי, סף נכנס בחמישי, נשוא ראש בראשון), ובית 4 מיטיב — אין לחשוש מן העונש.';
  } else if (signsPresent && !h4Benefic) {
    verdict = 'uncertain';
    outputHebrew = 'סימני הביטחון (כבוד נכנס/סף נכנס/נשוא ראש) מופיעים, אך בית 4 אינו מיטיב — עדיין יש מקום לחשש מן העונש.';
  } else {
    verdict = 'no-clear-signal';
    outputHebrew = 'לא נמצאו במלואם סימני הביטחון המיוחדים לחשש מעונש (כבוד נכנס/סף נכנס/נשוא ראש) — אין הכרעה מיוחדת מכלל זה.';
  }
  return { verdict, outputHebrew };
}

// כשף אל-אסרר עמ' 274 — "האסיר — אורך המאסר, סכנה ושחרור" (המשפט הראשון,
// לפני "ויש שאמרו" המפריד לתוספת אחרת)
// "אם הבית השישה־עשר והבית השנים־עשר שניהם מזיקים ויוצאים — ישלים האסיר
//  זמן רב במאסרו. ואם שניהם מזיקים ונכנסים, והצורות המזיקות מעידות להן,
//  ורבתה צורת אדום במערך גורל החול — הדבר עלול להגיע לשפיכות דמים.
//  ואם שניהם מזיקים ונכנסים, הוא חולה ומת."
export function computePrisonerDurationDanger(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h12 = getH(12), h16 = getH(16);
  if (!h12 || !h16) return null;

  const isMalefic = (h) => String(h?.fortune || '').includes('מזיק');
  const bothMalefic = isMalefic(h12) && isMalefic(h16);
  const bothOutgoing = h12.direction === 'outgoing' && h16.direction === 'outgoing';
  const bothIncoming = h12.direction === 'incoming' && h16.direction === 'incoming';
  // "ורבתה צורת אדום במערך" — ספירת הופעות אדום (2122) בכל 16 הבתים
  const humraCount = chart.filter((h) => h.key === '2122').length;

  let verdict, outputHebrew;
  if (bothMalefic && bothOutgoing) {
    verdict = 'long-imprisonment';
    outputHebrew = 'בית 12 ובית 16 שניהם מזיקים ויוצאים — האסיר ישלים זמן רב במאסרו.';
  } else if (bothMalefic && bothIncoming && humraCount >= 2) {
    verdict = 'danger-bloodshed';
    outputHebrew = `בית 12 ובית 16 שניהם מזיקים ונכנסים, וצורת אדום מרובה בלוח (${humraCount} מופעים) — הדבר עלול להגיע לשפיכות דמים.`;
  } else if (bothMalefic && bothIncoming) {
    verdict = 'illness-death';
    outputHebrew = 'בית 12 ובית 16 שניהם מזיקים ונכנסים — הוא חולה ומת.';
  } else {
    verdict = 'mixed';
    outputHebrew = 'אין התאמה לתנאי הקיצון (בית 12 ובית 16 שניהם מזיקים ויוצאים/נכנסים) — מצב המאסר מעורב, לא חמור באופן קיצוני.';
  }
  return { verdict, outputHebrew };
}

// כשף אל-אסרר עמ' 177 — "האם טוב לאדם להישאר בעיר זו או לעבור ממנה?"
// "השלם את ההכאה. אם יצאה בראשון צורה מיטיבה ובשני צורה מזיקה, המקום
//  שבו הוא נמצא טוב לו. ואם יצא להפך — הדין להפך."
export function computeStayOrMove(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1), h2 = getH(2);
  if (!h1 || !h2) return null;

  const isBenefic = (h) => {
    const f = String(h?.fortune || '');
    return f.includes('מיטיב') && !f.startsWith('ממוזג-מזיק');
  };
  const isMalefic = (h) => String(h?.fortune || '').includes('מזיק');

  let verdict, outputHebrew;
  if (isBenefic(h1) && isMalefic(h2)) {
    verdict = 'stay';
    outputHebrew = `בית 1 (${h1.hebrew || h1.key}) מיטיב ובית 2 (${h2.hebrew || h2.key}) מזיק — המקום שבו הוא נמצא טוב לו; עדיף להישאר.`;
  } else if (isMalefic(h1) && isBenefic(h2)) {
    verdict = 'move';
    outputHebrew = `בית 1 (${h1.hebrew || h1.key}) מזיק ובית 2 (${h2.hebrew || h2.key}) מיטיב — הדין הפוך; עדיף לעבור ממקום זה.`;
  } else {
    verdict = 'no-clear-signal';
    outputHebrew = 'הכלל דורש בית 1 ובית 2 בקטבים הפוכים (אחד מיטיב, השני מזיק) — כאן שניהם דומים באופיים, ואין הכרעה מיוחדת מכלל זה.';
  }
  return { verdict, outputHebrew };
}
