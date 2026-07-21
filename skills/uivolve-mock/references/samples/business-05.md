# コールセンター / CRM

- カテゴリ: 業務画面
- 使用 layout: `border`
- 使用 xtype: `chatpanel`, `combobox`, `displayfield`, `form`, `grid`, `panel`, `textareafield`, `textfield`

このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に
貼り付けるとプレビューできる。

```uivolve height=480
// 業務画面: コールセンター / CRM
// 応対チャット (chatpanel) + 顧客情報フォーム + 対応履歴グリッド
{
  xtype: 'panel',
  itemId: 'crmScreen',
  title: 'コールセンター — 応対コンソール',
  layout: 'border',
  items: [
    {
      region: 'west',
      xtype: 'form',
      itemId: 'customerForm',
      title: '顧客情報',
      width: 300,
      split: true,
      bodyPadding: 12,
      items: [
        { xtype: 'displayfield', itemId: 'custNo', fieldLabel: '顧客番号', value: 'C-102938', labelWidth: 70 },
        { xtype: 'textfield', itemId: 'custName', fieldLabel: '氏名', value: '山田 太郎', labelWidth: 70 },
        { xtype: 'textfield', itemId: 'custKana', fieldLabel: 'カナ', value: 'ヤマダ タロウ', labelWidth: 70 },
        { xtype: 'textfield', itemId: 'custTel', fieldLabel: '電話', value: '090-1234-5678', labelWidth: 70, vtype: 'phone' },
        { xtype: 'textfield', itemId: 'custMail', fieldLabel: 'メール', value: 'taro@example.com', labelWidth: 70, vtype: 'email' },
        { xtype: 'combobox', itemId: 'custRank', fieldLabel: '会員ランク', value: 'ゴールド', labelWidth: 70, options: ['一般', 'シルバー', 'ゴールド', 'プラチナ'] },
        { xtype: 'displayfield', itemId: 'custPlan', fieldLabel: '契約', value: 'プレミアム (2024/04〜)', labelWidth: 70 },
        {
          xtype: 'textareafield',
          itemId: 'custMemo',
          fieldLabel: 'メモ',
          labelWidth: 70,
          height: 72,
          value: '前回、配送遅延のお詫びクーポン発行済み (6/28)',
        },
      ],
      bbar: ['->', { itemId: 'btnSaveCustomer', text: '顧客情報を保存', iconCls: 'x-fa fa-floppy-disk', handler: 'onSaveCustomer' }],
    },
    {
      region: 'center',
      xtype: 'chatpanel',
      itemId: 'sessionChat',
      title: '応対中 — チャットセッション #48211 (山田 太郎 様)',
      typing: true,
      messages: [
        { from: 'user', name: '山田様', time: '13:02', text: '注文した商品がまだ届かないのですが、状況を確認できますか?注文番号は SO-0001 です。' },
        { from: 'bot', name: 'オペレーター 高橋', time: '13:03', text: 'お問い合わせありがとうございます。注文 **SO-0001** を確認いたします。少々お待ちください。' },
        { from: 'bot', name: 'オペレーター 高橋', time: '13:04', text: '確認いたしました。**7/14 に出荷済み**で、本日 **7/15 の 18〜20 時**にお届け予定です。\n\n- 配送業者: 〇〇運輸\n- 伝票番号: 4567-8901-2345' },
        { from: 'user', name: '山田様', time: '13:05', text: 'わかりました。受け取り時間を 20〜21 時に変更できますか?' },
      ],
      bbar: [
        { xtype: 'textfield', itemId: 'replyInput', emptyText: '返信を入力... (定型文: Ctrl+T)', flex: 1 },
        { itemId: 'btnTemplate', text: '定型文', iconCls: 'x-fa fa-list', handler: 'onInsertTemplate' },
        { itemId: 'btnReply', text: '送信', ui: 'primary', iconCls: 'x-fa fa-paper-plane', handler: 'onSendReply' },
      ],
    },
    {
      region: 'south',
      xtype: 'grid',
      itemId: 'contactHistory',
      title: '対応履歴',
      height: 190,
      split: true,
      columns: [
        { text: '日時', dataIndex: 'ts', width: 140 },
        { text: 'チャネル', dataIndex: 'channel', width: 90 },
        { text: '担当', dataIndex: 'agent', width: 90 },
        { text: '件名', dataIndex: 'subject', flex: 1 },
        { text: '状態', dataIndex: 'status', width: 90 },
      ],
      store: {
        data: [
          { ts: '2026-07-15 13:02', channel: 'チャット', agent: '高橋', subject: '配送状況の確認 (SO-0001)', status: '対応中' },
          { ts: '2026-06-28 10:15', channel: '電話', agent: '佐藤', subject: '配送遅延のお詫び・クーポン発行', status: '完了' },
          { ts: '2026-06-25 09:40', channel: 'メール', agent: '田中', subject: '請求書の再発行依頼', status: '完了' },
          { ts: '2026-05-12 16:20', channel: 'チャット', agent: '高橋', subject: 'プラン変更の相談', status: '完了' },
        ],
      },
    },
  ],
}
```
