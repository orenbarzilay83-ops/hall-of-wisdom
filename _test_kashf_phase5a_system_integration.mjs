import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const qb = read('./goral-hachol/ui/question-bank.js');
const routeRegistry = read('./goral-hachol/registry/kashf-question-route-registry.js');
const methodRegistry = read('./goral-hachol/registry/kashf-canonical-method-registry.js');
const knowledgeRegistry = read('./goral-hachol/registry/kashf-v57-knowledge-registry.js');
const legacyRouter = read('./goral-hachol/engine/kashf-question-router.js');
const app = read('./goral-hachol/ui/goral-app.js');
const aiBuilder = read('./goral-hachol/intelligence/kashf-ai-context-builder.js');

function extractCallObjects(src, callName) {
  const out = [];
  const re = new RegExp("'([^']+)'\\s*:\\s*" + callName + "\\s*\\(\\s*\\{", 'g');
  let m;
  while ((m = re.exec(src))) {
    const key = m[1];
    const start = src.indexOf('{', m.index);
    let depth = 0;
    let quote = null;
    let escapedChar = false;
    let end = -1;
    for (let i = start; i < src.length; i++) {
      const ch = src[i];
      if (quote) {
        if (escapedChar) escapedChar = false;
        else if (ch === '\\') escapedChar = true;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    assert.ok(end > start, 'unterminated ' + callName + ' record: ' + key);
    const body = src.slice(start, end);
    const field = (name) => (body.match(new RegExp('\\b' + name + "\\s*:\\s*'([^']*)'")) || [])[1] ?? null;
    const bool = (name) => {
      const value = (body.match(new RegExp('\\b' + name + '\\s*:\\s*(true|false)')) || [])[1];
      return value == null ? null : value === 'true';
    };
    out.push({ key, body, field, bool });
    re.lastIndex = end;
  }
  return out;
}

const questionIds = [...new Set([...qb.matchAll(/\bid:\s*'(q-[^']+)'/g)].map((m) => m[1]))];
assert.equal(questionIds.length, 138, 'unexpected Question Bank count');

const routes = extractCallObjects(routeRegistry, 'route').map((x) => ({
  questionId: x.field('questionId') || x.key,
  methodId: x.field('kashfMethodId'),
  intentId: x.field('kashfIntentId'),
  status: x.field('kashfRuntimeStatus'),
}));
assert.equal(routes.length, 138, 'every Question Bank ID must have one canonical route');
assert.deepEqual(new Set(routes.map((r) => r.questionId)), new Set(questionIds), 'canonical route coverage must equal Question Bank coverage');

const methods = extractCallObjects(methodRegistry, 'method').map((x) => ({
  methodId: x.field('kashfMethodId') || x.key,
  intentId: x.field('kashfIntentId'),
  status: x.field('kashfRuntimeStatus'),
  runtimeAllowed: x.bool('runtimeAllowed'),
  executorStatus: x.field('executorStatus'),
}));
assert.equal(methods.length, 118, 'unexpected canonical method count');

const methodMap = new Map(methods.map((m) => [m.methodId, m]));
for (const route of routes) {
  const method = methodMap.get(route.methodId);
  assert.ok(method, 'route points to missing method: ' + route.questionId + ' -> ' + route.methodId);
  assert.equal(route.intentId, method.intentId, 'route/method intent mismatch: ' + route.questionId);
  assert.equal(route.status, method.status, 'route/method status mismatch: ' + route.questionId);
}

const knowledgeIds = new Set(extractCallObjects(knowledgeRegistry, 'knowledge').map((x) => x.field('kashfMethodId') || x.key));
const runnableRoutes = routes.filter((route) => {
  const method = methodMap.get(route.methodId);
  return route.status === 'ready'
    && method?.status === 'ready'
    && method?.runtimeAllowed === true
    && method?.executorStatus === 'ready';
});
assert.equal(runnableRoutes.length, 54, 'unexpected runnable canonical Question-ID route count after eight-gap closure');
for (const route of runnableRoutes) {
  assert.ok(knowledgeIds.has(route.methodId), 'runnable route missing v57 knowledge: ' + route.questionId);
}

for (const qid of ['q-lifespan', 'q-lifespan-remaining']) {
  const route = routes.find((r) => r.questionId === qid);
  assert.equal(route?.status, 'blocked-by-source', qid + ' must align with B12-P178');
}
const lifespan = methodMap.get('lifespan.p178.elementCountToHouse');
assert.equal(lifespan?.status, 'blocked-by-source');
assert.equal(lifespan?.runtimeAllowed, false);
assert.equal(lifespan?.executorStatus, 'not-applicable');

assert.match(aiBuilder, /const canonicalMode = Boolean\(questionId \|\| useCanonicalRetrieval === true\)/);
assert.match(aiBuilder, /buildKashfCanonicalAiBridge\(\{/);

assert.match(app, /window\.KASHF_ENGINE\.buildKashfReading\(kashfBoard, kashfTopicId, clientCtx\)/);

const legacyExactRoutes = [...new Set([...legacyRouter.matchAll(/'(q-[^']+)'\s*:\s*\{/g)].map((m) => m[1]))];
assert.equal(legacyExactRoutes.length, 30, 'legacy exact-router baseline changed; re-audit Phase 5B assumptions');
assert.equal(questionIds.filter((id) => !legacyExactRoutes.includes(id)).length, 108);

console.log('Phase 5A system integration assertions: PASS');
