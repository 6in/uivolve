export interface Sample {
  name: string
  code: string
  /** サンプル選択の optgroup 見出し */
  category: '基本' | '業務画面' | 'コンポーネントカタログ'
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
      // tbar は container にもそのまま書ける (items に xtype: 'toolbar' を置くのと同等)
      tbar: [
        { itemId: 'btnNew', text: '新規作成', ui: 'primary', iconCls: 'x-fa fa-plus', handler: 'onCreateOrder' },
        { itemId: 'btnEdit', text: '編集', iconCls: 'x-fa fa-pen' },
        '-',
        { itemId: 'btnDelete', text: '削除', iconCls: 'x-fa fa-trash' },
        '->',
        '検索:',
        { xtype: 'textfield', itemId: 'searchField', emptyText: 'キーワード', width: 200 },
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

const dialogSample = `// シンプルダイアログ (messagebox) とトースト (toast) の例
// messagebox はどこに置いても半透明バックドロップ + 中央表示になる
// toast はプレビュー隅に重ねて表示 (align: tr/tl/br/bl/t/b)。× で消せる
{
  xtype: 'panel',
  itemId: 'orderEditApp',
  title: '受注編集',
  layout: 'fit',
  items: [
    {
      xtype: 'form',
      itemId: 'orderForm',
      bodyPadding: 16,
      items: [
        { xtype: 'textfield', itemId: 'orderNoField', fieldLabel: '受注番号', value: 'SO-0002', readOnly: true },
        { xtype: 'textfield', itemId: 'customerField', fieldLabel: '顧客名', value: '鈴木工業' },
        { xtype: 'numberfield', itemId: 'amountField', fieldLabel: '金額', value: 58300 },
        { xtype: 'combobox', itemId: 'statusCombo', fieldLabel: '状態', value: '受注', options: ['受注', '出荷済', '請求済'] },
        // ↓ オーバーレイ系は絶対配置なので、ツリー内のどこに書いても表示位置は同じ
        {
          xtype: 'messagebox',
          itemId: 'deleteConfirm',
          title: '削除の確認',
          message: '受注 SO-0002 を削除します。よろしいですか?',
          buttons: 'yesno',
          icon: 'warning',
        },
        {
          xtype: 'toast',
          itemId: 'savedToast',
          title: '保存完了',
          html: '受注 <b>SO-0002</b> を保存しました',
          iconCls: 'x-fa fa-circle-check',
          align: 'tr',
        },
        {
          xtype: 'toast',
          itemId: 'syncToast',
          message: '在庫データを同期中...',
          align: 'br',
        },
      ],
      bbar: [
        '->',
        { itemId: 'btnDelete', text: '削除', iconCls: 'x-fa fa-trash', handler: 'onDeleteOrder' },
        { itemId: 'btnSave', text: '保存', ui: 'primary', iconCls: 'x-fa fa-floppy-disk', handler: 'onSaveOrder' },
      ],
    },
  ],
}
`

const mermaidSample = `# Mermaid.js 全図種カタログ (mermaid は独自拡張)
# YAML のブロックスカラー (value: |) が複数行の記法と相性が良い
xtype: panel
itemId: mermaidCatalog
title: Mermaid ダイアグラムカタログ
bodyPadding: 12
layout:
  type: grid
  columns: 2
  gap: 12
items:
  - title: フローチャート (graph)
    itemId: flowPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: flowChart
        value: |
          graph LR
            A[受注] --> B{在庫あり?}
            B -- はい --> C[出荷指示]
            B -- いいえ --> D[発注]
            D --> C
            C --> E[請求]
  - title: シーケンス図 (sequenceDiagram)
    itemId: seqPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: seqDiagram
        value: |
          sequenceDiagram
            営業->>システム: 受注登録
            システム->>上長: 承認依頼
            上長-->>システム: 承認
            システム-->>営業: 完了通知
  - title: クラス図 (classDiagram)
    itemId: classPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: classDiagram
        value: |
          classDiagram
            class Order {
              +String no
              +save()
            }
            Order <|-- RushOrder
            Order o-- OrderItem
  - title: 状態遷移図 (stateDiagram)
    itemId: statePanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: stateDiagram
        value: |
          stateDiagram-v2
            [*] --> 受注
            受注 --> 出荷済
            出荷済 --> 請求済
            請求済 --> [*]
  - title: ER 図 (erDiagram)
    itemId: erPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: erDiagram
        value: |
          erDiagram
            CUSTOMER ||--o{ ORDER : places
            ORDER ||--|{ ORDER_ITEM : contains
  - title: 円グラフ (pie)
    itemId: piePanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: pieChart
        value: |
          pie title 受注構成
            "製造" : 48
            "卸売" : 32
            "小売" : 28
  - title: ガントチャート (gantt)
    itemId: ganttPanel
    colspan: 2
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: ganttChart
        value: |
          gantt
            title 開発計画
            dateFormat YYYY-MM-DD
            section 設計
              画面設計: 2026-07-01, 5d
            section 実装
              フロントエンド: 2026-07-06, 7d
              結合テスト: 2026-07-13, 4d
  - title: ユーザージャーニー (journey)
    itemId: journeyPanel
    colspan: 2
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: journeyMap
        value: |
          journey
            title 問い合わせ体験
            section 受付
              フォーム入力: 3: 顧客
              自動返信: 4: システム
            section 対応
              回答: 5: サポート
  - title: Git グラフ (gitGraph)
    itemId: gitPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: gitGraph
        value: |
          gitGraph
            commit
            branch develop
            commit
            checkout main
            merge develop
  - title: マインドマップ (mindmap)
    itemId: mindmapPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: mindMap
        value: |
          mindmap
            root((uivolve))
              DSL
                JSON5
                YAML
              AI 連携
              MDX 埋め込み
  - title: タイムライン (timeline)
    itemId: timelinePanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: timeLine
        value: |
          timeline
            title リリース履歴
            2026-07-07 : POC 完成
            2026-07-08 : コンポーネント拡充
                       : Mermaid 対応
  - title: 4 象限チャート (quadrantChart)
    itemId: quadrantPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: quadrant
        value: |
          quadrantChart
            title 施策の優先度
            x-axis 低コスト --> 高コスト
            y-axis 低効果 --> 高効果
            quadrant-1 検討
            quadrant-2 すぐやる
            quadrant-3 保留
            quadrant-4 やらない
            施策A: [0.2, 0.8]
            施策B: [0.7, 0.6]
            施策C: [0.4, 0.3]
  - title: XY チャート (xychart)
    itemId: xyPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: xyChart
        value: |
          xychart-beta
            title "月次売上"
            x-axis ["4月", "5月", "6月"]
            y-axis "売上 (万円)" 0 --> 200
            bar [96, 134, 128]
            line [96, 134, 128]
  - title: サンキー図 (sankey) ※日本語ラベル非対応
    itemId: sankeyPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: sankey
        value: |
          sankey-beta
          Order,Ship,96
          Order,Cancel,8
          Ship,Invoice,96
  - title: ブロック図 (block)
    itemId: blockPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: blockDiagram
        value: |
          block-beta
            columns 3
            F["フロント"] A["API"] D[("DB")]
            F --> A
            A --> D
  - title: 要求図 (requirementDiagram)
    itemId: reqPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: reqDiagram
        value: |
          requirementDiagram
            requirement perf_req {
              id: 1
              text: "応答は1秒以内"
              risk: high
              verifymethod: test
            }
            element order_system {
              type: "system"
            }
            order_system - satisfies -> perf_req
  - title: C4 コンテキスト図 (C4Context)
    itemId: c4Panel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: c4Context
        value: |
          C4Context
            Person(user, "利用者")
            System(sys, "受注システム")
            SystemDb(db, "受注DB")
            Rel(user, sys, "使う")
            Rel(sys, db, "読み書き")
  - title: パケット図 (packet)
    itemId: packetPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: packetDiagram
        value: |
          packet-beta
            0-15: "送信元ポート"
            16-31: "宛先ポート"
            32-63: "シーケンス番号"
  - title: かんばん (kanban)
    itemId: kanbanPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: kanbanBoard
        value: |
          kanban
            todo[未着手]
              t1[仕様確認]
            doing[対応中]
              t2[画面実装]
            done[完了]
              t3[設計レビュー]
  - title: アーキテクチャ図 (architecture)
    itemId: archPanel
    bodyPadding: 8
    items:
      - xtype: mermaid
        itemId: archDiagram
        value: |
          architecture-beta
            group app(cloud)[App]
            service web(server)[Web] in app
            service db(database)[DB] in app
            web:R -- L:db
`

const graphSample = `// Git マージツリー (gitgraph) とネットワークグラフ (networkgraph) の例
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
`

const terminalSample = `// ターミナル (terminal) と動画 (video) の例
// terminal は lines を一定間隔 (±ランダム揺らぎ) で流し、末尾までいくと先頭へループ
{
  xtype: 'panel',
  itemId: 'deployMonitor',
  title: 'デプロイモニター',
  bodyPadding: 12,
  layout: { type: 'vbox', align: 'stretch' },
  items: [
    {
      xtype: 'terminal',
      itemId: 'deployLog',
      title: 'deploy — bash',
      height: 260,
      speed: 450,
      lines: [
        '$ git push origin main',
        'Enumerating objects: 12, done.',
        'To https://github.com/6in/uivolve.git',
        '$ GitHub Actions: Deploy Pages #42 開始',
        '> npm ci',
        'added 214 packages in 6s',
        '> npm run pages',
        'vite v6.0.3 building for production...',
        '⚠ WARN: chunk size が 500kB を超えています',
        '✓ built in 7.06s',
        '> actions/deploy-pages@v4',
        '✗ ERROR: flaky-network — retry 1/3',
        '✓ retry 成功',
        '✓ デプロイ完了: https://6in.github.io/uivolve/',
      ],
    },
    {
      xtype: 'panel',
      itemId: 'guidePanel',
      title: '操作ガイド動画',
      margin: '12 0 0 0',
      flex: 1,
      minHeight: 220,
      bodyPadding: 8,
      items: [
        {
          xtype: 'video',
          itemId: 'guideVideo',
          url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          height: 220,
          muted: true,
          loop: true,
        },
      ],
    },
  ],
}
`

const codeEditorSample = `# ソースコードエディタ (codeeditor) の例 — Monaco Editor
# language に Monaco の言語 ID、theme に light / dark を指定
xtype: tabpanel
itemId: codeTabs
height: 420
margin: 12
items:
  - title: TypeScript (dark)
    itemId: tsTab
    iconCls: x-fa fa-code
    layout: fit
    items:
      - xtype: codeeditor
        itemId: tsEditor
        language: typescript
        theme: dark
        minimap: true
        value: |
          export interface Order {
            no: string
            customer: string
            amount: number
          }

          export function total(orders: Order[]): number {
            return orders.reduce((sum, o) => sum + o.amount, 0)
          }
  - title: SQL (light)
    itemId: sqlTab
    iconCls: x-fa fa-database
    layout: fit
    items:
      - xtype: codeeditor
        itemId: sqlEditor
        language: sql
        theme: light
        value: |
          SELECT o.no, c.name, o.amount
          FROM orders o
          JOIN customers c ON c.id = o.customer_id
          WHERE o.status = '受注'
          ORDER BY o.amount DESC;
  - title: JSON (読み取り専用)
    itemId: jsonTab
    iconCls: x-fa fa-lock
    layout: fit
    items:
      - xtype: codeeditor
        itemId: jsonViewer
        language: json
        theme: light
        readOnly: true
        lineNumbers: false
        value: |
          {
            "name": "uivolve",
            "components": 38,
            "license": "MIT"
          }
  - title: 差分表示 (diff)
    itemId: diffTab
    iconCls: x-fa fa-code-compare
    layout: fit
    items:
      - xtype: diffeditor
        itemId: taxDiff
        language: typescript
        original: |
          export function total(orders: Order[]): number {
            return orders.reduce((sum, o) => sum + o.amount, 0)
          }
        value: |
          export function total(orders: Order[], taxRate = 0.1): number {
            const sub = orders.reduce((sum, o) => sum + o.amount, 0)
            return Math.round(sub * (1 + taxRate))
          }
`

const editableGridSample = `// セル部品つきグリッドの例
// 列の xtype: checkcolumn / actioncolumn / widgetcolumn、editor でセル内編集
{
  xtype: 'grid',
  itemId: 'taskGrid',
  title: 'タスク管理 (セル編集可)',
  margin: 12,
  columnLines: true,
  columns: [
    { xtype: 'checkcolumn', text: '完了', dataIndex: 'done', width: 60 },
    { text: 'タスク名', dataIndex: 'name', flex: 1, editor: true },
    { text: '工数 (h)', dataIndex: 'hours', width: 90, editor: { xtype: 'numberfield' } },
    { text: '期限', dataIndex: 'due', width: 140, editor: { xtype: 'datefield' } },
    {
      text: '担当',
      dataIndex: 'assignee',
      width: 110,
      editor: { xtype: 'combobox', options: ['佐藤', '田中', '鈴木'] },
    },
    { xtype: 'widgetcolumn', text: '進捗', dataIndex: 'progress', width: 120, widget: { xtype: 'progressbar' } },
    {
      xtype: 'actioncolumn',
      text: '操作',
      width: 80,
      items: [
        { iconCls: 'x-fa fa-pen', tooltip: '編集', handler: 'onEditTask' },
        { iconCls: 'x-fa fa-trash', tooltip: '削除', handler: 'onDeleteTask' },
      ],
    },
  ],
  store: {
    data: [
      { done: true, name: '画面設計', hours: 12, due: '2026-07-03', assignee: '佐藤', progress: 1 },
      { done: false, name: 'フロント実装', hours: 24, due: '2026-07-15', assignee: '田中', progress: 0.6 },
      { done: false, name: 'API 結合', hours: 16, due: '2026-07-18', assignee: '鈴木', progress: 0.25 },
      { done: false, name: '結合テスト', hours: 20, due: '2026-07-24', assignee: '佐藤', progress: 0 },
    ],
  },
}
`

const faSample = `// Font Awesome アイコンのカタログ
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
`

const masterMaintSample = `// 業務画面: マスタメンテナンス (CRUD 定番)
// 検索条件 + 一覧グリッド + 編集ダイアログ (modal: true の window) の 3 点セット。
// 全部品に itemId、ボタンに handler 名を宣言しておくと AI への実装引き渡しがスムーズ。
// modal window / toast はツリーのどこに書いても画面全体へオーバーレイ表示される
{
  xtype: 'panel',
  itemId: 'productMasterScreen',
  title: '商品マスタ管理',
  layout: 'border',
  items: [
    {
      region: 'north',
      xtype: 'form',
      itemId: 'searchForm',
      title: '検索条件',
      bodyPadding: '12 12 4',
      layout: 'column',
      items: [
        { xtype: 'textfield', itemId: 'searchCode', fieldLabel: '商品コード', labelWidth: 80, columnWidth: 0.25, margin: '0 12 8 0' },
        { xtype: 'textfield', itemId: 'searchName', fieldLabel: '商品名', labelWidth: 60, columnWidth: 0.3, margin: '0 12 8 0' },
        {
          xtype: 'combobox',
          itemId: 'searchCategory',
          fieldLabel: 'カテゴリ',
          labelWidth: 70,
          columnWidth: 0.22,
          margin: '0 12 8 0',
          options: ['すべて', '文具', 'オフィス家具', 'OA 機器'],
          value: 'すべて',
        },
        {
          xtype: 'checkbox',
          itemId: 'searchActiveOnly',
          boxLabel: '公開中のみ',
          columnWidth: 0.15,
          checked: true,
        },
      ],
      bbar: [
        '->',
        { itemId: 'btnClear', text: 'クリア', iconCls: 'x-fa fa-eraser', handler: 'onClearSearch' },
        { itemId: 'btnSearch', text: '検索', ui: 'primary', iconCls: 'x-fa fa-magnifying-glass', handler: 'onSearch' },
      ],
    },
    {
      region: 'center',
      xtype: 'grid',
      itemId: 'productGrid',
      title: '商品一覧',
      columnLines: true,
      tbar: [
        { itemId: 'btnAdd', text: '新規登録', ui: 'primary', iconCls: 'x-fa fa-plus', handler: 'onAddProduct' },
        { itemId: 'btnExport', text: 'CSV 出力', iconCls: 'x-fa fa-file-csv', handler: 'onExportCsv' },
      ],
      columns: [
        { text: '商品コード', dataIndex: 'code', width: 110 },
        { text: '商品名', dataIndex: 'name', flex: 1 },
        { text: 'カテゴリ', dataIndex: 'category', width: 120 },
        { text: '単価', dataIndex: 'price', width: 90, align: 'right' },
        { text: '在庫数', dataIndex: 'stock', width: 80, align: 'right' },
        { xtype: 'checkcolumn', text: '公開', dataIndex: 'active', width: 70 },
        { text: '更新日', dataIndex: 'updated', width: 110 },
        {
          xtype: 'actioncolumn',
          text: '操作',
          width: 80,
          items: [
            { iconCls: 'x-fa fa-pen', tooltip: '編集', handler: 'onEditProduct' },
            { iconCls: 'x-fa fa-trash', tooltip: '削除', handler: 'onDeleteProduct' },
          ],
        },
      ],
      store: {
        data: [
          { code: 'PRD-0001', name: 'クリアファイル A4 (10 枚入)', category: '文具', price: 380, stock: 1240, active: true, updated: '2026-07-01' },
          { code: 'PRD-0002', name: 'ゲルインクボールペン 0.5mm 黒', category: '文具', price: 150, stock: 3200, active: true, updated: '2026-07-03' },
          { code: 'PRD-0003', name: 'オフィスチェア ハイバック', category: 'オフィス家具', price: 24800, stock: 36, active: true, updated: '2026-06-28' },
          { code: 'PRD-0004', name: '昇降デスク 120cm', category: 'オフィス家具', price: 49800, stock: 12, active: false, updated: '2026-06-15' },
          { code: 'PRD-0005', name: 'モバイルモニター 15.6 インチ', category: 'OA 機器', price: 21800, stock: 58, active: true, updated: '2026-07-05' },
          { code: 'PRD-0006', name: 'USB ドッキングステーション', category: 'OA 機器', price: 12800, stock: 0, active: false, updated: '2026-07-08' },
        ],
      },
      bbar: {
        xtype: 'pagingtoolbar',
        itemId: 'productPaging',
        pageSize: 20,
        total: 246,
        displayInfo: true,
      },
    },
    // ---- 編集ダイアログ (行の編集アイコンで開く想定。modal なのでどこに書いても中央表示) ----
    {
      xtype: 'window',
      itemId: 'productEditWindow',
      title: '商品編集 — PRD-0003',
      modal: true,
      width: 480,
      bodyPadding: 16,
      items: [
        { xtype: 'textfield', itemId: 'editCode', fieldLabel: '商品コード', labelWidth: 90, value: 'PRD-0003', readOnly: true },
        { xtype: 'textfield', itemId: 'editName', fieldLabel: '商品名', labelWidth: 90, value: 'オフィスチェア ハイバック', allowBlank: false },
        {
          xtype: 'combobox',
          itemId: 'editCategory',
          fieldLabel: 'カテゴリ',
          labelWidth: 90,
          options: ['文具', 'オフィス家具', 'OA 機器'],
          value: 'オフィス家具',
        },
        { xtype: 'numberfield', itemId: 'editPrice', fieldLabel: '単価', labelWidth: 90, value: 24800 },
        { xtype: 'numberfield', itemId: 'editStock', fieldLabel: '在庫数', labelWidth: 90, value: 36 },
        { xtype: 'checkbox', itemId: 'editActive', fieldLabel: '', labelWidth: 90, boxLabel: '公開する', checked: true },
        { xtype: 'textareafield', itemId: 'editNote', fieldLabel: '備考', labelWidth: 90, height: 60 },
      ],
      bbar: [
        '->',
        { itemId: 'btnEditCancel', text: 'キャンセル', handler: 'onCancelEdit' },
        { itemId: 'btnEditSave', text: '保存', ui: 'primary', iconCls: 'x-fa fa-floppy-disk', handler: 'onSaveProduct' },
      ],
    },
    // 保存完了の通知例 (× で消せる)
    {
      xtype: 'toast',
      itemId: 'savedToast',
      title: '保存完了',
      html: '商品 <b>PRD-0003</b> を更新しました',
      iconCls: 'x-fa fa-circle-check',
      align: 'tr',
    },
  ],
}
`

const approvalSample = `# 業務画面: 承認ワークフロー (経費・稟議)
# 承認待ち一覧 + 申請内容 + 承認ルート (mermaid) + 承認履歴 + 承認アクション。
# mermaid の複数行定義は YAML のブロックスカラー (value: |) が書きやすい
xtype: panel
itemId: approvalScreen
title: 承認ワークフロー — 経費・稟議
layout: border
items:
  - region: west
    xtype: grid
    itemId: pendingGrid
    title: 承認待ち (5 件)
    width: 380
    split: true
    columns:
      - { text: 申請番号, dataIndex: reqNo, width: 90 }
      - { text: 種別, dataIndex: reqType, width: 90 }
      - { text: 申請者, dataIndex: applicant, flex: 1 }
      - { text: 金額, dataIndex: amount, width: 90, align: right }
    store:
      data:
        - { reqNo: EXP-0012, reqType: 交通費, applicant: 佐藤 花子, amount: "48,200" }
        - { reqNo: EXP-0013, reqType: 接待費, applicant: 鈴木 次郎, amount: "32,000" }
        - { reqNo: PUR-0088, reqType: 備品購入, applicant: 高橋 三郎, amount: "128,000" }
        - { reqNo: EXP-0014, reqType: 出張旅費, applicant: 伊藤 四郎, amount: "86,500" }
        - { reqNo: CTR-0031, reqType: 契約稟議, applicant: 渡辺 五子, amount: "1,200,000" }
    listeners:
      select: onSelectRequest
  - region: center
    xtype: panel
    itemId: requestDetail
    title: 申請内容 — EXP-0012 (交通費)
    bodyPadding: 12
    layout:
      type: vbox
      align: stretch
    items:
      - xtype: form
        itemId: requestForm
        layout: column
        items:
          - { xtype: displayfield, itemId: fldNo, fieldLabel: 申請番号, value: EXP-0012, labelWidth: 80, columnWidth: 0.5 }
          - { xtype: displayfield, itemId: fldApplicant, fieldLabel: 申請者, value: 佐藤 花子 (営業部), labelWidth: 80, columnWidth: 0.5 }
          - { xtype: displayfield, itemId: fldAmount, fieldLabel: 金額, value: "¥48,200", labelWidth: 80, columnWidth: 0.5 }
          - { xtype: displayfield, itemId: fldDate, fieldLabel: 発生日, value: 2026-07-08, labelWidth: 80, columnWidth: 0.5 }
          - { xtype: displayfield, itemId: fldStatus, fieldLabel: ステータス, value: 部長承認待ち, labelWidth: 80, columnWidth: 1 }
          - xtype: textareafield
            itemId: fldReason
            fieldLabel: 事由
            labelWidth: 80
            columnWidth: 1
            height: 52
            readOnly: true
            value: 大阪出張 (○○商事 定例訪問) の新幹線往復。7/8 日帰り。
      - xtype: panel
        itemId: routePanel
        title: 承認ルート
        bodyPadding: 8
        margin: "8 0"
        items:
          - xtype: mermaid
            itemId: routeChart
            value: |
              graph LR
                a["申請<br>佐藤 花子<br>07/08 ✓"] --> b["課長承認<br>田中 一郎<br>07/08 ✓"]
                b --> c["部長承認<br>山本 部長<br>処理待ち"]
                c --> d[経理確認] --> e((完了))
                style c fill:#fff3cd,stroke:#e0a800,stroke-width:2px
      - xtype: grid
        itemId: historyGrid
        title: 承認履歴
        flex: 1
        minHeight: 120
        columns:
          - { text: 日時, dataIndex: ts, width: 130 }
          - { text: ステップ, dataIndex: step, width: 90 }
          - { text: 担当者, dataIndex: person, width: 100 }
          - { text: アクション, dataIndex: action, width: 90 }
          - { text: コメント, dataIndex: comment, flex: 1 }
        store:
          data:
            - { ts: "2026-07-08 09:12", step: 申請, person: 佐藤 花子, action: 申請, comment: 7 月分 大阪出張の旅費精算です }
            - { ts: "2026-07-08 14:30", step: 課長承認, person: 田中 一郎, action: 承認 ✓, comment: 問題ありません }
            - { ts: "—", step: 部長承認, person: 山本 部長, action: 処理待ち, comment: "" }
    bbar:
      - xtype: textfield
        itemId: commentField
        emptyText: 承認コメントを入力...
        flex: 1
      - { itemId: btnSendBack, text: 差戻し, iconCls: x-fa fa-rotate-left, handler: onSendBack }
      - { itemId: btnReject, text: 却下, iconCls: x-fa fa-ban, handler: onReject }
      - { itemId: btnApprove, text: 承認, ui: primary, iconCls: x-fa fa-check, handler: onApprove }
  # 直前に処理した申請の通知例 (× で消せる)
  - xtype: toast
    itemId: approvedToast
    title: 承認しました
    html: "申請 <b>EXP-0011</b> を承認しました (次のステップ: 経理確認)"
    iconCls: x-fa fa-circle-check
    align: tr
`

export const samples: Sample[] = [
  // ---- 基本 (レイアウト・記法) ----
  { category: '基本', name: 'Border レイアウト', code: borderSample },
  { category: '基本', name: 'YAML 記法', code: yamlSample },
  { category: '基本', name: 'フォーム', code: formSample },
  { category: '基本', name: 'Grid レイアウト', code: gridLayoutSample },
  { category: '基本', name: 'Fit + Box レイアウト', code: fitSample },
  { category: '基本', name: 'タブ + アコーディオン + ツリー', code: tabAccordionSample },
  { category: '基本', name: 'ウィンドウ (ダイアログ)', code: windowSample },
  // ---- 業務画面 ----
  { category: '業務画面', name: 'マスタメンテ (CRUD)', code: masterMaintSample },
  { category: '業務画面', name: '承認ワークフロー (YAML)', code: approvalSample },
  { category: '業務画面', name: '問い合わせ管理 (ツリーグリッド)', code: supportSample },
  { category: '業務画面', name: 'チャットボット', code: chatSample },
  // ---- コンポーネントカタログ ----
  { category: 'コンポーネントカタログ', name: '小物カタログ (column)', code: miscSample },
  { category: 'コンポーネントカタログ', name: 'ダイアログとトースト', code: dialogSample },
  { category: 'コンポーネントカタログ', name: 'Mermaid ダイアグラム (YAML)', code: mermaidSample },
  { category: 'コンポーネントカタログ', name: 'グラフ表示 (Git / ネットワーク)', code: graphSample },
  { category: 'コンポーネントカタログ', name: 'ターミナルと動画', code: terminalSample },
  { category: 'コンポーネントカタログ', name: 'コードエディタ (YAML)', code: codeEditorSample },
  { category: 'コンポーネントカタログ', name: '編集グリッド (セル部品)', code: editableGridSample },
  { category: 'コンポーネントカタログ', name: 'Font Awesome アイコン', code: faSample },
]
