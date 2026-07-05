const FIGURE_ORDER = [
  "1222", "2121", "1212", "2222",
  "1121", "1221", "2221", "2122",
  "2212", "1122", "2211", "1112",
  "1211", "2111", "2112", "1111"
];

let goralMode = 'hawi'; // 'hawi' | 'kashf'

let selectedMothers = [null, null, null, null];
let activeMother = 0;
let selectedHouseNum = null;  // בית שנבחר (1-12)
let forcedTopicId = null;     // נושא שנקבע בכוח (למשל: בדיקה רוחנית)
let selectedTopicId = null;   // תת-נושא שנבחר ישירות מתוך רשימת תת-נושאים
let profileState = { gender: null, marital: null, work: null, children: null };
let selectedQuestion = null;  // שאלה שנבחרה ממסך השאלות
let _activeHouseFilter = null; // פילטר בית פעיל (null = הכל)

// 12 כרטיסים לפי סדר הבתים. הנושא המדויק נקבע בזמן הריצה לפי השאלה.
// subTopics — אם יש, מוצגים לאחר בחירת הבית; null = ברירת מחדל ישירה.
const TOPIC_CARDS = [
  { house: 1,  title: 'בית החיים',            desc: 'בריאות, גוף, נפש, מצב כללי, מולד',    defaultTopicId: 'foundations',       subTopics: [
    { topicId: 'foundations',   label: 'מצב כללי / שאלה חופשית' },
    { topicId: 'birthNativity', label: 'מולד — גורל האדם' },
  ]},
  { house: 2,  title: 'בית הממון',              desc: 'ממון, רכוש, עסקים, מסחר',              defaultTopicId: 'commerce',          subTopics: null },
  { house: 3,  title: 'בית האחים',             desc: 'אחים, שכנים, קרובים, מכתבים',          defaultTopicId: 'siblings',          subTopics: null },
  { house: 4,  title: 'בית ההורים',            desc: 'הורים, נכסים, ירושה, דברים נסתרים',    defaultTopicId: 'hiddenTreasure',    subTopics: null },
  { house: 5,  title: 'בית הבנים',             desc: 'לידה, הריון, ילדים, שמחה',             defaultTopicId: 'childrenPregnancy', subTopics: null },
  { house: 6,  title: 'בית המחלות',            desc: 'חולי, מצב רפואי, החלמה',               defaultTopicId: 'illness',           subTopics: [
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
  { house: 8,  title: 'בית המוות',              desc: 'מוות, ירושה, פחד גדול, שינוי עמוק',   defaultTopicId: 'deathInheritance',  subTopics: null },
  { house: 9,  title: 'בית הנסיעה',            desc: 'יציאה, נסיעה, ים, דת, רוחניות',        defaultTopicId: 'travel',            subTopics: [
    { topicId: 'travel',               label: 'נסיעה / יציאה' },
    { topicId: 'seaVoyage',            label: 'מסע ים' },
    { topicId: 'missingPerson',        label: 'נעדר בדרך / נוסע שנעלם' },
  ]},
  { house: 10, title: 'בית הכבוד והרוממות',    desc: 'קריירה, שלטון, בעלי סמכות',            defaultTopicId: 'authorityState',    subTopics: [
    { topicId: 'authorityState',       label: 'תפקיד / שלטון / קריירה' },
    { topicId: 'yearlyForecast',       label: 'תחזית שנתית' },
  ]},
  { house: 11, title: 'בית התקווה והמשאלות',  desc: 'חברים, קשרים, תקוות, אהבה',            defaultTopicId: 'loveHate',          subTopics: null },
  { house: 12, title: 'בית האויבים',           desc: 'אויבים נסתרים, מאסר, סכנה',            defaultTopicId: 'enemies',           subTopics: [
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
    { topicId: 'yearlyForecast', kw: ['שנה','תחזית שנתית','עולה','גורל השנה','מה יקרה השנה','השנה הקרובה'] },
    // default: authorityState
  ],
  12: [
    { topicId: 'prisoner',  kw: ['כלא','מאסר','מעצר','עצור','נאסר','כלוא','בית סוהר','שחרור מכלא','תיק פלילי','פלילי'] },
    { topicId: 'fear',      kw: ['פחד','סכנה','מסוכן','איום','מאיים','חרדה','פוחד','מפחד','סכנת חיים'] },
    { topicId: 'spiritualDiagnostics', kw: ['כישוף','עין הרע','שד','רוח רעה','קללה','דיבוק','נגיעה','חרם'] },
    // default: enemies
  ],
};

// מיפוי מזהי נושא של חאוי → מזהי נושא של כשף אל-אסרר
const HAWI_TO_KASHF_TOPIC = {
  foundations:          'generalReading',
  birthNativity:        'generalReading',
  hiddenTreasure:       'relocation',
  childrenPregnancy:    'children',
  spiritualDiagnostics: 'generalReading',
  lostAnimal:           'generalReading',
  seaVoyage:            'travel',
  partnership:          'commerce',
  enemies:              'disputes',
  loveHate:             'marriage',
  yearlyForecast:       'generalReading',
  fear:                 'generalReading',
  // זהות מלאה — אין שינוי:
  illness:              'illness',
  marriage:             'marriage',
  disputes:             'disputes',
  theft:                'theft',
  missingPerson:        'missingPerson',
  deathInheritance:     'deathInheritance',
  travel:               'travel',
  authorityState:       'authorityState',
  prisoner:             'prisoner',
  religion:             'religion',
  commerce:             'commerce',
  siblings:             'siblings',
  money:                'money',
  loan:                 'loan',
  relocation:           'relocation',
  children:             'children',
  completion:           'completion',
  generalReading:       'generalReading',
};

function hawiTopicToKashf(hawiTopicId) {
  return HAWI_TO_KASHF_TOPIC[hawiTopicId] || 'generalReading';
}

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
}

// ─── מסך בחירת שאלה ────────────────────────────────────────────────────────
const SHORT_HOUSE_TITLES = {
  1: 'חיים', 2: 'ממון', 3: 'אחים', 4: 'הורים', 5: 'בנים', 6: 'מחלות',
  7: 'זוגיות', 8: 'מוות', 9: 'נסיעה', 10: 'כבוד', 11: 'תקווה', 12: 'אויבים',
};

// קטגוריות נושא לשיטת חאוי — 12 בתים + תת-נושאים
const HAWI_TOPIC_CATEGORIES = [
  { id: 'foundations',          label: 'מצב כללי',       icon: '⚡' },
  { id: 'marriage',             label: 'זוגיות',          icon: '💍' },
  { id: 'commerce',             label: 'פרנסה וממון',     icon: '💰' },
  { id: 'illness',              label: 'בריאות ומחלה',   icon: '🏥' },
  { id: 'travel',               label: 'נסיעה',           icon: '✈️' },
  { id: 'disputes',             label: 'סכסוך ותביעה',   icon: '⚖️' },
  { id: 'authorityState',       label: 'קריירה ושלטון',  icon: '👑' },
  { id: 'childrenPregnancy',    label: 'ילדים והריון',    icon: '👶' },
  { id: 'spiritualDiagnostics', label: 'אבחון רוחני',    icon: '🔮' },
  { id: 'missingPerson',        label: 'נעדר / גנבה',    icon: '🔍' },
  { id: 'deathInheritance',     label: 'ירושה ומוות',    icon: '📜' },
  { id: 'yearlyForecast',       label: 'תחזית שנתית',    icon: '📅' },
];

// בנק שאלות מפורטות לשיטת חאוי
const HAWI_QUESTION_BANK = [
  // מצב כללי
  { id: 'hawi-q-general-state',    categoryId: 'foundations', topicId: 'foundations',    label: 'מה מצבי הכללי?',                  desc: 'ניתוח כוללני של מצב האדם כרגע' },
  { id: 'hawi-q-general-future',   categoryId: 'foundations', topicId: 'foundations',    label: 'מה יהיה עתידי?',                  desc: 'שאלה פתוחה על העתיד הקרוב' },
  { id: 'hawi-q-birth-nativity',   categoryId: 'foundations', topicId: 'birthNativity',  label: 'קרא את גורל הלידה שלי',           desc: 'לוח מולד — גורל האדם לפי שעת הלידה' },
  { id: 'hawi-q-completion',       categoryId: 'foundations', topicId: 'completion',     label: 'האם העניין יושלם?',               desc: 'שאלה על הצלחה או כישלון של כוונה כלשהי' },

  // זוגיות
  { id: 'hawi-q-marriage-will',    categoryId: 'marriage', topicId: 'marriage',  label: 'האם אתחתן?',                         desc: 'סיכויי נישואין — מתי ועם מי' },
  { id: 'hawi-q-marriage-serious', categoryId: 'marriage', topicId: 'marriage',  label: 'האם הוא/היא מתכוון/ת ברצינות?',     desc: 'בדיקת כוונות הצד השני בזוגיות' },
  { id: 'hawi-q-marriage-state',   categoryId: 'marriage', topicId: 'marriage',  label: 'מה מצב הקשר בינינו?',               desc: 'קריאה כוללת על מצב הזוגיות' },
  { id: 'hawi-q-marriage-divorce', categoryId: 'marriage', topicId: 'marriage',  label: 'האם הגירושין יתקיימו?',             desc: 'שאלה על תהליך פרידה וגירושין' },
  { id: 'hawi-q-love-hate',        categoryId: 'marriage', topicId: 'loveHate',  label: 'האם יש אהבה בינינו?',               desc: 'אהבה, שנאה, רגשות הדדיים בין שני אנשים' },

  // פרנסה וממון
  { id: 'hawi-q-commerce-profit',  categoryId: 'commerce', topicId: 'commerce',     label: 'האם העסק ירוויח?',                desc: 'רווחיות עסק, מכירה, רכישה' },
  { id: 'hawi-q-commerce-deal',    categoryId: 'commerce', topicId: 'commerce',     label: 'האם העסקה תצא לפועל?',           desc: 'ביצוע עסקה ספציפית — קנייה או מכירה' },
  { id: 'hawi-q-loan',             categoryId: 'commerce', topicId: 'loan',         label: 'האם אקבל את ההלוואה בחזרה?',     desc: 'גביית חוב, החזרת הלוואה' },
  { id: 'hawi-q-partnership',      categoryId: 'commerce', topicId: 'partnership',  label: 'האם השותפות תצליח?',             desc: 'בדיקת שותפות עסקית ועמידות החוזה' },

  // בריאות ומחלה
  { id: 'hawi-q-illness-recover',  categoryId: 'illness', topicId: 'illness', label: 'האם החולה יחלים?',           desc: 'שאלה על החלמה ממחלה ועל אורכה' },
  { id: 'hawi-q-illness-origin',   categoryId: 'illness', topicId: 'illness', label: 'מה מקור המחלה?',             desc: 'זיהוי גורם המחלה — גוף, נפש, או השפעה חיצונית' },
  { id: 'hawi-q-illness-danger',   categoryId: 'illness', topicId: 'illness', label: 'האם המחלה מסוכנת?',          desc: 'הערכת חומרת המחלה וסכנת חיים' },

  // נסיעה
  { id: 'hawi-q-travel-go',        categoryId: 'travel', topicId: 'travel',     label: 'האם הנסיעה תצא לפועל?',   desc: 'שאלה על יציאה לדרך' },
  { id: 'hawi-q-travel-safe',      categoryId: 'travel', topicId: 'travel',     label: 'האם הנסיעה תהיה בטוחה?', desc: 'בטיחות בדרך — סכנה, בריאות, הצלחה' },
  { id: 'hawi-q-sea-voyage',       categoryId: 'travel', topicId: 'seaVoyage',  label: 'נסיעת ים — האם תצליח?',  desc: 'שאלה ספציפית על מסע בים' },

  // סכסוך ותביעה
  { id: 'hawi-q-disputes-win',     categoryId: 'disputes', topicId: 'disputes', label: 'מי ינצח בסכסוך?',          desc: 'בדיקת עמדות הצדדים — מי גובר' },
  { id: 'hawi-q-disputes-court',   categoryId: 'disputes', topicId: 'disputes', label: 'מה יהיה פסק הדין?',        desc: 'תוצאת הליך משפטי או גישור' },
  { id: 'hawi-q-enemies',          categoryId: 'disputes', topicId: 'enemies',   label: 'מי האויב שמזיק לי?',       desc: 'זיהוי אויב נסתר או גורם מזיק' },
  { id: 'hawi-q-prisoner',         categoryId: 'disputes', topicId: 'prisoner',  label: 'האם האסיר ישתחרר?',       desc: 'שאלה על שחרור ממאסר' },
  { id: 'hawi-q-fear',             categoryId: 'disputes', topicId: 'fear',      label: 'האם הסכנה תעבור?',        desc: 'פחד, איום, סכנת חיים' },

  // קריירה ושלטון
  { id: 'hawi-q-authority-get',    categoryId: 'authorityState', topicId: 'authorityState', label: 'האם אקבל את התפקיד?',       desc: 'קבלת משרה, קידום, מינוי' },
  { id: 'hawi-q-authority-keep',   categoryId: 'authorityState', topicId: 'authorityState', label: 'האם אשמור על תפקידי?',      desc: 'שמירה על עמדת כוח קיימת' },
  { id: 'hawi-q-authority-rival',  categoryId: 'authorityState', topicId: 'authorityState', label: 'מי יגבר — אני או המתחרה?',  desc: 'תחרות על תפקיד או עמדת השפעה' },

  // ילדים והריון
  { id: 'hawi-q-child-born',        categoryId: 'childrenPregnancy', topicId: 'childrenPregnancy', label: 'האם יהיה לי ילד מאישה זו?', desc: 'השאלה הבסיסית בפרק — הל יכון לה ולד מן הדה אלמראה' },
  { id: 'hawi-q-child-gender',     categoryId: 'childrenPregnancy', topicId: 'childrenPregnancy', label: 'האם הוולד זכר או נקבה?',     desc: 'קביעת מין הוולד לפי הצורות בלוח' },
  { id: 'hawi-q-child-months',     categoryId: 'childrenPregnancy', topicId: 'childrenPregnancy', label: 'כמה חודשי הריון עברו?',      desc: 'ספירת חודשי הריון לפי שיטת הספר' },

  // אבחון רוחני
  { id: 'hawi-q-spirit-evil-eye',  categoryId: 'spiritualDiagnostics', topicId: 'spiritualDiagnostics', label: 'האם יש עין הרע?',         desc: 'בדיקת עין הרע וקנאה' },
  { id: 'hawi-q-spirit-sorcery',   categoryId: 'spiritualDiagnostics', topicId: 'spiritualDiagnostics', label: 'האם יש כישוף?',           desc: 'בדיקת נזק ממין כישוף ואחיזה' },
  { id: 'hawi-q-spirit-jinn',      categoryId: 'spiritualDiagnostics', topicId: 'spiritualDiagnostics', label: 'האם יש השפעת ג׳ין?',      desc: 'בדיקת אחיזה רוחנית' },
  { id: 'hawi-q-spirit-general',   categoryId: 'spiritualDiagnostics', topicId: 'spiritualDiagnostics', label: 'אבחון רוחני כללי',        desc: 'זיהוי מקור הבעיה — כשף, עין, ג׳ין' },

  // נעדר / גנבה
  { id: 'hawi-q-missing-return',   categoryId: 'missingPerson', topicId: 'missingPerson',   label: 'האם הנעדר יחזור?',              desc: 'שאלה על חזרת נעדר' },
  { id: 'hawi-q-missing-alive',    categoryId: 'missingPerson', topicId: 'missingPerson',   label: 'האם הנעדר חי?',                 desc: 'בדיקת מצב הנעדר — חי, מת, תקוע' },
  { id: 'hawi-q-theft-who',        categoryId: 'missingPerson', topicId: 'theft',            label: 'מי הגנב?',                      desc: 'זיהוי הגנב — תיאורו ומיקומו' },
  { id: 'hawi-q-theft-found',      categoryId: 'missingPerson', topicId: 'theft',            label: 'האם הגנוב יחזור?',              desc: 'סיכויי שחזור החפץ הגנוב' },
  { id: 'hawi-q-hidden-treasure',  categoryId: 'missingPerson', topicId: 'hiddenTreasure',  label: 'האם יש אוצר נסתר?',            desc: 'חיפוש אוצר, כסף נסתר, מים תת-קרקעיים' },

  // ירושה ומוות
  { id: 'hawi-q-death-when',       categoryId: 'deathInheritance', topicId: 'deathInheritance', label: 'האם החולה בסכנת מוות?',      desc: 'שאלה רגישה על מצב החולה הקשה' },
  { id: 'hawi-q-inheritance-who',  categoryId: 'deathInheritance', topicId: 'deathInheritance', label: 'מי יירש?',                   desc: 'חלוקת ירושה ועיזבון' },
  { id: 'hawi-q-inheritance-amt',  categoryId: 'deathInheritance', topicId: 'deathInheritance', label: 'כמה ירושה יישאר?',          desc: 'גודל העיזבון שיישאר לאחר הפטירה' },

  // תחזית שנתית
  { id: 'hawi-q-yearly-general',   categoryId: 'yearlyForecast', topicId: 'yearlyForecast', label: 'מה השנה הקרובה תביא?',         desc: 'תחזית שנתית כוללת — בריאות, ממון, אירועים' },
  { id: 'hawi-q-yearly-prices',    categoryId: 'yearlyForecast', topicId: 'yearlyForecast', label: 'מה יהיה עם המחירים?',          desc: 'עליית מחירים, יוקר המחיה, כלכלה' },
  { id: 'hawi-q-yearly-weather',   categoryId: 'yearlyForecast', topicId: 'yearlyForecast', label: 'מה יהיה מזג האוויר?',          desc: 'תחזית גשם, בצורת, שפע' },
];

// משתנה לשמירת נושא חאוי שנבחר במסך השאלה
let _hawiSelectedTopic = null;
let _hawiSelectedQuestion = null;

function renderQuestionScreen() {
  // עדכן כותרת המסך לפי המצב הנוכחי
  const headerEl = document.querySelector('#screen-question .qscreen-header h2');
  const subtitleEl = document.querySelector('#screen-question .qscreen-subtitle');
  if (headerEl) headerEl.textContent = goralMode === 'hawi' ? 'גורל החול — שיטת חאוי' : 'גורל החול — שיטת כשף אל-אסרר';
  if (subtitleEl) subtitleEl.textContent = goralMode === 'hawi' ? 'בחר קטגוריה ולאחר מכן שאלה ספציפית' : 'לחץ על בית לסינון';

  if (goralMode === 'hawi') {
    _renderHawiTopicScreen();
  } else {
    _renderKashfQuestionScreen();
  }
}

function _renderHawiTopicScreen() {
  // ── שורת קטגוריות (במקום כפתורי בתים) ──
  const houseEl = document.getElementById('qhouseGrid');
  if (houseEl) {
    houseEl.className = 'qhouse-grid hawi-cat-grid';
    houseEl.innerHTML = HAWI_TOPIC_CATEGORIES.map(cat => {
      const isActive = _hawiSelectedTopic === cat.id;
      return `<button type="button" class="qhouse-btn hawi-cat-btn${isActive ? ' active' : ''}" data-catid="${cat.id}">
        <span class="qhouse-num">${cat.icon}</span>
        <span class="qhouse-title">${escapeHtml(cat.label)}</span>
      </button>`;
    }).join('');

    houseEl.querySelectorAll('.hawi-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.catid;
        _hawiSelectedTopic = _hawiSelectedTopic === cid ? null : cid;
        _hawiSelectedQuestion = null;
        _renderHawiTopicScreen();
      });
    });
  }

  // ── רשימת שאלות לקטגוריה שנבחרה ──
  const gridEl = document.getElementById('qcardGrid');
  if (gridEl) {
    if (!_hawiSelectedTopic) {
      gridEl.innerHTML = `<div class="qcard-empty">בחר קטגוריה למעלה כדי לראות את השאלות</div>`;
    } else {
      const questions = HAWI_QUESTION_BANK.filter(q => q.categoryId === _hawiSelectedTopic);
      if (questions.length === 0) {
        gridEl.innerHTML = `<div class="qcard-empty">אין שאלות לקטגוריה זו</div>`;
      } else {
        gridEl.innerHTML = questions.map(q => {
          const isSelected = _hawiSelectedQuestion && _hawiSelectedQuestion.id === q.id;
          return `<button type="button"
            class="qcard${isSelected ? ' selected' : ''}"
            data-qid="${q.id}">
            <div class="qcard-body">
              <span class="qcard-label">${escapeHtml(q.label)}</span>
              ${q.desc ? `<span class="qcard-desc">${escapeHtml(q.desc)}</span>` : ''}
            </div>
          </button>`;
        }).join('');

        gridEl.querySelectorAll('.qcard').forEach(btn => {
          btn.addEventListener('click', () => {
            const qid = btn.dataset.qid;
            _hawiSelectedQuestion = HAWI_QUESTION_BANK.find(q => q.id === qid) || null;
            _renderHawiTopicScreen();
          });
        });
      }
    }
  }

  const contBtn = document.getElementById('continueFromQuestionBtn');
  if (contBtn) {
    contBtn.disabled = !_hawiSelectedQuestion;
    contBtn.textContent = _hawiSelectedQuestion ? 'המשך ←' : 'בחר שאלה תחילה';
  }
}

function _renderKashfQuestionScreen() {
  const bank = window.QUESTION_BANK || [];
  const cats = window.QUESTION_CATEGORIES || [];
  const catMap = {};
  cats.forEach(c => { catMap[c.id] = c; });

  // ── כפתורי 12 בתים (2 שורות × 6) ──
  const houseEl = document.getElementById('qhouseGrid');
  if (houseEl) {
    houseEl.className = 'qhouse-grid';
    houseEl.innerHTML = TOPIC_CARDS.map(card => {
      const isActive = _activeHouseFilter === card.house;
      return `<button type="button" class="qhouse-btn${isActive ? ' active' : ''}" data-house="${card.house}">
        <span class="qhouse-num">${card.house}</span>
        <span class="qhouse-title">${SHORT_HOUSE_TITLES[card.house] || card.title}</span>
      </button>`;
    }).join('');

    houseEl.querySelectorAll('.qhouse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const h = Number(btn.dataset.house);
        _activeHouseFilter = _activeHouseFilter === h ? null : h;
        _renderKashfQuestionScreen();
      });
    });
  }

  const filtered = _activeHouseFilter === null
    ? []
    : bank.filter(q => q.houseId === _activeHouseFilter);

  const gridEl = document.getElementById('qcardGrid');
  if (gridEl) {
    if (_activeHouseFilter === null) {
      gridEl.innerHTML = `<div class="qcard-empty">לחץ על אחד מ-12 הבתים למעלה כדי לראות את השאלות הרלוונטיות</div>`;
    } else if (filtered.length === 0) {
      gridEl.innerHTML = `<div class="qcard-empty">אין שאלות לבית זה</div>`;
    } else {
      gridEl.innerHTML = filtered.map(q => {
        const cat = catMap[q.category] || {};
        const isSelected = selectedQuestion && selectedQuestion.id === q.id;
        return `<button type="button"
          class="qcard${isSelected ? ' selected' : ''}"
          data-qid="${q.id}"
          style="border-color:${isSelected ? 'var(--navy)' : (cat.border || '#ccc')}">
          <div class="qcard-body">
            <span class="qcard-label">${escapeHtml(q.label)}</span>
            ${q.desc ? `<span class="qcard-desc">${escapeHtml(q.desc)}</span>` : ''}
          </div>
          <span class="qcard-badge">בית ${q.houseId}</span>
        </button>`;
      }).join('');

      gridEl.querySelectorAll('.qcard').forEach(btn => {
        btn.addEventListener('click', () => {
          const qid = btn.dataset.qid;
          selectedQuestion = bank.find(q => q.id === qid) || null;
          _renderKashfQuestionScreen();
        });
      });
    }
  }

  const contBtn = document.getElementById('continueFromQuestionBtn');
  if (contBtn) {
    contBtn.disabled = !selectedQuestion;
    contBtn.textContent = 'המשך עם שאלה זו ←';
  }
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
  'עולה': { label: 'עולה ↑',  cls: 'kp-rising'   },
  'מצליח': { label: 'מצליח ✦', cls: 'kp-fortunate' },
  'שוקע': { label: 'שוקע ↓',  cls: 'kp-setting'   },
  'יורד': { label: 'יורד ⬇',  cls: 'kp-falling'   },
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
      <div class="kundali-interpretations">
        <h4 class="kundali-interp-title">פרשנות בתים — מקור: קומילה סטון, יסודות האסטרולוגיה הוֶדית (עמ' 102–139)</h4>
        ${Array.from({length: 12}, (_, i) => i + 1).map(houseNum => {
          const entry = getHouse(houseNum);
          if (!entry) return '';
          const ex = FIGURE_EXTRA[entry.key] || {};
          const vedic = VEDIC_HOUSE_INFO[houseNum] || {};
          const zodiac = ex.zodiac || '';
          const zodSym = ZODIAC_SYM[zodiac] || '';
          const interpData = window.VEDIC_SIGN_IN_HOUSE;
          const interp = interpData && interpData[houseNum] && zodiac ? (interpData[houseNum][zodiac] || '') : '';
          if (!interp) return '';
          return `
            <div class="kundali-interp-card">
              <div class="kundali-interp-card-header">
                <span class="kundali-interp-house-num">בית ${houseNum}</span>
                <span class="kundali-interp-vedic-name">${escapeHtml(vedic.heb || '')}</span>
                <span class="kundali-interp-zodiac">${zodSym} ${escapeHtml(zodiac)}</span>
              </div>
              <p class="kundali-interp-text">${escapeHtml(interp)}</p>
            </div>
          `;
        }).join('')}
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

      <div class="board-row r4">
        ${houseHtml(h(15), "15 — דיין", d(15), false)}
        ${houseHtml(h(16), "16 — משלים", d(16), false)}
      </div>
    </article>
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
  // Only show spiritual section when explicitly spiritual topic
  const showSpiritual = spiritual && isSpiritualTopic;
  // Never show witchcraft/spiritual diagnosis bleedthrough on non-spiritual topics —
  // showing witchcraft accusations on a house-sale or job question is harmful
  const showSpiritualBleedthrough = false;

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
      .replace(/ממוזג-?מיטיב/g, "ממוזג-טוב")
      .replace(/ממוזג-?מזיק/g, "ממוזג-רע")
      .replace(/\[מיטיב\]/g, "[טוב]")
      .replace(/\[מזיק\]/g, "[רע]")
      .replace(/ מיטיב(?=[^א-ת]|$)/g, " טוב")
      .replace(/ מזיק(?=[^א-ת]|$)/g, " רע");
  }

  function hebrewTermsSimple(s) {
    return String(s || '')
      .replace(/ממוזג-?מיטיב/g, "ממוזג-טוב")
      .replace(/ממוזג-?מזיק/g, "ממוזג-רע")
      .replace(/מיטיב/g, "טוב")
      .replace(/מזיק/g, "רע");
  }

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
    ${shortVerdictHtml}
    ${clientReadingHtml}
    <button class="details-toggle" onclick="const p=this.nextElementSibling;p.hidden=!p.hidden;this.textContent=p.hidden?'קרא עוד ▼':'סגור ▲'">קרא עוד ▼</button>
    <div hidden>${detailsContent}</div>
    <div class="board-tools-row" style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap; direction:rtl; align-items:center;">
      <button type="button" onclick="window.showTimingTool(this)" style="background:#1a3a5c; color:#f0d060; border:none; border-radius:6px; padding:8px 16px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; white-space:nowrap;">⏱ עיתוי</button>
      <button type="button" onclick="window.showBoardCompleteness(this)" style="background:#1a3a5c; color:#f0d060; border:none; border-radius:6px; padding:8px 16px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; white-space:nowrap;">📊 שלמות הלוח</button>
      <button type="button" onclick="window.boardGoBack()" class="btn gray" style="font-size:13px; padding:8px 14px; white-space:nowrap; color:#111 !important;">חזרה לבחירת אמהות</button>
      <button type="button" onclick="window.boardOpenArchive()" class="btn primary" style="font-size:13px; padding:8px 14px; white-space:nowrap; color:#111 !important;">ארכיון קריאות</button>
      <button type="button" onclick="window.boardSaveClient()" class="btn gray" style="font-size:13px; padding:8px 14px; white-space:nowrap; color:#111 !important;">👤 שמור לקוח</button>
      <button type="button" onclick="window.boardClearArchive()" class="btn gray" style="font-size:13px; padding:8px 14px; white-space:nowrap; color:#111 !important;">נקה ארכיון</button>
      <button type="button" onclick="window.boardToggleKundali(this)" class="btn gray" style="font-size:13px; padding:8px 14px; white-space:nowrap; color:#111 !important;">♐ לוח קונדלי</button>
    </div>
    <div id="timingToolPanel" hidden style="direction:rtl; margin-top:10px; background:#f5f8ff; border:1px solid #1a3a5c; border-radius:8px; padding:16px 18px; font-size:14px; line-height:1.9;"></div>
    <div id="boardCompletenessPanel" hidden style="direction:rtl; margin-top:10px; background:#f5f8ff; border:1px solid #1a3a5c; border-radius:8px; padding:16px 18px; font-size:14px; line-height:1.9;"></div>
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

window.showBoardCompleteness = function(btn) {
  const panel = document.getElementById('boardCompletenessPanel');
  if (!panel) return;
  if (!panel.hidden) { panel.hidden = true; btn.textContent = '📊 שלמות הלוח'; return; }

  const bScore = window.__LAST_GORAL_INTERPRETATION?.boardAnalysis?.boardScore || null;

  if (!bScore) {
    panel.innerHTML = '<em>אין נתוני לוח זמינים.</em>';
    panel.hidden = false;
    return;
  }

  const statusIcon = bScore.isComplete ? '✅' : '⚠';
  const statusColor = bScore.isComplete ? '#1a5c2a' : '#7a2020';
  const statusBg = bScore.isComplete ? '#eaffea' : '#fff0f0';

  panel.innerHTML = `
    <div style="font-weight:700; font-size:13px; color:#1a3a5c; margin-bottom:10px; border-bottom:1px solid #c8d8f0; padding-bottom:6px;">📊 שלמות הלוח — חשבון 96 הנקודות</div>
    <div style="background:${statusBg}; border:1px solid ${statusColor}; border-radius:6px; padding:10px 14px; margin-bottom:10px;">
      <span style="font-size:16px; font-weight:700; color:${statusColor};">${statusIcon} ${escapeHtml(bScore.status)}</span>
      <span style="font-size:14px; color:${statusColor}; margin-right:10px;">(${bScore.score} נקודות)</span>
    </div>
    <div style="font-size:13px; color:#333; line-height:1.8;">
      <div>שורות בודדות (1 נקודה): <strong>${bScore.singleRows}</strong></div>
      <div>שורות זוגיות (2 נקודות): <strong>${bScore.doubleRows}</strong></div>
      <div>סה"כ נקודות: <strong>${bScore.score}</strong> מתוך 128</div>
    </div>
    <div style="margin-top:10px; font-size:12px; color:#555; border-top:1px solid #e0e8f5; padding-top:8px;">${escapeHtml(bScore.hebrewSummary)}</div>
    <div style="margin-top:6px; font-size:11px; color:#999;">מקור: ספר הקול הכולל בחכמת גורל החול — פרק שלמות הלוח (96 נקודות)</div>
  `;
  panel.hidden = false;
  btn.textContent = '📊 שלמות הלוח ▲';
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
    if (goralMode !== 'kashf' && window.HAWI_INTERPRETER?.interpretHawiQuestionInitial) {
      reading._precomputedInsight = window.HAWI_INTERPRETER.interpretHawiQuestionInitial(reading.question, reading);
    }

    // ── ענף כשף אל-אסרר ─────────────────────────────────────────────────────
    if (goralMode === 'kashf') {
      if (window.__KASHF_MODULE_READY) await window.__KASHF_MODULE_READY;
      if (!window.KASHF_ENGINE?.buildKashfReading) {
        throw new Error("מנוע כשף אל-אסרר לא נטען. נסה לרענן את הדף.");
      }

      const hawiTopicId = resolvedTopicId ?? 'generalReading';
      const kashfTopicId = hawiTopicToKashf(hawiTopicId);

      // reading.chart already has {houseNumber, pattern, hebrewName} in house-order
      const kashfBoard = {
        entries: reading.chart,
        boardValidation: reading.boardValidation || { isValid: true, warnings: [] },
      };

      const _ctx = getClientContext(resolvedTopicId ?? reading.topicId);
      const clientCtx = {
        name:     _ctx.clientName || '',
        question: question,
        age:      _ctx.age || '',
        gender:   _ctx.gender || '',
      };

      const kashfReading = window.KASHF_ENGINE.buildKashfReading(kashfBoard, kashfTopicId, clientCtx);
      const kashfHtml = window.KASHF_ENGINE.writeKashfReading(kashfReading);

      const outputEl = document.getElementById("kashfReadingOutput");
      if (outputEl) outputEl.innerHTML = buildBoardHtml(reading) + kashfHtml;

      window._lastReading = reading;
      window._lastKashfReading = kashfReading;
      showScreen("kashf-reading");
      return;
    }

    // ── ענף חאוי (ברירת מחדל) ───────────────────────────────────────────────
    boardResult.innerHTML = buildBoardHtml(reading) + buildInterpretationHtml(reading);
    window._lastReading = reading;
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
  _hawiSelectedTopic = null;
  _hawiSelectedQuestion = null;
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
document.getElementById("backFromOpenBtn").addEventListener("click", () => showScreen("question"));
window.boardGoBack = () => showScreen("select");
document.getElementById("backSelectBtn")?.addEventListener("click", () => showScreen("select"));
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

window.boardOpenArchive = () => { openMenu(); document.getElementById("menuJournalBtn").click(); };
window.boardClearArchive = () => {
  if (!confirm("למחוק את כל הארכיון?")) return;
  if (window.GORAL_CLIENT_ARCHIVE?.clearGoralArchive) window.GORAL_CLIENT_ARCHIVE.clearGoralArchive();
};
window.boardToggleKundali = () => {
  if (!window._lastReading) return;
  const content = document.getElementById('kundaliScreenContent');
  if (content) content.innerHTML = buildKundaliHtml(window._lastReading);
  showScreen("kundali");
};

document.getElementById("showKundaliBtn").addEventListener("click", () => {
  if (!window._lastReading) return;
  const content = document.getElementById('kundaliScreenContent');
  if (content) content.innerHTML = buildKundaliHtml(window._lastReading);
  showScreen("kundali");
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

window.boardSaveClient = () => {
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
};

// ─── Menu Drawer ──────────────────────────────────────────────
function openMenu()  { document.getElementById("menuDrawer").classList.add("open"); document.getElementById("menuOverlay").classList.add("open"); }
function closeMenu() { document.getElementById("menuDrawer").classList.remove("open"); document.getElementById("menuOverlay").classList.remove("open"); }

document.getElementById("menuOpenBtn").addEventListener("click", openMenu);
document.getElementById("menuCloseBtn").addEventListener("click", closeMenu);
document.getElementById("menuOverlay").addEventListener("click", closeMenu);

document.getElementById("menuGoralHawiBtn").addEventListener("click", () => {
  goralMode = 'hawi'; closeMenu(); renderQuestionScreen(); showScreen("question");
});
document.getElementById("menuGoralKashfBtn").addEventListener("click", () => {
  goralMode = 'kashf'; closeMenu(); renderQuestionScreen(); showScreen("question");
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
document.getElementById("menuKomillaBtn").addEventListener("click", () => {
  closeMenu(); _loadBook('komillaIframe', 'goral-hachol/data/sources/komilla/komilla-vedic-astrology.html', 'bookEdit_komilla'); showScreen("komilla");
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
_setupBookEditor('komillaIframe', 'editKomillaBtn', 'saveKomillaBtn', 'bookEdit_komilla');

document.getElementById("backFromKomillaBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromKundaliBtn").addEventListener("click", () => showScreen("board"));

document.getElementById("backFromGuideBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromJournalBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromPrayerBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromIsqatBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromRamalBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromKashfBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromKashfGoralBtn").addEventListener("click", () => showScreen("landing"));
document.getElementById("backFromKashfReadingBtn").addEventListener("click", () => showScreen("question"));
document.getElementById("openKashfBookFromGoralBtn").addEventListener("click", () => {
  _loadBook('kashfIframe', 'kashf-al-asrar.html', 'bookEdit_kashf'); showScreen("kashf");
});

// ─── ניווט מסך שאלות ──────────────────────────────────────────

document.getElementById("backFromQuestionBtn").addEventListener("click", () => showScreen("landing"));

document.getElementById("continueFromQuestionBtn").addEventListener("click", () => {
  if (goralMode === 'hawi') {
    if (!_hawiSelectedQuestion) return;
    selectedTopicId = _hawiSelectedQuestion.topicId;
    selectedHouseNum = null;
    forcedTopicId = null;
    selectedQuestion = null;
    renderTopicGrid();
    renderDynamicClientFields();
    showScreen("open");
  } else {
    if (!selectedQuestion) return;
    selectedHouseNum = selectedQuestion.houseId;
    selectedTopicId  = selectedQuestion.topicId;
    forcedTopicId    = null;
    renderTopicGrid();
    renderDynamicClientFields();
    showScreen("open");
  }
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
  '1111': { fortune: 'ממוזג',     fClass: 'mixed', movement: 'מתהפכת', letters: ['ע'], gender: 'דו-מיני', gClass: 'neutral', zodiac: 'סרטן',    zodiacPos: 'יורד' },
  '1112': { fortune: 'רע',        fClass: 'nahas', movement: 'יוצאת',  letters: ['ח', 'ם'], gender: 'זכר', gClass: 'male',    zodiac: 'גדי',      zodiacPos: 'מצליח' },
  '1121': { fortune: 'ממוזג',     fClass: 'mixed', movement: 'מתהפכת', letters: ['ט', 'ן'], gender: 'זכר', gClass: 'male',    zodiac: 'מאזניים', zodiacPos: 'שוקע' },
  '1122': { fortune: 'טוב',       fClass: 'saad',  movement: 'יוצאת',  letters: ['ה', 'ש'], gender: 'זכר', gClass: 'male',    zodiac: 'אריה',    zodiacPos: 'מצליח' },
  '1211': { fortune: 'ממוזג-רע',  fClass: 'mixed', movement: 'מתהפכת', letters: ['י', 'ף'], gender: 'נקבה', gClass: 'female', zodiac: 'טלה',     zodiacPos: 'עולה' },
  '1212': { fortune: 'רע',        fClass: 'nahas', movement: 'יוצאת',  letters: ['ל', 'א'], gender: 'זכר', gClass: 'male',    zodiac: 'דלי',     zodiacPos: 'מצליח' },
  '1221': { fortune: 'ממוזג-רע',  fClass: 'mixed', movement: 'מתהפכת', letters: ['נ'], gender: 'דו-מיני', gClass: 'neutral', zodiac: 'גדי',      zodiacPos: 'יורד' },
  '1222': { fortune: 'טוב',       fClass: 'saad',  movement: 'יוצאת',  letters: ['א', 'פ'], gender: 'זכר', gClass: 'male',    zodiac: 'קשת',     zodiacPos: 'עולה' },
  '2111': { fortune: 'טוב',       fClass: 'saad',  movement: 'נכנסת',  letters: ['ז', 'ך'], gender: 'נקבה', gClass: 'female', zodiac: 'שור',     zodiacPos: 'עולה' },
  '2112': { fortune: 'ממוזג-טוב', fClass: 'mixed', movement: 'קבועה',  letters: ['ס'], gender: 'דו-מיני', gClass: 'neutral', zodiac: 'תאומים', zodiacPos: 'יורד' },
  '2121': { fortune: 'טוב',       fClass: 'saad',  movement: 'נכנסת',  letters: ['כ', 'ץ'], gender: 'נקבה', gClass: 'female', zodiac: 'אריה',    zodiacPos: 'עולה' },
  '2122': { fortune: 'רע',        fClass: 'nahas', movement: 'קבועה',  letters: ['ג', 'ק'], gender: 'זכר', gClass: 'male',    zodiac: 'עקרב',    zodiacPos: 'שוקע' },
  '2211': { fortune: 'טוב',       fClass: 'saad',  movement: 'נכנסת',  letters: ['ו', 'ת'], gender: 'נקבה', gClass: 'female', zodiac: 'דגים',    zodiacPos: 'שוקע' },
  '2212': { fortune: 'טוב',       fClass: 'saad',  movement: 'קבועה',  letters: ['ד', 'ר'], gender: 'נקבה', gClass: 'female', zodiac: 'סרטן',    zodiacPos: 'מצליח' },
  '2221': { fortune: 'רע',        fClass: 'nahas', movement: 'נכנסת',  letters: ['ב', 'צ'], gender: 'נקבה', gClass: 'female', zodiac: 'דלי',     zodiacPos: 'שוקע' },
  '2222': { fortune: 'ממוזג',     fClass: 'mixed', movement: 'קבועה',  letters: ['מ'], gender: 'דו-מיני', gClass: 'neutral', zodiac: 'בתולה',   zodiacPos: 'יורד' },
};
const DIR_CLASS = { 'צפון': 'north', 'דרום': 'south', 'מזרח': 'east', 'מערב': 'west' };
const ELEMENT_CLASS = { 'אש': 'fire', 'מים': 'water', 'רוח': 'air', 'עפר': 'earth' };

let guideRendered = false;
function renderGuide() {
  if (guideRendered) return;
  guideRendered = true;
  renderMethodsGuide();
  renderFiguresGuide();
  renderHousesGuide();
  renderBuildGuide();
  renderConceptsGuide();
  renderIsqat7Guide();
}

function renderMethodsGuide() {
  const el = document.getElementById('guide-methods');
  if (!el) return;
  el.innerHTML = `
<div class="guide-methods-page">

  <div class="guide-methods-intro">
    <h3>שתי שיטות — ספר אחד ולוח אחד</h3>
    <p>
      האפליקציה מציעה שתי שיטות קריאה נפרדות לגורל החול, שתיהן מבוססות על לוח זהה של 16 בתים
      הנבנה מ-4 אמהות. ההבדל ביניהן אינו בלוח — אלא <strong>באיך מפרשים אותו</strong>.
      כל שיטה נשענת על ספר מקור שונה, עם שפה, מבנה ומתודה פרשנית משלה.
    </p>
  </div>

  <div class="guide-methods-grid">

    <div class="guide-method-card hawi-card">
      <div class="guide-method-header">
        <span class="guide-method-icon">📜</span>
        <div>
          <div class="guide-method-name">שיטת חאוי</div>
          <div class="guide-method-book">ספר חאוי העג׳איב ומצהר הג׳ראיב</div>
        </div>
      </div>
      <div class="guide-method-body">
        <p>
          שיטת חאוי היא שיטה <strong>חיה, מרובדת ומורכבת</strong>. היא אינה מסתפקת בתשובה של
          "כן" או "לא" — אלא בונה תמונה שלמה של המצב: מזל הצורות, מצבהן בכל בית, מסלול
          התנועה, יחס העדים לדיין, חישוב הדמיר, ועוד עשרות פרמטרים פרשניים.
        </p>

        <div class="guide-method-section">
          <div class="guide-method-section-title">איך עובדת השיטה</div>
          <ul>
            <li><strong>שאלה חופשית:</strong> הלקוח שואל שאלה בלשונו הוא — ואתה בוחר את נושא הבית המתאים (נישואין, בריאות, פרנסה וכו׳)</li>
            <li><strong>הצורה בכל בית:</strong> לכל אחת מ-16 הצורות יש משמעות ייחודית בכל אחד מ-16 הבתים — מטריצה של 256 פרשנויות</li>
            <li><strong>מצב הצורה:</strong> האם הצורה "מדברת" (גלויה) או "שותקת" (נסתרת)? מה מזלה — מיטיב, מזיק, או ממוזג?</li>
            <li><strong>עדים ודיין:</strong> בית 13 ו-14 הם עדים; בית 15 הוא הדיין — פסיקה עליונה לכל השאלה</li>
            <li><strong>הדמיר:</strong> הבית הנסתר — "לב הלוח" המגלה את האמת הפנימית שמאחורי השאלה</li>
            <li><strong>יסוד וכיוון:</strong> יסוד הצורה (אש, אוויר, מים, עפר) מגלה כיוון, בריאות, טמפרמנט ועוד</li>
            <li><strong>גובר ונכנע:</strong> בנושאי סכסוך — ספירת נקודות יחידות בצד השואל מול צד היריב</li>
          </ul>
        </div>

        <div class="guide-method-section">
          <div class="guide-method-section-title">מתאים במיוחד לשאלות</div>
          <div class="guide-method-tags">
            <span>נישואין</span><span>בריאות ומחלה</span><span>פרנסה</span>
            <span>סכסוכים</span><span>נסיעה</span><span>ילדים</span>
            <span>גנבה</span><span>נעדרים</span><span>אבחון רוחני</span>
          </div>
        </div>

        <div class="guide-method-note">
          📖 מקור: ספר חאוי העג׳איב — ספר קלאסי
          המכיל 62 פרקים של פרשנות מפורטת לכל שאלה ונושא
        </div>

        <div class="guide-method-section" style="margin-top:18px">
          <div class="guide-method-section-title">שאלות לדוגמה לפי נושא</div>
          <div class="hawi-topics-grid">
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">⚡ מצב כללי</div>
              <ul class="hawi-topic-qs">
                <li>"מה צופן לי העתיד הקרוב?"</li>
                <li>"האם מצבי ישתפר בחודשים הקרובים?"</li>
                <li>"כיצד הגורל רואה את מצבי כרגע?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">💍 זוגיות</div>
              <ul class="hawi-topic-qs">
                <li>"האם אתחתן?"</li>
                <li>"האם הוא/היא מתכוון/ת ברצינות?"</li>
                <li>"האם הקשר שלנו יתפתח לנישואין?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">💰 פרנסה וממון</div>
              <ul class="hawi-topic-qs">
                <li>"האם העסק החדש יצליח?"</li>
                <li>"האם אקבל את הכסף שחייבים לי?"</li>
                <li>"האם כדאי להשקיע בעסקה הזו?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">🏥 בריאות ומחולה</div>
              <ul class="hawi-topic-qs">
                <li>"האם המחלה תחלוף?"</li>
                <li>"מה מקור הסבל שלי?"</li>
                <li>"האם הוא/היא יתאושש/תתאושש?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">✈️ נסיעה</div>
              <ul class="hawi-topic-qs">
                <li>"האם הנסיעה תצא לפועל?"</li>
                <li>"האם הנסיעה מבורכת?"</li>
                <li>"האם כדאי לנסוע עכשיו?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">⚖️ סכסוך ותביעה</div>
              <ul class="hawi-topic-qs">
                <li>"האם אנצח בבית המשפט?"</li>
                <li>"מי יגבר — אני או היריב?"</li>
                <li>"האם הסכסוך ייפתר בשלום?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">👑 קריירה ושלטון</div>
              <ul class="hawi-topic-qs">
                <li>"האם אקבל את התפקיד?"</li>
                <li>"האם הקידום יגיע?"</li>
                <li>"מה מצבי אצל הממונים עלי?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">👶 ילדים והריון</div>
              <ul class="hawi-topic-qs">
                <li>"האם אתעבר?"</li>
                <li>"האם ההריון יעבור בשלום?"</li>
                <li>"זכר או נקבה?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">🔮 אבחון רוחני</div>
              <ul class="hawi-topic-qs">
                <li>"האם יש עלי עין הרע?"</li>
                <li>"האם יש עלי כישוף?"</li>
                <li>"מה מקור הסבל שאינו מוסבר רפואית?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">🔍 גנבה / מגנב</div>
              <ul class="hawi-topic-qs">
                <li>"מי גנב ממני?"</li>
                <li>"האם הגנוב יוחזר?"</li>
                <li>"איפה הנעדר ומה מצבו?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">🕯️ ירושה ומוות</div>
              <ul class="hawi-topic-qs">
                <li>"מה יהיה עם הירושה?"</li>
                <li>"מי יירש את הנכסים?"</li>
                <li>"מה מצב החולה הכרוני?"</li>
              </ul>
            </div>
            <div class="hawi-topic-item">
              <div class="hawi-topic-name">📅 תחזית שנתית</div>
              <ul class="hawi-topic-qs">
                <li>"מה השנה תביא לי?"</li>
                <li>"האם מחירי הסחורה יעלו?"</li>
                <li>"מה מזג האוויר צופן לעונה?"</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="guide-method-section" style="margin-top:18px">
          <div class="guide-method-section-title">דוגמת קריאה שלמה — שלב אחר שלב</div>
          <div class="hawi-example-box">
            <div class="ex-label">שאלת הלקוח</div>
            לאה, 28, רווקה, שואלת: <strong>"האם אתחתן השנה?"</strong>
          </div>
          <div class="hawi-walkthrough">
            <div class="hawi-step">
              <div class="hawi-step-num">1</div>
              <div>
                <div class="hawi-step-title">בחירת הנושא</div>
                <div class="hawi-step-body">בוחרים <strong>זוגיות</strong>. האפליקציה יודעת שהבית הקריטי הוא <strong>בית 7</strong> (בית הזוגיות והנישואין) ובית 1 (השואלת עצמה).</div>
              </div>
            </div>
            <div class="hawi-step">
              <div class="hawi-step-num">2</div>
              <div>
                <div class="hawi-step-title">בניית הלוח</div>
                <div class="hawi-step-body">לאה מזינה 4 אמהות (או מגרילה אותן). האפליקציה בונה אוטומטית לוח של <strong>16 בתים</strong> — כל בית מכיל אחת מ-16 הצורות האפשריות.</div>
              </div>
            </div>
            <div class="hawi-step">
              <div class="hawi-step-num">3</div>
              <div>
                <div class="hawi-step-title">קריאת הבתים הרלוונטיים</div>
                <div class="hawi-step-body">נניח שהלוח הראה:<br>
                  • <strong>בית 1 (לאה):</strong> "ממון נכנס" — צורה מיטיבה, השואלת בתנועה חיובית<br>
                  • <strong>בית 7 (הזוגיות):</strong> "כבוד נכנס" — צורה מיטיבה, קשר מכובד מגיע<br>
                  • <strong>בית 5 (אהבה):</strong> מחזק — הרגש פעיל ואמיתי</div>
              </div>
            </div>
            <div class="hawi-step">
              <div class="hawi-step-num">4</div>
              <div>
                <div class="hawi-step-title">בדיקת מצב הצורות</div>
                <div class="hawi-step-body">לכל צורה נבדקים:<br>
                  • <strong>מדברת או שותקת?</strong> — האם הצורה "גלויה" ופעילה, או "שותקת" ונסתרת<br>
                  • <strong>מיטיבה, מזיקה, או ממוזגת?</strong> — עוצמת הצורה ומזלה<br>
                  • <strong>קשר בין בית 1 ובית 7</strong> — האם הצורות מחוברות</div>
              </div>
            </div>
            <div class="hawi-step">
              <div class="hawi-step-num">5</div>
              <div>
                <div class="hawi-step-title">העדים והדיין — הפסיקה העליונה</div>
                <div class="hawi-step-body">נניח:<br>
                  • <strong>עד א׳ (בית 13):</strong> "נשוא ראש" — ממוזג, לא מונע<br>
                  • <strong>עד ב׳ (בית 14):</strong> "לבן" — מיטיב, מחזק<br>
                  • <strong>דיין (בית 15):</strong> "ממון נכנס" — <strong>מיטיב</strong> — הפסיקה: כן</div>
              </div>
            </div>
            <div class="hawi-step">
              <div class="hawi-step-num">6</div>
              <div>
                <div class="hawi-step-title">הדמיר — לב הלוח</div>
                <div class="hawi-step-body">האפליקציה מחשבת את <strong>הבית הנסתר</strong> (הדמיר) — מגלה אם יש כוח אמיתי מאחורי השאלה או שהעניין "נסתר ולא בשל". כאן הדמיר מאשר: העניין פעיל.</div>
              </div>
            </div>
            <div class="hawi-step">
              <div class="hawi-step-num">7</div>
              <div>
                <div class="hawi-step-title">המסקנה — נרטיב מלא</div>
                <div class="hawi-step-body">האפליקציה מייצרת נרטיב עברי מפורט על בסיס כל הנתונים — מהצורות, הדמיר, העדים והדיין — לפי ספר חאוי.</div>
              </div>
            </div>
          </div>
          <div class="hawi-example-conclusion">
            "בית הזוגיות מחזיק צורה מיטיבה בעלת תנועה נכנסת — סימן חיובי לקשר שמגיע. הדיין מאשר. על פי לוח זה, כוחות הנישואין פעילים ומסתמנת אפשרות ממשית לקשר רציני במהלך השנה הקרובה."
          </div>
        </div>

      </div>
    </div>

    <div class="guide-method-card kashf-card">
      <div class="guide-method-header">
        <span class="guide-method-icon">🔮</span>
        <div>
          <div class="guide-method-name">חשיפת הסודות הנצורים (כשף אל-אסרר)</div>
          <div class="guide-method-book">ספר כשף אל-אסרר המצונה</div>
        </div>
      </div>
      <div class="guide-method-body">
        <p>
          חשיפת הסודות הנצורים (כשף אל-אסרר) היא שיטה <strong>נוסחתית, ממוקדת ומדויקת</strong>. במקום לקרוא את כל הלוח
          שורה אחר שורה, היא שולפת בתים ספציפיים, מחברת אותם לפי נוסחה מוגדרת, ומפיקה צורה
          תוצאתית אחת שמכילה את התשובה. כל שאלה — נוסחה אחת, תשובה אחת.
        </p>

        <div class="guide-method-section">
          <div class="guide-method-section-title">איך עובדת השיטה</div>
          <ul>
            <li><strong>שאלה ממוקדת:</strong> בוחרים שאלה מתוך בנק 252 שאלות מאורגנות לפי נושא ובית</li>
            <li><strong>נוסחה ראשית:</strong> כל שאלה מגיעה עם נוסחה שלוקחת בתים מסוימים ומחברת אותם (חיבור, הרכבה, שורת-אש) לצורה תוצאתית</li>
            <li><strong>פסיקה על הצורה:</strong> הצורה התוצאתית מוערכת לפי מעמדה — נכנסת/יוצאת, מיטיב/מזיק</li>
            <li><strong>נוסחה חלופית:</strong> לרוב השאלות יש גם נוסחת ביקורת משלימה לאימות</li>
            <li><strong>בדיקות תומכות:</strong> בדיקות נוספות מעמיקות את הפסיקה (מין, יסוד, כיוון, ספירת בתים)</li>
          </ul>
        </div>

        <div class="guide-method-section">
          <div class="guide-method-section-title">מתאים במיוחד כאשר</div>
          <div class="guide-method-tags">
            <span>רוצים תשובה מהירה וברורה</span>
            <span>השאלה מוגדרת היטב</span>
            <span>רוצים לאמת קריאת חאוי</span>
            <span>לומדים את שיטת הנוסחות</span>
          </div>
        </div>

        <div class="guide-method-note">
          📖 מקור: ספר כשף אל-אסרר — הספר המלא מובנה באפליקציה ונגיש
          בלשונית "כשף אל-אסרר" בדף זה
        </div>

        <div class="guide-method-section" style="margin-top:18px">
          <div class="guide-method-section-title">שאלות לדוגמה לפי בתים</div>
          <div class="hawi-topics-grid">
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">🏠 בית 1 — השואל</div>
              <ul class="hawi-topic-qs">
                <li>"מה מצבי הכללי כרגע?"</li>
                <li>"האם העניין שלי יצליח?"</li>
                <li>"מה הכיוון הגיאוגרפי של עניין זה?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">💰 בית 2 — ממון</div>
              <ul class="hawi-topic-qs">
                <li>"האם אקבל כסף בקרוב?"</li>
                <li>"האם החוב יוחזר לי?"</li>
                <li>"מאיפה תגיע פרנסתי?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">👥 בית 3 — אחים ותנועה</div>
              <ul class="hawi-topic-qs">
                <li>"מה מצב הקשר עם האח/שכן?"</li>
                <li>"האם כדאי לעבור לעיר אחרת?"</li>
                <li>"מה פירוש החלום שחלמתי?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">🌍 בית 4 — אב ונסתרות</div>
              <ul class="hawi-topic-qs">
                <li>"האם יש דפין/מטמון במקום זה?"</li>
                <li>"מה מצב הנכס/הקרקע שלי?"</li>
                <li>"מה מקור הסבל הנסתר?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">👶 בית 5 — ילדים</div>
              <ul class="hawi-topic-qs">
                <li>"האם אתעבר?"</li>
                <li>"זכר או נקבה?"</li>
                <li>"מה גורל הילד שנולד?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">🏥 בית 6 — מחלה</div>
              <ul class="hawi-topic-qs">
                <li>"מה מקור המחלה שלי?"</li>
                <li>"האם אתרפא ומתי?"</li>
                <li>"האם יש כישוף/עין הרע בשורש?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">💍 בית 7 — זוגיות ויריבים</div>
              <ul class="hawi-topic-qs">
                <li>"מה מצב הזוגיות שלי?"</li>
                <li>"מי יגבר בסכסוך — אני או יריבי?"</li>
                <li>"מה כוונות האחר כלפי?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">⚰️ בית 8 — ירושה ומוות</div>
              <ul class="hawi-topic-qs">
                <li>"מה מצב החולה — לחיים או למוות?"</li>
                <li>"מה יהיה עם הירושה?"</li>
                <li>"מתי יבוא הסוף לעניין?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">✈️ בית 9 — נסיעה ודת</div>
              <ul class="hawi-topic-qs">
                <li>"האם הנסיעה מבורכת?"</li>
                <li>"מה יקרה לי בדרך?"</li>
                <li>"מה פירוש החלום הרוחני?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">👑 בית 10 — שלטון וקריירה</div>
              <ul class="hawi-topic-qs">
                <li>"האם אקבל את התפקיד?"</li>
                <li>"מה מצבי מול הממונים?"</li>
                <li>"האם הקידום יגיע?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">🤝 בית 11 — חברים ותקוות</div>
              <ul class="hawi-topic-qs">
                <li>"האם הידיד יעזור לי?"</li>
                <li>"האם התקווה שלי תתממש?"</li>
                <li>"מה מצב הקשרים החברתיים שלי?"</li>
              </ul>
            </div>
            <div class="kashf-topic-item">
              <div class="kashf-topic-name">🕵️ בית 12 — אויבים נסתרים</div>
              <ul class="hawi-topic-qs">
                <li>"האם יש אויב נסתר שפועל נגדי?"</li>
                <li>"מה מסתתר ממני בעניין זה?"</li>
                <li>"מה טיב הכישוף/העין שעלי?"</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="guide-method-section" style="margin-top:18px">
          <div class="guide-method-section-title">דוגמת קריאה שלמה — שלב אחר שלב</div>
          <div class="kashf-example-box">
            <div class="ex-label">שאלת הלקוח</div>
            יוסף, 45, בעל חנות, שואל: <strong>"חבר חייב לי 5,000 ש"ח — האם יחזיר?"</strong>
          </div>
          <div class="hawi-walkthrough">
            <div class="kashf-step">
              <div class="kashf-step-num">1</div>
              <div>
                <div class="kashf-step-title">בחירת השאלה מהבנק</div>
                <div class="kashf-step-body">נכנסים לבנק השאלות → <strong>בית 2 (ממון)</strong> → בוחרים: <strong>"האם החוב יוחזר לי?"</strong></div>
              </div>
            </div>
            <div class="kashf-step">
              <div class="kashf-step-num">2</div>
              <div>
                <div class="kashf-step-title">הנוסחה הייעודית</div>
                <div class="kashf-step-body">לשאלה זו הספר נותן נוסחה ספציפית — <strong>מחברים בתים מסוימים</strong> מהלוח (למשל בית 2 עם בית 8) וה"שורה" שיוצאת מהחיבור היא הצורה התוצאתית.</div>
              </div>
            </div>
            <div class="kashf-step">
              <div class="kashf-step-num">3</div>
              <div>
                <div class="kashf-step-title">הצורה התוצאתית</div>
                <div class="kashf-step-body">נניח שיצאה <strong>"ממון נכנס"</strong> — צורה בעלת תנועה נכנסת ומזל מיטיב. שמה אומר הכל: הממון <em>נכנס</em>.</div>
              </div>
            </div>
            <div class="kashf-step">
              <div class="kashf-step-num">4</div>
              <div>
                <div class="kashf-step-title">פסיקה ראשית</div>
                <div class="kashf-step-body">הצורה נכנסת ומיטיבה → <strong>כן, הכסף יחזור.</strong> אם הייתה יוצאת (כגון "ממון יוצא") — הכסף לא יחזור.</div>
              </div>
            </div>
            <div class="kashf-step">
              <div class="kashf-step-num">5</div>
              <div>
                <div class="kashf-step-title">נוסחת ביקורת</div>
                <div class="kashf-step-body">לרוב השאלות יש <strong>נוסחה שנייה לאימות</strong>. הספר נותן חיבור חלופי. גם כאן יצאה צורה נכנסת — הפסיקה מאושרת.</div>
              </div>
            </div>
            <div class="kashf-step">
              <div class="kashf-step-num">6</div>
              <div>
                <div class="kashf-step-title">בדיקות תומכות</div>
                <div class="kashf-step-body">
                  • <strong>מין הצורה:</strong> נקבית — הממון יגיע בעקיפין, אולי דרך אדם שלישי<br>
                  • <strong>יסוד:</strong> מים — עניין רגשי, הלווה בלחץ אבל בסופו כן ישלם<br>
                  • <strong>ספירת בתים:</strong> מגלה עיתוי מוערך
                </div>
              </div>
            </div>
            <div class="kashf-step">
              <div class="kashf-step-num">7</div>
              <div>
                <div class="kashf-step-title">הפסיקה הסופית</div>
                <div class="kashf-step-body">האפליקציה מרכזת את כל הממצאים ומוציאה פסיקה ברורה עם ביאור.</div>
              </div>
            </div>
          </div>
          <div class="kashf-example-conclusion">
            "הצורה התוצאתית נכנסת ומיטיבה — הממון צפוי לחזור. שתי הנוסחות מסכימות. על פי בדיקת היסוד, ייתכן שהתשלום יגיע בעקיפין או אחרי לחץ מסוים, אך הגורל מורה על החזרה."
          </div>
        </div>

      </div>
    </div>

  </div>

  <div class="guide-methods-comparison">
    <h3>טבלת הבדלים</h3>
    <div class="guide-compare-table">
      <div class="guide-compare-row header">
        <div class="guide-compare-cell label"></div>
        <div class="guide-compare-cell hawi">שיטת חאוי</div>
        <div class="guide-compare-cell kashf">שיטת כשף</div>
      </div>
      <div class="guide-compare-row">
        <div class="guide-compare-cell label">אופי השאלה</div>
        <div class="guide-compare-cell hawi">חופשית, בלשון הלקוח</div>
        <div class="guide-compare-cell kashf">מובנית מתוך בנק שאלות</div>
      </div>
      <div class="guide-compare-row">
        <div class="guide-compare-cell label">שיטת הפרשנות</div>
        <div class="guide-compare-cell hawi">קריאת כל 16 הבתים בשכבות</div>
        <div class="guide-compare-cell kashf">נוסחה — שליפת בתים ספציפיים</div>
      </div>
      <div class="guide-compare-row">
        <div class="guide-compare-cell label">מורכבות</div>
        <div class="guide-compare-cell hawi">גבוהה — רב-שכבתית</div>
        <div class="guide-compare-cell kashf">בינונית — ממוקדת ומדויקת</div>
      </div>
      <div class="guide-compare-row">
        <div class="guide-compare-cell label">תוצאה</div>
        <div class="guide-compare-cell hawi">נרטיב מלא + ניתוח עמוק</div>
        <div class="guide-compare-cell kashf">פסיקה ברורה + ביאור תמציתי</div>
      </div>
      <div class="guide-compare-row">
        <div class="guide-compare-cell label">עדים ודיין</div>
        <div class="guide-compare-cell hawi">✓ מרכזיים בפסיקה</div>
        <div class="guide-compare-cell kashf">✓ מופיעים כבתים תומכים</div>
      </div>
      <div class="guide-compare-row">
        <div class="guide-compare-cell label">הדמיר</div>
        <div class="guide-compare-cell hawi">✓ חישוב מפורט</div>
        <div class="guide-compare-cell kashf">— לא חלק מהשיטה הנוסחתית</div>
      </div>
      <div class="guide-compare-row">
        <div class="guide-compare-cell label">מספר שאלות</div>
        <div class="guide-compare-cell hawi">כל שאלה אפשרית</div>
        <div class="guide-compare-cell kashf">252 שאלות ממוינות</div>
      </div>
      <div class="guide-compare-row">
        <div class="guide-compare-cell label">מתאים ל</div>
        <div class="guide-compare-cell hawi">קריאה מקצועית ומעמיקה</div>
        <div class="guide-compare-cell kashf">תשובה מהירה ואימות</div>
      </div>
    </div>
  </div>

  <div class="guide-methods-tip">
    <strong>טיפ מקצועי:</strong>
    כאשר תוצאות שתי השיטות מסכימות — הפסיקה חזקה ואמינה.
    כאשר הן חלוקות — זה בעצמו מידע: העניין מורכב, יש כוחות נוגדים, או שהשאלה טרם בשלה לתשובה.
  </div>

</div>
  `;
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
      desc: 'השארית 6 מרמזת על עודף מרה שחורה. תסמינים: דיכאון, חרדה, פחדים, בדידות, מחשבות קודרות, קוצר נשימה, כאבי ראש.' },
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
            <div style="font-size:12px;color:${r.color};font-weight:700;margin-bottom:4px">${r.type}</div>
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
      <strong>מין הצורה</strong> (מקור: חשיפת הסודות): 🔵 <strong>זכר</strong> (6 צורות) · 🌸 <strong>נקבה</strong> (6 צורות) · ⚪ <strong>אנדרוגינוס</strong> (4 צורות: דרך, סוהר, חיבור, קהלה)<br>
      <strong>מזל:</strong> 🟢 <strong>טוב</strong> = מיטיב &nbsp;|&nbsp; 🔴 <strong>רע</strong> = מזיק &nbsp;|&nbsp; 🟡 <strong>ממוזג</strong> = בינוני<br>
      <strong>קבוצות תנועה:</strong>
      <strong>יוצאת</strong> = משפיעה כלפי חוץ &nbsp;|&nbsp;
      <strong>נכנסת</strong> = משפיעה כלפי פנים &nbsp;|&nbsp;
      <strong>קבועה</strong> = יציבה &nbsp;|&nbsp;
      <strong>מתהפכת</strong> = שני פנים<br>
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
      <td><strong>${escapeHtml(h.hebrew)}</strong></td>
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
    { title: 'כשרות הלוח', sub: 'האם הלוח תקין לפסיקה?', body: 'לוח נחשב כשר לפסיקה כשמתקיימים שני תנאים: (1) צורת הלבנה — "לבן" או "דרך" — מופיעה בלוח. (2) כל 7 הכוכבים מיוצגים — לפחות צורה אחת שייכת לכל כוכב. אם הלבנה נעדרת — יש לחזור על ההכאה. אם הלבנה קיימת אך חסרים כוכבים — הלוח חלקי ויש לנהוג בזהירות.' },
    { title: 'מניעה — מה חוסם את הדבר', sub: 'שלושה גורמים שמונעים השלמה', body: 'גם כשנראה שהדבר ייגמר, ישנם גורמים שיכולים לחסום: (1) דיין מזיק שאינו מחובר לשואל ולנשאל — חוסם את הפסיקה. (2) צורת מזיק בבית 12 — סכנה נסתרת שמפריעה. (3) צורת מזיק בבית 8 — מטילה צל של הפסד על הדין.' },
    { title: 'צורה בביתה הטבעי', sub: 'כשהצורה שנפלה היא הצורה הקבועה של הבית', body: 'לכל אחד מ-16 הבתים יש צורה קבועה השייכת לו. כשהצורה שנפלה בגורל זהה לצורה הקבועה של אותו בית — הדין מתחזק. אם הצורה טובה (מיטיב) — מתחזק לטובה. אם הצורה רעה (מזיק) — מתחזק לרעה. לדוגמה: "נלחם" בבית 1 הוא ביתו הטבעי — הדין על השואל מתחזק לפי מזל נלחם.' },
    { title: 'מדבר ושותק — עוצמת הבית', sub: 'האם הבית פועל במלוא כוחו', body: 'כל בית מוגדר כ"מדבר" או "שותק" או "חצי מדבר". בית שותק — הצורה שנפלה בו משתתפת בפסיקה במשקל מוחלש. בית מדבר — הצורה פועלת במלוא כוחה. לדוגמה: בית 1 הוא מדבר — הצורה בו חזקה. בית 2 הוא שותק — הצורה בו מוחלשת.' },
    { title: 'יתד, שוקע ונוטה — מיקום הבית', sub: 'שלוש קבוצות בתים לפי כוח', body: 'הבתים מחולקים לשלוש קבוצות: יתדות (בתים 1, 4, 7, 10) — קבועים וחזקים, הדין בהם אפשרי ויציב. שוקעים/נופלים (בתים 3, 6, 9, 12) — הדין בהם קשה להתממש. אחרי יתדות (בתים 2, 5, 8, 11) — ביניים, יש בהם תקווה אך אינם יציבים.' },
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
