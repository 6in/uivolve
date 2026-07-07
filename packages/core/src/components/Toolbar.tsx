import { Fragment } from 'react'
import { XRender } from '../XRender'
import type { ComponentConfig, RendererProps } from '../types'
import { cx, styleOf } from '../utils'

/**
 * xtype: 'toolbar'
 * ExtJS のショートハンドに対応:
 *   '->' = 右寄せ / '-' = セパレーター / ' ' = スペーサー / 文字列 = ラベル
 * items の defaultType は button。
 */
export function Toolbar({ config }: RendererProps) {
  const items = Array.isArray(config.items) ? config.items : []
  return (
    <div className={cx('sx-toolbar', config.cls)} style={styleOf(config)} role="toolbar">
      {items.map((it, i) => (
        <Fragment key={i}>{renderItem(it)}</Fragment>
      ))}
    </div>
  )
}

function renderItem(item: ComponentConfig | string) {
  if (typeof item === 'string') {
    if (item === '->') return <span className="sx-tb-fill" />
    if (item === '-') return <span className="sx-tb-sep" />
    if (item.trim() === '') return <span className="sx-tb-spacer" />
    return <span className="sx-tb-text">{item}</span>
  }
  switch (item.xtype) {
    case 'tbfill':
      return <span className="sx-tb-fill" />
    case 'tbseparator':
      return <span className="sx-tb-sep" />
    case 'tbspacer':
      return <span className="sx-tb-spacer" style={{ width: item.width ?? 8 }} />
    case 'tbtext':
      return <span className="sx-tb-text">{item.text}</span>
    default:
      // toolbar の defaultType は button
      return <XRender config={item.xtype ? item : { xtype: 'button', ...item }} />
  }
}
