# Web Release Strategy (M7-01)

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

## 6) Follow-up for M7-02 and M7-03

* Add CI workflow and required status checks (`M7-02`).
* Add GitHub Pages deployment workflow and publish URL verification steps (`M7-03`).
* Confirm Vite base-path behavior for project-page hosting before enabling production deploy.
