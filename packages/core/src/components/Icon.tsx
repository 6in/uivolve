import { cx } from '../utils'

/**
 * iconCls を描画するアイコン。
 * Font Awesome のクラス ('fa fa-plus' / 'fa-solid fa-plus' 等) を検出したら
 * <i> で描画する。ExtJS の 'x-fa fa-plus' 形式は 'fa' に読み替えるので
 * ExtJS の config をそのままコピペできる。
 * FA 以外のクラスは従来どおり四角いプレースホルダを表示する。
 *
 * Font Awesome の CSS 自体はホストアプリ側で読み込むこと
 * (例: import '@fortawesome/fontawesome-free/css/all.min.css')。
 */
export function Icon({ iconCls, className }: { iconCls?: string; className?: string }) {
  if (!iconCls) return null
  const cls = iconCls
    .split(/\s+/)
    .map((t) => (t === 'x-fa' ? 'fa' : t))
    .join(' ')
  const isFontAwesome = /(^|\s)fa(?:[srlbd]|-[a-z])?(\s|-)/.test(`${cls} `)
  if (isFontAwesome) {
    return <i className={cx('sx-icon', cls, className)} aria-hidden />
  }
  return <span className={cx('sx-btn-icon', cls, className)} aria-hidden />
}
