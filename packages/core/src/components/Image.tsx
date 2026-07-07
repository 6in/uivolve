import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

/** xtype: 'image' — src 未指定時はプレースホルダを表示 */
export function Image({ config }: RendererProps) {
  const style = styleOf(config)
  if (config.src) {
    return (
      <img
        className={cx('sx-image', config.cls)}
        src={config.src}
        alt={config.alt ?? ''}
        style={style}
      />
    )
  }
  return (
    <div className={cx('sx-image-placeholder', config.cls)} style={style} role="img" aria-label={config.alt ?? '画像'}>
      <span aria-hidden>🖼</span>
      {config.alt && <span className="sx-image-alt">{config.alt}</span>}
    </div>
  )
}
