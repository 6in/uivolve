# YAML 記法

- カテゴリ: 基本
- 使用 layout: (なし)
- 使用 xtype: `checkbox`, `combobox`, `panel`, `textarea`, `textfield`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
# YAML 記法の例 — JSON5 と自動判別されます
# ツールバーの「JSON5 へ変換」で相互変換もできます
xtype: panel
itemId: contactPanel
title: 問い合わせフォーム (YAML)
width: 560
margin: 16
bodyPadding: 12
tbar:
  - itemId: btnSubmit
    text: 送信
    ui: primary
    iconCls: x-fa fa-paper-plane
  - itemId: btnClear
    text: クリア
items:
  - xtype: combobox
    itemId: categoryCombo
    fieldLabel: 種別
    options: [製品について, 障害報告, その他]
  - xtype: textfield
    itemId: subjectField
    fieldLabel: 件名
    emptyText: 例) ログインできない
  - xtype: textarea
    itemId: bodyArea
    fieldLabel: 内容
    rows: 5
  - xtype: checkbox
    itemId: replyMailCheck
    fieldLabel: ''
    boxLabel: 回答をメールで受け取る
    checked: true
```
