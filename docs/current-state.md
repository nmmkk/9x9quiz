# Current State

Last updated: 2026-02-14

## Milestone Status

| Milestone | State | Evidence | Notes |
| --- | --- | --- | --- |
| M1 | Completed | `npm run test` (pass, 9 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4177 --strictPort` (booted); `docs/qa/reports/2026-02-14-m01-qa.md` | M1-01 through M1-07 are complete, including manual desktop and iOS verification. |
| M2 | Completed | `npm run test` (pass, 5 files / 19 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4183 --strictPort` (booted); `docs/qa/reports/2026-02-14-m02-qa.md` | M2-01 through M2-06 are complete. Japanese-first localization foundation, copy refinement, UI adjustments, i18n regression tests, and manual post-fix checks on PC/iOS are all confirmed. |
| M3 | Completed | `M3-01` through `M3-05` completed in `docs/roadmap/implementation/m03-repeat-engagement-loop.md`; `npm run test` (pass, 7 files / 26 tests); `npm run build` (pass); `npm run dev -- --host 127.0.0.1 --port 4203 --strictPort` (booted); `docs/qa/reports/2026-02-14-m03-qa.md` | M3 replay loop delivery is complete: quick start, feedback-message variation, lightweight effects, regression tests, and QA/status synchronization are all done. |
| M4 | Partial | `M4-01` completed in `docs/roadmap/implementation/m04-adaptive-practice-depth.md`; `npm run test` (pass, 9 files / 34 tests); `npm run build` (pass) | Practice scope model and persistence are complete; quiz session setup now applies scope constraints while default behavior remains all tables. |
| M5 | Planned | `docs/roadmap/implementation/m05-offline-ready-pwa-foundation.md` | Focus: offline-after-first-load behavior and installable PWA baseline. |
| M6 | Planned | `docs/roadmap/implementation/m06-native-packaging-pilot.md` | Focus: native packaging pilot for iOS/Android delivery preparation. |

## Current Canonical Sources

* Detailed tickets: `docs/roadmap/implementation/README.md`
* Product core value: `docs/reference/core-value.md`
* Improvement backlog: `docs/roadmap/improvement-ideas.md`
* Release gate: `docs/release/checklist.md`
* Active queue: `docs/next-steps.md`
