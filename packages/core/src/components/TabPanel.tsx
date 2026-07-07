import { useState } from 'react'
import { XRender } from '../XRender'
import type { ComponentConfig, RendererProps } from '../types'
import { cx, styleOf, toCssBox } from '../utils'
import { Icon } from './Icon'

/**
 * xtype: 'tabpanel' — タブ切替パネル。
 * 各 item の title がタブ名になる。activeTab / closable に対応。
 */
export function TabPanel({ config }: RendererProps) {
  const items = (config.items ?? []).filter(
    (it): it is ComponentConfig => typeof it === 'object' && it !== null,
  )
  const [active, setActive] = useState((config.activeTab as number | undefined) ?? 0)
  const current = items[active]

  return (
    <section className={cx('sx-panel', 'sx-tabpanel', config.cls)} style={styleOf(config)}>
      {config.title !== undefined && (
        <header className="sx-panel-header">
          <span className="sx-panel-title">{config.title}</span>
        </header>
      )}
      <div className="sx-tabbar" role="tablist">
        {items.map((it, i) => (
          <button
            key={it.id ?? it.itemId ?? i}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={cx('sx-tab', i === active && 'sx-tab-active')}
            onClick={() => setActive(i)}
            disabled={it.disabled}
          >
            <Icon iconCls={it.iconCls as string | undefined} />
            {it.title ?? `タブ ${i + 1}`}
            {it.closable === true && (
              <span className="sx-tab-close" aria-hidden>
                ×
              </span>
            )}
          </button>
        ))}
      </div>
      <div
        className="sx-panel-body sx-tabpanel-body"
        style={{ padding: toCssBox(config.bodyPadding) }}
        role="tabpanel"
      >
        {current && (
          <div className="sx-layout-fit">
            <XRender
              config={{ ...current, title: undefined, width: undefined, height: undefined }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
