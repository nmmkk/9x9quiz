# Native Packaging Strategy (M6-01)

Last updated: 2026-02-18

## 1) Decision

* Selected wrapper: Capacitor.
* Decision scope: native packaging pilot for iOS and Android in M6 while keeping a single web app codebase.

## 2) Candidate Comparison

| Option | Fit for this project | Trade-offs |
| --- | --- | --- |
| Capacitor | Best fit. Keeps web-first architecture, has stable iOS/Android project generation, and supports gradual native plugin usage only when needed. | Requires native toolchains (Xcode/Android Studio) and periodic sync discipline between web build and native projects. |
| Cordova | Similar packaging model but weaker modern momentum for new projects compared with Capacitor. | Plugin ecosystem can be inconsistent for newer platform requirements; weaker long-term default choice. |
| Tauri (mobile alpha/beta path) | Small runtime is attractive, but mobile workflow maturity is still lower-risk in Capacitor today for this team profile. | Adds Rust-centric toolchain and higher adoption risk for near-term iOS/Android pilot delivery. |
| React Native rewrite | Strong native UI control, but does not match current constraint of minimal web-code changes. | High rewrite cost and behavior divergence risk from existing React web app. |

## 3) Why Capacitor

* Preserves existing React + Vite web runtime with minimal code changes.
* Supports incremental adoption: start with WebView shell, add native plugins only if required.
* Aligns with M6 goal to validate packaging and runtime compatibility before broader native expansion.

## 4) Architecture Boundaries

* Web app layer (owner: web app implementation):
  * Quiz flow, scoring, localization, and UI behavior.
  * localStorage persistence model.
  * PWA/service worker behavior for browser distribution path.
* Native shell layer (owner: native packaging integration):
  * iOS/Android project scaffolding, build/signing setup, and app metadata.
  * Web asset synchronization (`npm run build` => Capacitor sync/copy).
  * Platform wrappers for lifecycle/navigation integration when needed.
* Boundary rule:
  * Do not duplicate quiz logic in native code.
  * Native layer should host and expose platform primitives only.

## 5) Build and Deploy Assumptions

* Shared assumption:
  * Web assets are produced by `npm run build` and used as the packaged app content.
* iOS:
  * Requires macOS + Xcode for simulator/device builds and signing.
  * Capacitor iOS project is generated and synced from the web build output.
* Android:
  * Requires Android Studio + SDK for emulator/device builds and signing.
  * Capacitor Android project is generated and synced from the web build output.

## 6) Rollout Plan

1. M6-02: scaffold Capacitor config and iOS/Android project shells; document local setup and sync commands.
2. M6-03: validate runtime behavior in native shells (safe area, back navigation expectation, storage persistence).
3. M6-04: execute pilot QA and record platform-specific findings.

## 7) Non-goals (M6)

* Full app-store release operations and policy/compliance completion.
* Native-only feature expansion beyond shell integration needs.
* Backend account sync and cross-device data migration.

## 8) Known Risks and Mitigations

* Risk: environment setup friction for native toolchains.
  * Mitigation: keep setup docs copy-paste ready and run smoke checks early.
* Risk: runtime differences in viewport/safe-area/navigation behavior.
  * Mitigation: define targeted checks in M6-03 and capture findings in QA report.
* Risk: drift between web build output and native packaged assets.
  * Mitigation: enforce explicit build/sync sequence in docs and ticket checklists.
