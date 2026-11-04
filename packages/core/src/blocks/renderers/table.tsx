import { useMemo, useState } from 'react'
import { cx } from '../../utils'
import { parseCsv } from '../csv'
import { optionFlag } from '../meta'
import type { FenceRendererProps } from '../registry'
import { tableRows } from '../shapes'

/** 列定義 (名前は uivolve の grid = ExtJS の column config に合わせる) */
interface TableColumn {
  dataIndex: string
  text?: string
  width?: number | string
  flex?: number
  align?: 'left' | 'center' | 'right' | 'start' | 'end'
}

type Row = Record<string, unknown>

interface TableModel {
  columns: TableColumn[]
  rows: Row[]
}

/** 数値か (文字列は 1234 / -1,234,567.89 のような 3 桁区切りまで。"1,2,3" のような列挙は文字列扱い) */
const isNumeric = (v: unknown) =>
  typeof v === 'number' ||
  (typeof v === 'string' && /^-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$/.test(v.trim()))

/** 全行が数値の列は右寄せにする (align 未指定時) */
function autoAlign(columns: TableColumn[], rows: Row[]): TableColumn[] {
  return columns.map((c) => {
    if (c.align) return c
    const values = rows.map((r) => r[c.dataIndex]).filter((v) => v !== '' && v != null)
    return values.length && values.every(isNumeric) ? { ...c, align: 'right' } : c
  })
}

function fromCsv(source: string, delimiter: string): TableModel {
  const [header = [], ...body] = parseCsv(source, delimiter)
  const columns = header.map((text, i) => ({ dataIndex: String(i), text: text.trim() }))
  const rows = body.map((cells) => Object.fromEntries(cells.map((c, i) => [String(i), c])))
  return { columns: autoAlign(columns, rows), rows }
}

function fromData(data: unknown): TableModel {
  const spec = (Array.isArray(data) ? {} : (data ?? {})) as { columns?: Array<TableColumn | string> }
  // 行の取り出し方 (store.data なども可) と形の確認は shapes.ts に集約 (FenceBlock が確認済み)
  const rawRows = tableRows(data) ?? []
  // 行が配列なら列番号をキーにする (列定義は先頭から順に対応させる)
  const arrayRows = Array.isArray(rawRows[0])
  const rows: Row[] = rawRows.map((r) =>
    Array.isArray(r)
      ? Object.fromEntries(r.map((v, i) => [String(i), v]))
      : ((r ?? {}) as Row),
  )
  let columns = spec.columns?.map((c, i): TableColumn => {
    if (typeof c === 'string') return { dataIndex: arrayRows ? String(i) : c, text: c }
    return { ...c, dataIndex: c.dataIndex ?? String(i) }
  })
  if (!columns) {
    const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))]
    columns = keys.map((k) => ({ dataIndex: k, text: k }))
  }
  return { columns: autoAlign(columns, rows), rows }
}

function display(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

const collator = new Intl.Collator('ja', { numeric: true, sensitivity: 'base' })

function compare(a: unknown, b: unknown): number {
  if (isNumeric(a) && isNumeric(b)) {
    return Number(String(a).replace(/,/g, '')) - Number(String(b).replace(/,/g, ''))
  }
  return collator.compare(display(a), display(b))
}

/** 列定義 → grid-template-columns の 1 トラック (width 固定 / flex 比率 / 未指定は中身なり) */
function colTrack(c: TableColumn): string {
  if (c.width !== undefined) {
    return typeof c.width === 'number' || /^\d+$/.test(c.width) ? `${c.width}px` : c.width
  }
  if (c.flex) return `minmax(0, ${c.flex}fr)`
  return 'auto'
}

/**
 * ```table / ```csv / ```tsv — 表。見出しクリックで昇順 ⇔ 降順に並べ替え、
 * 上部の入力欄で全列を対象に絞り込める (meta の sort=false / filter=false で無効化)。
 * <table> ではなく grid + subgrid で組む (埋め込み先ページの table / th / td の CSS は
 * @layer sx より強く、見た目を崩されるため)
 */
export function TableFence({ source, data, options, lang }: FenceRendererProps) {
  const model = useMemo(() => {
    const l = lang.toLowerCase()
    if (l === 'csv') return fromCsv(source, ',')
    if (l === 'tsv') return fromCsv(source, '\t')
    return fromData(data)
  }, [source, data, lang])

  const sortable = optionFlag(options, 'sort', true)
  const filterable = optionFlag(options, 'filter', true)
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null)
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = q
      ? model.rows.filter((r) =>
          model.columns.some((c) => display(r[c.dataIndex]).toLowerCase().includes(q)),
        )
      : model.rows
    if (sort) {
      list = [...list].sort((a, b) => compare(a[sort.key], b[sort.key]) * sort.dir)
    }
    return list
  }, [model, query, sort])

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))

  return (
    <div className="sx-fence-table">
      {filterable && (
        <div className="sx-fence-table-tools">
          <input
            type="search"
            className="sx-fence-table-filter"
            placeholder="絞り込み"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="sx-fence-table-count">
            {rows.length === model.rows.length
              ? `${rows.length} 件`
              : `${rows.length} / ${model.rows.length} 件`}
          </span>
        </div>
      )}
      <div className="sx-fence-table-scroll">
        <div
          role="table"
          className="sx-fence-grid"
          style={{ gridTemplateColumns: model.columns.map(colTrack).join(' ') || '1fr' }}
        >
          <div role="row" className="sx-fence-grid-row sx-fence-grid-head">
            {model.columns.map((c) => {
              const dir = sort?.key === c.dataIndex ? sort.dir : 0
              return (
                <div
                  key={c.dataIndex}
                  role="columnheader"
                  style={{ textAlign: c.align }}
                  className={cx(sortable && 'sx-sortable')}
                  aria-sort={dir === 1 ? 'ascending' : dir === -1 ? 'descending' : undefined}
                  tabIndex={sortable ? 0 : undefined}
                  onClick={sortable ? () => toggleSort(c.dataIndex) : undefined}
                  onKeyDown={
                    sortable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            toggleSort(c.dataIndex)
                          }
                        }
                      : undefined
                  }
                >
                  {c.text ?? c.dataIndex}
                  {sortable && (
                    <span className="sx-fence-table-sort" aria-hidden>
                      {dir === 1 ? '▲' : dir === -1 ? '▼' : ''}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          {rows.map((r, i) => (
            <div key={i} role="row" className="sx-fence-grid-row">
              {model.columns.map((c) => (
                <div key={c.dataIndex} role="cell" style={{ textAlign: c.align }}>
                  {display(r[c.dataIndex])}
                </div>
              ))}
            </div>
          ))}
          {rows.length === 0 && (
            <div role="row" className="sx-fence-grid-row">
              <div role="cell" className="sx-fence-table-empty">
                {model.rows.length ? '該当する行がありません' : 'データがありません'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
