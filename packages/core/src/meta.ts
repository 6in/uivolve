/**
 * xtype / layout のメタデータ。
 * エディタ補完 (スニペット・プロパティ候補)、JSON Schema 生成 (scripts/gen-dsl-schema.mjs)
 * の単一ソース。React に依存しない純粋なデータのみを置くこと
 * (schema 生成スクリプトが Node の --experimental-strip-types で直接 import する)。
 */

export interface XtypeMeta {
  /** 補完リストに表示する説明 */
  description: string
  /** この xtype の別名 (ExtJS 互換) */
  aliases?: string[]
  /** スニペットとして展開する基本プロパティ (値がプレースホルダー初期値になる) */
  defaults?: Record<string, unknown>
  /** 補完候補にする、この xtype 固有の config 名 */
  props?: string[]
}

/** 全コンポーネント共通の config */
export const COMMON_PROPS: string[] = [
  'xtype',
  'listeners',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'flex',
  'margin',
  'padding',
  'hidden',
  'disabled',
  'cls',
  'style',
  'iconCls',
  'id',
  'itemId',
  'region',
  'split',
  'colspan',
  'rowspan',
  'columnWidth',
]

/** コンテナ系で使える config */
export const CONTAINER_PROPS: string[] = [
  'layout',
  'items',
  'defaults',
  'tbar',
  'bbar',
  'bodyPadding',
  'html',
]

/** フィールド系で使える config */
export const FIELD_PROPS: string[] = ['fieldLabel', 'labelWidth', 'name', 'value', 'readOnly']

export const XTYPE_META: Record<string, XtypeMeta> = {
  panel: {
    description: 'タイトルバー付きの基本パネル (折りたたみ・ツールバー対応)',
    aliases: ['form'],
    defaults: { title: 'タイトル', bodyPadding: 12, items: [] },
    props: [...CONTAINER_PROPS, 'title', 'collapsible', 'collapsed', 'frame', 'header'],
  },
  container: {
    description: 'ヘッダーなしの汎用コンテナ',
    aliases: ['fieldcontainer'],
    defaults: { layout: 'vbox', items: [] },
    props: [...CONTAINER_PROPS],
  },
  component: {
    description: 'html / text をそのまま描画',
    aliases: ['box'],
    defaults: { html: 'テキスト' },
    props: ['html', 'text'],
  },
  toolbar: {
    description: 'ツールバー (ショートハンド: \'->\' 右寄せ / \'-\' 区切り)',
    defaults: { items: [{ text: 'ボタン' }] },
    props: ['items'],
  },
  button: {
    description: 'ボタン (menu 指定でドロップダウン)',
    defaults: { text: 'ボタン' },
    props: ['text', 'ui', 'menu', 'iconCls', 'handler'],
  },
  splitbutton: {
    description: '本体と矢印が分かれたボタン',
    defaults: { text: 'ボタン', menu: [{ text: '項目 1' }] },
    props: ['text', 'ui', 'menu', 'iconCls', 'handler'],
  },
  textfield: {
    description: '1 行テキスト入力',
    aliases: ['numberfield', 'datefield'],
    defaults: { fieldLabel: 'ラベル', emptyText: '' },
    props: [...FIELD_PROPS, 'emptyText', 'inputType'],
  },
  textarea: {
    description: '複数行テキスト入力',
    aliases: ['textareafield'],
    defaults: { fieldLabel: 'ラベル', rows: 4 },
    props: [...FIELD_PROPS, 'emptyText', 'rows'],
  },
  checkbox: {
    description: 'チェックボックス',
    aliases: ['checkboxfield'],
    defaults: { fieldLabel: '', boxLabel: 'ラベル', checked: false },
    props: [...FIELD_PROPS, 'boxLabel', 'checked'],
  },
  radio: {
    description: 'ラジオボタン (name でグループ化)',
    aliases: ['radiofield'],
    defaults: { fieldLabel: '', boxLabel: 'ラベル', name: 'group1' },
    props: [...FIELD_PROPS, 'boxLabel', 'checked'],
  },
  combobox: {
    description: 'ドロップダウン選択',
    aliases: ['combo'],
    defaults: { fieldLabel: 'ラベル', options: ['選択肢 1', '選択肢 2'] },
    props: [...FIELD_PROPS, 'options', 'store', 'displayField', 'valueField', 'emptyText'],
  },
  listbox: {
    description: 'リストボックス (multiSelect で複数選択)',
    aliases: ['multiselect'],
    defaults: { fieldLabel: 'ラベル', size: 5, options: ['選択肢 1', '選択肢 2'] },
    props: [...FIELD_PROPS, 'options', 'store', 'size', 'multiSelect'],
  },
  displayfield: {
    description: '静的テキスト表示',
    aliases: ['label'],
    defaults: { fieldLabel: 'ラベル', value: '値' },
    props: [...FIELD_PROPS, 'text', 'html'],
  },
  grid: {
    description: 'データグリッド (columns + store)',
    aliases: ['gridpanel'],
    defaults: {
      title: '一覧',
      columnLines: true,
      columns: [
        { text: 'ID', dataIndex: 'id', width: 80 },
        { text: '名称', dataIndex: 'name', flex: 1 },
        { text: '数量', dataIndex: 'qty', width: 90, align: 'right' },
        { text: '状態', dataIndex: 'status', width: 100 },
      ],
      store: {
        data: [
          { id: 1, name: 'サンプル A', qty: 10, status: '有効' },
          { id: 2, name: 'サンプル B', qty: 5, status: '無効' },
          { id: 3, name: 'サンプル C', qty: 8, status: '有効' },
        ],
      },
    },
    props: ['title', 'columns', 'store', 'data', 'columnLines', 'tbar', 'bbar'],
  },
  image: {
    description: '画像 (src 省略でプレースホルダ)',
    aliases: ['imagecomponent'],
    defaults: { alt: '画像', width: 120, height: 90 },
    props: ['src', 'alt'],
  },
  tabpanel: {
    description: 'タブ切替パネル',
    defaults: { activeTab: 0, items: [{ title: 'タブ 1', bodyPadding: 12, items: [] }] },
    props: ['activeTab', 'items', 'title', 'bodyPadding'],
  },
  fieldset: {
    description: 'フォームのグループ枠 (legend 付き)',
    defaults: { title: 'グループ', items: [] },
    props: [...CONTAINER_PROPS, 'title', 'collapsible', 'collapsed', 'checkboxToggle'],
  },
  window: {
    description: 'ダイアログ (ルート配置でモーダル風)',
    defaults: {
      title: 'ダイアログ',
      width: 400,
      bodyPadding: 14,
      items: [],
      bbar: ['->', { text: 'OK', ui: 'primary' }, { text: 'キャンセル' }],
    },
    props: [...CONTAINER_PROPS, 'title', 'closable'],
  },
  treepanel: {
    description: '階層ツリー (root.children)。columns 指定でツリーグリッド',
    aliases: ['tree'],
    defaults: {
      title: 'ツリー',
      root: { children: [{ text: 'フォルダ', expanded: true, children: [{ text: 'ノード', leaf: true }] }] },
    },
    props: ['title', 'root', 'rootVisible', 'children', 'columns', 'columnLines'],
  },
  menu: {
    description: 'メニューリスト',
    defaults: { items: [{ text: '項目 1' }, '-', { text: '項目 2' }] },
    props: ['items', 'handler'],
  },
  progressbar: {
    description: '進捗バー (value 0〜1)',
    aliases: ['progress'],
    defaults: { value: 0.5 },
    props: ['value', 'text'],
  },
  slider: {
    description: 'スライダー',
    aliases: ['sliderfield'],
    defaults: { fieldLabel: 'ラベル', value: 50, minValue: 0, maxValue: 100 },
    props: [...FIELD_PROPS, 'minValue', 'maxValue', 'increment'],
  },
  radiogroup: {
    description: 'ラジオボタンのグループ (columns 列)',
    defaults: {
      fieldLabel: 'ラベル',
      columns: 2,
      items: [
        { boxLabel: 'A', name: 'group1', checked: true },
        { boxLabel: 'B', name: 'group1' },
      ],
    },
    props: ['fieldLabel', 'labelWidth', 'columns', 'items'],
  },
  checkboxgroup: {
    description: 'チェックボックスのグループ (columns 列)',
    defaults: {
      fieldLabel: 'ラベル',
      columns: 2,
      items: [{ boxLabel: 'A', checked: true }, { boxLabel: 'B' }],
    },
    props: ['fieldLabel', 'labelWidth', 'columns', 'items'],
  },
  datepicker: {
    description: 'インラインカレンダー',
    defaults: { value: '2026-01-01' },
    props: ['value', 'showToday', 'todayText'],
  },
  htmleditor: {
    description: 'リッチテキストエディタ (書式ツールバー + 編集領域)',
    defaults: { fieldLabel: 'ラベル', value: '<p>テキストを入力</p>', height: 160 },
    props: [
      ...FIELD_PROPS,
      'enableFormat',
      'enableAlignments',
      'enableLists',
      'enableLinks',
      'enableSourceEdit',
    ],
  },
  uxiframe: {
    description: 'インラインフレーム (src の URL を埋め込み)',
    aliases: ['iframe'],
    defaults: { src: 'https://example.com', height: 200 },
    props: ['src', 'title'],
  },
  markdown: {
    description: 'Markdown 描画 (独自拡張。value に Markdown テキスト)',
    defaults: { value: '### 見出し' },
    props: ['value'],
  },
  pagingtoolbar: {
    description: 'ページングツールバー (グリッドの bbar 向け。total / pageSize)',
    defaults: { displayInfo: true, pageSize: 25, total: 200 },
    props: [
      'pageSize',
      'total',
      'displayInfo',
      'displayMsg',
      'emptyMsg',
      'beforePageText',
      'afterPageText',
    ],
  },
}

export interface LayoutMeta {
  description: string
  aliases?: string[]
  /** layout をオブジェクト形式で書くときの config 名 */
  options?: string[]
}

export const LAYOUT_META: Record<string, LayoutMeta> = {
  auto: { description: '縦フロー (デフォルト)', aliases: ['anchor', 'form'] },
  fit: { description: '最初の子をコンテナ全面に拡大' },
  border: {
    description: 'north/south/east/west/center の 5 領域 (region / split)',
  },
  grid: {
    description: 'CSS Grid (独自拡張)。columns / gap、子の colspan / rowspan',
    aliases: ['table'],
    options: ['columns', 'gap'],
  },
  hbox: { description: '水平 Flexbox (align / pack / flex)', options: ['align', 'pack'] },
  vbox: { description: '垂直 Flexbox (align / pack / flex)', options: ['align', 'pack'] },
  card: { description: 'activeItem の 1 枚だけ表示', options: ['activeItem'] },
  accordion: { description: '縦積みで 1 つだけ展開' },
  center: { description: '単一の子を中央配置' },
  column: { description: 'columnWidth (割合) の横並び・折り返し' },
  absolute: { description: '子の x / y による絶対位置指定' },
}

/** 別名も含めた全 xtype 名 → 正準メタの解決マップを作る */
export function getXtypeMeta(xtype: string): XtypeMeta | undefined {
  if (XTYPE_META[xtype]) return XTYPE_META[xtype]
  for (const meta of Object.values(XTYPE_META)) {
    if (meta.aliases?.includes(xtype)) return meta
  }
  return undefined
}

/** 別名も含めた全 xtype 名の一覧 */
export function allXtypeNames(): string[] {
  return Object.entries(XTYPE_META).flatMap(([name, meta]) => [name, ...(meta.aliases ?? [])])
}

/** 別名も含めた全 layout type 名の一覧 */
export function allLayoutNames(): string[] {
  return Object.entries(LAYOUT_META).flatMap(([name, meta]) => [name, ...(meta.aliases ?? [])])
}
