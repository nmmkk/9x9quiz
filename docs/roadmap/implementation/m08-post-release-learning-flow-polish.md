# Milestone 8 - Post-release Learning Flow Polish

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M8-01 | Add session progress gauge/icon feedback during quiz | Completed | M4-06, M7-05 | `npm run test`, `npm run build`, `npm run dev` |
| M8-02 | Add direct jump from table performance cards to focused practice | Planned | M4-06, M7-05 | `npm run test`, `npm run build`, `npm run dev` |
| M8-03 | Add protected local progress reset flow | Planned | M4-06, M7-05 | `npm run test`, `npm run build`, `npm run dev` |
| M8-04 | Execute M8 QA pass and sync status docs | Planned | M8-01, M8-02, M8-03 | `npm run test`, `npm run build`, `npm run dev`, `docs/qa/reports/` |

## Scope

* Goal:
  * Improve post-release motivation and repeat-play convenience without increasing cognitive load.
  * Shorten the path from performance awareness to the next focused practice action.
  * Support safe session restart for shared-device households.
* Out of scope:
  * New game modes (for example timed/challenge mode).
  * Account sync, cloud backup, or multi-device profile features.
  * Native wrapper implementation work (`M6-02` onward).

## M8-01 - Add session progress gauge/icon feedback during quiz

**Objective**

Make current run progress obvious at a glance to increase completion momentum.

**Deliverables**

* Add a lightweight visual progress indicator (gauge and/or icon states) in quiz UI.
* Keep indicator readable in both mobile portrait and desktop layouts.
* Ensure progress signal updates deterministically as each answer is submitted.

**File/Class Skeleton**

```text
src/features/quiz/ui/QuizScreen.tsx
src/features/quiz/ui/SessionProgressIndicator.tsx
src/styles/app.css
src/shared/i18n/catalog.ts
```

**Acceptance Criteria**

* User can infer answered count and remaining count without reading dense text.
* Indicator does not overlap or push critical quiz controls off-screen at ~360x640.
* Existing answer/scoring behavior remains unchanged.

**Dependencies**

* M4-06
* M7-05

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`

## M8-01 Progress Notes

* Added quiz-run progress UI with a compact gauge + icon feedback in `src/features/quiz/ui/SessionProgressIndicator.tsx` and integrated it from `src/features/quiz/ui/QuizScreen.tsx`.
* Added i18n keys and copy for progress labels in `src/shared/i18n/types.ts` and `src/shared/i18n/catalog.ts`.
* Added styling for progress gauge/icon states in `src/styles/app.css`.
* Added focused UI rendering coverage in `src/features/quiz/ui/__tests__/SessionProgressIndicator.test.tsx`.
* Validation evidence (2026-02-28): `npm run test` (pass, 15 files / 57 tests), `npm run build` (pass, injectManifest precache 8 entries / 248.89 KiB), `npm run dev -- --host 127.0.0.1 --port 4301 --strictPort` (booted).

## M8-02 - Add direct jump from table performance cards to focused practice

**Objective**

Reduce friction by allowing one-step transition from mastery visibility to targeted table practice.

**Deliverables**

* Add action affordance on each table performance card to start that table's practice immediately.
* Wire selected table into quiz session setup as focused scope.
* Preserve existing mode/start flow for users who prefer the current path.

**File/Class Skeleton**

```text
src/features/progress/ui/MasteryPanel.tsx
src/features/mode/ui/ModeSelectScreen.tsx
src/features/quiz/domain/practiceScope.ts
src/features/quiz/state/useQuizSession.ts
```

**Acceptance Criteria**

* User can start focused practice from a table card in a single direct action.
* Target table selection is correctly reflected in generated questions.
* Existing quick-start and regular mode-select entry points continue to work.

**Dependencies**

* M4-06
* M7-05

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`

## M8-03 - Add protected local progress reset flow

**Objective**

Allow guardians to reset local progress safely on shared devices without accidental data loss.

**Deliverables**

* Add reset entry point in a low-risk location (for example settings/help area on Title or Mode screen).
* Add explicit confirmation step with clear warning copy.
* Clear local progress-related records while keeping app boot and play flow stable.

**File/Class Skeleton**

```text
src/features/title/ui/TitleScreen.tsx
src/features/mode/ui/ModeSelectScreen.tsx
src/shared/storage/highScoreStorage.ts
src/shared/storage/masteryStorage.ts
src/shared/storage/practiceScopeStorage.ts
src/shared/i18n/catalog.ts
```

**Acceptance Criteria**

* Reset action requires explicit confirmation before any storage is cleared.
* After reset, progress indicators/high score return to initial state.
* App remains fully playable immediately after reset with no reload required.

**Dependencies**

* M4-06
* M7-05

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`

## M8-04 - Execute M8 QA pass and sync status docs

**Objective**

Validate M8 behavior end-to-end and synchronize roadmap/status documentation.

**Deliverables**

* Run manual checks for progress indicator readability, direct-jump practice flow, and reset confirmation safety.
* Record QA evidence under `docs/qa/reports/`.
* Sync milestone/status docs after validation.

**File/Class Skeleton**

```text
docs/qa/reports/
docs/current-state.md
docs/next-steps.md
docs/roadmap/milestones.md
docs/roadmap/implementation/build-order.md
```

**Acceptance Criteria**

* QA report covers desktop and mobile smoke behavior on published URL.
* Milestone/ticket statuses are synchronized across docs.
* Follow-up backlog items are explicit if any M8 non-blockers are deferred.

**Dependencies**

* M8-01
* M8-02
* M8-03

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`
