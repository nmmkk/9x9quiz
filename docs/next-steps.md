# Next Steps

## Immediate

1. Evaluate `N-09` (正解進捗の可視化ゲージ/アイコン), `N-10` (段ごとの正解率カードから段別問題へ直行), and `N-11` (成績リセット機能) as post-release quality uplift candidates.
2. Start `M9-02` to inject version/SHA metadata and canonical commit URLs into both local and deploy builds using the exact build revision.
3. Execute `M9-03` next so the title screen renders the provenance footer and opens the matching commit page when metadata is present.
4. Keep `M6-01` architecture decision (`docs/reference/native-strategy.md`) as a deferred option and postpone `M6-02` onward until product priorities require native packaging.
5. Optional: run one `workflow_dispatch` deploy rerun on `main` and record run URL as additional operational evidence.

## Documentation Follow-Through

1. Keep `docs/current-state.md` aligned whenever ticket status changes.
2. Record manual verification artifacts under `docs/qa/reports/`.
3. Update `docs/roadmap/implementation/build-order.md` when dependencies or statuses change.
