# ダイアログとトースト

- カテゴリ: コンポーネントカタログ
- 使用 layout: `fit`
- 使用 xtype: `combobox`, `form`, `messagebox`, `numberfield`, `panel`, `textfield`, `toast`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// シンプルダイアログ (messagebox) とトースト (toast) の例
// messagebox はどこに置いても半透明バックドロップ + 中央表示になる
// toast はプレビュー隅に重ねて表示 (align: tr/tl/br/bl/t/b)。× で消せる
{
  xtype: 'panel',
  itemId: 'orderEditApp',
  title: '受注編集',
  layout: 'fit',
  items: [
    {
      xtype: 'form',
      itemId: 'orderForm',
      bodyPadding: 16,
      items: [
        { xtype: 'textfield', itemId: 'orderNoField', fieldLabel: '受注番号', value: 'SO-0002', readOnly: true },
        { xtype: 'textfield', itemId: 'customerField', fieldLabel: '顧客名', value: '鈴木工業' },
        { xtype: 'numberfield', itemId: 'amountField', fieldLabel: '金額', value: 58300 },
        { xtype: 'combobox', itemId: 'statusCombo', fieldLabel: '状態', value: '受注', options: ['受注', '出荷済', '請求済'] },
        // ↓ オーバーレイ系は絶対配置なので、ツリー内のどこに書いても表示位置は同じ
        {
          xtype: 'messagebox',
          itemId: 'deleteConfirm',
          title: '削除の確認',
          message: '受注 SO-0002 を削除します。よろしいですか?',
          buttons: 'yesno',
          icon: 'warning',
        },
        {
          xtype: 'toast',
          itemId: 'savedToast',
          title: '保存完了',
          html: '受注 <b>SO-0002</b> を保存しました',
          iconCls: 'x-fa fa-circle-check',
          align: 'tr',
        },
        {
          xtype: 'toast',
          itemId: 'syncToast',
          message: '在庫データを同期中...',
          align: 'br',
        },
      ],
      bbar: [
        '->',
        { itemId: 'btnDelete', text: '削除', iconCls: 'x-fa fa-trash', handler: 'onDeleteOrder' },
        { itemId: 'btnSave', text: '保存', ui: 'primary', iconCls: 'x-fa fa-floppy-disk', handler: 'onSaveOrder' },
      ],
    },
  ],
}
```
