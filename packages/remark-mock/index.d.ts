/** readFile に渡されるコンパイル対象 (VFile) の情報 */
export interface ReadFileContext {
  /** MDX ファイルのパス (ブラウザ内 evaluate() では undefined) */
  path?: string
  /** MDX ファイルのディレクトリ (相対 src の基準) */
  dirname?: string
  cwd?: string
}

export interface RemarkUivolveOptions {
  /** 対象のフェンス言語 (default: ['uivolve', 'extjs', 'sx']) */
  langs?: string[]
  /**
   * src 参照に使うタグ名 (default: ['uivolve'])。
   * componentName (ExtMockup) に src 属性を付けた場合も同様に展開される
   */
  tagNames?: string[]
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
  /**
   * <uivolve src="..."> の読み込み。既定は Node の fs (MDX ファイル相対で解決、
   * http(s) は fetch)。ブラウザ内 evaluate() では必ず指定する。
   * null / undefined を返すと code なしの <ExtMockup src="..." /> を出力する
   * (components で ExtMockup をラップしてプレースホルダを描画できる)。
   * 例外を投げるとコンパイルエラーになる
   */
  readFile?: (
    src: string,
    ctx: ReadFileContext,
  ) => string | null | undefined | Promise<string | null | undefined>
}

/**
 * Markdown / MDX 内の ```uivolve コードフェンスと <uivolve src="..." /> タグを
 * <ExtMockup /> に変換する remark プラグイン
 */
export default function remarkUivolve(
  options?: RemarkUivolveOptions,
): (tree: unknown, file?: unknown) => Promise<void>

/**
 * MDX が構文エラーにする HTML コメント (<!-- -->) を除去する。
 * コードフェンス内・インラインコード内は保持し、除去部分の改行は残す
 */
export function stripHtmlComments(source: string): string

/**
 * src 参照の既定の読み込み (Node 向け)。http(s) は fetch、それ以外は
 * MDX ファイルのディレクトリ基準で fs から読む
 */
export function defaultReadFile(src: string, ctx?: ReadFileContext): Promise<string>
