import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

/**
 * xtype: 'video' — 動画プレイヤー (Ext.Video 互換)。
 * url (src も可) の動画を HTML5 video で再生する。posterUrl (poster も可) /
 * loop / muted / autoplay / controls (既定 true) に対応。url 省略時はプレースホルダを表示。
 * YouTube などの埋め込みプレイヤーは video ではなく iframe を使うこと。
 */
export function Video({ config }: RendererProps) {
  const src = (config.url as string | undefined) ?? config.src
  if (!src) {
    return (
      <div className={cx('sx-video', 'sx-video-empty', config.cls)} style={styleOf(config)} role="note">
        ▶ 動画 (url 未指定)
      </div>
    )
  }
  return (
    <video
      className={cx('sx-video', config.cls)}
      style={styleOf(config)}
      src={src}
      poster={(config.posterUrl as string | undefined) ?? (config.poster as string | undefined)}
      controls={config.controls !== false}
      loop={config.loop === true}
      muted={config.muted === true}
      autoPlay={config.autoplay === true}
      playsInline
      preload="metadata"
    />
  )
}
