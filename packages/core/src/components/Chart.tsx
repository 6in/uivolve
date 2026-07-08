import type { ComponentConfig, RendererProps } from '../types'
import { cx, styleOf } from '../utils'

// テーマを問わず判読できる系列色 (ExtJS の default カラーセットに近いトーン)
const PALETTE = ['#157fcc', '#ef8137', '#4caf50', '#9061c2', '#d9a520', '#cd5c5c']

// SVG の論理サイズ (viewBox)。実表示は CSS で伸縮する
const W = 460
const H = 240

interface SeriesConfig {
  type?: string
  xField?: string
  yField?: string | string[]
  title?: string | string[]
}

/** 目盛り上限を 1 / 2 / 5 × 10^n の切りの良い値に丸める */
function niceMax(v: number): number {
  if (v <= 0) return 1
  const pow = 10 ** Math.floor(Math.log10(v))
  const d = v / pow
  return (d <= 1 ? 1 : d <= 2 ? 2 : d <= 5 ? 5 : 10) * pow
}

function dataOf(config: ComponentConfig): Array<Record<string, unknown>> {
  if (Array.isArray(config.data)) return config.data
  if (Array.isArray(config.store)) return config.store
  return config.store?.data ?? []
}

function num(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

/**
 * xtype: 'chart' | 'cartesian' | 'polar' — 簡易チャート (SVG 自前描画)。
 * ExtJS の Ext.chart と同じ形の series: [{ type, xField, yField }] + store.data から描画する。
 * type: 'bar' | 'line' | 'area' | 'pie' (xtype: 'polar' の既定は pie)。
 * yField は配列でグループ棒 / 複数系列に対応し、複数系列と pie は凡例を自動表示
 * (凡例名は series[0].title で上書き可)。
 * モックの簡易版につき最初の series のみ使用し、axes などの詳細 config は無視する。
 */
export function Chart({ config }: RendererProps) {
  const data = dataOf(config)
  const seriesRaw = config.series
  const series: SeriesConfig = (Array.isArray(seriesRaw) ? seriesRaw[0] : seriesRaw) ?? {}
  const type = series.type ?? (config.xtype === 'polar' ? 'pie' : 'bar')
  const xField = series.xField ?? 'name'
  const yFields = Array.isArray(series.yField) ? series.yField : [series.yField ?? 'value']
  const titles = Array.isArray(series.title) ? series.title : series.title ? [series.title] : yFields

  return (
    <div className={cx('sx-chart', config.cls)} style={styleOf(config)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="sx-chart-svg" role="img">
        {data.length === 0 ? (
          <text x={W / 2} y={H / 2} textAnchor="middle">
            データがありません
          </text>
        ) : type === 'pie' ? (
          <Pie data={data} xField={xField} yField={yFields[0]} />
        ) : (
          <Cartesian data={data} type={type} xField={xField} yFields={yFields} titles={titles} />
        )}
      </svg>
    </div>
  )
}

function Cartesian({
  data,
  type,
  xField,
  yFields,
  titles,
}: {
  data: Array<Record<string, unknown>>
  type: string
  xField: string
  yFields: string[]
  titles: string[]
}) {
  const legend = yFields.length > 1
  const x0 = 48
  const x1 = W - 12
  const y1 = legend ? 34 : 16
  const y0 = H - 28
  const max = niceMax(Math.max(...data.flatMap((row) => yFields.map((f) => num(row[f])))))
  const catW = (x1 - x0) / data.length
  const yOf = (v: number) => y0 - ((y0 - y1) * v) / max

  const ticks = [0, 1, 2, 3, 4].map((i) => {
    const v = (max * i) / 4
    const y = yOf(v)
    return (
      <g key={i}>
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="var(--sx-border)" strokeWidth={i === 0 ? 1 : 0.5} />
        <text x={x0 - 6} y={y + 3.5} textAnchor="end">
          {v >= 10000 ? `${v / 1000}k` : v}
        </text>
      </g>
    )
  })

  const xLabels = data.map((row, i) => (
    <text key={i} x={x0 + catW * (i + 0.5)} y={y0 + 16} textAnchor="middle">
      {String(row[xField] ?? '')}
    </text>
  ))

  let plot
  if (type === 'bar') {
    const barW = (catW * 0.66) / yFields.length
    plot = data.map((row, i) =>
      yFields.map((f, k) => {
        const v = num(row[f])
        const bx = x0 + catW * (i + 0.5) - (barW * yFields.length) / 2 + barW * k
        return (
          <rect
            key={`${i}-${k}`}
            x={bx}
            y={yOf(v)}
            width={barW - 1}
            height={y0 - yOf(v)}
            rx={1.5}
            fill={PALETTE[k % PALETTE.length]}
          />
        )
      }),
    )
  } else {
    // line / area
    plot = yFields.map((f, k) => {
      const pts = data.map((row, i) => [x0 + catW * (i + 0.5), yOf(num(row[f]))] as const)
      const color = PALETTE[k % PALETTE.length]
      const line = pts.map((p) => p.join(',')).join(' ')
      return (
        <g key={k}>
          {type === 'area' && (
            <polygon
              points={`${x0 + catW * 0.5},${y0} ${line} ${x0 + catW * (data.length - 0.5)},${y0}`}
              fill={color}
              opacity={0.18}
            />
          )}
          <polyline points={line} fill="none" stroke={color} strokeWidth={2} />
          {pts.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={2.8} fill={color} />
          ))}
        </g>
      )
    })
  }

  return (
    <>
      {legend && (
        <g>
          {yFields.map((f, k) => (
            <g key={k} transform={`translate(${x0 + k * 90}, 12)`}>
              <rect width={10} height={10} rx={2} fill={PALETTE[k % PALETTE.length]} />
              <text x={14} y={9}>
                {titles[k] ?? f}
              </text>
            </g>
          ))}
        </g>
      )}
      {ticks}
      {plot}
      {xLabels}
    </>
  )
}

function Pie({
  data,
  xField,
  yField,
}: {
  data: Array<Record<string, unknown>>
  xField: string
  yField: string
}) {
  const cx0 = 118
  const cy0 = H / 2
  const r = 92
  const total = data.reduce((sum, row) => sum + num(row[yField]), 0) || 1
  let angle = -Math.PI / 2

  const slices = data.map((row, i) => {
    const v = num(row[yField])
    const a0 = angle
    const a1 = (angle += (v / total) * Math.PI * 2)
    const large = a1 - a0 > Math.PI ? 1 : 0
    const p0 = [cx0 + r * Math.cos(a0), cy0 + r * Math.sin(a0)]
    const p1 = [cx0 + r * Math.cos(a1), cy0 + r * Math.sin(a1)]
    return (
      <path
        key={i}
        d={`M ${cx0} ${cy0} L ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${large} 1 ${p1[0]} ${p1[1]} Z`}
        fill={PALETTE[i % PALETTE.length]}
        stroke="var(--sx-panel-bg)"
        strokeWidth={1.5}
      />
    )
  })

  const legend = data.map((row, i) => {
    const v = num(row[yField])
    return (
      <g key={i} transform={`translate(240, ${cy0 - data.length * 10 + i * 20})`}>
        <rect width={10} height={10} rx={2} fill={PALETTE[i % PALETTE.length]} />
        <text x={16} y={9}>
          {String(row[xField] ?? '')} — {Math.round((v / total) * 100)}%
        </text>
      </g>
    )
  })

  return (
    <>
      {slices}
      {legend}
    </>
  )
}
