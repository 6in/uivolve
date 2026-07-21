export interface RemarkUivolveOptions {
  /** 対象のフェンス言語 (default: ['uivolve', 'extjs', 'sx']) */
  langs?: string[]
  /** 出力する JSX コンポーネント名 (default: 'ExtMockup') */
  componentName?: string
  /** import 元 (default: '@uivolve/core') */
  importSource?: string
  /** height 未指定時の高さ (default: 360) */
  defaultHeight?: number | string
  /** Astro の client:load 属性を付ける (default: true) */
  clientLoad?: boolean
  /**
   * import 文を自動注入する (default: true)。
   * ブラウザ内で mdx の evaluate() を使う場合は false にして components prop で渡す
   */
  injectImport?: boolean
}

/**
 * Markdown / MDX 内の ```uivolve コードフェンスを <ExtMockup /> に変換する remark プラグイン
 */
export default function remarkUivolve(options?: RemarkUivolveOptions): (tree: unknown) => void
