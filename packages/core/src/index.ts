// 組み込みコンポーネント / レイアウトの登録 (副作用 import)
import './components'
import './layouts'

export { ExtMockup, type ExtMockupProps, type ThemeName } from './ExtMockup'
export { XRender } from './XRender'
export { parseDsl, stringifyDsl, detectFormat, DslParseError, type DslFormat } from './parser'
export { buildAiReference } from './ai'
export {
  COMMON_PROPS,
  CONTAINER_PROPS,
  FIELD_PROPS,
  LAYOUT_META,
  XTYPE_META,
  allLayoutNames,
  allXtypeNames,
  getXtypeMeta,
  type LayoutMeta,
  type XtypeMeta,
} from './meta'
export { registerComponent, registeredXtypes, resolveComponent } from './registry'
export {
  LayoutBody,
  normalizeLayout,
  registerLayout,
  registeredLayouts,
  type LayoutComponent,
  type LayoutProps,
} from './layouts'
export { PanelShell } from './components'
export type {
  ColumnConfig,
  ComponentConfig,
  LayoutConfig,
  Region,
  RendererProps,
} from './types'
