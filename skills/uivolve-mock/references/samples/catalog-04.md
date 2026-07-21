# グラフ表示 (Git / ネットワーク)

- カテゴリ: コンポーネントカタログ
- 使用 layout: `vbox`
- 使用 xtype: `gitgraph`, `networkgraph`, `panel`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// Git マージツリー (gitgraph) とネットワークグラフ (networkgraph) の例
// networkgraph は d3-force の力学レイアウト。ノードをドラッグで引っ張れる
{
  xtype: 'panel',
  itemId: 'graphDemo',
  title: 'グラフ表示',
  layout: { type: 'vbox', align: 'stretch' },
  items: [
    {
      xtype: 'panel',
      itemId: 'releaseHistory',
      title: 'リリース履歴 (gitgraph)',
      bodyPadding: 8,
      items: [
        {
          xtype: 'gitgraph',
          itemId: 'releaseTree',
          branches: ['main', 'develop', 'feature/cart', 'hotfix/1.0.1'],
          commits: [
            { id: 'a1f9c02', branch: 'main', message: '初期コミット', tag: 'v0.9' },
            { id: 'b3d21e8', branch: 'develop', parents: ['a1f9c02'], message: '開発ブランチ作成' },
            { id: 'c77f014', branch: 'feature/cart', parents: ['b3d21e8'], message: 'カート画面を追加' },
            { id: 'd90ab3c', branch: 'develop', parents: ['b3d21e8'], message: 'ログイン改修' },
            { id: 'e12c9f7', branch: 'feature/cart', parents: ['c77f014'], message: 'カートのバリデーション' },
            { id: 'f45d88a', branch: 'develop', parents: ['d90ab3c', 'e12c9f7'], message: "Merge branch 'feature/cart'" },
            { id: '0a3e6b1', branch: 'main', parents: ['a1f9c02', 'f45d88a'], message: 'リリース', tag: 'v1.0' },
            { id: '19c4d5e', branch: 'hotfix/1.0.1', parents: ['0a3e6b1'], message: '価格計算の修正' },
            { id: '2b8f7a9', branch: 'main', parents: ['0a3e6b1', '19c4d5e'], message: 'hotfix 取り込み', tag: 'v1.0.1' },
            { id: '3c1a2d4', branch: 'develop', parents: ['f45d88a', '2b8f7a9'], message: 'main を取り込み' },
          ],
        },
      ],
    },
    {
      xtype: 'panel',
      itemId: 'dataModelPanel',
      title: 'データモデル俯瞰 (networkgraph・50 ノード) — ドラッグで引っ張れる',
      flex: 1,
      minHeight: 320,
      items: [
        {
          xtype: 'networkgraph',
          itemId: 'dataModelGraph',
          height: '100%',
          nodes: [
            { id: 'cust', text: '顧客', group: 1, r: 15 },
            { id: 'c1', text: '個人顧客', group: 1 }, { id: 'c2', text: '法人顧客', group: 1 },
            { id: 'c3', text: '担当者', group: 1 }, { id: 'c4', text: '住所', group: 1 },
            { id: 'c5', text: '連絡先', group: 1 }, { id: 'c6', text: '与信', group: 1 },
            { id: 'c7', text: '契約', group: 1 }, { id: 'c8', text: '商談', group: 1 },
            { id: 'c9', text: 'クレーム', group: 1 },
            { id: 'order', text: '受注', group: 2, r: 15 },
            { id: 'o1', text: '見積', group: 2 }, { id: 'o2', text: '注文明細', group: 2 },
            { id: 'o3', text: '請求', group: 2 }, { id: 'o4', text: '入金', group: 2 },
            { id: 'o5', text: '返品', group: 2 }, { id: 'o6', text: '値引', group: 2 },
            { id: 'o7', text: '承認', group: 2 }, { id: 'o8', text: '出荷指示', group: 2 },
            { id: 'o9', text: 'キャンセル', group: 2 },
            { id: 'prod', text: '商品', group: 3, r: 15 },
            { id: 'p1', text: 'カテゴリ', group: 3 }, { id: 'p2', text: '型番', group: 3 },
            { id: 'p3', text: '価格', group: 3 }, { id: 'p4', text: '在庫', group: 3 },
            { id: 'p5', text: '仕入先', group: 3 }, { id: 'p6', text: 'ロット', group: 3 },
            { id: 'p7', text: '倉庫棚', group: 3 }, { id: 'p8', text: '画像', group: 3 },
            { id: 'p9', text: '仕様書', group: 3 },
            { id: 'ship', text: '配送', group: 4, r: 15 },
            { id: 's1', text: '配送便', group: 4 }, { id: 's2', text: '運送会社', group: 4 },
            { id: 's3', text: '伝票', group: 4 }, { id: 's4', text: '追跡', group: 4 },
            { id: 's5', text: '配達員', group: 4 }, { id: 's6', text: '車両', group: 4 },
            { id: 's7', text: 'ルート', group: 4 }, { id: 's8', text: '拠点', group: 4 },
            { id: 's9', text: '梱包', group: 4 },
            { id: 'bi', text: '分析', group: 5, r: 15 },
            { id: 'b1', text: '売上集計', group: 5 }, { id: 'b2', text: 'KPI', group: 5 },
            { id: 'b3', text: 'ダッシュボード', group: 5 }, { id: 'b4', text: 'レポート', group: 5 },
            { id: 'b5', text: '需要予測', group: 5 }, { id: 'b6', text: 'セグメント', group: 5 },
            { id: 'b7', text: '操作ログ', group: 5 }, { id: 'b8', text: 'ETL', group: 5 },
            { id: 'b9', text: 'アラート', group: 5 },
          ],
          edges: [
            { from: 'cust', to: 'c1' }, { from: 'cust', to: 'c2' }, { from: 'cust', to: 'c3' },
            { from: 'cust', to: 'c4' }, { from: 'cust', to: 'c5' }, { from: 'cust', to: 'c6' },
            { from: 'cust', to: 'c7' }, { from: 'cust', to: 'c8' }, { from: 'cust', to: 'c9' },
            { from: 'order', to: 'o1' }, { from: 'order', to: 'o2' }, { from: 'order', to: 'o3' },
            { from: 'order', to: 'o4' }, { from: 'order', to: 'o5' }, { from: 'order', to: 'o6' },
            { from: 'order', to: 'o7' }, { from: 'order', to: 'o8' }, { from: 'order', to: 'o9' },
            { from: 'prod', to: 'p1' }, { from: 'prod', to: 'p2' }, { from: 'prod', to: 'p3' },
            { from: 'prod', to: 'p4' }, { from: 'prod', to: 'p5' }, { from: 'prod', to: 'p6' },
            { from: 'prod', to: 'p7' }, { from: 'prod', to: 'p8' }, { from: 'prod', to: 'p9' },
            { from: 'ship', to: 's1' }, { from: 'ship', to: 's2' }, { from: 'ship', to: 's3' },
            { from: 'ship', to: 's4' }, { from: 'ship', to: 's5' }, { from: 'ship', to: 's6' },
            { from: 'ship', to: 's7' }, { from: 'ship', to: 's8' }, { from: 'ship', to: 's9' },
            { from: 'bi', to: 'b1' }, { from: 'bi', to: 'b2' }, { from: 'bi', to: 'b3' },
            { from: 'bi', to: 'b4' }, { from: 'bi', to: 'b5' }, { from: 'bi', to: 'b6' },
            { from: 'bi', to: 'b7' }, { from: 'bi', to: 'b8' }, { from: 'bi', to: 'b9' },
            { from: 'cust', to: 'order' }, { from: 'order', to: 'prod' }, { from: 'order', to: 'ship' },
            { from: 'bi', to: 'cust' }, { from: 'bi', to: 'order' }, { from: 'bi', to: 'prod' },
            { from: 'c6', to: 'o3' }, { from: 'p4', to: 'o8' }, { from: 's4', to: 's5' },
            { from: 'o1', to: 'c8' },
          ],
        },
      ],
    },
  ],
}
```
