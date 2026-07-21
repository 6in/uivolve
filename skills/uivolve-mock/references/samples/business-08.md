# ログイン + メインメニュー (card)

- カテゴリ: 業務画面
- 使用 layout: `card`, `center`, `grid`
- 使用 xtype: `checkbox`, `container`, `displayfield`, `panel`, `textfield`, `window`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// 業務画面: ログイン → メインメニュー (card レイアウト)
// activeItem を 0 にするとログイン画面、1 にするとメニュー画面。
// 画面遷移の前後を 1 つの DSL で表現し、handler で遷移の意図を伝える
{
  xtype: 'container',
  itemId: 'appRoot',
  layout: { type: 'card', activeItem: 1 },
  items: [
    // ---- card 0: ログイン ----
    {
      xtype: 'container',
      itemId: 'loginCard',
      layout: 'center',
      items: [
        {
          xtype: 'window',
          itemId: 'loginWindow',
          title: '販売管理システム — ログイン',
          width: 380,
          closable: false,
          bodyPadding: 16,
          items: [
            { xtype: 'textfield', itemId: 'loginUser', fieldLabel: 'ユーザーID', labelWidth: 90, allowBlank: false },
            { xtype: 'textfield', itemId: 'loginPass', fieldLabel: 'パスワード', labelWidth: 90, inputType: 'password', allowBlank: false },
            { xtype: 'checkbox', itemId: 'loginKeep', fieldLabel: '', labelWidth: 90, boxLabel: 'ログイン状態を保持' },
          ],
          bbar: ['->', { itemId: 'btnDoLogin', text: 'ログイン', ui: 'primary', handler: 'onLogin' }],
        },
      ],
    },
    // ---- card 1: メインメニュー ----
    {
      xtype: 'panel',
      itemId: 'menuCard',
      title: '販売管理システム — メインメニュー',
      bodyPadding: 16,
      tbar: [
        { xtype: 'displayfield', itemId: 'loginInfo', fieldLabel: '', value: 'ログイン中: 佐藤 花子 (営業部)' },
        '->',
        { itemId: 'btnLogout', text: 'ログアウト', iconCls: 'x-fa fa-right-from-bracket', handler: 'onLogout' },
      ],
      layout: { type: 'grid', columns: 3, gap: 12 },
      defaults: { bodyPadding: 16, height: 120 },
      items: [
        { itemId: 'menuOrder', title: '受注管理', iconCls: 'x-fa fa-cart-shopping', html: '受注の登録・照会・出荷指示', listeners: { click: 'onOpenOrders' } },
        { itemId: 'menuInventory', title: '在庫管理', iconCls: 'x-fa fa-boxes-stacked', html: '在庫照会・入出庫・棚卸', listeners: { click: 'onOpenInventory' } },
        { itemId: 'menuBilling', title: '請求管理', iconCls: 'x-fa fa-file-invoice', html: '請求書発行・入金消込', listeners: { click: 'onOpenBilling' } },
        { itemId: 'menuCustomer', title: '顧客管理', iconCls: 'x-fa fa-address-book', html: '顧客マスタ・与信管理', listeners: { click: 'onOpenCustomers' } },
        { itemId: 'menuReport', title: 'レポート', iconCls: 'x-fa fa-chart-line', html: '売上分析・月次帳票', listeners: { click: 'onOpenReports' } },
        { itemId: 'menuSettings', title: '設定', iconCls: 'x-fa fa-gear', html: 'ユーザー・権限・マスタ設定', listeners: { click: 'onOpenSettings' } },
      ],
    },
  ],
}
```
