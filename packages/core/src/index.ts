// 組み込みコンポーネント / レイアウトの登録 (副作用 import)
import './components'
import './layouts'

export { ExtMockup, type ExtMockupProps, type ThemeName } from './ExtMockup'
export { XRender } from './XRender'
export { parseDsl, DslParseError } from './parser'
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
