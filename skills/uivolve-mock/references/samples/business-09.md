# 設定画面

- カテゴリ: 業務画面
- 使用 layout: `fit`
- 使用 xtype: `checkbox`, `checkboxgroup`, `combobox`, `displayfield`, `fieldset`, `messagebox`, `panel`, `radiogroup`, `slider`, `tabpanel`, `textfield`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// 業務画面: 設定 (タブ + フィールドセット + 保存確認)
{
  xtype: 'panel',
  itemId: 'settingsScreen',
  title: 'システム設定',
  layout: 'fit',
  items: [
    {
      xtype: 'tabpanel',
      itemId: 'settingsTabs',
      activeTab: 0,
      items: [
        {
          title: '一般',
          iconCls: 'x-fa fa-sliders',
          bodyPadding: 16,
          items: [
            {
              xtype: 'fieldset',
              itemId: 'fsDisplay',
              title: '表示',
              items: [
                { xtype: 'combobox', itemId: 'setTheme', fieldLabel: 'テーマ', value: 'Neptune', options: ['Neptune', 'Classic', 'Gray', 'Dark'] },
                { xtype: 'combobox', itemId: 'setLang', fieldLabel: '言語', value: '日本語', options: ['日本語', 'English', '中文'] },
                { xtype: 'combobox', itemId: 'setPageSize', fieldLabel: '一覧の件数', value: '50 件', options: ['25 件', '50 件', '100 件'] },
              ],
            },
            {
              xtype: 'fieldset',
              itemId: 'fsStartup',
              title: '起動時',
              items: [
                {
                  xtype: 'radiogroup',
                  itemId: 'setStartView',
                  fieldLabel: '初期画面',
                  items: [
                    { boxLabel: 'メインメニュー', name: 'startView', checked: true },
                    { boxLabel: '受注一覧', name: 'startView' },
                    { boxLabel: '前回の画面', name: 'startView' },
                  ],
                },
                { xtype: 'checkbox', itemId: 'setNews', fieldLabel: '', boxLabel: 'お知らせを起動時に表示する', checked: true },
              ],
            },
          ],
        },
        {
          title: '通知',
          iconCls: 'x-fa fa-bell',
          bodyPadding: 16,
          items: [
            {
              xtype: 'fieldset',
              itemId: 'fsNotify',
              title: '通知チャネル',
              items: [
                {
                  xtype: 'checkboxgroup',
                  itemId: 'setChannels',
                  fieldLabel: '受け取る通知',
                  columns: 2,
                  items: [
                    { boxLabel: '承認依頼', checked: true },
                    { boxLabel: '在庫アラート', checked: true },
                    { boxLabel: '出荷遅延', checked: true },
                    { boxLabel: 'システムお知らせ' },
                  ],
                },
                { xtype: 'combobox', itemId: 'setMailDigest', fieldLabel: 'メール通知', value: '1 時間ごとにまとめる', options: ['即時', '1 時間ごとにまとめる', '1 日 1 回', '受け取らない'] },
                { xtype: 'slider', itemId: 'setVolume', fieldLabel: '通知音量', value: 60 },
              ],
            },
          ],
        },
        {
          title: 'セキュリティ',
          iconCls: 'x-fa fa-shield-halved',
          bodyPadding: 16,
          items: [
            {
              xtype: 'fieldset',
              itemId: 'fsPassword',
              title: 'パスワード変更',
              items: [
                { xtype: 'textfield', itemId: 'setPwCurrent', fieldLabel: '現在のパスワード', labelWidth: 130, inputType: 'password' },
                { xtype: 'textfield', itemId: 'setPwNew', fieldLabel: '新しいパスワード', labelWidth: 130, inputType: 'password', minLength: 12 },
                { xtype: 'textfield', itemId: 'setPwConfirm', fieldLabel: '確認', labelWidth: 130, inputType: 'password' },
              ],
            },
            {
              xtype: 'fieldset',
              itemId: 'fsMfa',
              title: '2 段階認証',
              items: [
                { xtype: 'checkbox', itemId: 'setMfa', fieldLabel: '', boxLabel: '2 段階認証を有効にする (推奨)', checked: true },
                { xtype: 'displayfield', itemId: 'setMfaDevice', fieldLabel: '登録デバイス', labelWidth: 130, value: 'iPhone (登録: 2026/04/01)' },
              ],
            },
          ],
        },
      ],
    },
    // 保存ボタンを押した想定の確認ダイアログ
    {
      xtype: 'messagebox',
      itemId: 'saveConfirm',
      title: '設定の保存',
      message: '変更した設定を保存します。一部の設定は再ログイン後に反映されます。よろしいですか?',
      buttons: 'okcancel',
      icon: 'question',
    },
  ],
  bbar: [
    '->',
    { itemId: 'btnCancelSettings', text: '元に戻す', handler: 'onRevertSettings' },
    { itemId: 'btnSaveSettings', text: '保存', ui: 'primary', iconCls: 'x-fa fa-floppy-disk', handler: 'onSaveSettings' },
  ],
}
```
