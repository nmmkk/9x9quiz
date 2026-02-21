# Web Release Strategy (M7)

Last updated: 2026-02-20

## 1) Decision

* Deployment target: GitHub Pages (GitHub Actions-based deployment).
* Primary reason: lowest operational overhead for a static Vite build while keeping CI and CD in one platform.

## 2) URL Strategy

* Canonical production URL: `https://<owner>.github.io/9x9quiz/`.
* Keep one canonical URL to avoid cache and support confusion.
* If a custom domain is introduced later, keep the GitHub Pages URL as fallback during migration.

## 3) Release Policy

* Release branch policy:
  * `main` is the only production deployment source.
  * Feature branches deploy only after merge to `main`.
* Release trigger policy:
  * CI must pass (`test` and `build`) before merge.
  * Deployment runs automatically on successful `main` workflow completion.
* Preview policy:
  * PR preview deployments are optional and out of current scope.
  * Until preview is added, reviewers validate with local `npm run dev` and CI artifacts/logs.

## 4) Repository Permissions and Secrets

* Required GitHub Actions permissions for deployment job:
  * `contents: read`
  * `pages: write`
  * `id-token: write`
* Required repository setting:
  * Pages source must allow GitHub Actions deployment.
* Secrets:
  * No external provider token is required for baseline GitHub Pages deploy.
  * Keep default `GITHUB_TOKEN` permissions least-privilege per workflow job.

## 5) Trade-offs Considered

| Option | Why not selected now | Revisit trigger |
| --- | --- | --- |
| Cloudflare Pages | Strong preview support, but needs additional account/API token governance for this phase. | Need richer preview and edge controls. |
| Netlify/Vercel | Good developer UX, but introduces separate SaaS ownership and secret rotation surface. | Team requires preview URLs and advanced deploy insights. |
| S3 + CDN | Flexible and scalable, but highest setup and ops burden for current team size and cadence. | Traffic/security requirements outgrow Pages defaults. |

## 6) CI Policy and Branch Protection (M7-02)

* CI workflow file: `.github/workflows/ci.yml`.
* CI triggers:
  * `pull_request` (all branches).
  * `push` to `main`.
* CI jobs:
  * `test-build` job executes `npm ci`, `npm run test`, and `npm run build`.
* Required branch protection check for `main`:
  * `CI / test-build`

### Branch protection dry-run procedure

Use these commands for repositories where branch protection is available:

```bash
gh api repos/<owner>/<repo>/branches/main/protection
```

If protection is not configured yet, apply a minimal required-check policy:

```bash
gh api \
  --method PUT \
  repos/<owner>/<repo>/branches/main/protection \
  -f required_status_checks.strict=true \
  -F required_status_checks.contexts[]='CI / test-build' \
  -f enforce_admins=false \
  -f required_pull_request_reviews=null \
  -f restrictions=null
```

Repository-specific note for `nmmkk/9x9quiz`:

* Current response is `403` for branch protection API (`Upgrade to GitHub Pro or make this repository public`).
* Until plan/visibility changes, enforce merge gate operationally:
  * Do not merge PR unless `CI / test-build` is green.
  * Keep squash/merge action owner responsible for final CI check confirmation.

## 7) Reusable GitHub Pages Deployment Runbook

This section is a reusable handbook so the same release setup can be repeated in other repositories.

### A) One-time repository setup

1. Create and protect `main` branch.
2. Add CI workflow (`.github/workflows/ci.yml`) and confirm at least one green run.
3. In GitHub repository settings:
   * Enable Pages with source = GitHub Actions.
   * Enable branch protection for `main` and require status check `CI / test-build`.
4. Confirm `GITHUB_TOKEN` workflow permissions are not broader than required.

### B) App build prerequisites

1. Ensure static build command is deterministic (`npm run build`).
2. For Vite project-page hosting (`/<repo>/`), set `base` in `vite.config.ts` before first production deploy.
3. Confirm production artifacts are created under `dist/`.

### C) Standard deployment workflow shape (for M7-03 implementation)

1. Trigger: workflow run on successful `push` to `main` (or workflow_run chained from CI).
2. Build job:
   * checkout
   * setup Node + cache
   * `npm ci`
   * `npm run build`
   * upload `dist/` as Pages artifact
3. Deploy job:
   * permissions: `pages: write`, `id-token: write`, `contents: read`
   * deploy artifact to Pages environment
4. Post-deploy:
   * open canonical URL
   * run smoke checks (load app, solve a few questions, verify assets load without console errors)

### D) Repeatable checklist for future projects

1. Decide canonical URL and document it first.
2. Add CI and make it required before any deploy automation.
3. Add CD workflow with least-privilege permissions only.
4. Keep rollback guidance in release docs before launch.
5. Record one QA report after first production publish.
6. Verify branch protection API is available before relying on required checks.

## 8) Remaining Follow-up

* Add GitHub Pages deployment workflow and publish URL verification steps (`M7-03`).
* Add rollback runbook and release guardrails (`M7-04`).
