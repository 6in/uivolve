import type { Graphviz } from '@hpcc-js/wasm-graphviz'
import { useEffect, useRef, useState } from 'react'
import type { FenceRendererProps } from '../registry'
import { inkSvg, useAsyncError, useSxPalette, type SxPalette } from '../theme'

// wasm の初期化は 1 回だけ (wasm は JS に内包されているので別ファイルの配信は不要)
let graphvizPromise: Promise<Graphviz> | null = null

function loadGraphviz(): Promise<Graphviz> {
  graphvizPromise ??= import('@hpcc-js/wasm-graphviz').then((m) => m.Graphviz.load())
  graphvizPromise.catch(() => {
    graphvizPromise = null
  })
  return graphvizPromise
}

const ENGINES = new Set(['dot', 'neato', 'fdp', 'sfdp', 'circo', 'twopi', 'osage', 'patchwork'])

/** Graphviz の既定色 (黒の線・文字、白の背景) だけをテーマ色に置き換える */
function themeSvg(svg: string, p: SxPalette): string {
  const transparentBg = svg.replace(
    /(<g id="graph0" class="graph"[^>]*>\s*(?:<title>[^<]*<\/title>\s*)?<polygon )fill="white"/,
    '$1fill="none"',
  )
  return inkSvg(transparentBg, p)
}

/** ```dot / ```graphviz — Graphviz (DOT 言語) の図。meta の engine=neato などでレイアウトを変えられる */
export function GraphvizFence({ source, options }: FenceRendererProps) {
  const ref = useRef<HTMLDivElement>(null)
  const palette = useSxPalette(ref)
  const throwAsync = useAsyncError()
  const [svg, setSvg] = useState('')
  const engine = typeof options.engine === 'string' && ENGINES.has(options.engine) ? options.engine : 'dot'

  useEffect(() => {
    if (!palette) return
    let alive = true
    loadGraphviz()
      .then((gv) => themeSvg(gv.layout(source, 'svg', engine as 'dot'), palette))
      .then(
        (s) => alive && setSvg(s),
        (e) => alive && throwAsync(e),
      )
    return () => {
      alive = false
    }
  }, [source, engine, palette, throwAsync])

  return <div ref={ref} className="sx-fence-svg" dangerouslySetInnerHTML={{ __html: svg }} />
}
