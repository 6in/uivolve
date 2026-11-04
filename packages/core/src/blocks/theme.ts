import { useCallback, useLayoutEffect, useState, type RefObject } from 'react'

/**
 * 描画ライブラリに渡すテーマ色。--sx-* カスタムプロパティを実際の色 (#rrggbb) に解決したもの。
 * color-mix() などの式はライブラリ側 (mermaid / echarts) が解釈できないため、
 * ブラウザに計算させてから 1px の canvas で sRGB 値に落とす
 */
export interface SxPalette {
  text: string
  muted: string
  border: string
  /** ページ (コンテナ) の背景 */
  bg: string
  /** ブロック本体の背景 */
  panelBg: string
  accent: string
  /** 系列色 (先頭はアクセント色) */
  series: string[]
  dark: boolean
  fontFamily: string
}

// 系列色の 2 番目以降 (Chart.tsx の既定色と同じトーン)
const SERIES_REST = ['#ef8137', '#4caf50', '#9061c2', '#d9a520', '#cd5c5c', '#26a69a']

let canvasCtx: CanvasRenderingContext2D | null = null

/** 任意の CSS 色 (var() / color-mix() を含む) を el の文脈で #rrggbb に解決する */
function resolveColor(el: HTMLElement, cssColor: string): string {
  const probe = document.createElement('span')
  probe.style.color = cssColor
  probe.style.display = 'none'
  el.appendChild(probe)
  const computed = getComputedStyle(probe).color
  probe.remove()
  canvasCtx ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  if (!canvasCtx) return '#000000'
  canvasCtx.clearRect(0, 0, 1, 1)
  canvasCtx.fillStyle = '#000'
  canvasCtx.fillStyle = computed
  canvasCtx.fillRect(0, 0, 1, 1)
  const [r, g, b] = canvasCtx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** 2 色を t (0〜1, b の割合) で混ぜる */
export function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  return `#${pa
    .map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0'))
    .join('')}`
}

/**
 * 既定の黒 (stroke="black" / fill="black") で描く SVG をテーマの文字色に置き換える。
 * 色を明示した要素はそのまま。fill 属性のない文字は svg ルートの fill を継承させる
 * (Graphviz / WaveDrom のビットフィールドなど、テーマ指定の手段がないライブラリ向け)
 */
export function inkSvg(svg: string, p: SxPalette): string {
  return svg
    .replace(/<svg\b/, `<svg style="fill:${p.text}"`)
    .replaceAll('stroke="black"', `stroke="${p.text}"`)
    .replaceAll('fill="black"', `fill="${p.text}"`)
}

export function readSxPalette(el: HTMLElement): SxPalette {
  const panelBg = resolveColor(el, 'var(--sx-panel-bg)')
  const accent = resolveColor(el, 'var(--sx-accent)')
  return {
    text: resolveColor(el, 'var(--sx-text)'),
    muted: resolveColor(el, 'var(--sx-muted)'),
    border: resolveColor(el, 'var(--sx-border)'),
    bg: resolveColor(el, 'var(--sx-bg)'),
    panelBg,
    accent,
    series: [accent, ...SERIES_REST],
    dark: luminance(panelBg) < 0.5,
    fontFamily: getComputedStyle(el).fontFamily,
  }
}

/**
 * ref の要素から SxPalette を読む (初回描画後に確定するので最初は null)。
 * テーマ切替は FenceBlock が key を変えて再マウントするため、マウント時の 1 回だけ読む
 */
export function useSxPalette(ref: RefObject<HTMLElement | null>): SxPalette | null {
  const [palette, setPalette] = useState<SxPalette | null>(null)
  useLayoutEffect(() => {
    if (ref.current) setPalette(readSxPalette(ref.current))
  }, [ref])
  return palette
}

/**
 * 非同期処理 (動的 import / ライブラリの描画) の例外を最寄りの ErrorBoundary へ投げ直す。
 * FenceBlock の境界がエラー文 + ソースを表示する
 */
export function useAsyncError(): (e: unknown) => void {
  const [, setState] = useState<never>()
  return useCallback((e: unknown) => {
    setState(() => {
      throw e instanceof Error ? e : new Error(String(e))
    })
  }, [])
}
