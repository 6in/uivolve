import { useEffect, useState } from 'react'
import type { FenceRendererProps } from '../registry'
import { useAsyncError } from '../theme'

/**
 * ```math — KaTeX による数式 (本文全体を 1 つのディスプレイ数式として描く。複数行は \\ や aligned で)。
 * MathML で出力するので KaTeX の CSS / フォントは不要 (ブラウザの MathML 描画を使う)
 */
export function MathFence({ source }: FenceRendererProps) {
  const throwAsync = useAsyncError()
  const [html, setHtml] = useState('')

  useEffect(() => {
    let alive = true
    import('katex')
      .then(({ default: katex }) =>
        katex.renderToString(source, {
          displayMode: true,
          output: 'mathml',
          throwOnError: true,
          // \text{日本語} などで警告をコンソールに出さない
          strict: 'ignore',
        }),
      )
      .then(
        (h) => alive && setHtml(h),
        (e) => alive && throwAsync(e),
      )
    return () => {
      alive = false
    }
  }, [source, throwAsync])

  return <div className="sx-fence-math" dangerouslySetInnerHTML={{ __html: html }} />
}
