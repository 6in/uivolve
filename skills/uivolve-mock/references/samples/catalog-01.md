# 小物カタログ (column)

- カテゴリ: コンポーネントカタログ
- 使用 layout: `center`, `column`
- 使用 xtype: `button`, `checkboxgroup`, `datepicker`, `displayfield`, `fieldset`, `iframe`, `markdown`, `panel`, `progressbar`, `radiogroup`, `slider`, `splitbutton`, `toolbar`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// 小物コンポーネント + column レイアウトの例
{
  xtype: 'panel',
  itemId: 'catalogPanel',
  title: 'コンポーネントカタログ',
  bodyPadding: 8,
  layout: 'column',
  items: [
    {
      xtype: 'fieldset',
      itemId: 'notifyFieldset',
      columnWidth: 0.5,
      title: '通知設定',
      collapsible: true,
      items: [
        {
          xtype: 'radiogroup',
          itemId: 'freqGroup',
          fieldLabel: '頻度',
          columns: 3,
          items: [
            { boxLabel: '毎日', name: 'freq', checked: true },
            { boxLabel: '毎週', name: 'freq' },
            { boxLabel: 'なし', name: 'freq' },
          ],
        },
        {
          xtype: 'checkboxgroup',
          itemId: 'channelGroup',
          fieldLabel: 'チャネル',
          columns: 2,
          items: [
            { boxLabel: 'メール', checked: true },
            { boxLabel: 'Slack' },
            { boxLabel: 'SMS' },
            { boxLabel: 'アプリ内' },
          ],
        },
        { xtype: 'slider', itemId: 'volumeSlider', fieldLabel: '音量', value: 60 },
      ],
    },
    {
      xtype: 'fieldset',
      itemId: 'statusFieldset',
      columnWidth: 0.5,
      title: 'ステータス',
      items: [
        { xtype: 'displayfield', itemId: 'syncStatus', fieldLabel: '同期状況', value: '最終同期 2026-07-07 12:00' },
        { xtype: 'progressbar', itemId: 'syncProgress', value: 0.7, text: '同期中... 70%' },
        {
          xtype: 'toolbar',
          itemId: 'opsToolbar',
          margin: '8 0 0 0',
          items: [
            {
              itemId: 'btnOps',
              text: '操作',
              iconCls: 'x-fa fa-bolt',
              menu: [
                { text: '再同期', iconCls: 'x-fa fa-rotate' },
                { text: 'エクスポート', iconCls: 'x-fa fa-file-export' },
                '-',
                { text: '設定', iconCls: 'x-fa fa-gear', menu: [] },
              ],
            },
            { xtype: 'splitbutton', itemId: 'btnSaveSplit', text: '保存', iconCls: 'x-fa fa-floppy-disk', menu: [{ text: '名前を付けて保存' }, { text: 'テンプレート保存' }] },
          ],
        },
      ],
    },
    {
      xtype: 'fieldset',
      itemId: 'calendarFieldset',
      columnWidth: 0.5,
      title: 'カレンダー (datepicker)',
      items: [{ xtype: 'datepicker', itemId: 'deliveryDatePicker', value: '2026-07-07' }],
    },
    {
      xtype: 'panel',
      itemId: 'centerDemoPanel',
      columnWidth: 0.5,
      title: 'center レイアウト',
      height: 240,
      layout: 'center',
      margin: '4 0 0 0',
      items: [{ xtype: 'button', itemId: 'btnCentered', text: '中央配置されたボタン', ui: 'primary' }],
    },
    {
      xtype: 'fieldset',
      itemId: 'markdownFieldset',
      columnWidth: 0.5,
      title: '仕様メモ (markdown)',
      items: [
        {
          xtype: 'markdown',
          itemId: 'specNote',
          value: '### 画面仕様メモ\n\n- `btnOps` の操作メニューは**権限で出し分け**\n- 同期は 5 分間隔 (`syncProgress` に反映)\n\n> 詳細は [設計書](https://example.com) を参照',
        },
      ],
    },
    {
      xtype: 'fieldset',
      itemId: 'iframeFieldset',
      columnWidth: 0.5,
      title: '外部ページ埋め込み (iframe)',
      margin: '4 0 0 0',
      items: [{ xtype: 'iframe', itemId: 'externalFrame', src: 'https://example.com', height: 180 }],
    },
  ],
}
```
