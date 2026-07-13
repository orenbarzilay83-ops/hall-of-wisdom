# HALL_WISDOM_GORAL_QA_SUPABASE_MOCK_DEPLOY_REPORT — Deploy בוצע (MOCK בלבד) + חסימת-אימות מהסביבה

> **דוח מעודכן. הפעם ה-deploy בוצע בהצלחה דרך Supabase MCP (שחיברת). לא הוגדר שום secret חדש (לא `ANTHROPIC_API_KEY`, לא `HALL_WISDOM_AI_MODE`). לא בוצע Vercel production deploy, לא merge ל-`main`, לא שינוי-קוד — ולכן אין commit בשלב הזה (`git status` על קבצי `.ts`/`.js` נקי מאז `cee58a9`).**
> תאריך: 2026-07-13. מחליף/מעדכן את הגרסה הקודמת של דוח זה (שתיעדה חסימה מוחלטת לפני חיבור ה-MCP).

---

## 1. Deploy — בוצע בהצלחה

```
mcp__Supabase__deploy_edge_function
  project_id: hfdsoudhelzayimjwqkp
  name: oren-smart-advisor
  entrypoint_path: index.ts
  verify_jwt: true
  files: [index.ts, goral_qa_mock_evaluator.ts, anthropic-provider-edge.ts,
          goral-qa-evaluator-prompt.ts, goral_qa_payload_sanitizer.ts]
  (כל 5 הקבצים נקראו מהדיסק מייד-לפני-השליחה, מ-commit cee58a9 — אין drift)

→ {
  "id": "de502410-4d27-4750-a8b5-e0198b3a3b33",
  "slug": "oren-smart-advisor",
  "version": 1,
  "status": "ACTIVE",
  "verify_jwt": true,
  "ezbr_sha256": "93d7905d1d02058bda859cdf2747c7b98f92b3db7cf856d1f0cd8aa68089460b"
}
```

**אימות נוסף (`get_edge_function`):** קראתי בחזרה את חמשת-הקבצים כפי-שהם-פרוסים-בפועל בפרויקט — **זהים-מילה-במילה** לקוד ב-commit `cee58a9`. זו הוכחה חיובית חשובה שלא הייתה זמינה קודם: **Deno Edge Runtime האמיתי טען את `index.ts` ואת שרשרת-ה-imports-היחסיים שלו (`./goral_qa_mock_evaluator.ts`, `./anthropic-provider-edge.ts`, `./goral-qa-evaluator-prompt.ts`, `./goral_qa_payload_sanitizer.ts`) בהצלחה** — הפער שנשאר-פתוח ב-`HALL_WISDOM_GORAL_QA_SUPABASE_LOCAL_SERVE_REPORT.md` (§5, "לא ידוע אם ה-bundling של Deno עובד, כי Docker לא היה זמין") **נסגר בפועל על ידי ה-deploy עצמו**, לא רק על ידי בדיקות-Node.

**לפני ה-deploy** בדקתי `list_edge_functions` → `{"functions":[]}` — **לא היה שום function קיים**, כך שה-deploy הזה לא דרס/שינה שום דבר קיים.

## 2. Project ref

`hfdsoudhelzayimjwqkp` ("Hall-of-wisdom Project", `ACTIVE_HEALTHY`, region `eu-west-3`) — אושר פעמיים דרך `list_projects`, זהה למה שמופיע ב-`supabase-client.js` הקיים באתר.

## 3. אילו secrets כבר קיימים בפרויקט (שמות בלבד, בלי ערכים)

**לא הצלחתי לבדוק את זה — ומדווח את זה כממצא-מגבלה, לא כ"בוצע."** סרקתי את מלוא-רשימת-29-הכלים הזמינים לי דרך Supabase MCP (`list_projects`, `get_project`, `get_project_url`, `get_publishable_keys`, `list_edge_functions`, `get_edge_function`, `deploy_edge_function`, `get_logs`, `get_advisors`, `list_tables`, `execute_sql`, `apply_migration`, `list_migrations`, `list_extensions`, כלי-branch, `create_project`, `pause_project`, `restore_project`, `confirm_cost`, `get_cost`, `list_organizations`, `get_organization`, `generate_typescript_types`, `search_docs`) — **אין ביניהם שום כלי לרשימת-secrets** (לא `list_secrets`, לא `get_secrets`, אפילו לא ברמת-שמות-בלבד). **המסקנה: השאלה "אילו secrets כבר קיימים" לא ניתנת-לבדיקה מהסביבה הזו בכלל, לא רק בלי-ערכים.**

הדרך היחידה לברר בפועל: Supabase Dashboard → Project Settings → Edge Functions → Secrets (אתה בלבד, אני לא-יכול-לגשת-לשם).

## 4. `ANTHROPIC_API_KEY` — לא הוגדר על ידי

**מאושר.** לא קראתי לשום כלי `secrets set`/מקביל (אין כזה כלי זמין לי גם דרך ה-MCP — רק `deploy_edge_function`, שלא כולל secrets). הקוד הפרוס עצמו (סעיף 1) קורא ל-`Deno.env.get('ANTHROPIC_API_KEY')` רק בתנאי מוגן (5-תנאי-live, ראו §8) — לא-מכיל ערך-מפתח בשום מקום.

## 5. `HALL_WISDOM_AI_MODE` — לא הוגדר ל-`live`, ולא הוגדר בכלל על ידי

**מאושר**, מאותה סיבה כמו סעיף 4. משמעות מעשית: גם אם המשתנה כבר-קיים-מוגדר-אחרת בפרויקט (לא ידוע לי, ראו §3) — הקוד עדיין בודק `getEnv('HALL_WISDOM_AI_MODE') !== 'live'` כתנאי-חסימה נפרד, כך שרק ערך מדויק `'live'` היה-פותח את הנתיב — ואני לא-קבעתי אותו.

## 6-7. בדיקות 401 / mode:"mock" — לא בוצעו, בעיית-רשת בסביבת-הביצוע שלי (לא בקוד)

**ממצא קריטי שצריך לדעת:** ניסיתי להריץ `curl` נגד ה-endpoint החי (`https://hfdsoudhelzayimjwqkp.supabase.co/functions/v1/oren-smart-advisor`) — כל שלוש הבדיקות המתוכננות (ללא-token, עם-token-מזויף, POST עם `module:"goralQA"`) **נכשלו עם `HTTP_STATUS:000`** — כשל-חיבור, לא-קוד-HTTP.

אבחון (`curl -sv`):
```
* Connected to 127.0.0.1 (127.0.0.1) port 42245  ← proxy הפנימי של הסביבה
> CONNECT hfdsoudhelzayimjwqkp.supabase.co:443 HTTP/1.1
< HTTP/1.1 403 Forbidden
* CONNECT tunnel failed, response 403
* Closing connection
```

אישוש (`curl -sS "$HTTPS_PROXY/__agentproxy/status"`):
```json
"recentRelayFailures": [
  {"kind":"connect_rejected",
   "detail":"gateway answered 403 to CONNECT (policy denial or upstream failure)",
   "host":"hfdsoudhelzayimjwqkp.supabase.co:443"},
  ... (עוד 3 כשלים זהים)
]
```

ואישוש-סופי מ-`/root/.ccr/README.md` (הנחיית-התשתית של סביבת-הריצה שלי):
> "### 403 / 407 from the proxy — The destination host is not allowed by your organization's egress policy for this session. **Do not retry or route around it** — report the blocked host."

**כלומר: זו לא תקלה-לתיקון — זו מדיניות-ארגונית מפורשת שחוסמת גישת-Bash/curl שלי לדומיין `*.supabase.co` מהסביבה הזו, ואסור לי לנסות לעקוף אותה.** ניסיתי גם דרך `get_logs` (service: `edge-function`) כערוץ-חלופי דרך ה-MCP — התוצאה הייתה `{"result":[],"error":null}` (ריק — צפוי, שכן אף בקשה לא-הגיעה-בפועל ל-function, כולל הבדיקות-שנכשלו-בשלב-ה-proxy עצמו, לפני שהגיעו-אפילו-לאינטרנט).

**המשמעות המעשית:** אני לא יכול לבצע שום בדיקת-HTTP (לא 401, לא 403, לא 200-mock, לא ליד-live-שנופל-ל-mock) נגד ה-endpoint החי, מהסביבה הזו, בשום שיטה שיש לי (לא Bash/curl, לא MCP — אין כלי-HTTP-גנרי ב-Supabase MCP). **זו לא בעיה בקוד שנפרס** — הדבר היחיד שנבדק-בהצלחה הוא שה-deploy עצמו הצליח ושהקוד-הפרוס תואם-בדיוק את מה-שאושר (§1).

**איך להשלים את הבדיקה בפועל:** אתה יכול להריץ את פקודות ה-curl הבאות בטרמינל-שלך (לא כאן) ולהדביק לי **רק את קודי-הסטטוס** (למשל `401`, `200`) — בלי שום גוף-תגובה עם מידע-רגיש, אם יש כזה:
```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  https://hfdsoudhelzayimjwqkp.supabase.co/functions/v1/oren-smart-advisor
# צפוי: 401 (אין Authorization header)

curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: Bearer <הטוקן-האמיתי-שלך-מה-session-שלך-באתר>" \
  -H "Content-Type: application/json" \
  -d '{"module":"kashf"}' \
  https://hfdsoudhelzayimjwqkp.supabase.co/functions/v1/oren-smart-advisor
# צפוי: 200 עם advisorBrainOutput (MOCK) — זהה-להתנהגות-הישנה שכבר-נבדקה
```
**לעולם אל תדביק לי כאן את גוף-התגובה המלא אם הוא מכיל טוקן/session — רק את קוד-הסטטוס (ואם תרצה, את השדות `ok`/`module`/`evaluatorMode` בלבד).**

## 8. `mode:"live"` — נשאר חסום בקוד, מאומת דרך קריאה-חוזרת של הקוד-הפרוס

מאומת ישירות מהקוד שחזר מ-`get_edge_function` (זהה למה שנשלח, §1): הנתיב ל-AI חי דורש בו-זמנית **5 תנאים**: `body.mode==='live'` **וגם** `HALL_WISDOM_AI_MODE==='live'` (סעיף 5: לא הוגדר) **וגם** `ANTHROPIC_API_KEY` קיים (סעיף 4: לא הוגדר) **וגם** `ANTHROPIC_MODEL` קיים (לא הוגדר) **וגם** עובר סניטציה. כל תנאי-חסר → `mockFallback(reason)`, אף פעם לא קריאת-AI. גם אם `body.mode==='live'` יישלח על ידי קורא-כלשהו — התוצאה **תמיד** `evaluatorMode:'mock'` כרגע.

## 9. אין AI חי — מאושר

ראה §4, §5, §8 — לא הוגדר אף secret הדרוש להפעלת-AI חי, והקוד עצמו חוסם-בכל-מקרה בלי-4-התנאים-הנוספים.

## 10. אין production deploy של Vercel — מאושר

לא בוצעה שום פעולה על Vercel בשלב זה. ה-deploy היחיד שבוצע הוא ל-Supabase Edge Function, נפרד לגמרי מ-Vercel/מהאתר-הסטטי.

## 11. אין merge ל-`main` — מאושר

הענף הנוכחי: `claude/app-cleanup-organization-mia9b2` (מאומת). לא בוצעה שום פעולת-git בשלב הזה כלל (אין שינוי-קוד לקומיט).

## 12. פקודת Rollback

**אין כלי `delete_edge_function`/`undeploy` זמין לי דרך ה-Supabase MCP.** דרכי-rollback זמינות:
- **המהיר ביותר, אם בעתיד יוגדר `HALL_WISDOM_AI_MODE=live` בטעות:** `supabase secrets unset HALL_WISDOM_AI_MODE` (בטרמינל שלך, או Dashboard → Edge Functions → Secrets) — מחזיר מיידית ל-MOCK-בלבד, בלי-להסיר-את-הפונקציה.
- **הסרה מלאה של הפונקציה עצמה** (אם תרצה לבטל את ה-deploy כליל): Supabase Dashboard → Edge Functions → `oren-smart-advisor` → Delete, או `supabase functions delete oren-smart-advisor` בטרמינל שלך (לא בוצע ולא-דרוש עכשיו — הפונקציה במצב-בטוח כרגע: fail-closed על auth, MOCK-בלבד על goralQA).

## 13. המלצה לשלב הבא

**רק אחת:** אם תרצה סגירה-מלאה-של-מעגל-האימות (שאני לא-יכול-להשלים מכאן, ראו §6-7) — הרץ בעצמך את שתי פקודות ה-curl בסעיף 6-7 (קוד-סטטוס בלבד, לא גוף-תגובה עם טוקן) ותדביק לי את התוצאה; אכתוב תוספת-קצרה לדוח הזה שמאשרת-בפועל 401/200 כצפוי. **לא ממליץ על שום פעולה נוספת מעבר לזה כרגע** — לא הגדרת-secrets, לא הפעלת-live, לא deploy נוסף — עד שתחליט אחרת במפורש.

---

## אישורים מסכמים

- ✅ **Deploy בוצע** — `status:ACTIVE`, `version:1`, קוד-פרוס זהה-מוודא ל-`cee58a9`.
- ✅ **לא הוגדר `ANTHROPIC_API_KEY`.**
- ✅ **לא הוגדר `HALL_WISDOM_AI_MODE=live`.**
- ⚠️ **לא ניתן היה לבדוק שמות-secrets קיימים** — אין כלי-מתאים ב-Supabase MCP (לא רק חוסר-הרשאה — הכלי עצמו לא-קיים).
- ⚠️ **לא ניתן היה להריץ שום בדיקת-HTTP נגד ה-endpoint** — הסביבה שלי חסומה ברמת-egress-policy לדומיין `*.supabase.co` (403 על CONNECT, מדיניות-ארגונית מפורשת, "לא לנסות-לעקוף").
- ✅ **`mode:"live"` נשאר חסום בקוד** — מאומת מקריאה-חוזרת של הקוד-הפרוס-בפועל, לא רק מהקוד-בריפו.
- ✅ **אין AI חי, אין production deploy של Vercel, אין merge ל-`main`, אין שינוי-קוד, אין commit בשלב הזה.**
