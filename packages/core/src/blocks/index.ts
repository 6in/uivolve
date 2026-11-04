import { registerFence } from './registry'
import { MermaidFence } from './renderers/mermaid'

// 組み込みフェンスの登録 (言語名は GitHub / 各ライブラリで一般的な名前に合わせる)
registerFence('mermaid', { kind: 'text', label: 'Mermaid', component: MermaidFence })

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
