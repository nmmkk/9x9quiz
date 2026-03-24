# Next Steps

## Immediate

1. Evaluate `N-09` (正解進捗の可視化ゲージ/アイコン), `N-10` (段ごとの正解率カードから段別問題へ直行), and `N-11` (成績リセット機能) as post-release quality uplift candidates.
2. Open/merge the `feature/milestone-9` PR so Pages can deploy the released provenance footer from `main`.
3. Rerun `M9-04` published desktop/mobile smoke verification after deploy, then close M9 across `docs/current-state.md`, `docs/roadmap/milestones.md`, and `docs/roadmap/implementation/build-order.md`.
4. Complete `M8-04` manual desktop/mobile smoke verification on published URL for progress indicator, direct-jump flow, and protected reset flow.
5. Keep `M6-01` architecture decision (`docs/reference/native-strategy.md`) as a deferred option and postpone `M6-02` onward until product priorities require native packaging.
6. Optional: run one `workflow_dispatch` deploy rerun on `main` and record run URL as additional operational evidence.

## Documentation Follow-Through

1. Keep `docs/current-state.md` aligned whenever ticket status changes.
2. Record manual verification artifacts under `docs/qa/reports/`.
3. Update `docs/roadmap/implementation/build-order.md` when dependencies or statuses change.
