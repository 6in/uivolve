# Mermaid ダイアグラム (YAML)

- カテゴリ: コンポーネントカタログ
- 使用 layout: `grid`
- 使用 xtype: `mermaid`, `panel`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
# Mermaid.js 全図種カタログ (mermaid は独自拡張)
# YAML のブロックスカラー (value: |) が複数行の記法と相性が良い
xtype: panel
itemId: mermaidCatalog
title: Mermaid ダイアグラムカタログ
bodyPadding: 12
layout:
  type: grid
  columns: 2
  gap: 12
items:
  - title: フローチャート (graph)
    itemId: flowPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: flowChart
        value: |
          graph LR
            A[受注] --> B{在庫あり?}
            B -- はい --> C[出荷指示]
            B -- いいえ --> D[発注]
            D --> C
            C --> E[請求]
  - title: シーケンス図 (sequenceDiagram)
    itemId: seqPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: seqDiagram
        value: |
          sequenceDiagram
            営業->>システム: 受注登録
            システム->>上長: 承認依頼
            上長-->>システム: 承認
            システム-->>営業: 完了通知
  - title: クラス図 (classDiagram)
    itemId: classPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: classDiagram
        value: |
          classDiagram
            class Order {
              +String no
              +save()
            }
            Order <|-- RushOrder
            Order o-- OrderItem
  - title: 状態遷移図 (stateDiagram)
    itemId: statePanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: stateDiagram
        value: |
          stateDiagram-v2
            [*] --> 受注
            受注 --> 出荷済
            出荷済 --> 請求済
            請求済 --> [*]
  - title: ER 図 (erDiagram)
    itemId: erPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: erDiagram
        value: |
          erDiagram
            CUSTOMER ||--o{ ORDER : places
            ORDER ||--|{ ORDER_ITEM : contains
  - title: 円グラフ (pie)
    itemId: piePanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: pieChart
        value: |
          pie title 受注構成
            "製造" : 48
            "卸売" : 32
            "小売" : 28
  - title: ガントチャート (gantt)
    itemId: ganttPanel
    colspan: 2
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: ganttChart
        value: |
          gantt
            title 開発計画
            dateFormat YYYY-MM-DD
            section 設計
              画面設計: 2026-07-01, 5d
            section 実装
              フロントエンド: 2026-07-06, 7d
              結合テスト: 2026-07-13, 4d
  - title: ユーザージャーニー (journey)
    itemId: journeyPanel
    colspan: 2
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: journeyMap
        value: |
          journey
            title 問い合わせ体験
            section 受付
              フォーム入力: 3: 顧客
              自動返信: 4: システム
            section 対応
              回答: 5: サポート
  - title: Git グラフ (gitGraph)
    itemId: gitPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: gitGraph
        value: |
          gitGraph
            commit
            branch develop
            commit
            checkout main
            merge develop
  - title: マインドマップ (mindmap)
    itemId: mindmapPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: mindMap
        value: |
          mindmap
            root((uivolve))
              DSL
                JSON5
                YAML
              AI 連携
              MDX 埋め込み
  - title: タイムライン (timeline)
    itemId: timelinePanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: timeLine
        value: |
          timeline
            title リリース履歴
            2026-07-07 : POC 完成
            2026-07-08 : コンポーネント拡充
                       : Mermaid 対応
  - title: 4 象限チャート (quadrantChart)
    itemId: quadrantPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: quadrant
        value: |
          quadrantChart
            title 施策の優先度
            x-axis 低コスト --> 高コスト
            y-axis 低効果 --> 高効果
            quadrant-1 検討
            quadrant-2 すぐやる
            quadrant-3 保留
            quadrant-4 やらない
            施策A: [0.2, 0.8]
            施策B: [0.7, 0.6]
            施策C: [0.4, 0.3]
  - title: XY チャート (xychart)
    itemId: xyPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: xyChart
        value: |
          xychart-beta
            title "月次売上"
            x-axis ["4月", "5月", "6月"]
            y-axis "売上 (万円)" 0 --> 200
            bar [96, 134, 128]
            line [96, 134, 128]
  - title: サンキー図 (sankey) ※日本語ラベル非対応
    itemId: sankeyPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: sankey
        value: |
          sankey-beta
          Order,Ship,96
          Order,Cancel,8
          Ship,Invoice,96
  - title: ブロック図 (block)
    itemId: blockPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: blockDiagram
        value: |
          block-beta
            columns 3
            F["フロント"] A["API"] D[("DB")]
            F --> A
            A --> D
  - title: 要求図 (requirementDiagram)
    itemId: reqPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: reqDiagram
        value: |
          requirementDiagram
            requirement perf_req {
              id: 1
              text: "応答は1秒以内"
              risk: high
              verifymethod: test
            }
            element order_system {
              type: "system"
            }
            order_system - satisfies -> perf_req
  - title: C4 コンテキスト図 (C4Context)
    itemId: c4Panel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: c4Context
        value: |
          C4Context
            Person(user, "利用者")
            System(sys, "受注システム")
            SystemDb(db, "受注DB")
            Rel(user, sys, "使う")
            Rel(sys, db, "読み書き")
  - title: パケット図 (packet)
    itemId: packetPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: packetDiagram
        value: |
          packet-beta
            0-15: "送信元ポート"
            16-31: "宛先ポート"
            32-63: "シーケンス番号"
  - title: かんばん (kanban)
    itemId: kanbanPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: kanbanBoard
        value: |
          kanban
            todo[未着手]
              t1[仕様確認]
            doing[対応中]
              t2[画面実装]
            done[完了]
              t3[設計レビュー]
  - title: アーキテクチャ図 (architecture)
    itemId: archPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: archDiagram
        value: |
          architecture-beta
            group app(cloud)[App]
            service web(server)[Web] in app
            service db(database)[DB] in app
            web:R -- L:db
```
