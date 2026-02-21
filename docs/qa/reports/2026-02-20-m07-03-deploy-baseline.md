# 2026-02-20 M7-03 QA Report (Deploy Baseline)

## Build and Reference

* Baseline branch: `feature/milestone-7`
* Ticket under validation: `M7-03`
* Related files: `.github/workflows/deploy.yml`, `vite.config.ts`, `README.md`

## Environment

* OS: Windows (`win32`)
* Node.js: `v24.13.1`
* npm: `11.8.0`

## Executed Scenarios

| ID | Scenario | Result | Evidence |
| --- | --- | --- | --- |
| QA-01 | Production build succeeds with Pages base path | Pass | `npm run build` succeeded (`injectManifest` precache 8 entries / 246.91 KiB) |
| QA-02 | Branch protection required check remains active | Pass | `gh api repos/nmmkk/9x9quiz/branches/main/protection` -> `required_status_checks.contexts: ["CI / test-build"]` |
| QA-03 | Deploy workflow exists with least-privilege permissions and artifact deploy steps | Pass | `.github/workflows/deploy.yml` includes `contents: read`, deploy job `pages: write`, `id-token: write`, and `actions/deploy-pages@v4` |

## Acceptance Criteria Coverage (M7-03)

* Completed in this run:
  * Deployment workflow implementation is added.
  * Build path compatibility for GitHub Pages project hosting is configured.
  * Canonical URL is published in `README.md`.
* Pending external/manual:
  * First deploy workflow run from `main`.
  * Live URL smoke verification on published site.

## Status Recommendation

* Ticket `M7-03`: `Partial`
* Next execution focus: run deploy on `main` and capture smoke-check evidence.
