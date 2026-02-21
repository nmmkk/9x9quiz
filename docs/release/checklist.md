# Release Checklist (Web MVP V1)

## Web Release Policy Baseline (M7-01)

* [x] Deployment target is decided and documented (`docs/reference/web-release-strategy.md`).
* [x] Canonical production URL strategy is documented.
* [x] Release trigger policy (`main` + CI gate) is documented.
* [x] Required GitHub Actions permissions are documented.
* [ ] PR preview policy remains optional and is tracked for later milestones.

## Product Scope

* [x] Title, mode select, quiz, incorrect feedback, and result screens are implemented.
* [x] Mode options are exactly 10 and 20 questions.
* [x] Score rule is exactly +10 per correct answer.
* [x] Incorrect answer always reveals the correct answer before continuing.
* [x] Missed facts in-session are weighted at +30% draw weight.

## Quality Gates

* [x] Unit tests pass.
* [x] Production build succeeds.
* [x] Mobile portrait layout verified.
* [x] Desktop layout verified.
* [x] Local high score persistence verified for all modes.

## Documentation Gates

* [x] `docs/current-state.md` reflects current milestone status.
* [x] `docs/next-steps.md` reflects actionable next tickets.
* [x] `docs/roadmap/milestones.md` status aligns with ticket status.
* [x] QA report added under `docs/qa/reports/`.

## Notes

* Manual browser QA for desktop and iOS was confirmed in-session on 2026-02-14.
* See `docs/qa/reports/2026-02-14-m01-qa.md` for evidence.
