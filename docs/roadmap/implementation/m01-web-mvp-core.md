# Milestone 1 - Web MVP Core Quiz Loop

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M1-01 | Initialize web app foundation | Planned | None. | - |
| M1-02 | Implement quiz domain engine and weighted draw | Planned | M1-01 | - |
| M1-03 | Build quiz play screen and numeric input pad | Planned | M1-02 | - |
| M1-04 | Build title and mode select flow | Planned | M1-01 | - |
| M1-05 | Implement result flow and high score persistence | Planned | M1-03, M1-04 | - |
| M1-06 | Apply pixel-art responsive UI polish | Planned | M1-03, M1-04, M1-05 | - |
| M1-07 | Run QA pass and sync status docs | Planned | M1-01, M1-02, M1-03, M1-04, M1-05, M1-06 | - |

## Scope

* Goal:
  * Deliver a complete fixed-length quiz experience with 10/20/30 modes.
  * Reinforce learning by showing correct answers and re-weighting missed facts.
  * Persist per-mode high score locally and finish with a result summary.
* Out of scope:
  * Login or backend services.
  * Timed mode and advanced score bonuses.
  * Native mobile apps and offline packaging.

## M1-01 - Initialize web app foundation

**Objective**

Create a clean front-end baseline that can ship the V1 quiz without backend dependencies.

**Deliverables**

* Initialize project with React + TypeScript + Vite.
* Add baseline scripts for dev, test, and build.
* Create app shell with screen-level state routing.
* Add initial folder structure for features and shared utilities.

**File/Class Skeleton**

```text
package.json
tsconfig.json
vite.config.ts
src/main.tsx
src/App.tsx
src/features/
src/shared/
```

**Acceptance Criteria**

* `npm run dev` boots the app locally.
* `npm run build` completes successfully.
* App renders a placeholder Title screen entry point.

**Dependencies**

* None.

**Validation**

* `npm run build`

## M1-02 - Implement quiz domain engine and weighted draw

**Objective**

Implement deterministic quiz-domain logic for problem generation, answer checking, scoring, and missed-fact weighting.

**Deliverables**

* Create `1..9 x 1..9` fact generator.
* Add weighted random draw logic with +30% weight for missed facts.
* Add score utility (`+10` per correct).
* Add tests for weighting and no-immediate-repeat behavior.

**File/Class Skeleton**

```text
src/features/quiz/domain/facts.ts
src/features/quiz/domain/draw.ts
src/features/quiz/domain/scoring.ts
src/features/quiz/domain/__tests__/draw.test.ts
src/features/quiz/domain/__tests__/scoring.test.ts
```

**Acceptance Criteria**

* Fact pool contains exactly 81 ordered facts.
* Missed facts are drawn with weight `1.3` vs baseline `1.0`.
* Immediate repeat of the prior fact is prevented when alternatives exist.
* Domain tests pass.

**Dependencies**

* M1-01

**Validation**

* `npm run test`

## M1-03 - Build quiz play screen and numeric input pad

**Objective**

Ship the main quiz interaction loop with button-based numeric input and explicit incorrect-answer feedback.

**Deliverables**

* Build quiz screen with progress, score, and current fact display.
* Build on-screen numeric pad (`0-9`, `Clear`, `Backspace`, `Submit`).
* Enforce max 2-digit input and empty-submit guard.
* Add incorrect-answer overlay showing correct answer and requiring `Next`.

**File/Class Skeleton**

```text
src/features/quiz/ui/QuizScreen.tsx
src/features/quiz/ui/NumericPad.tsx
src/features/quiz/ui/IncorrectAnswerOverlay.tsx
src/features/quiz/state/useQuizSession.ts
```

**Acceptance Criteria**

* User can answer every question using only on-screen controls.
* Incorrect answer always reveals the correct answer before progression.
* Submit action is disabled for empty input.
* Session advances question-by-question until mode count is reached.

**Dependencies**

* M1-02

**Validation**

* `npm run dev`

## M1-04 - Build title and mode select flow

**Objective**

Implement entry screens and mode selection to start a session with 10, 20, or 30 questions.

**Deliverables**

* Build Title screen with start path and high-score access.
* Build Mode Select screen with mode buttons (`10`, `20`, `30`).
* Connect navigation flow: Title -> Mode Select -> Quiz.
* Show mode-specific high score preview when available.

**File/Class Skeleton**

```text
src/features/title/ui/TitleScreen.tsx
src/features/mode/ui/ModeSelectScreen.tsx
src/shared/navigation/screenState.ts
```

**Acceptance Criteria**

* User can reach quiz start from title in at most two taps/clicks.
* Selected mode count controls session length.
* High score preview is rendered per mode.

**Dependencies**

* M1-01

**Validation**

* `npm run dev`

## M1-05 - Implement result flow and high score persistence

**Objective**

Complete end-of-session behavior with score summary and persistent mode-specific high score tracking.

**Deliverables**

* Build Result screen with score and correct-count summary.
* Add localStorage helpers for per-mode high score keys.
* Update high score only on strict improvement.
* Add replay actions (`Play Again`, `Title`).

**File/Class Skeleton**

```text
src/features/result/ui/ResultScreen.tsx
src/shared/storage/highScoreStorage.ts
```

**Acceptance Criteria**

* High score persists across page reload.
* Mode scores are isolated (`10`, `20`, `30`).
* Result screen clearly indicates when a new high score is set.

**Dependencies**

* M1-03
* M1-04

**Validation**

* `npm run dev`

## M1-06 - Apply pixel-art responsive UI polish

**Objective**

Apply the intended NES/SNES-like visual direction while preserving readability and touch usability.

**Deliverables**

* Add theme tokens (colors, spacing, borders, shadows).
* Style buttons/cards with pixel-game look.
* Ensure mobile portrait fit and centered desktop layout.
* Add focus/hover/pressed states for all actions.

**File/Class Skeleton**

```text
src/styles/theme.css
src/styles/reset.css
src/features/**/ui/*.css
```

**Acceptance Criteria**

* Core screens match pixel-art direction without sacrificing readability.
* No clipping/overflow at 360x640 viewport.
* Interactive targets are at least 44x44 px.

**Dependencies**

* M1-03
* M1-04
* M1-05

**Validation**

* `npm run build`

## M1-07 - Run QA pass and sync status docs

**Objective**

Validate the full MVP behavior and update planning/status docs to match implementation reality.

**Deliverables**

* Execute and record manual QA scenarios in `docs/qa/reports/`.
* Verify all V1 acceptance criteria from `docs/reference/design.md`.
* Update roadmap/status docs with factual completion state.
* Prepare release gate checklist for first public web deployment.

**File/Class Skeleton**

```text
docs/qa/reports/
docs/current-state.md
docs/next-steps.md
docs/roadmap/milestones.md
docs/release/checklist.md
```

**Acceptance Criteria**

* QA report exists and covers each core user flow.
* Planning docs and status docs are synchronized.
* Release checklist is complete for MVP scope.

**Dependencies**

* M1-01
* M1-02
* M1-03
* M1-04
* M1-05
* M1-06

**Validation**

* `npm run test`
* `npm run build`
