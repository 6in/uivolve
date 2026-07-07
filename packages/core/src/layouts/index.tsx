import { useState } from 'react'
import type * as React from 'react'
import type { ComponentConfig, LayoutConfig, Region } from '../types'
import { XRender } from '../XRender'
import { cx, toCssSize } from '../utils'

export interface LayoutProps {
  layout: LayoutConfig
  items: ComponentConfig[]
}

export type LayoutComponent = React.ComponentType<LayoutProps>

const layoutRegistry = new Map<string, LayoutComponent>()

/** レイアウトを登録する(拡張ポイント)。ExtJS の layout type 名に対応。 */
export function registerLayout(type: string | string[], impl: LayoutComponent): void {
  for (const t of Array.isArray(type) ? type : [type]) {
    layoutRegistry.set(t, impl)
  }
}

export function registeredLayouts(): string[] {
  return [...layoutRegistry.keys()].sort()
}

export function normalizeLayout(layout: ComponentConfig['layout']): LayoutConfig {
  if (!layout) return { type: 'auto' }
  return typeof layout === 'string' ? { type: layout } : layout
}

/**
 * コンテナの items を layout 設定に従って描画する共通エントリ。
 * defaults はExtJS 同様、各子 config にマージされる。
 */
export function LayoutBody({ config }: { config: ComponentConfig }) {
  const layout = normalizeLayout(config.layout)
  const Impl = layoutRegistry.get(layout.type) ?? AutoLayout
  const defaults = config.defaults
  const items = (config.items ?? [])
    .filter((it): it is ComponentConfig => typeof it === 'object' && it !== null)
    .map((it) => (defaults ? { ...defaults, ...it } : it))
  return <Impl layout={layout} items={items} />
}

// ---------------------------------------------------------------- auto

/** auto / anchor: 通常のブロックフローで順に並べる */
function AutoLayout({ items }: LayoutProps) {
  return (
    <div className="sx-layout-auto">
      {items.map((it, i) => (
        <XRender key={it.id ?? it.itemId ?? i} config={it} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- fit

/** fit: 最初の子をコンテナいっぱいに広げる */
function FitLayout({ items }: LayoutProps) {
  const first = items[0]
  if (!first) return null
  return (
    <div className="sx-layout-fit">
      <XRender config={first} />
    </div>
  )
}

// ---------------------------------------------------------------- border

const REGIONS: Region[] = ['north', 'west', 'center', 'east', 'south']

/**
 * border: north/south/east/west/center の 5 領域レイアウト (CSS Grid で実現)。
 * split: true のリージョンは ExtJS 同様、スプリットバーのドラッグでリサイズできる。
 */
function BorderLayout({ items }: LayoutProps) {
  // ドラッグで確定したリージョンサイズ (px)。未ドラッグは config の width/height を使う
  const [sizes, setSizes] = useState<Partial<Record<Region, number>>>({})

  const byRegion = new Map<Region, ComponentConfig[]>()
  for (const it of items) {
    const region = (it.region ?? 'center') as Region
    const list = byRegion.get(region) ?? []
    list.push(it)
    byRegion.set(region, list)
  }

  const startResize = (region: Region) => (e: React.PointerEvent) => {
    e.preventDefault()
    const wrapper = (e.currentTarget as HTMLElement).parentElement
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const move = (ev: PointerEvent) => {
      const size =
        region === 'west'
          ? rect.width + (ev.clientX - startX)
          : region === 'east'
            ? rect.width - (ev.clientX - startX)
            : region === 'north'
              ? rect.height + (ev.clientY - startY)
              : rect.height - (ev.clientY - startY)
      setSizes((s) => ({ ...s, [region]: Math.max(50, Math.round(size)) }))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div className="sx-layout-border">
      {REGIONS.map((region) => {
        const regionItems = byRegion.get(region)
        if (!regionItems) return null
        const head = regionItems[0]
        const sizing: React.CSSProperties = {}
        // east/west は width、north/south は height を領域サイズとして使う
        if (region === 'east' || region === 'west') {
          sizing.width =
            sizes[region] !== undefined ? `${sizes[region]}px` : toCssSize(head.width) ?? '25%'
        } else if (region === 'north' || region === 'south') {
          const h =
            sizes[region] !== undefined ? `${sizes[region]}px` : toCssSize(head.height)
          if (h !== undefined) sizing.height = h
        }
        const vertical = region === 'west' || region === 'east'
        const splittable = head.split === true && region !== 'center'
        return (
          <div key={region} className={cx('sx-region', `sx-region-${region}`)} style={sizing}>
            {regionItems.map((it, i) => (
              <XRender key={it.id ?? it.itemId ?? i} config={{ ...it, width: undefined }} />
            ))}
            {splittable && (
              <div
                className={cx(
                  'sx-splitbar',
                  vertical ? 'sx-splitbar-v' : 'sx-splitbar-h',
                  `sx-splitbar-${region}`,
                )}
                role="separator"
                aria-orientation={vertical ? 'vertical' : 'horizontal'}
                aria-label={`${region} リージョンのサイズ調整`}
                onPointerDown={startResize(region)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------- grid

/** grid: CSS Grid による均等グリッド。layout: { type: 'grid', columns: 3 } */
function GridLayout({ layout, items }: LayoutProps) {
  const columns = layout.columns ?? Math.max(items.length, 1)
  const gap = toCssSize(layout.gap as number | string | undefined) ?? 'var(--sx-gap)'
  return (
    <div
      className="sx-layout-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }}
    >
      {items.map((it, i) => {
        const colspan = (it.colspan as number | undefined) ?? 1
        const rowspan = (it.rowspan as number | undefined) ?? 1
        return (
          <div
            key={it.id ?? it.itemId ?? i}
            className="sx-grid-cell-item"
            style={{
              gridColumn: colspan > 1 ? `span ${colspan}` : undefined,
              gridRow: rowspan > 1 ? `span ${rowspan}` : undefined,
            }}
          >
            <XRender config={it} />
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------- hbox / vbox

function alignToCss(align: string | undefined): React.CSSProperties['alignItems'] {
  switch (align) {
    case 'middle':
    case 'center':
      return 'center'
    case 'bottom':
    case 'right':
    case 'end':
      return 'flex-end'
    case 'stretch':
    case 'stretchmax':
      return 'stretch'
    default:
      return 'flex-start'
  }
}

function packToCss(pack: string | undefined): React.CSSProperties['justifyContent'] {
  switch (pack) {
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    default:
      return 'flex-start'
  }
}

function makeBoxLayout(direction: 'row' | 'column'): LayoutComponent {
  return function Box({ layout, items }: LayoutProps) {
    return (
      <div
        className={cx('sx-layout-box', direction === 'row' ? 'sx-layout-hbox' : 'sx-layout-vbox')}
        style={{
          flexDirection: direction,
          alignItems: alignToCss(layout.align),
          justifyContent: packToCss(layout.pack),
        }}
      >
        {items.map((it, i) => (
          <XRender key={it.id ?? it.itemId ?? i} config={it} />
        ))}
      </div>
    )
  }
}

/** hbox: 子を水平方向に並べる Flexbox。align / pack、子の flex による比率分配に対応 */
const HBoxLayout = makeBoxLayout('row')

/** vbox: 子を垂直方向に並べる Flexbox。align / pack、子の flex による比率分配に対応 */
const VBoxLayout = makeBoxLayout('column')

// ---------------------------------------------------------------- card

/** card: activeItem の 1 枚だけを表示する (tabpanel / ウィザードの基盤) */
function CardLayout({ layout, items }: LayoutProps) {
  const active = (layout.activeItem as number | undefined) ?? 0
  const item = items[active]
  if (!item) return null
  return (
    <div className="sx-layout-fit">
      <XRender config={item} />
    </div>
  )
}

// ---------------------------------------------------------------- center

/** center: 単一の子をコンテナ中央に配置 */
function CenterLayout({ items }: LayoutProps) {
  const first = items[0]
  if (!first) return null
  return (
    <div className="sx-layout-center">
      <XRender config={first} />
    </div>
  )
}

// ---------------------------------------------------------------- column

/** column: columnWidth (0〜1 の割合) または固定 width で横並び・折り返し */
function ColumnLayout({ items }: LayoutProps) {
  return (
    <div className="sx-layout-column">
      {items.map((it, i) => {
        const columnWidth = it.columnWidth as number | undefined
        const width = columnWidth !== undefined ? `${columnWidth * 100}%` : toCssSize(it.width)
        return (
          <div key={it.id ?? it.itemId ?? i} className="sx-column-item" style={{ width }}>
            <XRender config={{ ...it, width: undefined }} />
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------- absolute

/** absolute: x / y 座標による絶対位置指定 */
function AbsoluteLayout({ items }: LayoutProps) {
  return (
    <div className="sx-layout-absolute">
      {items.map((it, i) => (
        <div
          key={it.id ?? it.itemId ?? i}
          className="sx-absolute-item"
          style={{
            insetInlineStart: toCssSize(it.x as number | string | undefined) ?? 0,
            insetBlockStart: toCssSize(it.y as number | string | undefined) ?? 0,
          }}
        >
          <XRender config={it} />
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- 登録

registerLayout(['auto', 'anchor', 'form'], AutoLayout)
registerLayout('fit', FitLayout)
registerLayout('border', BorderLayout)
registerLayout(['grid', 'table'], GridLayout)
registerLayout('hbox', HBoxLayout)
registerLayout('vbox', VBoxLayout)
registerLayout('card', CardLayout)
registerLayout('center', CenterLayout)
registerLayout('column', ColumnLayout)
registerLayout('absolute', AbsoluteLayout)
// accordion は PanelShell を使うため components/Accordion.tsx で登録される
