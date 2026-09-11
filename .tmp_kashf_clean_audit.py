from pathlib import Path
from collections import Counter
import json, re

P=Path('kashf-v57-ai-master-index.html')
text=P.read_text(encoding='utf-8')

def object_span_for(key, value):
    needle=f'"{key}": "{value}"'
    pos=text.find(needle)
    if pos < 0:
        raise SystemExit(f'not found: {needle}')
    start=text.rfind('{',0,pos)
    if start < 0:
        raise SystemExit('object start not found')
    i=start; depth=0; in_str=False; esc=False
    while i < len(text):
        ch=text[i]
        if in_str:
            if esc: esc=False
            elif ch=='\\': esc=True
            elif ch=='"': in_str=False
        else:
            if ch=='"': in_str=True
            elif ch=='{': depth+=1
            elif ch=='}':
                depth-=1
                if depth==0:
                    return start,i+1
        i+=1
    raise SystemExit('object end not found')

def edit_object(key,value,edits):
    global text
    s,e=object_span_for(key,value)
    block=text[s:e]
    for old,new,label in edits:
        c=block.count(old)
        if c!=1:
            raise SystemExit(f'{value} / {label}: expected 1 match, got {c}')
        block=block.replace(old,new,1)
    text=text[:s]+block+text[e:]

edit_object('entryId','shibutz.p147-149.order12-like-abduh',[
    ('"bookPages": [\n        147,\n        148,\n        149\n      ]','"bookPages": [\n        147,\n        148\n      ]','bookPages'),
    ('"scanPdfPages": [\n        149,\n        150,\n        151\n      ]','"scanPdfPages": [\n        149,\n        150\n      ]','scanPdfPages'),
    ('"v57Anchors": [\n        "kashf-v57-draft.html#p147",\n        "kashf-v57-draft.html#p148",\n        "kashf-v57-draft.html#p149"\n      ]','"v57Anchors": [\n        "kashf-v57-draft.html#p148"\n      ]','v57Anchors'),
    ('"printedBookPages": [\n          147,\n          148,\n          149\n        ]','"printedBookPages": [\n          147,\n          148\n        ]','sv printedBookPages'),
    ('"scanPdfPages": [\n          149,\n          150,\n          151\n        ]','"scanPdfPages": [\n          149,\n          150\n        ]','sv scanPdfPages'),
    ('"note": "v57 was compared with the printed Arabic scan; source scope and disagreements are preserved explicitly."','"note": "Printed order 12 begins on p147 and continues on p148. The current v57 artifact places the order-12 heading/content on v57 p148; the legacy entryId is retained for stability, but source pages and v57 anchor are stored separately."','verification note')
])

edit_object('entryId','shibutz.p149.order13-damaged-name',[
    ('"bookPages": [\n        149\n      ]','"bookPages": [\n        148,\n        149\n      ]','bookPages'),
    ('"scanPdfPages": [\n        151\n      ]','"scanPdfPages": [\n        150,\n        151\n      ]','scanPdfPages'),
    ('"sourceDiscrepancies": [\n        "שם הסדר אינו בטוח; המספרים והדרך ניתנים במקור, אך הכינוי ״לבן״ הוא שימור/הערת נוסח ולא כותרת מקור ודאית."\n      ]','"sourceDiscrepancies": [\n        "שם הסדר אינו בטוח; המספרים והדרך ניתנים במקור, אך הכינוי ״לבן״ הוא שימור/הערת נוסח ולא כותרת מקור ודאית.",\n        "גבול העמוד ב-v57 אינו תואם כאן למקור המודפס: סדר 13 מתחיל כבר בעמ׳ ספר 148 וממשיך בעמ׳ 149, בעוד v57 מציב את פתיחת הסדר בעוגן p149."\n      ]','sourceDiscrepancies'),
    ('"printedBookPages": [\n          149\n        ]','"printedBookPages": [\n          148,\n          149\n        ]','sv printedBookPages'),
    ('"scanPdfPages": [\n          151\n        ]','"scanPdfPages": [\n          150,\n          151\n        ]','sv scanPdfPages'),
    ('"note": "v57 was compared with the printed Arabic scan; source scope and disagreements are preserved explicitly."','"note": "Printed order 13 starts on p148 immediately after order 12, with the damaged/blank heading and editor note بياض في الأصل, and continues on p149. The current v57 artifact shifts the order-13 heading/content to v57 p149; legacy entryId retained."','verification note')
])

edit_object('entryId','shibutz.p149-150.order14-aiqa-al-tariq',[
    ('"v57Anchors": [\n        "kashf-v57-draft.html#p149",\n        "kashf-v57-draft.html#p150"\n      ]','"v57Anchors": [\n        "kashf-v57-draft.html#p150"\n      ]','v57Anchors'),
    ('"note": "v57 was compared with the printed Arabic scan; source scope and disagreements are preserved explicitly."','"note": "Printed order 14 starts on p149 after the order-13 table and continues on p150. The current v57 artifact places the order-14 heading/content on v57 p150; source-page coverage remains [149,150] while the v57 anchor is p150."','verification note')
])

edit_object('entryId','gate8.theft.p229.comprehensive-recovery-rule',[
    ('"bookPages": [229], "scanPdfPages": [231], "v57Anchors": ["kashf-v57-draft.html#p229"]','"bookPages": [229, 230], "scanPdfPages": [231, 232], "v57Anchors": ["kashf-v57-draft.html#p229", "kashf-v57-draft.html#p230"]','page arrays'),
    ('"sourceDiscrepancies": ["v57 אינו כולל את כל ענפי החזרה והעיר בניסוח זהה למקור הערבי; יש לשמר את מיפוי הבתים ואת תנאי הענפים מילולית."]','"sourceDiscrepancies": ["v57 אינו כולל את כל ענפי החזרה והעיר בניסוח זהה למקור הערבי; יש לשמר את מיפוי הבתים ואת תנאי הענפים מילולית.", "גבול המקור חוצה את עמ׳ 229→230: המשפט המסיים את p229 ממשיך ב-p230 עם ענף H7 ב-H14. הרשומה הורחבה לשני העמודים; הרשומה הייעודית של p230 נשמרת כחפיפה מכוונת."]','sourceDiscrepancies'),
    ('"sourceVerification": {"printedBookPages": [229], "scanPdfPages": [231], "v57Checked": true, "printedScanChecked": true, "visualLineByLineChecked": true, "note": "House-role and recovery branches re-read against enlarged scan; retained for review because v57 compresses the source branches."}','"sourceVerification": {"printedBookPages": [229, 230], "scanPdfPages": [231, 232], "v57Checked": true, "printedScanChecked": true, "visualLineByLineChecked": true, "note": "The comprehensive theft paragraph starts on printed p229 and crosses the page seam into the opening of p230 (H7 in H14). Both pages were checked as one uninterrupted source unit. The dedicated p230 record remains as an overlapping focused record."}','sourceVerification')
])

edit_object('id','B10-P164-165-PROXIMITY-CONTINUITY',[
    ('"page": "164-165"','"page": 164','queue page'),
    ('"summary": "Rebuild v57 pp164-165 proximity clauses from the printed scan without reordering subjects: Naqi al-Khadd repeated = fear; Qabd Kharij beside it = fitna; Ataba Kharija twice for a patient = هلك; then Tariq, Jamaa, al-Thiqaf/Bayad and the remaining pair rules. Do not retain the invented \'bad woman\' clause."','"summary": "Legacy queue id retained for stability, but scope narrowed to printed p164: restore the omitted Naqi al-Khadd repetition = fear and adjacent Qabd Kharij = fitna/movement-in-blameworthy-fitna clauses in v57. The distinct p165 continuation now has its own queue item."','queue summary')
])

marker='  "v57CorrectionQueue": [\n'
if text.count(marker)!=1:
    raise SystemExit('v57CorrectionQueue marker not unique')
items='''    {"id":"AUDIT-P165-PROXIMITY-EXTENDED-V57","entryId":"gate5.p165.figure-proximity-extended","page":165,"status":"OPEN","summary":"Restore printed p165 as its own proximity-rule unit: Ataba Kharija twice for a patient = هلك, followed by the Tariq, Jamaa, al-Thiqaf/Bayad and remaining pair rules. Do not fold p165 back into the p164 core record."},
    {"id":"AUDIT-P147-148-ORDER12-PAGINATION","entryId":"shibutz.p147-149.order12-like-abduh","page":"147-148","status":"OPEN","summary":"Traceability/page-boundary repair for v57: printed order 12 starts on p147 and continues on p148, while the current v57 artifact places the order-12 heading/content under p148. Preserve source pages independently from v57 anchor pagination."},
    {"id":"AUDIT-P148-149-ORDER13-PAGINATION","entryId":"shibutz.p149.order13-damaged-name","page":"148-149","status":"OPEN","summary":"Printed order 13 begins on p148 immediately after order 12 and continues on p149; current v57 begins the order at p149. Keep the damaged heading/editor note بياض في الأصل unresolved and repair the page traceability."},
    {"id":"AUDIT-P149-150-ORDER14-PAGINATION","entryId":"shibutz.p149-150.order14-aiqa-al-tariq","page":"149-150","status":"OPEN","summary":"Printed order 14 begins on p149 and continues on p150; current v57 places its heading/content at p150. Preserve the printed source range and the distinct v57 anchor."},
    {"id":"AUDIT-P229-230-THEFT-SOURCE-SEAM","entryId":"gate8.theft.p229.comprehensive-recovery-rule","page":"229-230","status":"OPEN","summary":"Treat the comprehensive theft paragraph as a cross-page source unit: printed p229 ends mid-sentence and p230 continues with H7 in H14. Keep the dedicated p230 recovery/discovery record as an intentional overlap."},
'''
text=text.replace(marker,marker+items,1)
P.write_text(text,encoding='utf-8')

# Full structural validation without reformatting the embedded JSON.
t=P.read_text(encoding='utf-8')
mm=re.search(r'<script id="kashf-ai-master-index-data" type="application/json">\s*(\{.*?\})\s*</script>',t,re.S)
if not mm:
    raise SystemExit('embedded JSON missing after edit')
d=json.loads(mm.group(1)); recs=d['records']; ids=[r['entryId'] for r in recs]
assert len(recs)==271 and len(ids)==len(set(ids))
c=Counter(r['verificationStatus'] for r in recs)
assert c['VERIFIED']==181 and c['REVIEW_REQUIRED']==90 and c.get('INDEXED',0)==0 and c.get('UNRESOLVED',0)==0
assert not any(r.get('runtimeEligible') is True for r in recs)
covered={p for r in recs for p in r.get('bookPages',[]) if isinstance(p,int)}
assert not [p for p in range(21,277) if p not in covered]
idmap={r['entryId']:r for r in recs}
qids=[]; orphans=[]; direct_mismatches=[]
for k in ('v57CorrectionQueue','downstreamCorrectionQueue','sourceConflictQueue'):
    for q in d.get(k,[]):
        if not isinstance(q,dict):
            continue
        if q.get('id'):
            qids.append(q['id'])
        eid=q.get('entryId') or q.get('sourceEntryId')
        if eid and eid not in idmap:
            orphans.append((k,q.get('id'),eid)); continue
        if k!='v57CorrectionQueue' or not eid:
            continue
        pg=q.get('page'); qp=[]
        if isinstance(pg,int): qp=[pg]
        elif isinstance(pg,str): qp=[int(x) for x in re.findall(r'\d+',pg)]
        rp=set(idmap[eid].get('bookPages') or [])
        if qp and any(p not in rp for p in qp):
            direct_mismatches.append((q.get('id'),qp,sorted(rp)))
assert len(qids)==len(set(qids)), 'duplicate queue IDs'
assert not orphans, orphans
assert not direct_mismatches, direct_mismatches

report='''# KASHF AI Master Index — Super Audit Pass 1 Consolidated

## Scope

Whole-index structural and traceability audit after Batch 25. Source-first policy remains unchanged: the printed Arabic scan is the highest verification authority; v57 is checked against it; no engine, runtime, registry, routing or Golden-Test behavior is changed in this pass.

## Structural result

- Records: **271**
- Coverage: printed **21–276**, scan **23–278**
- Status counts: **VERIFIED 181 / REVIEW_REQUIRED 90 / INDEXED 0 / UNRESOLVED 0**
- Duplicate `entryId`s: **0**
- Printed-page holes 21–276: **0**
- `runtimeEligible:true`: **0**
- Gate 12 and the body of the book remain closed at printed p276.

## Source-clear defects repaired in this pass

1. **Placement orders 12–14, printed pp147–150:** the printed scan places order 12 across pp147–148, order 13 from p148 into p149, and order 14 from p149 into p150. The current v57 artifact places their visible headings/content at p148/p149/p150. The AI index now keeps printed-source page ranges separate from v57 anchors; stable legacy `entryId`s were preserved.
2. **p164/p165 proximity queue:** the old correction item named pp164–165 while targeting only the p164 record. Printed p165 begins a distinct rule unit. The legacy queue item is now scoped to p164 and a separate p165 correction item was added.
3. **p229→p230 theft seam:** the printed comprehensive theft rule crosses the page boundary. Its record now spans pp229–230; the focused p230 record remains as an intentional overlapping source unit.

## Findings intentionally not auto-repaired

- `coverage.completedBatches` begins with Batch02 although the HTML contains a Batch01 section for pp21–53. This may be a legacy baseline convention, so the audit does not invent a metadata change.
- **68** older records lack an explicit `runtimeEligible` field. None is `true`; this is schema-normalization work, not runtime permission.
- **9** older records lack `sourceVerification`. They require source-aware backfill, not mechanical certification.
- The repository does not currently contain the referenced `kashf-v57-draft.html` or `kashf-v57-topic-index.html` artifacts, although current copies are available outside the repo. This is a repository/deployment traceability gap; the audit does not silently copy or relocate source artifacts.
- The remaining `REVIEW_REQUIRED` records and page-level queue items must be reconciled semantically; no textual or technical uncertainty was closed merely because the structure is valid.

## Next pass

Proceed gate-by-gate through all **90 `REVIEW_REQUIRED`** records and the three queue families, reconciling **status ↔ source discrepancy ↔ correction item ↔ exact printed page ↔ v57 anchor**. Resolve only source-clear traceability/metadata defects; keep unresolved readings open. Only after that pass should downstream engine/registry/Golden-Test repair planning begin.
'''
Path('KASHF_AI_MASTER_INDEX_SUPER_AUDIT_FINAL.md').write_text(report,encoding='utf-8')
print('clean minimal repair validation passed')
print(dict(c))
