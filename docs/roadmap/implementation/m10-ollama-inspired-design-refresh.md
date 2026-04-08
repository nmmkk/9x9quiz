# Milestone 10 - Ollama-Inspired Design Refresh

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M10-01 | Translate `DESIGN.md` into product design constraints and milestone scope | Completed | `DESIGN.md` review | doc review |
| M10-02 | Replace shared theme tokens and shell surfaces with the monochrome system | Completed | M10-01 | `npm run build` |
| M10-03 | Restyle title, mode, quiz, result, and mastery UI to match the new design language | Completed | M10-01, M10-02 | `npm run test`, `npm run build`, `npm run dev -- --host 127.0.0.1 --port 4174 --strictPort` |
| M10-04 | Capture local QA evidence and synchronize roadmap/status docs | Completed | M10-02, M10-03 | `npm run test`, `npm run build`, `npm run dev -- --host 127.0.0.1 --port 4174 --strictPort`, `docs/qa/reports/2026-04-07-m10-qa.md` |
| M10-05 | Verify the deployed redesign after merge and close the milestone | Planned | M10-04 | published URL smoke check, post-merge QA note |

## Scope

* Goal:
  * Rework the 9x9quiz presentation layer to follow the new Ollama-inspired design brief in `DESIGN.md`.
  * Replace the old colorful, shadowed, pixel-like theme with a restrained grayscale system built from white surfaces, single-pixel borders, 12px containers, and pill-shaped controls.
  * Keep the gameplay, localization, persistence, and release-provenance behavior unchanged while refreshing the visual presentation.
* Out of scope:
  * New game mechanics or storage model changes.
  * New backend or packaging work.
  * Post-merge deployment verification on the published site.

## Effort Estimate

| Ticket | Main Work | Estimate |
| --- | --- | --- |
| M10-01 | Design review, product adaptation, milestone definition | 0.5 day |
| M10-02 | Token rewrite, shell/container/button system refresh | 0.5-1.0 day |
| M10-03 | Screen-by-screen UI restyling and component adjustment | 1.0-1.5 days |
| M10-04 | Local validation, QA note, roadmap/status sync | 0.5 day |
| M10-05 | Post-merge published smoke verification | 0.5 day |
| Total | End-to-end M10 delivery | 3.0-4.0 days |

## M10-01 - Translate `DESIGN.md` into product design constraints and milestone scope

**Objective**

Define the concrete 9x9quiz-specific rules needed to adapt the external design brief into implementable UI work.

**Deliverables**

* Review `DESIGN.md` and identify the parts that should carry into 9x9quiz without copying Ollama-specific brand elements.
* Update `docs/reference/design.md` so the canonical product design reference no longer describes the old pixel-art theme.
* Define milestone scope and ticket breakdown for the redesign.

**File/Class Skeleton**

```text
DESIGN.md
docs/reference/design.md
docs/roadmap/implementation/m10-ollama-inspired-design-refresh.md
```

**Acceptance Criteria**

* The product design reference describes the new monochrome, rounded, shadowless system.
* The milestone file captures implementation scope, boundaries, and validation steps.

**Dependencies**

* `DESIGN.md` review

**Validation**

* Doc review

## M10-02 - Replace shared theme tokens and shell surfaces with the monochrome system

**Objective**

Move the app-wide design foundation to the new grayscale palette and spacing/radius rules so every screen can inherit the same visual language.

**Deliverables**

* Replace the old theme variables in `src/styles/theme.css`.
* Remove gradients, shadows, and chunky borders from shared shell styles.
* Introduce the new button hierarchy: gray pill, white pill, and black CTA pill.

**File/Class Skeleton**

```text
src/styles/theme.css
src/styles/app.css
```

**Acceptance Criteria**

* App background is pure white and shared containers use white/snow surfaces only.
* Interactive elements use pill geometry and non-interactive containers use 12px radius.
* No shared shadow or gradient styling remains.

**Dependencies**

* M10-01

**Validation**

* `npm run build`

## M10-03 - Restyle title, mode, quiz, result, and mastery UI to match the new design language

**Objective**

Apply the updated design system to the core player journey while preserving the existing quiz flow and localization behavior.

**Deliverables**

* Refresh the title screen with a minimal monochrome hero block, pill actions, and subdued provenance footer styling.
* Restyle mode selection, mastery cards, practice-scope selection, quiz controls, incorrect-answer dialog, and result actions.
* Keep the current gameplay structure and button labels intact unless a styling-related markup change is required.

**File/Class Skeleton**

```text
src/features/title/ui/TitleScreen.tsx
src/features/mode/ui/ModeSelectScreen.tsx
src/features/quiz/ui/QuizScreen.tsx
src/features/quiz/ui/NumericPad.tsx
src/features/quiz/ui/IncorrectAnswerOverlay.tsx
src/features/result/ui/ResultScreen.tsx
src/features/progress/ui/MasteryPanel.tsx
src/styles/app.css
```

**Acceptance Criteria**

* The primary play actions use the black CTA treatment.
* Title, mode, quiz, mastery, and result screens all follow the grayscale/pill/12px rules.
* Mobile layouts remain usable without horizontal overflow.

**Dependencies**

* M10-01
* M10-02

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev -- --host 127.0.0.1 --port 4174 --strictPort`

## M10-04 - Capture local QA evidence and synchronize roadmap/status docs

**Objective**

Record local validation evidence for the redesign and keep the roadmap/status documents aligned with the new milestone state.

**Deliverables**

* Run local automated validation and a local dev boot smoke check.
* Record evidence under `docs/qa/reports/`.
* Update milestone summary, build order, current state, and next steps for M10.

**File/Class Skeleton**

```text
docs/qa/reports/2026-04-07-m10-qa.md
docs/current-state.md
docs/next-steps.md
docs/roadmap/milestones.md
docs/roadmap/implementation/build-order.md
docs/roadmap/implementation/m10-ollama-inspired-design-refresh.md
```

**Acceptance Criteria**

* Local tests and production build pass after the redesign.
* Dev server boots on a fixed local port.
* Status docs point to M10 as the active closeout milestone.

**Dependencies**

* M10-02
* M10-03

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev -- --host 127.0.0.1 --port 4174 --strictPort`

## M10-05 - Verify the deployed redesign after merge and close the milestone

**Objective**

Confirm the published app reflects the merged redesign and then mark M10 complete.

**Deliverables**

* Verify the published URL renders the expected monochrome redesign.
* Record post-merge verification evidence.
* Update `docs/current-state.md` and `docs/roadmap/milestones.md` from `Partial` to `Completed` once live smoke checks pass.

**File/Class Skeleton**

```text
docs/qa/reports/
docs/current-state.md
docs/roadmap/milestones.md
docs/roadmap/implementation/m10-ollama-inspired-design-refresh.md
```

**Acceptance Criteria**

* Published URL reflects the merged M10 styling.
* Manual verification covers desktop and at least one mobile/touch layout.
* M10 status docs are closed consistently after verification.

**Dependencies**

* M10-04

**Validation**

* Published URL smoke check
