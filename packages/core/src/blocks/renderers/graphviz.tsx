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

let measureCtx: CanvasRenderingContext2D | null = null

/**
 * SVG の <title> (= DOT に書かれた ID そのまま。\n などのエスケープも残っている) を "..." で囲む。
 * バックスラッシュは二重にしない (二重にすると別のノードになる)。
 * 末尾が \ の ID は閉じ引用符を壊すので null (そのノードは補正しない)
 */
function dotQuote(s: string): string | null {
  if (/\\$/.test(s)) return null
  return `"${s.replace(/\\?"/g, (m) => (m === '"' ? '\\"' : m))}"`
}

/**
 * ルートのグラフを閉じる } の位置。文字列 ("...")・コメント (// # /* *\/)・HTML ラベル (<...>) の
 * 中の括弧は数えない。末尾のコメントに } があっても正しい位置を返す。見つからなければ -1
 */
function rootCloseIndex(src: string): number {
  let depth = 0
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (ch === '"') {
      for (i++; i < src.length && src[i] !== '"'; i++) if (src[i] === '\\') i++
    } else if (ch === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++
    } else if (ch === '#' && (i === 0 || src[i - 1] === '\n')) {
      while (i < src.length && src[i] !== '\n') i++
    } else if (ch === '/' && src[i + 1] === '*') {
      const close = src.indexOf('*/', i + 2)
      i = close < 0 ? src.length : close + 1
    } else if (ch === '<') {
      for (let nest = 1, j = i + 1; j < src.length; j++) {
        if (src[j] === '<') nest++
        else if (src[j] === '>' && --nest === 0) {
          i = j
          break
        }
      }
    } else if (ch === '{') {
      depth++
    } else if (ch === '}' && --depth === 0) {
      return i
    }
  }
  return -1
}

/**
 * Graphviz (wasm) は文字幅を内蔵のフォント表で見積もるため、日本語などの全角文字を
 * 実際 (約 1em) より狭く (約 0.75em) 見積もり、ラベルが枠からはみ出す。
 * 非 ASCII を含む場合だけ、1 回目の配置結果のラベルをブラウザで実測し、
 * 足りないノードに最小幅 (width) を指定して配置し直す。ASCII だけの図は 1 回で終わる
 */
function layoutWithMeasuredLabels(gv: Graphviz, source: string, engine: string): string {
  const first = gv.layout(source, 'svg', engine as 'dot')
  if (!/[^\x00-\x7f]/.test(source)) return first

  measureCtx ??= document.createElement('canvas').getContext('2d')
  if (!measureCtx) return first
  const doc = new DOMParser().parseFromString(first, 'image/svg+xml')
  const fixes: string[] = []
  for (const g of doc.querySelectorAll('g.node')) {
    const id = g.querySelector('title')?.textContent
    const texts = [...g.querySelectorAll('text')]
    const ellipse = g.querySelector('ellipse')
    const polygon = g.querySelector('polygon')
    if (!id || !texts.length || (!ellipse && !polygon)) continue

    let textWidth = 0
    for (const t of texts) {
      measureCtx.font = `${t.getAttribute('font-size') ?? 14}px ${t.getAttribute('font-family') ?? 'serif'}`
      textWidth = Math.max(textWidth, measureCtx.measureText(t.textContent ?? '').width)
    }
    // 楕円は内接させるので √2 倍、枠と文字の間に左右 8pt ずつの余白
    const required = (textWidth + 16) * (ellipse ? Math.SQRT2 : 1)
    let current: number
    if (ellipse) {
      current = 2 * Number(ellipse.getAttribute('rx'))
    } else {
      const xs = (polygon!.getAttribute('points') ?? '').split(/\s+/).map((p) => Number(p.split(',')[0]))
      current = Math.max(...xs) - Math.min(...xs)
    }
    const quoted = dotQuote(id)
    if (quoted && required > current + 0.5) fixes.push(`${quoted} [width=${(required / 72).toFixed(3)}]`)
  }
  if (!fixes.length) return first

  // ルートのグラフの閉じ括弧の直前にノード属性を足す (既存ノードへの属性追加になる)。
  // 補正は見た目の改善にすぎないので、2 回目が失敗したら 1 回目の結果を使う
  const end = rootCloseIndex(source)
  if (end < 0) return first
  try {
    return gv.layout(`${source.slice(0, end)}\n${fixes.join('\n')}\n${source.slice(end)}`, 'svg', engine as 'dot')
  } catch {
    return first
  }
}

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
      .then((gv) => themeSvg(layoutWithMeasuredLabels(gv, source, engine), palette))
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
