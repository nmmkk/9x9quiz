# Improvement Ideas Backlog

Last updated: 2026-02-14

## Evaluation Axis

* Core-value alignment: 小2の自発的な反復を増やせるか。
* Learning impact: 九九の定着にどれだけ効くか。
* UX simplicity: 操作の迷いを増やさないか。
* Delivery risk: 依存関係と実装リスクが過大でないか。

## Existing Proposal Review

| ID | Proposal | Importance | Priority | Comment |
| --- | --- | --- | --- | --- |
| E-01 | 言語トグルの導入 | Medium | Low | 将来拡張には有効だが、現時点の主対象 (日本の小2) への直接効果は限定的。 |
| E-02 | かけ算段の範囲オプション | High | High | 苦手範囲への集中練習に直結し、定着効果が大きい。 |
| E-03 | ハイスコア更新メッセージのバリエーション | Medium | Medium-High | 低コストで単調さを下げ、再プレイ意欲を上げやすい。 |
| E-04 | Timed / Challenge モード | Medium | Low | 早期導入は焦りによる離脱リスクがあるため後段が安全。 |

## New Idea Candidates

| ID | Proposal | Importance | Priority | Comment |
| --- | --- | --- | --- | --- |
| N-01 | 1タップ連続プレイ導線 | High | High | 反復の心理的コストを下げ、コアバリューに最短で効く。 |
| N-02 | まちがいおかわり3問 | High | High | 苦手の即時復習ができ、学習効率と達成感を両立できる。 |
| N-03 | 段ごとの習熟見える化 | High | Medium-High | 成長実感が出るため継続しやすく、復習対象も明確になる。 |
| N-04 | 正解/不正解の短い演出 | Medium-High | Medium | ドーパミン設計に有効だが、過剰演出は逆効果なので制御が必要。 |
| N-05 | ほめ言葉ローテーション | Medium | Medium | 文言の単調さを防ぎ、長期利用時の飽きを減らせる。 |
| N-06 | 一度ロード後のオフライン動作 | High | Medium-High | 自宅/学校での通信不安定時にも続けられ、利用継続性が上がる。 |
| N-07 | インストール可能なPWA | Medium-High | Medium | 起動導線と再訪率を改善できるが、運用設計 (更新通知) が必要。 |
| N-08 | ネイティブアプリ化 (iOS/Android) | Medium | Medium-Low | 配布面で有利だが、開発/運用コストが大きいため段階導入が前提。 |

## Milestone Mapping (Planned)

| Milestone | Primary Focus | Mapped Ideas |
| --- | --- | --- |
| M3 | Repeat engagement loop | N-01, N-04, N-05, E-03 |
| M4 | Adaptive practice depth | N-02, N-03, E-02 |
| M5 | Offline-ready PWA foundation | N-06, N-07 |
| M6 | Native packaging pilot | N-08 |

## Offline/PWA Risk Notes (For M5)

* Service worker導入後は、更新反映が遅れる可能性があるため、更新通知導線が必要。
* キャッシュ容量増加で初回ロードが重くなる可能性があるため、プリキャッシュ対象の選別が必要。
* localStorage依存の現在仕様はオフラインで動作可能だが、端末間同期は引き続き非対応。
