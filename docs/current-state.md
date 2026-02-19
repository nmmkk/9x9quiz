# Current State

Last updated: 2026-02-18

## Milestone Status

| Milestone | State | Evidence | Notes |
| --- | --- | --- | --- |
| M1 | Completed | `npm run test` (pass, 9 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4177 --strictPort` (booted); `docs/qa/reports/2026-02-14-m01-qa.md` | M1-01 through M1-07 are complete, including manual desktop and iOS verification. |
| M2 | Completed | `npm run test` (pass, 5 files / 19 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4183 --strictPort` (booted); `docs/qa/reports/2026-02-14-m02-qa.md` | M2-01 through M2-06 are complete. Japanese-first localization foundation, copy refinement, UI adjustments, i18n regression tests, and manual post-fix checks on PC/iOS are all confirmed. |
| M3 | Completed | `M3-01` through `M3-05` completed in `docs/roadmap/implementation/m03-repeat-engagement-loop.md`; `npm run test` (pass, 7 files / 26 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4203 --strictPort` (booted); `docs/qa/reports/2026-02-14-m03-qa.md` | M3 replay loop delivery is complete: quick start, feedback-message variation, lightweight effects, regression tests, and QA/status synchronization are all done. |
| M4 | Completed | `M4-01` through `M4-06` completed in `docs/roadmap/implementation/m04-adaptive-practice-depth.md`; `npm run test` (pass, 11 files / 44 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4216 --strictPort` (booted); `docs/qa/reports/2026-02-15-m04-qa.md` | Adaptive practice depth is complete: table-range controls, missed-fact mini-review, mastery visibility, and regression coverage are verified with user-confirmed PC/iOS QA. |
| M5 | Partial | `M5-01` through `M5-03` are completed and `M5-04` is partial in `docs/roadmap/implementation/m05-offline-ready-pwa-foundation.md`; `npm run test` (pass, 14 files / 55 tests); `npm run build` (pass, injectManifest precache 8 entries / 246.91 KiB); `npm run dev -- --host 127.0.0.1 --port 4260 --strictPort` (booted); `docs/qa/reports/2026-02-18-m05-qa-rerun.md`; `docs/qa/reports/2026-02-18-m05-qa-rerun-2.md`; user-confirmed manual offline verification on PC/iOS (2026-02-17); user-reported manual install verification (PC pass, mobile page-load issue) | Offline app-shell caching, deterministic update notice flow, and installable metadata/install affordance are validated on PC; automated rerun evidence is refreshed, and mobile re-verification is required to close `M5-04`. |
| M6 | Planned | `docs/roadmap/implementation/m06-native-packaging-pilot.md` | Focus: native packaging pilot for iOS/Android delivery preparation. |

## Current Canonical Sources

* Detailed tickets: `docs/roadmap/implementation/README.md`
* Product core value: `docs/reference/core-value.md`
* Improvement backlog: `docs/roadmap/improvement-ideas.md`
* Release gate: `docs/release/checklist.md`
* Active queue: `docs/next-steps.md`
