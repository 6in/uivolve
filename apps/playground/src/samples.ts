export interface Sample {
  name: string
  code: string
}

const borderSample = `// Border レイアウトのダッシュボード例
// 各コンポーネントには itemId を付与して一意に識別できるようにしている
// (AI に「orderGrid に列を追加して」のように指示しやすくなる)
{
  xtype: 'panel',
  itemId: 'orderApp',
  title: '受注管理システム',
  layout: 'border',
  items: [
    {
      region: 'north',
      xtype: 'container',
      itemId: 'headerArea',
      items: [
        {
          xtype: 'toolbar',
          itemId: 'mainToolbar',
          items: [
            { itemId: 'btnNew', text: '新規作成', ui: 'primary', iconCls: 'x-fa fa-plus', handler: 'onCreateOrder' },
            { itemId: 'btnEdit', text: '編集', iconCls: 'x-fa fa-pen' },
            '-',
            { itemId: 'btnDelete', text: '削除', iconCls: 'x-fa fa-trash' },
            '->',
            '検索:',
            { xtype: 'textfield', itemId: 'searchField', emptyText: 'キーワード', width: 200 },
          ],
        },
      ],
    },
    {
      region: 'west',
      itemId: 'menuPanel',
      title: 'メニュー',
      width: 200,
      split: true,
      collapsible: true,
      bodyPadding: 8,
      items: [
        {
          xtype: 'listbox',
          itemId: 'menuList',
          size: 8,
          options: ['受注一覧', '出荷指示', '請求管理', '顧客マスタ', '商品マスタ'],
        },
      ],
    },
    {
      region: 'center',
      xtype: 'grid',
      itemId: 'orderGrid',
      title: '受注一覧',
      columnLines: true,
      listeners: { select: 'onOrderSelect' },
      columns: [
        { text: '受注番号', dataIndex: 'no', width: 110 },
        { text: '顧客名', dataIndex: 'customer', flex: 1 },
        { text: '金額', dataIndex: 'amount', width: 100, align: 'right' },
        { text: '状態', dataIndex: 'status', width: 90 },
      ],
      store: {
        data: [
          { no: 'SO-0001', customer: '山田商事', amount: '¥120,000', status: '出荷済' },
          { no: 'SO-0002', customer: '鈴木工業', amount: '¥58,300', status: '受注' },
          { no: 'SO-0003', customer: '田中物産', amount: '¥310,900', status: '請求済' },
          { no: 'SO-0004', customer: '佐藤製作所', amount: '¥42,000', status: '受注' },
        ],
      },
    },
    {
      region: 'south',
      xtype: 'container',
      itemId: 'footerArea',
      items: [
        { xtype: 'toolbar', itemId: 'statusBar', items: ['ステータス: 準備完了', '->', '4 件'] },
      ],
    },
  ],
}
`

const formSample = `// フォームの例 (折りたたみパネル付き)
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
        { xtype: 'textfield', itemId: 'nameField', fieldLabel: '氏名', emptyText: '山田 太郎' },
        { xtype: 'textfield', itemId: 'emailField', fieldLabel: 'メール', value: 'taro@example.com' },
        { xtype: 'datefield', itemId: 'birthField', fieldLabel: '生年月日' },
        {
          xtype: 'combobox',
          itemId: 'deptCombo',
          fieldLabel: '部署',
          options: ['営業部', '開発部', '総務部'],
        },
        { xtype: 'radio', itemId: 'genderMale', fieldLabel: '性別', boxLabel: '男性', name: 'gender', checked: true },
        { xtype: 'radio', itemId: 'genderFemale', fieldLabel: '', boxLabel: '女性', name: 'gender' },
        { xtype: 'checkbox', itemId: 'notifyCheck', fieldLabel: '通知', boxLabel: 'メールマガジンを受け取る' },
        { xtype: 'textarea', itemId: 'memoArea', fieldLabel: '備考', emptyText: '自由記入欄', rows: 3 },
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
`

const gridLayoutSample = `// Grid レイアウトの例 (3 カラム / colspan 対応)
// chart (bar/line/area/pie) と draw (SVG スプライト) でダッシュボードを構成
{
  xtype: 'panel',
  itemId: 'dashboard',
  title: 'ダッシュボード',
  bodyPadding: 12,
  layout: { type: 'grid', columns: 3, gap: 12 },
  items: [
    { itemId: 'salesCard', title: '売上', html: '<b style="font-size:24px">¥1,234,000</b><br>前月比 +12%' },
    { itemId: 'newCustomerCard', title: '新規顧客', html: '<b style="font-size:24px">38 社</b><br>前月比 +4%' },
    { itemId: 'taskCard', title: '未処理タスク', html: '<b style="font-size:24px">7 件</b><br>要対応' },
    {
      itemId: 'trendPanel',
      title: '月次推移 (売上 / 利益)',
      colspan: 2,
      height: 220,
      items: [
        {
          xtype: 'chart',
          itemId: 'trendChart',
          height: 180,
          series: [{ type: 'line', xField: 'month', yField: ['sales', 'profit'], title: ['売上', '利益'] }],
          store: {
            data: [
              { month: '2月', sales: 96, profit: 22 },
              { month: '3月', sales: 118, profit: 30 },
              { month: '4月', sales: 102, profit: 26 },
              { month: '5月', sales: 134, profit: 38 },
              { month: '6月', sales: 128, profit: 41 },
            ],
          },
        },
      ],
    },
    {
      itemId: 'categoryPanel',
      title: 'カテゴリ構成',
      height: 220,
      items: [
        {
          xtype: 'polar',
          itemId: 'categoryPie',
          height: 180,
          series: [{ type: 'pie', xField: 'category', yField: 'count' }],
          store: {
            data: [
              { category: '製造', count: 48 },
              { category: '卸売', count: 32 },
              { category: '小売', count: 28 },
              { category: 'その他', count: 12 },
            ],
          },
        },
      ],
    },
    {
      itemId: 'repPanel',
      title: '担当者別受注 (今月 / 先月)',
      colspan: 2,
      height: 220,
      items: [
        {
          xtype: 'chart',
          itemId: 'repChart',
          height: 180,
          series: [{ type: 'bar', xField: 'rep', yField: ['now', 'prev'], title: ['今月', '先月'] }],
          store: {
            data: [
              { rep: '佐藤', now: 34, prev: 28 },
              { rep: '田中', now: 26, prev: 31 },
              { rep: '鈴木', now: 22, prev: 18 },
              { rep: '高橋', now: 18, prev: 21 },
            ],
          },
        },
      ],
    },
    {
      itemId: 'slaPanel',
      title: '稼働状況 (draw)',
      height: 220,
      items: [
        {
          xtype: 'draw',
          itemId: 'slaGauge',
          height: 180,
          sprites: [
            { type: 'circle', cx: 90, cy: 90, r: 62, strokeStyle: '#e2e8ee', lineWidth: 14 },
            { type: 'path', path: 'M 90 28 A 62 62 0 1 1 33 122', strokeStyle: '#4caf50', lineWidth: 14 },
            { type: 'text', x: 90, y: 88, text: '98.2%', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
            { type: 'text', x: 90, y: 108, text: '稼働率', fontSize: 12, fillStyle: '#8a97a5', textAlign: 'center' },
            { type: 'rect', x: 180, y: 40, width: 12, height: 12, radius: 3, fillStyle: '#4caf50' },
            { type: 'text', x: 198, y: 51, text: '正常 12', fontSize: 12 },
            { type: 'rect', x: 180, y: 64, width: 12, height: 12, radius: 3, fillStyle: '#d9a520' },
            { type: 'text', x: 198, y: 75, text: '警告 2', fontSize: 12 },
            { type: 'rect', x: 180, y: 88, width: 12, height: 12, radius: 3, fillStyle: '#cd5c5c' },
            { type: 'text', x: 198, y: 99, text: '停止 0', fontSize: 12 },
          ],
        },
      ],
    },
    {
      itemId: 'noticePanel',
      title: 'お知らせ',
      colspan: 3,
      bodyPadding: 8,
      html: '・7/10 メンテナンス予定<br>・新機能リリースのお知らせ',
    },
  ],
}
`

const fitSample = `// Fit レイアウト + hbox/vbox の組み合わせ例
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
`

const tabAccordionSample = `// タブパネル + アコーディオン + ツリーの例
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
`

const windowSample = `// ウィンドウ (ダイアログ) の例 — ルートに置くとモーダル風に中央表示
{
  xtype: 'window',
  itemId: 'loginWindow',
  title: 'ログイン',
  width: 380,
  closable: true,
  bodyPadding: 16,
  items: [
    { xtype: 'textfield', itemId: 'userIdField', fieldLabel: 'ユーザーID', labelWidth: 90 },
    { xtype: 'textfield', itemId: 'passwordField', fieldLabel: 'パスワード', labelWidth: 90, inputType: 'password' },
    { xtype: 'checkbox', itemId: 'keepLoginCheck', fieldLabel: '', labelWidth: 90, boxLabel: 'ログイン状態を保持' },
  ],
  bbar: [
    '->',
    { itemId: 'btnLogin', text: 'ログイン', ui: 'primary' },
    { itemId: 'btnLoginCancel', text: 'キャンセル' },
  ],
}
`

const miscSample = `// 小物コンポーネント + column レイアウトの例
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
          value: '### 画面仕様メモ\\n\\n- \`btnOps\` の操作メニューは**権限で出し分け**\\n- 同期は 5 分間隔 (\`syncProgress\` に反映)\\n\\n> 詳細は [設計書](https://example.com) を参照',
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
`

const yamlSample = `# YAML 記法の例 — JSON5 と自動判別されます
# ツールバーの「JSON5 へ変換」で相互変換もできます
xtype: panel
itemId: contactPanel
title: 問い合わせフォーム (YAML)
width: 560
margin: 16
bodyPadding: 12
tbar:
  - itemId: btnSubmit
    text: 送信
    ui: primary
    iconCls: x-fa fa-paper-plane
  - itemId: btnClear
    text: クリア
items:
  - xtype: combobox
    itemId: categoryCombo
    fieldLabel: 種別
    options: [製品について, 障害報告, その他]
  - xtype: textfield
    itemId: subjectField
    fieldLabel: 件名
    emptyText: 例) ログインできない
  - xtype: textarea
    itemId: bodyArea
    fieldLabel: 内容
    rows: 5
  - xtype: checkbox
    itemId: replyMailCheck
    fieldLabel: ''
    boxLabel: 回答をメールで受け取る
    checked: true
`

const supportSample = `// ツリーグリッド + ページング + HTML エディタの例
// - treepanel に columns を指定するとツリーグリッドになる (treecolumn が階層列)
// - grid の bbar に pagingtoolbar を置くとページ移動 UI が付く
// - htmleditor はリッチテキスト編集 (太字・リスト・ソース編集が動く)
{
  xtype: 'panel',
  itemId: 'supportApp',
  title: '問い合わせ管理',
  layout: 'border',
  items: [
    {
      region: 'west',
      xtype: 'treepanel',
      itemId: 'categoryTree',
      title: 'カテゴリ',
      width: 260,
      split: true,
      collapsible: true,
      columnLines: true,
      columns: [
        { xtype: 'treecolumn', text: 'カテゴリ', dataIndex: 'text', flex: 1 },
        { text: '件数', dataIndex: 'count', width: 60, align: 'right' },
      ],
      root: {
        children: [
          {
            text: '製品', count: 20, expanded: true,
            children: [
              { text: '不具合', count: 12, leaf: true },
              { text: '使い方', count: 8, leaf: true },
            ],
          },
          {
            text: '契約', count: 4,
            children: [
              { text: '請求', count: 3, leaf: true },
              { text: '解約', count: 1, leaf: true },
            ],
          },
        ],
      },
    },
    {
      region: 'center',
      xtype: 'grid',
      itemId: 'ticketGrid',
      title: '問い合わせ一覧',
      columnLines: true,
      columns: [
        { text: '番号', dataIndex: 'no', width: 90 },
        { text: '件名', dataIndex: 'subject', flex: 1 },
        { text: '顧客', dataIndex: 'customer', width: 120 },
        { text: '状態', dataIndex: 'status', width: 90 },
      ],
      store: {
        data: [
          { no: 'T-0101', subject: 'ログインできない', customer: '山田商事', status: '対応中' },
          { no: 'T-0102', subject: '帳票が出力されない', customer: '鈴木工業', status: '新規' },
          { no: 'T-0103', subject: '請求金額の確認', customer: '田中物産', status: '完了' },
          { no: 'T-0104', subject: 'パスワード再発行', customer: '佐藤製作所', status: '新規' },
        ],
      },
      bbar: {
        xtype: 'pagingtoolbar',
        itemId: 'ticketPaging',
        pageSize: 25,
        total: 128,
        displayInfo: true,
      },
    },
    {
      region: 'south',
      xtype: 'form',
      itemId: 'replyPanel',
      title: '返信',
      height: 240,
      split: true,
      collapsible: true,
      items: [
        {
          xtype: 'htmleditor',
          itemId: 'replyEditor',
          fieldLabel: '本文',
          height: 150,
          value: '<p>お問い合わせありがとうございます。</p><p>担当者より<b>1 営業日以内</b>にご連絡いたします。</p>',
        },
      ],
      bbar: ['->', { itemId: 'btnSend', text: '送信', ui: 'primary', iconCls: 'x-fa fa-paper-plane' }],
    },
  ],
}
`

const chatSample = `// チャットボット画面の例 (chatpanel は独自拡張)
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
      text: '2026 年 6 月の受注は **128 件** でした。\\n\\n- 出荷済: 96 件\\n- 処理中: 24 件\\n- キャンセル: 8 件\\n\\n詳細は \`orderGrid\` 画面で確認できます。' },
    { from: 'user', time: '10:02', text: 'CSV でエクスポートして' },
  ],
  bbar: [
    { xtype: 'textfield', itemId: 'chatInput', emptyText: 'メッセージを入力...', flex: 1 },
    { itemId: 'btnSendChat', text: '送信', ui: 'primary', iconCls: 'x-fa fa-paper-plane', handler: 'onSendMessage' },
  ],
}
`

export const samples: Sample[] = [
  { name: 'Border レイアウト', code: borderSample },
  { name: 'YAML 記法', code: yamlSample },
  { name: 'フォーム', code: formSample },
  { name: 'Grid レイアウト', code: gridLayoutSample },
  { name: 'Fit + Box レイアウト', code: fitSample },
  { name: 'タブ + アコーディオン + ツリー', code: tabAccordionSample },
  { name: 'ウィンドウ (ダイアログ)', code: windowSample },
  { name: '小物カタログ (column)', code: miscSample },
  { name: 'ツリーグリッド + ページング', code: supportSample },
  { name: 'チャットボット', code: chatSample },
]
