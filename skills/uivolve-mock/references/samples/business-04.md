# 監視ダッシュボード

- カテゴリ: 業務画面
- 使用 layout: `grid`
- 使用 xtype: `chart`, `combobox`, `grid`, `panel`, `progressbar`, `terminal`, `toast`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// 業務画面: 監視ダッシュボード
// リソース使用率 (progressbar) + メトリクスチャート + ログ (terminal) + アラート
{
  xtype: 'panel',
  itemId: 'monitorScreen',
  title: 'システム監視 — 本番環境',
  bodyPadding: 8,
  layout: { type: 'grid', columns: 3, gap: 8 },
  tbar: [
    { xtype: 'combobox', itemId: 'envCombo', fieldLabel: '環境', labelWidth: 40, width: 180, options: ['本番', 'ステージング', '開発'], value: '本番' },
    { xtype: 'combobox', itemId: 'intervalCombo', fieldLabel: '更新', labelWidth: 40, width: 150, options: ['5 秒', '30 秒', '1 分', '手動'], value: '30 秒' },
    '->',
    { itemId: 'btnPause', text: '一時停止', iconCls: 'x-fa fa-pause', handler: 'onPauseRefresh' },
  ],
  items: [
    {
      xtype: 'panel',
      itemId: 'cpuPanel',
      title: 'CPU 使用率',
      bodyPadding: 12,
      items: [
        { xtype: 'progressbar', itemId: 'cpuBar', value: 0.82, text: 'app-01: 82%' },
        { xtype: 'progressbar', itemId: 'cpuBar2', value: 0.44, text: 'app-02: 44%', margin: '8 0 0 0' },
      ],
    },
    {
      xtype: 'panel',
      itemId: 'memPanel',
      title: 'メモリ使用率',
      bodyPadding: 12,
      items: [
        { xtype: 'progressbar', itemId: 'memBar', value: 0.58, text: 'app-01: 9.3 / 16 GB' },
        { xtype: 'progressbar', itemId: 'memBar2', value: 0.36, text: 'app-02: 5.8 / 16 GB', margin: '8 0 0 0' },
      ],
    },
    {
      xtype: 'panel',
      itemId: 'diskPanel',
      title: 'ディスク / DB 接続',
      bodyPadding: 12,
      items: [
        { xtype: 'progressbar', itemId: 'diskBar', value: 0.71, text: 'data: 71%' },
        { xtype: 'progressbar', itemId: 'connBar', value: 0.25, text: 'DB conn: 50 / 200', margin: '8 0 0 0' },
      ],
    },
    {
      xtype: 'panel',
      itemId: 'reqPanel',
      title: 'リクエスト数 / エラー数 (直近 30 分)',
      colspan: 2,
      bodyPadding: 8,
      items: [
        {
          xtype: 'chart',
          itemId: 'reqChart',
          height: 180,
          series: [{ type: 'line', xField: 'time', yField: ['requests', 'errors'], title: ['リクエスト', 'エラー'] }],
          store: {
            data: [
              { time: '12:30', requests: 420, errors: 2 },
              { time: '12:35', requests: 480, errors: 1 },
              { time: '12:40', requests: 890, errors: 4 },
              { time: '12:45', requests: 1240, errors: 38 },
              { time: '12:50', requests: 1180, errors: 61 },
              { time: '12:55', requests: 720, errors: 12 },
              { time: '13:00', requests: 530, errors: 3 },
            ],
          },
        },
      ],
    },
    {
      xtype: 'grid',
      itemId: 'alertGrid',
      title: '発生中のアラート',
      columns: [
        { text: 'レベル', dataIndex: 'level', width: 80 },
        { text: '内容', dataIndex: 'message', flex: 1 },
        { text: '発生', dataIndex: 'since', width: 70 },
      ],
      store: {
        data: [
          { level: '✗ 重大', message: 'app-01 CPU 高負荷が 15 分継続', since: '12:45' },
          { level: '⚠ 警告', message: 'API /orders p95 が 1.2s 超', since: '12:48' },
          { level: '⚠ 警告', message: 'data ボリューム使用率 70% 超', since: '11:20' },
        ],
      },
    },
    {
      xtype: 'terminal',
      itemId: 'appLog',
      title: 'app-01 — application.log',
      colspan: 3,
      height: 240,
      speed: 400,
      lines: [
        '13:00:01 INFO  [http-nio-8080] GET /api/orders 200 (35ms)',
        '13:00:02 INFO  [http-nio-8080] POST /api/orders 201 (120ms)',
        '13:00:04 WARN  [pool-2] 在庫引当リトライ item=ITM-1003 (1/3)',
        '13:00:05 INFO  [http-nio-8080] GET /api/customers 200 (18ms)',
        '13:00:07 ERROR [http-nio-8080] GET /api/reports 500 — TimeoutException: DB query > 5s',
        '13:00:08 INFO  [scheduler] バッチ BATCH-INV-SYNC 開始',
        '13:00:11 INFO  [scheduler] バッチ BATCH-INV-SYNC 完了 (2,481 件)',
        '13:00:12 WARN  [http-nio-8080] slow query: SELECT * FROM order_details ... (3.2s)',
        '13:00:14 INFO  [http-nio-8080] GET /api/orders 200 (41ms)',
      ],
    },
    // 重大アラートの通知例
    {
      xtype: 'toast',
      itemId: 'criticalToast',
      title: '重大アラート',
      html: '<b>app-01</b> の CPU 使用率が 15 分間 80% を超えています',
      iconCls: 'x-fa fa-circle-exclamation',
      align: 'tr',
    },
  ],
}
```
