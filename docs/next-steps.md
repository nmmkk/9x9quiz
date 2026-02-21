# Next Steps

## Immediate

1. Start `M7-03` to establish automatic web deployment from `main` based on `docs/reference/web-release-strategy.md` runbook.
2. After `M7-03`, execute `M7-04` to strengthen release quality gates and rollback runbook.
3. During `M7`, evaluate `N-09` (正解進捗の可視化ゲージ/アイコン), `N-10` (段ごとの正解率カードから段別問題へ直行), and `N-11` (成績リセット機能) as post-release quality uplift candidates.
4. Keep `M6-01` architecture decision (`docs/reference/native-strategy.md`) as a deferred option and postpone `M6-02` onward until web release operation stabilizes.

## Documentation Follow-Through

1. Keep `docs/current-state.md` aligned whenever ticket status changes.
2. Record manual verification artifacts under `docs/qa/reports/`.
3. Update `docs/roadmap/implementation/build-order.md` when dependencies or statuses change.
