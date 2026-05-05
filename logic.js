
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





// ── פרק 13: חיבור הורים-ילדים ───────────────────────
function calcParentChildConnection(parentDay, parentMonth, parentYear, childDay, childMonth, childYear) {
  const parentLP = reduceNum([...(String(parentDay)+String(parentMonth)+String(parentYear))].reduce((a,b)=>+a+ +b,0));
  const childLP  = reduceNum([...(String(childDay)+String(childMonth)+String(childYear))].reduce((a,b)=>+a+ +b,0));

  const parentDay1 = reduceSimple(parentDay);
  const childPinn  = calcPinnacles(childDay, childMonth, childYear, childLP).map(p=>p.num);
  const childChall = calcChallenges(childDay, childMonth, childYear).map(c=>c.num);

  // האם/האב מתחבר לילד?
  const connects = [parentDay1, parentLP].some(n => childPinn.includes(n));

  // פסגה ראשונה של הילד — הצורך הבסיסי
  const firstPinnacle = childPinn[0];
  const firstChallenge = childChall[0];

  // צרכי הילד לפי פסגה ראשונה
  const childNeeds = pinnaclesData[firstPinnacle] || '';

  return {
    parentDay: parentDay1,
    parentLP,
    childLP,
    childPinn,
    childChall,
    connects,
    firstPinnacle,
    firstChallenge,
    childNeeds
  };
}

// ── פרק 12: זוגיות ──────────────────────────────────
function calcCompatibility(p1day, p1month, p1year, p2day, p2month, p2year) {
  // חישוב נתונים בסיסיים
  const lp1 = reduceNum([...( String(p1day)+String(p1month)+String(p1year) )].reduce((a,b)=>+a+ +b,0));
  const lp2 = reduceNum([...( String(p2day)+String(p2month)+String(p2year) )].reduce((a,b)=>+a+ +b,0));
  const day1 = reduceSimple(p1day),   day2 = reduceSimple(p2day);
  const mon1 = reduceSimple(p1month), mon2 = reduceSimple(p2month);
  const yr1  = reduceSimple(digitSum(p1year)), yr2 = reduceSimple(digitSum(p2year));

  const pinn1 = calcPinnacles(p1day,p1month,p1year,lp1).map(p=>p.num);
  const pinn2 = calcPinnacles(p2day,p2month,p2year,lp2).map(p=>p.num);
  const chall1 = calcChallenges(p1day,p1month,p1year).map(c=>c.num);
  const chall2 = calcChallenges(p2day,p2month,p2year).map(c=>c.num);

  // 1. התחברות נומרולוגית: מספרי יום+שביל גורל של הגבר בפסגות האישה
  const p1ConnectsP2 = [day1, lp1].some(n => pinn2.includes(n));
  const p2ConnectsSelf = [day2, lp2].some(n => pinn2.includes(n));
  const p1ConnectsSelf = [day1, lp1].some(n => pinn1.includes(n));

  // 2. יין ויאנג: יום=פנימי, חודש=מתווך, שנה=חיצוני
  const yinYangMatch =
    day1 === yr2  || yr1 === day2  ||  // פנימי א = חיצוני ב
    day1 === day2 || mon1 === mon2 ||  // התאמה ישירה
    lp1  === lp2  || day1 === lp2  || lp1 === day2;

  // 3. סימני אזהרה במשבר זוגי
  const warningPairs = ['2-7','7-2','4-2','6-4','5-6','6-5','5-4','4-5','5-2','1-2'];
  const warnings1 = [], warnings2 = [];
  pinn1.forEach((p,i) => {
    const key = p+'-'+chall1[i];
    if (warningPairs.includes(key)) warnings1.push({pinnacle: p, challenge: chall1[i], key});
  });
  pinn2.forEach((p,i) => {
    const key = p+'-'+chall2[i];
    if (warningPairs.includes(key)) warnings2.push({pinnacle: p, challenge: chall2[i], key});
  });

  // זיווג תיקון
  const tikkun1 = pinn1.some((p,i) => (p===2&&chall1[i]===7)||(p===7&&chall1[i]===2));
  const tikkun2 = pinn2.some((p,i) => (p===2&&chall2[i]===7)||(p===7&&chall2[i]===2));

  // 4. עיתוי נכון לנישואין
  const today = new Date();
  const marriageYear1  = calcPersonalYear(p1day, p1month);
  const marriageYear2  = calcPersonalYear(p2day, p2month);
  const marriageMonth1 = calcPersonalMonth(p1day, p1month, today.getMonth()+1);
  const marriageMonth2 = calcPersonalMonth(p2day, p2month, today.getMonth()+1);

  // ציון התאמה כולל
  let score = 0;
  if (p1ConnectsP2)   score += 40;
  if (yinYangMatch)   score += 30;
  if (p2ConnectsSelf) score += 15;
  if (p1ConnectsSelf) score += 15;

  let level = score >= 70 ? 'חיבור חזק ✦' : score >= 40 ? 'חיבור בינוני' : 'חיבור חלש';

  return {
    lp1, lp2, day1, day2, mon1, mon2, yr1, yr2,
    pinn1, pinn2, chall1, chall2,
    p1ConnectsP2, p2ConnectsSelf, p1ConnectsSelf,
    yinYangMatch, tikkun1, tikkun2,
    warnings1, warnings2,
    marriageYear1, marriageYear2,
    marriageMonth1, marriageMonth2,
    score, level
  };
}

// ── פרק 7: חודש ויום אישי ──────────────────────────
function calcPersonalMonth(day, month, targetMonth) {
  const py = reduceSimple(reduceSimple(day) + reduceSimple(month) + reduceSimple(digitSum(new Date().getFullYear())));
  return reduceSimple(py + reduceSimple(targetMonth));
}
function calcPersonalDay(day, month, targetDay, targetMonth) {
  const pm = calcPersonalMonth(day, month, targetMonth);
  return reduceSimple(pm + reduceSimple(targetDay));
}
function calcPersonalYearFull(day, month, year) {
  const py = reduceSimple(reduceSimple(day) + reduceSimple(month) + digitSum(year));
  return { visible: py, hidden: reduceSimple(py + 1) };
}

// ── פרק 11: פסגות ואתגרים נסתרים ────────────────────
function calcHiddenPinnacles(pinnacles, challenges, lifePath) {
  return pinnacles.map((p, i) => {
    const hidden = reduceSimple(p.num + challenges[i].num);
    const hiddenChallenge = reduceSimple(hidden + reduceSimple(lifePath));
    return { hidden, hiddenChallenge, label: p.label };
  });
}

// ── פרק 3: שאיפה + תכונות פנימיות/חיצוניות ──────────
function calcAspiration(firstName, lastName) {
  const small = {'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,
    'י':1,'כ':2,'ך':2,'ל':3,'מ':4,'ם':4,'נ':5,'ן':5,'ס':6,'ע':7,'פ':8,'ף':8,'צ':9,'ץ':9,
    'ק':1,'ר':2,'ש':3,'ת':4};
  const full = firstName + lastName;
  const total = [...full].reduce((s,c) => s + (small[c]||0), 0);
  return reduceSimple(total);
}
function calcInternalExternal(firstName, lastName) {
  const small = {'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,
    'י':1,'כ':2,'ך':2,'ל':3,'מ':4,'ם':4,'נ':5,'ן':5,'ס':6,'ע':7,'פ':8,'ף':8,'צ':9,'ץ':9,
    'ק':1,'ר':2,'ש':3,'ת':4};
  const vowels = new Set(['א','ה','ו','י']);
  const full = firstName + lastName;
  let inSum = 0, exSum = 0;
  for (const c of full) {
    const v = small[c] || 0;
    if (!v) continue;
    if (vowels.has(c)) inSum += v; else exSum += v;
  }
  return { internal: reduceSimple(inSum), external: reduceSimple(exSum) };
}

// ── פרק 6: ריבוע פיתגורס ────────────────────────────
function calcPythagoras(day, month, year) {
  const small = {'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'0':0};
  const digits = (String(day).padStart(2,'0') + String(month).padStart(2,'0') + String(year))
    .split('').map(Number).filter(n => n > 0);
  const counts = {};
  for (let i=1;i<=9;i++) counts[i] = digits.filter(d=>d===i).length;
  const grid = [[3,6,9],[2,5,8],[1,4,7]];
  const lines = {
    rows: { '123': [1,2,3], '456': [4,5,6], '789': [7,8,9] },
    columns: { '147': [1,4,7], '258': [2,5,8], '369': [3,6,9] },
    diagonals: { '159': [1,5,9], '357': [3,5,7] }
  };
  const present = {}, absent = {};
  for (const [cat, group] of Object.entries(lines)) {
    for (const [key, nums] of Object.entries(group)) {
      const has = nums.every(n => counts[n] > 0);
      (has ? present : absent)[key] = { cat, nums };
    }
  }
  return { counts, grid, present, absent };
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

  // חדש: שאיפה + תכונות
  const nameParts   = name.trim().split(/\s+/);
  const firstName   = nameParts[0] || '';
  const lastName    = nameParts.slice(1).join('') || '';
  const aspiration  = calcAspiration(firstName, lastName);
  const traits      = calcInternalExternal(firstName, lastName);

  // חדש: פסגות נסתרות
  const hiddenPinn  = calcHiddenPinnacles(pinnacles, challenges, lifePath);

  // חדש: ריבוע פיתגורס
  const pytha       = calcPythagoras(day, month, year);

  // חדש: חודש ויום אישי (היום הנוכחי)
  const today       = new Date();
  const personalMon = calcPersonalMonth(day, month, today.getMonth()+1);
  const personalDay = calcPersonalDay(day, month, today.getDate(), today.getMonth()+1);

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


  // שאיפה
  html += block('שאיפה (שם מלא)', aspiration, aspirationData[aspiration], '#f6ad55');

  // תכונות פנימיות / חיצוניות
  html += '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:10px;">תכונות פנימיות וחיצוניות</div>';
  html += subBlock('תכונות פנימיות (תנועות)', traits.internal, aspirationData[traits.internal]);
  html += subBlock('תכונות חיצוניות (עיצורים)', traits.external, aspirationData[traits.external]);
  html += '</div>';

  // חודש ויום אישי
  html += '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:10px;">חודש ויום אישי (היום)</div>';
  html += subBlock('חודש אישי', personalMon, personalYearData[personalMon]);
  html += subBlock('יום אישי', personalDay, personalYearData[personalDay]);
  html += '</div>';

  // פסגות נסתרות
  html += '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:10px;">פסגות ואתגרים נסתרים</div>';
  hiddenPinn.forEach(h => {
    html += subBlock(h.label + ' — נסתרת', h.hidden, pinnaclesData[h.hidden]);
    html += subBlock(h.label + ' — אתגר נסתר', h.hiddenChallenge, challengesData[h.hiddenChallenge]);
  });
  html += '</div>';

  // ריבוע פיתגורס
  html += '<div style="background:#0f3460;border-radius:12px;padding:14px;margin-bottom:14px;"><div style="color:#a0aec0;font-size:.8em;margin-bottom:10px;">ריבוע פיתגורס</div>';
  const gridLabels = {3:'זיכרון',6:'אהבה',9:'סקרנות',2:'סובלנות',5:'חופש',8:'אנרגיה',1:'מזל',4:'כוח',7:'סמכות'};
  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px;">';
  [[3,6,9],[2,5,8],[1,4,7]].forEach(row => {
    row.forEach(n => {
      const cnt = pytha.counts[n];
      const color = cnt > 0 ? '#e0c97f' : '#4a5568';
      html += '<div style="background:#0a1628;border-radius:8px;padding:8px;text-align:center;">'
        + '<div style="color:'+color+';font-size:1.3em;font-weight:900;">'+n+'</div>'
        + '<div style="color:#718096;font-size:.7em;">'+gridLabels[n]+'</div>'
        + (cnt > 1 ? '<div style="color:#68d391;font-size:.7em;">×'+cnt+'</div>' : '')
        + '</div>';
    });
  });
  html += '</div>';
  for (const [key, data] of Object.entries(pytha.present)) {
    const d = pythagorasData[data.cat][key];
    html += subBlock('✦ חץ ' + d.name, key, d.present);
  }
  for (const [key, data] of Object.entries(pytha.absent)) {
    const d = pythagorasData[data.cat][key];
    html += subBlock('✧ חסר — ' + d.name, key, d.absent);
  }
  html += '</div>';

  document.getElementById('output').innerHTML = html;
}
