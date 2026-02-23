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
gh api --method PUT repos/<owner>/<repo>/branches/main/protection --input branch-protection.json
```

Example `branch-protection.json` payload:

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["CI / test-build"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": false,
  "lock_branch": false,
  "allow_fork_syncing": false
}
```

Repository-specific note for `nmmkk/9x9quiz`:

* Branch protection is enabled on `main` with required check `CI / test-build` (`strict: true`).
* Validation evidence is tracked in:
  * `docs/qa/reports/2026-02-20-m07-02-ci-baseline.md`
  * `docs/qa/reports/2026-02-20-m07-02-closeout.md`

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

## 8) Deployment Workflow (M7-03)

* Workflow file: `.github/workflows/deploy.yml`
* Trigger:
  * automatic: `workflow_run` after `CI` succeeds on `main`
  * manual rerun: `workflow_dispatch` (allowed only for `main`)
* Safety guards:
  * manual rerun verifies successful `test-build` check exists for current `main` SHA
  * automatic deploy refuses stale rerun SHA and only deploys current `main` tip
* Build/deploy flow:
  * `build-pages` job runs `npm ci` and `npm run build`
  * `dist/` is uploaded with `actions/upload-pages-artifact`
  * `deploy-pages` job publishes with `actions/deploy-pages`
* Required permissions:
  * workflow-level: `contents: read`
  * deploy job: `pages: write`, `id-token: write`, `contents: read`
* Vite base-path policy for project page hosting:
  * `vite.config.ts` uses `/9x9quiz/` during build and `/` during dev

### Preflight validation commands

Use these commands for a manual rerun on `main`:

```bash
gh workflow run deploy.yml --ref main
gh run list --workflow deploy.yml --limit 5
gh run view <run-id> --log
```

For M7 closeout, run and record both:

1. one manual `workflow_dispatch` deploy run on `main` (rerun evidence)
2. one automatic deploy run triggered by successful CI on `main`

## 9) Remaining Follow-up

* Execute one `workflow_dispatch` deployment run on `main` and capture run URL (`M7-03` preflight evidence).
* Execute one CI-success-triggered deployment run on `main` and capture run URL (`M7-03` closeout evidence).
* Perform live URL smoke verification on `https://nmmkk.github.io/9x9quiz/` and add QA report.
* Add rollback runbook and release guardrails (`M7-04`).
