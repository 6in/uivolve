export interface Sample {
  name: string
  code: string
}

const borderSample = `// Border レイアウトのダッシュボード例
{
  xtype: 'panel',
  title: '受注管理システム',
  layout: 'border',
  items: [
    {
      region: 'north',
      xtype: 'container',
      items: [
        {
          xtype: 'toolbar',
          items: [
            { text: '新規作成', ui: 'primary', iconCls: 'x-fa fa-plus' },
            { text: '編集', iconCls: 'x-fa fa-pen' },
            '-',
            { text: '削除', iconCls: 'x-fa fa-trash' },
            '->',
            '検索:',
            { xtype: 'textfield', emptyText: 'キーワード', width: 200 },
          ],
        },
      ],
    },
    {
      region: 'west',
      title: 'メニュー',
      width: 200,
      split: true,
      collapsible: true,
      bodyPadding: 8,
      items: [
        {
          xtype: 'listbox',
          size: 8,
          options: ['受注一覧', '出荷指示', '請求管理', '顧客マスタ', '商品マスタ'],
        },
      ],
    },
    {
      region: 'center',
      xtype: 'grid',
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
      items: [{ xtype: 'toolbar', items: ['ステータス: 準備完了', '->', '4 件'] }],
    },
  ],
}
`

const formSample = `// フォームの例 (折りたたみパネル付き)
{
  xtype: 'panel',
  title: 'ユーザー登録',
  width: 560,
  margin: 16,
  bodyPadding: 12,
  tbar: [{ text: '保存', ui: 'primary' }, { text: 'キャンセル' }],
  items: [
    {
      xtype: 'form',
      title: '基本情報',
      items: [
        { xtype: 'textfield', fieldLabel: '氏名', emptyText: '山田 太郎' },
        { xtype: 'textfield', fieldLabel: 'メール', value: 'taro@example.com' },
        { xtype: 'datefield', fieldLabel: '生年月日' },
        {
          xtype: 'combobox',
          fieldLabel: '部署',
          options: ['営業部', '開発部', '総務部'],
        },
        { xtype: 'radio', fieldLabel: '性別', boxLabel: '男性', name: 'gender', checked: true },
        { xtype: 'radio', fieldLabel: '', boxLabel: '女性', name: 'gender' },
        { xtype: 'checkbox', fieldLabel: '通知', boxLabel: 'メールマガジンを受け取る' },
        { xtype: 'textarea', fieldLabel: '備考', emptyText: '自由記入欄', rows: 3 },
      ],
    },
    {
      xtype: 'form',
      title: '詳細設定',
      collapsible: true,
      collapsed: true,
      margin: '8 0 0 0',
      items: [
        { xtype: 'listbox', fieldLabel: '権限', multiSelect: true, options: ['閲覧', '編集', '承認', '管理'] },
        { xtype: 'displayfield', fieldLabel: '登録日', value: '2026-07-07' },
      ],
    },
  ],
}
`

const gridLayoutSample = `// Grid レイアウトの例 (3 カラム / colspan 対応)
{
  xtype: 'panel',
  title: 'ダッシュボード',
  bodyPadding: 12,
  layout: { type: 'grid', columns: 3, gap: 12 },
  items: [
    { title: '売上', html: '<b style="font-size:24px">¥1,234,000</b><br>前月比 +12%' },
    { title: '新規顧客', html: '<b style="font-size:24px">38 社</b><br>前月比 +4%' },
    { title: '未処理タスク', html: '<b style="font-size:24px">7 件</b><br>要対応' },
    {
      title: '月次推移',
      colspan: 2,
      height: 180,
      items: [{ xtype: 'image', alt: 'グラフ領域', height: 130, style: { width: '100%' } }],
    },
    {
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
  title: 'メール作成',
  layout: 'fit',
  items: [
    {
      xtype: 'container',
      padding: 12,
      layout: { type: 'vbox', align: 'stretch' },
      items: [
        { xtype: 'textfield', fieldLabel: '宛先', emptyText: 'to@example.com' },
        { xtype: 'textfield', fieldLabel: '件名' },
        { xtype: 'textarea', fieldLabel: '本文', flex: 1 },
        {
          xtype: 'container',
          layout: { type: 'hbox', pack: 'end' },
          items: [
            { xtype: 'button', text: '下書き保存' },
            { xtype: 'button', text: '送信', ui: 'primary' },
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
  title: '顧客管理コンソール',
  layout: 'border',
  items: [
    {
      region: 'west',
      xtype: 'container',
      width: 220,
      split: true,
      layout: 'accordion',
      items: [
        {
          title: 'フォルダ',
          xtype: 'treepanel',
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
        { title: '検索', bodyPadding: 8, items: [
          { xtype: 'textfield', emptyText: 'キーワード' },
          { xtype: 'button', text: '検索' },
        ]},
        { title: '設定', bodyPadding: 8, html: '各種設定がここに入ります' },
      ],
    },
    {
      region: 'center',
      xtype: 'tabpanel',
      activeTab: 0,
      items: [
        {
          title: '一覧',
          iconCls: 'x-fa fa-table',
          xtype: 'grid',
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
          title: '詳細',
          iconCls: 'x-fa fa-user',
          xtype: 'form',
          bodyPadding: 12,
          items: [
            { xtype: 'textfield', fieldLabel: '顧客名', value: '山田商事' },
            { xtype: 'combobox', fieldLabel: 'ランク', options: ['A', 'B', 'C'] },
            { xtype: 'textarea', fieldLabel: 'メモ', rows: 4 },
          ],
        },
        { title: '履歴', iconCls: 'x-fa fa-clock', closable: true, bodyPadding: 12, html: '取引履歴タブ' },
      ],
    },
  ],
}
`

const windowSample = `// ウィンドウ (ダイアログ) の例 — ルートに置くとモーダル風に中央表示
{
  xtype: 'window',
  title: 'ログイン',
  width: 380,
  closable: true,
  bodyPadding: 16,
  items: [
    { xtype: 'textfield', fieldLabel: 'ユーザーID', labelWidth: 90 },
    { xtype: 'textfield', fieldLabel: 'パスワード', labelWidth: 90, inputType: 'password' },
    { xtype: 'checkbox', fieldLabel: '', labelWidth: 90, boxLabel: 'ログイン状態を保持' },
  ],
  bbar: ['->', { text: 'ログイン', ui: 'primary' }, { text: 'キャンセル' }],
}
`

const miscSample = `// 小物コンポーネント + column レイアウトの例
{
  xtype: 'panel',
  title: 'コンポーネントカタログ',
  bodyPadding: 8,
  layout: 'column',
  items: [
    {
      columnWidth: 0.5,
      xtype: 'fieldset',
      title: '通知設定',
      collapsible: true,
      items: [
        {
          xtype: 'radiogroup',
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
          fieldLabel: 'チャネル',
          columns: 2,
          items: [
            { boxLabel: 'メール', checked: true },
            { boxLabel: 'Slack' },
            { boxLabel: 'SMS' },
            { boxLabel: 'アプリ内' },
          ],
        },
        { xtype: 'slider', fieldLabel: '音量', value: 60 },
      ],
    },
    {
      columnWidth: 0.5,
      xtype: 'fieldset',
      title: 'ステータス',
      items: [
        { xtype: 'displayfield', fieldLabel: '同期状況', value: '最終同期 2026-07-07 12:00' },
        { xtype: 'progressbar', value: 0.7, text: '同期中... 70%' },
        {
          xtype: 'toolbar',
          margin: '8 0 0 0',
          items: [
            {
              text: '操作',
              iconCls: 'x-fa fa-bolt',
              menu: [
                { text: '再同期', iconCls: 'x-fa fa-rotate' },
                { text: 'エクスポート', iconCls: 'x-fa fa-file-export' },
                '-',
                { text: '設定', iconCls: 'x-fa fa-gear', menu: [] },
              ],
            },
            { xtype: 'splitbutton', text: '保存', iconCls: 'x-fa fa-floppy-disk', menu: [{ text: '名前を付けて保存' }, { text: 'テンプレート保存' }] },
          ],
        },
      ],
    },
    {
      columnWidth: 0.5,
      xtype: 'fieldset',
      title: 'カレンダー (datepicker)',
      items: [{ xtype: 'datepicker', value: '2026-07-07' }],
    },
    {
      columnWidth: 0.5,
      xtype: 'panel',
      title: 'center レイアウト',
      height: 240,
      layout: 'center',
      margin: '4 0 0 0',
      items: [{ xtype: 'button', text: '中央配置されたボタン', ui: 'primary' }],
    },
  ],
}
`

export const samples: Sample[] = [
  { name: 'Border レイアウト', code: borderSample },
  { name: 'フォーム', code: formSample },
  { name: 'Grid レイアウト', code: gridLayoutSample },
  { name: 'Fit + Box レイアウト', code: fitSample },
  { name: 'タブ + アコーディオン + ツリー', code: tabAccordionSample },
  { name: 'ウィンドウ (ダイアログ)', code: windowSample },
  { name: '小物カタログ (column)', code: miscSample },
]
