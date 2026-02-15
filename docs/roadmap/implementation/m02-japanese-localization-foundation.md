# Milestone 2 - Japanese-first Localization Foundation

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M2-01 | Add localization foundation and locale state | Completed | M1-07 | `npm run test` (pass, 9 tests), `npm run build` (pass) |
| M2-02 | Externalize user-facing copy across core screens | Completed | M2-01 | `npm run test` (pass, 9 tests), `npm run build` (pass), `npm run dev -- --host 127.0.0.1 --port 4178 --strictPort` (booted) |
| M2-03 | Finalize ja-JP learner-friendly copy set | Completed | M2-01, M2-02 | `npm run test` (pass, 9 tests), `npm run build` (pass), `npm run dev -- --host 127.0.0.1 --port 4179 --strictPort` (booted), `docs/reference/copy-ja-jp.md` |
| M2-04 | Apply localization-aware UI adjustments | Planned | M2-02, M2-03 | `npm run build`, `npm run dev` |
| M2-05 | Add i18n coverage tests and run regression | Planned | M2-01, M2-02, M2-03, M2-04 | `npm run test`, `npm run build` |
| M2-06 | Execute QA pass and sync status docs | Planned | M2-01, M2-02, M2-03, M2-04, M2-05 | `npm run test`, `npm run build`, `npm run dev`, `docs/qa/reports/YYYY-MM-DD-m02-qa.md` |

## Scope

* Goal:
  * Make Japanese (`ja-JP`) the default app language for all player-facing copy.
  * Introduce a typed localization foundation that can expand beyond MVP without backend services.
  * Preserve existing quiz mechanics and high-score behavior while replacing hard-coded strings.
* Out of scope:
  * Backend translation management or remote copy delivery.
  * Additional locale rollout beyond `ja-JP` and fallback `en` scaffolding.
  * New gameplay mechanics (timed mode, bonus scoring, challenge rules).
  * In-app language toggle UI in M2 (can be considered after M2 completion).

## M2-01 - Add localization foundation and locale state

**Objective**

Create a minimal, typed i18n baseline with locale persistence and document-level language sync.

**Deliverables**

* Add locale and message-key types used across the app.
* Add message catalogs for `ja-JP` and `en` with key parity checks.
* Add locale persistence helper with localStorage key `9x9quiz.v1.locale`.
* Add app-level i18n provider and hook for message lookup.
* Synchronize `document.documentElement.lang` with active locale.

**File/Class Skeleton**

```text
src/shared/i18n/types.ts
src/shared/i18n/catalog.ts
src/shared/i18n/localeStorage.ts
src/shared/i18n/I18nProvider.tsx
src/shared/i18n/useI18n.ts
src/main.tsx
index.html
```

**Acceptance Criteria**

* App defaults to `ja-JP` when no locale has been stored.
* Stored locale is reused on subsequent app launches.
* Missing translation keys fail fast in development or fall back predictably.
* `<html lang>` always reflects active locale.

**Dependencies**

* M1-07

**Validation**

* `npm run test`
* `npm run build`

## M2-02 - Externalize user-facing copy across core screens

**Objective**

Replace hard-coded UI text with localization keys for all current gameplay screens.

**Deliverables**

* Move static copy from components into message catalogs.
* Localize labels and helper text on title, mode select, quiz, incorrect overlay, and result screens.
* Localize shared button labels and numeric pad action labels.
* Localize relevant aria labels used for accessibility.

**File/Class Skeleton**

```text
src/App.tsx
src/features/title/ui/TitleScreen.tsx
src/features/mode/ui/ModeSelectScreen.tsx
src/features/quiz/ui/QuizScreen.tsx
src/features/quiz/ui/NumericPad.tsx
src/features/quiz/ui/IncorrectAnswerOverlay.tsx
src/features/result/ui/ResultScreen.tsx
src/shared/i18n/catalog.ts
```

**Acceptance Criteria**

* Core screens render from localization keys instead of hard-coded copy.
* No behavior changes in session flow, score logic, or persistence.
* Accessibility labels remain explicit and meaningful after extraction.

**Dependencies**

* M2-01

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`

## M2-03 - Finalize ja-JP learner-friendly copy set

**Objective**

Provide age-appropriate Japanese copy aligned to the grade-2 target and current design intent.

**Deliverables**

* Fill all `ja-JP` catalog entries with concise learner-friendly wording.
* Keep terminology consistent across title, quiz, incorrect feedback, and result contexts.
* Add a copy reference note for future localization updates.

**File/Class Skeleton**

```text
src/shared/i18n/catalog.ts
docs/reference/copy-ja-jp.md
```

**Acceptance Criteria**

* Every key used by UI has non-empty `ja-JP` text.
* Copy remains readable within existing button/card layouts.
* Copy reference doc captures voice, terminology, and string constraints.

**Dependencies**

* M2-01
* M2-02

**Validation**

* `npm run dev`

## M2-04 - Apply localization-aware UI adjustments

**Objective**

Protect readability and layout stability after Japanese copy rollout, especially on mobile portrait.

**Deliverables**

* Adjust heading/text styles that assume uppercase Latin copy.
* Update spacing/line-height where localized labels are longer.
* Validate button and panel layouts with Japanese strings at ~360x640 and desktop widths.

**File/Class Skeleton**

```text
src/styles/theme.css
src/styles/app.css
src/features/**/ui/*.tsx
```

**Acceptance Criteria**

* No clipping/overflow in core screens at mobile portrait baseline.
* Existing touch target and contrast requirements remain satisfied.
* Visual style stays consistent with current pixel-art direction.

**Dependencies**

* M2-02
* M2-03

**Validation**

* `npm run build`
* `npm run dev`

## M2-05 - Add i18n coverage tests and run regression

**Objective**

Lock in localization behavior with tests and ensure no regressions to existing MVP logic.

**Deliverables**

* Add unit tests for locale storage read/write behavior.
* Add tests for message key coverage and fallback behavior.
* Re-run existing quiz domain and high-score tests without scope regressions.

**File/Class Skeleton**

```text
src/shared/i18n/__tests__/catalog.test.ts
src/shared/i18n/__tests__/localeStorage.test.ts
src/features/quiz/domain/__tests__/*.test.ts
src/shared/storage/__tests__/highScoreStorage.test.ts
```

**Acceptance Criteria**

* i18n helper tests pass consistently.
* Existing domain and storage tests remain green.
* Build remains successful with no type errors.

**Dependencies**

* M2-01
* M2-02
* M2-03
* M2-04

**Validation**

* `npm run test`
* `npm run build`

## M2-06 - Execute QA pass and sync status docs

**Objective**

Validate end-to-end Japanese-first behavior and keep roadmap/status documentation aligned.

**Deliverables**

* Run manual user flows for all modes with localized copy.
* Verify locale persistence and `<html lang>` behavior in browser.
* Record QA evidence under `docs/qa/reports/`.
* Sync milestone and status docs after validation.

**File/Class Skeleton**

```text
docs/qa/reports/
docs/current-state.md
docs/next-steps.md
docs/roadmap/milestones.md
docs/roadmap/implementation/build-order.md
```

**Acceptance Criteria**

* QA report exists and includes locale-specific checks.
* Status docs remain synchronized with milestone ticket states.
* No unresolved blocking issues for Japanese-first rollout scope.

**Dependencies**

* M2-01
* M2-02
* M2-03
* M2-04
* M2-05

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`
