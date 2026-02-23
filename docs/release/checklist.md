# Release Checklist (Web MVP V1)

## Web Release Policy Baseline (M7-01)

* [x] Deployment target is decided and documented (`docs/reference/web-release-strategy.md`).
* [x] Canonical production URL strategy is documented.
* [x] Release trigger policy (`main` + CI gate) is documented.
* [x] Required GitHub Actions permissions are documented.
* [ ] PR preview policy remains optional and is tracked for later milestones.

## CI Gate Baseline (M7-02)

* [x] CI workflow exists at `.github/workflows/ci.yml`.
* [x] CI runs `npm run test` and `npm run build`.
* [x] Local validation passes for test and build commands.
* [x] Branch protection required-check enforcement is enabled in GitHub settings (`CI / test-build` on `main`).
* [x] Fallback merge policy is documented for repositories where branch protection API is unavailable.

## Deploy Gate Baseline (M7-03)

* [x] Deploy workflow exists at `.github/workflows/deploy.yml`.
* [x] Deploy workflow publishes `dist/` via GitHub Pages actions.
* [x] Vite build base path is set for project-page hosting (`/9x9quiz/`).
* [x] Deploy workflow runs automatically only after `CI` succeeds on `main`.
* [x] Deploy workflow supports `workflow_dispatch` rerun on `main` only.
* [x] Deploy workflow validates successful CI check for target SHA and blocks stale rerun SHA deploys.
* [x] One CI-success-triggered deploy run on `main` succeeded.
* [x] Live URL smoke verification (`https://nmmkk.github.io/9x9quiz/`) is recorded.
* [ ] Optional: one `workflow_dispatch` rerun on `main` succeeded.

## Release Safety Gate (M7-04)

* [x] Release record includes CI run ID and deploy run ID.
* [x] Pre-merge required check `CI / test-build` remains enabled on `main`.
* [x] Post-deploy smoke checks are explicitly listed and executed:
  * [x] App URL opens successfully.
  * [x] One short quiz flow (start => answer => result) works.
  * [x] Browser console has no blocking runtime errors.
* [x] Monitoring points after deploy are explicitly listed:
  * [x] Re-check deploy run conclusion after 10-15 minutes.
  * [x] Confirm no immediate user-reported outage signal.
* [x] Rollback trigger conditions and step-by-step procedure are documented in `docs/reference/web-release-strategy.md`.
* [x] First responder and escalation owner scope are documented.

## Launch QA Gate (M7-05)

* [x] Production CI/deploy run evidence is recorded (`22296144653`, `22296154268`).
* [x] Published URL reachability is confirmed (`https://nmmkk.github.io/9x9quiz/`).
* [x] Manual launch verification report is recorded (`docs/qa/reports/2026-02-23-m07-05-launch-qa-pass.md`).
* [ ] Manual mobile smoke verification on published URL is recorded.

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
