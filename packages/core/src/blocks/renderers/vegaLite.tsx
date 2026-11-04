import { useEffect, useRef } from 'react'
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
  const sized = options.height !== undefined

  useEffect(() => {
    if (!palette) return
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      throwAsync(new Error('Vega-Lite の spec はオブジェクト ({ mark: ..., encoding: ... }) で書いてください'))
      return
    }
    const spec = { ...(data as Record<string, unknown>) }
    spec.width ??= 'container'
    if (sized) spec.height ??= 'container'
    const mode = String(spec.$schema ?? '').includes('/vega/') ? 'vega' : 'vega-lite'

    let alive = true
    let finalize = () => {}
    import('vega-embed')
      .then(({ default: embed }) => {
        const el = ref.current
        if (!alive || !el) return
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
