// המצפן הפנימי — בקר UI וונילה (ES module). מחבר את מנועי הקרטומנסי המפורטים.
// אין React/Next/build — נטען ישירות מ-cards.html כ-<script type="module">.
import { DECK, findCardById } from '../engine/cartomancy-data.js';
import { interpretThreeCardSpread } from '../engine/three-card-interpreter.js';
import { validateQuestionForSpread, getSpreadPolicy } from '../engine/spread-policy-engine.js';
import { buildClientReport } from '../engine/client-report-engine.js';
import { shuffleDeck, dealPPF } from '../engine/ppf-interpreter.js';
import { detectGroups } from '../engine/knowledge/past-present-future.js';
import { buildPPFEngineConclusion } from '../engine/ppf-engine.js';
import { getUnifiedStudyData } from '../engine/study-engine.js';

// ---------- card image resolution (id "9♥" → cartomancy/assets/cards/9_of_hearts.svg) ----------
const RANK_FILE = { A: 'ace', J: 'jack', Q: 'queen', K: 'king' };
function cardFile(card) {
  const r = RANK_FILE[card.rank.key] || card.rank.key; // 2..10 stay numeric
  return `cartomancy/assets/cards/${r}_of_${card.suit.key}.svg`;
}

// ---------- state ----------
const TOPICS = ['זוגיות', 'עבודה', 'כסף', 'בריאות', 'כללי'];
const state = {
  screen: 'menu',
  spread: 'three',            // 'three' | 'past-present-future'
  gender: 'female',
  clientName: '',
  topic: 'כללי',
  language: 'he',
  question: '',
  slots: { root: null, heart: null, direction: null }, // three-card: {card, reversed}
  ppf: null,                  // { pastCards, presentCards, futureCards, surpriseCards }
  result: null,               // { conclusion, insight?, clientSummary }
  err: '',
};
const SLOT_LABELS = { root: 'שורש', heart: 'לב העניין', direction: 'כיוון' };
const app = () => document.getElementById('cardsApp');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- persistence (aligned with Hall archive convention: per-user localStorage) ----------
function archiveKey() {
  const uid = sessionStorage.getItem('userId') || 'anon';
  return `cartomancyReadingsArchive_v1_${uid}`;
}
function loadArchive() { try { return JSON.parse(localStorage.getItem(archiveKey()) || '[]'); } catch { return []; } }
function saveArchive(list) { localStorage.setItem(archiveKey(), JSON.stringify(list)); }

// ---------- dates ----------
function gregorianDate() { return new Date().toLocaleDateString('he-IL'); }
function hebrewDate() {
  try { return new Intl.DateTimeFormat('he-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); }
  catch { return ''; }
}
function readingTime() { return new Date().toLocaleString('he-IL'); }

// ================= render =================
function render() {
  const el = app();
  if (!el) return;
  if (state.screen === 'menu') el.innerHTML = viewMenu();
  else if (state.screen === 'new') el.innerHTML = viewNew();
  else if (state.screen === 'result') el.innerHTML = viewResult();
  else if (state.screen === 'archive') el.innerHTML = viewArchive();
  else if (state.screen === 'study') el.innerHTML = viewStudy();
  bind();
}
function go(screen) { state.screen = screen; state.err = ''; render(); }

// ---------- menu ----------
function viewMenu() {
  return `
  <div class="cards-panel">
    <div class="cards-menu">
      <div class="cards-panel cards-tile" data-go="new"><span class="ico">✦</span>קריאה חדשה</div>
      <div class="cards-panel cards-tile" data-go="archive"><span class="ico">📚</span>ארכיון קריאות</div>
      <div class="cards-panel cards-tile" data-go="study"><span class="ico">📖</span>לימוד קלפים</div>
    </div>
  </div>`;
}

// ---------- new reading ----------
function viewNew() {
  const policy = getSpreadPolicy(state.spread);
  const isThree = state.spread === 'three';
  const chips = TOPICS.map((t) => `<button class="cards-chip ${state.topic === t ? 'on' : ''}" data-topic="${esc(t)}">${esc(t)}</button>`).join('');
  return `
  <div class="cards-panel">
    <h2>פרטי הקריאה</h2>
    <div class="cards-field">
      <label>סוג פריסה</label>
      <div class="cards-row">
        <button class="cards-chip ${isThree ? 'on' : ''}" data-spread="three">שלושה קלפים (שאלה ממוקדת)</button>
        <button class="cards-chip ${!isThree ? 'on' : ''}" data-spread="past-present-future">עבר · הווה · עתיד (כללית)</button>
      </div>
    </div>
    <div class="cards-field"><label>שם הלקוח/ה</label><input id="fName" value="${esc(state.clientName)}" placeholder="שם" /></div>
    <div class="cards-field">
      <label>מגדר</label>
      <div class="cards-row">
        <button class="cards-chip ${state.gender === 'female' ? 'on' : ''}" data-gender="female">נקבה</button>
        <button class="cards-chip ${state.gender === 'male' ? 'on' : ''}" data-gender="male">זכר</button>
      </div>
    </div>
    <div class="cards-field"><label>נושא</label><div class="cards-chips">${chips}</div></div>
    <div class="cards-field">
      <label>${esc(policy.recommendedPrompt)}</label>
      ${policy.allowsSpecificQuestion
        ? `<textarea id="fQuestion" placeholder="כתוב/כתבי את השאלה">${esc(state.question)}</textarea>`
        : `<input id="fQuestion" value="קריאה כללית" disabled />`}
    </div>
    ${state.err ? `<div class="cards-field warn">${esc(state.err)}</div>` : ''}
  </div>

  ${isThree ? viewThreeCards() : viewPPF()}

  <div class="cards-row">
    <button class="cards-btn ghost" data-go="menu">→ חזרה</button>
  </div>`;
}

function viewThreeCards() {
  const slots = ['root', 'heart', 'direction'].map((k) => {
    const s = state.slots[k];
    const inner = s
      ? `<img class="${s.reversed ? 'rev' : ''}" src="${cardFile(s.card)}" alt="${esc(s.card.label)}" />`
      : `<div class="slot-place">בחר/י קלף</div>`;
    return `<div class="cards-slot">
        <div class="slot-label">${SLOT_LABELS[k]}</div>
        <div class="slot-box ${s ? 'filled' : ''}" data-slot="${k}">${inner}</div>
        ${s ? `<div class="cards-row" style="justify-content:center;margin-top:6px;gap:6px">
            <button class="cards-btn small ghost" data-rev="${k}">↕ הפוך</button>
            <button class="cards-btn small ghost" data-clear="${k}">✕</button>
          </div>` : ''}
      </div>`;
  }).join('');
  const ready = state.slots.root && state.slots.heart && state.slots.direction;
  return `
  <div class="cards-panel">
    <h2>הנחת הקלפים</h2>
    <div class="cards-slots">${slots}</div>
    <h3>בחר/י מהחפיסה</h3>
    ${deckGrid()}
    <div class="cards-row" style="margin-top:14px">
      <button class="cards-btn primary" data-action="read-three" ${ready ? '' : 'disabled'}>קרא/י את הפריסה</button>
    </div>
  </div>`;
}

function deckGrid() {
  const used = new Set(Object.values(state.slots).filter(Boolean).map((s) => s.card.id));
  return `<div class="deck-grid">${DECK.map((c) =>
    `<div class="deck-card ${used.has(c.id) ? 'used' : ''}" data-card="${esc(c.id)}"><img src="${cardFile(c)}" alt="${esc(c.label)}" /></div>`
  ).join('')}</div>`;
}

function viewPPF() {
  const dealt = state.ppf;
  return `
  <div class="cards-panel">
    <h2>עבר · הווה · עתיד</h2>
    <p class="cards-sub">חפיסת 32 קלפים. לחיצה על "ערבב וחלק" תפרוס 10 קלפים לכל תקופה + 2 קלפי הפתעה.</p>
    <div class="cards-row" style="margin:10px 0">
      <button class="cards-btn" data-action="deal-ppf">🔀 ערבב וחלק</button>
      ${dealt ? `<button class="cards-btn primary" data-action="read-ppf">קרא/י את הקריאה</button>` : ''}
    </div>
    ${dealt ? ppfPiles(dealt) : '<div class="empty">טרם חולקו קלפים</div>'}
  </div>`;
}
function ppfPiles(d) {
  const pile = (title, arr) => `<h3>${title}</h3><div class="deck-grid">${arr.map((x) => {
    const card = codeToCard(x.code);
    return `<div class="deck-card"><img class="${x.reversed ? 'rev' : ''}" src="${cardFile(card)}" alt="${esc(card.label)}" /></div>`;
  }).join('')}</div>`;
  return pile('עבר', d.pastCards) + pile('הווה', d.presentCards) + pile('עתיד', d.futureCards) + pile('הפתעה', d.surpriseCards);
}
// dealt cards carry `.code` which is the DECK_32 card object
function codeToCard(code) {
  if (code && typeof code === 'object' && code.id) return code;
  return findCardById(code) || DECK[0];
}

// ---------- result ----------
function viewResult() {
  const r = state.result;
  if (!r) { go('menu'); return ''; }
  const tags = (r.themes || []).slice(0, 10).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  const warns = (r.warnings || []).map((w) => `<div class="warn">⚠ ${esc(w)}</div>`).join('');
  return `
  <div class="cards-panel">
    <h2>הקריאה — ${esc(state.clientName || 'ללא שם')}</h2>
    ${state.question ? `<div class="cards-sub">השאלה: ${esc(state.question)}</div>` : ''}
    ${r.answer ? `<div class="verdict">${esc(r.answer)}</div>` : ''}
    <div class="concl">${esc(r.conclusion)}</div>
    ${warns}
    ${tags ? `<div class="tags">${tags}</div>` : ''}
    ${r.professional ? `<details class="advisor"><summary>אבחון-יועץ (לא ללקוח)</summary><div class="concl">${esc(typeof r.professional === 'string' ? r.professional : JSON.stringify(r.professional, null, 2))}</div></details>` : ''}
  </div>
  <div class="cards-row">
    <button class="cards-btn primary" data-action="save">💾 שמור קריאה</button>
    <button class="cards-btn" data-action="print">🖨 הפק דוח / PDF</button>
    <button class="cards-btn ghost" data-go="new">קריאה חדשה</button>
    <button class="cards-btn ghost" data-go="menu">→ תפריט</button>
  </div>`;
}

// ---------- archive ----------
function viewArchive() {
  const list = loadArchive();
  const items = list.length
    ? list.map((it, i) => `<div class="archive-item">
        <div><div>${esc(it.clientName || 'ללא שם')} · ${esc(it.spread === 'three' ? '3 קלפים' : 'עבר/הווה/עתיד')}</div>
          <div class="meta">${esc(it.readingTime)} ${it.question ? '· ' + esc(it.question) : ''}</div></div>
        <div class="cards-row">
          <button class="cards-btn small" data-open="${i}">פתח</button>
          <button class="cards-btn small ghost" data-del="${i}">מחק</button>
        </div>
      </div>`).join('')
    : '<div class="empty">אין קריאות שמורות</div>';
  return `<div class="cards-panel"><h2>ארכיון קריאות</h2>${items}</div>
    <button class="cards-btn ghost" data-go="menu">→ תפריט</button>`;
}

// ---------- study ----------
function viewStudy() {
  const d = getUnifiedStudyData();
  const section = (title, arr, fmt) => `<div class="study-block"><h3>${title}</h3>${(arr || []).map(fmt).join('')}</div>`;
  const line = (o) => `<div>• ${esc(o.title || o.name || o.label || o.heb || JSON.stringify(o))}${o.meaning || o.text || o.summary ? ' — ' + esc(o.meaning || o.text || o.summary) : ''}</div>`;
  return `<div class="cards-panel"><h2>לימוד קלפים</h2>
    ${section('סוגות (Suits)', d.suits, line)}
    ${section('מספרים', d.numbers, line)}
    ${section('קלפי מלכות (Court)', d.courts, line)}
    ${section('נושאים', d.topics, line)}
    ${section('חוקי ספר', d.rules, line)}
  </div><button class="cards-btn ghost" data-go="menu">→ תפריט</button>`;
}

// ================= actions =================
function readForm() {
  const n = document.getElementById('fName'); if (n) state.clientName = n.value.trim();
  const q = document.getElementById('fQuestion'); if (q && !q.disabled) state.question = q.value.trim();
}

function doReadThree() {
  readForm();
  const v = validateQuestionForSpread('three', state.question);
  if (!v.isValid) { state.err = v.message; go('new'); return; }
  const { root, heart, direction } = state.slots;
  const insight = interpretThreeCardSpread(v.normalizedQuestion, root.card, heart.card, direction.card, { gender: state.gender });
  const clientSummary = [insight.answer, insight.story, insight.timing].filter(Boolean).join('\n\n');
  state.result = {
    answer: insight.answer, conclusion: clientSummary, professional: insight.professional,
    themes: insight.themes, warnings: insight.warnings, clientSummary,
  };
  go('result');
}

function doDealPPF() {
  const dealt = dealPPF(shuffleDeck());
  state.ppf = dealt; go('new');
}
function doReadPPF() {
  readForm();
  const d = state.ppf; if (!d) return;
  // The PPF engine consumes the raw dealt shape {code, reversed} directly (it norm()s the code string).
  const conclusion = buildPPFEngineConclusion({
    pastCards: d.pastCards, presentCards: d.presentCards, futureCards: d.futureCards, surpriseCards: d.surpriseCards,
    pastGroups: detectGroups(d.pastCards), presentGroups: detectGroups(d.presentCards), futureGroups: detectGroups(d.futureCards),
    profile: { gender: state.gender, name: state.clientName },
  });
  state.question = 'קריאה כללית';
  state.result = { answer: '', conclusion, professional: null, themes: [], warnings: [], clientSummary: conclusion };
  go('result');
}

function doSave() {
  const list = loadArchive();
  list.unshift({
    clientName: state.clientName, spread: state.spread, topic: state.topic,
    question: state.question, readingTime: readingTime(),
    conclusion: state.result.clientSummary,
  });
  saveArchive(list);
  alert('הקריאה נשמרה בארכיון');
}

function doPrint() {
  const report = buildClientReport({
    clientName: state.clientName || 'ללא שם', question: state.question || 'קריאה כללית',
    readingTime: readingTime(), language: state.language, summary: state.result.clientSummary,
    gregorianDate: gregorianDate(), hebrewDate: hebrewDate(),
  });
  document.getElementById('cardsPrintArea').textContent = report;
  window.print();
}

// ================= event binding (delegation) =================
function bind() {
  const el = app();
  el.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => go(b.dataset.go));
  el.querySelectorAll('[data-spread]').forEach((b) => b.onclick = () => { state.spread = b.dataset.spread; state.err = ''; render(); });
  el.querySelectorAll('[data-gender]').forEach((b) => b.onclick = () => { readForm(); state.gender = b.dataset.gender; render(); });
  el.querySelectorAll('[data-topic]').forEach((b) => b.onclick = () => { readForm(); state.topic = b.dataset.topic; render(); });
  el.querySelectorAll('[data-card]').forEach((b) => b.onclick = () => placeCard(b.dataset.card));
  el.querySelectorAll('[data-rev]').forEach((b) => b.onclick = () => { const s = state.slots[b.dataset.rev]; if (s) { s.reversed = !s.reversed; render(); } });
  el.querySelectorAll('[data-clear]').forEach((b) => b.onclick = () => { state.slots[b.dataset.clear] = null; render(); });
  el.querySelectorAll('[data-open]').forEach((b) => b.onclick = () => openArchived(+b.dataset.open));
  el.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => { const l = loadArchive(); l.splice(+b.dataset.del, 1); saveArchive(l); render(); });
  el.querySelectorAll('[data-action]').forEach((b) => b.onclick = () => {
    const a = b.dataset.action;
    if (a === 'read-three') doReadThree();
    else if (a === 'deal-ppf') doDealPPF();
    else if (a === 'read-ppf') doReadPPF();
    else if (a === 'save') doSave();
    else if (a === 'print') doPrint();
  });
}

function placeCard(id) {
  readForm();
  const card = findCardById(id) || DECK.find((c) => c.id === id);
  if (!card) return;
  // fill first empty slot in order
  for (const k of ['root', 'heart', 'direction']) {
    if (!state.slots[k]) { state.slots[k] = { card, reversed: false }; render(); return; }
  }
}

function openArchived(i) {
  const it = loadArchive()[i]; if (!it) return;
  state.clientName = it.clientName; state.spread = it.spread; state.question = it.question;
  state.result = { answer: '', conclusion: it.conclusion, professional: null, themes: [], warnings: [], clientSummary: it.conclusion };
  go('result');
}

// boot
render();
