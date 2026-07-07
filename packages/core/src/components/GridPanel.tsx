import { useState } from 'react'
import type { ColumnConfig, RendererProps } from '../types'
import { cx } from '../utils'
import { PanelShell } from './Panel'

/**
 * xtype: 'grid' | 'gridpanel' — データグリッド。
 * columns / store(または data)から表を描画する。
 * CSS Grid + subgrid で列揃え・行ホバー・行選択を実現。
 */
export function GridPanel({ config }: RendererProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const columns: ColumnConfig[] = Array.isArray(config.columns) ? config.columns : []
  const data: Array<Record<string, unknown>> = Array.isArray(config.data)
    ? config.data
    : Array.isArray(config.store)
      ? config.store
      : config.store?.data ?? []

  const template = columns
    .map((c) => {
      if (c.width !== undefined) {
        return typeof c.width === 'number' ? `${c.width}px` : c.width
      }
      return `${c.flex ?? 1}fr`
    })
    .join(' ')

  return (
    <PanelShell config={config} bodyClassName="sx-gridpanel-body">
      <div className="sx-grid" style={{ gridTemplateColumns: template }} role="table">
        <div className="sx-grid-row sx-grid-headrow" role="row">
          {columns.map((c, i) => (
            <div key={i} className={cx('sx-grid-cell', 'sx-grid-head')} role="columnheader">
              {c.text}
            </div>
          ))}
        </div>
        {data.map((row, r) => (
          <div
            key={r}
            className={cx('sx-grid-row', selected === r && 'sx-grid-selected')}
            role="row"
            onClick={() => setSelected((cur) => (cur === r ? null : r))}
          >
            {columns.map((c, i) => (
              <div
                key={i}
                className="sx-grid-cell"
                style={{ textAlign: c.align }}
                role="cell"
              >
                {String(row[c.dataIndex ?? ''] ?? '')}
              </div>
            ))}
          </div>
        ))}
        {data.length === 0 && <div className="sx-grid-empty">データがありません</div>}
      </div>
    </PanelShell>
  )
}
