import Editor, { type OnMount } from '@monaco-editor/react'
import {
  ExtMockup,
  detectFormat,
  parseDsl,
  stringifyDsl,
  DslParseError,
  type ComponentConfig,
  type DslFormat,
  type ThemeName,
} from '@uivolve/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { monaco } from './monaco-setup'
import { samples } from './samples'

const THEMES: Array<{ value: ThemeName; label: string }> = [
  { value: 'neptune', label: 'Neptune (既定)' },
  { value: 'classic', label: 'Classic' },
  { value: 'gray', label: 'Gray' },
  { value: 'dark', label: 'Dark' },
]

interface ParseResult {
  config: ComponentConfig | null
  error: string | null
  errorLine?: number
  errorColumn?: number
}

/** config ツリー内のコンポーネント数を数える (items / tbar / bbar を再帰) */
function countComponents(config: ComponentConfig): number {
  let n = 1
  const kids: unknown[] = []
  for (const key of ['items', 'tbar', 'bbar'] as const) {
    const v = config[key]
    if (Array.isArray(v)) kids.push(...v)
  }
  for (const k of kids) {
    if (k && typeof k === 'object') n += countComponents(k as ComponentConfig)
  }
  return n
}

export function App() {
  const [sampleIndex, setSampleIndex] = useState(0)
  const [code, setCode] = useState(samples[0].code)
  // プレビューはデバウンスして反映
  const [previewCode, setPreviewCode] = useState(code)
  const [copied, setCopied] = useState(false)
  const [cursor, setCursor] = useState({ line: 1, col: 1 })
  const [theme, setTheme] = useState<ThemeName>('neptune')
  // エディタペインの幅 (%) — スプリットバーでドラッグ調整
  const [editorPct, setEditorPct] = useState(42)
  const mainRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

  const format: DslFormat = useMemo(() => detectFormat(code), [code])

  useEffect(() => {
    const timer = setTimeout(() => setPreviewCode(code), 250)
    return () => clearTimeout(timer)
  }, [code])

  const parsed: ParseResult = useMemo(() => {
    try {
      return { config: parseDsl(previewCode), error: null }
    } catch (e) {
      const err = e as DslParseError
      return { config: null, error: err.message, errorLine: err.line, errorColumn: err.column }
    }
  }, [previewCode])

  // 構文エラーはエディタ上のマーカーとしても表示
  useEffect(() => {
    const model = editorRef.current?.getModel()
    if (!model) return
    monaco.editor.setModelMarkers(
      model,
      'dsl',
      parsed.error
        ? [
            {
              severity: monaco.MarkerSeverity.Error,
              message: parsed.error,
              startLineNumber: parsed.errorLine ?? 1,
              startColumn: parsed.errorColumn ?? 1,
              endLineNumber: parsed.errorLine ?? 1,
              endColumn: (parsed.errorColumn ?? 1) + 1,
            },
          ]
        : [],
    )
  }, [parsed])

  // 構文エラー中は最後に成功した config を表示し続ける
  const lastGoodRef = useRef<ComponentConfig | null>(null)
  if (parsed.config) lastGoodRef.current = parsed.config
  const shownConfig = parsed.config ?? lastGoodRef.current

  const selectSample = (index: number) => {
    setSampleIndex(index)
    setCode(samples[index].code)
  }

  const copyForAi = async () => {
    await navigator.clipboard.writeText(
      `以下は ExtJS 互換 DSL で記述した画面モックの定義です。この画面を実装してください。\n\n\`\`\`${format === 'yaml' ? 'yaml' : 'json5'}\n${code}\`\`\`\n`,
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const convertFormat = () => {
    try {
      const obj = parseDsl(code)
      setCode(stringifyDsl(obj, format === 'json5' ? 'yaml' : 'json5'))
    } catch {
      // 構文エラー中は変換しない (ステータスバーにエラー表示済み)
    }
  }

  const onEditorMount: OnMount = (editor) => {
    editorRef.current = editor
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
          uivolve <span className="pg-sub">Playground — ExtJS 互換 DSL モックビューア</span>
        </h1>
        <a className="pg-headerlink" href="mdx/" title="Markdown 仕様書にモックを埋め込む例">
          MDX デモ →
        </a>
      </header>
      <div className="pg-toolbar" role="toolbar">
        <label className="pg-sample">
          サンプル:
          <select value={sampleIndex} onChange={(e) => selectSample(Number(e.target.value))}>
            {samples.map((s, i) => (
              <option key={i} value={i}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <button className="pg-btn" onClick={() => selectSample(sampleIndex)}>
          リセット
        </button>
        <label className="pg-sample">
          テーマ:
          <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeName)}>
            {THEMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <button className="pg-btn" onClick={convertFormat} disabled={!!parsed.error}>
          {format === 'json5' ? 'YAML へ変換' : 'JSON5 へ変換'}
        </button>
        <span className="pg-tb-fill" />
        <button className="pg-btn pg-btn-primary" onClick={copyForAi}>
          {copied ? 'コピーしました ✓' : 'AI 用にコピー'}
        </button>
      </div>
      <main
        className="pg-main"
        ref={mainRef}
        style={{ gridTemplateColumns: `${editorPct}% 6px 1fr` }}
      >
        <section className="pg-editor" aria-label="DSL エディタ">
          <Editor
            language={format === 'yaml' ? 'yaml' : 'javascript'}
            value={code}
            onChange={(v) => setCode(v ?? '')}
            onMount={onEditorMount}
            options={{
              fontSize: 13,
              tabSize: 2,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordBasedSuggestions: 'off',
              quickSuggestions: { other: true, comments: false, strings: true },
              suggest: { showWords: false, snippetsPreventQuickSuggestions: false },
              fixedOverflowWidgets: true,
              scrollbar: { verticalScrollbarSize: 10 },
            }}
          />
        </section>
        <div
          className="pg-splitter"
          role="separator"
          aria-orientation="vertical"
          aria-label="ペイン幅の調整"
          onPointerDown={startResize}
        />
        <section className="pg-preview" aria-label="プレビュー">
          {shownConfig && <ExtMockup config={shownConfig} height="100%" theme={theme} />}
        </section>
      </main>
      <footer className={`pg-status${parsed.error ? ' pg-status-error' : ''}`}>
        <span className="pg-status-msg">
          {parsed.error ? `✕ 構文エラー: ${parsed.error}` : '✓ OK'}
        </span>
        <span className="pg-format">{format === 'yaml' ? 'YAML' : 'JSON5'}</span>
        <span>コンポーネント: {shownConfig ? countComponents(shownConfig) : 0}</span>
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
