# Grid レイアウト

- カテゴリ: 基本
- 使用 layout: `grid`
- 使用 xtype: `chart`, `draw`, `panel`, `polar`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// Grid レイアウトの例 (3 カラム / colspan 対応)
// chart (bar/line/area/pie) と draw (SVG スプライト) でダッシュボードを構成
{
  xtype: 'panel',
  itemId: 'dashboard',
  title: 'ダッシュボード',
  bodyPadding: 12,
  layout: { type: 'grid', columns: 3, gap: 12 },
  items: [
    { itemId: 'salesCard', title: '売上', html: '<b style="font-size:24px">¥1,234,000</b><br>前月比 +12%' },
    { itemId: 'newCustomerCard', title: '新規顧客', html: '<b style="font-size:24px">38 社</b><br>前月比 +4%' },
    { itemId: 'taskCard', title: '未処理タスク', html: '<b style="font-size:24px">7 件</b><br>要対応' },
    {
      itemId: 'trendPanel',
      title: '月次推移 (売上 / 利益)',
      colspan: 2,
      height: 220,
      items: [
        {
          xtype: 'chart',
          itemId: 'trendChart',
          height: 180,
          series: [{ type: 'line', xField: 'month', yField: ['sales', 'profit'], title: ['売上', '利益'] }],
          store: {
            data: [
              { month: '2月', sales: 96, profit: 22 },
              { month: '3月', sales: 118, profit: 30 },
              { month: '4月', sales: 102, profit: 26 },
              { month: '5月', sales: 134, profit: 38 },
              { month: '6月', sales: 128, profit: 41 },
            ],
          },
        },
      ],
    },
    {
      itemId: 'categoryPanel',
      title: 'カテゴリ構成',
      height: 220,
      items: [
        {
          xtype: 'polar',
          itemId: 'categoryPie',
          height: 180,
          series: [{ type: 'pie', xField: 'category', yField: 'count' }],
          store: {
            data: [
              { category: '製造', count: 48 },
              { category: '卸売', count: 32 },
              { category: '小売', count: 28 },
              { category: 'その他', count: 12 },
            ],
          },
        },
      ],
    },
    {
      itemId: 'repPanel',
      title: '担当者別受注 (今月 / 先月)',
      colspan: 2,
      height: 220,
      items: [
        {
          xtype: 'chart',
          itemId: 'repChart',
          height: 180,
          series: [{ type: 'bar', xField: 'rep', yField: ['now', 'prev'], title: ['今月', '先月'] }],
          store: {
            data: [
              { rep: '佐藤', now: 34, prev: 28 },
              { rep: '田中', now: 26, prev: 31 },
              { rep: '鈴木', now: 22, prev: 18 },
              { rep: '高橋', now: 18, prev: 21 },
            ],
          },
        },
      ],
    },
    {
      itemId: 'slaPanel',
      title: '稼働状況 (draw)',
      height: 220,
      items: [
        {
          xtype: 'draw',
          itemId: 'slaGauge',
          height: 180,
          sprites: [
            { type: 'circle', cx: 90, cy: 90, r: 62, strokeStyle: '#e2e8ee', lineWidth: 14 },
            { type: 'path', path: 'M 90 28 A 62 62 0 1 1 33 122', strokeStyle: '#4caf50', lineWidth: 14 },
            { type: 'text', x: 90, y: 88, text: '98.2%', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
            { type: 'text', x: 90, y: 108, text: '稼働率', fontSize: 12, fillStyle: '#8a97a5', textAlign: 'center' },
            { type: 'rect', x: 180, y: 40, width: 12, height: 12, radius: 3, fillStyle: '#4caf50' },
            { type: 'text', x: 198, y: 51, text: '正常 12', fontSize: 12 },
            { type: 'rect', x: 180, y: 64, width: 12, height: 12, radius: 3, fillStyle: '#d9a520' },
            { type: 'text', x: 198, y: 75, text: '警告 2', fontSize: 12 },
            { type: 'rect', x: 180, y: 88, width: 12, height: 12, radius: 3, fillStyle: '#cd5c5c' },
            { type: 'text', x: 198, y: 99, text: '停止 0', fontSize: 12 },
          ],
        },
      ],
    },
    {
      itemId: 'noticePanel',
      title: 'お知らせ',
      colspan: 3,
      bodyPadding: 8,
      html: '・7/10 メンテナンス予定<br>・新機能リリースのお知らせ',
    },
  ],
}
```
