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
            { itemId: 'btnNew', text: '新規作成', ui: 'primary', iconCls: 'x-fa fa-plus' },
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
      title: '月次推移',
      colspan: 2,
      height: 180,
      items: [
        { xtype: 'image', itemId: 'trendChart', alt: 'グラフ領域', height: 130, style: { width: '100%' } },
      ],
    },
    {
      itemId: 'noticePanel',
      title: 'お知らせ',
      height: 180,
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
]
