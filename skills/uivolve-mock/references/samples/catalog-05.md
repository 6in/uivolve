# ターミナルと動画

- カテゴリ: コンポーネントカタログ
- 使用 layout: `vbox`
- 使用 xtype: `panel`, `terminal`, `video`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// ターミナル (terminal) と動画 (video) の例
// terminal は lines を一定間隔 (±ランダム揺らぎ) で流し、末尾までいくと先頭へループ
{
  xtype: 'panel',
  itemId: 'deployMonitor',
  title: 'デプロイモニター',
  bodyPadding: 12,
  layout: { type: 'vbox', align: 'stretch' },
  items: [
    {
      xtype: 'terminal',
      itemId: 'deployLog',
      title: 'deploy — bash',
      height: 260,
      speed: 450,
      lines: [
        '$ git push origin main',
        'Enumerating objects: 12, done.',
        'To https://github.com/6in/uivolve.git',
        '$ GitHub Actions: Deploy Pages #42 開始',
        '> npm ci',
        'added 214 packages in 6s',
        '> npm run pages',
        'vite v6.0.3 building for production...',
        '⚠ WARN: chunk size が 500kB を超えています',
        '✓ built in 7.06s',
        '> actions/deploy-pages@v4',
        '✗ ERROR: flaky-network — retry 1/3',
        '✓ retry 成功',
        '✓ デプロイ完了: https://6in.github.io/uivolve/',
      ],
    },
    {
      xtype: 'panel',
      itemId: 'guidePanel',
      title: '操作ガイド動画',
      margin: '12 0 0 0',
      flex: 1,
      minHeight: 220,
      bodyPadding: 8,
      items: [
        {
          xtype: 'video',
          itemId: 'guideVideo',
          url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          height: 220,
          muted: true,
          loop: true,
        },
      ],
    },
  ],
}
```
