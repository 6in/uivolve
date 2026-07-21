# Font Awesome アイコン

- カテゴリ: コンポーネントカタログ
- 使用 layout: `grid`
- 使用 xtype: `fieldset`, `panel`, `splitbutton`, `tabpanel`, `toolbar`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// Font Awesome アイコンのカタログ
// iconCls に ExtJS 互換の 'x-fa fa-名前' 形式で指定する ('fa fa-名前' も可)
// Free (solid) のアイコンが利用できる: https://fontawesome.com/search?ic=free
// ボタンをクリックすると iconCls 定義がクリップボードにコピーされる (clipboard: true)
{
  xtype: 'panel',
  itemId: 'faCatalog',
  title: 'Font Awesome アイコン (iconCls)',
  iconCls: 'x-fa fa-icons',
  bodyPadding: 12,
  layout: { type: 'grid', columns: 2, gap: 12 },
  defaults: { bodyPadding: 8 },
  items: [
    {
      xtype: 'fieldset',
      itemId: 'opIcons',
      title: '操作',
      layout: { type: 'grid', columns: 8, gap: 4 },
      items: [
        { iconCls: 'x-fa fa-plus' },
        { iconCls: 'x-fa fa-pen' },
        { iconCls: 'x-fa fa-trash' },
        { iconCls: 'x-fa fa-floppy-disk' },
        { iconCls: 'x-fa fa-copy' },
        { iconCls: 'x-fa fa-rotate' },
        { iconCls: 'x-fa fa-magnifying-glass' },
        { iconCls: 'x-fa fa-filter' },
        { iconCls: 'x-fa fa-download' },
        { iconCls: 'x-fa fa-upload' },
        { iconCls: 'x-fa fa-print' },
        { iconCls: 'x-fa fa-file-export' },
      ],
      defaults: { xtype: 'button', clipboard: true },
    },
    {
      xtype: 'fieldset',
      itemId: 'navIcons',
      title: 'ナビゲーション / データ',
      layout: { type: 'grid', columns: 8, gap: 4 },
      items: [
        { iconCls: 'x-fa fa-house' },
        { iconCls: 'x-fa fa-gear' },
        { iconCls: 'x-fa fa-user' },
        { iconCls: 'x-fa fa-users' },
        { iconCls: 'x-fa fa-bell' },
        { iconCls: 'x-fa fa-envelope' },
        { iconCls: 'x-fa fa-calendar-days' },
        { iconCls: 'x-fa fa-folder-open' },
        { iconCls: 'x-fa fa-table' },
        { iconCls: 'x-fa fa-chart-line' },
        { iconCls: 'x-fa fa-database' },
        { iconCls: 'x-fa fa-cloud-arrow-up' },
      ],
      defaults: { xtype: 'button', clipboard: true },
    },
    {
      xtype: 'fieldset',
      itemId: 'stateIcons',
      title: '状態',
      layout: { type: 'grid', columns: 8, gap: 4 },
      items: [
        { iconCls: 'x-fa fa-circle-check' },
        { iconCls: 'x-fa fa-circle-xmark' },
        { iconCls: 'x-fa fa-triangle-exclamation' },
        { iconCls: 'x-fa fa-circle-info' },
        { iconCls: 'x-fa fa-circle-question' },
        { iconCls: 'x-fa fa-lock' },
        { iconCls: 'x-fa fa-lock-open' },
        { iconCls: 'x-fa fa-star' },
        { iconCls: 'x-fa fa-clock' },
        { iconCls: 'x-fa fa-ban' },
        { iconCls: 'x-fa fa-check' },
        { iconCls: 'x-fa fa-xmark' },
      ],
      defaults: { xtype: 'button', clipboard: true },
    },
    {
      xtype: 'fieldset',
      itemId: 'usageDemo',
      title: '使いどころの例',
      items: [
        {
          xtype: 'toolbar',
          itemId: 'faToolbar',
          items: [
            { itemId: 'btnFaSend', text: '送信', ui: 'primary', iconCls: 'x-fa fa-paper-plane' },
            {
              xtype: 'splitbutton',
              itemId: 'btnFaSave',
              text: '保存',
              iconCls: 'x-fa fa-floppy-disk',
              menu: [
                { text: '名前を付けて保存', iconCls: 'x-fa fa-file-signature' },
                { text: 'テンプレート保存', iconCls: 'x-fa fa-box-archive' },
              ],
            },
            '->',
            { itemId: 'btnFaAi', text: 'AI', iconCls: 'x-fa fa-wand-magic-sparkles' },
          ],
        },
        {
          xtype: 'tabpanel',
          itemId: 'faTabs',
          margin: '8 0 0 0',
          height: 120,
          items: [
            { title: '一覧', iconCls: 'x-fa fa-table', bodyPadding: 8, html: 'タブにもアイコンを表示できる' },
            { title: '設定', iconCls: 'x-fa fa-gear', bodyPadding: 8 },
            { title: 'ヘルプ', iconCls: 'x-fa fa-circle-question', bodyPadding: 8 },
          ],
        },
      ],
    },
  ],
}
```
