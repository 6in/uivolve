import type { MermaidConfig } from 'mermaid'

// mermaid.render に渡す一意 ID 用の連番
let seq = 0
// mermaid.initialize はグローバル設定なので、テーマの違う描画が混ざらないよう直列化する
let queue: Promise<unknown> = Promise.resolve()

/**
 * Mermaid 記法を SVG 文字列にする (xtype: 'mermaid' と ```mermaid フェンスで共用)。
 * mermaid 本体は初回呼び出し時に動的 import する。構文エラーは例外になる
 */
export function renderMermaidSvg(source: string, config: MermaidConfig): Promise<string> {
  const run = async () => {
    const mermaid = (await import('mermaid')).default
    const id = `sx-mermaid-${++seq}`
    mermaid.initialize({ startOnLoad: false, ...config })
    try {
      return (await mermaid.render(id, source)).svg
    } catch (e) {
      // mermaid は失敗時に作業用要素を残すことがあるので掃除する
      document.getElementById(id)?.remove()
      document.getElementById(`d${id}`)?.remove()
      throw e
    }
  }
  const result = queue.then(run, run)
  queue = result.catch(() => undefined)
  return result
}
