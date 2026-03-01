# Current State

Last updated: 2026-02-28

## Milestone Status

| Milestone | State | Evidence | Notes |
| --- | --- | --- | --- |
| M1 | Completed | `npm run test` (pass, 9 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4177 --strictPort` (booted); `docs/qa/reports/2026-02-14-m01-qa.md` | M1-01 through M1-07 are complete, including manual desktop and iOS verification. |
| M2 | Completed | `npm run test` (pass, 5 files / 19 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4183 --strictPort` (booted); `docs/qa/reports/2026-02-14-m02-qa.md` | M2-01 through M2-06 are complete. Japanese-first localization foundation, copy refinement, UI adjustments, i18n regression tests, and manual post-fix checks on PC/iOS are all confirmed. |
| M3 | Completed | `M3-01` through `M3-05` completed in `docs/roadmap/implementation/m03-repeat-engagement-loop.md`; `npm run test` (pass, 7 files / 26 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4203 --strictPort` (booted); `docs/qa/reports/2026-02-14-m03-qa.md` | M3 replay loop delivery is complete: quick start, feedback-message variation, lightweight effects, regression tests, and QA/status synchronization are all done. |
| M4 | Completed | `M4-01` through `M4-06` completed in `docs/roadmap/implementation/m04-adaptive-practice-depth.md`; `npm run test` (pass, 11 files / 44 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4216 --strictPort` (booted); `docs/qa/reports/2026-02-15-m04-qa.md` | Adaptive practice depth is complete: table-range controls, missed-fact mini-review, mastery visibility, and regression coverage are verified with user-confirmed PC/iOS QA. |
| M5 | Completed | `M5-01` through `M5-04` completed in `docs/roadmap/implementation/m05-offline-ready-pwa-foundation.md`; `npm run test` (pass, 14 files / 55 tests); `npm run build` (pass, injectManifest precache 8 entries / 246.91 KiB); `npm run dev -- --host 127.0.0.1 --port 4260 --strictPort` (booted); `docs/qa/reports/2026-02-18-m05-qa-rerun.md`; `docs/qa/reports/2026-02-18-m05-qa-rerun-2.md`; user-confirmed manual offline and install verification on PC/iOS/mobile | Offline app-shell caching, deterministic update notice flow, install affordance, and final mobile re-check are complete; M5 is closed and ready for M6 kickoff. |
| M6 | Partial | `M6-01` completed in `docs/roadmap/implementation/m06-native-packaging-pilot.md`; `npm run build` (pass) | Wrapper approach decision is documented and aligned: Capacitor selected. `M6-02` onward is intentionally deferred while web release CI/CD is prioritized. |
| M7 | Completed | `M7-01` through `M7-05` completed in `docs/roadmap/implementation/m07-web-release-cicd.md`; `.github/workflows/deploy.yml` runs after successful `CI` on `main`, restricts manual dispatch to `main`, validates green `test-build`, and rejects stale rerun SHA; `docs/qa/reports/2026-02-23-m07-03-closeout.md`; `docs/qa/reports/2026-02-23-m07-04-checklist-dry-run.md`; `docs/qa/reports/2026-02-23-m07-05-launch-qa-pass.md`; CI run `22296144653` (success); Deploy Pages run `22296154268` (success); published URL `https://nmmkk.github.io/9x9quiz/` verified reachable; user-confirmed mobile smoke verification | Web release CI/CD milestone is complete end-to-end with production deployment, launch QA evidence, and rollback guardrails in place. |
| M8 | Partial | `M8-01` and `M8-02` completed in `docs/roadmap/implementation/m08-post-release-learning-flow-polish.md`; `npm run test` (pass, 16 files / 59 tests); `npm run build` (pass, injectManifest precache 8 entries / 249.50 KiB); `npm run dev -- --host 127.0.0.1 --port 4302 --strictPort` (booted) | Post-release learning flow polish is in progress: session progress feedback and mastery-card direct jump are shipped, with reset-flow ticket (`M8-03`) queued before `M8-04` QA/doc sync. |

## Current Canonical Sources

* Detailed tickets: `docs/roadmap/implementation/README.md`
* Product core value: `docs/reference/core-value.md`
* Improvement backlog: `docs/roadmap/improvement-ideas.md`
* Release gate: `docs/release/checklist.md`
* Active queue: `docs/next-steps.md`
