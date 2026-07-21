# Fit + Box レイアウト

- カテゴリ: 基本
- 使用 layout: `fit`, `hbox`, `vbox`
- 使用 xtype: `button`, `container`, `panel`, `textarea`, `textfield`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// Fit レイアウト + hbox/vbox の組み合わせ例
{
  xtype: 'panel',
  itemId: 'mailComposePanel',
  title: 'メール作成',
  layout: 'fit',
  items: [
    {
      xtype: 'container',
      itemId: 'mailForm',
      padding: 12,
      layout: { type: 'vbox', align: 'stretch' },
      items: [
        { xtype: 'textfield', itemId: 'toField', fieldLabel: '宛先', emptyText: 'to@example.com' },
        { xtype: 'textfield', itemId: 'subjectField', fieldLabel: '件名' },
        { xtype: 'textarea', itemId: 'bodyArea', fieldLabel: '本文', flex: 1 },
        {
          xtype: 'container',
          itemId: 'actionRow',
          layout: { type: 'hbox', pack: 'end' },
          items: [
            { xtype: 'button', itemId: 'btnDraft', text: '下書き保存' },
            { xtype: 'button', itemId: 'btnSend', text: '送信', ui: 'primary' },
          ],
        },
      ],
    },
  ],
}
```
