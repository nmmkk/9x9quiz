# Milestone 6 - Native Packaging Pilot

## Ticket Summary

| Ticket | Title | Status | Depends On | QA Checklist |
| --- | --- | --- | --- | --- |
| M6-01 | Choose native wrapper approach and document architecture | Completed | M5-04 | `npm run build`, architecture review notes |
| M6-02 | Scaffold native wrapper projects and build pipeline | Planned | M6-01 | wrapper build commands, `npm run build` |
| M6-03 | Integrate app runtime with native shell behavior baseline | Planned | M6-02 | wrapper run commands, manual smoke checks |
| M6-04 | Execute native pilot QA pass and sync status docs | Planned | M6-01, M6-02, M6-03 | `docs/qa/reports/`, status docs sync |

## Scope

* Goal:
  * Validate a low-risk path to distribute the existing web app as iOS/Android binaries.
  * Keep a single web-codebase-first strategy.
  * Confirm compatibility of storage, layout, and navigation behavior in native shells.
* Out of scope:
  * Full app-store launch and compliance checklist completion.
  * Native-only feature parity expansion.
  * Backend account integration.

## M6-01 - Choose native wrapper approach and document architecture

**Objective**

Select and document the wrapper strategy for native distribution with minimal web-code changes.

**Deliverables**

* Compare candidate wrappers (for example Capacitor) against project constraints.
* Document selected approach, trade-offs, and rollout plan.
* Define ownership boundaries between web app and native shell layers.

**File/Class Skeleton**

```text
docs/reference/native-strategy.md
docs/reference/design.md
```

**Acceptance Criteria**

* Wrapper choice and rationale are explicitly documented.
* Build/deploy assumptions are clear for both iOS and Android.
* Non-goals and known risks are listed.

**Dependencies**

* M5-04

**Validation**

* `npm run build`

## M6-02 - Scaffold native wrapper projects and build pipeline

**Objective**

Create native project skeletons wired to the existing web build output.

**Deliverables**

* Initialize wrapper project structure for iOS and Android.
* Wire web build output into wrapper sync/build commands.
* Add basic setup instructions for local development.

**File/Class Skeleton**

```text
capacitor.config.*
android/
ios/
docs/reference/native-build-setup.md
```

**Acceptance Criteria**

* Native projects can be generated and synchronized from web assets.
* Development setup docs are copy-paste ready.
* Web build continues to pass.

**Dependencies**

* M6-01

**Validation**

* `npm run build`
* Wrapper sync/build commands for selected toolchain

## M6-03 - Integrate app runtime with native shell behavior baseline

**Objective**

Ensure core app flow works in native shells with minimal behavior differences.

**Deliverables**

* Validate storage behavior in native WebView environment.
* Handle platform basics (safe area, back navigation expectation, viewport stability).
* Run smoke flow checks (Title -> Mode -> Quiz -> Result).

**File/Class Skeleton**

```text
src/styles/app.css
src/App.tsx
docs/reference/native-runtime-notes.md
```

**Acceptance Criteria**

* Core flow is functional on representative iOS/Android test devices or simulators.
* No critical layout breakage from safe-area or viewport differences.
* High-score and local progress persistence remain functional.

**Dependencies**

* M6-02

**Validation**

* `npm run build`
* Wrapper run commands for selected toolchain

## M6-04 - Execute native pilot QA pass and sync status docs

**Objective**

Capture pilot QA evidence and synchronize roadmap/status documentation.

**Deliverables**

* Run smoke QA scenarios for iOS/Android pilot builds.
* Record known gaps and follow-up backlog items.
* Sync milestone/status docs after validation.

**File/Class Skeleton**

```text
docs/qa/reports/
docs/current-state.md
docs/next-steps.md
docs/roadmap/milestones.md
docs/roadmap/implementation/build-order.md
```

**Acceptance Criteria**

* QA report includes platform-specific findings and blockers.
* Milestone/ticket statuses are synchronized across docs.
* Next-step backlog is updated with concrete follow-up actions.

**Dependencies**

* M6-01
* M6-02
* M6-03

**Validation**

* Platform smoke verification records

## M6-01 Progress Notes

* Selected wrapper: Capacitor.
* Architecture decision and trade-offs: `docs/reference/native-strategy.md`.
* Design spec sync: `docs/reference/design.md` section "Native Packaging Direction (M6-01)".
* Priority update (2026-02-20): `M6-02` onward is deferred until M7 web release CI/CD is operational.
