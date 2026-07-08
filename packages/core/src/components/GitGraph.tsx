import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

// ブランチレーンの色 (Chart と同系のパレット)
const LANE_COLORS = ['#157fcc', '#ef8137', '#4caf50', '#9061c2', '#d9a520', '#cd5c5c']

const ROW_H = 30
const LANE_W = 26
const DOT_R = 5.5

interface GitCommit {
  id?: string
  branch?: string
  parents?: string[]
  message?: string
  tag?: string
}

/**
 * xtype: 'gitgraph' — Git のマージツリー描画 (ExtJS にはない独自拡張)。
 * commits: [{ id, branch, parents: [親id], message, tag }] を上から古い順に並べ、
 * ブランチごとのレーン + マージ曲線 + コミットメッセージの一覧を gitk 風に表示する。
 * レーンの並びは branches: ['main', 'develop', ...] で指定 (省略時は登場順)。
 * ブランチ名のチップとタグ (tag) も表示する。
 */
export function GitGraph({ config }: RendererProps) {
  const commits: GitCommit[] = Array.isArray(config.commits) ? (config.commits as GitCommit[]) : []
  const branches: string[] =
    Array.isArray(config.branches) && config.branches.length > 0
      ? (config.branches as string[])
      : [...new Set(commits.map((c) => c.branch ?? 'main'))]

  const laneOf = (branch?: string) => Math.max(0, branches.indexOf(branch ?? 'main'))
  const colorOf = (branch?: string) => LANE_COLORS[laneOf(branch) % LANE_COLORS.length]
  const xOf = (lane: number) => lane * LANE_W + LANE_W / 2
  const yOf = (row: number) => row * ROW_H + ROW_H / 2
  const rowOf = new Map(commits.map((c, i) => [c.id ?? String(i), i]))

  const svgW = branches.length * LANE_W
  const svgH = commits.length * ROW_H

  // 親コミットへの接続線 (親は上、子は下)。レーンが違う場合はベジェで曲げる
  const links = commits.flatMap((c, row) =>
    (c.parents ?? []).flatMap((pid) => {
      const pRow = rowOf.get(pid)
      if (pRow === undefined) return []
      const parent = commits[pRow]
      const x1 = xOf(laneOf(c.branch))
      const y1 = yOf(row)
      const x2 = xOf(laneOf(parent.branch))
      const y2 = yOf(pRow)
      const d =
        x1 === x2
          ? `M ${x1} ${y1} L ${x2} ${y2}`
          : `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`
      // マージ線は子側 (取り込んだブランチ) の色にする
      return [{ d, color: colorOf(x1 === x2 ? c.branch : parent.branch), key: `${row}-${pid}` }]
    }),
  )

  return (
    <div className={cx('sx-gitgraph', config.cls)} style={styleOf(config)}>
      <svg width={svgW} height={svgH} className="sx-gitgraph-svg" aria-hidden>
        {links.map((l) => (
          <path key={l.key} d={l.d} fill="none" stroke={l.color} strokeWidth={2} />
        ))}
        {commits.map((c, row) => (
          <circle
            key={row}
            cx={xOf(laneOf(c.branch))}
            cy={yOf(row)}
            r={DOT_R}
            fill={colorOf(c.branch)}
            stroke="var(--sx-panel-bg)"
            strokeWidth={1.5}
          />
        ))}
      </svg>
      <div className="sx-gitgraph-rows">
        {commits.map((c, row) => (
          <div key={row} className="sx-gitgraph-row" style={{ blockSize: ROW_H }}>
            <span
              className="sx-gitgraph-branch"
              style={{ borderColor: colorOf(c.branch), color: colorOf(c.branch) }}
            >
              {c.branch ?? 'main'}
            </span>
            <span className="sx-gitgraph-msg">{c.message}</span>
            {c.tag && <span className="sx-gitgraph-tag">🏷 {c.tag}</span>}
            {c.id && <span className="sx-gitgraph-id">{c.id}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
