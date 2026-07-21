# 帳票 / 月次レポート

- カテゴリ: 業務画面
- 使用 layout: `grid`
- 使用 xtype: `chart`, `combobox`, `grid`, `panel`, `polar`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// 業務画面: 帳票 / 月次レポート
// 出力ツールバー + チャート複数 (grid レイアウト) + 部門別集計グリッド
{
  xtype: 'panel',
  itemId: 'reportScreen',
  title: '月次売上レポート — 2026 年 6 月',
  bodyPadding: 8,
  layout: { type: 'grid', columns: 2, gap: 8 },
  tbar: [
    { xtype: 'combobox', itemId: 'periodCombo', fieldLabel: '期間', labelWidth: 40, width: 170, options: ['2026/04', '2026/05', '2026/06'], value: '2026/06' },
    { xtype: 'combobox', itemId: 'deptCombo', fieldLabel: '部門', labelWidth: 40, width: 170, options: ['全社', '第一営業', '第二営業', 'EC'], value: '全社' },
    '->',
    { itemId: 'btnPrint', text: '印刷', iconCls: 'x-fa fa-print', handler: 'onPrint' },
    { itemId: 'btnPdf', text: 'PDF', iconCls: 'x-fa fa-file-pdf', handler: 'onExportPdf' },
    { itemId: 'btnExcel', text: 'Excel', ui: 'primary', iconCls: 'x-fa fa-file-excel', handler: 'onExportExcel' },
  ],
  items: [
    {
      xtype: 'panel',
      itemId: 'trendPanel',
      title: '売上・粗利の推移 (直近 6 ヶ月)',
      bodyPadding: 8,
      items: [
        {
          xtype: 'chart',
          itemId: 'trendChart',
          height: 200,
          series: [{ type: 'line', xField: 'month', yField: ['sales', 'profit'], title: ['売上', '粗利'] }],
          store: {
            data: [
              { month: '1 月', sales: 42.5, profit: 12.1 },
              { month: '2 月', sales: 38.2, profit: 10.8 },
              { month: '3 月', sales: 51.4, profit: 15.9 },
              { month: '4 月', sales: 44.8, profit: 13.2 },
              { month: '5 月', sales: 47.1, profit: 14.0 },
              { month: '6 月', sales: 53.6, profit: 16.8 },
            ],
          },
        },
      ],
    },
    {
      xtype: 'panel',
      itemId: 'sharePanel',
      title: 'カテゴリ別売上構成 (6 月)',
      bodyPadding: 8,
      items: [
        {
          xtype: 'polar',
          itemId: 'shareChart',
          height: 200,
          series: [{ type: 'pie', xField: 'category', yField: 'amount' }],
          store: {
            data: [
              { category: '文具', amount: 18.2 },
              { category: 'オフィス家具', amount: 15.4 },
              { category: 'OA 機器', amount: 12.8 },
              { category: '消耗品', amount: 7.2 },
            ],
          },
        },
      ],
    },
    {
      xtype: 'grid',
      itemId: 'summaryGrid',
      title: '部門別売上集計 (単位: 百万円)',
      colspan: 2,
      columnLines: true,
      columns: [
        { text: '部門', dataIndex: 'dept', flex: 1 },
        { text: '4 月', dataIndex: 'apr', width: 100, align: 'right' },
        { text: '5 月', dataIndex: 'may', width: 100, align: 'right' },
        { text: '6 月', dataIndex: 'jun', width: 100, align: 'right' },
        { text: '四半期計', dataIndex: 'total', width: 110, align: 'right' },
        { text: '前年比', dataIndex: 'yoy', width: 90, align: 'right' },
        { text: '達成率', dataIndex: 'achieve', width: 90, align: 'right' },
      ],
      store: {
        data: [
          { dept: '第一営業部', apr: 18.2, may: 19.5, jun: 22.1, total: 59.8, yoy: '+8.2%', achieve: '102%' },
          { dept: '第二営業部', apr: 14.6, may: 15.1, jun: 16.8, total: 46.5, yoy: '+3.1%', achieve: '96%' },
          { dept: 'EC 事業部', apr: 9.8, may: 10.2, jun: 12.4, total: 32.4, yoy: '+18.6%', achieve: '110%' },
          { dept: '合計', apr: 42.6, may: 44.8, jun: 51.3, total: 138.7, yoy: '+9.0%', achieve: '103%' },
        ],
      },
    },
  ],
}
```
