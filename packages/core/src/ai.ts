/**
 * AI への引き渡し用テキストの生成。
 * config ツリーで実際に使われている xtype / layout だけを meta.ts から抽出し、
 * DSL と一緒に渡すコンパクトなリファレンスを組み立てる
 * (React 非依存。Playground の「AI 用にコピー」が使用)。
 */
import { LAYOUT_META, getXtypeMeta, type LayoutMeta } from './meta'
import type { ComponentConfig } from './types'

/** 別名も含めて layout メタを解決する */
function getLayoutMeta(name: string): { name: string; meta: LayoutMeta } | undefined {
  if (LAYOUT_META[name]) return { name, meta: LAYOUT_META[name] }
  for (const [canonical, meta] of Object.entries(LAYOUT_META)) {
    if (meta.aliases?.includes(name)) return { name: canonical, meta }
  }
  return undefined
}

/** config ツリーを歩いて使用中の xtype / layout type を集める */
function collectUsage(
  config: ComponentConfig,
  xtypes: Set<string>,
  layouts: Set<string>,
  defaultType = 'panel',
) {
  const xtype =
    config.xtype ??
    (config.items || config.title !== undefined || config.layout ? 'panel' : defaultType)
  xtypes.add(xtype)

  if (config.layout) {
    layouts.add(typeof config.layout === 'string' ? config.layout : config.layout.type)
  }
  // ツールバー / メニューの中の xtype 省略時は button になる
  const walk = (v: unknown, childDefault: string) => {
    if (Array.isArray(v)) v.forEach((it) => walk(it, childDefault))
    else if (v && typeof v === 'object') {
      collectUsage(v as ComponentConfig, xtypes, layouts, childDefault)
    }
  }
  // toolbar / menu の items の defaultType は button
  const itemsDefault = xtype === 'toolbar' || xtype === 'menu' ? 'button' : 'component'
  walk(config.items, itemsDefault)
  walk(config.tbar, 'button')
  walk(config.bbar, 'button')
  walk(config.menu, 'button')
}

/**
 * config で使用しているコンポーネント / レイアウトのリファレンス (Markdown) を生成する。
 * 「AI 用にコピー」で DSL に添付し、独自拡張の xtype でも AI が意味を取れるようにする。
 */
export function buildAiReference(config: ComponentConfig): string {
  const xtypes = new Set<string>()
  const layouts = new Set<string>()
  collectUsage(config, xtypes, layouts)

  const xtypeLines = [...xtypes].sort().map((xt) => {
    const meta = getXtypeMeta(xt)
    if (!meta) return `- \`${xt}\``
    const props = meta.props?.length ? ` — 主な config: ${meta.props.slice(0, 12).join(', ')}` : ''
    return `- \`${xt}\`: ${meta.description}${props}`
  })

  const layoutLines = [...layouts].sort().map((name) => {
    const found = getLayoutMeta(name)
    return found ? `- \`${name}\`: ${found.meta.description}` : `- \`${name}\``
  })

  const sections = [
    '## 使用コンポーネントのリファレンス',
    '',
    ...xtypeLines,
  ]
  if (layoutLines.length > 0) {
    sections.push('', '### layout', '', ...layoutLines)
  }
  sections.push(
    '',
    '### DSL 共通の読み方',
    '',
    '- `itemId`: コンポーネントの一意識別子。指示・実装コードとの対応付けに使う',
    "- `handler` / `listeners`: イベントハンドラの参照名 (モックでは宣言のみ。この名前で実装すること。例: handler: 'onSaveClick')",
    '- `width` / `height` / `flex` / `margin` / `padding` / `hidden` / `disabled`: サイズ・状態の共通 config',
    '- `items`: 子コンポーネント。`tbar` / `bbar` は上部/下部ツールバー',
  )
  return sections.join('\n')
}
