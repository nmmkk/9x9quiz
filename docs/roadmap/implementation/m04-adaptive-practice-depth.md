# Milestone 4 - Adaptive Practice Depth

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M4-01 | Add practice scope model and persistence | Completed | M3-05 | `npm run test`, `npm run build` |
| M4-02 | Build table-range options in mode selection | Completed | M4-01 | `npm run test`, `npm run build`, `npm run dev` |
| M4-03 | Implement missed-fact mini-review (3 questions) | Completed | M4-01, M4-02 | `npm run test`, `npm run build`, `npm run dev` |
| M4-04 | Add table mastery visibility panel | Completed | M4-01, M4-03 | `npm run test`, `npm run build` |
| M4-05 | Add adaptive-practice regression tests | Completed | M4-01, M4-02, M4-03, M4-04 | `npm run test`, `npm run build` |
| M4-06 | Execute QA pass and sync status docs | Completed | M4-01, M4-02, M4-03, M4-04, M4-05 | `npm run test`, `npm run build`, `npm run dev`, `docs/qa/reports/` |

## Scope

* Goal:
  * Improve retention by targeting weak ranges and immediately revisiting missed facts.
  * Preserve simple and understandable controls for grade-2 learners.
  * Surface progress in a lightweight way that encourages continuation.
* Out of scope:
  * Competitive ranking systems and online leaderboards.
  * Timed challenge pressure modes.
  * Cross-device synchronization.

## M4-01 - Add practice scope model and persistence

**Objective**

Introduce a typed model to represent selected multiplication-table practice ranges.

**Deliverables**

* Add domain type for practice scope (for example: all, lower-range, upper-range, custom tables).
* Add storage helper for selected scope.
* Extend quiz session setup to accept scope constraints.

**File/Class Skeleton**

```text
src/features/quiz/domain/practiceScope.ts
src/shared/storage/practiceScopeStorage.ts
src/features/quiz/state/useQuizSession.ts
src/App.tsx
```

**Acceptance Criteria**

* Scope selection persists between app launches.
* Quiz generation respects selected scope only.
* Default behavior remains equivalent to all tables when unset.

**Dependencies**

* M3-05

**Validation**

* `npm run test`
* `npm run build`

## M4-02 - Build table-range options in mode selection

**Objective**

Allow learners or guardians to select focused practice ranges before starting a session.

**Deliverables**

* Add table-range selection UI to Mode Select.
* Add simple presets that do not overload users.
* Keep start flow concise and compatible with quick-start defaults.

**File/Class Skeleton**

```text
src/features/mode/ui/ModeSelectScreen.tsx
src/features/mode/ui/PracticeScopeSelector.tsx
src/shared/i18n/types.ts
src/shared/i18n/catalog.ts
src/styles/app.css
```

**Acceptance Criteria**

* User can select scope in at most a few taps.
* Scope labels remain readable on mobile portrait.
* Existing mode selection and high-score display remain stable.

**Dependencies**

* M4-01

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`

## M4-03 - Implement missed-fact mini-review (3 questions)

**Objective**

Offer immediate reinforcement by replaying recently missed facts in a short follow-up round.

**Deliverables**

* Add Result action to launch a 3-question missed-fact review when missed facts exist.
* Build dedicated mini-review session state using missed-fact set.
* Keep mini-review optional and easy to skip.

**File/Class Skeleton**

```text
src/features/result/ui/ResultScreen.tsx
src/features/quiz/state/useQuizSession.ts
src/features/quiz/ui/QuizScreen.tsx
src/App.tsx
```

**Acceptance Criteria**

* Mini-review button appears only when missed facts exist.
* Mini-review contains exactly 3 questions (or fewer if pool is smaller).
* User can exit mini-review cleanly back to Title/Mode flow.

**Dependencies**

* M4-01
* M4-02

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`

## M4-04 - Add table mastery visibility panel

**Objective**

Increase motivation by showing lightweight progress per multiplication table.

**Deliverables**

* Track per-table answered/correct counts in localStorage.
* Add simple mastery panel visible from Title or Mode Select.
* Use child-friendly visual language without dense stats.

**File/Class Skeleton**

```text
src/shared/storage/masteryStorage.ts
src/features/title/ui/TitleScreen.tsx
src/features/mode/ui/ModeSelectScreen.tsx
src/features/progress/ui/MasteryPanel.tsx
src/shared/i18n/catalog.ts
```

**Acceptance Criteria**

* Mastery panel updates after sessions complete.
* Display remains readable at ~360x640 and desktop.
* Stats remain local-only with no backend dependency.

**Dependencies**

* M4-01
* M4-03

**Validation**

* `npm run test`
* `npm run build`

## M4-05 - Add adaptive-practice regression tests

**Objective**

Protect adaptive-practice behavior with deterministic tests and no regressions in core rules.

**Deliverables**

* Add tests for practice scope filtering.
* Add tests for mini-review trigger and session length.
* Add tests for mastery storage read/write logic.

**File/Class Skeleton**

```text
src/features/quiz/domain/__tests__/practiceScope.test.ts
src/features/quiz/state/__tests__/useQuizSession.test.ts
src/shared/storage/__tests__/masteryStorage.test.ts
```

**Acceptance Criteria**

* New adaptive-practice tests pass consistently.
* Existing scoring, weighting, and i18n tests remain green.
* Build remains successful with no type errors.

**Dependencies**

* M4-01
* M4-02
* M4-03
* M4-04

**Validation**

* `npm run test`
* `npm run build`

## M4-06 - Execute QA pass and sync status docs

**Objective**

Validate adaptive-practice flow end-to-end and synchronize roadmap/status docs.

**Deliverables**

* Run manual checks for scope selection, mini-review launch, and mastery visibility.
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

* QA report includes targeted adaptive-practice scenarios.
* Milestone/ticket statuses are synchronized across docs.
* No unresolved blocking defects remain for M4 scope.

**Dependencies**

* M4-01
* M4-02
* M4-03
* M4-04
* M4-05

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`
