# Milestone 7 - Web Release CI/CD

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M7-01 | Decide deployment target and release policy | Completed | M5-04 | policy review, `npm run build` |
| M7-02 | Add GitHub Actions CI (test + build) | Completed | M7-01 | PR CI pass, branch protection dry-run |
| M7-03 | Add CD pipeline for web deployment | Completed | M7-01, M7-02 | deploy workflow run, live URL smoke check |
| M7-04 | Strengthen release quality gates and rollback runbook | Completed | M7-02, M7-03 | checklist review, failed deploy simulation |
| M7-05 | Execute launch QA pass and sync status docs | Completed | M7-01, M7-02, M7-03, M7-04 | `docs/qa/reports/`, status docs sync |

## Scope

* Goal:
  * Prioritize web app delivery and shorten iteration lead time via CI/CD.
  * Keep deployment and rollback steps reproducible from GitHub.
  * Raise app completion quality before revisiting native packaging.
* Out of scope:
  * Native wrapper implementation (`M6-02` onward).
  * Backend user accounts and cross-device sync.
  * App store distribution.

## Effort Estimate

| Ticket | Main Work | Estimate |
| --- | --- | --- |
| M7-01 | Host selection (for example GitHub Pages/Cloudflare Pages), environment policy, secret/permission design | 0.5-1.0 day |
| M7-02 | CI workflow files, cache strategy, failure feedback tuning | 0.5-1.0 day |
| M7-03 | CD workflow, environment wiring, deployment verification | 1.0-1.5 days |
| M7-04 | Release checklist updates, rollback docs, guardrails | 0.5-1.0 day |
| M7-05 | Manual QA and docs synchronization | 0.5-1.0 day |
| Total | End-to-end M7 delivery | 3.0-5.5 days |

## M7-01 - Decide deployment target and release policy

**Objective**

Decide a stable web deployment target and define a release policy suitable for frequent incremental updates.

**Deliverables**

* Choose hosting target and URL strategy.
* Define branch/release policy (`main` deploy, PR preview optional).
* Define required repository secrets/permissions.

**File/Class Skeleton**

```text
docs/reference/web-release-strategy.md
docs/release/checklist.md
```

**Acceptance Criteria**

* Deployment target rationale and trade-offs are documented.
* Release trigger conditions are explicit.
* Security boundary (tokens/permissions) is documented.

**Dependencies**

* M5-04

**Validation**

* `npm run build`

## M7-02 - Add GitHub Actions CI (test + build)

**Objective**

Create a deterministic CI pipeline that validates every PR before merge.

**Deliverables**

* Add CI workflow for install, test, and build.
* Add cache strategy to keep runtime acceptable.
* Document required status checks for branch protection.

**File/Class Skeleton**

```text
.github/workflows/ci.yml
docs/reference/web-release-strategy.md
```

**Acceptance Criteria**

* CI runs on PR and push to `main`.
* Failing tests/build block merge by policy.
* Workflow logs are clear enough for quick debugging.

**Dependencies**

* M7-01

**Validation**

* `npm run test`
* `npm run build`
* `gh api repos/<owner>/<repo>/branches/main/protection`

**Current Evidence (2026-02-20)**

* `docs/qa/reports/2026-02-20-m07-02-ci-baseline.md`
* `docs/qa/reports/2026-02-20-m07-02-closeout.md`
* Branch protection verification for `nmmkk/9x9quiz`: required check `CI / test-build` configured on `main` (`strict: true`).

## M7-03 - Add CD pipeline for web deployment

**Objective**

Deploy web assets automatically from GitHub after CI passes on `main`.

**Deliverables**

* Add deployment workflow.
* Wire deployment credentials and least-privilege permissions.
* Expose canonical public URL in docs.

**File/Class Skeleton**

```text
.github/workflows/deploy.yml
docs/reference/web-release-strategy.md
README.md
```

**Acceptance Criteria**

* `main` merge triggers deployment automatically.
* Deployed URL serves latest successful build.
* Failed deploy path is observable and recoverable.

**Dependencies**

* M7-01
* M7-02

**Validation**

* `npm run build`
* GitHub Actions deploy run

**Current Evidence (2026-02-20)**

* `.github/workflows/deploy.yml` added (GitHub Pages deploy pipeline)
* `.github/workflows/deploy.yml` now deploys automatically only after successful `CI` on `main` (`workflow_run`)
* `.github/workflows/deploy.yml` manual deploy (`workflow_dispatch`) is restricted to `main`
* Deploy preflight validates successful `test-build` for target SHA and rejects stale rerun SHA
* `vite.config.ts` updated for project-page base path (`/9x9quiz/` on build)
* `README.md` includes canonical URL `https://nmmkk.github.io/9x9quiz/`
* `docs/qa/reports/2026-02-20-m07-03-deploy-preflight.md`
* `docs/qa/reports/2026-02-23-m07-03-closeout.md`

## M7-04 - Strengthen release quality gates and rollback runbook

**Objective**

Reduce release risk with explicit pre-release checks and rollback procedure.

**Deliverables**

* Update release checklist for CI/CD operation.
* Add rollback instructions and ownership.
* Add monitoring points after deploy.

**File/Class Skeleton**

```text
docs/release/checklist.md
docs/reference/web-release-strategy.md
```

**Acceptance Criteria**

* Checklist includes CI result, deploy result, smoke checks.
* Rollback steps are executable without guesswork.
* First-responder scope is clearly written.

**Dependencies**

* M7-02
* M7-03

**Validation**

* Checklist dry run

**Current Evidence (2026-02-23)**

* `docs/release/checklist.md` updated with release safety gates and monitoring points
* `docs/reference/web-release-strategy.md` updated with rollback runbook and first responder scope
* `docs/qa/reports/2026-02-23-m07-04-checklist-dry-run.md`

## M7-05 - Execute launch QA pass and sync status docs

**Objective**

Validate released web app behavior and synchronize roadmap/status docs.

**Deliverables**

* Run manual smoke scenarios on published URL.
* Record release QA evidence under `docs/qa/reports/`.
* Sync milestone and next-step docs.

**File/Class Skeleton**

```text
docs/qa/reports/
docs/current-state.md
docs/next-steps.md
docs/roadmap/milestones.md
docs/roadmap/implementation/build-order.md
```

**Acceptance Criteria**

* QA report includes desktop/mobile smoke results on public URL.
* M7 status is synchronized across docs.
* Follow-up backlog items are explicit and prioritized.

**Dependencies**

* M7-01
* M7-02
* M7-03
* M7-04

**Validation**

* `npm run test`
* `npm run build`
* Published URL smoke verification

**Current Evidence (2026-02-23)**

* `docs/qa/reports/2026-02-23-m07-05-launch-qa-pass.md`
* CI run `22296144653` and Deploy Pages run `22296154268` are successful for released `main`
* Published URL `https://nmmkk.github.io/9x9quiz/` is reachable; manual mobile smoke verification confirmed
