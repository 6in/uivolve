import { useEffect, useRef, useState } from 'react'
import type { FenceRendererProps } from '../registry'
import { inkSvg, useAsyncError, useSxPalette } from '../theme'

// WaveDrom は描画番号を SVG 内の id に使うので、ページ内で重複しないよう連番にする
let seq = 0

/**
 * WaveDrom の SVG をページから隔離する。スキンの <style> は text{fill:...} のような
 * ページ全体に効くセレクタを含み、グリフの id (socket / pclk ...) も固定なので、
 * そのままだと他の図 (別スキンの波形や mermaid の文字) を書き換えてしまう。
 * - スキンのクラス名 (.s1 など) に連番の接尾辞を付ける。波形のグリフは <use> で複製され
 *   shadow tree 内に入るため、祖先を使うセレクタ (`[data-sx-wd] .s1`) では届かない
 * - クラス以外のセレクタ (text など) はこの SVG の属性セレクタで修飾する
 * - id と参照 (href="#...") に連番の接尾辞を付ける
 * - レーンの白背景を透明にする (dark スキンの白い線が見えるように)
 */
function isolateSvg(svg: string, n: number): string {
  const suffix = `-wd${n}`
  const scope = `[data-sx-wd="${n}"]`
  const ids = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))
  const classes = new Set<string>()
  for (const [, css] of svg.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    for (const [, cls] of css.matchAll(/\.([A-Za-z_][\w-]*)/g)) classes.add(cls)
  }
  const renameClasses = (sel: string) =>
    sel.replace(/\.([A-Za-z_][\w-]*)/g, (m, cls: string) => (classes.has(cls) ? `${m}${suffix}` : m))

  return svg
    .replace(/<svg\b/, `<svg data-sx-wd="${n}"`)
    .replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (_, open, css: string, close) => {
      const scoped = css.replace(/([^{}]+)\{/g, (_m, sels: string) =>
        `${sels
          .split(',')
          .map((s) => {
            const t = s.trim()
            return t.startsWith('.') ? renameClasses(t) : `${scope} ${renameClasses(t)}`
          })
          .join(',')}{`,
      )
      return open + scoped + close
    })
    .replace(/\bclass="([^"]*)"/g, (_, list: string) =>
      `class="${list
        .split(/\s+/)
        .map((c) => (classes.has(c) ? `${c}${suffix}` : c))
        .join(' ')}"`,
    )
    .replace(/\b(id="|href="#)([^"]+)"/g, (m, attr: string, id: string) =>
      ids.has(id) ? `${attr}${id}${suffix}"` : m,
    )
    .replaceAll('style="stroke:none;fill:white"', 'style="stroke:none;fill:none"')
}

/**
 * ```wavedrom — WaveDrom のタイミングチャート / ビットフィールド (reg) / 論理回路 (assign)。
 * 本文は WaveJSON (JSON5) か同じ構造の YAML。暗いテーマでは dark スキンを使う
 */
export function WaveDromFence({ data }: FenceRendererProps) {
  const ref = useRef<HTMLDivElement>(null)
  const palette = useSxPalette(ref)
  const throwAsync = useAsyncError()
  const [svg, setSvg] = useState('')

  useEffect(() => {
    if (!palette) return
    let alive = true
    Promise.all([import('wavedrom'), import('wavedrom/skins/dark.js')])
      .then(([mod, dark]) => {
        // CommonJS なので、バンドラにより exports が名前付き (Vite) / default (esbuild) のどちらかに入る
        type WaveDrom = typeof import('wavedrom')
        const wd = (mod as unknown as { default?: WaveDrom }).default ?? (mod as WaveDrom)
        if (data === null || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('WaveJSON はオブジェクト ({ signal: [...] } / { reg: [...] }) で書いてください')
        }
        // CommonJS の dark.js は環境により default にくるまれる/くるまれないの両方がある
        const darkSkins = (dark as { default?: Record<string, unknown> }).default ?? dark
        const skins = { ...wd.waveSkin, ...darkSkins }
        const source = { ...(data as Record<string, unknown>) }
        if (palette.dark) {
          source.config = { skin: 'dark', ...(source.config as object | undefined) }
        }
        const n = ++seq
        const svg = isolateSvg(wd.onml.stringify(wd.renderAny(n, source, skins)), n)
        // reg (ビットフィールド) / assign はスキンを使わず黒で描くので文字色に置き換える
        return source.signal ? svg : inkSvg(svg, palette)
      })
      .then(
        (s) => alive && setSvg(s),
        (e) => alive && throwAsync(e),
      )
    return () => {
      alive = false
    }
  }, [data, palette, throwAsync])

  return <div ref={ref} className="sx-fence-svg" dangerouslySetInnerHTML={{ __html: svg }} />
}
