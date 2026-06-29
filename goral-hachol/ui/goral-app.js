const FIGURE_ORDER = [
  "1222", "2121", "1212", "2222",
  "1121", "1221", "2221", "2122",
  "2212", "1122", "2211", "1112",
  "1211", "2111", "2112", "1111"
];

let selectedMothers = [null, null, null, null];
let activeMother = 0;
let selectedHouseNum = null;  // בית שנבחר (1-12)
let forcedTopicId = null;     // נושא שנקבע בכוח (למשל: בדיקה רוחנית)
let selectedTopicId = null;   // תת-נושא שנבחר ישירות מתוך רשימת תת-נושאים
let profileState = { gender: null, marital: null, work: null, children: null };
let selectedQuestion = null;  // שאלה שנבחרה ממסך השאלות
let _activeCatFilter = 'all'; // פילטר קטגוריה פעיל

// 12 כרטיסים לפי סדר הבתים. הנושא המדויק נקבע בזמן הריצה לפי השאלה.
// subTopics — אם יש, מוצגים לאחר בחירת הבית; null = ברירת מחדל ישירה.
const TOPIC_CARDS = [
  { house: 1,  title: 'בית החיים',            desc: 'בריאות, גוף, נפש, מצב כללי, מולד',    defaultTopicId: 'foundations',       subTopics: [
    { topicId: 'foundations',   label: 'מצב כללי / שאלה חופשית' },
    { topicId: 'birthNativity', label: 'מולד — גורל האדם' },
  ]},
  { house: 2,  title: 'כסף ופרנסה',     desc: 'ממון, רכוש, עסקים, מסחר',              defaultTopicId: 'commerce',          subTopics: null },
  { house: 3,  title: 'אחים ושכנים',    desc: 'אחים, שכנים, קרובים, מכתבים',          defaultTopicId: 'siblings',          subTopics: null },
  { house: 4,  title: 'בית ונכסים',     desc: 'דירה, נדל"ן, ירושה, דברים נסתרים',    defaultTopicId: 'hiddenTreasure',    subTopics: null },
  { house: 5,  title: 'ילדים והריון',   desc: 'לידה, הריון, ילדים, שמחה',             defaultTopicId: 'childrenPregnancy', subTopics: null },
  { house: 6,  title: 'מחלה ובריאות',  desc: 'חולי, מצב רפואי, החלמה',               defaultTopicId: 'illness',           subTopics: [
    { topicId: 'illness',              label: 'מחלה / בריאות' },
    { topicId: 'spiritualDiagnostics', label: 'עין הרע / כישוף / ג׳ין' },
    { topicId: 'lostAnimal',           label: 'בהמה / חיה אבודה' },
  ]},
  { house: 7,  title: 'בית הזוגיות',        desc: 'בן/בת זוג, שותף, יריב, גנב, נעדר',     defaultTopicId: 'marriage',          subTopics: [
    { topicId: 'marriage',             label: 'נישואין / זוגיות' },
    { topicId: 'disputes',             label: 'תביעה / סכסוך' },
    { topicId: 'theft',                label: 'גנבה' },
    { topicId: 'missingPerson',        label: 'נעדר' },
    { topicId: 'partnership',          label: 'שותפות' },
    { topicId: 'enemies',              label: 'אויב' },
  ]},
  { house: 8,  title: 'מוות וירושה',    desc: 'מוות, ירושה, פחד גדול, שינוי עמוק',   defaultTopicId: 'deathInheritance',  subTopics: null },
  { house: 9,  title: 'נסיעה ומסע',     desc: 'יציאה, נסיעה, ים, דת, רוחניות',        defaultTopicId: 'travel',            subTopics: [
    { topicId: 'travel',               label: 'נסיעה / יציאה' },
    { topicId: 'seaVoyage',            label: 'מסע ים' },
    { topicId: 'missingPerson',        label: 'נעדר בדרך / נוסע שנעלם' },
  ]},
  { house: 10, title: 'עבודה ומעמד',    desc: 'קריירה, שלטון, בעלי סמכות',            defaultTopicId: 'authorityState',    subTopics: [
    { topicId: 'authorityState',       label: 'תפקיד / שלטון / קריירה' },
    { topicId: 'yearlyForecast',       label: 'תחזית שנתית' },
  ]},
  { house: 11, title: 'חברים ואהבה',    desc: 'חברים, קשרים, תקוות, אהבה',            defaultTopicId: 'loveHate',          subTopics: null },
  { house: 12, title: 'אויבים וכלא',    desc: 'אויבים נסתרים, מאסר, סכנה',            defaultTopicId: 'enemies',           subTopics: [
    { topicId: 'enemies',              label: 'אויבים נסתרים' },
    { topicId: 'prisoner',             label: 'מאסר / כלא' },
    { topicId: 'fear',                 label: 'פחד / סכנה' },
  ]},
];

// מיפוי מילות מפתח לנושא מדויק לפי בית — כל בית יכול להכיל כמה תת-נושאים
const HOUSE_TOPIC_KEYWORDS = {
  1: [
    { topicId: 'birthNativity', kw: ['מולד','נטיביטי','לידה','גורל','עתיד','אופי','מזל לידה','בית לידה','גורל האדם','ייעוד','מה עתידי','מה גורלי'] },
    // default: foundations
  ],
  6: [
    { topicId: 'spiritualDiagnostics', kw: ['עין הרע','כישוף','עין','קנאה','רוח רעה','שד','דיבוק','קללה','עשב','מזיק','אבחון רוחני','חרם','נגיעה'] },
    // default: illness
  ],
  7: [
    { topicId: 'theft',         kw: ['גנב','גנבה','גנוב','נגנב','גנבו','מי לקח','לקחו','הגנבה','נגנב לי','גנבו לי','גנב לי'] },
    { topicId: 'missingPerson', kw: ['נעדר','נעלם','נעלמה','לא חזר','לא חזרה','אבד','אבדה','היכן הוא','היכן היא','איפה הוא','איפה היא'] },
    { topicId: 'disputes',      kw: ['תביעה','בית משפט','מחלוקת','ריב','סכסוך','יריב','תובע','נתבע','דיון משפטי','פסיקה','עורך דין'] },
    { topicId: 'partnership',   kw: ['שותף','שותפות','עסק משותף','ערב','ערבות','חוזה','הסכם עסקי','קשר עסקי'] },
    { topicId: 'enemies',       kw: ['אויב','אויבים','מתנקש','שונא','שונאים','מי מזיק','מי עושה לי','מי פוגע'] },
    // default: marriage
  ],
  9: [
    { topicId: 'seaVoyage',            kw: ['ים','ספינה','אונייה','שייט','ימי','נמל','דיג','מסע ים','נסיעה בים','אוקיינוס'] },
    { topicId: 'missingPerson',        kw: ['נעדר בדרך','נעלם בנסיעה','לא חזר מנסיעה','נוסע שנעלם','יצא לדרך ולא חזר'] },
    { topicId: 'spiritualDiagnostics', kw: ['חלום','חזון','נבואה','סימן שמיימי','דת','אמונה','רוחניות','נסתר','קבלה','ספיריטואל'] },
    // default: travel
  ],
  10: [
    { topicId: 'yearlyForecast', kw: ['שנה','תחזית שנתית','טאלע','גורל השנה','מה יקרה השנה','השנה הקרובה'] },
    // default: authorityState
  ],
  12: [
    { topicId: 'prisoner',  kw: ['כלא','מאסר','מעצר','עצור','נאסר','כלוא','בית סוהר','שחרור מכלא','תיק פלילי','פלילי'] },
    { topicId: 'fear',      kw: ['פחד','סכנה','מסוכן','איום','מאיים','חרדה','פוחד','מפחד','סכנת חיים'] },
    { topicId: 'spiritualDiagnostics', kw: ['כישוף','עין הרע','שד','רוח רעה','קללה','דיבוק','נגיעה','חרם'] },
    // default: enemies
  ],
};

function detectTopicFromQuestion(houseNum, questionText) {
  const q = (questionText || '').toLowerCase();
  const rules = HOUSE_TOPIC_KEYWORDS[houseNum];
  if (rules) {
    for (const rule of rules) {
      if (rule.kw.some(k => q.includes(k))) return rule.topicId;
    }
  }
  const card = TOPIC_CARDS.find(c => c.house === houseNum);
  return card ? card.defaultTopicId : 'foundations';
}

function renderTopicGrid() {
  const grid = document.getElementById("topicGrid");
  if (!grid) return;
  const spiritualActive = forcedTopicId === 'spiritualDiagnostics';
  const generalActive  = forcedTopicId === 'generalReading';

  // תת-נושאים לבית שנבחר (אם יש)
  const selectedCard = (!forcedTopicId && selectedHouseNum)
    ? TOPIC_CARDS.find(c => c.house === selectedHouseNum) : null;
  const subTopicsHtml = (selectedCard?.subTopics?.length)
    ? `<div class="subtopic-row">` +
      selectedCard.subTopics.map(st =>
        `<button type="button" class="subtopic-btn${selectedTopicId === st.topicId ? ' selected' : ''}" data-topic="${st.topicId}">${st.label}</button>`
      ).join('') +
      `</div>`
    : '';

  grid.innerHTML = `
    <button type="button" class="topic-general-btn${generalActive ? ' selected' : ''}" id="generalReadingBtn">
      <span>🔮</span>
      <span>פתיחה כללית — מצב האדם בכל תחומי החיים</span>
      <span class="topic-general-badge">סקירה מלאה</span>
    </button>
    <button type="button" class="topic-spiritual-btn${spiritualActive ? ' selected' : ''}" id="spiritualDxBtn">
      <span>🌙</span>
      <span>בדיקה רוחנית — עין הרע, כישוף, ג׳ין</span>
      <span class="topic-spiritual-badge">ניתוח מיוחד</span>
    </button>
  ` + TOPIC_CARDS.map(c => `
    <button type="button" class="topic-card ${(!forcedTopicId && selectedHouseNum === c.house) ? 'selected' : ''}" data-house="${c.house}">
      <div class="topic-card-house">בית ${c.house}</div>
      <div class="topic-card-title">${c.title}</div>
      <div class="topic-card-desc">${c.desc}</div>
    </button>
  `).join("") + subTopicsHtml + `
    <button type="button" class="topic-free-btn ${(!forcedTopicId && selectedHouseNum === 0) ? 'selected' : ''}" data-house="0">
      שאלה חופשית — האפליקציה תזהה את הנושא לבד
    </button>`;

  document.getElementById("generalReadingBtn").addEventListener("click", () => {
    forcedTopicId = generalActive ? null : 'generalReading';
    selectedHouseNum = null;
    selectedTopicId = null;
    renderTopicGrid();
  });

  document.getElementById("spiritualDxBtn").addEventListener("click", () => {
    forcedTopicId = spiritualActive ? null : 'spiritualDiagnostics';
    selectedHouseNum = null;
    selectedTopicId = null;
    renderTopicGrid();
  });

  grid.querySelectorAll("[data-house]").forEach(btn => {
    btn.addEventListener("click", () => {
      forcedTopicId = null;
      selectedTopicId = null;  // איפוס תת-נושא בעת בחירת בית חדש
      selectedHouseNum = Number(btn.dataset.house);
      renderTopicGrid();
    });
  });

  grid.querySelectorAll(".subtopic-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const tid = btn.dataset.topic;
      selectedTopicId = (selectedTopicId === tid) ? null : tid;
      renderTopicGrid();
    });
  });

}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function linesFromKey(key) {
  return String(key).split("").map(Number);
}

function getFiguresForPicker() {
  const forms = window.RAML_FORMS_BASIC || {};
  return FIGURE_ORDER.map(key => {
    const item = forms[key] || {};
    return {
      id: `raml-${key}`,
      key,
      name: item.hebrew || key,
      arabic: item.arabic || "",
      statusHebrew: item.statusHebrew || "",
      lines: linesFromKey(key)
    };
  });
}

const figures = getFiguresForPicker();

function glyphHtml(lines) {
  return `
    <div class="glyph">
      ${lines.map(v => `<div class="${Number(v) === 1 ? "one" : "two"}"></div>`).join("")}
    </div>
  `;
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-" + name)?.classList.add("active");
  const topbar = document.querySelector('.topbar');
  if (topbar) topbar.style.display = name === 'open' ? 'none' : '';
  window.scrollTo({ top:0, behavior:"smooth" });
}

// ─── מסך בחירת שאלה ────────────────────────────────────────────────────────
function renderQuestionScreen() {
  const cats = window.QUESTION_CATEGORIES || [];
  const bank = window.QUESTION_BANK || [];

  const allCats = [{ id: 'all', label: 'הכל', emoji: '📋', color: '#d0d0d0', border: '#999' }, ...cats];

  const tabsEl = document.getElementById('qcatTabs');
  if (tabsEl) {
    tabsEl.innerHTML = allCats.map(cat => {
      const isActive = _activeCatFilter === cat.id;
      return `<button class="qcat-tab${isActive ? ' active' : ''}" data-cat="${cat.id}">
        ${cat.emoji} ${cat.label}
      </button>`;
    }).join('');

    tabsEl.querySelectorAll('.qcat-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        _activeCatFilter = btn.dataset.cat;
        renderQuestionScreen();
      });
    });
  }

  const catMap = {};
  cats.forEach(c => { catMap[c.id] = c; });

  const filtered = _activeCatFilter === 'all' ? bank : bank.filter(q => q.category === _activeCatFilter);

  const gridEl = document.getElementById('qcardGrid');
  if (gridEl) {
    gridEl.innerHTML = filtered.map(q => {
      const cat = catMap[q.category] || {};
      const isSelected = selectedQuestion && selectedQuestion.id === q.id;
      return `<button type="button"
        class="qcard${isSelected ? ' selected' : ''}"
        data-qid="${q.id}">
        <span class="qcard-label">${escapeHtml(q.label)}</span>
        <span class="qcard-desc">${escapeHtml(q.desc)}</span>
        <span class="qcard-badge">בית ${q.houseId}</span>
      </button>`;
    }).join('');

    gridEl.querySelectorAll('.qcard').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        selectedQuestion = bank.find(q => q.id === qid) || null;
        renderQuestionScreen();
      });
    });
  }

  const contBtn = document.getElementById('continueFromQuestionBtn');
  if (contBtn) contBtn.disabled = !selectedQuestion;
}

// ─── שדות דינמיים בהתאם לשאלה ─────────────────────────────────────────────
function renderDynamicClientFields() {
  const bannerEl = document.getElementById('questionBanner');
  const fieldsEl = document.getElementById('dynamicFieldsSection');

  if (!selectedQuestion) {
    if (bannerEl) bannerEl.style.display = 'none';
    if (fieldsEl) fieldsEl.style.display = 'none';
    return;
  }

  const cats = window.QUESTION_CATEGORIES || [];
  const catMap = {};
  cats.forEach(c => { catMap[c.id] = c; });
  const cat = catMap[selectedQuestion.category] || {};

  if (bannerEl) {
    bannerEl.style.display = '';
    bannerEl.innerHTML = `<div class="question-banner">
      <span class="question-banner-emoji">${cat.emoji || '•'}</span>
      <div class="question-banner-text">
        <div class="question-banner-label">${escapeHtml(selectedQuestion.label)}</div>
        <div class="question-banner-desc">${escapeHtml(selectedQuestion.desc)}</div>
      </div>
      <button class="question-banner-change" id="changequestionBtn">שנה שאלה</button>
    </div>`;
    bannerEl.querySelector('#changequestionBtn')?.addEventListener('click', () => {
      renderQuestionScreen();
      showScreen('question');
    });
  }

  const fields = selectedQuestion.clientFields || [];
  if (fieldsEl) {
    if (fields.length === 0) {
      fieldsEl.style.display = 'none';
    } else {
      fieldsEl.style.display = '';
      const fieldsHtml = fields.map(f => {
        const id = 'dynField_' + f.id;
        let inputHtml;
        if (f.type === 'textarea') {
          inputHtml = `<textarea id="${id}" rows="2" placeholder="${escapeHtml(f.placeholder || '')}" autocomplete="off"></textarea>`;
        } else if (f.type === 'select' && f.options) {
          inputHtml = `<select id="${id}">
            <option value="">-- בחר --</option>
            ${f.options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}
          </select>`;
        } else {
          inputHtml = `<input id="${id}" type="${f.type || 'text'}" placeholder="${escapeHtml(f.placeholder || '')}" autocomplete="off" />`;
        }
        return `<div class="open-field"><label>${escapeHtml(f.label)}</label>${inputHtml}</div>`;
      }).join('');
      fieldsEl.innerHTML = `<div class="dynamic-fields-wrap">
        <div class="dynamic-fields-title">פרטים לפי הנושא</div>
        ${fieldsHtml}
      </div>`;
    }
  }
}

function renderMotherSlots() {
  const box = document.getElementById("motherSlots");
  box.innerHTML = selectedMothers.map((fig, index) => `
    <button type="button"
      class="mother-slot ${index === activeMother ? "active" : ""} ${fig ? "filled" : ""}"
      data-index="${index}">
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        ${fig ? glyphHtml(fig.lines) : `<div style="font-size:11px;color:#888;">אם ${index + 1}</div>`}
      </div>
    </button>
  `).join("");

  box.querySelectorAll(".mother-slot").forEach(btn => {
    btn.addEventListener("click", () => {
      activeMother = Number(btn.dataset.index);
      renderMotherSlots();
      renderFigureGrid();
    });
  });
}

function renderFigureGrid() {
  const grid = document.getElementById("figureGrid");
  grid.innerHTML = figures.map((fig, index) => {
    const isCurrentSlot = selectedMothers[activeMother] && selectedMothers[activeMother].key === fig.key;
    const isOtherSlot = !isCurrentSlot && selectedMothers.some((m, i) => i !== activeMother && m && m.key === fig.key);
    const slotNum = isOtherSlot
      ? selectedMothers.findIndex((m, i) => i !== activeMother && m && m.key === fig.key) + 1
      : null;
    return `
      <button type="button" class="figure-card ${isCurrentSlot ? "selected" : isOtherSlot ? "other-selected" : ""}" data-index="${index}">
        ${glyphHtml(fig.lines)}
        <div class="figure-name">${escapeHtml(fig.name)}</div>
        ${isOtherSlot && slotNum ? `<div class="other-slot-badge">אם ${slotNum}</div>` : ""}
      </button>
    `;
  }).join("");

  grid.querySelectorAll(".figure-card").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedMothers[activeMother] = figures[Number(btn.dataset.index)];
      if (activeMother < 3) activeMother++;
      renderMotherSlots();
      renderFigureGrid();
    });
  });
}

function getClientContext(resolvedTopicId) {
  const ctx = {
    clientName: document.getElementById("clientNameInput").value.trim(),
    parentName: document.getElementById("clientParentInput").value.trim(),
    phone: document.getElementById("clientPhoneInput").value.trim(),
    questionDate: document.getElementById("questionDateInput").value.trim(),
    questionTime: document.getElementById("questionTimeInput").value.trim(),
    quesitedName: (document.getElementById("quesitedNameInput")?.value || "").trim(),
    consultationContext: "",
    topicOverride: resolvedTopicId || "",
    selectedHouse: selectedHouseNum || null,
    gender: profileState.gender || null,
    maritalStatus: profileState.marital || null,
    workStatus: profileState.work || null,
    hasChildren: profileState.children || null,
  };
  if (selectedQuestion && selectedQuestion.clientFields) {
    for (const field of selectedQuestion.clientFields) {
      const el = document.getElementById('dynField_' + field.id);
      if (el) ctx[field.id] = el.value.trim();
    }
  }
  return ctx;
}

function houseName(number) {
  const h = (window.RAML_HOUSES_BASIC || {})[number] || {};
  return h.hebrew || "";
}

function figNameFromReadingHouse(house) {
  return house.hebrew || house.figureHebrew || house.name || "";
}

// Natural figure (جدول) for each house — from חאוי העג׳איב PDFs only, no Western tradition.
const NATURAL_HOUSE_FIGURES = {
  1:  '1222', // נשוא ראש — ספר הודי עמדה 1
  2:  '2121', // ממון נכנס — ספר הודי עמדה 2
  3:  '1212', // ממון יוצא — ספר הודי עמדה 3
  4:  '2222', // קהלה — ספר הודי עמדה 4
  5:  '1121', // נלחם — ספר הודי עמדה 5
  6:  '1221', // סוהר — ספר הודי עמדה 6
  7:  '2221', // שפל ראש — ספר הודי עמדה 7
  8:  '2122', // אדום — ספר הודי עמדה 8
  9:  '2212', // לבן — ספר הודי עמדה 9
  10: '1122', // כבוד יוצא — ספר הודי עמדה 10
  11: '2211', // כבוד נכנס — ספר הודי עמדה 11
  12: '1112', // סף יוצא — ספר הודי עמדה 12
  13: '1211', // בר הלחי — ספר הודי עמדה 13
  14: '2111', // סף נכנס — ספר הודי עמדה 14
  15: '2112', // חיבור — ספר הודי עמדה 15
  16: '1111', // דרך — ספר הודי עמדה 16
};

function houseHtml(h, label, isDhamir, isNatural) {
  let cls = 'house';
  if (isDhamir)  cls += ' dhamir-house';
  if (isNatural) cls += ' natural-house';
  return `
    <div class="${cls}">
      <div class="house-title">${label}</div>
      <div class="house-name">${escapeHtml(h.houseHebrew || houseName(h.house))}</div>
      ${glyphHtml(h.figure)}
      <div class="figure-name">${escapeHtml(figNameFromReadingHouse(h))}</div>
    </div>
  `;
}

// ── לוח קונדלי — מפה אסטרולוגית הודית (ראמאל שאסטרה) ──────────────────────────────

const VEDIC_HOUSE_INFO = {
  1:  { heb: 'לגנה',   sign: 'טלה',     sym: '♈' },
  2:  { heb: 'ממון',   sign: 'שור',     sym: '♉' },
  3:  { heb: 'אחים',   sign: 'תאומים',  sym: '♊' },
  4:  { heb: 'בית/אם', sign: 'סרטן',    sym: '♋' },
  5:  { heb: 'ילדים',  sign: 'אריה',    sym: '♌' },
  6:  { heb: 'מחלה',   sign: 'בתולה',   sym: '♍' },
  7:  { heb: 'זוגיות', sign: 'מאזניים', sym: '♎' },
  8:  { heb: 'מוות',   sign: 'עקרב',    sym: '♏' },
  9:  { heb: 'מזל',    sign: 'קשת',     sym: '♐' },
  10: { heb: 'קריירה', sign: 'גדי',     sym: '♑' },
  11: { heb: 'רווח',   sign: 'דלי',     sym: '♒' },
  12: { heb: 'הפסד',   sign: 'דגים',    sym: '♓' },
};

const ZODIAC_SYM = {
  'טלה': '♈', 'שור': '♉', 'תאומים': '♊', 'סרטן': '♋',
  'אריה': '♌', 'בתולה': '♍', 'מאזניים': '♎', 'עקרב': '♏',
  'קשת': '♐', 'גדי': '♑', 'דלי': '♒', 'דגים': '♓',
};

const ZODIAC_POS_INFO = {
  'טאלע': { label: 'עולה ↑',  cls: 'kp-rising'   },
  'סאעד': { label: 'מצליח ✦', cls: 'kp-fortunate' },
  'גארב': { label: 'שוקע ↓',  cls: 'kp-setting'   },
  'האבט': { label: 'יורד ⬇',  cls: 'kp-falling'   },
};

function buildKundaliHtml(reading) {
  const getHouse = n => reading.chart.find(x => Number(x.house) === Number(n));

  function kundaliCell(houseNum, gridRow, gridCol) {
    const entry = getHouse(houseNum);
    if (!entry) return `<div class="kundali-cell" style="grid-row:${gridRow};grid-column:${gridCol}">—</div>`;

    const key = entry.key;
    const ex = FIGURE_EXTRA[key] || {};
    const vedic = VEDIC_HOUSE_INFO[houseNum] || {};
    const figName = figNameFromReadingHouse(entry);
    const zodiac = ex.zodiac || '';
    const zodiacPos = ex.zodiacPos || '';
    const zodSym = ZODIAC_SYM[zodiac] || '';
    const posInfo = ZODIAC_POS_INFO[zodiacPos] || {};
    const isLagna = houseNum === 1;
    const isOwnSign = vedic.sign && zodiac && vedic.sign === zodiac;
    const fClass = ex.fClass || '';

    let cls = 'kundali-cell';
    if (isLagna) cls += ' kundali-lagna';
    if (isOwnSign) cls += ' kundali-own-sign';

    return `
      <div class="${cls}" style="grid-row:${gridRow};grid-column:${gridCol}" title="בית ${houseNum} — ${escapeHtml(figName)} — מזל ${escapeHtml(zodiac)}">
        <div class="kcell-header">
          <span class="kcell-num">${houseNum}</span>
          <span class="kcell-vedic">${escapeHtml(vedic.heb || '')}</span>
        </div>
        <div class="kcell-glyph">${glyphHtml(entry.figure)}</div>
        <div class="kcell-fig-name fortune-${fClass}">${escapeHtml(figName)}</div>
        <div class="kcell-zodiac">${zodSym} ${escapeHtml(zodiac)}</div>
        ${zodiacPos ? `<span class="kcell-pos ${posInfo.cls || ''}">${escapeHtml(posInfo.label || zodiacPos)}</span>` : ''}
        ${isOwnSign ? `<span class="kcell-own">✦ ביתו</span>` : ''}
      </div>
    `;
  }

  return `
    <div class="kundali-wrap">
      <div class="kundali-header-row">
        <h3 class="kundali-title">לוח קונדלי — מפה אסטרולוגית הודית</h3>
        <p class="kundali-subtitle">12 הצורות ממוקמות בבתים הוֶדיים · שיטת ראמאל שאסטרה (מרתי) · <span class="kcell-own">✦ = צורה בסימן מזלה</span></p>
      </div>
      <div class="kundali-grid">
        ${kundaliCell(12,  1, 1)}
        ${kundaliCell(1,   1, 2)}
        ${kundaliCell(2,   1, 3)}
        ${kundaliCell(3,   1, 4)}
        ${kundaliCell(11,  2, 1)}
        <div class="kundali-center" style="grid-row:2/4;grid-column:2/4">
          <div class="kc-title">קונדלי</div>
          <div class="kc-sub">ראמאל שאסטרה</div>
          <div class="kc-sub" style="margin-top:6px;font-size:10px;opacity:0.7">מקור: ראמאל שאסטרה עמ' 38</div>
        </div>
        ${kundaliCell(4,   2, 4)}
        ${kundaliCell(10,  3, 1)}
        ${kundaliCell(5,   3, 4)}
        ${kundaliCell(9,   4, 1)}
        ${kundaliCell(8,   4, 2)}
        ${kundaliCell(7,   4, 3)}
        ${kundaliCell(6,   4, 4)}
      </div>
      <div class="kundali-legend">
        <span class="kcell-pos kp-rising">עולה = כוח מרבי</span>
        <span class="kcell-pos kp-fortunate">מצליח = מצב מיטבי</span>
        <span class="kcell-pos kp-setting">שוקע = כוח פוחת</span>
        <span class="kcell-pos kp-falling">יורד = כוח חלש</span>
      </div>
    </div>
  `;
}

function buildBoardHtml(reading) {
  const h = n => reading.chart.find(x => Number(x.house) === Number(n));
  const dhamirHouseNum = reading._precomputedInsight?.boardAnalysis?.dhamirByMizan?.primaryHouseNumber
    ?? reading._precomputedInsight?.boardAnalysis?.dhamirHouse?.houseNumber
    ?? null;

  const d = n => n === dhamirHouseNum;
  const nat = n => {
    const entry = h(n);
    return !!(entry && NATURAL_HOUSE_FIGURES[n] && entry.key === NATURAL_HOUSE_FIGURES[n]);
  };

  const naturalHouseNums = [1,2,3,4,5,6,7,8,9,10,11,12].filter(nat);

  return `
    <article class="board">
      <div class="board-row r1">
        ${[1,2,3,4,5,6,7,8].map(n => houseHtml(h(n), `בית ${n}`, d(n), nat(n))).join("")}
      </div>

      <div class="board-row r2">
        ${[9,10,11,12].map(n => houseHtml(h(n), `בית ${n}`, d(n), nat(n))).join("")}
      </div>

      <div class="board-row r3">
        ${houseHtml(h(13), "13 — עד א׳", d(13), false)}
        ${houseHtml(h(14), "14 — עד ב׳", d(14), false)}
      </div>
    </article>

    <div class="final-row">
      <div class="final-box">
        ${houseHtml(h(16), "16 — משלים", d(16), false)}
      </div>
      <div class="final-box">
        ${houseHtml(h(15), "15 — דיין", d(15), false)}
      </div>
    </div>
    ${naturalHouseNums.length > 0 ? `<div class="natural-house-legend">✦ = צורה טבעית (בית${naturalHouseNums.length > 1 ? 'ות' : ''} ${naturalHouseNums.join(', ')}) — הצורה הטבעית של הבית, הדין חזק במיוחד</div>` : ""}
    ${dhamirHouseNum ? `<div class="dhamir-legend">★ = בית הדמיר (בית ${dhamirHouseNum}) — הצורה שכל שאר הצורות מעידות עליה</div>` : ""}
  `;
}

function verdictClass(verdict) {
  if (!verdict) return "";
  if (verdict === "yes-strong" || verdict === "yes-weak") return "verdict-yes";
  if (verdict === "no-strong" || verdict === "no-weak") return "verdict-no";
  if (verdict === "maybe-positive" || verdict === "maybe-negative") return "verdict-maybe";
  return "verdict-mixed";
}

function buildInterpretationHtml(reading) {
  if (!window.HAWI_INTERPRETER?.interpretHawiQuestionInitial) {
    return `<div class="summary-box">אבחון גורל החול עדיין נטען. אם ההודעה נשארת, מנוע הידע לא נטען בדפדפן.</div>`;
  }

  if (!reading.clientHistorySummary && window.GORAL_CLIENT_ARCHIVE?.summarizeGoralClientHistory) {
    reading.clientHistorySummary = window.GORAL_CLIENT_ARCHIVE.summarizeGoralClientHistory(
      reading.clientContext?.clientName || ""
    );
  }

  const insight = reading._precomputedInsight
    || window.HAWI_INTERPRETER.interpretHawiQuestionInitial(reading.question, reading);
  window.__LAST_GORAL_READING = reading;
  window.__LAST_GORAL_INTERPRETATION = insight;

  // שמור לארכיון לקוחות אוטומטית
  if (window.GORAL_CLIENT_ARCHIVE?.saveGoralReadingToArchive) {
    window.GORAL_CLIENT_ARCHIVE.saveGoralReadingToArchive(reading, insight);
  }

  const conclusion = insight.finalConclusionHebrew || insight.conclusionDraftHebrew || insight.technicalConclusionHebrew || "";
  const score = insight.boardScore || {};
  const judgeV = insight.judgeVerdict || score.judgeVerdict || null;
  const rules = Array.isArray(insight.relevantRules) ? insight.relevantRules.slice(0, 6) : [];
  const sources = Array.isArray(insight.knowledgeSources) ? insight.knowledgeSources.slice(0, 5) : [];
  const spiritual = insight.spiritualDiagnosis || null;
  const isSpiritualTopic = insight.topicId === "spiritualDiagnostics";
  // Only show spiritual section when explicitly spiritual topic,
  // or when the engine finds very strong suspicion (not just any score > 0)
  const showSpiritual = spiritual && isSpiritualTopic;
  // Show spiritual bleedthrough warning on non-spiritual topics when suspicion is strong/medium
  const showSpiritualBleedthrough = spiritual && !isSpiritualTopic &&
    ['strong-suspicion', 'medium-suspicion'].includes(spiritual?.grade);

  // Board score + dhamir banner (before verdict)
  const boardScoreData = insight.boardAnalysis?.boardScore || null;
  const dhamirMizanData = insight.boardAnalysis?.dhamirByMizan || null;
  let boardInfoHtml = "";
  if (boardScoreData && boardScoreData.isComplete) {
    boardInfoHtml += `<div class="board-info-row board-score-ok">📊 ${escapeHtml(boardScoreData.hebrewSummary)}</div>`;
  }
  if (dhamirMizanData && dhamirMizanData.traces && dhamirMizanData.traces.length > 0) {
    const traceText = dhamirMizanData.traces.map(t =>
      `שורת ${escapeHtml(t.rowElement)} → בית ${t.dhamirHouseNumber} (${escapeHtml(t.dhamirHebrew)}${t.dhamirFortune ? ', ' + hebrewTermsSimple(t.dhamirFortune) : ''})`
    ).join(' | ');
    boardInfoHtml += `<div class="board-info-row board-dhamir">🎯 הדמיר: ${traceText} — הדמיר העיקרי: בית ${dhamirMizanData.primaryHouseNumber}</div>`;
  }
  const querentSubjectData = insight.boardAnalysis?.querentSubject || null;
  if (querentSubjectData) {
    boardInfoHtml += `<div class="board-info-row board-querent-subject">🔍 ${escapeHtml(querentSubjectData.outputHebrew)} — (ב6=${escapeHtml(querentSubjectData.house6Figure)}, ${escapeHtml(querentSubjectData.sourceRef)})</div>`;
  }
  const sodHaDhamirimData = insight.boardAnalysis?.sodHaDhamirim || null;
  if (sodHaDhamirimData) {
    boardInfoHtml += `<div class="board-info-row board-sod-dhamirim">⭐ ${escapeHtml(sodHaDhamirimData.outputHebrew)} — (${escapeHtml(sodHaDhamirimData.sourceRef)})</div>`;
  }
  const honestyData = insight.boardAnalysis?.querentHonestyCheck || null;
  if (honestyData) {
    const cls = honestyData.isHonest ? 'board-honesty-ok' : 'board-honesty-warn';
    const icon = honestyData.isHonest ? '✅' : '⚠️';
    boardInfoHtml += `<div class="board-info-row ${cls}">${icon} ${escapeHtml(honestyData.outputHebrew)} — (${escapeHtml(honestyData.sourceRef)})</div>`;
  }
  const timingThirdsData = insight.boardAnalysis?.timingByDhamirThirds || null;
  if (timingThirdsData) {
    boardInfoHtml += `<div class="board-info-row board-timing-thirds">⏱ ${escapeHtml(timingThirdsData.outputHebrew)} — (${escapeHtml(timingThirdsData.sourceRef)})</div>`;
  }
  const temperamentData = insight.boardAnalysis?.querentTemperament || null;
  if (temperamentData) {
    boardInfoHtml += `<div class="board-info-row board-temperament">🌡 ${escapeHtml(temperamentData.outputHebrew)} — (${escapeHtml(temperamentData.sourceRef)})</div>`;
  }

  const topicId = insight.topicId || "";

  // Rewrite internal terminology for client-facing display
  function hebrewTerms(s) {
    return s
      .replace(/תסדיס/g, "קשר צדדי")
      .replace(/ריבוע/g, "קשר חזק")
      .replace(/משולש/g, "קשר טבעי")
      .replace(/מול/g, "קשר מנוגד")
      .replace(/נאר \(אש\)/g, "אש")
      .replace(/הוואא \(אוויר\)/g, "אוויר")
      .replace(/מאא \(מים\)/g, "מים")
      .replace(/תראב \(אדמה\)/g, "עפר")
      .replace(/בית יתד/g, "בית חזק")
      .replace(/איתיסלאת/g, "חיבורים")
      .replace(/ממוזג-?סעד/g, "ממוזג-טוב")
      .replace(/ממוזג-?נחס/g, "ממוזג-רע")
      .replace(/\[סעד\]/g, "[טוב]")
      .replace(/\[נחס\]/g, "[רע]")
      .replace(/ סעד(?=[^א-ת]|$)/g, " טוב")
      .replace(/ נחס(?=[^א-ת]|$)/g, " רע");
  }

  function hebrewTermsSimple(s) {
    return String(s || '')
      .replace(/ממוזג-?סעד/g, "ממוזג-טוב")
      .replace(/ממוזג-?נחס/g, "ממוזג-רע")
      .replace(/סעד/g, "טוב")
      .replace(/נחס/g, "רע");
  }

  // Board score warning — always visible
  const boardWarnHtml = (boardScoreData && !boardScoreData.isComplete)
    ? `<div class="board-info-row board-score-warn">⚠ ${escapeHtml(boardScoreData.hebrewSummary)}</div>`
    : "";

  // ─── SHORT CLIENT VERDICT (always visible) ─────────────────────────
  let shortVerdictHtml = "";

  if (isSpiritualTopic && spiritual?.grade) {
    // Spiritual diagnostics: colored grade box
    const gradeMap = {
      "strong-suspicion": "כן — יש פגיעה רוחנית",
      "medium-suspicion": "ייתכן — חשד בינוני לפגיעה רוחנית",
      "weak-suspicion": "ספק — סימנים חלשים בלבד",
      "mostly-clear": "לא — אין פגיעה רוחנית",
      "mixed": "ממוזג — יש לבדוק עוד"
    };
    const verdictText = gradeMap[spiritual.grade] || spiritual.grade;
    const vClass = spiritual.grade === "strong-suspicion" ? "verdict-yes" :
                   spiritual.grade === "mostly-clear" ? "verdict-no" : "verdict-maybe";
    // Build evidence lines: skip first line (repeats verdict), limit to 3 key lines
    // Full detail is in "קרא עוד" (finalConclusionHebrew via buildSpiritualNarrative)
    const evidenceHtml = (spiritual.finalHebrew || '')
      .split('\n')
      .filter(Boolean)
      .slice(1, 4)
      .map(l => escapeHtml(l))
      .join('<br/>');
    shortVerdictHtml = `
      <div class="verdict-box ${vClass}">
        <div class="verdict-label">תשובה לשאלה</div>
        <div class="verdict-answer">${escapeHtml(verdictText)}</div>
        ${evidenceHtml ? `<div class="verdict-detail" style="margin-top:10px;font-size:13px;line-height:1.8;text-align:right;">${evidenceHtml}</div>` : ''}
      </div>`;

  } else if (topicId !== 'generalReading' && judgeV && judgeV.hebrewShort) {
    // Fallback: generic verdict box
    shortVerdictHtml = `
      <div class="verdict-box ${escapeHtml(verdictClass(judgeV.verdict))}">
        <div class="verdict-label">תשובה לשאלה</div>
        <div class="verdict-answer">${escapeHtml(judgeV.hebrewShort)}</div>
        <div class="verdict-detail">${escapeHtml(judgeV.hebrewFull || "")}</div>
      </div>`;
  }

  // ─── SPIRITUAL DETAIL (inside details panel) ──────────────────────
  const spiritualDetailHtml = showSpiritualBleedthrough
    ? `
      <div class="summary-box">
        <strong>אבחון רוחני נוסף:</strong>
        <br/>${escapeHtml(spiritual.finalHebrew || "")}
        ${Array.isArray(spiritual.mainReasons) && spiritual.mainReasons.length
          ? `<ul>${spiritual.mainReasons.filter(r => r.score > 0).slice(0, 6).map(reason => `
              <li><strong>${reason.house != null ? `בית ${reason.house}` : escapeHtml(reason.role || "")}</strong>${reason.house != null && reason.role && reason.role !== `בית ${reason.house}` ? ` (${escapeHtml(reason.role)})` : ""}${reason.figureHebrew ? ` — ${escapeHtml(reason.figureHebrew)}` : ""}: ${escapeHtml((reason.signals || []).join(" "))}</li>
            `).join("")}</ul>`
          : ""}
      </div>`
    : "";

  // ─── CLIENT READING (clean narrative for reading aloud) ──────────
  let clientReadingHtml = "";
  if (insight.clientReadingHebrew) {
    const crFormatted = hebrewTerms(escapeHtml(insight.clientReadingHebrew))
      .replace(/\n\n/g, '</p><p style="margin-top:12px;">')
      .replace(/\n/g, '<br/>');
    clientReadingHtml = `
      <div class="client-reading-panel" style="direction:rtl; margin:18px 0 10px; border:2px solid #b8860b; border-radius:8px; background:#fffef5; padding:18px 20px;">
        <div style="font-weight:700; font-size:13px; color:#7a5c00; letter-spacing:0.5px; margin-bottom:10px; border-bottom:1px solid #e8d080; padding-bottom:6px;">📖 קרא ללקוח</div>
        <div style="font-size:16px; line-height:2; color:#2c2c2c;"><p style="margin:0;">${crFormatted}</p></div>
      </div>`;
  }

  // ─── DETAILS PANEL (behind "קרא עוד") ────────────────────────────
  const conclusionFormatted = hebrewTerms(escapeHtml(conclusion))
    .replace(/\n\n/g, '</p><p style="margin-top:14px;">')
    .replace(/\n/g, '<br/>');

  const sourcesHtml = "";

  const detailsPanelLabel = isSpiritualTopic
    ? `<div style="font-weight:700;font-size:13px;color:#5a3e00;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e0c860;">🔍 ניתוח רוחני מפורט</div>`
    : `<div style="font-weight:700;font-size:13px;color:#1a3a5c;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #c8d8f0;">📋 מסקנת הרישום</div>`;

  const detailsContent = `
    <div class="details-panel">
      <div class="summary-box" style="padding-top:14px;">
        ${detailsPanelLabel}
        <p>${conclusionFormatted}</p>
      </div>
      ${spiritualDetailHtml}
      ${sourcesHtml}
    </div>`;

  return `
    ${boardWarnHtml}
    ${shortVerdictHtml}
    ${clientReadingHtml}
    <button class="details-toggle" onclick="const p=this.nextElementSibling;p.hidden=!p.hidden;this.textContent=p.hidden?'קרא עוד ▼':'סגור ▲'">קרא עוד ▼</button>
    <div hidden>${detailsContent}</div>
    <div class="board-tools-row" style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap; direction:rtl;">
      <button type="button" class="board-tool-btn" onclick="window.showTimingTool(this)" style="background:#1a3a5c; color:#f0d060; border:none; border-radius:6px; padding:8px 18px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit;">⏱ עיתוי</button>
    </div>
    <div id="timingToolPanel" hidden style="direction:rtl; margin-top:10px; background:#f5f8ff; border:1px solid #1a3a5c; border-radius:8px; padding:16px 18px; font-size:14px; line-height:1.9;"></div>
  `;
}

window.showTimingTool = function(btn) {
  const panel = document.getElementById('timingToolPanel');
  if (!panel) return;
  if (!panel.hidden) { panel.hidden = true; btn.textContent = '⏱ עיתוי'; return; }

  const reading = window.__LAST_GORAL_READING;
  if (!reading || !Array.isArray(reading.chart) || reading.chart.length < 4) {
    panel.innerHTML = '<em>אין לוח פעיל לחישוב עיתוי.</em>';
    panel.hidden = false;
    return;
  }

  const result = window.HAWI_INTERPRETER?.computeTimingByMadad?.(reading.chart);
  if (!result) {
    panel.innerHTML = '<em>לא ניתן לחשב עיתוי מלוח זה.</em>';
    panel.hidden = false;
    return;
  }

  const lines = result.outputHebrew.split('\n').map(l => `<div>${escapeHtml(l)}</div>`).join('');
  panel.innerHTML = `
    <div style="font-weight:700; font-size:13px; color:#1a3a5c; margin-bottom:10px; border-bottom:1px solid #c8d8f0; padding-bottom:6px;">⏱ מתי יקרה הדבר? — שיטת המדד</div>
    <div style="font-size:15px; font-weight:700; color:#1a3a5c; margin-bottom:8px;">${escapeHtml(result.quantity)} ${escapeHtml(result.unitDisplay || result.unitShort)}</div>
    <div style="font-size:12px; color:#555; line-height:1.7;">${lines}</div>
    <div style="margin-top:10px; font-size:11px; color:#999; border-top:1px solid #e0e8f5; padding-top:6px;">מקור: ${escapeHtml(result.sourceRef)}</div>
  `;
  panel.hidden = false;
  btn.textContent = '⏱ עיתוי ▲';
};

async function runReading() {
  const errorBox = document.getElementById("errorBox");
  const boardResult = document.getElementById("boardResult");

  errorBox.style.display = "none";
  errorBox.textContent = "";

  try {
    if (selectedMothers.some(m => !m)) {
      throw new Error("צריך לבחור 4 אמהות לפני יצירת לוח הגורל.");
    }

    const question = document.getElementById("questionInput").value.trim();

    if (window.__HAWI_MODULE_READY) {
      await window.__HAWI_MODULE_READY;
    }

    const mothers = selectedMothers.map(m => m.lines);

    if (typeof window.ramlRunReading !== "function") {
      throw new Error("מנוע גורל החול לא נטען מתוך raml.js.");
    }

    // סדר עדיפות: תת-נושא מפורש > בחירת נושא בכוח > זיהוי אוטומטי לפי שאלה
    const resolvedTopicId = selectedTopicId
      ? selectedTopicId
      : forcedTopicId
      ? forcedTopicId
      : (selectedHouseNum && selectedHouseNum > 0)
        ? detectTopicFromQuestion(selectedHouseNum, question)
        : null;  // null = המנוע יחליט לבד לפי טקסט השאלה

    const reading = window.ramlRunReading(question, mothers);
    reading.topicId = resolvedTopicId ?? reading.topicId;
    reading.clientContext = getClientContext(reading.topicId);

    // Pre-compute once — buildBoardHtml + buildInterpretationHtml share the same insight
    if (window.GORAL_CLIENT_ARCHIVE?.summarizeGoralClientHistory) {
      reading.clientHistorySummary = window.GORAL_CLIENT_ARCHIVE.summarizeGoralClientHistory(
        reading.clientContext?.clientName || ""
      );
    }
    if (window.HAWI_INTERPRETER?.interpretHawiQuestionInitial) {
      reading._precomputedInsight = window.HAWI_INTERPRETER.interpretHawiQuestionInitial(reading.question, reading);
    }

    boardResult.innerHTML = buildBoardHtml(reading) + buildInterpretationHtml(reading);
    window._lastReading = reading;
    const kundaliResult = document.getElementById('kundaliResult');
    const kundaliBtn = document.getElementById('showKundaliBtn');
    if (kundaliResult) { kundaliResult.style.display = 'none'; kundaliResult.innerHTML = ''; }
    if (kundaliBtn) { kundaliBtn.textContent = '♐ לוח קונדלי — מפה אסטרולוגית הודית'; }
    showScreen("board");
  } catch (err) {
    errorBox.textContent = err.message || String(err);
    errorBox.style.display = "block";
    showScreen("board");
  }
}

function clearForm() {
  ["clientNameInput","clientParentInput","clientPhoneInput","questionDateInput","questionTimeInput","questionInput","quesitedNameInput"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  selectedHouseNum = null;
  forcedTopicId = null;
  selectedTopicId = null;
  selectedQuestion = null;
  profileState = { gender: null, marital: null, work: null, children: null };
  document.querySelectorAll('.profile-btn.selected').forEach(b => b.classList.remove('selected'));
  renderTopicGrid();
  renderDynamicClientFields();
  selectedMothers = [null,null,null,null];
  activeMother = 0;
  renderMotherSlots();
  renderFigureGrid();
}

// ── שעות טובות ורעות להטלה (בלוג' אלאמל עמ' 2) ──
function updateCastingTimeAlert() {
  const el = document.getElementById('castingTimeAlert');
  if (!el) return;
  const timeInput = document.getElementById('questionTimeInput');
  let h, m;
  if (timeInput && timeInput.value) {
    [h, m] = timeInput.value.split(':').map(Number);
  } else {
    const now = new Date();
    h = now.getHours();
    m = now.getMinutes();
  }
  const total = h * 60 + m;
  let cls, txt;
  if (total >= 20 * 60 || total < 6 * 60) {
    cls = 'good'; txt = '🌙 לילה — שעה טובה להטלה';
  } else if (total >= 6 * 60 && total < 14 * 60 + 30) {
    cls = 'good'; txt = '☀️ שחרית — שעה טובה להטלה';
  } else {
    cls = 'caution'; txt = '⚠️ מנחה עד שקיעה — זמן שכיח';
  }
  el.className = 'casting-alert ' + cls;
  el.textContent = txt;
}


document.getElementById('questionTimeInput')?.addEventListener('change', updateCastingTimeAlert);
updateCastingTimeAlert();

renderTopicGrid();

document.getElementById("manualBtn").addEventListener("click", () => {
  renderMotherSlots();
  renderFigureGrid();
  showScreen("select");
});


// ─── בחירה אוטומטית לפי עצירה ────────────────────────────────────────────────
let _autoInterval = null;
let _autoSpinIdx  = 0;
let _autoChosen   = [null, null, null, null];
let _autoSlot     = 0;
let _autoMode     = 'goral';  // 'goral' | 'isqat'

function _autoRenderGlyph() {
  document.getElementById('autoGlyph').innerHTML = glyphHtml(figures[_autoSpinIdx].lines);
}

function _autoRenderMiniSlots() {
  document.getElementById('autoMiniSlots').innerHTML = _autoChosen.map((fig, i) => {
    const isCurrent = i === _autoSlot && !fig;
    return `<div class="auto-mini-slot ${fig ? 'filled' : ''} ${isCurrent ? 'current' : ''}">
      ${fig ? glyphHtml(fig.lines) : `<span class="auto-slot-label">אם ${i + 1}</span>`}
    </div>`;
  }).join('');
}

function _autoOpen(mode) {
  if (mode) _autoMode = mode;
  _autoChosen  = [null, null, null, null];
  _autoSlot    = 0;
  _autoSpinIdx = Math.floor(Math.random() * figures.length);
  const modal = document.getElementById('autoSelectModal');
  modal.style.display = 'flex';
  document.getElementById('autoProceedRow').style.display = 'none';
  document.getElementById('autoStopBtn').style.display    = '';
  document.getElementById('autoStopBtn').disabled         = false;
  _autoRenderMiniSlots();
  _autoRenderGlyph();
  if (_autoInterval) clearInterval(_autoInterval);
  _autoInterval = setInterval(() => {
    _autoSpinIdx = (_autoSpinIdx + 1) % figures.length;
    _autoRenderGlyph();
  }, 70);
}

function _autoClose() {
  if (_autoInterval) { clearInterval(_autoInterval); _autoInterval = null; }
  document.getElementById('autoSelectModal').style.display = 'none';
}

document.getElementById('autoBtn').addEventListener('click', () => _autoOpen('goral'));

document.getElementById('autoStopBtn').addEventListener('click', () => {
  if (_autoSlot >= 4) return;
  _autoChosen[_autoSlot] = figures[_autoSpinIdx];
  _autoSlot++;
  _autoRenderMiniSlots();
  if (_autoSlot >= 4) {
    clearInterval(_autoInterval);
    _autoInterval = null;
    document.getElementById('autoStopBtn').style.display  = 'none';
    document.getElementById('autoProceedRow').style.display = '';
  }
});

document.getElementById('autoProceedBtn').addEventListener('click', () => {
  _autoClose();
  if (_autoMode === 'isqat') {
    _isqatMothers    = [..._autoChosen];
    _isqatActiveSlot = 0;
    _isqatRenderSlots();
    _isqatRenderGrid();
    _isqatRun();
  } else {
    selectedMothers = [..._autoChosen];
    activeMother = 0;
    runReading();
  }
  _autoMode = 'goral';
});

document.getElementById('autoRestartBtn').addEventListener('click', () => {
  _autoChosen = [null, null, null, null];
  _autoSlot   = 0;
  document.getElementById('autoProceedRow').style.display = 'none';
  document.getElementById('autoStopBtn').style.display    = '';
  document.getElementById('autoStopBtn').disabled         = false;
  _autoRenderMiniSlots();
  _autoSpinIdx = Math.floor(Math.random() * figures.length);
  _autoRenderGlyph();
  if (_autoInterval) clearInterval(_autoInterval);
  _autoInterval = setInterval(() => {
    _autoSpinIdx = (_autoSpinIdx + 1) % figures.length;
    _autoRenderGlyph();
  }, 70);
});

document.getElementById('autoCloseBtn').addEventListener('click', _autoClose);

document.getElementById("backOpenBtn").addEventListener("click", () => showScreen("open"));
document.getElementById("backSelectBtn").addEventListener("click", () => showScreen("select"));
document.getElementById("clearSelectionBtn").addEventListener("click", () => {
  selectedMothers = [null,null,null,null];
  activeMother = 0;
  renderMotherSlots();
  renderFigureGrid();
});

document.getElementById("buildBoardBtn").addEventListener("click", runReading);
document.getElementById("clearBtn").addEventListener("click", () => { clearForm(); fillCurrentDateTime(); });

document.querySelectorAll('.profile-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.profile;
    const val   = btn.dataset.value;
    document.querySelectorAll(`.profile-btn[data-profile="${group}"]`).forEach(b => b.classList.remove('selected'));
    if (profileState[group] === val) {
      profileState[group] = null;
    } else {
      btn.classList.add('selected');
      profileState[group] = val;
    }
  });
});

document.getElementById("archiveBtn").addEventListener("click", () => {
  openMenu(); document.getElementById("menuJournalBtn").click();
});

document.getElementById("clearArchiveBtn").addEventListener("click", () => {
  if (!confirm("למחוק את כל הארכיון?")) return;
  if (window.GORAL_CLIENT_ARCHIVE?.clearGoralArchive) window.GORAL_CLIENT_ARCHIVE.clearGoralArchive();
});

document.getElementById("showKundaliBtn").addEventListener("click", () => {
  const kundaliResult = document.getElementById('kundaliResult');
  const btn = document.getElementById('showKundaliBtn');
  if (!kundaliResult || !window._lastReading) return;

  if (kundaliResult.style.display !== 'none' && kundaliResult.innerHTML) {
    kundaliResult.style.display = 'none';
    btn.textContent = '♐ לוח קונדלי — מפה אסטרולוגית הודית';
    return;
  }

  kundaliResult.innerHTML = buildKundaliHtml(window._lastReading);
  kundaliResult.style.display = 'block';
  btn.textContent = '▲ סגור לוח קונדלי';
  kundaliResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ─── ספר לקוחות ──────────────────────────────────────────────
const CONTACTS_KEY = 'goralClientContacts_v1_' + (sessionStorage.getItem('userId') || 'local');
function getContacts() { return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]'); }

function renderContacts() {
  const el = document.getElementById('contactList');
  if (!el) return;
  const q = (document.getElementById('contactSearch') || {}).value || '';
  const all = getContacts();
  const shown = q ? all.filter(c => c.name.includes(q) || (c.phone && c.phone.includes(q))) : all;
  if (!shown.length) {
    el.innerHTML = `<div style="color:var(--muted,#888);text-align:center;padding:12px">${q ? 'לא נמצאו תוצאות' : 'אין לקוחות בספר עדיין'}</div>`;
    return;
  }
  el.innerHTML = shown.map(c =>
    `<div class="appt-item" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border,#eee)">
      <div><div style="font-weight:600">${escapeHtml(c.name)}</div><div style="font-size:0.85rem;color:var(--muted,#888)">${escapeHtml(c.phone || 'ללא טלפון')}</div></div>
      <div style="display:flex;gap:6px">
        <button class="btn" style="font-size:0.8rem;padding:4px 10px" onclick="loadContact(${c.id})">טען</button>
        <button class="btn gray" style="font-size:0.8rem;padding:4px 10px" onclick="delContact(${c.id})">מחק</button>
      </div>
    </div>`).join('');
}

function addContact() {
  const name = (document.getElementById('newContactName') || {}).value?.trim();
  const phone = (document.getElementById('newContactPhone') || {}).value?.trim();
  if (!name) { alert('נא למלא שם לקוח'); return; }
  const contacts = getContacts();
  const dup = contacts.find(c => c.name === name || (phone && c.phone && c.phone === phone));
  if (dup) {
    if (phone && !dup.phone) { dup.phone = phone; localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts)); }
    renderContacts();
    return alert('לקוח כבר קיים בספר');
  }
  contacts.unshift({ id: Date.now(), name, phone: phone || '', createdAt: new Date().toISOString() });
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  document.getElementById('newContactName').value = '';
  document.getElementById('newContactPhone').value = '';
  renderContacts();
}

function delContact(id) {
  const c = getContacts().filter(c => c.id !== id);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(c));
  renderContacts();
}

function loadContact(id) {
  const contact = getContacts().find(c => c.id === id);
  if (!contact) return;
  const nameEl  = document.getElementById('clientNameInput');
  const phoneEl = document.getElementById('clientPhoneInput');
  if (nameEl)  nameEl.value  = contact.name  || '';
  if (phoneEl) phoneEl.value = contact.phone || '';
  // עדכון כפתורי פרופיל
  profileState.gender   = contact.gender   || null;
  profileState.marital  = contact.marital  || null;
  profileState.work     = contact.work     || null;
  profileState.children = contact.children || null;
  document.querySelectorAll('.profile-btn').forEach(btn => {
    const group = btn.dataset.profile;
    const val   = btn.dataset.value;
    btn.classList.toggle('selected', profileState[group] === val);
  });
  showScreen('open');
}
window.loadContact = loadContact;
window.delContact  = delContact;

document.getElementById('addContactBtn')?.addEventListener('click', addContact);

document.getElementById('saveClientBtn').addEventListener('click', () => {
  const ctx = getClientContext();
  const name = ctx.clientName;
  const phone = ctx.phone;
  if (!name) { alert('אין שם לקוח — מלא שם בפרטי הקריאה'); return; }
  const contacts = getContacts();
  const dup = contacts.find(c => c.name === name || (phone && c.phone && c.phone === phone));
  if (dup) {
    if (phone && !dup.phone) { dup.phone = phone; localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts)); }
    alert(`הלקוח "${name}" כבר קיים בספר הלקוחות`);
    return;
  }
  contacts.unshift({
    id: Date.now(), name, phone: phone || '',
    gender: profileState.gender || null,
    marital: profileState.marital || null,
    work: profileState.work || null,
    children: profileState.children || null,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  alert(`הלקוח "${name}" נשמר בספר הלקוחות ✓`);
});

// ─── Menu Drawer ──────────────────────────────────────────────
function openMenu()  { document.getElementById("menuDrawer").classList.add("open"); document.getElementById("menuOverlay").classList.add("open"); }
function closeMenu() { document.getElementById("menuDrawer").classList.remove("open"); document.getElementById("menuOverlay").classList.remove("open"); }

document.getElementById("menuOpenBtn").addEventListener("click", openMenu);
document.getElementById("menuCloseBtn").addEventListener("click", closeMenu);
document.getElementById("menuOverlay").addEventListener("click", closeMenu);

document.getElementById("menuGoralBtn").addEventListener("click", () => {
  closeMenu(); renderQuestionScreen(); showScreen("question");
});
document.getElementById("menuGuideBtn").addEventListener("click", () => {
  closeMenu(); showScreen("guide"); renderGuide();
});
document.getElementById("menuJournalBtn").addEventListener("click", () => {
  closeMenu(); showScreen("journal"); renderJournal(); renderContacts();
});
document.getElementById("menuPrayerBtn").addEventListener("click", () => {
  closeMenu(); showScreen("prayer");
});
document.getElementById("menuIsqatBtn").addEventListener("click", () => {
  closeMenu(); showScreen("isqat"); _isqatRenderSlots(); _isqatRenderGrid();
});
document.getElementById("menuRamalBtn").addEventListener("click", () => {
  closeMenu(); _loadBook('ramalIframe', 'ramal-shastra.html', 'bookEdit_ramal'); showScreen("ramal");
});
document.getElementById("menuKashfBtn").addEventListener("click", () => {
  closeMenu(); _loadBook('kashfIframe', 'kashf-al-asrar.html', 'bookEdit_kashf'); showScreen("kashf");
});

// ─── עורך ספרים ─────────────────────────────────────────────
function _loadBook(iframeId, srcFile, storageKey) {
  const iframe = document.getElementById(iframeId);
  const uid    = sessionStorage.getItem('userId') || 'local';
  const saved  = localStorage.getItem(storageKey + '_' + uid);
  if (saved) { iframe.removeAttribute('src'); iframe.srcdoc = saved; }
  else        { iframe.removeAttribute('srcdoc'); iframe.src = srcFile; }
}

function _setupBookEditor(iframeId, editBtnId, saveBtnId, storageKey) {
  const editBtn = document.getElementById(editBtnId);
  const saveBtn = document.getElementById(saveBtnId);
  const uid     = sessionStorage.getItem('userId') || 'local';
  const key     = storageKey + '_' + uid;

  editBtn.addEventListener('click', () => {
    const doc = document.getElementById(iframeId).contentDocument;
    if (!doc) return;
    const editing = doc.designMode === 'on';
    doc.designMode      = editing ? 'off' : 'on';
    editBtn.textContent = editing ? '✏️ ערוך' : '↩ סיום עריכה';
    saveBtn.style.display = editing ? 'none' : '';
  });

  saveBtn.addEventListener('click', () => {
    const iframe  = document.getElementById(iframeId);
    const content = iframe.contentDocument?.documentElement?.outerHTML;
    if (!content) return;
    localStorage.setItem(key, content);
    const orig = saveBtn.textContent;
    saveBtn.textContent = '✅ נשמר!';
    setTimeout(() => { saveBtn.textContent = orig; }, 1500);
  });
}

_setupBookEditor('ramalIframe', 'editRamalBtn', 'saveRamalBtn', 'bookEdit_ramal');
_setupBookEditor('kashfIframe', 'editKashfBtn', 'saveKashfBtn', 'bookEdit_kashf');

document.getElementById("backFromGuideBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromJournalBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromPrayerBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromIsqatBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromRamalBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromKashfBtn").addEventListener("click", () => showScreen("landing"));

// ─── ניווט מסך שאלות ──────────────────────────────────────────

document.getElementById("backFromQuestionBtn").addEventListener("click", () => showScreen("landing"));

document.getElementById("continueFromQuestionBtn").addEventListener("click", () => {
  if (!selectedQuestion) return;
  selectedHouseNum = selectedQuestion.houseId;
  selectedTopicId  = selectedQuestion.topicId;
  forcedTopicId    = null;
  const qInput = document.getElementById("questionInput");
  if (qInput && !qInput.value.trim()) qInput.value = selectedQuestion.label;
  renderTopicGrid();
  renderDynamicClientFields();
  showScreen("open");
});

// ─── ספירת מפתוח 7×7 ───────────────────────────────────────────────────
const ISQAT_RESULTS = {
  1: { hebrew: 'אחיזת ג׳ין',        detail: 'אם נשאר 1 — הוא ממוסס/אחוז מן הג׳ין.',                            color: '#7b2fbe', isSpiritual: true  },
  2: { hebrew: 'עין הרע / קנאה',    detail: 'אם נשאר 2 — הוא מקונא, נפגע ממבט, ונפגע עין.',                   color: '#c0392b', isSpiritual: true  },
  3: { hebrew: 'כישוף (אדם עשה)',   detail: 'אם נשאר 3 — הוא מכושף מאדם, ויש פועל/עושה שפועל.',              color: '#8b0000', isSpiritual: true  },
  4: { hebrew: 'מחלת ליחה (בלגם)',  detail: 'אם נשאר 4 — זו מחלת ליחה, מיוחסת למים.',                         color: '#2980b9', isSpiritual: false },
  5: { hebrew: 'מחלת דם גופנית',   detail: 'אם נשאר 5 — זו מחלת דם גופנית, מיוחסת לאוויר.',                  color: '#e74c3c', isSpiritual: false },
  6: { hebrew: 'מרה שחורה',         detail: 'אם נשאר 6 — זו מחלת מרה שחורה גופנית, מיוחסת לעפר.',            color: '#27ae60', isSpiritual: false },
  7: { hebrew: 'מרה צהובה',         detail: 'אם נשאר 7 — זו מחלת מרה צהובה גופנית, מיוחסת לאש.',             color: '#e67e22', isSpiritual: false },
};

let _isqatMothers    = [null, null, null, null];
let _isqatActiveSlot = 0;

function _isqatRenderSlots() {
  const container = document.getElementById('isqatSlots');
  if (!container) return;
  container.innerHTML = _isqatMothers.map((fig, i) => {
    const isActive = i === _isqatActiveSlot;
    const filled   = !!fig;
    return `<button type="button" class="mother-slot${filled ? ' filled' : ''}${isActive ? ' active' : ''}" data-slot="${i}">
      <div style="font-weight:900;font-size:13px;color:#1e2a36">אם ${i + 1}</div>
      ${filled ? glyphHtml(fig.lines) : ''}
      <div style="font-size:11px;color:#5a6a7a;margin-top:2px">${filled ? escapeHtml(fig.name) : 'לחץ לבחירה'}</div>
    </button>`;
  }).join('');
  container.querySelectorAll('.mother-slot').forEach(el => {
    el.addEventListener('click', () => {
      _isqatActiveSlot = Number(el.dataset.slot);
      _isqatRenderSlots();
      _isqatRenderGrid();
    });
  });
  const runBtn = document.getElementById('isqatRunBtn');
  if (runBtn) runBtn.disabled = _isqatMothers.some(m => !m);
}

function _isqatRenderGrid() {
  const grid = document.getElementById('isqatGrid');
  if (!grid) return;
  const currentFig = _isqatMothers[_isqatActiveSlot];
  grid.innerHTML = figures.map(fig => {
    const isSelected = currentFig?.key === fig.key;
    const slotIdx = _isqatMothers.findIndex(m => m?.key === fig.key);
    const isOther = slotIdx !== -1 && slotIdx !== _isqatActiveSlot;
    return `<button type="button"
        class="isqat-pick-btn${isSelected ? ' selected' : ''}${isOther ? ' other-used' : ''}"
        data-key="${escapeHtml(fig.key)}">
      ${glyphHtml(fig.lines)}
      <div class="isqat-pick-name">${escapeHtml(fig.name)}</div>
      ${isOther ? `<div style="font-size:9px;color:#888">אם ${slotIdx + 1}</div>` : ''}
    </button>`;
  }).join('');
  grid.querySelectorAll('.isqat-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fig = figures.find(f => f.key === btn.dataset.key);
      if (!fig) return;
      _isqatMothers[_isqatActiveSlot] = fig;
      let next = _isqatMothers.findIndex((m, i) => !m && i > _isqatActiveSlot);
      if (next === -1) next = _isqatMothers.findIndex(m => !m);
      if (next !== -1) _isqatActiveSlot = next;
      _isqatRenderSlots();
      _isqatRenderGrid();
    });
  });
}

function _isqatRun() {
  if (_isqatMothers.some(m => !m)) return;
  if (typeof window.ramlRunReading !== 'function') {
    alert('מנוע הגורל טרם נטען — נסה שוב בעוד רגע.');
    return;
  }
  const mothers = _isqatMothers.map(m => m.lines);
  const reading = window.ramlRunReading('', mothers);
  const chart   = reading.chart || reading.entries || [];

  // ספירת כל ה-1 ב-16 הצורות
  let openCount = 0;
  for (const house of chart) {
    const key = String(house.key || '');
    for (const ch of key) { if (ch === '1') openCount++; }
  }
  const remainder = ((openCount - 1) % 7) + 1;
  const res       = ISQAT_RESULTS[remainder] || ISQAT_RESULTS[1];
  const typeLabel = res.isSpiritual ? 'פגיעה רוחנית' : 'מחלה גופנית';

  // לוח גורל רגיל
  const boardEl = document.getElementById('isqatBoardResult');
  if (boardEl) boardEl.innerHTML = buildBoardHtml(reading);

  const resultEl = document.getElementById('isqatResultBox');
  if (resultEl) resultEl.innerHTML = `
    <div class="isqat-result-box">
      <div style="text-align:center;margin-bottom:18px">
        <div style="font-size:12px;color:#5a6a7a;margin-bottom:4px">נקודות פתוחות ב-16 הצורות</div>
        <div style="font-size:54px;font-weight:900;color:#071b30;line-height:1">${openCount}</div>
        <div style="font-size:13px;color:#5a6a7a;margin-top:6px">
          ${openCount} ÷ 7 = שאר <strong style="color:#071b30;font-size:20px">${remainder}</strong>
        </div>
      </div>
      <div style="background:${res.color}18;border:2px solid ${res.color};border-radius:10px;padding:16px;text-align:center">
        <div style="font-size:11px;color:${res.color};margin-bottom:6px;letter-spacing:1px;font-weight:700">${typeLabel}</div>
        <div style="font-size:22px;font-weight:900;color:#071b30">${escapeHtml(res.hebrew)}</div>
        <div style="font-size:14px;color:#2a3a4a;margin-top:10px;line-height:1.7">${escapeHtml(res.detail)}</div>
      </div>
    </div>`;

  showScreen('isqat-result');
}

document.getElementById('isqatAutoBtn').addEventListener('click', () => {
  _autoMode = 'isqat';
  _autoOpen();
});
document.getElementById('isqatClearBtn').addEventListener('click', () => {
  _isqatMothers    = [null, null, null, null];
  _isqatActiveSlot = 0;
  _isqatRenderSlots();
  _isqatRenderGrid();
});
document.getElementById('isqatRunBtn').addEventListener('click', _isqatRun);
document.getElementById('backFromIsqatResultBtn').addEventListener('click', () => showScreen('isqat'));


// ─── Guide Tab Logic ──────────────────────────────────────────
document.querySelectorAll(".guide-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".guide-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".guide-section").forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("guide-" + tab.dataset.tab)?.classList.add("active");
    if (tab.dataset.tab === 'kashf') renderKashfBook();
  });
});

// Figure data (fortune, movement group, letters) — source: hawi-figure-letter-extraction.js + raml-foundations
// fortune: טוב=מיטיב, רע=מזיק, ממוזג=בינוני | movement: קבוצה (יוצאת/נכנסת/קבועה/מתהפכת)
// letters: מיפוי תסקין עבדוה מחאוי — אות ראשית + אות משנית (לצורות מתהפכות)
const FIGURE_EXTRA = {
  '1111': { fortune: 'ממוזג',     fClass: 'mixed', movement: 'מתהפכת', letters: ['ע'], gender: 'דו-מיני', gClass: 'neutral', zodiac: 'סרטן',    zodiacPos: 'האבט' },
  '1112': { fortune: 'רע',        fClass: 'nahas', movement: 'יוצאת',  letters: ['ח', 'ם'], gender: 'זכר', gClass: 'male',    zodiac: 'גדי',      zodiacPos: 'סאעד' },
  '1121': { fortune: 'ממוזג',     fClass: 'mixed', movement: 'מתהפכת', letters: ['ט', 'ן'], gender: 'זכר', gClass: 'male',    zodiac: 'מאזניים', zodiacPos: 'גארב' },
  '1122': { fortune: 'טוב',       fClass: 'saad',  movement: 'יוצאת',  letters: ['ה', 'ש'], gender: 'זכר', gClass: 'male',    zodiac: 'אריה',    zodiacPos: 'סאעד' },
  '1211': { fortune: 'ממוזג-רע',  fClass: 'mixed', movement: 'מתהפכת', letters: ['י', 'ף'], gender: 'נקבה', gClass: 'female', zodiac: 'טלה',     zodiacPos: 'טאלע' },
  '1212': { fortune: 'רע',        fClass: 'nahas', movement: 'יוצאת',  letters: ['ל', 'א'], gender: 'זכר', gClass: 'male',    zodiac: 'דלי',     zodiacPos: 'סאעד' },
  '1221': { fortune: 'ממוזג-רע',  fClass: 'mixed', movement: 'מתהפכת', letters: ['נ'], gender: 'דו-מיני', gClass: 'neutral', zodiac: 'גדי',      zodiacPos: 'האבט' },
  '1222': { fortune: 'טוב',       fClass: 'saad',  movement: 'יוצאת',  letters: ['א', 'פ'], gender: 'זכר', gClass: 'male',    zodiac: 'קשת',     zodiacPos: 'טאלע' },
  '2111': { fortune: 'טוב',       fClass: 'saad',  movement: 'נכנסת',  letters: ['ז', 'ך'], gender: 'נקבה', gClass: 'female', zodiac: 'שור',     zodiacPos: 'טאלע' },
  '2112': { fortune: 'ממוזג-טוב', fClass: 'mixed', movement: 'קבועה',  letters: ['ס'], gender: 'דו-מיני', gClass: 'neutral', zodiac: 'תאומים', zodiacPos: 'האבט' },
  '2121': { fortune: 'טוב',       fClass: 'saad',  movement: 'נכנסת',  letters: ['כ', 'ץ'], gender: 'נקבה', gClass: 'female', zodiac: 'אריה',    zodiacPos: 'טאלע' },
  '2122': { fortune: 'רע',        fClass: 'nahas', movement: 'קבועה',  letters: ['ג', 'ק'], gender: 'זכר', gClass: 'male',    zodiac: 'עקרב',    zodiacPos: 'גארב' },
  '2211': { fortune: 'טוב',       fClass: 'saad',  movement: 'נכנסת',  letters: ['ו', 'ת'], gender: 'נקבה', gClass: 'female', zodiac: 'דגים',    zodiacPos: 'גארב' },
  '2212': { fortune: 'טוב',       fClass: 'saad',  movement: 'קבועה',  letters: ['ד', 'ר'], gender: 'נקבה', gClass: 'female', zodiac: 'סרטן',    zodiacPos: 'סאעד' },
  '2221': { fortune: 'רע',        fClass: 'nahas', movement: 'נכנסת',  letters: ['ב', 'צ'], gender: 'נקבה', gClass: 'female', zodiac: 'דלי',     zodiacPos: 'גארב' },
  '2222': { fortune: 'ממוזג',     fClass: 'mixed', movement: 'קבועה',  letters: ['מ'], gender: 'דו-מיני', gClass: 'neutral', zodiac: 'בתולה',   zodiacPos: 'האבט' },
};
const DIR_CLASS = { 'צפון': 'north', 'דרום': 'south', 'מזרח': 'east', 'מערב': 'west' };
const ELEMENT_CLASS = { 'אש': 'fire', 'מים': 'water', 'רוח': 'air', 'עפר': 'earth' };

let guideRendered = false;
function renderGuide() {
  if (guideRendered) return;
  guideRendered = true;
  renderFiguresGuide();
  renderHousesGuide();
  renderBuildGuide();
  renderConceptsGuide();
  renderIsqat7Guide();
}

function renderIsqat7Guide() {
  const el = document.getElementById('guide-isqat7');
  if (!el) return;

  const results = [
    { num: 1, hebrew: 'אחיזת ג׳ין', arabic: 'مس الجن', color: '#7b2fbe', type: 'רוחנית',
      desc: 'השארית 1 מרמזת שהמחלה מקורה בנגיעה של ג׳ין. התסמינים כוללים פחדים לילות, שינוי פתאומי באישיות, חלומות מבעיתים, ומחלה שהרפואה המקובלת אינה מצליחה לאבחן.' },
    { num: 2, hebrew: 'עין הרע / קנאה', arabic: 'العين والحسد', color: '#c0392b', type: 'רוחנית',
      desc: 'השארית 2 מצביעה על פגיעה מעין הרע או קנאה. האדם נפגע ממבט או מחשבה של קנאה. הפגיעה יכולה להגיע ממכר קרוב מבלי שהתכוון לרע.' },
    { num: 3, hebrew: 'כישוף (אדם עשה)', arabic: 'السحر', color: '#8b0000', type: 'רוחנית',
      desc: 'השארית 3 מרמזת על כישוף שאדם עשה בכוונה. מדובר בנזק מכוון — בדרך כלל מצד אויב, יריב, או אדם מקנא.' },
    { num: 4, hebrew: 'מחלת ליחה (בלגם)', arabic: 'مرض البلغم', color: '#2980b9', type: 'גופנית',
      desc: 'השארית 4 מצביעה על עודף ליחה (בלגם) בגוף לפי רפואת החומרים הארבעה. תסמינים: עייפות, כבדות, כיח, בעיות נשימה, ירידה בחיוניות.' },
    { num: 5, hebrew: 'מחלת דם גופנית', arabic: 'مرض الدم', color: '#e74c3c', type: 'גופנית',
      desc: 'השארית 5 מרמזת על בעיה בדם — עודף, חסר, או זיהום. הגוף נמצא תחת לחץ דמי. התסמינים יכולים לכלול חום, דלקות, אדמומיות.' },
    { num: 6, hebrew: 'מרה שחורה', arabic: 'السوداء', color: '#27ae60', type: 'גופנית',
      desc: 'השארית 6 מרמזת על עודף מרה שחורה (ملنخوليا). תסמינים: דיכאון, חרדה, פחדים, בדידות, מחשבות קודרות, קוצר נשימה, כאבי ראש.' },
    { num: 7, hebrew: 'מרה צהובה', arabic: 'الصفراء', color: '#e67e22', type: 'גופנית',
      desc: 'השארית 7 מרמזת על עודף מרה צהובה. תסמינים: כאבי בטן ועיכול, צהבהב בעור, מרירות בפה, כעס וחוסר סבלנות, חום גבוה.' },
  ];

  el.innerHTML = `
    <div style="direction:rtl">
      <div class="concept-card" style="margin-bottom:18px">
        <div class="concept-title">מהי שיטת גורל חולי 7×7?</div>
        <div class="concept-body" style="line-height:1.9">
          שיטה פשוטה לאבחון סיבת מחלה או מצוקה — רוחנית או גופנית — דרך לוח הגורל.
          בסיס השיטה: ספירת הנקודות הבודדות (●) בכל 16 הצורות של הלוח, חלוקה ב-7, והכרעה לפי השארית.
        </div>
      </div>

      <div class="build-step">
        <div class="step-num">1</div>
        <div class="step-body">
          <div class="step-title">הטל 4 אמהות</div>
          <div class="step-desc">בחר 4 צורות ידנית (מהגריד) או לחץ "אוטומטי" לבחירה לפי עצירה. האפליקציה תגזור מהן 16 צורות (אמהות, בנות, נכדות, עדים, דיין, משלים).</div>
        </div>
      </div>

      <div class="build-step">
        <div class="step-num">2</div>
        <div class="step-body">
          <div class="step-title">ספירת הנקודות הבודדות</div>
          <div class="step-desc">
            בכל צורה יש 4 שורות. כל שורה היא <strong>● (נקודה אחת)</strong> או <strong>●● (שתי נקודות)</strong>.
            סופרים רק את השורות עם נקודה <em>אחת בלבד</em> — מכל 16 הצורות יחד.
          </div>
          <div class="step-example">דוגמה: 16 צורות × 4 שורות = 64 שורות. נניח שמתוכן 20 הן נקודה אחת → סה"כ = 20</div>
        </div>
      </div>

      <div class="build-step">
        <div class="step-num">3</div>
        <div class="step-body">
          <div class="step-title">חישוב השארית</div>
          <div class="step-desc">מחשבים: <strong>(סה"כ − 1) ÷ 7</strong> ולוקחים את השארית. השארית תמיד בין 1 ל-7.</div>
          <div class="step-example">דוגמה: (20 − 1) = 19 &nbsp;→&nbsp; 19 ÷ 7 = 2 שארית <strong>5</strong> → מחלת דם גופנית</div>
        </div>
      </div>

      <div class="build-step" style="margin-bottom:22px">
        <div class="step-num">4</div>
        <div class="step-body">
          <div class="step-title">קריאת האבחנה</div>
          <div class="step-desc">השארית (1–7) מורה על סוג הבעיה. ראה טבלת האבחנות למטה.</div>
        </div>
      </div>

      <div class="concept-title" style="margin-bottom:12px;font-size:1rem">טבלת האבחנות — שארית 1 עד 7</div>
      ${results.map(r => `
        <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:12px;background:${r.color}10;border:1.5px solid ${r.color}50;border-radius:12px;padding:12px 14px">
          <div style="min-width:32px;height:32px;border-radius:50%;background:${r.color};color:#fff;font-weight:900;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${r.num}</div>
          <div style="flex:1">
            <div style="font-weight:900;font-size:15px;color:#071b30">${r.hebrew}</div>
            <div style="font-size:12px;color:${r.color};font-weight:700;margin-bottom:4px">${r.arabic} &nbsp;|&nbsp; ${r.type}</div>
            <div style="font-size:13px;color:#3a4e62;line-height:1.7">${r.desc}</div>
          </div>
        </div>`).join('')}

      <div class="concept-card" style="margin-top:18px">
        <div class="concept-title">הערה חשובה</div>
        <div class="concept-body">
          שיטת 7×7 היא כלי אבחון ראשוני בלבד — היא מצביעה על כיוון, לא פוסקת פסיקה מוחלטת.
          יש להשלים את הבנת המצב עם ניתוח מלא של לוח הגורל (עדים, דיין, בית 1 ובית 6).
        </div>
      </div>
    </div>`;
}

function renderFiguresGuide() {
  const el = document.getElementById("guide-figures");
  const forms = window.RAML_FORMS_BASIC || {};
  const cards = FIGURE_ORDER.map(key => {
    const f = forms[key] || {};
    const ex = FIGURE_EXTRA[key] || {};
    const elClass = ELEMENT_CLASS[f.element] || '';
    const dirClass = DIR_CLASS[f.direction] || '';
    const lettersHtml = (ex.letters || []).map(l => `<span class="fig-letter">${escapeHtml(l)}</span>`).join('');
    return `<div class="fig-card">
      ${glyphHtml(linesFromKey(key))}
      <div class="fig-name">${escapeHtml(f.hebrew || key)}</div>
      <div class="fig-arabic">${escapeHtml(f.arabic || '')}</div>
      ${lettersHtml ? `<div class="fig-letters">${lettersHtml}</div>` : ''}
      <div class="fig-badges">
        <span class="badge ${ex.fClass}">${escapeHtml(ex.fortune || '')}</span>
        <span class="badge ${elClass}">${escapeHtml(f.element || '')}</span>
        ${ex.gender ? `<span class="badge gender-${ex.gClass}">${escapeHtml(ex.gender)}</span>` : ''}
        ${f.direction ? `<span class="badge ${dirClass}">${escapeHtml(f.direction)}</span>` : ''}
        ${f.planet ? `<span class="badge planet">${escapeHtml(f.planet)}</span>` : ''}
        ${f.zodiac ? `<span class="badge zodiac">${escapeHtml(f.zodiac)}</span>` : ''}
        <span class="badge group">קבוצה: ${escapeHtml(ex.movement || '')}</span>
      </div>
    </div>`;
  }).join('');
  el.innerHTML = `<div class="figures-grid">${cards}</div>
    <div class="fig-legend">
      <strong>האותיות</strong> (בתיבות כחולות) = אותיות תסקין עבדוה לפי חאוי — לחילוץ שם הנשאל עליו מבית 7 או 9.<br>
      <strong>מין הצורה</strong> (מקור: כשף-אל-אסרר): 🔵 <strong>זכר</strong> (6 צורות) · 🌸 <strong>נקבה</strong> (6 צורות) · ⚪ <strong>דו-מיני (خنثى)</strong> (4 צורות: דרך, סוהר, חיבור, קהלה)<br>
      <strong>מזל:</strong> 🟢 <strong>טוב</strong> = מיטיב &nbsp;|&nbsp; 🔴 <strong>רע</strong> = מזיק &nbsp;|&nbsp; 🟡 <strong>ממוזג</strong> = בינוני<br>
      <strong>קבוצות תנועה:</strong>
      <strong>יוצאת</strong> (خارجة) = משפיעה כלפי חוץ &nbsp;|&nbsp;
      <strong>נכנסת</strong> (داخلة) = משפיעה כלפי פנים &nbsp;|&nbsp;
      <strong>קבועה</strong> (ثابتة) = יציבה &nbsp;|&nbsp;
      <strong>מתהפכת</strong> (منقلبة) = שני פנים<br>
      <strong>יסוד:</strong> 🔴 אש · 💧 מים · 🌬 רוח · 🟤 עפר
      &nbsp;|&nbsp; <strong>כיוון:</strong> 🔵 צפון · 🟠 דרום · 🟢 מזרח · 🟣 מערב<br>
      <strong>כוכב</strong> = הגורם השמימי השולט
      &nbsp;|&nbsp; <strong>מזל</strong> = מזל הגלגל השייך לצורה
    </div>`;
}

function renderHousesGuide() {
  const el = document.getElementById("guide-houses");
  const houses = window.ramlListHousesBasic ? window.ramlListHousesBasic() : [];
  el.innerHTML = '<table class="houses-table"><thead><tr><th>בית</th><th>שם</th><th>תחומים</th></tr></thead><tbody>' +
    houses.map(h => `<tr>
      <td class="house-num-cell">${h.number}</td>
      <td><strong>${escapeHtml(h.hebrew)}</strong><br><span style="font-size:12px;color:#888">${escapeHtml(h.arabic)}</span></td>
      <td>${escapeHtml(h.role)}</td>
    </tr>`).join('') +
    '</tbody></table>';
}

function renderBuildGuide() {
  const el = document.getElementById("guide-build");
  const steps = [
    { title: 'הטלת האמהות', desc: 'מטילים נקודות 4 פעמים. כל שורה נספרת: זוגי = 2 נקודות (●●), אי-זוגי = 1 נקודה (●). מתקבלות 4 אמהות — שורת הלוח הראשונה.' },
    { title: 'יצירת הבנות', desc: 'מחשבים XOR בין שורות האמהות הסמוכות: בת 1 = אם 1 XOR אם 2, בת 2 = אם 2 XOR אם 3, בת 3 = אם 3 XOR אם 4, בת 4 = אם 4 XOR בת 1.', example: 'אם 1=1111, אם 2=2112 → בת 1=1221 (סוהר)' },
    { title: 'יצירת הנכדות', desc: 'מסובבים את הצורות — כל עמודה של 4 שורות הופכת לצורה חדשה. נכדה 1 = שורה 1 של כל 4 האמהות.', example: 'שורה 1 של אמהות 1-4: 1,2,1,2 → 1212 (ממון יוצא)' },
    { title: 'העדים (בתים 13-14)', desc: 'עד 1 (בית 13) = XOR בין בת 1 ובת 2. עד 2 (בית 14) = XOR בין בת 3 ובת 4. העדים מחזקים או מחלישים את הדיין.' },
    { title: 'הדיין (בית 15)', desc: 'הכרעה הסופית של הלוח. מחושב: דיין = XOR(עד 1, עד 2). אם הדיין טוב (מיטיב) — תשובה חיובית. אם רע (מזיק) — שלילית. אם ממוזג — תלוי.' },
    { title: 'המשלים (בית 16)', desc: 'מחושב: משלים = XOR(דיין, בית 1). מורה על אחרית הדבר ועל תוצאת הדין לאורך זמן.' },
  ];
  el.innerHTML = steps.map((s, i) => `
    <div class="build-step">
      <div class="step-num">${i+1}</div>
      <div class="step-body">
        <div class="step-title">${escapeHtml(s.title)}</div>
        <div class="step-desc">${escapeHtml(s.desc)}</div>
        ${s.example ? `<div class="step-example">${escapeHtml(s.example)}</div>` : ''}
      </div>
    </div>`).join('');
}

function renderConceptsGuide() {
  const el = document.getElementById("guide-concepts");
  const concepts = [
    { title: 'הדיין — בית 15', sub: 'הכרעה הסופית', body: 'הדיין בבית 15 הוא "שופט הלוח". צורתו קובעת את התשובה הכוללת. צורה מיטיבה = כן/חיובי, צורה מזיקה = לא/שלילי, ממוזגת = תלוי בעדים. הדיין גובר על הכול — גם אם כל הלוח שלילי, דיין טוב פוסק בחיוב.' },
    { title: 'עדים — בתים 13-14', sub: 'מחזקים או מחלישים את הדיין', body: 'שני העדים (בית 13 ו-14) מחזקים את פסיקת הדיין. אם שניהם מסכימים עם הדיין — הפסיקה ודאית. אם סותרים — הדין מסופק. בית 13 = צד השואל. בית 14 = הדבר הנשאל.' },
    { title: 'גילוי מחשבת השואל', sub: 'מה באמת רוצה השואל', body: 'מחשבת השואל מחושבת דרך גילוי הכוונה הנסתרת — ממאזן ארבעת היסודות: אש, אוויר, מים, עפר. הדרך מכוונת לבית מסוים בלוח המגלה את מחשבת השואל האמיתית — לפעמים שונה משאלתו המוצהרת (כשף אל-אסראר, שער רביעי).' },
    { title: 'השלמת הדבר', sub: 'האם הדבר ייגמר?', body: 'בודקים האם יש חיבור ישיר, עקיף, או בהעברה בין בית 1 (השואל) לבית 7 (הנשאל). חיבור ישיר = הדבר יצא לפועל בוודאות. הגעה בינונית = תלוי גורמים. אין חיבור = הדבר לא ייגמר.' },
    { title: 'חיבור בין הצורות', sub: 'קשרים בין צורות בלוח', body: 'כאשר צורה חוזרת בשני בתים שונים נוצר "חיבור" ביניהם. חיבור בין בית 1 לבית 7 = השואל והנשאל קשורים. חיבור לבית 10 = עניין ציבורי/שלטוני מחובר. סוגי חיבורים: ריבוע, משולש, מול, שישית.' },
    { title: 'תוקף הלוח', sub: 'האם הלוח תקף?', body: 'לוח תקף כאשר צורת בית 1 (השואל) מופיעה בלפחות עוד בית אחד בלוח. אם הצורה מופיעה רק בבית 1 — הלוח חלש ויש לנהוג בזהירות בפרשנות. צורה שחוזרת בבתים 1, 4, 7 ו-10 = לוח חזק מאוד.' },
    { title: 'ספירת נקודות הלוח', sub: 'כוח הלוח הכללי', body: 'ספירת סה"כ הנקודות בלוח (1 = נקודה אחת, 2 = שתי נקודות, לכל שורה). מחלקים ל-4 לבדיקת מחלות, ל-3 לבדיקת ילדים. תוצאה זוגית/אי-זוגית מוסיפה שכבת פרשנות.' },
  ];
  el.innerHTML = concepts.map(c => `
    <div class="concept-card">
      <div class="concept-title">${escapeHtml(c.title)}</div>
      <div class="concept-sub">${escapeHtml(c.sub)}</div>
      <div class="concept-body">${escapeHtml(c.body)}</div>
    </div>`).join('');
}

// ─── Kashf Book Viewer ───────────────────────────────────────
let kashfBookRendered = false;
let kashfCurrentPageIdx = -1;

async function renderKashfBook() {
  if (kashfBookRendered) return;
  const el = document.getElementById('guide-kashf');
  el.innerHTML = '<div style="text-align:center;padding:40px;color:#888;font-size:16px">טוען ספר...</div>';
  try {
    const mod = await import('/goral-hachol/data/sources/kashf-al-asrar/kashf-al-asrar-book.js');
    window._KASHF_BOOK = { toc: mod.KASHF_AL_ASRAR_TOC || [], pages: mod.KASHF_AL_ASRAR_PAGES || [] };
  } catch (e) {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:#c00;font-size:16px">שגיאה בטעינת הספר</div>';
    return;
  }
  kashfBookRendered = true;
  showKashfToc();
}

function showKashfToc() {
  kashfCurrentPageIdx = -1;
  const el = document.getElementById('guide-kashf');
  const toc = window._KASHF_BOOK?.toc || [];
  el.innerHTML = `
    <div class="kashf-toc-header">
      <div class="kashf-toc-main-title">📖 כשף אל-אסרר</div>
      <div class="kashf-toc-subtitle">גילוי הסודות השמורים — תוכן עניינים</div>
    </div>
    ${toc.map(entry => `
      <div class="kashf-toc-item" data-page="${entry.page}">
        <span>${escapeHtml(entry.hebrewTitle)}</span>
        <span class="kashf-toc-page">עמ׳ ${entry.page}</span>
      </div>`).join('')}
  `;
  el.querySelectorAll('.kashf-toc-item').forEach(item => {
    item.addEventListener('click', () => {
      const pageNum = parseInt(item.dataset.page, 10);
      const pages = window._KASHF_BOOK?.pages || [];
      let idx = pages.findIndex(p => p.page === pageNum);
      if (idx < 0) {
        let best = 0, bestDiff = Infinity;
        pages.forEach((p, i) => {
          const diff = Math.abs(p.page - pageNum);
          if (diff < bestDiff) { bestDiff = diff; best = i; }
        });
        idx = best;
      }
      showKashfPage(idx);
    });
  });
}

function showKashfPage(idx) {
  const pages = window._KASHF_BOOK?.pages || [];
  if (!pages.length) return;
  idx = Math.max(0, Math.min(idx, pages.length - 1));
  kashfCurrentPageIdx = idx;
  const p = pages[idx];
  const el = document.getElementById('guide-kashf');
  const prevDis = idx === 0 ? 'disabled' : '';
  const nextDis = idx >= pages.length - 1 ? 'disabled' : '';
  el.innerHTML = `
    <div class="kashf-reader">
      <div class="kashf-reader-nav">
        <button class="btn gray" id="kashfTocBtn">← תוכן עניינים</button>
        <span class="kashf-page-counter">עמוד ${idx + 1} מתוך ${pages.length}</span>
      </div>
      <div class="kashf-page-meta">
        <div class="kashf-page-num">עמ׳ ${p.page} בספר</div>
        <div class="kashf-chapter-title">${escapeHtml(p.chapterHebrew || '')}</div>
      </div>
      <div class="kashf-page-text">${kashfMdToHtml(p.hebrewTranslation || '(אין תרגום לעמוד זה)')}</div>
      <div class="kashf-bottom-nav">
        <button class="btn gray" id="kashfPrevBtn" ${prevDis}>→ הקודם</button>
        <button class="btn gray" id="kashfNextBtn" ${nextDis}>הבא ←</button>
      </div>
    </div>
  `;
  document.getElementById('kashfTocBtn').addEventListener('click', showKashfToc);
  if (idx > 0) document.getElementById('kashfPrevBtn').addEventListener('click', () => showKashfPage(idx - 1));
  if (idx < pages.length - 1) document.getElementById('kashfNextBtn').addEventListener('click', () => showKashfPage(idx + 1));
  el.scrollTop = 0;
}

function kashfMdToHtml(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const out = [];
  let tableRows = [];
  let listItems = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    const dataRows = tableRows.filter(r => !/^\|[\s|:-]+\|$/.test(r));
    const [header, ...body] = dataRows;
    const thCells = header.split('|').slice(1, -1).map(c => `<th>${escapeHtml(c.trim())}</th>`).join('');
    const trRows = body.map(r =>
      `<tr>${r.split('|').slice(1, -1).map(c => `<td>${escapeHtml(c.trim())}</td>`).join('')}</tr>`
    ).join('');
    out.push(`<table><thead><tr>${thCells}</tr></thead><tbody>${trRows}</tbody></table>`);
    tableRows = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    out.push(`<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`);
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|', 1)) {
      flushList();
      tableRows.push(trimmed);
      continue;
    }
    if (tableRows.length) flushTable();

    if (/^[-•]\s+/.test(trimmed)) {
      listItems.push(kashfInline(trimmed.replace(/^[-•]\s+/, '')));
      continue;
    }
    if (listItems.length) flushList();

    if (trimmed === '') { out.push('<br>'); continue; }

    out.push(`<p>${kashfInline(trimmed)}</p>`);
  }

  if (tableRows.length) flushTable();
  if (listItems.length) flushList();
  return out.join('');
}

function kashfInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

// ─── Journal Rendering ────────────────────────────────────────
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('he-IL', { day:'2-digit', month:'2-digit', year:'numeric' }) +
           ' ' + d.toLocaleTimeString('he-IL', { hour:'2-digit', minute:'2-digit' });
  } catch { return iso || ''; }
}

function gradeClass(score) {
  if (!score) return 'neutral';
  const g = score.grade || '';
  if (g === 'positive' || g === 'very-positive') return 'positive';
  if (g === 'negative' || g === 'very-negative') return 'negative';
  return 'neutral';
}

function gradeLabel(score) {
  if (!score) return '';
  const map = { positive: 'חיובי', 'very-positive': 'חיובי מאוד', negative: 'שלילי', 'very-negative': 'שלילי מאוד', neutral: 'ממוזג' };
  return map[score.grade] || score.grade || '';
}

function renderJournal() {
  const el = document.getElementById("journalList");
  const archive = window.GORAL_CLIENT_ARCHIVE?.getGoralArchive?.() || [];
  if (!archive.length) {
    el.innerHTML = '<div class="journal-empty">אין קריאות שמורות עדיין.<br>כל קריאה תישמר כאן אוטומטית.</div>';
    return;
  }
  el.innerHTML = archive.map((rec, idx) => `
    <div class="journal-entry" id="je-${idx}">
      <div class="je-header">
        <div>
          <div class="je-name">${escapeHtml(rec.clientName || 'לא ידוע')}</div>
          <div class="je-topic">${escapeHtml(rec.topicHebrew || rec.topicId || '')}</div>
          <span class="je-grade ${gradeClass(rec.boardScore)}">${gradeLabel(rec.boardScore)}</span>
        </div>
        <div class="je-date">${escapeHtml(formatDate(rec.createdAt))}</div>
      </div>
      <div class="je-detail" id="jd-${idx}">
        <div class="je-question">❓ ${escapeHtml(rec.question || '')}</div>
        <div class="je-conclusion">${escapeHtml((rec.conclusion || '').slice(0, 400))}</div>
        <button class="je-del-btn" data-id="${escapeHtml(rec.id)}">🗑 מחק קריאה זו</button>
      </div>
    </div>`).join('') +
    '<button class="journal-clear-btn" id="journalClearAll">🗑 מחק את כל הארכיון</button>';

  el.querySelectorAll(".journal-entry").forEach((entry, idx) => {
    entry.addEventListener("click", (e) => {
      if (e.target.classList.contains("je-del-btn")) return;
      const detail = document.getElementById("jd-" + idx);
      detail?.classList.toggle("open");
      entry.classList.toggle("expanded");
    });
  });
  el.querySelectorAll(".je-del-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!confirm("למחוק קריאה זו?")) return;
      window.GORAL_CLIENT_ARCHIVE?.deleteGoralArchiveRecord?.(btn.dataset.id);
      renderJournal();
    });
  });
  document.getElementById("journalClearAll")?.addEventListener("click", () => {
    if (!confirm("למחוק את כל הארכיון?")) return;
    window.GORAL_CLIENT_ARCHIVE?.clearGoralArchive?.();
    renderJournal();
  });
}

clearForm();

// מלא תאריך ושעה נוכחיים — חייב להיות אחרי clearForm() שמוחק שדות
function fillCurrentDateTime() {
  const now = new Date();
  const dateEl = document.getElementById('questionDateInput');
  const timeEl = document.getElementById('questionTimeInput');
  if (dateEl) {
    const d = String(now.getDate()).padStart(2, '0');
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    dateEl.value = `${d}/${mo}/${y}`;
  }
  if (timeEl) {
    timeEl.value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  }
  updateCastingTimeAlert();
}
fillCurrentDateTime();
