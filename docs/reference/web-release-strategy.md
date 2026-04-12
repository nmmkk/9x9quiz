# Web Release Strategy (M7)

Last updated: 2026-04-12

## 1) Decision

* Deployment target: Cloudflare Pages (GitHub-integrated static deployment).
* Primary reason: lowest operational overhead for the static Vite build while adding lightweight hosted analytics and avoiding GitHub project-page base-path constraints.

## 2) URL Strategy

* Canonical production URL: `https://9x9quiz.pages.dev/`.
* Keep one canonical URL to avoid cache and support confusion.
* If a custom domain is introduced later, keep `9x9quiz.pages.dev` reachable until the new URL is verified.

## 3) Release Policy

* Release branch policy:
  * `main` is the only production deployment source.
  * Feature branches deploy only after merge to `main`.
* Release trigger policy:
  * CI must pass (`test` and `build`) before merge.
  * Cloudflare Pages deploys automatically from `main` through GitHub integration.
* Preview policy:
  * PR preview deployments are optional and out of current scope.
  * Until preview is added, reviewers validate with local `npm run dev` and CI artifacts/logs.

## 4) Repository Permissions and Secrets

* Required GitHub permissions:
  * Cloudflare Pages GitHub app must have access to repository `nmmkk/9x9quiz`.
* Required Cloudflare account capability:
  * Workers & Pages project creation and deploy access for the selected account.
* Secrets:
  * No repository secret is required for the baseline Cloudflare Pages Git integration flow.
  * If Cloudflare API-token based automation is introduced later, keep token scope least-privilege and document rotation ownership before enabling it.

## 5) Trade-offs Considered

| Option | Why not selected now | Revisit trigger |
| --- | --- | --- |
| GitHub Pages | Project-page base path adds deployment-specific asset constraints and there is no built-in hosted analytics view for the current needs. | Return only if a single-platform GitHub-only release flow becomes more important than analytics and hosting flexibility. |
| Netlify/Vercel | Good developer UX, but introduces separate SaaS ownership with no advantage over Cloudflare Pages for the current static app. | Team requires provider-specific preview or edge features not covered by Cloudflare. |
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

## 7) Reusable Cloudflare Pages Deployment Runbook

This section is a reusable handbook so the same release setup can be repeated in other repositories.

### A) One-time repository setup

1. Create and protect `main` branch.
2. Add CI workflow (`.github/workflows/ci.yml`) and confirm at least one green run.
3. In Cloudflare Pages:
   * connect the GitHub repository
   * set production branch to `main`
   * set build command to `npm run build`
   * set build output directory to `dist`
4. Enable branch protection for `main` and require status check `CI / test-build`.

### B) App build prerequisites

1. Ensure static build command is deterministic (`npm run build`).
2. For Cloudflare Pages root hosting, keep `base` in `vite.config.ts` at `/`.
3. Confirm production artifacts are created under `dist/`.

### C) Standard deployment workflow shape (for M7-03 implementation)

1. Trigger: Cloudflare Pages build on push to `main`.
2. Build stage:
   * checkout
   * install dependencies
   * `npm run build`
   * publish `dist/`
3. Post-deploy:
   * open canonical URL
   * run smoke checks (load app, solve a few questions, verify assets load without console errors)

### D) Repeatable checklist for future projects

1. Decide canonical URL and document it first.
2. Add CI and make it required before any deploy automation.
3. Add CD workflow with least-privilege permissions only.
4. Keep rollback guidance in release docs before launch.
5. Record one QA report after first production publish.
6. Verify branch protection API is available before relying on required checks.

## 8) Deployment Workflow (Current)

* Deployment provider: Cloudflare Pages Git integration
* Trigger:
  * automatic: push to `main`
  * optional preview: non-production branches when enabled in Cloudflare Pages settings
* Build/deploy flow:
  * Cloudflare clones repository
  * installs dependencies with npm
  * runs `npm run build`
  * publishes `dist/`
* Vite base-path policy for root hosting:
  * `vite.config.ts` uses `/` for both dev and production builds

### Preflight validation commands

Use these commands before merge to `main`:

```bash
npm run test
npm run build
```

After merge, confirm the latest Cloudflare Pages production deploy succeeded and the canonical URL renders without asset MIME errors.

Historical GitHub Pages deployment evidence for M7 remains in the QA reports and milestone records.

## 9) Release Provenance Display Strategy (M9)

* Product requirement:
  * the deployed app must show a small title-screen footer that identifies the code revision at a glance and can open the matching commit page.
* Required metadata fields:
  * semantic version from `package.json`
  * full commit SHA from the exact build revision
  * short SHA derived from the same commit
  * repository commit URL template or fully resolved commit URL for the exact SHA
* Optional metadata field:
  * build timestamp for diagnostics or deeper support workflows
* Injection policy:
  * inject metadata at build time through Vite environment variables
  * for hosted production deploys, source commit metadata from the exact revision Cloudflare builds
  * for local development or ad hoc local builds, provide deterministic fallback values without requiring manual env setup
* Display policy:
  * default footer string is `v<version> (<short-sha>)`
  * keep the footer always visible on the title screen
  * when commit URL metadata is available, render the footer as an external link to the exact commit
  * treat build timestamp as secondary information, not required in the default footer
  * when commit URL metadata is not available, keep the same text but do not link to a guessed destination
* Rejected approach:
  * do not fetch latest branch or commit data at runtime from GitHub APIs
  * reason: the app is a PWA, so runtime repository state can drift from the cached bundle currently served to the user

## 10) Remaining Follow-up

* Add Cloudflare Web Analytics and document the minimum retained metrics after initial observations.
* Record one Cloudflare Pages post-migration QA report after canonical production verification.

## 11) Rollback Runbook and Quality Guardrails (M7-04)

### First responder scope

* First responder:
  * Maintainer who merged release PR or triggered manual deploy rerun.
* Escalation owner:
  * Repository owner (`nmmkk`) if incident exceeds first responder scope.

### Rollback trigger conditions

Start rollback when one or more conditions are true after a deploy:

* App does not load at `https://9x9quiz.pages.dev/`.
* Core quiz flow is broken (start/answer/result).
* Blocking runtime error is visible in browser console.
* Deploy workflow concludes `failure` and retry does not recover.

### Rollback execution steps

1. Identify last known-good commit on `main`.
2. Revert the broken commit(s) on a hotfix branch.
3. Open and merge rollback PR to `main` (CI must pass).
4. Confirm Cloudflare Pages publishes the rollback commit successfully.
5. Re-run smoke checks on published URL.

### Post-rollback verification

* URL load and quiz smoke pass on desktop/mobile.
* No blocking console errors on startup and first quiz session.
* Current-state and QA report docs are updated with incident/rollback evidence.

### Release guardrails

* Keep `CI / test-build` required on `main`.
* Deploy only through guarded workflow (`workflow_run` success or main-only manual rerun).
* Record CI run ID and deploy run ID for every production release.
