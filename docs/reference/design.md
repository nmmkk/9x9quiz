# 9x9quiz Web MVP V1 Design Specification

Last updated: 2026-02-16

## 1) Product Intent

* Build a browser quiz app that helps grade-2 students in Japan memorize multiplication tables (kuku).
* Keep V1 simple and reliable with fixed-length sessions, clear scoring, and immediate correction feedback.
* Add game-like 8-bit visual flavor, while avoiding advanced game mechanics in V1.
* Keep feature decisions aligned with `docs/reference/core-value.md`.

## 2) Users and Context

* Primary user: Japanese grade-2 students learning multiplication tables.
* Secondary user: parent or teacher launching a practice session.
* Device context: mobile portrait first, with desktop browser support.

## 3) Scope

### In Scope (V1)

* Title screen.
* Mode select screen with 2 session lengths: 10 and 20 questions.
* Quiz loop with one multiplication problem shown at a time.
* On-screen numeric input pad (no native keypad dependency).
* Incorrect answer flow that shows the correct answer before moving to the next question.
* Wrong-answer reinforcement: facts answered incorrectly in the current session get +30% selection weight.
* Score system: +10 points per correct answer, no wrong-answer penalty.
* Result screen with final score and correct answer count.
* Local high score persistence per mode (10, 20), no login.
* Japanese-first UI copy with wording suitable for grade-2 learners.

### Out of Scope (V1)

* User account, backend, or cross-device sync.
* Native iOS or Android app packaging.
* Advanced scoring mechanics (streak bonus, table-based multipliers).
* Timed mode.
* Full bilingual UI implementation (architecture should still be locale-ready).

## 4) Runtime and Tech Direction

* Runtime: browser-only web app for V1.
* Recommended stack: React + TypeScript + Vite.
* Persistence: localStorage only.
* Backend: none.

## 5) Core Gameplay Rules

### Problem Pool

* Use multiplication facts from `1..9 x 1..9` (81 ordered facts).
* Each fact is represented as `(a, b, answer = a * b)`.

### Session Lifecycle

* User selects mode: `10` or `20` questions.
* Session ends when answered question count reaches selected mode count.
* After session end, app navigates to Result screen.

### Scoring

* Correct answer: `+10` points.
* Incorrect answer: `+0` points.
* Final score formula: `correctCount * 10`.

### Answer Input

* Input must be entered using on-screen buttons.
* Allowed controls: digits `0-9`, `Clear`, `Backspace`, `Submit`.
* Input length limit: max 2 digits.
* `Submit` is disabled when input is empty.

### Correct / Incorrect Handling

* Correct:
  * Increase score by 10.
  * Move to next question.
* Incorrect:
  * Show modal/panel with correct answer.
  * Advance only after explicit `Next` action.
  * Mark current fact as missed for weighted redraw.

### Weighted Redraw Rule

* Maintain a session-level set `missedFactIds`.
* When drawing a new question, calculate weight per fact:
  * `1.3` if fact is in `missedFactIds`
  * `1.0` otherwise
* Sample next fact by weighted random selection.
* Do not repeat the exact same fact as the immediately previous fact unless no alternative exists.

## 6) High Score Rules

* Persist per mode in localStorage:
  * `9x9quiz.v1.highScore.10`
  * `9x9quiz.v1.highScore.20`
* Update high score only if `finalScore > storedHighScore`.
* Keep one value per mode (single best score only).

## 7) UI and Content Guidelines

### Tone and Copy

* Default locale: `ja-JP`.
* Copy style: short phrases, child-friendly language, no dense text.
* Writing level: grade-2 target, with hiragana-first style and optional grade-1 kanji.

### Visual Direction

* Theme: NES/SNES-inspired pixel-art game UI.
* Requirements:
  * Pixel-like typography and blocky UI components.
  * Bright, high-contrast palette that remains readable.
  * Clear focus/pressed states for all interactive controls.
  * Simple transition motion (no heavy animation dependency).

### Responsive Behavior

* Mobile-first layout for ~360px width.
* Desktop keeps core game area centered with fixed max width.
* Touch target minimum: 44x44 px.

## 8) Screen Specifications and Wireframes

### 8.1 Title Screen

* Purpose: enter app and branch to play/high score view.
* Required elements:
  * Game title logo area.
  * `Start` button.
  * `High Score` button (or inline panel link).

```text
[Title]
+--------------------------------------+
|              くくクイズ               |
|         pixel logo / mascot          |
|                                      |
|           [ Start Game ]             |
|           [ High Scores ]            |
+--------------------------------------+
```

### 8.2 Mode Select Screen

* Purpose: choose question count before quiz starts.
* Required elements:
  * Mode buttons: `10`, `20`.
  * High score preview per mode.
  * `Play` and `Back` actions.

```text
[Mode Select]
+--------------------------------------+
|          Choose Question Count       |
|                                      |
|             [10] [20]                |
|                                      |
|      High Score 10: 100              |
|      High Score 20: 180              |
|                                      |
|          [ Play ]   [ Back ]         |
+--------------------------------------+
```

### 8.3 Quiz Screen

* Purpose: solve one multiplication question at a time.
* Required elements:
  * Progress (`index / total`) and current score.
  * Current fact prompt (`a x b = [input]`).
  * Numeric input pad and action controls.

```text
[Quiz]
+--------------------------------------+
|  3 / 20               Score: 20      |
|                                      |
|             7 x 8 = [  ]             |
|                                      |
|       [1] [2] [3]                    |
|       [4] [5] [6]                    |
|       [7] [8] [9]                    |
|   [Clear] [0] [Backspace]            |
|              [ Submit ]              |
+--------------------------------------+
```

### 8.4 Incorrect Feedback Overlay

* Purpose: make correction explicit and require acknowledgement.
* Required elements:
  * Incorrect label.
  * Correct answer display.
  * `Next` button.

```text
[Incorrect Overlay]
+------------------------------+
|        Not Correct           |
|      Correct answer: 56      |
|          [ Next ]            |
+------------------------------+
```

### 8.5 Result Screen

* Purpose: close session, reinforce score, and offer replay.
* Required elements:
  * Correct count and final score.
  * High score update state.
  * `Play Again` and `Title` actions.

```text
[Result]
+--------------------------------------+
|             Session End              |
|                                      |
|         Correct: 15 / 20             |
|           Score: 150                 |
|                                      |
|      New High Score! (optional)      |
|                                      |
|      [ Play Again ] [ Title ]        |
+--------------------------------------+
```

## 9) State and Data Model (Reference)

```ts
type QuestionCountMode = 10 | 20

type FactId = `${number}x${number}`

type MultiplicationFact = {
  id: FactId
  a: number
  b: number
  answer: number
}

type SessionState = {
  mode: QuestionCountMode
  questionIndex: number
  totalQuestions: number
  currentFact: MultiplicationFact
  inputValue: string
  correctCount: number
  score: number
  missedFactIds: Set<FactId>
}
```

## 10) Acceptance Criteria for V1

* User can complete a full session in each mode (`10`, `20`) without page reload.
* Score increments by exactly 10 for each correct answer.
* Incorrect flow always reveals the correct answer before continuing.
* Facts missed earlier in the same session are selected more often via +30% weight.
* High score persists across reloads and is mode-specific.
* UI remains usable on mobile portrait and desktop.

## 11) Planned V2 Candidates (Not in V1)

* Difficulty-based score multipliers by multiplication table.
* Consecutive-correct bonus.
* Additional game modes (timed or challenge).
* English UI rollout.
* PWA/offline support.
* Native app wrapper pilot for iOS/Android distribution.

## 12) PWA Update Strategy (M5-02)

* Service worker caches use an explicit versioned key format: `app-shell-<version>`.
* During `activate`, old `app-shell-*` caches are removed except for the current version.
* A newly installed worker does not force immediate takeover when an old controller is active.
* The app shows a lightweight update notice when a waiting worker is detected.
* When the user accepts the update, the app sends `SKIP_WAITING`, waits for `controllerchange`, then reloads once.
* Fallback behavior:
  * If no service worker support exists, the app continues as a normal online web app.
  * If update activation does not complete in the current session, the current app version remains usable and no automatic reload loop is triggered.
