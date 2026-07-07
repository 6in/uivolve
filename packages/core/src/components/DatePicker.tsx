import { useState } from 'react'
import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土']

function parseDate(v: unknown): Date | null {
  if (v instanceof Date) return v
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v)
    if (!Number.isNaN(d.getTime())) return d
  }
  return null
}

function sameDay(a: Date | null, b: Date | null): boolean {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * xtype: 'datepicker' — インラインのカレンダー (Ext.picker.Date 互換)。
 * value(初期選択日)/ showToday(「今日」ボタンの表示)/ todayText に対応。
 * 月の移動と日付クリックによる選択ができる。
 */
export function DatePicker({ config }: RendererProps) {
  const initial = parseDate(config.value) ?? new Date()
  const [selected, setSelected] = useState<Date | null>(parseDate(config.value))
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() })
  const today = new Date()

  // 表示月の 1 日を含む週の日曜から 6 週分 (42 マス)
  const first = new Date(view.year, view.month, 1)
  const start = new Date(view.year, view.month, 1 - first.getDay())
  const cells = Array.from(
    { length: 42 },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  )

  const moveMonth = (delta: number) => {
    const d = new Date(view.year, view.month + delta, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  const selectDate = (d: Date) => {
    setSelected(d)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <div className={cx('sx-datepicker', config.cls)} style={styleOf(config)}>
      <div className="sx-datepicker-header">
        <button
          type="button"
          className="sx-datepicker-nav"
          onClick={() => moveMonth(-1)}
          aria-label="前の月"
        >
          ‹
        </button>
        <span className="sx-datepicker-title">
          {view.year}年 {view.month + 1}月
        </span>
        <button
          type="button"
          className="sx-datepicker-nav"
          onClick={() => moveMonth(1)}
          aria-label="次の月"
        >
          ›
        </button>
      </div>
      <div className="sx-datepicker-grid" role="grid">
        {DAY_NAMES.map((n) => (
          <div key={n} className="sx-datepicker-dow">
            {n}
          </div>
        ))}
        {cells.map((d, i) => (
          <button
            key={i}
            type="button"
            className={cx(
              'sx-datepicker-day',
              d.getMonth() !== view.month && 'sx-datepicker-out',
              sameDay(d, today) && 'sx-datepicker-todaymark',
              sameDay(d, selected) && 'sx-datepicker-selected',
            )}
            onClick={() => selectDate(d)}
            aria-pressed={sameDay(d, selected)}
          >
            {d.getDate()}
          </button>
        ))}
      </div>
      {config.showToday !== false && (
        <div className="sx-datepicker-footer">
          <button type="button" className="sx-btn" onClick={() => selectDate(new Date())}>
            {(config.todayText as string | undefined) ?? '今日'}
          </button>
        </div>
      )}
    </div>
  )
}
