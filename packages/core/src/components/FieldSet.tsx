import { useState } from 'react'
import { LayoutBody } from '../layouts'
import type { RendererProps } from '../types'
import { cx, styleOf, toCssBox } from '../utils'

/**
 * xtype: 'fieldset' — フォームのグループ枠。
 * title が legend になる。collapsible / checkboxToggle に対応。
 */
export function FieldSet({ config }: RendererProps) {
  const [collapsed, setCollapsed] = useState(!!config.collapsed)
  const collapsible = !!config.collapsible || !!config.checkboxToggle
  return (
    <fieldset
      className={cx('sx-fieldset', collapsed && 'sx-collapsed', config.cls)}
      style={styleOf(config)}
    >
      {config.title !== undefined && (
        <legend
          className={cx('sx-fieldset-legend', collapsible && 'sx-clickable')}
          onClick={collapsible ? () => setCollapsed((c) => !c) : undefined}
        >
          {config.checkboxToggle === true && (
            <input type="checkbox" checked={!collapsed} readOnly aria-label="展開" />
          )}
          {!config.checkboxToggle && collapsible && (
            <span className="sx-tool" aria-hidden>
              {collapsed ? '▸' : '▾'}
            </span>
          )}
          {config.title}
        </legend>
      )}
      <div className="sx-fieldset-bodywrap">
        <div className="sx-fieldset-body" style={{ padding: toCssBox(config.bodyPadding) }}>
          {typeof config.html === 'string' && (
            <div className="sx-html" dangerouslySetInnerHTML={{ __html: config.html }} />
          )}
          <LayoutBody config={config} />
        </div>
      </div>
    </fieldset>
  )
}
