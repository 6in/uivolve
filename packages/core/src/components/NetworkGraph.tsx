import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force'
import { useEffect, useMemo, useRef } from 'react'
import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

const PALETTE = ['#157fcc', '#ef8137', '#4caf50', '#9061c2', '#d9a520', '#cd5c5c']

// SVG の論理サイズ (viewBox)
const W = 640
const H = 420

interface GraphNode extends SimulationNodeDatum {
  id: string
  text?: string
  group?: number | string
  color?: string
  r?: number
}

type GraphLink = SimulationLinkDatum<GraphNode>

function colorOf(node: GraphNode, groups: Array<number | string>): string {
  if (node.color) return node.color
  const gi = node.group === undefined ? 0 : groups.indexOf(node.group)
  return PALETTE[Math.max(0, gi) % PALETTE.length]
}

/**
 * xtype: 'networkgraph' — 力学レイアウトのノード・エッジグラフ (ExtJS にはない独自拡張)。
 * nodes: [{ id, text, group, color, r }] と edges: [{ from, to }] から
 * d3-force で自動レイアウトする。GraphDB のスキーマ図や依存関係の表現向け。
 * group ごとに自動配色し、シミュレーションは常時ゆるく動き続ける。
 * ノードはドラッグで引っ張れる (掴んでいる間は再加熱される)。
 */
export function NetworkGraph({ config }: RendererProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const nodeRefs = useRef(new Map<string, SVGGElement>())
  const edgeRefs = useRef(new Map<number, SVGLineElement>())

  // config からシミュレーション用の可変オブジェクトを作る (元 config は変異させない)
  const { nodes, links, groups } = useMemo(() => {
    const rawNodes = Array.isArray(config.nodes) ? config.nodes : []
    const rawEdges = Array.isArray(config.edges) ? config.edges : []
    const nodes: GraphNode[] = rawNodes.map((n, i) => ({
      ...n,
      // 初期位置を円周上に散らして NaN 描画を防ぐ
      x: W / 2 + 130 * Math.cos((2 * Math.PI * i) / Math.max(1, rawNodes.length)),
      y: H / 2 + 130 * Math.sin((2 * Math.PI * i) / Math.max(1, rawNodes.length)),
    }))
    const ids = new Set(nodes.map((n) => n.id))
    const links: GraphLink[] = rawEdges
      .filter((e) => ids.has(e.from) && ids.has(e.to))
      .map((e) => ({ source: e.from, target: e.to }))
    const groups = [...new Set(nodes.map((n) => n.group).filter((g) => g !== undefined))] as Array<
      number | string
    >
    return { nodes, links, groups }
  }, [config.nodes, config.edges])

  useEffect(() => {
    const sim = forceSimulation(nodes)
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(58)
          .strength(0.4),
      )
      .force('charge', forceManyBody().strength(-170))
      .force('center', forceCenter(W / 2, H / 2))
      .force('collide', forceCollide<GraphNode>((d) => (d.r ?? 9) + 7))
      // 完全には収束させず、常時ゆるく揺らし続ける
      .alphaTarget(0.015)
      .on('tick', () => {
        for (const n of nodes) {
          nodeRefs.current.get(n.id)?.setAttribute('transform', `translate(${n.x},${n.y})`)
        }
        links.forEach((l, i) => {
          const el = edgeRefs.current.get(i)
          const s = l.source as GraphNode
          const t = l.target as GraphNode
          if (el && s.x !== undefined && t.x !== undefined) {
            el.setAttribute('x1', String(s.x))
            el.setAttribute('y1', String(s.y))
            el.setAttribute('x2', String(t.x))
            el.setAttribute('y2', String(t.y))
          }
        })
      })

    // ドラッグでノードを引っ張れるようにする
    const dragStart = (node: GraphNode) => (e: PointerEvent) => {
      const svg = svgRef.current
      if (!svg) return
      e.preventDefault()
      const toLocal = (ev: PointerEvent) => {
        const pt = svg.createSVGPoint()
        pt.x = ev.clientX
        pt.y = ev.clientY
        return pt.matrixTransform(svg.getScreenCTM()!.inverse())
      }
      sim.alphaTarget(0.3).restart()
      const move = (ev: PointerEvent) => {
        const p = toLocal(ev)
        node.fx = p.x
        node.fy = p.y
      }
      const up = () => {
        node.fx = null
        node.fy = null
        sim.alphaTarget(0.015)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    }
    const cleanups = nodes.map((n) => {
      const el = nodeRefs.current.get(n.id)
      if (!el) return () => {}
      const handler = dragStart(n)
      el.addEventListener('pointerdown', handler)
      return () => el.removeEventListener('pointerdown', handler)
    })

    return () => {
      cleanups.forEach((fn) => fn())
      sim.stop()
    }
  }, [nodes, links])

  return (
    <div className={cx('sx-networkgraph', config.cls)} style={styleOf(config)}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="sx-networkgraph-svg" role="img">
        {links.map((_, i) => (
          <line
            key={i}
            ref={(el) => {
              if (el) edgeRefs.current.set(i, el)
              else edgeRefs.current.delete(i)
            }}
            className="sx-networkgraph-edge"
          />
        ))}
        {nodes.map((n) => (
          <g
            key={n.id}
            ref={(el) => {
              if (el) nodeRefs.current.set(n.id, el)
              else nodeRefs.current.delete(n.id)
            }}
            className="sx-networkgraph-node"
          >
            <circle r={n.r ?? 9} fill={colorOf(n, groups)} />
            <text dy={(n.r ?? 9) + 12}>{n.text ?? n.id}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
