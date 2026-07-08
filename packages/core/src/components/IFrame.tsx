import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

/**
 * xtype: 'uxiframe' | 'iframe' — インラインフレーム (Ext.ux.IFrame 互換)。
 * src の URL を埋め込み表示する。src 省略時はプレースホルダを表示。
 * 高さは height / flex で指定する (既定 200px)。
 */
export function IFrame({ config }: RendererProps) {
  const style = styleOf(config)
  if (!config.src) {
    return (
      <div className={cx('sx-iframe', 'sx-iframe-empty', config.cls)} style={style} role="note">
        iframe (src 未指定)
      </div>
    )
  }
  return (
    <iframe
      className={cx('sx-iframe', config.cls)}
      style={style}
      src={config.src}
      title={config.title ?? config.itemId ?? 'iframe'}
    />
  )
}
