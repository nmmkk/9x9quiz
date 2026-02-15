# ja-JP Copy Reference

Last updated: 2026-02-14

## Purpose

* Define the approved Japanese copy style for `くくクイズ`.
* Keep wording consistent with a grade-2 learner audience.
* Provide quick rules for future string updates in `src/shared/i18n/catalog.ts`.

## Audience and Voice

* Primary audience: Japanese grade-2 students practicing kuku.
* Voice: short, kind, and encouraging.
* Reading level: hiragana-first, with simple katakana words when common.
* Tone: avoid blame and keep corrective messages gentle.

## Terminology Rules

* `score` => `とくてん`
* `high score` => `さいこうとくてん`
* `question count` => `もんだいすう` and `{count}もん`
* `correct answer` => `せいかい`
* `title` navigation action => `タイトルへ`

Use these terms consistently across title, mode select, quiz, incorrect feedback, and result.

## String Constraints

* Button labels should stay short (target: up to about 8 full-width characters).
* Panel headings should be one short phrase.
* Helper text should be one sentence when possible.
* Avoid standalone labels like `タイトル`, `モード`, `クイズ` above main headings.
* Keep placeholder tokens unchanged: `{count}`, `{score}`, `{answer}`, `{correct}`, `{total}`, `{mode}`.
* Prefer simple punctuation (`。`, `!`) and avoid decorative symbols.

## Current Copy Notes

* App title label is `くくクイズ`.
* Quiz submit action uses `けってい` for short tap-friendly wording.
* Incorrect overlay title uses `おしい!` to keep feedback positive.
* Result status displays only when a new high score is achieved.
