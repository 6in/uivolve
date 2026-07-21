# マスタメンテ (CRUD)

- カテゴリ: 業務画面
- 使用 layout: `border`, `column`
- 使用 xtype: `actioncolumn`, `checkbox`, `checkcolumn`, `combobox`, `form`, `grid`, `numberfield`, `pagingtoolbar`, `panel`, `textareafield`, `textfield`, `toast`, `window`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// 業務画面: マスタメンテナンス (CRUD 定番)
// 検索条件 + 一覧グリッド + 編集ダイアログ (modal: true の window) の 3 点セット。
// 全部品に itemId、ボタンに handler 名を宣言しておくと AI への実装引き渡しがスムーズ。
// modal window / toast はツリーのどこに書いても画面全体へオーバーレイ表示される
{
  xtype: 'panel',
  itemId: 'productMasterScreen',
  title: '商品マスタ管理',
  layout: 'border',
  items: [
    {
      region: 'north',
      xtype: 'form',
      itemId: 'searchForm',
      title: '検索条件',
      bodyPadding: '12 12 4',
      layout: 'column',
      items: [
        { xtype: 'textfield', itemId: 'searchCode', fieldLabel: '商品コード', labelWidth: 80, columnWidth: 0.25, margin: '0 12 8 0' },
        { xtype: 'textfield', itemId: 'searchName', fieldLabel: '商品名', labelWidth: 60, columnWidth: 0.3, margin: '0 12 8 0' },
        {
          xtype: 'combobox',
          itemId: 'searchCategory',
          fieldLabel: 'カテゴリ',
          labelWidth: 70,
          columnWidth: 0.22,
          margin: '0 12 8 0',
          options: ['すべて', '文具', 'オフィス家具', 'OA 機器'],
          value: 'すべて',
        },
        {
          xtype: 'checkbox',
          itemId: 'searchActiveOnly',
          boxLabel: '公開中のみ',
          columnWidth: 0.15,
          checked: true,
        },
      ],
      bbar: [
        '->',
        { itemId: 'btnClear', text: 'クリア', iconCls: 'x-fa fa-eraser', handler: 'onClearSearch' },
        { itemId: 'btnSearch', text: '検索', ui: 'primary', iconCls: 'x-fa fa-magnifying-glass', handler: 'onSearch' },
      ],
    },
    {
      region: 'center',
      xtype: 'grid',
      itemId: 'productGrid',
      title: '商品一覧',
      columnLines: true,
      tbar: [
        { itemId: 'btnAdd', text: '新規登録', ui: 'primary', iconCls: 'x-fa fa-plus', handler: 'onAddProduct' },
        { itemId: 'btnExport', text: 'CSV 出力', iconCls: 'x-fa fa-file-csv', handler: 'onExportCsv' },
      ],
      columns: [
        { text: '商品コード', dataIndex: 'code', width: 110 },
        { text: '商品名', dataIndex: 'name', flex: 1 },
        { text: 'カテゴリ', dataIndex: 'category', width: 120 },
        { text: '単価', dataIndex: 'price', width: 90, align: 'right' },
        { text: '在庫数', dataIndex: 'stock', width: 80, align: 'right' },
        { xtype: 'checkcolumn', text: '公開', dataIndex: 'active', width: 70 },
        { text: '更新日', dataIndex: 'updated', width: 110 },
        {
          xtype: 'actioncolumn',
          text: '操作',
          width: 80,
          items: [
            { iconCls: 'x-fa fa-pen', tooltip: '編集', handler: 'onEditProduct' },
            { iconCls: 'x-fa fa-trash', tooltip: '削除', handler: 'onDeleteProduct' },
          ],
        },
      ],
      store: {
        data: [
          { code: 'PRD-0001', name: 'クリアファイル A4 (10 枚入)', category: '文具', price: 380, stock: 1240, active: true, updated: '2026-07-01' },
          { code: 'PRD-0002', name: 'ゲルインクボールペン 0.5mm 黒', category: '文具', price: 150, stock: 3200, active: true, updated: '2026-07-03' },
          { code: 'PRD-0003', name: 'オフィスチェア ハイバック', category: 'オフィス家具', price: 24800, stock: 36, active: true, updated: '2026-06-28' },
          { code: 'PRD-0004', name: '昇降デスク 120cm', category: 'オフィス家具', price: 49800, stock: 12, active: false, updated: '2026-06-15' },
          { code: 'PRD-0005', name: 'モバイルモニター 15.6 インチ', category: 'OA 機器', price: 21800, stock: 58, active: true, updated: '2026-07-05' },
          { code: 'PRD-0006', name: 'USB ドッキングステーション', category: 'OA 機器', price: 12800, stock: 0, active: false, updated: '2026-07-08' },
        ],
      },
      bbar: {
        xtype: 'pagingtoolbar',
        itemId: 'productPaging',
        pageSize: 20,
        total: 246,
        displayInfo: true,
      },
    },
    // ---- 編集ダイアログ (行の編集アイコンで開く想定。modal なのでどこに書いても中央表示) ----
    {
      xtype: 'window',
      itemId: 'productEditWindow',
      title: '商品編集 — PRD-0003',
      modal: true,
      width: 480,
      bodyPadding: 16,
      items: [
        { xtype: 'textfield', itemId: 'editCode', fieldLabel: '商品コード', labelWidth: 90, value: 'PRD-0003', readOnly: true },
        { xtype: 'textfield', itemId: 'editName', fieldLabel: '商品名', labelWidth: 90, value: 'オフィスチェア ハイバック', allowBlank: false },
        {
          xtype: 'combobox',
          itemId: 'editCategory',
          fieldLabel: 'カテゴリ',
          labelWidth: 90,
          options: ['文具', 'オフィス家具', 'OA 機器'],
          value: 'オフィス家具',
        },
        { xtype: 'numberfield', itemId: 'editPrice', fieldLabel: '単価', labelWidth: 90, value: 24800 },
        { xtype: 'numberfield', itemId: 'editStock', fieldLabel: '在庫数', labelWidth: 90, value: 36 },
        { xtype: 'checkbox', itemId: 'editActive', fieldLabel: '', labelWidth: 90, boxLabel: '公開する', checked: true },
        { xtype: 'textareafield', itemId: 'editNote', fieldLabel: '備考', labelWidth: 90, height: 60 },
      ],
      bbar: [
        '->',
        { itemId: 'btnEditCancel', text: 'キャンセル', handler: 'onCancelEdit' },
        { itemId: 'btnEditSave', text: '保存', ui: 'primary', iconCls: 'x-fa fa-floppy-disk', handler: 'onSaveProduct' },
      ],
    },
    // 保存完了の通知例 (× で消せる)
    {
      xtype: 'toast',
      itemId: 'savedToast',
      title: '保存完了',
      html: '商品 <b>PRD-0003</b> を更新しました',
      iconCls: 'x-fa fa-circle-check',
      align: 'tr',
    },
  ],
}
```
