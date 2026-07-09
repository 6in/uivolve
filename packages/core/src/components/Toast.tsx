import { useState } from 'react'
import type { RendererProps } from '../types'
import { Overlay } from '../overlay'
import { cx, styleOf } from '../utils'
import { Icon } from './Icon'

const ALIGNS = new Set(['tr', 'tl', 'br', 'bl', 't', 'b'])

/**
 * xtype: 'toast' — トースト通知 (Ext.toast 互換)。
 * html (または message) をプレビュー領域の隅に重ねて表示する。
 * align: 'tr' (既定) / 'tl' / 'br' / 'bl' / 't' / 'b'。title / iconCls 付きも可。
 * closable (既定 true) の × で消せる。モックなので自動では消えない (timeout は無視)。
 */
export function Toast({ config }: RendererProps) {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null
  const align = ALIGNS.has(config.align as string) ? (config.align as string) : 'tr'
  const body = config.html ?? (config.message as string | undefined) ?? config.text
  return (
    <Overlay>
      <div
        className={cx('sx-toast', `sx-toast-${align}`, config.cls)}
        style={styleOf(config)}
        role="status"
      >
        <Icon iconCls={config.iconCls} className="sx-toast-icon" />
        <div className="sx-toast-content">
          {config.title && <div className="sx-toast-title">{config.title}</div>}
          {typeof config.html === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: config.html }} />
          ) : (
            <div>{body as string}</div>
          )}
        </div>
        {config.closable !== false && (
          <button
            type="button"
            className="sx-toast-close"
            aria-label="閉じる"
            onClick={() => setHidden(true)}
          >
            ×
          </button>
        )}
      </div>
    </Overlay>
  )
}
