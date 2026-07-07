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
  store?: { fields?: string[]; data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>
  data?: Array<Record<string, unknown>>

  // ---- 画像 ----
  src?: string
  alt?: string

  // ---- 選択系 ----
  options?: Array<string | { value: unknown; text: string }>
  multiSelect?: boolean

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
