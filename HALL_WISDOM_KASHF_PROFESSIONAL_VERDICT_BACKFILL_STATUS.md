# Kashf — Professional Verdict Safety Backfill Status

> תאריך: 2026-09-08
> מטרה: הסמכה רטרואקטיבית של כל מנועי כשף שכבר היו runnable/ready לפי תקן Professional Verdict Safety.

## מצב כללי

- מנועי source-ready runnable לפני ה-Backfill: **43**.
- מוסמכים מקצועית לאחר Batch 02: **9/43**.
- ממתינים להסמכה רטרואקטיבית: **34/43**.
- ששת מנועי source-ready שטרם קיבלו executor נשארים במסלול Source Closure נפרד וייסגרו מלכתחילה לפי התקן החדש.

## מוסמכים

| Method | תקן | Golden Case | הערה |
|---|---|---|---|
| marriage.p210.generalMarriageH1H2H7H8H10Judge | certified | PV-GC001-P210 | דין נישואין ייעודי; H15/H16 אינם רשאים לדרוס את פסק p210 |
| general.p174.h1h2h4h7h10h15 | certified | PV-BF01-P174 | פרופיל שישה בתים; אין רוב/שקלול/כן-לא |
| siblings.p182.seniority | certified | PV-BF01-P182 | רק קהלה/שפל ראש הם ענפי הגדולים; אין היפוך לצעיר |
| travel.p244.returnH1H2H9 | certified | PV-BF01-P244-* | הענף המזיק הוא יגיעה/אפשרות אי-חזרה, לא "לא יחזור" ודאי |
| missing.p249.returnAnglesJudge | certified | PV-BF01-P249 | סימן חזרת זכרים; אין היפוך לאי-חזרה ואין הכללה אוניברסלית |
| marriage.p204.previousStatusH7inH10 | certified | PV-BF02-P204-PREVIOUS-* | רק חזרת H7 ב-H10 מפעילה גרושה/בתולה; ללא חזרה אין ניחוש |
| marriage.p204.dowryH8 | certified | PV-BF02-P204-DOWRY-* | H8 מיטיב מורה מוהר גדול; אין היפוך מזיק=>מוהר קטן |
| love.p206.womanFavorH7H11ThenH5 | certified | PV-BF02-P206-WOMAN-FAVOR-* | מציאת חן חד-כיוונית בלבד; לא אהבה/כימיה/התאמת נישואין |
| desire.p206.querentWantsH7H11ThenH5 | certified | PV-BF02-P206-DESIRE-* | רצון השואל בלבד; אותה מכניקה אינה מתירה להעתיק משמעות משיטת מציאת החן |

## Audit פתוח — לא להסמיך עדיין

### money.p179.sourceByIncomingHonorHouse

- v57: **"אם בשני יש בה צד מיטיב"**.
- executor נוכחי מפעיל את השער רק כאשר `saadNahs === 'saad'` (מיטיב טהור).
- זהו יישום שמרני, אבל טרם הוכח שזהה בדיוק ללשון "צד מיטיב".
- לכן המנוע נשאר runnable לצורכי advisor/debug, אך `certificationStatus: pending-backfill` ו-`clientFacingCertified:false`.
- לפני הסמכה: לבדוק את הסריקה הערבית בעמ׳ 179 ואת סיווג הממוזגות בהקשר הספציפי. אין לשנות executor עד שהמקור נסגר.


### marriage.p211.dissolutionH7StateMatrix

- המנוע הנוכחי runnable, אך אינו מוסמך מקצועית.
- v57 התפעולי הקיים כולל ענפי פנימי, מזיק-פנימי, מיטיב-חיצוני, מזיק-חיצוני ומיטיב-קבוע.
- בבדיקת הסריקה הערבית של עמ׳ 211 נמצאו גם שלושה ענפים נוספים: מזיק-קבוע, מיטיב-מתהפך ומזיק-מתהפך.
- מאחר שהערבית היא verification-only, אסור להכניס את הענפים האלה בשקט למנוע או להחליף באמצעותם את v57.
- לכן certificationStatus נשאר pending-backfill ו-clientFacingCertified נשאר false עד לתיקון מפורש של ארטיפקט v57, הידע הקנוני וה-executor לפי סדר Source Closure.

## כלל הפעלה בזמן ה-Backfill

מנוע runnable שאינו certified אינו מושבת חישובית, כדי שנוכל לבדוק אותו. עם זאת, שכבת השרת דוחה כל `clientAnswerDraft` עבורו. פלט advisor-only עם `clientAnswerDraft:null` מותר, וכך ניתן להמשיך QA בלי לסכן ייעוץ ללקוח.
