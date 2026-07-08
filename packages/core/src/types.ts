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
  /** treepanel のツリーグリッドで階層表示する列は 'treecolumn' を指定 */
  xtype?: string
  text?: string
  dataIndex?: string
  width?: number | string
  flex?: number
  align?: 'left' | 'center' | 'right'
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

  // ---- グリッド ----
  columns?: number | ColumnConfig[]
  columnLines?: boolean
  store?: { fields?: string[]; data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>
  data?: Array<Record<string, unknown>>

  // ---- 画像 ----
  src?: string
  alt?: string

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
