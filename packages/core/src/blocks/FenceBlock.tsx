import { Component, useMemo, type ReactNode } from 'react'
import { cx } from '../utils'
import { fenceHeight, parseFenceData, parseFenceMeta } from './meta'
import { resolveFence, type FenceDefinition, type FenceOptions } from './registry'

export interface FenceBlockProps {
  /** フェンスの言語名 (mermaid / echarts / csv ...) */
  lang: string
  /** フェンス本文 */
  code?: string
  /** フェンスの meta 部 (`height=320 theme=dark` など)。remark-mock がそのまま渡す */
  meta?: string
  /** 表示高さ。meta の height より優先 */
  height?: number | string
  /** uivolve のテーマ名 (neptune / classic / gray / dark)。meta の theme より優先 */
  theme?: string
  className?: string
}

/**
 * 描画失敗の表示: エラー文と元のソースを並べる (他のブロックには波及させない)。
 * <pre> を使わないのは埋め込み先ページの pre / code の CSS に崩されないため
 */
function FenceError({ label, message, source }: { label: string; message: string; source: string }) {
  return (
    <div className="sx-fence-error" role="alert">
      <div className="sx-fence-error-head">{label} の描画エラー</div>
      <div className="sx-fence-error-message">{message}</div>
      <div className="sx-fence-error-source">{source}</div>
    </div>
  )
}

interface BoundaryProps {
  label: string
  source: string
  children: ReactNode
}

class FenceBoundary extends Component<BoundaryProps, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <FenceError
          label={this.props.label}
          message={this.state.error.message}
          source={this.props.source}
        />
      )
    }
    return this.props.children
  }
}

/** kind: 'data' はここで解釈する (解釈エラーも境界に拾わせる) */
function FenceContent({
  def,
  lang,
  source,
  options,
}: {
  def: FenceDefinition
  lang: string
  source: string
  options: FenceOptions
}) {
  const data = useMemo(
    () => (def.kind === 'data' ? parseFenceData(source) : undefined),
    [def, source],
  )
  const Renderer = def.component
  return <Renderer source={source} data={data} options={options} lang={lang} />
}

/**
 * MDX のコードフェンス (```mermaid / ```echarts / ```csv ...) を描画するディスパッチャ。
 * remark-mock がフェンスを `<FenceBlock lang code meta />` に変換し、
 * ここで registerFence された描画コンポーネントを言語名で引く。
 * 描画ライブラリは各コンポーネント内で動的 import するので、使わないページでは読み込まれない。
 * 描画に失敗したらブロック内にエラー文と元のソースを表示する。
 *
 * ```tsx
 * <FenceBlock lang="mermaid" code={'graph LR; A-->B'} meta="height=240" />
 * ```
 */
export function FenceBlock({ lang, code = '', meta, height, theme, className }: FenceBlockProps) {
  const options = useMemo(() => parseFenceMeta(meta), [meta])
  const def = resolveFence(lang)
  const themeName = theme ?? (typeof options.theme === 'string' ? options.theme : undefined)
  const h = fenceHeight(height ?? options.height)

  return (
    <div
      className={cx(
        'sx-root',
        'sx-fence',
        `sx-fence-${lang.toLowerCase()}`,
        themeName && themeName !== 'neptune' && `sx-theme-${themeName}`,
        h && 'sx-fence-sized',
        className,
      )}
      style={h ? { height: h } : undefined}
    >
      {def ? (
        // 本文・meta・テーマが変わったら作り直す (エラー状態の解除とテーマ色の再取得)
        <FenceBoundary key={`${themeName}\n${meta}\n${code}`} label={def.label} source={code}>
          <FenceContent def={def} lang={lang} source={code} options={options} />
        </FenceBoundary>
      ) : (
        <FenceError label={lang} message={`未対応のフェンス言語です: ${lang}`} source={code} />
      )}
    </div>
  )
}
