# Improvement Ideas Backlog

Last updated: 2026-02-28

## Current Position

* Milestone status: `M1`-`M5` Completed, `M6` Partial (strategy decision only), `M7` Completed, `M8` Partial (`M8-01` completed).
* Web release CI/CD is now operational on production URL, so the next idea intake should be managed as either:
  * next milestone candidates (when order and scope are fixed), or
  * backlog candidates (when timing/scope is still undecided).

## Evaluation Axis

* Core-value alignment: 小2の自発的な反復を増やせるか。
* Learning impact: 九九の定着にどれだけ効くか。
* UX simplicity: 操作の迷いを増やさないか。
* Delivery risk: 依存関係と実装リスクが過大でないか。

## Milestone-Mapped Ideas

| Milestone | Theme | Ideas | Status |
| --- | --- | --- | --- |
| M3 | Repeat engagement loop | 1タップ連続プレイ導線 / 正解・不正解の短い演出 / ほめ言葉ローテーション / ハイスコア更新メッセージのバリエーション | Completed |
| M4 | Adaptive practice depth | まちがいおかわり3問 / 段ごとの習熟見える化 / かけ算段の範囲オプション | Completed |
| M5 | Offline-ready PWA foundation | 一度ロード後のオフライン動作 / インストール可能なPWA | Completed |
| M6 | Native packaging pilot | ネイティブアプリ化 (iOS/Android) | Partial (`M6-01` only completed; implementation deferred) |
| M7 | Web release CI/CD | GitHub CI/CD + web app自動デプロイ | Completed |

## Backlog Candidates (Unscheduled)

| Backlog ID | Idea | Importance | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| B-01 | 正解進捗の可視化ゲージ/アイコン | Medium-High | Medium-High | Completed in M8 (`M8-01`) | 正解の積み上がりを視覚化し、残り量と達成感を同時に伝える。画面上部横ゲージまたは右端縦ゲージを候補にする。 |
| B-02 | 段ごとの正解率カードから段別問題へ直行 | High | Medium-High | Planned in M8 (`M8-02`) | 習熟カードから練習開始までの遷移を短縮し、反復導線を強化する。 |
| B-03 | 成績リセット機能 | Medium | Medium | Planned in M8 (`M8-03`) | 端末共有時の再スタート要求に対応。誤操作防止のUIが前提。 |
| B-04 | 言語トグルの導入 | Medium | Low | Backlog | 将来拡張には有効だが、現時点の主対象 (日本の小2) への直接効果は限定的。 |
| B-05 | Timed / Challenge モード | Medium | Low | Backlog | 早期導入は焦りによる離脱リスクがあるため後段が安全。 |

## Management Rule

* This file is a backlog index only.
* Once an idea is selected with concrete order/scope, move it into milestone roadmap tickets under `docs/roadmap/implementation/`.
* Keep milestone status truth in:
  * `docs/roadmap/milestones.md`
  * `docs/current-state.md`
  * `docs/next-steps.md`
