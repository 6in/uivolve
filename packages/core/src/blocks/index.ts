import { registerFence } from './registry'
import { MermaidFence } from './renderers/mermaid'
import { TableFence } from './renderers/table'

// 組み込みフェンスの登録 (言語名は GitHub / 各ライブラリで一般的な名前に合わせる)
registerFence('mermaid', { kind: 'text', label: 'Mermaid', component: MermaidFence })
registerFence('table', { kind: 'data', label: 'Table', component: TableFence })
registerFence(['csv', 'tsv'], { kind: 'text', label: 'CSV', component: TableFence })

export { FenceBlock, type FenceBlockProps } from './FenceBlock'
export {
  registerFence,
  registeredFences,
  resolveFence,
  type FenceDefinition,
  type FenceOptions,
  type FenceRendererProps,
} from './registry'
export { parseFenceMeta } from './meta'
export { readSxPalette, type SxPalette } from './theme'
