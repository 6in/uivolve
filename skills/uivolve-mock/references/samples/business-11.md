# チャットボット

- カテゴリ: 業務画面
- 使用 layout: (なし)
- 使用 xtype: `chatpanel`, `textfield`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// チャットボット画面の例 (chatpanel は独自拡張)
// from: 'user' は右寄せ、bot の text は Markdown として描画される
// typing: true で末尾に入力中インジケーターを表示
{
  xtype: 'chatpanel',
  itemId: 'supportChat',
  title: 'AI アシスタント',
  iconCls: 'x-fa fa-robot',
  width: 520,
  height: 560,
  margin: 16,
  typing: true,
  messages: [
    { from: 'bot', name: 'アシスタント', time: '10:00',
      text: 'こんにちは。**受注管理システム**のアシスタントです。ご用件をどうぞ。' },
    { from: 'user', time: '10:01', text: '先月の受注件数を教えて' },
    { from: 'bot', name: 'アシスタント', time: '10:01',
      text: '2026 年 6 月の受注は **128 件** でした。\n\n- 出荷済: 96 件\n- 処理中: 24 件\n- キャンセル: 8 件\n\n詳細は `orderGrid` 画面で確認できます。' },
    { from: 'user', time: '10:02', text: 'CSV でエクスポートして' },
  ],
  bbar: [
    { xtype: 'textfield', itemId: 'chatInput', emptyText: 'メッセージを入力...', flex: 1 },
    { itemId: 'btnSendChat', text: '送信', ui: 'primary', iconCls: 'x-fa fa-paper-plane', handler: 'onSendMessage' },
  ],
}
```
