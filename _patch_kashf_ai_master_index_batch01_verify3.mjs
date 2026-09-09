#!/usr/bin/env node
import fs from 'node:fs';

const path='kashf-v57-ai-master-index.html';
let text=fs.readFileSync(path,'utf8');
const re=/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/;
const m=text.match(re);
if(!m) throw new Error('master index JSON block missing');
const data=JSON.parse(m[1]);

const updates={
  'casting.p25-27.preconditions-times': {
    verificationStatus:'VERIFIED',
    sourceVerification:{printedBookPages:[25,26,27],scanPdfPages:[27,28,29],v57Checked:true,printedScanChecked:true,note:'v57 and the printed scan agree on preparation/place, preferred and disliked times, purity-related conditions, facing the qibla as preferable, present intention, and the prohibition on striking in mockery/testing. Repetition-limit material remains separately indexed in p27.'}
  },
  'arithmetic.p38-39.form-measurement': {
    verificationStatus:'VERIFIED',
    sourceVerification:{printedBookPages:[38,39],scanPdfPages:[40,41],v57Checked:true,printedScanChecked:true,note:'Verified as a multi-step measurement procedure, not a single collapsed formula. The source explicitly treats the paired positions sequentially, derives fire/air/water/earth totals, and works from the twelve-point basis in the example. The index keeps the example and procedure distinct.'}
  },
  'relations.p40.definitions': {
    verificationStatus:'VERIFIED',
    sourceVerification:{printedBookPages:[40],scanPdfPages:[42],v57Checked:true,printedScanChecked:true,note:'Printed source and v57 explicitly distinguish mizaj, imtizaj, ishtirak, ittisal, nazara and shuhud. Mizaj is similarity of nature; imtizaj is from generation; ishtirak is shared participation. Ittisal/nazara/shuhud are deferred by the source to their places and are not expanded here.'}
  }
};

for(const [id,patch] of Object.entries(updates)){
  const record=data.records.find(r=>r.entryId===id);
  if(!record) throw new Error(`missing record ${id}`);
  if(record.verificationStatus!=='INDEXED') throw new Error(`${id}: expected INDEXED before promotion, got ${record.verificationStatus}`);
  Object.assign(record,patch);
}

data.schemaVersion='1.1.2';
data.coverage.status='BATCH01_REVIEW_BLOCKERS_REMAIN';
const json=JSON.stringify(data,null,2);
text=text.replace(re,`<script id="kashf-ai-master-index-data" type="application/json">\n${json}\n</script>`);
fs.writeFileSync(path,text,'utf8');
const counts=Object.fromEntries(['VERIFIED','INDEXED','REVIEW_REQUIRED','UNRESOLVED'].map(s=>[s,data.records.filter(r=>r.verificationStatus===s).length]));
console.log('Batch01 verify3 applied',counts);
