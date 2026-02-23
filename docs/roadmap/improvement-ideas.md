# Improvement Ideas Backlog

Last updated: 2026-02-20

## Project Status Snapshot

* Milestone status is now `M1`-`M5` Completed, `M6` Partial (strategy decisionのみ完了), and release priority has moved to web delivery readiness.
* Ideas mapped to `M3`/`M4`/`M5` are mostly delivered; current backlog focus is CI/CD + web deployment and app quality uplift.

## Evaluation Axis

* Core-value alignment: 小2の自発的な反復を増やせるか。
* Learning impact: 九九の定着にどれだけ効くか。
* UX simplicity: 操作の迷いを増やさないか。
* Delivery risk: 依存関係と実装リスクが過大でないか。

## Existing Proposal Review

| ID | Proposal | Importance | Priority | Status | Comment |
| --- | --- | --- | --- | --- | --- |
| E-01 | 言語トグルの導入 | Medium | Low | Backlog | 将来拡張には有効だが、現時点の主対象 (日本の小2) への直接効果は限定的。 |
| E-02 | かけ算段の範囲オプション | High | High | Delivered (M4) | 苦手範囲への集中練習に直結し、定着効果が大きい。 |
| E-03 | ハイスコア更新メッセージのバリエーション | Medium | Medium-High | Delivered (M3) | 低コストで単調さを下げ、再プレイ意欲を上げやすい。 |
| E-04 | Timed / Challenge モード | Medium | Low | Backlog | 早期導入は焦りによる離脱リスクがあるため後段が安全。 |

## New Idea Candidates

| ID | Proposal | Importance | Priority | Status | Comment |
| --- | --- | --- | --- | --- | --- |
| N-01 | 1タップ連続プレイ導線 | High | High | Delivered (M3) | 反復の心理的コストを下げ、コアバリューに最短で効く。 |
| N-02 | まちがいおかわり3問 | High | High | Delivered (M4) | 苦手の即時復習ができ、学習効率と達成感を両立できる。 |
| N-03 | 段ごとの習熟見える化 | High | Medium-High | Delivered (M4) | 成長実感が出るため継続しやすく、復習対象も明確になる。 |
| N-04 | 正解/不正解の短い演出 | Medium-High | Medium | Delivered (M3) | ドーパミン設計に有効だが、過剰演出は逆効果なので制御が必要。 |
| N-05 | ほめ言葉ローテーション | Medium | Medium | Delivered (M3) | 文言の単調さを防ぎ、長期利用時の飽きを減らせる。 |
| N-06 | 一度ロード後のオフライン動作 | High | Medium-High | Delivered (M5) | 自宅/学校での通信不安定時にも続けられ、利用継続性が上がる。 |
| N-07 | インストール可能なPWA | Medium-High | Medium | Delivered (M5) | 起動導線と再訪率を改善できるが、運用設計 (更新通知) が必要。 |
| N-08 | ネイティブアプリ化 (iOS/Android) | Medium | Low | Backlog (Post-web release) | 配布面で有利だが、開発/運用コストが大きいため、web公開と品質強化の後段に回す。 |
| N-09 | 正解進捗の可視化ゲージ/アイコン | Medium-High | Medium-High | Evaluate in M7 | 正解の積み上がりを視覚化し、残り量と達成感を同時に伝える。画面上部横ゲージか右端縦ゲージを候補に、色変化は段階的で控えめにする。 |
| N-10 | 段ごとの正解率カードから段別問題へ直行 | High | Medium-High | Evaluate in M7 | 習熟カードの発見から練習開始までの遷移を短縮し、反復導線をさらに強化する。 |
| N-11 | 成績リセット機能 | Medium | Medium | Evaluate in M7 | 端末共有時の再スタート要求に対応し、誤操作を避ける安全なUI設計を前提にする。 |
| N-12 | GitHub CI/CD + web app自動デプロイ | High | Highest | Planned (M7) | mainへの変更を自動テスト・自動ビルド・自動公開し、反復改善のリードタイムを短縮する。 |

## Milestone Mapping (Current)

| Milestone | Primary Focus | Mapped Ideas |
| --- | --- | --- |
| M3 (Completed) | Repeat engagement loop | N-01, N-04, N-05, E-03 |
| M4 (Completed) | Adaptive practice depth | N-02, N-03, E-02 |
| M5 (Completed) | Offline-ready PWA foundation | N-06, N-07 |
| M6 (Partial, De-prioritized) | Native packaging strategy baseline only | N-08 |
| M7 (Planned, Highest) | Web release CI/CD and quality loop | N-12, N-09, N-10, N-11 |
| Post-M7 backlog | Optional expansion after web stabilization | E-01, E-04 |

## Release-First Notes

* `M5` でオフライン/PWA基盤は完了済み。次の最優先は GitHub CI/CD による web app 公開の自動化。
* `N-09`/`N-10`/`N-11` は `M7` 実装中に評価対象として扱い、公開後の利用データとQA所見で導入可否を確定する。
* `M6` は `M6-01` の方針確定状態を維持し、native実装 (`M6-02` 以降) は後順位として保留する。
* localStorage中心の現行仕様は継続し、端末間同期は引き続き非対応とする。
