
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

function block(title, num, text, color) {
  return '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:4px;">'+title+'</div><div style="color:'+(color||'#e0c97f')+';font-size:1.8em;font-weight:900;margin-bottom:8px;">'+num+'</div><div style="color:#cbd5e0;font-size:.88em;line-height:1.7;max-height:130px;overflow-y:auto;">'+(text||'')+'</div></div>';
}

function subBlock(label, num, text) {
  return '<div style="background:#0a1628;border-radius:10px;padding:12px;margin-bottom:8px;border-right:3px solid #e0c97f55;"><div style="color:#718096;font-size:.75em;">'+label+' <span style="color:#68d391;font-weight:900;">'+num+'</span></div><div style="color:#a0aec0;font-size:.83em;margin-top:4px;line-height:1.6;">'+(text||'')+'</div></div>';
}

function runAnalysis() {
  const name = document.getElementById('userName').value.trim();
  const date = document.getElementById('birthDate').value;
  if (!name || !date) return alert('מלא שם ותאריך לידה');
  localStorage.setItem('savedName', name);
  const [yearS,monthS,dayS] = date.split('-');
  const day=parseInt(dayS), month=parseInt(monthS), year=parseInt(yearS);

  const nameNum   = reduceNum(calculateGematria(name));
  const lifePath  = reduceNum([...date.replace(/-/g,'')].reduce((a,b)=>+a+ +b,0));
  const personalYr = calcPersonalYear(day, month);
  const pinnacles  = calcPinnacles(day, month, year, lifePath);
  const challenges = calcChallenges(day, month, year);
  const cycles     = calcCycles(day, month, year, lifePath);
  const dragon     = calcDragon(day, month, year);
  const missing    = getMissingNumbers(name);

  let html = '<div style="animation:fadeIn .4s"><h3 style="color:#e0c97f;text-align:center;margin-bottom:16px;">✦ ניתוח נומרולוגי — '+name+' ✦</h3>';

  html += block('מספר השם', nameNum, nameData[nameNum]);
  html += block('נתיב החיים', lifePath, lifePathData[lifePath], '#68d391');
  html += block('שנה אישית '+new Date().getFullYear(), personalYr, personalYearData[personalYr], '#4a9eff');

  html += '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:10px;">פסגות חיים</div>';
  pinnacles.forEach(p => { html += subBlock(p.label, p.num, pinnaclesData[p.num]); });
  html += '</div>';

  html += '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:10px;">אתגרי חיים</div>';
  challenges.forEach(c => { html += subBlock(c.label, c.num, challengesData[c.num]); });
  html += '</div>';

  html += '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:10px;">מחזורי חיים</div>';
  cycles.forEach(c => { html += subBlock(c.label, c.num, cyclesData[c.num]); });
  html += '</div>';

  html += '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:10px;">ראש וזנב הדרקון</div>';
  html += subBlock('ראש הדרקון', dragon.head, dragonHeadData[dragon.head]);
  html += subBlock('זנב הדרקון', dragon.tail, dragonTailData[dragon.tail]);
  html += '</div>';

  html += '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:10px;">מספרים חסרים מהשם</div>';
  if (missing.length===0) {
    html += '<div style="color:#68d391;font-size:.9em;">אין מספרים חסרים — שם מאוזן ✓</div>';
  } else {
    missing.forEach(m => { html += subBlock('מספר '+m+' חסר', m, missingNumbersData[m]); });
  }
  html += '</div></div>';

  document.getElementById('output').innerHTML = html;
}
