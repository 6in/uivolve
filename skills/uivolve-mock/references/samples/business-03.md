# 在庫・倉庫管理

- カテゴリ: 業務画面
- 使用 layout: `border`, `vbox`
- 使用 xtype: `chart`, `grid`, `panel`, `textfield`, `toast`, `treepanel`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// 業務画面: 在庫・倉庫管理
// ツリーグリッド (拠点 → 倉庫 → 棚、列付き) + 在庫グリッド + 入出庫チャート
{
  xtype: 'panel',
  itemId: 'inventoryScreen',
  title: '在庫管理 — 拠点別',
  layout: 'border',
  items: [
    {
      region: 'west',
      xtype: 'treepanel',
      itemId: 'locationTree',
      title: '拠点 / 保管場所',
      width: 320,
      split: true,
      columnLines: true,
      // columns を指定するとツリーグリッドになる (先頭列が階層表示)
      columns: [
        { text: '場所', dataIndex: 'text', flex: 1 },
        { text: '在庫数', dataIndex: 'qty', width: 80, align: 'right' },
      ],
      root: {
        children: [
          {
            text: '東京 DC',
            expanded: true,
            qty: '12,480',
            children: [
              {
                text: '第 1 倉庫',
                expanded: true,
                qty: '8,120',
                children: [
                  { text: 'A-01 (常温)', leaf: true, qty: '3,200' },
                  { text: 'A-02 (常温)', leaf: true, qty: '2,880' },
                  { text: 'B-01 (冷蔵)', leaf: true, qty: '2,040' },
                ],
              },
              {
                text: '第 2 倉庫',
                qty: '4,360',
                children: [{ text: 'C-01 (危険物)', leaf: true, qty: '4,360' }],
              },
            ],
          },
          {
            text: '大阪 DC',
            expanded: true,
            qty: '6,930',
            children: [
              { text: 'D-01 (常温)', leaf: true, qty: '4,410' },
              { text: 'D-02 (冷凍)', leaf: true, qty: '2,520' },
            ],
          },
        ],
      },
      listeners: { select: 'onSelectLocation' },
    },
    {
      region: 'center',
      xtype: 'panel',
      itemId: 'inventoryDetail',
      layout: { type: 'vbox', align: 'stretch' },
      items: [
        {
          xtype: 'grid',
          itemId: 'stockGrid',
          title: '在庫一覧 — 東京 DC / 第 1 倉庫 / A-01',
          flex: 1,
          columnLines: true,
          tbar: [
            { itemId: 'btnReceive', text: '入庫', ui: 'primary', iconCls: 'x-fa fa-arrow-down', handler: 'onReceive' },
            { itemId: 'btnShip', text: '出庫', iconCls: 'x-fa fa-arrow-up', handler: 'onShip' },
            { itemId: 'btnStocktake', text: '棚卸', iconCls: 'x-fa fa-clipboard-check', handler: 'onStocktake' },
            '->',
            { xtype: 'textfield', itemId: 'stockSearch', emptyText: '品名で検索', width: 150 },
          ],
          columns: [
            { text: '品目コード', dataIndex: 'code', width: 110 },
            { text: '品名', dataIndex: 'name', flex: 1 },
            { text: 'ロット', dataIndex: 'lot', width: 100 },
            { text: '現在庫', dataIndex: 'qty', width: 90, align: 'right' },
            { text: '引当済', dataIndex: 'allocated', width: 90, align: 'right' },
            { text: '安全在庫', dataIndex: 'safety', width: 90, align: 'right' },
            { text: '状態', dataIndex: 'status', width: 100 },
          ],
          store: {
            data: [
              { code: 'ITM-1001', name: 'クリアファイル A4', lot: 'L26070101', qty: 1240, allocated: 300, safety: 500, status: '正常' },
              { code: 'ITM-1002', name: 'コピー用紙 A4 (500 枚)', lot: 'L26070203', qty: 860, allocated: 520, safety: 400, status: '正常' },
              { code: 'ITM-1003', name: 'ゲルインクボールペン 黒', lot: 'L26062801', qty: 420, allocated: 380, safety: 400, status: '⚠ 要補充' },
              { code: 'ITM-1004', name: '付箋 75mm 5 色', lot: 'L26061502', qty: 96, allocated: 96, safety: 200, status: '✗ 欠品リスク' },
              { code: 'ITM-1005', name: 'ラベルシール 24 面', lot: 'L26070501', qty: 584, allocated: 120, safety: 300, status: '正常' },
            ],
          },
        },
        {
          xtype: 'panel',
          itemId: 'movementPanel',
          title: '入出庫推移 (直近 6 ヶ月)',
          height: 220,
          margin: '8 0 0 0',
          bodyPadding: 8,
          items: [
            {
              xtype: 'chart',
              itemId: 'movementChart',
              height: 170,
              series: [{ type: 'bar', xField: 'month', yField: ['inbound', 'outbound'], title: ['入庫', '出庫'] }],
              store: {
                data: [
                  { month: '2 月', inbound: 3200, outbound: 2900 },
                  { month: '3 月', inbound: 4100, outbound: 4400 },
                  { month: '4 月', inbound: 3800, outbound: 3500 },
                  { month: '5 月', inbound: 2900, outbound: 3300 },
                  { month: '6 月', inbound: 4600, outbound: 4200 },
                  { month: '7 月', inbound: 2100, outbound: 1800 },
                ],
              },
            },
          ],
        },
      ],
    },
    // 欠品リスクの通知例
    {
      xtype: 'toast',
      itemId: 'stockAlertToast',
      title: '在庫アラート',
      html: '<b>ITM-1004 付箋 75mm 5 色</b> が安全在庫を下回りました (残 96)',
      iconCls: 'x-fa fa-triangle-exclamation',
      align: 'br',
    },
  ],
}
```
