# Milestone 3 - Repeat Engagement Loop

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M3-01 | Add title quick-start flow using last played mode | Completed | M2-06 | `npm run test`, `npm run build`, `npm run dev` |
| M3-02 | Add positive feedback message variation framework | Completed | M3-01 | `npm run test`, `npm run build` |
| M3-03 | Add lightweight feedback effects with accessibility guardrails | Completed | M3-02 | `npm run build`, `npm run dev` |
| M3-04 | Add engagement-related regression tests | Completed | M3-01, M3-02, M3-03 | `npm run test`, `npm run build` |
| M3-05 | Execute QA pass and sync status docs | Planned | M3-01, M3-02, M3-03, M3-04 | `npm run test`, `npm run build`, `npm run dev`, `docs/qa/reports/` |

## Scope

* Goal:
  * Increase voluntary replay loops for grade-2 learners without adding complex rules.
  * Improve moment-to-moment emotional reward while preserving simple controls.
  * Keep all new behavior aligned with `docs/reference/core-value.md`.
* Out of scope:
  * Timed/challenge modes and advanced scoring formulas.
  * Backend analytics and account systems.
  * Offline/PWA packaging work (scheduled in M5).

## M3-01 - Add title quick-start flow using last played mode

**Objective**

Reduce start friction by enabling one-tap quiz start from Title when a last-played mode exists.

**Deliverables**

* Add storage helper for last played mode (`10` or `20`).
* Save last played mode when a quiz starts from Mode Select or replay starts from Result.
* Add a quick-start action on Title using stored mode.
* Keep existing Mode Select path available.

**File/Class Skeleton**

```text
src/shared/storage/lastPlayedModeStorage.ts
src/App.tsx
src/features/title/ui/TitleScreen.tsx
src/shared/i18n/types.ts
src/shared/i18n/catalog.ts
```

**Acceptance Criteria**

* If a previous mode exists, user can start quiz in one tap from Title.
* If no previous mode exists, behavior falls back cleanly to current flow.
* Existing result replay behavior and mode-specific high-score behavior are unchanged.

**Dependencies**

* M2-06

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`

## M3-02 - Add positive feedback message variation framework

**Objective**

Avoid repetitive copy by rotating short encouraging messages in key replay moments.

**Deliverables**

* Add typed message-variant utility with no-immediate-repeat behavior.
* Add multiple localized variants for new-high-score and replay encouragement messages.
* Use variation utility in Result and relevant feedback UI.

**File/Class Skeleton**

```text
src/shared/feedback/messageVariants.ts
src/shared/i18n/types.ts
src/shared/i18n/catalog.ts
src/features/result/ui/ResultScreen.tsx
```

**Acceptance Criteria**

* At least 3 localized variants exist for each targeted message group.
* Same variant is not shown twice in a row when alternatives exist.
* Copy remains grade-2 friendly and short.

**Dependencies**

* M3-01

**Validation**

* `npm run test`
* `npm run build`

## M3-03 - Add lightweight feedback effects with accessibility guardrails

**Objective**

Increase quiz enjoyment with lightweight visual feedback that does not slow answer flow.

**Deliverables**

* Add short correct-answer feedback effect (non-blocking).
* Add subtle Result screen entry effect for session completion.
* Respect `prefers-reduced-motion` to disable heavy transitions.

**File/Class Skeleton**

```text
src/features/quiz/ui/QuizScreen.tsx
src/features/result/ui/ResultScreen.tsx
src/styles/app.css
src/styles/theme.css
```

**Acceptance Criteria**

* Effects complete quickly and do not block inputs.
* Reduced-motion users see static alternatives without animation flicker.
* Mobile portrait layout remains stable (~360x640 baseline).

**Dependencies**

* M3-02

**Validation**

* `npm run build`
* `npm run dev`

## M3-04 - Add engagement-related regression tests

**Objective**

Lock in new engagement behavior and prevent regressions in existing quiz logic.

**Deliverables**

* Add tests for last played mode storage helper.
* Add tests for message-variation no-repeat behavior.
* Re-run existing i18n, quiz domain, and high-score tests.

**File/Class Skeleton**

```text
src/shared/storage/__tests__/lastPlayedModeStorage.test.ts
src/shared/feedback/__tests__/messageVariants.test.ts
src/shared/i18n/__tests__/*.test.ts
src/features/quiz/domain/__tests__/*.test.ts
src/shared/storage/__tests__/highScoreStorage.test.ts
```

**Acceptance Criteria**

* New tests pass consistently.
* Existing test suites remain green.
* Build remains successful with no type errors.

**Dependencies**

* M3-01
* M3-02
* M3-03

**Validation**

* `npm run test`
* `npm run build`

## M3-05 - Execute QA pass and sync status docs

**Objective**

Validate replay engagement behavior end-to-end and synchronize roadmap/status docs.

**Deliverables**

* Run manual flow checks for quick start and replay loop.
* Verify message variation behavior and reduced-motion handling.
* Record QA evidence under `docs/qa/reports/`.
* Sync status docs after validation.

**File/Class Skeleton**

```text
docs/qa/reports/
docs/current-state.md
docs/next-steps.md
docs/roadmap/milestones.md
docs/roadmap/implementation/build-order.md
```

**Acceptance Criteria**

* QA report includes replay-loop and accessibility checks.
* Milestone and ticket statuses are synchronized across status docs.
* No unresolved blocking defects remain for M3 scope.

**Dependencies**

* M3-01
* M3-02
* M3-03
* M3-04

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`
