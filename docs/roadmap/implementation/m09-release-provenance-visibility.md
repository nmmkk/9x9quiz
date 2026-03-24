# Milestone 9 - Release Provenance Visibility

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M9-01 | Define release provenance contract and title-screen link UX | Completed | M7-05 | doc review, `npm run build` |
| M9-02 | Inject build metadata and commit URL into local and deploy builds | Completed | M9-01 | `npm run test`, `npm run build`, workflow diff review |
| M9-03 | Render title-screen provenance footer link | Completed | M9-01, M9-02 | `npm run test`, `npm run build`, `npx vite --host 127.0.0.1 --port 4173 --strictPort` |
| M9-04 | Verify deployed provenance and sync status docs | Planned | M9-02, M9-03 | published URL smoke check, `docs/qa/reports/` |

## Scope

* Goal:
  * Make the deployed code revision visible at a glance from inside the app.
  * Keep the displayed provenance tied to the exact bundle that was built and deployed.
  * Add the feature with minimal UI weight by using a small footer on the title screen.
* Out of scope:
  * Full settings/about screen expansion.
  * Runtime calls to GitHub APIs for revision lookup.
  * Native packaging work (`M6-02` onward).

## Effort Estimate

| Ticket | Main Work | Estimate |
| --- | --- | --- |
| M9-01 | UX contract, metadata field selection, fallback rules | 0.5 day |
| M9-02 | Vite/env wiring, deploy workflow metadata injection, commit URL plumbing, local dev fallback | 0.5-1.0 day |
| M9-03 | Build-info helper, title screen footer link UI, localization/accessibility checks | 0.5-1.0 day |
| M9-04 | Deployed smoke verification, QA evidence, status doc sync | 0.5 day |
| Total | End-to-end M9 delivery | 2.0-3.0 days |

## M9-01 - Define release provenance contract and title-screen link UX

**Objective**

Define the metadata fields, fallback behavior, and title-screen link presentation for release provenance so implementation can stay small and deterministic.

**Deliverables**

* Specify the default footer string as `v<version> (<short-sha>)`.
* Define required build metadata fields: semantic version, full commit SHA, short SHA, and optional build timestamp.
* Define the commit URL contract and link-disable behavior for local/non-release builds.
* Define fallback behavior for local development and non-CI builds.
* Record why runtime branch-head lookups are rejected for this app.

**File/Class Skeleton**

```text
docs/reference/design.md
docs/reference/web-release-strategy.md
docs/roadmap/implementation/m09-release-provenance-visibility.md
```

**Acceptance Criteria**

* Footer placement, link behavior, and copy rules are documented.
* Metadata contract distinguishes required and optional fields.
* PWA cache consistency rationale is explicit.

**Dependencies**

* M7-05

**Validation**

* `npm run build`

## M9-02 - Inject build metadata and commit URL into local and deploy builds

**Objective**

Ensure both local builds and GitHub Pages deploys inject provenance metadata and commit URL data from the exact revision being built.

**Deliverables**

* Add build-time env plumbing for version, full SHA, short SHA, and optional build timestamp.
* Source version from `package.json` and commit SHA from git or GitHub Actions context.
* Inject a canonical GitHub commit URL for the exact SHA, without hard-coding a mismatched branch-head destination.
* Update deploy/build workflow so Pages builds receive metadata for `needs.preflight.outputs.deploy_sha`.
* Add stable local fallback values for `npm run dev` and ad hoc `npm run build`.

**File/Class Skeleton**

```text
package.json
vite.config.ts
.github/workflows/deploy.yml
.github/workflows/ci.yml
src/vite-env.d.ts
```

**Acceptance Criteria**

* Production build metadata reflects the exact commit used for the artifact.
* Production build can construct or receive a correct commit URL for that SHA.
* Local development does not require manual env setup to render the footer.
* The design avoids runtime network dependencies.

**Dependencies**

* M9-01

**Validation**

* `npm run build`
* CI/deploy workflow diff review

## M9-03 - Render title-screen provenance footer link

**Objective**

Render a compact, always-visible footer on the title screen that exposes release provenance and links to the exact commit without distracting from the quiz entry flow.

**Deliverables**

* Add a shared build-info helper that formats display text from injected metadata.
* Render the footer link in the title-screen panel beneath the main actions.
* Add localization-safe label handling if surrounding copy is needed.
* Apply low-emphasis styling that remains readable on mobile and desktop.

**File/Class Skeleton**

```text
src/shared/buildInfo.ts
src/features/title/ui/TitleScreen.tsx
src/styles/app.css
src/shared/i18n/catalog.ts
```

**Acceptance Criteria**

* Footer is visible on the title screen without scrolling on supported layouts.
* Default string includes version and short SHA.
* Clicking or tapping the footer opens the matching commit page when URL metadata is available.
* Missing metadata falls back to explicit placeholder values rather than blank UI.

**Dependencies**

* M9-01
* M9-02

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev -- --host 127.0.0.1 --port 4173 --strictPort`

## M9-04 - Verify deployed provenance and sync status docs

**Objective**

Confirm the published app displays the expected provenance footer and synchronize roadmap/status evidence after release.

**Deliverables**

* Verify the public URL shows the expected footer content for the released SHA.
* Record manual QA evidence under `docs/qa/reports/`.
* Sync milestone, current-state, next-step, and build-order docs.

**File/Class Skeleton**

```text
docs/qa/reports/
docs/current-state.md
docs/next-steps.md
docs/roadmap/milestones.md
docs/roadmap/implementation/build-order.md
docs/roadmap/implementation/m09-release-provenance-visibility.md
```

**Acceptance Criteria**

* Published app footer matches the intended release version and short SHA.
* QA report includes desktop and at least one mobile check.
* Status docs are synchronized with ticket completion state.

**Dependencies**

* M9-02
* M9-03

**Validation**

* `npm run test`
* `npm run build`
* Published URL smoke verification
