import json, re
from pathlib import Path

INDEX=Path('kashf-v57-ai-master-index.html')
HANDOFF=Path('KASHF_AI_MASTER_INDEX_CONTINUATION_HANDOFF.md')
text=INDEX.read_text(encoding='utf-8')

def record_span(src,eid):
    marker=f'"entryId": "{eid}"'
    p=src.index(marker)
    s=src.rfind('    {',0,p)
    e=src.find('\n    {',p)
    if e<0: e=src.index('\n  ],',p)
    return s,e

def replace_record_array(src,eid,field,values):
    s,e=record_span(src,eid)
    block=src[s:e]
    pat=rf'      "{re.escape(field)}": \[\n.*?\n      \],'
    repl='      "'+field+'": [\n'+',\n'.join('        '+json.dumps(v,ensure_ascii=False) for v in values)+'\n      ],'
    block2,n=re.subn(pat,repl,block,count=1,flags=re.S)
    if n!=1: raise SystemExit(f'{eid}: {field} array replacement count {n}')
    return src[:s]+block2+src[e:]

def replace_record_note(src,eid,note):
    s,e=record_span(src,eid)
    block=src[s:e]
    pat=r'        "note": ".*?",\n        "visualLineByLineChecked"'
    repl='        "note": '+json.dumps(note,ensure_ascii=False)+',\n        "visualLineByLineChecked"'
    block2,n=re.subn(pat,repl,block,count=1,flags=re.S)
    if n!=1:
        # Some records may put visualLineByLineChecked before note.
        pat2=r'        "note": ".*?"\n'
        repl2='        "note": '+json.dumps(note,ensure_ascii=False)+'\n'
        block2,n=re.subn(pat2,repl2,block,count=1,flags=re.S)
    if n!=1: raise SystemExit(f'{eid}: note replacement count {n}')
    return src[:s]+block2+src[e:]

def replace_queue_summary(src,qid,summary):
    marker=f'"id": "{qid}"'
    p=src.index(marker)
    s=src.rfind('    {',0,p)
    e=src.find('\n    }',p)+6
    block=src[s:e]
    pat=r'      "summary": ".*?"\n'
    repl='      "summary": '+json.dumps(summary,ensure_ascii=False)+'\n'
    block2,n=re.subn(pat,repl,block,count=1,flags=re.S)
    if n!=1: raise SystemExit(f'{qid}: summary replacement count {n}')
    return src[:s]+block2+src[e:]

text=replace_record_array(text,'figures.p97-99.dignities-source-table','sourceDiscrepancies',[
    'v57 הנוכחי עדיין מכניס לטבלת עמ׳ 97–99 את סוהר ואת ממון נכנס, אף ששתי הצורות אינן מופיעות כלל בטבלת המקור המודפסת; אין להשלים אותן מן הסימטריה או ממקור חיצוני.',
    'v57 הנוכחי משמיט מן הרצף את חיבור ואת דרך, אף ששתי הצורות מופיעות במפורש בטבלת המקור בעמ׳ 98–99.',
    'בממון יוצא v57 עדיין נותן פנים 3, ואילו המקור המודפס בעמ׳ 99 אומר במפורש وجهه الخامس — פנים 5.'
])
text=replace_record_note(text,'figures.p97-99.dignities-source-table',
    'Pass 2 rechecked printed pp97–99 visually and compared them with the current v57. The printed table has 14 rows only. Earlier v57 defects for Ataba Kharija, Nusra Kharija and Nusra Dakhila are already corrected in the current v57 and were removed from the live discrepancy list; the remaining blockers are the unsupported Aqla/Qabd-Dakhil rows, omitted Ijtima/Tariq rows, and Qabd Kharij face=3 versus printed face=5.')

text=replace_record_array(text,'figures.p100.joy-grief-supplement','sourceDiscrepancies',[
    'v57 הנוכחי משמיט את השורה המודפסת فرح أشكال الزهرة بالخامس — שמחת צורות נוגה בבית 5.',
    'v57 הנוכחי מצרף את דרך וממון יוצא לצער בבית 1; המקור המודפס מצרף שם דווקא את לבן ודרך: بياض وطريق ترحها بالأول.',
    'בסיום הסעיף v57 משאיר רק את סף יוצא כנספח אפשרי לשבתאי/מאדים; המקור המודפס אומר قبض خارج وعتبة خارج لعله ملحوقات بزحل والمريخ — ממון יוצא וסף יוצא יחד, בהסתייגות ״אולי״.'
])
text=replace_record_note(text,'figures.p100.joy-grief-supplement',
    'Pass 2 visually rechecked printed p100 against current v57. The source is clear: Venus joy is H5; Bayad+Tariq are the H1 grief pair; and Qabd Kharij+Ataba Kharija are both in the tentative Saturn/Mars attachment clause. The printed odd wording ترح الأشكال ... فرحها بالحادي عشر is preserved without silent normalization.')

text=replace_record_array(text,'figures.p100-101.month-associations','sourceDiscrepancies',[
    'v57 הנוכחי משמיט את שיוך לבן למוחרם ואת העובדה שלבן משויך גם לשוואל; הסריקה המודפסת בעמ׳ 101 קוראת שוואל ומוחרם עם البياض.',
    'v57 הנוכחי משמיט את שיוך סף נכנס לרביע האחרון; הסריקה המודפסת בעמ׳ 101 נותנת במפורש ربيع الآخر له: عتبة داخلة.'
])
text=replace_record_note(text,'figures.p100-101.month-associations',
    'Pass 2 visually rechecked printed pp100–101. The printed layout resolves OCR line-flow ambiguity: Bayad is associated with both Shawwal and Muharram, and Ataba Dakhila with Rabi al-Akhir. These are source-clear v57 omissions, not permission to force a one-to-one month map.')

text=replace_queue_summary(text,'B04-P97-99-DIGNITIES',
    'Current-v57 remaining repairs only: remove unsupported Aqla/Qabd-Dakhil rows from the printed p97-99 table, restore the printed Ijtima and Tariq rows, and fix Qabd Kharij face from 3 to printed face=5. Earlier Ataba Kharija, Nusra Kharija and Nusra Dakhila defects are already corrected in current v57.')
text=replace_queue_summary(text,'B04-P100-VENUS-JOY',
    'Repair current v57 p100 from the printed source: restore Venus joy at H5; replace the erroneous Tariq+Qabd-Kharij H1 grief pair with Bayad+Tariq; and preserve both Qabd Kharij + Ataba Kharija in the tentative Saturn/Mars attachment clause.')
text=replace_queue_summary(text,'B04-P100-101-MONTHS',
    'Restore the two visually confirmed printed associations omitted by current v57: Bayad with Muharram in addition to Shawwal, and Ataba Dakhila with Rabi al-Akhir. Do not normalize the source into a one-to-one month map.')
INDEX.write_text(text,encoding='utf-8')

h=HANDOFF.read_text(encoding='utf-8')
needle='קובץ הטקסט הערבי המלא / OCR / EPUB הוא **מקור עזר בלבד** ואינו גובר על הסריקה.\n'
policy=(needle+'\nהספר `الفلك المشحون في علم الرمل المصون` הוא **מקור עזר משווה מורשה** להבנת מונחים, שיטות וקטעים פגומים או עמומים. הוא אינו סמכות מעל הסריקה המודפסת של KASHF, ואסור להשתמש בו כדי למלא בשקט חסר ב־KASHF או לייחס ל־KASHF כלל שמופיע רק בו. אם נעזרים בו, יש לסמן זאת במפורש כ־supporting/comparative evidence; כל עמימות במקור הראשי נשארת `REVIEW_REQUIRED` עד הכרעה מתוך KASHF עצמו.\n')
if 'الفلك المشحون في علم الرمل المصون` הוא **מקור עזר משווה מורשה**' not in h:
    if needle not in h: raise SystemExit('handoff policy insertion point missing')
    h=h.replace(needle,policy,1)

start=h.index('### מצב Pass 2 לאחר בדיקת עמ׳ 43–66')
end=h.index('### כלל עדכון Pointer',start)
new='''### מצב Pass 2 לאחר בדיקת עמ׳ 43–101\n\n- `lastCompletedReviewEntry`: `figures.p100-101.month-associations`\n- `lastCompletedPrintedRange`: **97–101**\n- `lastCompletedScanRange`: **99–103**\n- `nextReviewEntry`: `shibutz.p111.money-number-table`\n- `nextReviewPrintedRange`: **111**\n- `nextReviewScanRange`: **113**\n- `reviewRequiredStatusCount`: **90** — שמונה הרשומות שנבדקו עד כה נשארו `REVIEW_REQUIRED` רק כאשר נשאר blocker אמיתי; לא שונה סטטוס מלאכותית.\n- `pass2ReviewedEntries`: **8 / 90**\n- `pass2UnauditedReviewEntries`: **82**\n- `VERIFIED`: **181**\n- `latestMergedPass2PR`: **#43**\n- `PR #43 merge SHA`: `819a43f3d7c3b3630c11b6769650fe02b4d42a29`\n\nהכרעות Pass 2 שכבר בוצעו:\n\n1. `houses.p43-44.taxonomy` — סיווג **B**: המקור המודפס ברור, אך v57 שגוי. הסריקה קובעת `زايد الأوتاد = H3/H6/H9` ומורה על העבר; `الساقط = H6/H12` הוא סיווג נפרד. האינדקס תוקן לשקף זאת, והרשומה נשארת `REVIEW_REQUIRED` עד תיקון v57.\n2. `houses.p45.aspects-and-gender` — סיווג **C**: המילה `والثاني` מודפסת בבירור לאחר שלושת זוגות ה־sextile, אך תפקידה התחבירי/מבני אינו סגור מן המקור. היא נשמרת כאנומליית מקור; נוסף `sourceConflictQueue` מתאים, ואין להמציא זוג רביעי.\n3. `houses.p46-53.profiles` — סיווג **B** ברוב הפערים, עם תת־מקרה **C** ב־H15: בדיקה חזותית רציפה של עמ׳ מודפס 46–53 חשפה פערי v57 נוספים ב־H1, H3, H5, H8, H9, H10, H12 ו־H15. H15 נשאר גם ב־`sourceConflictQueue` משום שהמשפט המודפס עצמו פגום ואינו מכיל `خفيف`.\n4. `figures.p65.sought-hebrew-wording` — סיווג **B / translation-review**: טבלת הסמלים עצמה סגורה. v57 הנוכחי כבר תיקן את שורה 8 (`معدوم حد، مقصر`) ושיפר את שורה 6, אך שורה 2 עדיין מעלימה את המונח המודפס `منحضر` בתוך ״ממתינה״ ושורה 6 `بالرفق معدم` עדיין דורשת אישור ניסוח מקור־נאמן. הרשומה נשארת `REVIEW_REQUIRED`; לא משנים את מיפוי הסמלים.\n5. `figures.p65-66.house-gender-context` — סיווג **B**: ההליך לזכר/נקבה ברור במקור, אך המקור חוזר על `وله فرج حقيقي / ليس له فرج حقيقي` בעוד v57 מפרפרז כ־״סימן מין ממשי״. האינדקס משמר את הערבית ואינו מרחיב אנטומית; הרשומה נשארת `REVIEW_REQUIRED` עד תיקון/הערת v57 מקור־נאמנה.\n6. `figures.p97-99.dignities-source-table` — סיווג **B**: טבלת המקור ברורה ומכילה 14 צורות בלבד. v57 הנוכחי כבר תיקן כמה שגיאות ישנות, ולכן הוסרו מן discrepancy list; שלושת ה־blockers החיים הם הכנסת סוהר וממון נכנס שאינם בטבלה המודפסת, השמטת חיבור ודרך, ופנים 3 לממון יוצא במקום פנים 5 במקור.\n7. `figures.p100.joy-grief-supplement` — סיווג **B**: המקור המודפס ברור. v57 עדיין משמיט את שמחת נוגה בבית 5; מציג דרך+ממון יוצא כצער בבית 1 במקום לבן+דרך; ובסעיף ההסתייגות לשבתאי/מאדים משאיר רק סף יוצא במקום ממון יוצא+סף יוצא. הנוסח החריג `ترح الأشكال ... فرحها بالحادي عشر` נשמר ככתבו ואינו מתוקן מן ההיגיון.\n8. `figures.p100-101.month-associations` — סיווג **B**: צילום עמ׳ 101 מכריע את זרימת השורות שה־OCR עלול לבלבל. לבן משויך גם לשוואל וגם למוחרם, וסף נכנס משויך לרביע האחרון. v57 משמיט את שני השיוכים; אין להפוך את מפת החודשים ליחס אחד־לאחד.\n\nמכאן ממשיכים **לפי סדר העמודים בלבד** אל:\n\n`shibutz.p111.money-number-table`\n\nעמוד מקור: **111**  \nעמוד scan: **113**\n\nאין להתחיל מחדש מ־Batch 01, אין לדלג לרשומה מאוחרת משום שהיא קלה יותר, ואין להתחיל מ־p277.\n\n'''
h=h[:start]+new+h[end:]
HANDOFF.write_text(h,encoding='utf-8')

# Structural QA on embedded JSON without rewriting it.
t=INDEX.read_text(encoding='utf-8')
m=re.search(r'<script id="kashf-ai-master-index-data" type="application/json">\s*(\{.*?\})\s*</script>',t,re.S)
d=json.loads(m.group(1))
assert len(d['records'])==271
ids=[r['entryId'] for r in d['records']]; assert len(ids)==len(set(ids))
counts={}
for r in d['records']: counts[r.get('verificationStatus')]=counts.get(r.get('verificationStatus'),0)+1
assert counts.get('VERIFIED')==181 and counts.get('REVIEW_REQUIRED')==90 and counts.get('INDEXED',0)==0 and counts.get('UNRESOLVED',0)==0
assert sum(r.get('runtimeEligible') is True for r in d['records'])==0
covered=set(); [covered.update(r.get('bookPages') or []) for r in d['records']]
assert set(range(21,277))<=covered
for k in ['v57CorrectionQueue','sourceConflictQueue','downstreamCorrectionQueue']:
    q=[x['id'] for x in d.get(k,[])]; assert len(q)==len(set(q))
r=next(x for x in d['records'] if x['entryId']=='figures.p97-99.dignities-source-table'); assert len(r['dignityRows'])==14 and {x['pattern'] for x in r['omittedFromPrintedTable']}=={'2121','1221'}
j=next(x for x in d['records'] if x['entryId']=='figures.p100.joy-grief-supplement'); assert any(x.get('entity')=='צורות נוגה' and x.get('house')==5 for x in j['planetJoy'])
mo=next(x for x in d['records'] if x['entryId']=='figures.p100-101.month-associations'); mm={x['arabic']:set(x['figures']) for x in mo['monthAssociations']}; assert mm['شوال']=={'2222','2212'} and mm['محرم']=={'2212'} and mm['ربيع الآخر']=={'1121','2111'}
assert all(next(x for x in d['records'] if x['entryId']==eid)['verificationStatus']=='REVIEW_REQUIRED' for eid in ['figures.p97-99.dignities-source-table','figures.p100.joy-grief-supplement','figures.p100-101.month-associations'])
hh=HANDOFF.read_text(encoding='utf-8'); assert '`pass2ReviewedEntries`: **8 / 90**' in hh and '`nextReviewEntry`: `shibutz.p111.money-number-table`' in hh and 'מקור עזר משווה מורשה' in hh
print('QA_OK minimal-patch records=271 VERIFIED=181 REVIEW_REQUIRED=90 runtimeEligibleTrue=0 coverage=21-276 reviewed=8/90 next=p111')
