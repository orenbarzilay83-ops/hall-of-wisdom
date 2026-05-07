function calculateGematria(name) {
  const t = {'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':10,'כ':20,'ך':20,'ל':30,'מ':40,'ם':40,'נ':50,'ן':50,'ס':60,'ע':70,'פ':80,'ף':80,'צ':90,'ץ':90,'ק':100,'ר':200,'ש':300,'ת':400};
  return [...name].reduce((s,c) => s + (t[c]||0), 0);
}
function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22) n = [...String(n)].reduce((a,b)=>+a+ +b,0);
  return n;
}
function reduceSimple(n) {
  while (n > 9) n = [...String(n)].reduce((a,b)=>+a+ +b,0);
  return n || 9;
}
function digitSum(n) { return [...String(n)].reduce((a,b)=>+a+ +b,0); }
function getMissingNumbers(name) {
  const t = {'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':10,'כ':20,'ך':20,'ל':30,'מ':40,'ם':40,'נ':50,'ן':50,'ס':60,'ע':70,'פ':80,'ף':80,'צ':90,'ץ':90,'ק':100,'ר':200,'ש':300,'ת':400};
  const present = new Set();
  for (const c of name) { const v=t[c]; if(v) present.add(reduceSimple(v)); }
  const missing = [];
  for (let i=1;i<=9;i++) if(!present.has(i)) missing.push(i);
  return missing;
}
function calcPinnacles(day, month, year, lifePath) {
  const m=reduceNum(month), d=reduceNum(day), y=reduceNum(digitSum(year));
  const p1=reduceNum(m+d), p2=reduceNum(d+y), p3=reduceNum(p1+p2), p4=reduceNum(m+y);
  const e=36-lifePath;
  return [{num:p1,label:'פסגה א - עד גיל '+e},{num:p2,label:'פסגה ב - גיל '+(e)+'-'+(e+9)},{num:p3,label:'פסגה ג - גיל '+(e+9)+'-'+(e+18)},{num:p4,label:'פסגה ד - גיל '+(e+18)+'+'}];
}
function calcChallenges(day, month, year) {
  const m=reduceSimple(month), d=reduceSimple(day), y=reduceSimple(digitSum(year));
  const c1=Math.abs(m-d), c2=Math.abs(d-y), c3=Math.abs(c1-c2), c4=Math.abs(m-y);
  return [{num:c1,label:'אתגר א'},{num:c2,label:'אתגר ב'},{num:c3,label:'אתגר ג - עיקרי'},{num:c4,label:'אתגר ד'}];
}
function calcPersonalYear(day, month) {
  const y = new Date().getFullYear();
  return reduceNum(reduceSimple(day)+reduceSimple(month)+digitSum(y));
}
function calcCycles(day, month, year, lifePath) {
  const c1=reduceSimple(month), c2=reduceSimple(day), c3=reduceSimple(digitSum(year));
  const e=36-lifePath;
  return [{num:c1,label:'מחזור א - עד גיל '+e},{num:c2,label:'מחזור ב - גיל '+e+'-'+(e+27)},{num:c3,label:'מחזור ג - גיל '+(e+27)+'+'}];
}
function calcDragon(day, month, year) {
  const head=reduceSimple(reduceSimple(month)+reduceSimple(digitSum(year)));
  const tail=reduceSimple(reduceSimple(day)+reduceSimple(digitSum(year)));
  return {head, tail};
}
function calcParentChildConnection(parentDay, parentMonth, parentYear, childDay, childMonth, childYear) {
  const parentLP = reduceNum([...(String(parentDay)+String(parentMonth)+String(parentYear))].reduce((a,b)=>+a+ +b,0));
  const childLP  = reduceNum([...(String(childDay)+String(childMonth)+String(childYear))].reduce((a,b)=>+a+ +b,0));
  const parentDay1 = reduceSimple(parentDay);
  const childPinn  = calcPinnacles(childDay, childMonth, childYear, childLP).map(p=>p.num);
  const childChall = calcChallenges(childDay, childMonth, childYear).map(c=>c.num);
  const connects = [parentDay1, parentLP].some(n => childPinn.includes(n));
  const firstPinnacle = childPinn[0];
  const firstChallenge = childChall[0];
  const childNeeds = pinnaclesData[firstPinnacle] || '';
  return { parentDay: parentDay1, parentLP, childLP, childPinn, childChall, connects, firstPinnacle, firstChallenge, childNeeds };
}
function calcCompatibility(p1day, p1month, p1year, p2day, p2month, p2year) {
  const lp1 = reduceNum([...( String(p1day)+String(p1month)+String(p1year) )].reduce((a,b)=>+a+ +b,0));
  const lp2 = reduceNum([...( String(p2day)+String(p2month)+String(p2year) )].reduce((a,b)=>+a+ +b,0));
  const day1=reduceSimple(p1day), day2=reduceSimple(p2day);
  const mon1=reduceSimple(p1month), mon2=reduceSimple(p2month);
  const yr1=reduceSimple(digitSum(p1year)), yr2=reduceSimple(digitSum(p2year));
  const pinn1=calcPinnacles(p1day,p1month,p1year,lp1).map(p=>p.num);
  const pinn2=calcPinnacles(p2day,p2month,p2year,lp2).map(p=>p.num);
  const chall1=calcChallenges(p1day,p1month,p1year).map(c=>c.num);
  const chall2=calcChallenges(p2day,p2month,p2year).map(c=>c.num);
  const p1ConnectsP2=[day1,lp1].some(n=>pinn2.includes(n));
  const p2ConnectsSelf=[day2,lp2].some(n=>pinn2.includes(n));
  const p1ConnectsSelf=[day1,lp1].some(n=>pinn1.includes(n));
  const yinYangMatch=day1===yr2||yr1===day2||day1===day2||mon1===mon2||lp1===lp2||day1===lp2||lp1===day2;
  const warningPairs=['2-7','7-2','4-2','6-4','5-6','6-5','5-4','4-5','5-2','1-2'];
  const warnings1=[],warnings2=[];
  pinn1.forEach((p,i)=>{const key=p+'-'+chall1[i];if(warningPairs.includes(key))warnings1.push({pinnacle:p,challenge:chall1[i],key});});
  pinn2.forEach((p,i)=>{const key=p+'-'+chall2[i];if(warningPairs.includes(key))warnings2.push({pinnacle:p,challenge:chall2[i],key});});
  const tikkun1=pinn1.some((p,i)=>(p===2&&chall1[i]===7)||(p===7&&chall1[i]===2));
  const tikkun2=pinn2.some((p,i)=>(p===2&&chall2[i]===7)||(p===7&&chall2[i]===2));
  const today=new Date();
  const marriageYear1=calcPersonalYear(p1day,p1month);
  const marriageYear2=calcPersonalYear(p2day,p2month);
  const marriageMonth1=calcPersonalMonth(p1day,p1month,today.getMonth()+1);
  const marriageMonth2=calcPersonalMonth(p2day,p2month,today.getMonth()+1);
  let score=0;
  if(p1ConnectsP2) score+=40;
  if(yinYangMatch) score+=30;
  if(p2ConnectsSelf) score+=15;
  if(p1ConnectsSelf) score+=15;
  const level=score>=70?'חיבור חזק ✦':score>=40?'חיבור בינוני':'חיבור חלש';
  return {lp1,lp2,day1,day2,mon1,mon2,yr1,yr2,pinn1,pinn2,chall1,chall2,p1ConnectsP2,p2ConnectsSelf,p1ConnectsSelf,yinYangMatch,tikkun1,tikkun2,warnings1,warnings2,marriageYear1,marriageYear2,marriageMonth1,marriageMonth2,score,level};
}
function calcPersonalMonth(day, month, targetMonth) {
  const py=reduceSimple(reduceSimple(day)+reduceSimple(month)+reduceSimple(digitSum(new Date().getFullYear())));
  return reduceSimple(py+reduceSimple(targetMonth));
}
function calcPersonalDay(day, month, targetDay, targetMonth) {
  const pm=calcPersonalMonth(day,month,targetMonth);
  return reduceSimple(pm+reduceSimple(targetDay));
}
function calcPersonalYearFull(day, month, year) {
  const py=reduceSimple(reduceSimple(day)+reduceSimple(month)+digitSum(year));
  return {visible:py,hidden:reduceSimple(py+1)};
}
function calcHiddenPinnacles(pinnacles, challenges, lifePath) {
  return pinnacles.map((p,i)=>{
    const hidden=reduceSimple(p.num+challenges[i].num);
    const hiddenChallenge=reduceSimple(hidden+reduceSimple(lifePath));
    return {hidden,hiddenChallenge,label:p.label};
  });
}
function calcAspiration(firstName, lastName) {
  const small={'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':1,'כ':2,'ך':2,'ל':3,'מ':4,'ם':4,'נ':5,'ן':5,'ס':6,'ע':7,'פ':8,'ף':8,'צ':9,'ץ':9,'ק':1,'ר':2,'ש':3,'ת':4};
  const full=firstName+lastName;
  return reduceSimple([...full].reduce((s,c)=>s+(small[c]||0),0));
}
function calcInternalExternal(firstName, lastName) {
  const small={'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':1,'כ':2,'ך':2,'ל':3,'מ':4,'ם':4,'נ':5,'ן':5,'ס':6,'ע':7,'פ':8,'ף':8,'צ':9,'ץ':9,'ק':1,'ר':2,'ש':3,'ת':4};
  const vowels=new Set(['א','ה','ו','י']);
  const full=firstName+lastName;
  let inSum=0,exSum=0;
  for(const c of full){const v=small[c]||0;if(!v)continue;if(vowels.has(c))inSum+=v;else exSum+=v;}
  return {internal:reduceSimple(inSum),external:reduceSimple(exSum)};
}
function calcPythagoras(day, month, year) {
  const digits=(String(day).padStart(2,'0')+String(month).padStart(2,'0')+String(year)).split('').map(Number).filter(n=>n>0);
  const counts={};
  for(let i=1;i<=9;i++) counts[i]=digits.filter(d=>d===i).length;
  const lines={rows:{'123':[1,2,3],'456':[4,5,6],'789':[7,8,9]},columns:{'147':[1,4,7],'258':[2,5,8],'369':[3,6,9]},diagonals:{'159':[1,5,9],'357':[3,5,7]}};
  const present={},absent={};
  for(const [cat,group] of Object.entries(lines)){for(const [key,nums] of Object.entries(group)){const has=nums.every(n=>counts[n]>0);(has?present:absent)[key]={cat,nums};}}
  return {counts,present,absent};
}
function toggleAcc(tile) {
  const grid=tile.closest('.acc-grid');
  if(!grid) return;
  const allTiles=[...grid.children].filter(el=>el.classList.contains('acc-item'));
  const idx=allTiles.indexOf(tile);
  const isOpen=tile.classList.contains('open');
  [...grid.children].filter(el=>el.classList.contains('acc-detail-row')).forEach(p=>p.remove());
  allTiles.forEach(t=>t.classList.remove('open'));
  if(!isOpen){
    tile.classList.add('open');
    const body=tile.querySelector('.acc-body').innerHTML;
    const panel=document.createElement('div');
    panel.className='acc-detail-row';
    panel.innerHTML=body;
    const rowEndIdx=(idx%2===0)?Math.min(idx+1,allTiles.length-1):idx;
    const afterTile=allTiles[rowEndIdx];
    if(afterTile.nextSibling){grid.insertBefore(panel,afterTile.nextSibling);}else{grid.appendChild(panel);}
  }
}
function acc(title, subtitle, num, body, color) {
  const c=color||'#e0c97f';
  return `<div class="acc-item" onclick="toggleAcc(this)">
    <div class="acc-num" style="color:${c}">${num}</div>
    <div class="acc-info"><div class="acc-title">${title}</div>${subtitle?`<div class="acc-subtitle">${subtitle}</div>`:''}</div>
    <div class="acc-hint">▼ פתח</div>
    <div class="acc-body">${body}</div>
  </div>`;
}
function accGroup(title, items) {
  return `<div class="acc-item" onclick="toggleAcc(this)">
    <div class="acc-num" style="color:#e0c97f;font-size:1.4rem">✦</div>
    <div class="acc-info"><div class="acc-title">${title}</div></div>
    <div class="acc-hint">▼ פתח</div>
    <div class="acc-body">${items}</div>
  </div>`;
}
function sub(label, num, text, color) {
  const c=color||'#e0c97f';
  return `<div class="sub-item" style="border-right-color:${c}66">
    <div class="sub-label">${label} <span class="sub-num" style="color:${c}">${num}</span></div>
    ${text?`<div class="sub-text">${text}</div>`:''}
  </div>`;
}
function getDate(dayId, monthId, yearId) {
  const day=parseInt(document.getElementById(dayId).value);
  const month=parseInt(document.getElementById(monthId).value);
  const year=parseInt(document.getElementById(yearId).value);
  return {day,month,year,valid:!isNaN(day)&&!isNaN(month)&&!isNaN(year)&&year>1900};
}
function normalizeFinal(ch) {
  return {'ן':'נ','ם':'מ','ך':'כ','ף':'פ','ץ':'צ'}[ch]||ch;
}
function runAnalysis() {
  const name=document.getElementById('userName').value.trim();
  const lastName=(document.getElementById('userLastName')||{value:''}).value.trim();
  const dt=getDate('birthDay','birthMonth','birthYear');
  if(!name||!dt.valid) return alert('נא למלא שם ותאריך לידה מלא');
  const {day,month,year}=dt;
  const nameNum=reduceNum(calculateGematria(name));
  const lifePath=reduceNum([...(String(day)+String(month)+String(year))].reduce((a,b)=>+a+ +b,0));
  const personalYr=calcPersonalYear(day,month);
  const pinnacles=calcPinnacles(day,month,year,lifePath);
  const challenges=calcChallenges(day,month,year);
  const hiddenPinn=calcHiddenPinnacles(pinnacles,challenges,lifePath);
  const cycles=calcCycles(day,month,year,lifePath);
  const dragon=calcDragon(day,month,year);
  const missing=getMissingNumbers(name+lastName);
  const aspNum=calcAspiration(name,lastName);
  const traits=calcInternalExternal(name,lastName);
  const pytha=calcPythagoras(day,month,year);
  const today=new Date();
  const personalMon=calcPersonalMonth(day,month,today.getMonth()+1);
  const personalDay=calcPersonalDay(day,month,today.getDate(),today.getMonth()+1);
  let html=`<h3>✦ ניתוח נומרולוגי — ${name}${lastName?' '+lastName:''} ✦</h3>`;
  let items='';
  items+=acc('יום הלידה','יום '+day+' בחודש',day,daysData[day]||'');
  items+=acc('שביל גורל','נתיב החיים',lifePath,lifePathData[lifePath]||'','#68d391');
  items+=acc('מספר השם','על פי הגימטריה',nameNum,nameData[nameNum]||'','#4a9eff');
  if(lastName){
    items+=acc('שאיפה','שם מלא: '+name+' '+lastName,aspNum,aspirationData[aspNum]||'','#f6ad55');
    const trBody=sub('אותיות תנועה — תכונות פנימיות',traits.internal,aspirationData[traits.internal]||'','#68d391')+sub('עיצורים — תכונות חיצוניות',traits.external,aspirationData[traits.external]||'','#4a9eff');
    items+=accGroup('תכונות פנימיות וחיצוניות',trBody);
  }
  let pinnBody='';
  pinnacles.forEach(p=>{pinnBody+=sub(p.label,p.num,pinnaclesData[p.num]||'');});
  items+=accGroup('פסגות חיים',pinnBody);
  let hidPinnBody='';
  hiddenPinn.forEach(h=>{hidPinnBody+=sub(h.label+' — נסתרת',h.hidden,pinnaclesData[h.hidden]||'','#9b8ec4');});
  items+=accGroup('פסגות נסתרות',hidPinnBody);
  let challBody='';
  challenges.forEach(c=>{challBody+=sub(c.label,c.num,challengesData[c.num]||'');});
  items+=accGroup('אתגרי חיים',challBody);
  let hidChallBody='';
  hiddenPinn.forEach(h=>{hidChallBody+=sub(h.label+' — אתגר נסתר',h.hiddenChallenge,challengesData[h.hiddenChallenge]||'','#e06c6c');});
  items+=accGroup('אתגרים נסתרים',hidChallBody);
  let cycBody='';
  cycles.forEach(c=>{cycBody+=sub(c.label,c.num,cyclesData[c.num]||'');});
  items+=accGroup('מחזורי חיים',cycBody);
  const timeBody=sub('שנה אישית '+new Date().getFullYear(),personalYr,personalYearData[personalYr]||'')+sub('חודש אישי',personalMon,personalYearData[personalMon]||'')+sub('יום אישי',personalDay,personalYearData[personalDay]||'');
  items+=accGroup('שנה · חודש · יום אישי',timeBody);
  const dragBody=sub('ראש הדרקון — ייעוד',dragon.head,dragonHeadData[dragon.head]||'','#68d391')+sub('זנב הדרקון — תיקון',dragon.tail,dragonTailData[dragon.tail]||'','#e06c6c');
  items+=accGroup('ראש וזנב הדרקון',dragBody);
  let missBody=missing.length===0?'<div style="color:#68d391;padding:8px">✓ אין מספרים חסרים — שם מאוזן</div>':missing.map(m=>sub('מספר '+m+' חסר',m,missingNumbersData[m]||'','#e06c6c')).join('');
  items+=accGroup('מספרים חסרים בשם',missBody);
  const gLbl={3:'זיכרון',6:'אהבה',9:'סקרנות',2:'סובלנות',5:'חופש',8:'אנרגיה',1:'מזל',4:'כוח',7:'סמכות'};
  let pythaBody='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:240px;margin:0 auto 16px;">';
  [[3,6,9],[2,5,8],[1,4,7]].forEach(row=>row.forEach(n=>{const cnt=pytha.counts[n],active=cnt>0;pythaBody+=`<div class="pytha-cell ${active?'active':''}"><div class="pn">${n}</div><div class="pl">${gLbl[n]}</div>${cnt>1?`<div class="pc">×${cnt}</div>`:''}</div>`;}));
  pythaBody+='</div>';
  for(const [key,data] of Object.entries(pytha.present)){const d=pythagorasData[data.cat][key];pythaBody+=sub('✦ חץ — '+d.name,key,d.present,'#e0c97f');}
  for(const [key,data] of Object.entries(pytha.absent)){const d=pythagorasData[data.cat][key];pythaBody+=`<div style="opacity:.55">${sub('✧ חסר — '+d.name,key,d.absent,'#4a5568')}</div>`;}
  items+=accGroup('ריבוע פיתגורס',pythaBody);
  const fullName=name+(lastName?' '+lastName:'');
  const seen=new Set();
  let letBody='';
  for(const ch of fullName){const norm=normalizeFinal(ch);if(lettersData&&lettersData[norm]&&!seen.has(norm)){seen.add(norm);letBody+=`<div style="margin-bottom:10px;padding:12px;background:#071428;border-radius:10px;border-right:3px solid #e0c97f44"><div style="color:#e0c97f;font-size:1.5rem;font-weight:900;margin-bottom:4px">${ch}</div><div style="color:#a0aec0;font-size:.92rem;line-height:1.8">${lettersData[norm]}</div></div>`;}}
  if(letBody) items+=accGroup('משמעות האותיות — נומרולוגיה קבלית',letBody);
  html+=`<div class="acc-grid">${items}</div>`;
  document.getElementById('output').innerHTML=html;
}
function runCompatibility() {
  const n1=document.getElementById('c1fname').value.trim();
  const dt1=getDate('c1day','c1month','c1year');
  const n2=document.getElementById('c2fname').value.trim();
  const dt2=getDate('c2day','c2month','c2year');
  if(!dt1.valid||!dt2.valid) return alert('נא למלא תאריכי לידה מלאים');
  const res=calcCompatibility(dt1.day,dt1.month,dt1.year,dt2.day,dt2.month,dt2.year);
  const nm1=n1||'בן/בת זוג א', nm2=n2||'בן/בת זוג ב';
  let html=`<h3>✦ התאמה — ${nm1} ו${nm2} ✦</h3>`;
  let items='';
  const scoreColor=res.score>=70?'#68d391':res.score>=40?'#f6ad55':'#e06c6c';
  const scoreBody=`<div style="font-size:2.5rem;font-weight:900;color:${scoreColor};text-align:center;margin-bottom:12px">${res.score}%</div><div style="background:#071428;border-radius:8px;height:10px;overflow:hidden;margin-bottom:16px"><div style="width:${res.score}%;height:100%;background:linear-gradient(to left,${scoreColor},#4a9eff);transition:width 1s"></div></div>${sub('התחברות נומרולוגית — '+nm1+' לפסגות '+nm2,res.p1ConnectsP2?'✓':'✗','',res.p1ConnectsP2?'#68d391':'#e06c6c')}${sub('יין ויאנג',res.yinYangMatch?'✓':'✗','',res.yinYangMatch?'#68d391':'#e06c6c')}${sub(nm1+' מחובר/ת לעצמו/ה',res.p1ConnectsSelf?'✓':'✗','',res.p1ConnectsSelf?'#68d391':'#718096')}${sub(nm2+' מחובר/ת לעצמו/ה',res.p2ConnectsSelf?'✓':'✗','',res.p2ConnectsSelf?'#68d391':'#718096')}`;
  items+=acc('ציון התאמה',res.level,res.score+'%',scoreBody,scoreColor);
  const b1=sub('יום לידה — פנימי',res.day1,'','#e0c97f')+sub('חודש לידה — מתווך',res.mon1,'','#4a9eff')+sub('שנה — חיצוני',res.yr1,'','#718096')+sub('שביל גורל',res.lp1,lifePathData[res.lp1]||'','#68d391');
  items+=accGroup('המספרים של '+nm1,b1);
  const b2=sub('יום לידה — פנימי',res.day2,'','#e0c97f')+sub('חודש לידה — מתווך',res.mon2,'','#4a9eff')+sub('שנה — חיצוני',res.yr2,'','#718096')+sub('שביל גורל',res.lp2,lifePathData[res.lp2]||'','#68d391');
  items+=accGroup('המספרים של '+nm2,b2);
  if(res.tikkun1||res.tikkun2){let tikBody='';if(res.tikkun1)tikBody+=`<div style="color:#e06c6c;margin-bottom:8px">⚠ ל${nm1} פסגת זיווג תיקון (2-7). מומלץ: עיסוק טיפולי או הבאת 2 ילדים.</div>`;if(res.tikkun2)tikBody+=`<div style="color:#e06c6c">⚠ ל${nm2} פסגת זיווג תיקון (2-7). מומלץ: עיסוק טיפולי או הבאת 2 ילדים.</div>`;items+=accGroup('⚠ זיווג תיקון',tikBody);}
  const warnMap={'2-7':'זיווג תיקון','7-2':'זיווג תיקון','4-2':'תיקון זוגי','6-4':'יציבות משפחתית','5-6':'שינוי זוגי','6-5':'שינוי זוגי','5-4':'שינוי מסגרת','4-5':'שינוי מסגרת','5-2':'סיכון לגירושין','1-2':'התחלת קשר חדש'};
  const allW=[...res.warnings1.map(w=>({...w,who:nm1})),...res.warnings2.map(w=>({...w,who:nm2}))];
  if(allW.length){let wBody=allW.map(w=>sub(`${w.who} — פסגה ${w.key}`,w.pinnacle,warnMap[w.key]||'','#e06c6c')).join('');items+=accGroup('נקודות לתשומת לב',wBody);}
  const tyBody=sub('שנה אישית של '+nm1,res.marriageYear1,res.marriageYear1===6?'✦ שנה 6 — עיתוי מצוין לנישואין!':personalYearData[res.marriageYear1]||'',res.marriageYear1===6?'#68d391':'#718096')+sub('שנה אישית של '+nm2,res.marriageYear2,res.marriageYear2===6?'✦ שנה 6 — עיתוי מצוין לנישואין!':personalYearData[res.marriageYear2]||'',res.marriageYear2===6?'#68d391':'#718096');
  items+=accGroup('עיתוי מומלץ לנישואין',tyBody);
  html+=`<div class="acc-grid">${items}</div>`;
  document.getElementById('outputComp').innerHTML=html;
}
function runParentChild() {
  const pn=document.getElementById('p1name').value.trim()||'הורה';
  const dt1=getDate('p1day','p1month','p1year');
  const cn=document.getElementById('p2name').value.trim()||'ילד';
  const dt2=getDate('p2day','p2month','p2year');
  if(!dt1.valid||!dt2.valid) return alert('נא למלא תאריכי לידה מלאים');
  const res=calcParentChildConnection(dt1.day,dt1.month,dt1.year,dt2.day,dt2.month,dt2.year);
  const color=res.connects?'#68d391':'#e06c6c';
  let html=`<h3>✦ חיבור — ${pn} ← ${cn} ✦</h3>`;
  let items='';
  const connBody=`<div style="color:${color};font-size:1rem;line-height:1.8">${res.connects?`✦ ${pn} מחובר/ת לפסגות ${cn} ויכול/ה להגשים את צרכיו`:`✧ ${pn} אינו/ה מחובר/ת ישירות לפסגות ${cn}. הפסגה הראשונה היא הקובעת.`}</div>`;
  items+=acc('סטטוס חיבור',pn+' ← '+cn,res.connects?'✓':'✗',connBody,color);
  items+=accGroup('מספרי '+pn,sub('יום לידה',res.parentDay,'','#e0c97f')+sub('שביל גורל',res.parentLP,lifePathData[res.parentLP]||'','#68d391'));
  let cpBody='';
  res.childPinn.forEach((p,i)=>{const isConn=[res.parentDay,res.parentLP].includes(p);cpBody+=sub(`פסגה ${i+1}${isConn?' — ✦ ההורה מחובר':''}`,p,pinnaclesData[p]||'',isConn?'#68d391':'#e0c97f');});
  items+=accGroup('פסגות '+cn,cpBody);
  items+=acc('הצורך הבסיסי של '+cn,'פסגה ראשונה',res.firstPinnacle,pinnaclesData[res.firstPinnacle]||'','#4a9eff');
  html+=`<div class="acc-grid">${items}</div>`;
  document.getElementById('outputParent').innerHTML=html;
}
