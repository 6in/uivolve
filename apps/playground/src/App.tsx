import { javascript } from '@codemirror/lang-javascript'
import { ExtMockup, parseDsl, type ComponentConfig } from '@similar-extjs/core'
import CodeMirror from '@uiw/react-codemirror'
import { useEffect, useMemo, useRef, useState } from 'react'
import { samples } from './samples'

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
  // エディタペインの幅 (%) — スプリットバーでドラッグ調整
  const [editorPct, setEditorPct] = useState(42)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setPreviewCode(code), 250)
    return () => clearTimeout(timer)
  }, [code])

  const parsed = useMemo(() => {
    try {
      return { config: parseDsl(previewCode), error: null as string | null }
    } catch (e) {
      return { config: null, error: (e as Error).message }
    }
  }, [previewCode])

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
      `以下は ExtJS 互換 DSL で記述した画面モックの定義です。この画面を実装してください。\n\n\`\`\`json5\n${code}\`\`\`\n`,
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
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
          similar-extjs <span className="pg-sub">Playground — ExtJS 互換 DSL モックビューア</span>
        </h1>
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
          <CodeMirror
            value={code}
            height="100%"
            extensions={[javascript()]}
            onChange={setCode}
            onUpdate={(vu) => {
              const head = vu.state.selection.main.head
              const line = vu.state.doc.lineAt(head)
              const next = { line: line.number, col: head - line.from + 1 }
              setCursor((prev) =>
                prev.line === next.line && prev.col === next.col ? prev : next,
              )
            }}
            basicSetup={{ foldGutter: true, autocompletion: false }}
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
          {shownConfig && <ExtMockup config={shownConfig} height="100%" />}
        </section>
      </main>
      <footer className={`pg-status${parsed.error ? ' pg-status-error' : ''}`}>
        <span className="pg-status-msg">
          {parsed.error ? `✕ 構文エラー: ${parsed.error}` : '✓ OK'}
        </span>
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
