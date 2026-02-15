# Milestone 5 - Offline-ready PWA Foundation

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M5-01 | Add service worker app-shell caching for offline-after-first-load | Planned | M4-06 | `npm run test`, `npm run build`, `npm run dev` |
| M5-02 | Add update strategy and cache version management | Planned | M5-01 | `npm run test`, `npm run build`, `npm run dev` |
| M5-03 | Add installable PWA metadata and install UX baseline | Planned | M5-01, M5-02 | `npm run build`, `npm run dev` |
| M5-04 | Execute offline/PWA QA pass and sync status docs | Planned | M5-01, M5-02, M5-03 | `npm run test`, `npm run build`, `npm run dev`, `docs/qa/reports/` |

## Scope

* Goal:
  * Ensure the app can continue running offline after first successful load.
  * Ship a stable installable PWA baseline with predictable update behavior.
  * Preserve existing quiz logic and local progress/high-score storage behavior.
* Out of scope:
  * Multi-device sync or backend-backed persistence.
  * Push notifications and background sync jobs.
  * Native app packaging work (scheduled in M6).

## M5-01 - Add service worker app-shell caching for offline-after-first-load

**Objective**

Cache the minimal runtime bundle and static assets needed for offline play after initial load.

**Deliverables**

* Add service worker integration for app-shell precache.
* Define explicit precache scope and asset-size budget.
* Confirm localStorage-based game/session storage behavior offline.

**File/Class Skeleton**

```text
vite.config.ts
package.json
src/main.tsx
src/sw.ts
```

**Acceptance Criteria**

* App loads and runs with network disabled after one successful online load.
* Core flows (Title -> Mode -> Quiz -> Result) remain playable offline.
* No blocking runtime errors when offline.

**Dependencies**

* M4-06

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`

## M5-02 - Add update strategy and cache version management

**Objective**

Prevent stale-cache confusion by defining explicit update and cache invalidation behavior.

**Deliverables**

* Add cache versioning strategy.
* Add UI prompt or lightweight notice when new version is available.
* Document update flow and fallback behavior.

**File/Class Skeleton**

```text
src/shared/pwa/updateManager.ts
src/App.tsx
src/shared/i18n/catalog.ts
docs/reference/design.md
```

**Acceptance Criteria**

* App can detect newly available build and prompt user to refresh.
* Cache update path is deterministic and documented.
* Existing app behavior remains stable without forced reload loops.

**Dependencies**

* M5-01

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`

## M5-03 - Add installable PWA metadata and install UX baseline

**Objective**

Enable home-screen installation with a simple, non-intrusive install affordance.

**Deliverables**

* Add web manifest and icon set for target platforms.
* Add install availability handling and optional install action.
* Verify standalone display mode behavior for key screens.

**File/Class Skeleton**

```text
public/manifest.webmanifest
public/icons/*
index.html
src/features/title/ui/TitleScreen.tsx
```

**Acceptance Criteria**

* Browser install criteria are satisfied for supported environments.
* Install action does not block normal browser play flow.
* Core UI remains usable in standalone mode.

**Dependencies**

* M5-01
* M5-02

**Validation**

* `npm run build`
* `npm run dev`

## M5-04 - Execute offline/PWA QA pass and sync status docs

**Objective**

Verify offline and installable behavior end-to-end and synchronize status documentation.

**Deliverables**

* Run manual online/offline transition scenarios.
* Validate install flow on desktop and mobile browsers where supported.
* Record QA evidence under `docs/qa/reports/`.
* Sync roadmap/status docs after validation.

**File/Class Skeleton**

```text
docs/qa/reports/
docs/current-state.md
docs/next-steps.md
docs/roadmap/milestones.md
docs/roadmap/implementation/build-order.md
```

**Acceptance Criteria**

* QA report covers offline run and update prompt scenarios.
* Milestone/ticket statuses are synchronized across docs.
* No unresolved blocking defects remain for M5 scope.

**Dependencies**

* M5-01
* M5-02
* M5-03

**Validation**

* `npm run test`
* `npm run build`
* `npm run dev`
