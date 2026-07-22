/**
 * uivolve Preview の Webview 側アプリ。
 * extension host からの postMessage ({ type: 'update', mode, code }) を受けて、
 * - mode 'dsl': DSL 1 枚を ExtMockup で描画
 * - mode 'mdx': MDX / Markdown を @mdx-js/mdx の evaluate でコンパイルして描画
 *   (MDX Playground と同じ仕組み。エラー中は最後に成功した内容を保持)
 */
import { evaluate } from '@mdx-js/mdx'
import { ExtMockup, XRender, type ComponentConfig } from '@uivolve/core'
import remarkUivolve, { stripHtmlComments } from '@uivolve/remark-mock'
import {
  Component,
  StrictMode,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createRoot } from 'react-dom/client'
import * as jsxRuntime from 'react/jsx-runtime'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@uivolve/core/styles.css'
import './webview.css'

declare function acquireVsCodeApi(): { postMessage(message: unknown): void }

const vscodeApi =
  typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : { postMessage() {} }

interface UpdateMessage {
  type: 'update'
  mode: 'dsl' | 'mdx'
  code: string
  fileName: string
}

type MdxContent = ComponentType<{ components?: Record<string, ComponentType<never>> }>

class PreviewBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <div className="uv-error">描画エラー: {this.state.error.message}</div>
    }
    return this.props.children
  }
}

/**
 * ```mermaid フェンスを Mermaid.js で描画する pre の差し替え。
 * MDX は ```mermaid を <pre><code class="language-mermaid"> にコンパイルするので、
 * それを検出して core の Mermaid レンダラー (xtype: 'mermaid'、registry 経由) に渡す。
 * それ以外のコードフェンスは通常の <pre> のまま。
 */
function PreOrMermaid(props: ComponentProps<'pre'>) {
  const child = props.children as ReactElement<{ className?: string; children?: unknown }>
  if (isValidElement(child) && /\blanguage-mermaid\b/.test(child.props.className ?? '')) {
    const text = String(child.props.children ?? '').replace(/\n$/, '')
    return (
      <div className="uv-mermaid">
        <XRender config={{ xtype: 'mermaid', value: text } as ComponentConfig} />
      </div>
    )
  }
  return <pre {...props} />
}

const MDX_COMPONENTS = {
  ExtMockup: ExtMockup as ComponentType<never>,
  pre: PreOrMermaid as ComponentType<never>,
}

function MdxPreview({ code }: { code: string }) {
  const [compiled, setCompiled] = useState<{ Content: MdxContent; id: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const idRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    evaluate(stripHtmlComments(code), {
      ...jsxRuntime,
      remarkPlugins: [
        remarkFrontmatter,
        remarkGfm,
        [remarkUivolve, { clientLoad: false, injectImport: false }],
      ],
    } as unknown as Parameters<typeof evaluate>[1]).then(
      (mod) => {
        if (cancelled) return
        idRef.current += 1
        setCompiled({ Content: mod.default as MdxContent, id: idRef.current })
        setError(null)
      },
      (e: unknown) => {
        if (!cancelled) setError((e as Error).message)
      },
    )
    return () => {
      cancelled = true
    }
  }, [code])

  return (
    <div className="uv-mdx">
      {error && <div className="uv-error uv-errorbar">MDX エラー: {error}</div>}
      {compiled && (
        <article className="uv-doc" key={compiled.id}>
          <PreviewBoundary>
            <compiled.Content components={MDX_COMPONENTS} />
          </PreviewBoundary>
        </article>
      )}
    </div>
  )
}

function App() {
  const [msg, setMsg] = useState<UpdateMessage | null>(null)

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as UpdateMessage
      if (data?.type === 'update') setMsg(data)
    }
    window.addEventListener('message', onMessage)
    // extension host に準備完了を通知して初回の内容をもらう
    vscodeApi.postMessage({ type: 'ready' })
    return () => window.removeEventListener('message', onMessage)
  }, [])

  if (!msg) return <div className="uv-empty">uivolve プレビュー — ファイルの内容を待っています…</div>

  return msg.mode === 'mdx' ? (
    <MdxPreview code={msg.code} />
  ) : (
    <div className="uv-dsl">
      <PreviewBoundary key={msg.code}>
        <ExtMockup code={msg.code} height="100%" />
      </PreviewBoundary>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
