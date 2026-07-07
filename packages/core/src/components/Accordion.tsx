import { useState } from 'react'
import { XRender } from '../XRender'
import { registerLayout, type LayoutProps } from '../layouts'
import { cx } from '../utils'
import { PanelShell } from './Panel'

/** PanelShell の body 描画 (items + layout) をそのまま使える xtype */
const PLAIN_PANEL_XTYPES = new Set([undefined, 'panel', 'form', 'container'])

/**
 * accordion レイアウト: 子パネルを縦に積み、一度に 1 つだけ展開する。
 * ExtJS 同様、展開中のパネルが残り高さを占有する。
 * treepanel / grid などパネル派生の子は、ヘッダーを剥がして body に埋め込む。
 */
function AccordionLayout({ items }: LayoutProps) {
  const initial = items.findIndex((it) => it.collapsed !== true)
  const [expanded, setExpanded] = useState(initial === -1 ? 0 : initial)
  return (
    <div className="sx-layout-accordion">
      {items.map((it, i) => {
        const isExpanded = i === expanded
        const isPlain = PLAIN_PANEL_XTYPES.has(it.xtype)
        return (
          <div
            key={it.id ?? it.itemId ?? i}
            className={cx('sx-accordion-item', isExpanded && 'sx-accordion-expanded')}
          >
            <PanelShell
              config={{ ...it, height: undefined, collapsed: undefined }}
              collapsed={!isExpanded}
              onToggleCollapse={() => setExpanded(i)}
              bodyClassName={isPlain ? undefined : 'sx-accordion-embed'}
            >
              {isPlain ? undefined : (
                <div className="sx-layout-fit">
                  <XRender
                    config={{
                      ...it,
                      title: undefined,
                      height: undefined,
                      collapsed: undefined,
                      collapsible: undefined,
                    }}
                  />
                </div>
              )}
            </PanelShell>
          </div>
        )
      })}
    </div>
  )
}

registerLayout('accordion', AccordionLayout)
