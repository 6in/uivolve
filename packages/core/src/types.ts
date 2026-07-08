import type * as React from 'react'

/** Border レイアウトの region 値 */
export type Region = 'north' | 'south' | 'east' | 'west' | 'center'

/** layout: 'border' または layout: { type: 'grid', columns: 3 } の両形式に対応 */
export interface LayoutConfig {
  type: string
  /** grid レイアウトの列数 */
  columns?: number
  /** hbox/vbox の交差軸の揃え */
  align?: string
  /** hbox/vbox の主軸方向の詰め方 */
  pack?: string
  [key: string]: unknown
}

/** グリッド(データグリッド)の列定義 */
export interface ColumnConfig {
  /**
   * 列の種別 (ExtJS 互換):
   * 'treecolumn' (ツリーグリッドの階層列) / 'checkcolumn' (チェックボックス) /
   * 'actioncolumn' (アイコンボタン。items で複数) / 'widgetcolumn' (widget を埋め込み)
   */
  xtype?: string
  text?: string
  dataIndex?: string
  width?: number | string
  flex?: number
  align?: 'left' | 'center' | 'right'
  /** actioncolumn のアイコンボタン定義 */
  items?: Array<{ iconCls?: string; tooltip?: string; handler?: string }>
  /** widgetcolumn に埋め込むコンポーネント (value には dataIndex の値が入る) */
  widget?: ComponentConfig
  /** セル編集。true = textfield、または { xtype: 'numberfield' } / combobox など */
  editor?: boolean | ComponentConfig
}

/**
 * ExtJS 互換のコンポーネント定義。
 * ExtJS の config オブジェクトのサブセット + 未知のキーは保持する。
 */
export interface ComponentConfig {
  xtype?: string
  id?: string
  itemId?: string

  // ---- コンテナ ----
  layout?: string | LayoutConfig
  items?: Array<ComponentConfig | string>
  defaults?: Partial<ComponentConfig>
  region?: Region
  /** border レイアウトのリサイズ用スプリッター(モックでは線のみ表現) */
  split?: boolean

  // ---- パネル ----
  title?: string
  collapsible?: boolean
  collapsed?: boolean
  header?: boolean
  frame?: boolean
  bodyPadding?: number | string
  html?: string
  tbar?: Array<ComponentConfig | string> | ComponentConfig
  bbar?: Array<ComponentConfig | string> | ComponentConfig

  // ---- サイズ・余白 ----
  width?: number | string
  height?: number | string
  minWidth?: number
  minHeight?: number
  flex?: number
  margin?: number | string
  padding?: number | string

  // ---- 状態 ----
  hidden?: boolean
  disabled?: boolean
  readOnly?: boolean

  // ---- フィールド共通 ----
  fieldLabel?: string
  labelWidth?: number
  name?: string
  value?: unknown
  emptyText?: string
  boxLabel?: string
  checked?: boolean

  // ---- バリデーション宣言 (ExtJS 互換。モックではネイティブ検証 + 必須マーク表示) ----
  /** false で必須入力 (ラベルに * を表示) */
  allowBlank?: boolean
  maxLength?: number
  minLength?: number
  /** 入力パターン (HTML の pattern として適用。文字列で指定) */
  regex?: string
  /** 入力種別のバリデーション ('email' | 'url' | 'alpha' | 'alphanum') */
  vtype?: string
  /** 数値の下限 (numberfield / slider) */
  minValue?: number
  /** 数値の上限 (numberfield / slider) */
  maxValue?: number

  // ---- グリッド ----
  columns?: number | ColumnConfig[]
  columnLines?: boolean
  store?: { fields?: string[]; data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>
  data?: Array<Record<string, unknown>>

  // ---- 画像 ----
  src?: string
  alt?: string

  // ---- chart / draw ----
  /** チャート系列。最初の 1 つだけ使用 ({ type: 'bar'|'line'|'area'|'pie', xField, yField }) */
  series?:
    | Array<{ type?: string; xField?: string; yField?: string | string[]; title?: string | string[] }>
    | { type?: string; xField?: string; yField?: string | string[]; title?: string | string[] }
  /** draw のスプライト定義 (Ext.draw 互換: type / fillStyle / strokeStyle / lineWidth など) */
  sprites?: Array<Record<string, unknown>>

  // ---- messagebox / toast ----
  /** ダイアログ本文 (ExtJS の msg も可) */
  message?: string
  /** ボタンセット ('ok' | 'okcancel' | 'yesno' | 'yesnocancel') または任意のラベル配列 */
  buttons?: string | string[]
  /** ダイアログのアイコン ('info' | 'question' | 'warning' | 'error') */
  icon?: string
  /** messagebox に入力欄を付ける (Ext.Msg.prompt 相当) */
  prompt?: boolean
  /** toast の表示位置 ('tr' | 'tl' | 'br' | 'bl' | 't' | 'b') */
  align?: string

  // ---- gitgraph / networkgraph ----
  /** gitgraph のレーン並び (省略時はコミットの登場順) */
  branches?: string[]
  /** gitgraph のコミット列 (上から古い順) */
  commits?: Array<{ id?: string; branch?: string; parents?: string[]; message?: string; tag?: string }>
  /** networkgraph のノード */
  nodes?: Array<{ id: string; text?: string; group?: number | string; color?: string; r?: number }>
  /** networkgraph のエッジ */
  edges?: Array<{ from: string; to: string }>

  // ---- terminal / video ----
  /** terminal に流すテキスト行 (サイクリック再生) */
  lines?: string[]
  /** terminal の行間隔 (ms、既定 500。±ランダム揺らぎ付き) */
  speed?: number
  /** terminal の保持行数 (既定 100) */
  maxLines?: number
  /** video の動画 URL (Ext.Video 互換。src も可) */
  url?: string
  /** video のポスター画像 (poster も可) */
  posterUrl?: string
  loop?: boolean
  muted?: boolean
  autoplay?: boolean
  controls?: boolean

  // ---- codeeditor ----
  /** Monaco の言語 ID (javascript / typescript / json / yaml / sql / python など) */
  language?: string
  /** codeeditor のテーマ ('light' / 'dark' または Monaco のテーマ名) */
  theme?: string
  /** 行番号の表示 (既定 true) */
  lineNumbers?: boolean
  /** ミニマップの表示 (既定 false) */
  minimap?: boolean
  fontSize?: number
  /** diffeditor の変更前コード (変更後は value) */
  original?: string
  /** diffeditor の並列表示 (既定 true。false でインライン表示) */
  sideBySide?: boolean

  // ---- chatpanel ----
  /** チャットの会話。from: 'user' は右寄せ、text は Markdown 描画 */
  messages?: Array<{ from?: string; name?: string; text?: string; time?: string }>
  /** 末尾に入力中インジケーターを表示 */
  typing?: boolean

  // ---- 選択系 ----
  options?: Array<string | { value: unknown; text: string }>
  multiSelect?: boolean

  // ---- datepicker ----
  showToday?: boolean
  todayText?: string

  // ---- htmleditor ----
  enableFormat?: boolean
  enableAlignments?: boolean
  enableLists?: boolean
  enableLinks?: boolean
  enableSourceEdit?: boolean

  // ---- pagingtoolbar ----
  pageSize?: number
  total?: number
  displayInfo?: boolean
  displayMsg?: string
  emptyMsg?: string

  // ---- イベント (宣言のみ。モックでは実行しない) ----
  /** クリック時ハンドラの参照名。'onSaveClick' のような文字列で書く (AI への仕様引き渡し用) */
  handler?: string
  /** イベント名 → ハンドラ参照名。{ select: 'onRowSelect' } のような文字列マップ */
  listeners?: Record<string, string>

  // ---- 見た目 ----
  text?: string
  iconCls?: string
  ui?: string
  cls?: string
  style?: React.CSSProperties | string

  [key: string]: unknown
}

/** xtype に対応する React コンポーネントが受け取る props */
export interface RendererProps {
  config: ComponentConfig
}
