// טבלת גימטריה לערך האותיות
const gematriaTable = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400,
    'ך': 20, 'ם': 40, 'ן': 50, 'ף': 80, 'ץ': 90
};

// פונקציה לחישוב גימטריה של שם
function calculateGematria(name) {
    let sum = 0;
    for (let char of name) {
        if (gematriaTable[char]) {
            sum += gematriaTable[char];
        }
    }
    return sum;
}

// פונקציה לצמצום מספר למספר נומרולוגי (1-9)
function reduceNumber(num) {
    while (num > 9 && num !== 11 && num !== 22) { // משאירים מספרי מאסטר 11, 22
        num = String(num).split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return num;
}

// פונקציה מרכזית לניתוח
function runAnalysis() {
    const name = document.getElementById('userName').value;
    const date = document.getElementById('birthDate').value;
    
    if (!name || !date) {
        alert("נא להזין שם מלא ותאריך לידה");
        return;
    }

    const gemVal = calculateGematria(name);
    const numName = reduceNumber(gemVal);
    
    // חישוב תאריך לידה (מספר גורל)
    const dateDigits = date.replace(/-/g, '');
    const fateNum = reduceNumber(dateDigits.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0));

    const output = document.getElementById('output');
    output.innerHTML = `
        <div style="border: 1px solid #d4af37; padding: 15px; border-radius: 10px; background: rgba(255,255,255,0.05);">
            <p><strong>ערך השם בגימטריה:</strong> ${gemVal}</p>
            <p><strong>מספר השם שלך:</strong> ${numName}</p>
            <p><strong>מספר הגורל שלך:</strong> ${fateNum}</p>
            <hr style="border-color: #333;">
            <p style="font-size: 0.9rem; color: #ccc;">הניתוח המלא מבוסס על שילוב של ${numName} ו-${fateNum}...</p>
        </div>
    `;
}
