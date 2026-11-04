import { useEffect, useRef } from 'react'
import type { FenceRendererProps } from '../registry'
import { useAsyncError, useSxPalette, type SxPalette } from '../theme'

/** --sx-* の色を ECharts のテーマ (init の第 2 引数) にする。option 側の指定が優先される */
function echartsTheme(p: SxPalette) {
  const axis = {
    axisLine: { lineStyle: { color: p.muted } },
    axisTick: { lineStyle: { color: p.muted } },
    axisLabel: { color: p.muted },
    splitLine: { lineStyle: { color: p.border } },
    nameTextStyle: { color: p.text },
  }
  return {
    color: p.series,
    backgroundColor: 'transparent',
    textStyle: { color: p.text, fontFamily: p.fontFamily },
    title: { textStyle: { color: p.text }, subtextStyle: { color: p.muted } },
    legend: { textStyle: { color: p.text } },
    tooltip: {
      backgroundColor: p.panelBg,
      borderColor: p.border,
      textStyle: { color: p.text },
    },
    categoryAxis: axis,
    valueAxis: axis,
    timeAxis: axis,
    logAxis: axis,
    // 円グラフの外側ラベルは既定で縁取りが付き、暗いテーマで読みにくい
    pie: { label: { color: p.text, textBorderWidth: 0 } },
  }
}

/**
 * ```echarts — Apache ECharts のチャート。本文は ECharts の option をそのまま JSON5 / YAML で書く。
 * 高さは meta の height (省略時 320px)。幅はブロックに合わせて伸縮する
 */
export function EChartsFence({ data }: FenceRendererProps) {
  const ref = useRef<HTMLDivElement>(null)
  const palette = useSxPalette(ref)
  const throwAsync = useAsyncError()

  useEffect(() => {
    // data の形 (オブジェクト) は FenceBlock が shapes.ts で確認済み
    if (!palette) return
    let alive = true
    let dispose = () => {}
    import('echarts')
      .then((echarts) => {
        const el = ref.current
        if (!alive || !el) return
        const chart = echarts.init(el, echartsTheme(palette), { renderer: 'svg' })
        chart.setOption(data as Record<string, unknown>)
        const ro = new ResizeObserver(() => chart.resize())
        ro.observe(el)
        dispose = () => {
          ro.disconnect()
          chart.dispose()
        }
      })
      .catch((e) => alive && throwAsync(e))
    return () => {
      alive = false
      dispose()
    }
  }, [data, palette, throwAsync])

  return <div ref={ref} className="sx-fence-chart" />
}
