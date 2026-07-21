# 承認ワークフロー (YAML)

- カテゴリ: 業務画面
- 使用 layout: `border`, `column`, `vbox`
- 使用 xtype: `displayfield`, `form`, `grid`, `mermaid`, `panel`, `textareafield`, `textfield`, `toast`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
# 業務画面: 承認ワークフロー (経費・稟議)
# 承認待ち一覧 + 申請内容 + 承認ルート (mermaid) + 承認履歴 + 承認アクション。
# mermaid の複数行定義は YAML のブロックスカラー (value: |) が書きやすい
xtype: panel
itemId: approvalScreen
title: 承認ワークフロー — 経費・稟議
layout: border
items:
  - region: west
    xtype: grid
    itemId: pendingGrid
    title: 承認待ち (5 件)
    width: 380
    split: true
    columns:
      - { text: 申請番号, dataIndex: reqNo, width: 90 }
      - { text: 種別, dataIndex: reqType, width: 90 }
      - { text: 申請者, dataIndex: applicant, flex: 1 }
      - { text: 金額, dataIndex: amount, width: 90, align: right }
    store:
      data:
        - { reqNo: EXP-0012, reqType: 交通費, applicant: 佐藤 花子, amount: "48,200" }
        - { reqNo: EXP-0013, reqType: 接待費, applicant: 鈴木 次郎, amount: "32,000" }
        - { reqNo: PUR-0088, reqType: 備品購入, applicant: 高橋 三郎, amount: "128,000" }
        - { reqNo: EXP-0014, reqType: 出張旅費, applicant: 伊藤 四郎, amount: "86,500" }
        - { reqNo: CTR-0031, reqType: 契約稟議, applicant: 渡辺 五子, amount: "1,200,000" }
    listeners:
      select: onSelectRequest
  - region: center
    xtype: panel
    itemId: requestDetail
    title: 申請内容 — EXP-0012 (交通費)
    bodyPadding: 12
    layout:
      type: vbox
      align: stretch
    items:
      - xtype: form
        itemId: requestForm
        layout: column
        items:
          - { xtype: displayfield, itemId: fldNo, fieldLabel: 申請番号, value: EXP-0012, labelWidth: 80, columnWidth: 0.5 }
          - { xtype: displayfield, itemId: fldApplicant, fieldLabel: 申請者, value: 佐藤 花子 (営業部), labelWidth: 80, columnWidth: 0.5 }
          - { xtype: displayfield, itemId: fldAmount, fieldLabel: 金額, value: "¥48,200", labelWidth: 80, columnWidth: 0.5 }
          - { xtype: displayfield, itemId: fldDate, fieldLabel: 発生日, value: 2026-07-08, labelWidth: 80, columnWidth: 0.5 }
          - { xtype: displayfield, itemId: fldStatus, fieldLabel: ステータス, value: 部長承認待ち, labelWidth: 80, columnWidth: 1 }
          - xtype: textareafield
            itemId: fldReason
            fieldLabel: 事由
            labelWidth: 80
            columnWidth: 1
            height: 52
            readOnly: true
            value: 大阪出張 (○○商事 定例訪問) の新幹線往復。7/8 日帰り。
      - xtype: panel
        itemId: routePanel
        title: 承認ルート
        bodyPadding: 8
        margin: "8 0"
        items:
          - xtype: mermaid
            itemId: routeChart
            value: |
              graph LR
                a["申請<br>佐藤 花子<br>07/08 ✓"] --> b["課長承認<br>田中 一郎<br>07/08 ✓"]
                b --> c["部長承認<br>山本 部長<br>処理待ち"]
                c --> d[経理確認] --> e((完了))
                style c fill:#fff3cd,stroke:#e0a800,stroke-width:2px
      - xtype: grid
        itemId: historyGrid
        title: 承認履歴
        flex: 1
        minHeight: 120
        columns:
          - { text: 日時, dataIndex: ts, width: 130 }
          - { text: ステップ, dataIndex: step, width: 90 }
          - { text: 担当者, dataIndex: person, width: 100 }
          - { text: アクション, dataIndex: action, width: 90 }
          - { text: コメント, dataIndex: comment, flex: 1 }
        store:
          data:
            - { ts: "2026-07-08 09:12", step: 申請, person: 佐藤 花子, action: 申請, comment: 7 月分 大阪出張の旅費精算です }
            - { ts: "2026-07-08 14:30", step: 課長承認, person: 田中 一郎, action: 承認 ✓, comment: 問題ありません }
            - { ts: "—", step: 部長承認, person: 山本 部長, action: 処理待ち, comment: "" }
    bbar:
      - xtype: textfield
        itemId: commentField
        emptyText: 承認コメントを入力...
        flex: 1
      - { itemId: btnSendBack, text: 差戻し, iconCls: x-fa fa-rotate-left, handler: onSendBack }
      - { itemId: btnReject, text: 却下, iconCls: x-fa fa-ban, handler: onReject }
      - { itemId: btnApprove, text: 承認, ui: primary, iconCls: x-fa fa-check, handler: onApprove }
  # 直前に処理した申請の通知例 (× で消せる)
  - xtype: toast
    itemId: approvedToast
    title: 承認しました
    html: "申請 <b>EXP-0011</b> を承認しました (次のステップ: 経理確認)"
    iconCls: x-fa fa-circle-check
    align: tr
```
