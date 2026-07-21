import { evaluate } from '@mdx-js/mdx'
import Editor, { type OnMount } from '@monaco-editor/react'
import { ExtMockup } from '@uivolve/core'
import remarkUivolve from '@uivolve/remark-mock'
import {
  Component,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { monaco } from '../monaco-setup'
import { mdxSamples } from './mdx-samples'

type MdxContent = ComponentType<{ components?: Record<string, ComponentType<never>> }>

interface Compiled {
  Content: MdxContent
  /** コンパイルごとに増える id。ErrorBoundary のリセットと remount に使う */
  id: number
}

interface CompileError {
  message: string
  line?: number
  column?: number
}

/** MDX コンパイルエラー (VFileMessage 互換) からメッセージと行・列を取り出す */
function toCompileError(e: unknown): CompileError {
  const err = e as Error & {
    line?: number
    column?: number
    place?: { start?: { line?: number; column?: number } }
  }
  return {
    message: err.message,
    line: err.line ?? err.place?.start?.line,
    column: err.column ?? err.place?.start?.column,
  }
}

/**
 * MDX は HTML コメント (<!-- -->) を構文エラーにするため、コンパイル前に取り除く。
 * 素の Markdown を貼り付けても動くようにするための救済で、
 * コードフェンス内とインラインコード内のコメントはそのまま残す。
 * エラー位置がずれないよう、除去したコメント内の改行は残す。
 */
function stripHtmlComments(source: string): string {
  const out: string[] = []
  let buffer: string[] = []
  let fenceMarker: string | null = null

  const flush = () => {
    if (!buffer.length) return
    out.push(
      // インラインコード (`...`) は保持し、HTML コメントだけ改行を残して除去する
      buffer.join('\n').replace(/(`+)[\s\S]*?\1|<!--[\s\S]*?-->/g, (m) =>
        m.startsWith('`') ? m : '\n'.repeat(m.split('\n').length - 1),
      ),
    )
    buffer = []
  }

  for (const line of source.split('\n')) {
    const fence = /^ {0,3}(`{3,}|~{3,})/.exec(line)
    if (fenceMarker === null && fence) {
      flush()
      fenceMarker = fence[1][0]
      out.push(line)
    } else if (fenceMarker !== null) {
      out.push(line)
      if (fence && fence[1][0] === fenceMarker) fenceMarker = null
    } else {
      buffer.push(line)
    }
  }
  flush()
  return out.join('\n')
}

class PreviewBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <div className="mdxpg-rendererror">描画エラー: {this.state.error.message}</div>
    }
    return this.props.children
  }
}

export function MdxApp() {
  const [sampleIndex, setSampleIndex] = useState(0)
  const [code, setCode] = useState(mdxSamples[0].code)
  // プレビューはデバウンスして反映 (MDX コンパイルは DSL パースより重いので長め)
  const [previewCode, setPreviewCode] = useState(code)
  const [compiled, setCompiled] = useState<Compiled | null>(null)
  const [error, setError] = useState<CompileError | null>(null)
  // 「反映」でインクリメントし、同一テキストでも再コンパイル + remount させる
  const [renderEpoch, setRenderEpoch] = useState(0)
  const [cursor, setCursor] = useState({ line: 1, col: 1 })
  const [editorPct, setEditorPct] = useState(46)
  const mainRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const compileIdRef = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => setPreviewCode(code), 400)
    return () => clearTimeout(timer)
  }, [code])

  // 検証スクリプト (scripts/shot-uivolve.mjs) から MDX を流し込むためのフック
  useEffect(() => {
    ;(window as { __uivolve?: { setCode: (v: string) => void } }).__uivolve = {
      setCode: (v: string) => {
        setCode(v)
        setPreviewCode(v)
        setRenderEpoch((e) => e + 1)
      },
    }
  }, [])

  // MDX をブラウザ内でコンパイル。エラー中は最後に成功した内容を表示し続ける
  useEffect(() => {
    let cancelled = false
    evaluate(stripHtmlComments(previewCode), {
      ...jsxRuntime,
      remarkPlugins: [
        remarkFrontmatter,
        remarkGfm,
        // import は evaluate では扱えないので注入せず、components prop で ExtMockup を渡す
        [remarkUivolve, { clientLoad: false, injectImport: false }],
      ],
    } as unknown as Parameters<typeof evaluate>[1]).then(
      (mod) => {
        if (cancelled) return
        compileIdRef.current += 1
        setCompiled({ Content: mod.default as MdxContent, id: compileIdRef.current })
        setError(null)
      },
      (e: unknown) => {
        if (cancelled) return
        setError(toCompileError(e))
      },
    )
    return () => {
      cancelled = true
    }
  }, [previewCode, renderEpoch])

  // コンパイルエラーはエディタ上のマーカーとしても表示
  useEffect(() => {
    const model = editorRef.current?.getModel()
    if (!model) return
    monaco.editor.setModelMarkers(
      model,
      'mdx',
      error
        ? [
            {
              severity: monaco.MarkerSeverity.Error,
              message: error.message,
              startLineNumber: error.line ?? 1,
              startColumn: error.column ?? 1,
              endLineNumber: error.line ?? 1,
              endColumn: (error.column ?? 1) + 1,
            },
          ]
        : [],
    )
  }, [error])

  const selectSample = (index: number) => {
    setSampleIndex(index)
    setCode(mdxSamples[index].code)
    setPreviewCode(mdxSamples[index].code)
    setRenderEpoch((e) => e + 1)
  }

  // デバウンスを待たずに反映。テキストが同一でも再コンパイルして remount する
  const applyNow = () => {
    setPreviewCode(code)
    setRenderEpoch((e) => e + 1)
  }
  const applyNowRef = useRef(applyNow)
  applyNowRef.current = applyNow

  const onEditorMount: OnMount = (editor) => {
    editorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => applyNowRef.current())
    editor.onDidChangeCursorPosition((e) => {
      setCursor((prev) =>
        prev.line === e.position.lineNumber && prev.col === e.position.column
          ? prev
          : { line: e.position.lineNumber, col: e.position.column },
      )
    })
  }

  const startResize = (e: React.PointerEvent) => {
    e.preventDefault()
    const main = mainRef.current
    if (!main) return
    const rect = main.getBoundingClientRect()
    const move = (ev: PointerEvent) => {
      const pct = ((ev.clientX - rect.left) / rect.width) * 100
      setEditorPct(Math.min(80, Math.max(15, pct)))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div className="pg-app">
      <header className="pg-header">
        <h1 className="pg-title">
          uivolve <span className="pg-sub">MDX Playground — MDX 仕様書ライブプレビュー</span>
        </h1>
        <a className="pg-headerlink" href="../" title="DSL 単体のモックビューア">
          DSL Playground →
        </a>
        <a className="pg-headerlink" href="../mdx/" title="Markdown 仕様書にモックを埋め込む例">
          MDX デモ →
        </a>
      </header>
      <div className="pg-toolbar" role="toolbar">
        <label className="pg-sample">
          サンプル:
          <select value={sampleIndex} onChange={(e) => selectSample(Number(e.target.value))}>
            {mdxSamples.map((s, i) => (
              <option key={i} value={i}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="pg-btn"
          onClick={applyNow}
          title="テキストの内容でプレビューを描画し直す (Ctrl/Cmd+Enter)。モック内部に保持される値もリセットして反映する"
        >
          反映
        </button>
        <button className="pg-btn" onClick={() => selectSample(sampleIndex)}>
          リセット
        </button>
        <span className="pg-tb-fill" />
        <span className="mdxpg-hint">
          ```uivolve フェンス付きの MDX / Markdown を貼り付けるとプレビューされます
        </span>
      </div>
      <main
        className="pg-main"
        ref={mainRef}
        style={{ gridTemplateColumns: `${editorPct}% 6px 1fr` }}
      >
        <section className="pg-editor" aria-label="MDX エディタ">
          <div className="pg-editor-monaco">
            <Editor
              language="markdown"
              value={code}
              onChange={(v) => setCode(v ?? '')}
              onMount={onEditorMount}
              options={{
                fontSize: 13,
                tabSize: 2,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                wordBasedSuggestions: 'off',
                quickSuggestions: false,
                fixedOverflowWidgets: true,
                scrollbar: { verticalScrollbarSize: 10 },
              }}
            />
          </div>
        </section>
        <div
          className="pg-splitter"
          role="separator"
          aria-orientation="vertical"
          aria-label="ペイン幅の調整"
          onPointerDown={startResize}
        />
        <section className="mdxpg-preview" aria-label="プレビュー">
          {compiled && (
            <article className="mdxpg-doc" key={compiled.id}>
              <PreviewBoundary>
                <compiled.Content components={{ ExtMockup: ExtMockup as ComponentType<never> }} />
              </PreviewBoundary>
            </article>
          )}
        </section>
      </main>
      <footer className={`pg-status${error ? ' pg-status-error' : ''}`}>
        <span className="pg-status-msg">{error ? `✕ MDX エラー: ${error.message}` : '✓ OK'}</span>
        <span className="pg-format">MDX</span>
        <span>
          {cursor.line} 行 {cursor.col} 列
        </span>
        <span>
          {code.split('\n').length} 行 / {code.length} 文字
        </span>
      </footer>
    </div>
  )
}
