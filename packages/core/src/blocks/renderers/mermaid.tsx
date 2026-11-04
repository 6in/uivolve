import type { MermaidConfig } from 'mermaid'
import { useEffect, useRef, useState } from 'react'
import { renderMermaidSvg } from '../mermaidCore'
import type { FenceRendererProps } from '../registry'
import { mixHex, useAsyncError, useSxPalette, type SxPalette } from '../theme'

/** --sx-* の色を mermaid の base テーマ変数に割り当てる (dbml フェンスも使う) */
export function mermaidThemeConfig(p: SxPalette): MermaidConfig {
  return {
    theme: 'base',
    themeVariables: {
      darkMode: p.dark,
      background: p.panelBg,
      fontFamily: p.fontFamily,
      fontSize: '14px',
      primaryColor: mixHex(p.panelBg, p.accent, 0.14),
      primaryTextColor: p.text,
      primaryBorderColor: p.accent,
      secondaryColor: mixHex(p.panelBg, p.series[1], 0.16),
      tertiaryColor: mixHex(p.panelBg, p.bg, 0.6),
      lineColor: p.muted,
      textColor: p.text,
      noteBkgColor: mixHex(p.panelBg, p.series[4], 0.2),
      noteTextColor: p.text,
      noteBorderColor: p.series[4],
    },
  }
}

/** Mermaid 記法の SVG を描く。dbml フェンスは記法を変換してからこれを使う */
export function MermaidSvg({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const palette = useSxPalette(ref)
  const throwAsync = useAsyncError()
  const [svg, setSvg] = useState('')

  useEffect(() => {
    if (!palette) return
    let alive = true
    renderMermaidSvg(source, mermaidThemeConfig(palette)).then(
      (s) => alive && setSvg(s),
      (e) => alive && throwAsync(e),
    )
    return () => {
      alive = false
    }
  }, [source, palette, throwAsync])

  return <div ref={ref} className="sx-fence-svg" dangerouslySetInnerHTML={{ __html: svg }} />
}

/** ```mermaid — Mermaid.js のダイアグラム (フローチャート / シーケンス / ER / ガント など) */
export function MermaidFence({ source }: FenceRendererProps) {
  return <MermaidSvg source={source} />
}
