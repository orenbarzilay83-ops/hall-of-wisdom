# Hall of Wisdom — Full Application + Branch Hygiene Audit
Date: 2026-09-23

## Executive result

The active downstream branch is healthy and deployable after a full repository-wide audit.

Active branch:
`chatgpt/kashf-downstream-batch05-p100-101-months`

Current head at audit close:
`395d219d5f770e844b162c7ef90042c20fef5922`

Vercel: SUCCESS.

The active branch is:
- 38 commits ahead / 0 behind `codex/kashf-phase4-v57-corrections-p44-53`;
- 101 commits ahead / 0 behind `main`.

No open pull requests exist at audit time.

## Full application QA

Dedicated full-app audit run:
GitHub Actions run `35864905846` — SUCCESS.

### Repository / syntax

- repository sanity: PASS;
- JavaScript/MJS syntax: 285 files PASS;
- only one-time `_apply_*.mjs` patchers were excluded from direct syntax checking because their dedicated workflow patches their nested template literals before execution;
- stale syntax defect in `raml-data/raml-spiritual-diagnostics.js` was repaired (missing comma only; no rule semantics changed).

### Key page smoke

All returned HTTP 200 from a local static server:

- `index.html`
- `calculator.html`
- `goral-hachol.html`
- `cards.html`
- `myseal.html`

21 local file references across the five key pages were checked and none was missing.

### Regression suite

Summary:
- passed: 49
- failed: 0
- skipped: 1

The single skipped file is:
`_test_oren_smart_advisor_kashf_live_runner.mjs`

It is intentionally not a repository-local CI test because it requires:
- a real Supabase user JWT;
- a real deployed function URL;
- a genuine pre-built Kashf AiContextPackage.

It explicitly fails closed when those inputs are absent.

### Major verified subsystems

- Oren Advisor browser UI / Playwright: PASS.
- Cartomancy engine: PASS.
- Hall Wisdom engine registry: PASS.
- Seasonal astro profile engine: PASS.
- Kashf AI Retrieval Index: 520/0.
- Kashf AI Retrieval Live Bridge: 145/0.
- Kashf Canonical Routing: 1535/0.
- Kashf Professional Verdict Safety: 423/0.
- Question route coverage: 138/138, 100%.
- Batch 03 p97–99 dignity regression: PASS.
- Batch 04 p100 joy/grief regression: PASS.
- Batch 05 p100–101 month map regression: PASS.
- Context/privacy/auth/server gates: PASS.
- Kashf/Hawi isolation: PASS.
- Goral QA / rule applicability / book rule catalog: PASS.

## Repairs made during this audit

### 1. Six stale Hawi test imports

The following tests imported a file that no longer exists:
`goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js`

The canonical aggregate module `hawi-foundations.js` already re-exports
`HAWI_FIGURE_NAMES`, so only the stale test import paths were repaired:

- `_test_client_reading.mjs`
- `_test_complex_extraction.mjs`
- `_test_demo_reading.mjs`
- `_test_engine.mjs`
- `_test_full_topics.mjs`
- `_test_new_topics.mjs`

No production engine behavior changed.

### 2. Historical disconnected spiritual diagnostics syntax

`raml-data/raml-spiritual-diagnostics.js` had one documented pre-existing
syntax defect: a missing comma before `status`.

The comma was restored. No source rule, mapping, interpretation, or runtime
connection was added.

## Branch inventory

Total remote branches at audit time: **58**.

PR relation:
- 25 branches have at least one merged PR in their history;
- 31 branches have no PR;
- 2 branches have closed-unmerged PR history;
- 0 open PRs.

This means branch hygiene is **not fully clean**: there are historical,
duplicate, temp, and diverged branches that should not be treated as current
work.

### Current canonical source/downstream line

Keep as current working line:
- `main`
- `codex/kashf-phase4-v57-corrections-p44-53` (source-layer checkpoint)
- `chatgpt/kashf-downstream-batch05-p100-101-months` (current active branch)

The two recent batch checkpoint branches are fully contained in the current
active branch and have no unique work:
- `chatgpt/kashf-downstream-batch03-p97-99`
- `chatgpt/kashf-downstream-batch04-p100`

They are safe branch-prune candidates after confirming the repository owner
wants historical branch refs removed.

### Runtime-history duplicates / safe-prune candidates after owner approval

These are contained in or identical to
`claude/app-cleanup-organization-mia9b2` and are not the current source-layer
workstream:

- `chatgpt/kashf-close-eight-runtime-gaps`
- `chatgpt/kashf-close-eight-runtime-gaps-qa`
- `chatgpt/kashf-phase5b-canonical-client-path-v2`
- `chatgpt/kashf-phase5c-client-ai-parity-audit`
- `chatgpt/kashf-phase5d-canonical-topic-authority`

Do not delete the runtime-history base itself until source/downstream work is
finished and its later reconciliation is planned.

### Branches that require review before pruning

These have divergent or unique commits and must not be deleted automatically:

- `tmp/kashf-rr-count`
- `codex/kashf-index-super-audit-work`
- `codex/kashf-super-audit-pass2-p97-101-work`
- `codex/kashf-super-audit-pass2-p167-180`
- `feature/raml-astro-profile`
- old `claude/*` website / sand-fate branches with unique divergent commits
- `chatgpt/personal-psalm-full-export` (intentional standalone export; 2 unique commits relative to current downstream line)

Special branches:
- `gh-pages` — do not prune casually.
- `merge-inner-compass` — historical feature branch; keep until its integration status is deliberately closed.

## Workflow hygiene

Temporary full-audit workflow was removed after the successful run.

The active branch now contains only the standing workflows:
- `deploy-supabase-functions.yml`
- `kashf-ai-retrieval-index-tests.yml`
- `kashf-apply-final-route-coverage.yml`
- `kashf-canonical-routing-tests.yml`

## Decision before continuing

Application/runtime health: GREEN.

Branch hygiene: YELLOW — no active conflict is blocking the app, but the
repository has a significant historical branch backlog. Safe pruning should be
done deliberately, not by deleting every no-PR branch.

The next source-ordered downstream task remains:
`B04-DATA-WITNESS-NUMERAL` (printed pp101–102).

Do not begin it until branch-cleanup policy is confirmed.
