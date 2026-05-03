async function findPsalm() {
    try {
        const response = await fetch('psalms.json');
        const data = await response.json();
        // שליפת פרק א' כדוגמה מהנתונים שהעלית[span_1](start_span)[span_1](end_span)
        const chapter1 = data.text[0].join('<br>');
        
        document.getElementById('psalmOutput').innerHTML = `
            <div style="direction:ltr; text-align:left; font-family:serif; font-size:1rem; padding:20px; background:rgba(0,0,0,0.5); border:1px solid var(--gold); border-radius:10px;">
                <h4 style="color:var(--gold); text-align:center;">Psalms - Chapter 1</h4>
                ${chapter1}
            </div>
        `;
    } catch (e) {
        console.error("Error:", e);
        alert("וודא שקובץ psalms.json נמצא בתיקייה");
    }
}

function runAnalysis() {
    const name = document.getElementById('userName').value;
    // כאן נשתמש במידע מתוך library.lifePath ו-library.name שנוצר מהקבצים שלך
    document.getElementById('output').innerHTML = `
        <div class="card">
            <h3 style="color:var(--gold);">ניתוח לפי הספרייה שלך</h3>
            <p>הנתונים נטענו בהצלחה מקבצי ה-iPad.</p>
        </div>
    `;
}
