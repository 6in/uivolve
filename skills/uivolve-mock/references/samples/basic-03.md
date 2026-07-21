# フォーム

- カテゴリ: 基本
- 使用 layout: (なし)
- 使用 xtype: `checkbox`, `combobox`, `datefield`, `displayfield`, `form`, `listbox`, `panel`, `radio`, `textarea`, `textfield`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// フォームの例 (折りたたみパネル付き)
{
  xtype: 'panel',
  itemId: 'userEditPanel',
  title: 'ユーザー登録',
  width: 560,
  margin: 16,
  bodyPadding: 12,
  tbar: [
    { itemId: 'btnSave', text: '保存', ui: 'primary' },
    { itemId: 'btnCancel', text: 'キャンセル' },
  ],
  items: [
    {
      xtype: 'form',
      itemId: 'basicInfoForm',
      title: '基本情報',
      items: [
        // allowBlank: false = 必須 (ラベルに * 表示)。maxLength / vtype はネイティブ検証も効く
        { xtype: 'textfield', itemId: 'nameField', fieldLabel: '氏名', emptyText: '山田 太郎', allowBlank: false, maxLength: 20 },
        { xtype: 'textfield', itemId: 'emailField', fieldLabel: 'メール', value: 'taro@example.com', allowBlank: false, vtype: 'email' },
        { xtype: 'datefield', itemId: 'birthField', fieldLabel: '生年月日' },
        {
          xtype: 'combobox',
          itemId: 'deptCombo',
          fieldLabel: '部署',
          allowBlank: false,
          options: ['営業部', '開発部', '総務部'],
        },
        { xtype: 'radio', itemId: 'genderMale', fieldLabel: '性別', boxLabel: '男性', name: 'gender', checked: true },
        { xtype: 'radio', itemId: 'genderFemale', fieldLabel: '', boxLabel: '女性', name: 'gender' },
        { xtype: 'checkbox', itemId: 'notifyCheck', fieldLabel: '通知', boxLabel: 'メールマガジンを受け取る' },
        { xtype: 'textarea', itemId: 'memoArea', fieldLabel: '備考', emptyText: '自由記入欄 (200 文字まで)', rows: 3, maxLength: 200 },
      ],
    },
    {
      xtype: 'form',
      itemId: 'detailForm',
      title: '詳細設定',
      collapsible: true,
      collapsed: true,
      margin: '8 0 0 0',
      items: [
        { xtype: 'listbox', itemId: 'permList', fieldLabel: '権限', multiSelect: true, options: ['閲覧', '編集', '承認', '管理'] },
        { xtype: 'displayfield', itemId: 'regDateField', fieldLabel: '登録日', value: '2026-07-07' },
      ],
    },
  ],
}
```
