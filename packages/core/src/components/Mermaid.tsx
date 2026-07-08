import { useEffect, useState } from 'react'
import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

// mermaid.render に渡す一意 ID 用の連番
let seq = 0

/**
 * xtype: 'mermaid' — Mermaid.js ダイアグラム描画 (ExtJS にはない独自拡張)。
 * value にフローチャート・シーケンス図・ER 図などの Mermaid 記法を指定する
 * (YAML 記法ならブロックスカラー value: | が書きやすい)。
 * mermaid 本体は初回描画時に動的 import するため、未使用時のバンドルコストはない。
 * 構文エラー時はエラーメッセージを表示する。
 */
export function Mermaid({ config }: RendererProps) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const value = (config.value as string | undefined) ?? ''

  useEffect(() => {
    let alive = true
    const id = `sx-mermaid-${++seq}`
    ;(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({ startOnLoad: false, theme: 'default' })
        const result = await mermaid.render(id, value)
        if (alive) {
          setSvg(result.svg)
          setError(null)
        }
      } catch (e) {
        // mermaid は失敗時に作業用要素を残すことがあるので掃除する
        document.getElementById(id)?.remove()
        if (alive) {
          setSvg('')
          setError(e instanceof Error ? e.message : String(e))
        }
      }
    })()
    return () => {
      alive = false
    }
  }, [value])

  if (error) {
    return (
      <div className={cx('sx-mermaid', 'sx-mermaid-error', config.cls)} style={styleOf(config)}>
        Mermaid 構文エラー: {error}
      </div>
    )
  }
  return (
    <div
      className={cx('sx-mermaid', config.cls)}
      style={styleOf(config)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
