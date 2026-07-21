# ウィンドウ (ダイアログ)

- カテゴリ: 基本
- 使用 layout: (なし)
- 使用 xtype: `checkbox`, `textfield`, `window`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// ウィンドウ (ダイアログ) の例 — ルートに置くとモーダル風に中央表示
{
  xtype: 'window',
  itemId: 'loginWindow',
  title: 'ログイン',
  width: 380,
  closable: true,
  bodyPadding: 16,
  items: [
    { xtype: 'textfield', itemId: 'userIdField', fieldLabel: 'ユーザーID', labelWidth: 90 },
    { xtype: 'textfield', itemId: 'passwordField', fieldLabel: 'パスワード', labelWidth: 90, inputType: 'password' },
    { xtype: 'checkbox', itemId: 'keepLoginCheck', fieldLabel: '', labelWidth: 90, boxLabel: 'ログイン状態を保持' },
  ],
  bbar: [
    '->',
    { itemId: 'btnLogin', text: 'ログイン', ui: 'primary' },
    { itemId: 'btnLoginCancel', text: 'キャンセル' },
  ],
}
```
