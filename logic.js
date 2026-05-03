function calculateGematria(name) {
    const table = {'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,'י':10,'כ':20,'ל':30,'מ':40,'נ':50,'ס':60,'ע':70,'פ':80,'צ':90,'ק':100,'ר':200,'ש':300,'ת':400,'ך':20,'ם':40,'ן':50,'ף':80,'ץ':90};
    return [...name].reduce((s, c) => s + (table[c] || 0), 0);
}

function reduceNum(num) {
    while (num > 9 && num !== 11 && num !== 22) {
        num = [...String(num)].reduce((a, b) => +a + +b, 0);
    }
    return num;
}

function runAnalysis() {
    const name = document.getElementById('userName').value;
    const date = document.getElementById('birthDate').value;
    if(!name || !date) return alert("מלא פרטים");

    // שמירה לשימוש בדף התהילים
    localStorage.setItem('savedName', name);

    const nameNum = reduceNum(calculateGematria(name));
    const fateNum = reduceNum([...date.replace(/-/g, '')].reduce((a, b) => +a + +b, 0));

    // כאן אנחנו משתמשים במידע מה-library (מהקבצים שלך!)
    document.getElementById('output').innerHTML = `
        <div class="card" style="text-align: right; animation: fadeIn 0.5s;">
            <h3 style="color:var(--gold);">תוצאות הניתוח</h3>
            <p><strong>מספר השם שלך הוא: ${nameNum}</strong></p>
            <div style="font-size: 0.9rem; color: #ccc; max-height: 150px; overflow-y: auto; padding: 10px; border: 1px solid #333;">
                ${typeof library !== 'undefined' ? library.name : 'טוען נתונים מהספרייה...'}
            </div>
            <hr border="0" style="border-top: 1px solid #444; margin: 15px 0;">
            <p><strong>מספר נתיב החיים (גורל): ${fateNum}</strong></p>
            <div style="font-size: 0.9rem; color: #ccc; max-height: 150px; overflow-y: auto; padding: 10px; border: 1px solid #333;">
                ${typeof library !== 'undefined' ? library.lifePath : 'טוען נתונים מהספרייה...'}
            </div>
        </div>
    `;
}

async function findPsalm() {
    const div = document.getElementById('psalmOutput');
    div.innerHTML = "מחפש בספר התהילים...";
    
    try {
        const response = await fetch('psalms.json');
        const data = await response.json();
        // הצגת פרק א' מהמקור שהעלית[span_0](start_span)[span_0](end_span)
        const verses = data.text[0].join('<br><br>'); 
        
        div.innerHTML = `
            <h4 style="color:var(--gold); text-align:center;">תהילים - פרק א'</h4>
            <div class="psalm-content" style="direction: ltr; text-align: left;">${verses}</div>
        `;
    } catch (e) {
        div.innerHTML = "שגיאה בטעינת ספר התהילים.";
    }
}
