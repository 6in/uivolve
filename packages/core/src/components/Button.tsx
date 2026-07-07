import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

/** xtype: 'button' */
export function Button({ config }: RendererProps) {
  return (
    <button
      type="button"
      className={cx(
        'sx-btn',
        config.ui === 'primary' && 'sx-btn-primary',
        config.cls,
      )}
      disabled={config.disabled}
      style={styleOf(config)}
    >
      {config.iconCls && <span className={cx('sx-btn-icon', config.iconCls)} aria-hidden />}
      {config.text}
    </button>
  )
}
