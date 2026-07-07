import { useState } from 'react'
import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'
import { Icon } from './Icon'

/** displayMsg の '{0} - {1} / {2}' 形式プレースホルダーを置換する */
function format(template: string, ...args: Array<string | number>): string {
  return template.replace(/\{(\d)\}/g, (_, i) => String(args[Number(i)] ?? ''))
}

function PageButton({
  iconCls,
  title,
  disabled,
  onClick,
}: {
  iconCls: string
  title: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className="sx-btn sx-paging-btn"
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon iconCls={iconCls} />
    </button>
  )
}

/**
 * xtype: 'pagingtoolbar' — ページングツールバー。
 * モックのため store とは連動せず、total / pageSize (既定 25) からページ数を計算して
 * ページ移動のインタラクションを再現する。displayInfo: true で右端に件数を表示し、
 * 文言は displayMsg ('{0} - {1} 件目 / 全 {2} 件') / emptyMsg で変更できる。
 * beforePageText / afterPageText でページ番号まわりの文言も変更可能。
 * グリッドの下部に置くときは bbar: { xtype: 'pagingtoolbar', total: 200 } と書く。
 */
export function PagingToolbar({ config }: RendererProps) {
  const pageSize = config.pageSize ?? 25
  const total = config.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const [page, setPage] = useState(1)
  const go = (p: number) => setPage(Math.min(pageCount, Math.max(1, Math.floor(p) || 1)))

  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(total, page * pageSize)
  const info =
    total === 0
      ? config.emptyMsg ?? '表示するデータがありません'
      : format(config.displayMsg ?? '{0} - {1} 件目 / 全 {2} 件', first, last, total)

  return (
    <div className={cx('sx-toolbar', 'sx-paging', config.cls)} style={styleOf(config)} role="toolbar">
      <PageButton
        iconCls="fa fa-angles-left"
        title="最初のページ"
        disabled={page <= 1}
        onClick={() => go(1)}
      />
      <PageButton
        iconCls="fa fa-angle-left"
        title="前のページ"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      />
      <span className="sx-tb-sep" />
      <span className="sx-tb-text">{(config.beforePageText as string | undefined) ?? 'ページ'}</span>
      <input
        className="sx-input sx-paging-input"
        type="number"
        min={1}
        max={pageCount}
        value={page}
        onChange={(e) => go(Number(e.target.value))}
      />
      <span className="sx-tb-text">
        {format((config.afterPageText as string | undefined) ?? '/ {0}', pageCount)}
      </span>
      <span className="sx-tb-sep" />
      <PageButton
        iconCls="fa fa-angle-right"
        title="次のページ"
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
      />
      <PageButton
        iconCls="fa fa-angles-right"
        title="最後のページ"
        disabled={page >= pageCount}
        onClick={() => go(pageCount)}
      />
      <span className="sx-tb-sep" />
      <PageButton iconCls="fa fa-arrows-rotate" title="更新" />
      {config.displayInfo && (
        <>
          <span className="sx-tb-fill" />
          <span className="sx-paging-info">{info}</span>
        </>
      )}
    </div>
  )
}
