# HALL_WISDOM_FIRST_LIVE_KASHF_PILOT_REPORT — Status: BLOCKED (not fabricated)

> This report documents why the first live Kashf run did **not** complete this session,
> rather than claim a result that didn't happen. No commit/push of this file or the
> runner script has been made — awaiting explicit approval per instructions.

---

## 1. Workflow-fix commit hash

`32026bc3951b7ae0c4b28e7b71bf74133321037c` — "Restrict Edge Function deploy to manual trigger only". Already committed and pushed to `claude/app-cleanup-organization-mia9b2` **before** this pilot attempt (as part of the Safety Verification step). No new commit was needed for Stage A — `git status`/`git diff` were clean, confirming nothing else changed.

## 2. workflow_dispatch-only confirmed

`.github/workflows/deploy-supabase-functions.yml` contains only `workflow_dispatch: {}` — no `push`, no `pull_request`. Verified functionally: the commit that removed the `push` trigger did **not** spawn a new Actions run (checked via `list_workflow_runs` — still only run #1 and run #2, both pre-dating this change), and a manual `workflow_dispatch` call via the GitHub API succeeded (run #2, `conclusion: success`) even without merging to `main`. PR #21 remains open/draft/unmerged (head SHA matches latest commit — GitHub auto-updates the PR diff on push, no separate action needed).

## 3. Live 401 result

**Not run.** Blocked before reaching this step — see §8.

## 4. Real payload source

**Not available.** Investigated three options per instructions:
- The only existing candidate, `REAL_CONTEXT_PACKAGE` in `_test_oren_smart_advisor_kashf_reading_payload.mjs`, is a synthetic unit-test fixture (`engineOutput.clientWording: '...'`, truncated placeholder `sourceEvidence`) — not genuine engine output. Rejected as a source per the no-invented-data rule.
- No archived real reading with `board`/`engineOutput` and no personal data was found.
- A local run of the real engine is *possible* — `buildRamlBoardFromMothers` (raml-board-generator.js) → `buildKashfReading` (kashf-reading-engine.js) → `runRuleDecisionEngine` (rule-decision-engine.js, genuine `sourceEvidence` from the Knowledge Registry) all exist as real, working code — but **no function in the codebase currently wires these three into an `AiContextPackage`** matching `ai-context-package.ts`'s shape. Building that wiring is itself an architecture decision (how `questionType`/`primaryIntent`/`readingStrategy`/`readingPlan` get derived from real engine output) that hasn't been reviewed or approved. Improvising it inline during this pilot would mean inventing an unreviewed data mapping — exactly what was ruled out.

## 5. Question/board summary

Not applicable — no real payload was available to summarize.

## 6. Real Anthropic response received?

**No.** No live call was made.

## 7. Model ID used

Not applicable — no call made.

## 8. Token usage / 9. Latency / 10. Invocation Log status

Not applicable — no call made. Root cause, discovered and re-confirmed twice this session: **this sandboxed session's outbound network policy blocks direct connections to `hfdsoudhelzayimjwqkp.supabase.co`** (proxy returns `403 Forbidden` on the CONNECT tunnel; confirmed via `curl -v` and the proxy's own status log showing `connect_rejected` / "policy denial"). This is an environment-level restriction, not something fixable by retrying, changing headers, or code changes. It applies equally to the 401 preflight test and the live call — nothing in Stage B could execute here regardless of the payload/credential gaps in §4 below.

## 11. Full sanitized advisor answer

Not applicable — no call made.

## 12. Advisor Acceptance Criteria (§13–18)

Not applicable — no output to evaluate.

## 19. needsOrenDecision

Not applicable.

## 20. live403TestStatus

`pending-test-user` (per instructions — no second allowlisted-Auth-but-non-allowlisted-UID test user exists, and none was created for this round, as directed).

## 21. The exact next step

Three independent things must be true simultaneously before a live Kashf pilot can actually run — currently zero of the three are:

1. **Network access**: this pilot needs to run from an environment whose outbound policy allows `https://hfdsoudhelzayimjwqkp.supabase.co` — either a different session/environment, or your own device/terminal running `_test_oren_smart_advisor_kashf_live_runner.mjs` directly (Node 22+, no other dependencies).
2. **Credentials**: `SUPABASE_FUNCTION_URL` and `SUPABASE_USER_JWT` set as environment variables in whatever shell runs the script — see the runner's own stop-message for exact, safe steps to obtain the JWT (browser DevTools → local storage → Supabase auth token → `export` in your terminal, never pasted here).
3. **A real payload**: someone needs to decide how to wire `buildRamlBoardFromMothers` + `buildKashfReading` + `runRuleDecisionEngine` into a real `AiContextPackage` (or otherwise capture a genuine reading's board/engineOutput/rule-decisions), then point `KASHF_REAL_PAYLOAD_PATH` at the resulting JSON file. This is a small-but-real design decision that should get its own explicit sign-off before being built, per the project's no-architecture-changes-without-permission rule.

**Recommendation:** resolve #3 first (it's pure local Node work, no network needed, so it can be built and reviewed entirely inside this session) — then tackle #1/#2 together in whichever environment/terminal has both real network access and Oren's real session token.

---

## Files touched this round (uncommitted, awaiting approval)

- `_test_oren_smart_advisor_kashf_live_runner.mjs` (new) — syntax-checked (`node --check`), and dry-run-verified to correctly stop (exit 1, no secrets printed) when `SUPABASE_FUNCTION_URL` is unset.
- `HALL_WISDOM_FIRST_LIVE_KASHF_PILOT_REPORT.md` (this file, new)

No other files changed. No deploy performed. No merge to `main`. No UI touched.
