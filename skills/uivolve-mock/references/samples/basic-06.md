# タブ + アコーディオン + ツリー

- カテゴリ: 基本
- 使用 layout: `accordion`, `border`
- 使用 xtype: `button`, `combobox`, `container`, `form`, `grid`, `panel`, `tabpanel`, `textarea`, `textfield`, `treepanel`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// タブパネル + アコーディオン + ツリーの例
{
  xtype: 'panel',
  itemId: 'customerConsole',
  title: '顧客管理コンソール',
  layout: 'border',
  items: [
    {
      region: 'west',
      xtype: 'container',
      itemId: 'sideNav',
      width: 220,
      split: true,
      layout: 'accordion',
      items: [
        {
          xtype: 'treepanel',
          itemId: 'folderTree',
          title: 'フォルダ',
          root: {
            children: [
              {
                text: '営業部',
                expanded: true,
                children: [
                  { text: '第一課', leaf: true },
                  { text: '第二課', leaf: true },
                ],
              },
              {
                text: '開発部',
                children: [{ text: 'プラットフォーム課', leaf: true }],
              },
              { text: 'アーカイブ', leaf: true },
            ],
          },
        },
        { itemId: 'searchPanel', title: '検索', bodyPadding: 8, items: [
          { xtype: 'textfield', itemId: 'navSearchField', emptyText: 'キーワード' },
          { xtype: 'button', itemId: 'btnNavSearch', text: '検索' },
        ]},
        { itemId: 'settingsPanel', title: '設定', bodyPadding: 8, html: '各種設定がここに入ります' },
      ],
    },
    {
      region: 'center',
      xtype: 'tabpanel',
      itemId: 'mainTabs',
      activeTab: 0,
      items: [
        {
          xtype: 'grid',
          itemId: 'customerGrid',
          title: '一覧',
          iconCls: 'x-fa fa-table',
          columnLines: true,
          columns: [
            { text: '顧客名', dataIndex: 'name', flex: 1 },
            { text: '担当', dataIndex: 'rep', width: 100 },
            { text: '電話', dataIndex: 'tel', width: 140 },
          ],
          store: {
            data: [
              { name: '山田商事', rep: '佐藤', tel: '03-1234-5678' },
              { name: '鈴木工業', rep: '田中', tel: '06-9876-5432' },
            ],
          },
        },
        {
          xtype: 'form',
          itemId: 'customerDetailForm',
          title: '詳細',
          iconCls: 'x-fa fa-user',
          bodyPadding: 12,
          items: [
            { xtype: 'textfield', itemId: 'custNameField', fieldLabel: '顧客名', value: '山田商事' },
            { xtype: 'combobox', itemId: 'rankCombo', fieldLabel: 'ランク', options: ['A', 'B', 'C'] },
            { xtype: 'textarea', itemId: 'custMemoArea', fieldLabel: 'メモ', rows: 4 },
          ],
        },
        { itemId: 'historyTab', title: '履歴', iconCls: 'x-fa fa-clock', closable: true, bodyPadding: 12, html: '取引履歴タブ' },
      ],
    },
  ],
}
```
