import { Component, useMemo, type ReactNode } from 'react'
import { XRender } from './XRender'
import { parseDsl } from './parser'
import type { ComponentConfig } from './types'
import { cx, toCssSize } from './utils'

/** 組み込みテーマ名 (styles.css の .sx-theme-* に対応) */
export type ThemeName = 'neptune' | 'classic' | 'gray' | 'dark'

export interface ExtMockupProps {
  /** ExtJS 互換 DSL (JSON5) のソース文字列 */
  code?: string
  /** パース済み config を直接渡す場合 */
  config?: ComponentConfig
  height?: number | string
  /** テーマ。省略時 (または 'neptune') はデフォルトテーマ */
  theme?: ThemeName | (string & {})
  className?: string
}

interface BoundaryProps {
  children: ReactNode
}

interface BoundaryState {
  error: Error | null
}

class RenderBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <div className="sx-error">描画エラー: {this.state.error.message}</div>
    }
    return this.props.children
  }
}

/**
 * DSL から画面モックを描画するトップレベルコンポーネント。
 *
 * ```tsx
 * <ExtMockup code={`{ xtype: 'panel', title: 'Hello' }`} height={400} />
 * ```
 */
export function ExtMockup({ code, config, height, theme, className }: ExtMockupProps) {
  const result = useMemo(() => {
    if (config) return { config, error: null as string | null }
    if (code === undefined) return { config: null, error: null }
    try {
      return { config: parseDsl(code), error: null }
    } catch (e) {
      return { config: null, error: (e as Error).message }
    }
  }, [code, config])

  return (
    <div
      className={cx('sx-root', theme && theme !== 'neptune' && `sx-theme-${theme}`, className)}
      style={{ height: toCssSize(height) }}
    >
      {result.error ? (
        <div className="sx-error">構文エラー: {result.error}</div>
      ) : result.config ? (
        <RenderBoundary key={code}>
          <div className="sx-viewport">
            <XRender config={result.config} />
          </div>
        </RenderBoundary>
      ) : null}
    </div>
  )
}
