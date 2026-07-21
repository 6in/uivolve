# Border レイアウト

- カテゴリ: 基本
- 使用 layout: `border`
- 使用 xtype: `container`, `grid`, `listbox`, `panel`, `textfield`, `toolbar`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// Border レイアウトのダッシュボード例
// 各コンポーネントには itemId を付与して一意に識別できるようにしている
// (AI に「orderGrid に列を追加して」のように指示しやすくなる)
{
  xtype: 'panel',
  itemId: 'orderApp',
  title: '受注管理システム',
  layout: 'border',
  items: [
    {
      region: 'north',
      xtype: 'container',
      itemId: 'headerArea',
      // tbar は container にもそのまま書ける (items に xtype: 'toolbar' を置くのと同等)
      tbar: [
        { itemId: 'btnNew', text: '新規作成', ui: 'primary', iconCls: 'x-fa fa-plus', handler: 'onCreateOrder' },
        { itemId: 'btnEdit', text: '編集', iconCls: 'x-fa fa-pen' },
        '-',
        { itemId: 'btnDelete', text: '削除', iconCls: 'x-fa fa-trash' },
        '->',
        '検索:',
        { xtype: 'textfield', itemId: 'searchField', emptyText: 'キーワード', width: 200 },
      ],
    },
    {
      region: 'west',
      itemId: 'menuPanel',
      title: 'メニュー',
      width: 200,
      split: true,
      collapsible: true,
      bodyPadding: 8,
      items: [
        {
          xtype: 'listbox',
          itemId: 'menuList',
          size: 8,
          options: ['受注一覧', '出荷指示', '請求管理', '顧客マスタ', '商品マスタ'],
        },
      ],
    },
    {
      region: 'center',
      xtype: 'grid',
      itemId: 'orderGrid',
      title: '受注一覧',
      columnLines: true,
      listeners: { select: 'onOrderSelect' },
      columns: [
        { text: '受注番号', dataIndex: 'no', width: 110 },
        { text: '顧客名', dataIndex: 'customer', flex: 1 },
        { text: '金額', dataIndex: 'amount', width: 100, align: 'right' },
        { text: '状態', dataIndex: 'status', width: 90 },
      ],
      store: {
        data: [
          { no: 'SO-0001', customer: '山田商事', amount: '¥120,000', status: '出荷済' },
          { no: 'SO-0002', customer: '鈴木工業', amount: '¥58,300', status: '受注' },
          { no: 'SO-0003', customer: '田中物産', amount: '¥310,900', status: '請求済' },
          { no: 'SO-0004', customer: '佐藤製作所', amount: '¥42,000', status: '受注' },
        ],
      },
    },
    {
      region: 'south',
      xtype: 'container',
      itemId: 'footerArea',
      items: [
        { xtype: 'toolbar', itemId: 'statusBar', items: ['ステータス: 準備完了', '->', '4 件'] },
      ],
    },
  ],
}
```
