import { useEffect, useRef } from 'react'
import { fenceHeight } from '../meta'
import type { FenceRendererProps } from '../registry'
import { useAsyncError, useSxPalette, type SxPalette } from '../theme'

/** --sx-* の色を Vega の config にする。spec 側の config が優先される */
function vegaConfig(p: SxPalette) {
  return {
    background: 'transparent',
    font: p.fontFamily,
    view: { stroke: p.border },
    title: { color: p.text, subtitleColor: p.muted },
    axis: {
      labelColor: p.muted,
      titleColor: p.text,
      domainColor: p.muted,
      tickColor: p.muted,
      gridColor: p.border,
    },
    legend: { labelColor: p.text, titleColor: p.text },
    header: { labelColor: p.text, titleColor: p.text },
    range: { category: p.series },
    mark: { color: p.accent },
  }
}

/**
 * ```vega-lite — Vega-Lite のチャート。本文は Vega-Lite の spec を JSON5 / YAML で書く
 * ($schema が Vega のものなら Vega の spec として描く)。
 * width 未指定ならブロック幅に合わせ、meta の height 指定時は高さもブロックに合わせる
 */
export function VegaLiteFence({ data, options }: FenceRendererProps) {
  const ref = useRef<HTMLDivElement>(null)
  const palette = useSxPalette(ref)
  const throwAsync = useAsyncError()
  // 値なしの `height` (true) は高さ指定とみなさない (FenceBlock も高さを固定しない)
  const sized = fenceHeight(options.height) !== undefined

  useEffect(() => {
    // data の形 (オブジェクト) は FenceBlock が shapes.ts で確認済み
    if (!palette) return
    const spec = { ...(data as Record<string, unknown>) }
    const mode = String(spec.$schema ?? '').includes('/vega/') ? 'vega' : 'vega-lite'
    // 'container' は Vega-Lite だけの指定 (Vega の spec に入れると幅が壊れる)
    if (mode === 'vega-lite') {
      spec.width ??= 'container'
      if (sized) spec.height ??= 'container'
    }

    let alive = true
    let finalize = () => {}
    import('vega-embed')
      .then(({ default: embed }) => {
        const el = ref.current
        if (!alive || !el) return
        // Vega の width は数値のみ (未指定だと 0)。ブロック幅を数値で渡す (左右の余白ぶん引く)
        if (mode === 'vega' && spec.width === undefined) spec.width = Math.max(100, el.clientWidth - 40)
        return embed(el, spec as never, {
          mode,
          actions: false,
          renderer: 'svg',
          defaultStyle: false,
          config: vegaConfig(palette),
        }).then((result) => {
          if (alive) finalize = () => result.finalize()
          else result.finalize()
        })
      })
      .catch((e) => alive && throwAsync(e))
    return () => {
      alive = false
      finalize()
    }
  }, [data, sized, palette, throwAsync])

  return <div ref={ref} className="sx-fence-chart sx-fence-vega" />
}
