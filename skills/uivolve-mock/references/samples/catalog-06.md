# コードエディタ (YAML)

- カテゴリ: コンポーネントカタログ
- 使用 layout: `fit`
- 使用 xtype: `codeeditor`, `diffeditor`, `tabpanel`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
# ソースコードエディタ (codeeditor) の例 — Monaco Editor
# language に Monaco の言語 ID、theme に light / dark を指定
xtype: tabpanel
itemId: codeTabs
height: 420
margin: 12
items:
  - title: TypeScript (dark)
    itemId: tsTab
    iconCls: x-fa fa-code
    layout: fit
    items:
      - xtype: codeeditor
        itemId: tsEditor
        language: typescript
        theme: dark
        minimap: true
        value: |
          export interface Order {
            no: string
            customer: string
            amount: number
          }

          export function total(orders: Order[]): number {
            return orders.reduce((sum, o) => sum + o.amount, 0)
          }
  - title: SQL (light)
    itemId: sqlTab
    iconCls: x-fa fa-database
    layout: fit
    items:
      - xtype: codeeditor
        itemId: sqlEditor
        language: sql
        theme: light
        value: |
          SELECT o.no, c.name, o.amount
          FROM orders o
          JOIN customers c ON c.id = o.customer_id
          WHERE o.status = '受注'
          ORDER BY o.amount DESC;
  - title: JSON (読み取り専用)
    itemId: jsonTab
    iconCls: x-fa fa-lock
    layout: fit
    items:
      - xtype: codeeditor
        itemId: jsonViewer
        language: json
        theme: light
        readOnly: true
        lineNumbers: false
        value: |
          {
            "name": "uivolve",
            "components": 38,
            "license": "MIT"
          }
  - title: 差分表示 (diff)
    itemId: diffTab
    iconCls: x-fa fa-code-compare
    layout: fit
    items:
      - xtype: diffeditor
        itemId: taxDiff
        language: typescript
        original: |
          export function total(orders: Order[]): number {
            return orders.reduce((sum, o) => sum + o.amount, 0)
          }
        value: |
          export function total(orders: Order[], taxRate = 0.1): number {
            const sub = orders.reduce((sum, o) => sum + o.amount, 0)
            return Math.round(sub * (1 + taxRate))
          }
```
