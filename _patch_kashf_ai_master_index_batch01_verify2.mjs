#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);

const updates={
  'casting.p30.pair-reduction': {
    verificationStatus:'VERIFIED',
    sourceVerification:{printedBookPages:[30],scanPdfPages:[32],v57Checked:true,printedScanChecked:true,note:'v57 and printed scan both state cancellation in pairs until one or two points remain, then preservation of the remainder at the row ends.'}
  },
  'casting.p34-35.validity': {
    verificationStatus:'VERIFIED',
    sourceVerification:{printedBookPages:[34,35],scanPdfPages:[36,37],v57Checked:true,printedScanChecked:true,note:'Verified only at the conservative scope recorded here: H15 must not be odd; mother/daughter parallel-row correspondences are explicit. No extra parity rule is added beyond the indexed wording.'}
  },
  'casting.p35.absent-four-figures': {
    verificationStatus:'VERIFIED',
    sourceVerification:{printedBookPages:[35],scanPdfPages:[37],v57Checked:true,printedScanChecked:true,note:'Printed source names الطريق، العقلة، الاجتماع، الجماعة. Project Hebrew naming preserves العقلة as סוהר (1221). The rule is not expanded beyond the source condition.'}
  },
  'theory.p36.timing-rationale': {
    verificationStatus:'VERIFIED',
    sourceVerification:{printedBookPages:[36],scanPdfPages:[38],v57Checked:true,printedScanChecked:true,note:'The explanatory discussion of clear sky/clouds, sunlight, night vision and winds is preserved as educational rationale only; it does not create new runtime conditions.'}
  },
  'arithmetic.p37.core-96-128': {
    verificationStatus:'VERIFIED',
    sourceVerification:{printedBookPages:[37],scanPdfPages:[39],v57Checked:true,printedScanChecked:true,note:'Printed source and v57 agree on root 4, 4×4=16, 16×6=96, Path with itself yielding Jamaa, and the separate 128 count. The index keeps 96 and 128 distinct.'}
  }
};

for(const [id,patch] of Object.entries(updates)){
  const record=data.records.find(r=>r.entryId===id);
  if(!record) throw new Error(`missing record ${id}`);
  if(record.verificationStatus!=='INDEXED') throw new Error(`${id}: expected INDEXED before promotion, got ${record.verificationStatus}`);
  Object.assign(record,patch);
}

data.schemaVersion='1.1.1';
data.coverage.status='BATCH01_SOURCE_VERIFICATION_IN_PROGRESS';
const json=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
fs.writeFileSync(path,text,'utf8');

const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch01 verification promotions applied',counts);
