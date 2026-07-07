import { javascript } from '@codemirror/lang-javascript'
import { ExtMockup } from '@similar-extjs/core'
import CodeMirror from '@uiw/react-codemirror'
import { useEffect, useState } from 'react'
import { samples } from './samples'

export function App() {
  const [sampleIndex, setSampleIndex] = useState(0)
  const [code, setCode] = useState(samples[0].code)
  // プレビューはデバウンスして反映
  const [previewCode, setPreviewCode] = useState(code)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setPreviewCode(code), 250)
    return () => clearTimeout(timer)
  }, [code])

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

  return (
    <div className="pg-app">
      <header className="pg-header">
        <h1 className="pg-title">
          similar-extjs <span className="pg-sub">Playground — ExtJS 互換 DSL モックビューア</span>
        </h1>
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
        <button className="pg-copy" onClick={copyForAi}>
          {copied ? 'コピーしました ✓' : 'AI 用にコピー'}
        </button>
      </header>
      <main className="pg-main">
        <section className="pg-editor" aria-label="DSL エディタ">
          <CodeMirror
            value={code}
            height="100%"
            extensions={[javascript()]}
            onChange={setCode}
            basicSetup={{ foldGutter: true, autocompletion: false }}
          />
        </section>
        <section className="pg-preview" aria-label="プレビュー">
          <ExtMockup code={previewCode} height="100%" />
        </section>
      </main>
    </div>
  )
}
