# HALL_WISDOM_KASHF_CANONICAL_ROUTING_P0_SPEC

> סטטוס: P0 specification — מקור מחייב למימוש שכבת הניתוב הקנונית של כשף אל־אסראר.
>
> מטרה: לעבור מ־`Question → Topic → run topic bundle` אל `Question → Kashf Intent → one Canonical Method → verdict`.
>
> עקרון עליון: **שיטה אופרטיבית אחת לכל כוונת שאלה.** שיטות חלופיות/חיצוניות נשמרות ללימוד ואינן משתתפות בפסיקה אלא אם נבחרו במפורש בעתיד כשיטה הקנונית של Intent מוגדר.

---

## 1. הבעיה שה־P0 פותר

ה־runtime הקיים של כשף מתחיל מ־`topicId`:

```js
buildKashfReading(board, topicId, clientContext)
```

ומשם קורא `getTopicRules(topicId)` ומפעיל מבנה שמכיל `primaryFormula`, `altFormula` ו־`supportingChecks`.

המודל הזה אינו מתאים למיפוי המקור שבוצע בשער השישי, משום שאותו Topic מחזיק לעיתים כמה כוונות שונות וכמה מסורות שונות. לדוגמה:

- `authorityState` כולל מצב שליט, משך תפקיד, חזרה לתפקיד, מצב כבוד ויציבות.
- `missingPerson` כולל חי/מת, מיקום, חזרה ולעיתים חומר חיצוני על בורח.
- `friendsHope` כולל חברות, תקווה, צורך, אחיזה בדבר ותוספות Nuzhat.
- `spiritualDiagnostics` מערב כיום שאלות שאינן אותה שאלה במקור.

לכן `topicId` יישאר metadata/knowledge grouping בלבד; הוא לא יהיה עוד מפתח ההכרעה הסופי.

---

## 2. הבחנה קריטית: לא להשתמש בשם `intentId` של שכבת ה־AI

בריפו כבר קיימת שכבת Hall of Wisdom Intent Analyzer עם `intentId` כללי כגון:

- `prediction`
- `decisionSupport`
- `stateAssessment`
- `timingRequest`
- `investigation`
- `diagnosis`
- `compatibility`
- `outcomeCompletion`
- וכו׳.

אלה Intents כלליים ואורתוגונליים לשיטת המקור.

לכן שכבת כשף החדשה **לא** תשתמש בשם `intentId` לבדו. השדה המחייב יהיה:

```js
kashfIntentId
```

לדוגמה:

```js
primaryIntent: 'prediction'          // Hall of Wisdom generic intent
kashfIntentId: 'travel.success'      // source-specific intent
kashfMethodId: 'travel.p238.assemble1359'
```

שתי השכבות משלימות זו את זו ואסור למזג ביניהן.

---

## 3. ה־runtime contract החדש

הזרימה המחייבת:

```text
Question ID
  ↓
Question Route
  ↓
kashfIntentId
  ↓
kashfMethodId
  ↓
Canonical Method Registry
  ↓
runtime gate
  ↓
ONE method execution
  ↓
verdict
```

אין:

```text
Question → Topic → primary + alt + all supporting checks
```

ואין fallback שקט מ־Method חסום אל Topic כללי.

---

## 4. סטטוסים מחייבים

### `kashfRuntimeStatus`

הערכים המותרים:

```js
'ready'
'repair-required'
'blocked-by-source'
'educational-only'
'unsupported'
```

### משמעות אופרטיבית

| status | מותר להפיק verdict? |
|---|---|
| `ready` | כן |
| `repair-required` | לא, עד תיקון + Golden Test |
| `blocked-by-source` | לא |
| `educational-only` | לא |
| `unsupported` | לא |

`runtimeAllowed` יהיה שדה מפורש ברשומת Method ולא ייגזר בהסקה מן ה־status.

כלל P0: **רק `runtimeAllowed === true` רשאי להגיע למנוע פסיקה.**

---

## 5. תפקידי Method

`methodRole` יכול להיות רק אחד מאלה:

```js
'canonical-operational'
'supporting-condition'
'educational-only'
'external-tradition'
'unresolved'
```

### Canonical

שיטה אחת בלבד לכל `kashfIntentId`.

### Supporting condition

תנאי ששייך לאותה שיטה קנונית ואינו Method מתחרה.

דוגמה: אם שיטת תקווה דורשת גם פנימיות וגם חזרת בית 11, אלה supporting conditions של אותה שיטה; אין ליצור מהן votes עצמאיים.

### Educational / external

נשמרות לידע, ללימוד ולהסבר — אך לעולם לא מזינות `overallPositive`, verdict או הכרעה משוקללת.

---

## 6. Source / provenance contract

כל Method יקבל metadata מפורש:

```js
{
  sourceVolume: 'kashf',
  sourcePages: [238],
  sourceLayer: 'body',
  attributedSourceBook: 'Kashf',
  sourceConfidence: 'confirmed',
}
```

`sourceLayer`:

```js
'body'
'non-body-addition'
'added-from-other-book'
```

`attributedSourceBook` יכול להיות למשל:

```js
'Kashf'
'Nuzhat al-Uqul'
'al-Multaqat'
'al-Zanati'
'other'
```

העיקרון המחייב:

> Printed in the Kashf volume ≠ body of Kashf.

---

## 7. קבצים חדשים

### 7.1 `goral-hachol/registry/kashf-canonical-method-registry.js`

מקור האמת לשיטות הקנוניות.

מבנה לדוגמה:

```js
export const KASHF_CANONICAL_METHODS = {
  'travel.p238.assemble1359': {
    kashfMethodId: 'travel.p238.assemble1359',
    kashfIntentId: 'travel.success',
    topicId: 'travel',
    methodRole: 'canonical-operational',
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    sourceVolume: 'kashf',
    sourcePages: [238],
    sourceLayer: 'body',
    attributedSourceBook: 'Kashf',
    sourceConfidence: 'confirmed',
    executionKind: 'formula',
    legacyTopicId: 'travel',
  },
};
```

ה־Registry לא יכיל AI calls, UI logic או network.

### 7.2 `goral-hachol/registry/kashf-question-route-registry.js`

מיפוי Question → source intent/method.

```js
export const KASHF_QUESTION_ROUTES = {
  'q-travel-safe': {
    questionId: 'q-travel-safe',
    disposition: 'KEEP',
    kashfIntentId: 'travel.success',
    kashfMethodId: 'travel.p238.assemble1359',
    kashfRuntimeStatus: 'ready',
  },
};
```

Aliases יכולים להצביע לאותו Intent/Method:

```js
'q-short-travel' -> 'travel.success' -> 'travel.p238.assemble1359'
```

### 7.3 `goral-hachol/engine/kashf-method-router.js`

אחריות אחת בלבד:

```js
resolveKashfRouteByQuestionId(questionId)
```

הפלט:

```js
{
  ok,
  questionId,
  kashfIntentId,
  kashfMethodId,
  kashfRuntimeStatus,
  runtimeAllowed,
  reason,
}
```

אין resolver לפי Topic בלבד.

---

## 8. Question Bank contract

בשלב המעבר, `question-bank.js` ימשיך להחזיק את השדות הקיימים לצורכי UI/compatibility, אך יתווספו:

```js
kashfIntentId
kashfMethodId
kashfRuntimeStatus
kashfDisposition
```

או לחלופין הם ייטענו מן `kashf-question-route-registry.js` ולא ישוכפלו פיזית בכל אובייקט.

העדפה ל־P0: **Registry נפרד**, כדי לא לערבב תוכן UI עם source-policy ולהקל על QA.

`topicId` ו־`kashfTopicId` יישארו לצורכי קיבוץ, ידע, תצוגה ו־legacy compatibility בלבד.

---

## 9. API של מנוע כשף — migration ללא שבירה

לא משנים מיד את כל הקריאות הקיימות ל־`buildKashfReading()`.

ב־P0 נוסף API חדש:

```js
buildKashfReadingByMethod(board, kashfMethodId, clientContext = {})
```

הוא:

1. קורא Method מן Canonical Registry.
2. בודק `methodRole === 'canonical-operational'`.
3. בודק `runtimeAllowed === true`.
4. מפעיל רק את executor של Method זה.
5. מחזיר metadata מפורש של ה־Method שהופעל.

ה־API הישן:

```js
buildKashfReading(board, topicId, clientContext)
```

נשאר זמנית לצורכי compatibility ו־tests ישנים, אך מסומן `legacyTopicMode` ואינו endpoint החדש של Question Bank.

אין fallback מן `buildKashfReadingByMethod()` אל `buildKashfReading()`.

אם Method אינו מותר:

```js
{
  status: 'blocked',
  verdict: null,
  reason: 'blocked-by-source' | 'repair-required' | 'educational-only' | 'unsupported'
}
```

---

## 10. כיצד מייצגים Method executors

P0 לא מחייב לכתוב מחדש מיד את כל נוסחאות כשף.

Method יכול להצביע אל אחד מארבעה execution kinds:

```js
'formula'
'legacy-function'
'custom-engine'
'recast-board'
```

### formula

משתמש ב־formula engine הקיים כאשר הפעולה מתאימה בדיוק למקור.

### legacy-function

רק פונקציה שכבר אומתה ומתאימה לשיטה הקנונית הספציפית.

עצם הימצאות פונקציה ב־`LEGACY_FN_REGISTRY` אינה הופכת אותה למותרת לכל Topic.

### custom-engine

לשיטה מקורית שאינה ניתנת לייצוג נכון במבנה formula הפשוט.

### recast-board

ישתמש ב־primitive המשותף שיוגדר ב־P2:

```js
recastBoardFromHouses(board, motherHouseNumbers)
```

---

## 11. Supporting conditions — שינוי מבני

במקום:

```js
topic.supportingChecks = [...]
```

ה־Method עצמו יחזיק:

```js
supportingConditionIds: [
  'hope.p267.incoming-condition',
  'hope.p267.house11-recurrence',
]
```

כל supporting condition חייב:

- להיות שייך ל־Method אחד או לקבוצת Methods מפורשת;
- להיות מצוטט למקור;
- לא להפיק vote עצמאי;
- לא לשנות verdict אלא אם השיטה הקנונית עצמה אומרת שהוא תנאי הכרעה.

---

## 12. איסור automatic alt formula

ב־P0 מבוטל העיקרון:

```text
primaryFormula + altFormula = שני ממצאים באותה קריאה
```

`altFormula` יכול להישאר ב־legacy data לצורכי היסטוריה, אבל בשכבה החדשה הוא חייב לקבל Method record נפרד עם role מתאים:

```js
methodRole: 'educational-only'
```

או, אם יתברר שהוא Intent אחר:

```js
methodRole: 'canonical-operational'
kashfIntentId: '<different-intent>'
```

אין מצב שבו Alt של Intent אחד נכנס אוטומטית לפסיקת Intent אחר.

---

## 13. Educational knowledge contract

שיטות Educational יכולות להישלח לשכבת הידע/AI רק תחת metadata מפורש:

```js
{
  knowledgeAvailable: true,
  runtimeAllowed: false,
  evidenceRole: 'educational-alternative'
}
```

ה־AI רשאי להסביר:

> "בספר מובאת גם שיטה חלופית..."

אבל אינו רשאי:

- לצרף אותה ל־verdict;
- לבצע majority בין methods;
- להציג אותה כאימות נוסף לשיטה הקנונית;
- לשנות `overallPositive` בגללה.

---

## 14. Block / unsupported UI behavior

כאשר Question ב־Kashf mode אינו Runtime-safe, אין לייצר קריאה חלקית או fallback.

ה־UI יקבל object מפורש:

```js
{
  canRunKashf: false,
  status: 'blocked-by-source',
  userMessage: 'שיטת כשף לשאלה זו עדיין אינה מאושרת להפעלה.'
}
```

`educational-only`:

```js
userMessage: 'החומר קיים בספריית הלימוד אך אינו משמש כרגע לפסיקה.'
```

`unsupported`:

```js
userMessage: 'לא נמצא כרגע חוק כשף אופרטיבי מאומת לשאלה זו.'
```

אין לנחש שיטה חלופית.

---

## 15. ה־AI Intent Analyzer אינו בוחר Canonical Method במקום Registry

ה־Hall of Wisdom Intent Analyzer נשאר שכבה חשובה, אך אינו מקור האמת לבחירת נוסחת כשף כאשר המשתמש בחר Question ID מפורש.

כאשר Question ID ידוע:

```text
Question Route Registry = authoritative for Kashf method selection
```

ה־AI/general Intent Analyzer יכול:

- לסווג prediction / timing / investigation וכו׳;
- לזהות שהניסוח החופשי אינו מתאים לשאלה שנבחרה;
- לבקש clarification.

הוא לא יכול:

- לבחור Method אחר אחרי שהלוח נבנה;
- לעקוף `runtimeAllowed:false`;
- להחליף Method קנוני ב־Topic heuristic.

---

## 16. P0 first safe slice

המימוש הראשון יכלול רק Methods שמוגדרים `ready` ושאין להם מחלוקת מקור פתוחה.

קבוצת התחלה מומלצת:

```text
completion.willComplete
relocation.placeToPlace
illness.recovery
illness.bodyPart
pregnancy.gender
siblings.relationship
siblings.seniority
marriage.previousStatus
travel.success
```

כל שאר ה־Methods ייכנסו ל־Registry עם ה־status האמיתי שלהם, אך `runtimeAllowed:false` עד תיקון ואימות.

---

## 17. P0 acceptance tests

P0 אינו שלם עד שכל הבדיקות הבאות עוברות:

1. Question `q-travel-safe` resolves בדיוק ל־`travel.success` ול־Method p238.
2. Alias `q-short-travel` resolves לאותו Method בדיוק.
3. `q-promise` מחזיר `educational-only` ולא מפעיל verdict.
4. `q-sorcery` מחזיר `unsupported/blocked` במצב Kashf ואינו מפעיל את p167.
5. `q-friends` אינו מפעיל hope/need/Nuzhat methods.
6. `q-stability` אינו מפעיל appointment/ruler-return methods.
7. `q-missing-alive` אינו מפעיל fugitive/non-body helpers.
8. Method עם `runtimeAllowed:false` לעולם אינו מגיע ל־executor.
9. Educational method יכול להופיע ב־knowledge payload אך לא ב־`appliedBookRules`/verdict.
10. אין automatic `altFormula` בנתיב החדש.
11. אין fallback ל־Topic כאשר `kashfMethodId` חסר/חסום.
12. ה־legacy API ממשיך לעבור את ה־tests הקיימים עד cutover, אך ה־Question Bank החדש אינו משתמש בו.

---

## 18. קבצים ש־P0 צפוי לשנות

### חדשים

```text
goral-hachol/registry/kashf-canonical-method-registry.js
goral-hachol/registry/kashf-question-route-registry.js
goral-hachol/engine/kashf-method-router.js
_test_kashf_canonical_routing.mjs
```

### קיימים — שינוי מינימלי ומבוקר

```text
goral-hachol/engine/kashf-reading-engine.js
goral-hachol/ui/question-bank.js  (או consumption-side בלבד אם route registry נשאר נפרד)
goral-hachol/intelligence/kashf-ai-context-builder.js
```

### לא נוגעים ב־P0

```text
KDF-013 implementation
hidden-depth unresolved logic
travel vehicle source contradiction
prisoner release timing
partnership unresolved operation
```

---

## 19. Invariants שאסור להפר

1. **One operational method per Kashf intent.**
2. Topic אינו verdict router.
3. Generic Hall of Wisdom `intentId` אינו `kashfIntentId`.
4. `runtimeAllowed:false` הוא hard stop.
5. `educational-only` לעולם אינו vote.
6. `supporting-condition` אינו Method מתחרה.
7. אין majority בין traditions/methods אלא אם המקור הקנוני עצמו מצווה majority.
8. אין fallback שקט.
9. אין תיקון של unresolved source באמצעות inference בקוד.
10. Kashf/Hawi נשארים source-separated.
11. Recast methods משתמשים בלוח חדש ואינם משנים את הלוח המקורי.
12. AI יכול להסביר ולבקר; הוא אינו מחשב מחדש או משנה verdict דטרמיניסטי.

---

## 20. סדר ביצוע לאחר אישור מפרט זה

```text
P0-A  Canonical Method Registry
P0-B  Question Route Registry
P0-C  hard-stop Method Router
P0-D  buildKashfReadingByMethod()
P0-E  ready-only pilot routes
P0-F  isolation tests for blocked/educational
P0-G  switch Question Bank Kashf path to canonical router
P1    repair classifiers/formula chains
P2    recastBoardFromHouses primitive
P3    missing canonical engines
P4    Golden Tests + source traceability audit
```

המטרה של P0 אינה להגדיל את מספר המנועים. המטרה היא להבטיח שכל מנוע שכבר קיים או ייבנה בעתיד **יוכל לפעול רק כאשר השאלה המדויקת בחרה בו כמקור ההכרעה הקנוני**.
