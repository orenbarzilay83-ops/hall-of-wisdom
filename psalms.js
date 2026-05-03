const psalmsData = {
    'א': { start: 'אודה ה\' בכל לבב', end: 'אשירה לה\' כי גמל עלי' },
    'ב': { start: 'בטחו בה\' עדי עד', end: 'ברוך ה\' לעולם אמן ואמן' },
    'ג': { start: 'גול על ה\' דרכך', end: 'גדול ה\' ומהולל מאד' },
    // כאן יכנסו כל שאר האותיות מהרשימה המלאה של קלוד
};

function findPsalm() {
    const name = document.getElementById('userName').value;
    if (!name) return alert("הזן שם במחשבון קודם");
    
    const firstLetter = name[0];
    const lastLetter = name[name.length - 1];
    
    const result = psalmsData[firstLetter] || { start: 'לא נמצא פסוק מתאים', end: '' };
    
    document.getElementById('psalmOutput').innerHTML = `
        <div style="background:var(--glass); border:1px solid var(--gold); padding:15px; border-radius:10px;">
            <p><strong>הפסוק שלך:</strong></p>
            <p style="font-style:italic;">"${result.start}... ${result.end}"</p>
        </div>
    `;
}
