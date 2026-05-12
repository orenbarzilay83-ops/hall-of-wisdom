// גורל העשיריות — מנוע חישוב ותצוגה מתוקן לפי כללי הספר

const GORAL_PRAYER = 'קודם הגורל יאמר תפלה זו: יהי רצון מלפניך יֶהֹוֹהִ אלהי ואלהי אבותי, אלהי אברהם אלהי יצחק ואלהי יעקב, שתקשיב לתפלתי, ותתני לחן ולחסד ולרחמים בעינך לעשות בקשתי בזה הגורל, כמו שאמרת "אך בגורל יחלק את הארץ" (במדבר כו, נה), לך יהוה הרחמים והסליחות, ולנו בושת הפנים על כל מה שהכעסתיך במעשי הרעים, כי אתה יצרתני עפר מן האדמה ונפחת בי נשמה, והוצאתני לאוויר העולם, ועתה באתי לפניך בלב נשבר ובלב נדכה, שתודיעני מה שישאל ממני בזה הגורל, שחנוניך הם חנונים, ורחומיך הם רחומים, שתשמיעני ותוציא הדבר לאמיתו, והבה לי תמים ושלח לי במחשבתי דברי שאלתי באופן שהגורל הזה יענה תשובה אמיתית כי אין לנו אורים ותומים בעוונותינו, ולכן קראתי לעליונים ולתחתונים שיעתירו בעדי ויפילו תחנונים לאדוני האדונים, יהוה אלהים יעזור לי. ותאמר ג\' פעמים פסוק "אברך את ה\' אשר יעצני אף לילות יסרוני כליותי" (תהלים טז, ז) וכן ג\' פעמים "גורלך תפיל בתוכנו" (משלי א, יד), אמן סלה ועד.';

const G_AB = {
  1:"א",2:"ב",3:"ג",4:"ד",5:"ה",6:"ו",7:"ז",8:"ח",9:"ט",
  10:"י",11:"כ",12:"ל",13:"מ",14:"נ",15:"ס",16:"ע",17:"פ",18:"צ",
  19:"ק",20:"ר",21:"ש",22:"ת"
};

const G_TABLES = {
  א:{seq:[13,12,17,"גורלי",13,12,"תומך",12,1,5,"יהי",1,12,2,"הגורל",10,"שמה","לו","אשר","יצא","אל"]},
  ב:{seq:[2,12,"אדני","יצא",16,"הגורל","לו",13,"תומך","גורלי",13,1,7]},
  ג:{seq:[12,14,"גורלי",12,11,22,11,5,22,12,"אדני",22,12,20,"תומך",12,"אתה",5,"וכוסי",22,11,5,22,11,"גורלי",14,12]},
  ד:{seq:[6,1,1,"גורלי",1,7,1,12,5,"אדני",18,22,2,18,22,"מנת",12,14,12,18,12,5,12,1,1]}
};

function _el(id){ return document.getElementById(id); }

function goralCleanText(txt){
  return String(txt || '')
    .replace(/[״׳"'.:,;!?()\[\]{}־–—]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function goralLetterCount(word){
  const letters = String(word || '').match(/[\u05D0-\u05EA]/g);
  return letters ? letters.length : 0;
}

function goralBuildRow1(name,father,q){
  const fullText = goralCleanText((name || '') + ' בן ' + (father || '') + ' ' + (q || ''));
  const words = fullText.split(/\s+/).filter(Boolean);
  const lengths = words.map(goralLetterCount).filter(n => n > 0);

  // לפי הספר: אם יש בדיוק 10 תיבות — פותחים בי׳/10.
  if (lengths.length === 10) return [10, ...lengths];

  // אחרת השורה מתחילה ישירות במספרי האותיות.
  return lengths;
}

function goralReduceNine(sum){
  if (sum === 18) return 18;
  if (sum <= 9) return sum;
  return sum - 9;
}

function goralBuildTriangle(row){
  const tri = [row.slice()];
  let cur = row.slice();

  while(cur.length > 1){
    const next = [];
    for(let i=0; i<cur.length-1; i++){
      next.push(goralReduceNine(cur[i] + cur[i+1]));
    }
    tri.push(next);
    cur = next;
  }

  return tri;
}

function goralGetRightDiagonal(tri){
  return tri.map(row => row[row.length - 1]);
}

function goralGetKeys(tri){
  const apex = tri[tri.length - 1][0];
  const isEven = apex % 2 === 0;
  const diagonal = goralGetRightDiagonal(tri);
  let source;

  if(isEven){
    // זוגי: מלמעלה למטה — 4 הזוגיים הראשונים
    source = diagonal.filter(n => n % 2 === 0);
  } else {
    // אי־זוגי: מלמטה למעלה — 4 האי־זוגיים הראשונים
    source = diagonal.slice().reverse().filter(n => n % 2 !== 0);
  }

  const row1 = tri[0];
  const backup = row1.filter(n => isEven ? n % 2 === 0 : n % 2 !== 0);

  return [...source, ...backup].slice(0,4);
}

function goralSignToLetter(sign){
  if(typeof sign === 'number') return G_AB[sign] || '';
  if(typeof sign !== 'string') return '';

  // מילים קדושות/עזר אינן אות תשובה רגילה, לכן לא מכניסים אותן למשפט.
  if(["הגורל","גורלי","אדני","תומך","מנת","וכוסי","אתה","יהי","שמה","לו","אשר","יצא","אל"].includes(sign)){
    return '';
  }

  return sign;
}


function goralFirstJump(key){
  const k = Number(key || 0);

  // שיטת ההשלמה לעשר לפי הספר
  if (k >= 1 && k <= 9) return 10 - k;

  const mod = k % 10;
  return mod === 0 ? 10 : 10 - mod;
}

function goralNavigate(boardName, jump){
  const seq = G_TABLES[boardName].seq;

  // נקודת העוגן בלוח
  const start = seq.findIndex(x => x === "הגורל" || x === "גורלי");
  const signs = [];

  if(start < 0) return signs;

  // דילוג ראשון לפי שיטת ההשלמה לעשר
  let index = start + goralFirstJump(jump);

  // משם כל עשירי
  while(index < seq.length){
    signs.push(seq[index]);
    index += 10;
  }

  return signs;
}

function goralRunCalc(name,father,q){
  const row1 = goralBuildRow1(name,father,q);

  if(row1.length < 2){
    return {
      row1,
      triangle:[row1],
      apex: row1[0] || 0,
      parity:'odd',
      diags:[],
      tRes:{א:{signs:[],letters:''},ב:{signs:[],letters:''},ג:{signs:[],letters:''},ד:{signs:[],letters:''}},
      answer:'אין מספיק אותיות לבניית גורל.'
    };
  }

  const triangle = goralBuildTriangle(row1);
  const apex = triangle[triangle.length - 1][0];
  const parity = apex % 2 === 0 ? 'even' : 'odd';
  const diags = goralGetKeys(triangle);
  const boards = ['א','ב','ג','ד'];
  const tRes = {};

  boards.forEach((board, i) => {
    const key = diags[i] || row1[i] || 1;
    const signs = goralNavigate(board, key);
    const letters = signs.map(goralSignToLetter).join('');
    tRes[board] = { key, signs, letters };
  });

  const answer = boards.map(b => tRes[b].letters).filter(Boolean).join(' ').trim() || 'לא נתקבלה תשובה ברורה מן הלוחות.';

  return {row1, triangle, apex, parity, diags, tRes, answer};
}

let _goralResult = null, _prayerOpen = false;

function goralShowStage(s){
  ['intro','form','calc','result'].forEach(x=>{
    const e=_el('goral-stage-'+x);
    if(e) e.style.display = x===s ? '' : 'none';
  });
  window.scrollTo(0,0);
}

function goralTogglePrayer(){
  _prayerOpen = !_prayerOpen;
  const e=_el('goralPrayerText'), b=_el('goralPrayerBtn');
  if(e) e.style.display = _prayerOpen ? '' : 'none';
  if(b) b.innerHTML = (_prayerOpen ? '▼' : '◀') + ' תפילה לפני הפלת הגורל';
}

function goralReset(){
  if(_el('goralName')) _el('goralName').value='';
  if(_el('goralFather')) _el('goralFather').value='';
  if(_el('goralQuestion')) _el('goralQuestion').value='';
  if(_el('goralFormError')) _el('goralFormError').style.display='none';
  _goralResult = null;
  goralShowStage('intro');
}

async function goralSubmit(){
  const name=_el('goralName').value.trim();
  const father=_el('goralFather').value.trim();
  const question=_el('goralQuestion').value.trim();
  const err=_el('goralFormError');

  if(!name || !father || !question){
    if(err) err.style.display='block';
    return;
  }

  if(err) err.style.display='none';

  const result = goralRunCalc(name,father,question);
  _goralResult = result;
  goralShowStage('calc');

  const display=_el('goralTriDisplay'), progress=_el('goralProgress');
  if(display) display.innerHTML='';

  const MAX=13;

  for(let i=0; i<=result.triangle.length; i++){
    await new Promise(r=>setTimeout(r, i===0 ? 450 : 95));
    if(progress) progress.style.width = Math.round(i/result.triangle.length*100)+'%';

    const rows = result.triangle.slice(0,i);
    const from = Math.max(0, rows.length-MAX);
    const vis = rows.slice(from);

    if(display){
      display.innerHTML = vis.map((row,ri)=>{
        const gi=from+ri;
        const isApex=gi===result.triangle.length-1;
        const isNew=ri===vis.length-1;
        const cs=isApex
          ? 'background:linear-gradient(135deg,#C9A84C,#9A7A06);color:#FFF5E0;border:none;box-shadow:0 2px 8px rgba(180,150,10,.4)'
          : isNew
          ? 'background:#E8DDD0;color:#2C2420;border:1px solid #D8CEBC'
          : 'background:#fff;color:#2C2420;border:1px solid #E0D8CC';

        return '<div style="display:flex;gap:4px;animation:goralRowIn .2s ease">'+
          row.map(n=>'<span style="min-width:28px;height:28px;padding:0 3px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;font-size:11px;font-weight:700;'+cs+'">'+n+'</span>').join('')+
        '</div>';
      }).join('');
    }
  }

  await new Promise(r=>setTimeout(r,600));
  goralRenderResult();
  goralShowStage('result');
}

function goralRenderResult(){
  const r=_goralResult;
  if(!r) return;

  const keys=['א','ב','ג','ד'];
  const cont=_el('goralResultContainer');
  if(!cont) return;

  cont.innerHTML =
    '<div style="background:#1A1A28;border-radius:16px;padding:26px 20px;margin-bottom:16px;text-align:center">'+
      '<p style="color:#C9A84C;font-size:.72rem;letter-spacing:3px;margin:0 0 12px;font-weight:400">נוסח הגורל</p>'+
      '<p style="color:#FFF5E0;font-size:1.25rem;font-weight:700;line-height:1.85;margin:0">'+r.answer+'</p>'+
    '</div>'+

    '<div class="card" style="margin-bottom:14px">'+
      '<div class="card-title" style="font-size:.8rem">✦ פירוט ארבעת הלוחות</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+
        keys.map(k=>{
          const tr=r.tRes[k];
          return '<div style="background:var(--bg,#EAE5DC);border-radius:10px;padding:12px 10px;border:1px solid var(--border,#D8CEBC)">'+
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'+
              '<span style="color:var(--muted,#7A6E62);font-size:.72rem">לוח '+k+' · מפתח '+tr.key+'</span>'+
              '<span style="color:#C8C0B0;font-size:.68rem">'+tr.signs.join('—')+'</span>'+
            '</div>'+
            '<div style="color:#B8950A;font-size:1.6rem;font-weight:900;letter-spacing:4px;line-height:1">'+(tr.letters || '—')+'</div>'+
          '</div>';
        }).join('')+
      '</div>'+
    '</div>'+

    '<div class="card" style="margin-bottom:14px">'+
      '<div class="card-title" style="font-size:.8rem">ארבעת סימני המפתח מן האלכסון ('+(r.parity==='even'?'זוגיים':'אי־זוגיים')+')</div>'+
      '<div style="display:flex;gap:10px;justify-content:center;padding:4px 0">'+
        r.diags.map(d=>'<div style="width:44px;height:44px;border-radius:10px;background:#1A1A28;color:#D4AF37;font-size:1.2rem;font-weight:700;display:flex;align-items:center;justify-content:center;">'+d+'</div>').join('')+
      '</div>'+
    '</div>'+

    '<div class="card" style="border-right:3px solid #B8950A;margin-bottom:16px">'+
      '<p style="color:var(--muted,#7A6E62);font-size:.72rem;margin:0 0 4px">שאלה</p>'+
      '<p style="color:var(--text,#2C2420);font-size:.88rem;margin:0;line-height:1.7">'+
        _el('goralName').value+' בן '+_el('goralFather').value+': &ldquo;'+_el('goralQuestion').value+'&rdquo;'+
      '</p>'+
    '</div>'+

    '<button class="btn btn-gold" onclick="goralReset()">✦ שאלה חדשה</button>';
}
