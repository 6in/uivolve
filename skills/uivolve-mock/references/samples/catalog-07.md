# 編集グリッド (セル部品)

- カテゴリ: コンポーネントカタログ
- 使用 layout: (なし)
- 使用 xtype: `actioncolumn`, `checkcolumn`, `grid`, `widgetcolumn`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// セル部品つきグリッドの例
// 列の xtype: checkcolumn / actioncolumn / widgetcolumn、editor でセル内編集
{
  xtype: 'grid',
  itemId: 'taskGrid',
  title: 'タスク管理 (セル編集可)',
  margin: 12,
  columnLines: true,
  columns: [
    { xtype: 'checkcolumn', text: '完了', dataIndex: 'done', width: 60 },
    { text: 'タスク名', dataIndex: 'name', flex: 1, editor: true },
    { text: '工数 (h)', dataIndex: 'hours', width: 90, editor: { xtype: 'numberfield' } },
    { text: '期限', dataIndex: 'due', width: 140, editor: { xtype: 'datefield' } },
    {
      text: '担当',
      dataIndex: 'assignee',
      width: 110,
      editor: { xtype: 'combobox', options: ['佐藤', '田中', '鈴木'] },
    },
    { xtype: 'widgetcolumn', text: '進捗', dataIndex: 'progress', width: 120, widget: { xtype: 'progressbar' } },
    {
      xtype: 'actioncolumn',
      text: '操作',
      width: 80,
      items: [
        { iconCls: 'x-fa fa-pen', tooltip: '編集', handler: 'onEditTask' },
        { iconCls: 'x-fa fa-trash', tooltip: '削除', handler: 'onDeleteTask' },
      ],
    },
  ],
  store: {
    data: [
      { done: true, name: '画面設計', hours: 12, due: '2026-07-03', assignee: '佐藤', progress: 1 },
      { done: false, name: 'フロント実装', hours: 24, due: '2026-07-15', assignee: '田中', progress: 0.6 },
      { done: false, name: 'API 結合', hours: 16, due: '2026-07-18', assignee: '鈴木', progress: 0.25 },
      { done: false, name: '結合テスト', hours: 20, due: '2026-07-24', assignee: '佐藤', progress: 0 },
    ],
  },
}
```
