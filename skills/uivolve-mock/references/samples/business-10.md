# 問い合わせ管理 (ツリーグリッド)

- カテゴリ: 業務画面
- 使用 layout: `border`
- 使用 xtype: `form`, `grid`, `htmleditor`, `pagingtoolbar`, `panel`, `treecolumn`, `treepanel`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// ツリーグリッド + ページング + HTML エディタの例
// - treepanel に columns を指定するとツリーグリッドになる (treecolumn が階層列)
// - grid の bbar に pagingtoolbar を置くとページ移動 UI が付く
// - htmleditor はリッチテキスト編集 (太字・リスト・ソース編集が動く)
{
  xtype: 'panel',
  itemId: 'supportApp',
  title: '問い合わせ管理',
  layout: 'border',
  items: [
    {
      region: 'west',
      xtype: 'treepanel',
      itemId: 'categoryTree',
      title: 'カテゴリ',
      width: 260,
      split: true,
      collapsible: true,
      columnLines: true,
      columns: [
        { xtype: 'treecolumn', text: 'カテゴリ', dataIndex: 'text', flex: 1 },
        { text: '件数', dataIndex: 'count', width: 60, align: 'right' },
      ],
      root: {
        children: [
          {
            text: '製品', count: 20, expanded: true,
            children: [
              { text: '不具合', count: 12, leaf: true },
              { text: '使い方', count: 8, leaf: true },
            ],
          },
          {
            text: '契約', count: 4,
            children: [
              { text: '請求', count: 3, leaf: true },
              { text: '解約', count: 1, leaf: true },
            ],
          },
        ],
      },
    },
    {
      region: 'center',
      xtype: 'grid',
      itemId: 'ticketGrid',
      title: '問い合わせ一覧',
      columnLines: true,
      columns: [
        { text: '番号', dataIndex: 'no', width: 90 },
        { text: '件名', dataIndex: 'subject', flex: 1 },
        { text: '顧客', dataIndex: 'customer', width: 120 },
        { text: '状態', dataIndex: 'status', width: 90 },
      ],
      store: {
        data: [
          { no: 'T-0101', subject: 'ログインできない', customer: '山田商事', status: '対応中' },
          { no: 'T-0102', subject: '帳票が出力されない', customer: '鈴木工業', status: '新規' },
          { no: 'T-0103', subject: '請求金額の確認', customer: '田中物産', status: '完了' },
          { no: 'T-0104', subject: 'パスワード再発行', customer: '佐藤製作所', status: '新規' },
        ],
      },
      bbar: {
        xtype: 'pagingtoolbar',
        itemId: 'ticketPaging',
        pageSize: 25,
        total: 128,
        displayInfo: true,
      },
    },
    {
      region: 'south',
      xtype: 'form',
      itemId: 'replyPanel',
      title: '返信',
      height: 240,
      split: true,
      collapsible: true,
      items: [
        {
          xtype: 'htmleditor',
          itemId: 'replyEditor',
          fieldLabel: '本文',
          height: 150,
          value: '<p>お問い合わせありがとうございます。</p><p>担当者より<b>1 営業日以内</b>にご連絡いたします。</p>',
        },
      ],
      bbar: ['->', { itemId: 'btnSend', text: '送信', ui: 'primary', iconCls: 'x-fa fa-paper-plane' }],
    },
  ],
}
```
