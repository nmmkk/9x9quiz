# Implementation Roadmap

## 1) Purpose

* This roadmap defines implementation tickets for the first browser-playable release of 9x9quiz.
* Release target: Web MVP V1 with fixed-session quiz flow, score/high score, and local-only persistence.

## 2) Milestone Files

* `docs/roadmap/implementation/m01-web-mvp-core.md`

## 3) Supporting Plans

* `docs/roadmap/implementation/build-order.md`

## 4) Ticket and Status Conventions

* Milestone file naming: `m<nn>-<slug>.md`
* Ticket ID format: `M<n>-<nn>` (example: `M1-01`)
* Required ticket sections:
  * Objective
  * Deliverables
  * File/Class Skeleton
  * Acceptance Criteria
  * Dependencies
* Status vocabulary used in this repository:
  * Planned
  * Partial
  * Completed

## 5) Source References

* `README.md`
* `docs/reference/design.md`

## 6) Update Rules

* When ticket status changes, sync all of the following docs:
  * `docs/roadmap/implementation/m<nn>-<slug>.md`
  * `docs/roadmap/milestones.md`
  * `docs/current-state.md`
  * `docs/next-steps.md`
  * `docs/roadmap/implementation/build-order.md`

## Quality Checklist

* Ticket IDs and dependency references are stable and valid.
* Ticket scope stays PR-sized and executable in order.
* Status docs remain aligned with milestone docs.
* Validation commands are copy-paste ready where provided.
