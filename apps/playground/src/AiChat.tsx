/**
 * AI アシストのチャット欄 (エディタ下部) と設定ダイアログ。
 * 会話履歴は表示用で、API には常に「現在のエディタ内容 + 指示」を送る
 * (詳細は ai-client.ts のコメント参照)。修正案は差分プレビューを確認してから適用する。
 */
import { DiffEditor } from '@monaco-editor/react'
import { parseDsl, type DslFormat } from '@uivolve/core'
import type { editor as MonacoEditor } from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_BASE_URLS,
  buildSystemPrompt,
  buildUserTurn,
  extractCode,
  loadAiSettings,
  saveAiSettings,
  sendChat,
  type AiSettings,
  type ChatTurn,
} from './ai-client'

interface ChatMsg {
  role: 'user' | 'assistant'
  text: string
  error?: boolean
}

export interface AiChatProps {
  code: string
  format: DslFormat
  onApply: (code: string) => void
}

export function AiChat({ code, format, onApply }: AiChatProps) {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<AiSettings | null>(() => loadAiSettings())
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [proposal, setProposal] = useState<string | null>(null)
  const [diffOpen, setDiffOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const diffRef = useRef<MonacoEditor.IStandaloneDiffEditor | null>(null)

  // アンマウント前にモデル参照を外す (DiffEditor の破棄順警告の回避)
  const closeDiff = () => {
    diffRef.current?.setModel(null)
    diffRef.current = null
    setDiffOpen(false)
  }

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy, proposal])

  const addMsg = (msg: ChatMsg) => setMessages((m) => [...m, msg])

  const send = async () => {
    const instruction = input.trim()
    if (!instruction || busy) return
    if (!settings) {
      setSettingsOpen(true)
      return
    }
    addMsg({ role: 'user', text: instruction })
    setInput('')
    setProposal(null)
    setBusy(true)
    try {
      const system = buildSystemPrompt(code, format)
      // 過去の会話は「指示と説明のテキスト」だけを文脈として渡す (コードは現在版のみ)
      const history: ChatTurn[] = messages.map((m) => ({ role: m.role, content: m.text }))
      const turns: ChatTurn[] = [
        ...history,
        { role: 'user', content: buildUserTurn(code, format, instruction) },
      ]
      let reply = await sendChat(settings, system, turns)
      let { code: newCode, commentary } = extractCode(reply)

      // 構文エラーの応答は 1 回だけ自動リトライ
      if (newCode) {
        try {
          parseDsl(newCode)
        } catch (e) {
          reply = await sendChat(settings, system, [
            ...turns,
            { role: 'assistant', content: reply },
            {
              role: 'user',
              content: `返された DSL に構文エラーがあります: ${e instanceof Error ? e.message : e}\n修正して全体を返してください。`,
            },
          ])
          const retry = extractCode(reply)
          newCode = retry.code
          commentary = retry.commentary
          if (newCode) parseDsl(newCode) // まだ壊れていれば catch へ
        }
      }

      if (newCode) {
        setProposal(newCode)
        addMsg({ role: 'assistant', text: commentary || '修正案を作成しました。差分を確認してください。' })
      } else {
        addMsg({ role: 'assistant', text: reply.trim() || '(応答が空でした)' })
      }
    } catch (e) {
      addMsg({ role: 'assistant', text: `エラー: ${e instanceof Error ? e.message : e}`, error: true })
    } finally {
      setBusy(false)
    }
  }

  const apply = () => {
    if (!proposal) return
    const next = proposal
    closeDiff()
    setProposal(null)
    // DiffEditor のアンマウントを待ってから反映する
    setTimeout(() => {
      onApply(next)
      addMsg({ role: 'assistant', text: '✓ 適用しました。' })
    }, 0)
  }

  return (
    <div className="ai-pane">
      <div
        className="ai-header"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
      >
        <span className="ai-title">🤖 AI アシスト</span>
        <span className="ai-model">{settings ? settings.model : '未設定'}</span>
        <button
          type="button"
          className="ai-gear"
          title="AI 設定"
          onClick={(e) => {
            e.stopPropagation()
            setSettingsOpen(true)
          }}
        >
          ⚙
        </button>
        <span aria-hidden>{open ? '▾' : '▸'}</span>
      </div>

      {open && (
        <>
          <div className="ai-messages" ref={listRef}>
            {messages.length === 0 && (
              <div className="ai-hint">
                例:「受注一覧に単価列を追加して」「フォームを 2 カラムにして」
                <br />
                現在のエディタ内容を毎回添付するので、手動編集と併用できます。
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ai-${m.role}${m.error ? ' ai-error' : ''}`}>
                {m.text}
              </div>
            ))}
            {busy && <div className="ai-msg ai-assistant ai-busy">考え中…</div>}
            {proposal && !busy && (
              <div className="ai-proposalbar">
                修正案があります
                <button type="button" className="pg-btn" onClick={() => setDiffOpen(true)}>
                  差分を確認
                </button>
                <button type="button" className="pg-btn pg-btn-primary" onClick={apply}>
                  適用
                </button>
                <button type="button" className="pg-btn" onClick={() => setProposal(null)}>
                  破棄
                </button>
              </div>
            )}
          </div>
          <div className="ai-inputrow">
            <input
              className="ai-input"
              value={input}
              placeholder={settings ? 'AI への修正指示…' : '⚙ から接続先を設定してください'}
              disabled={busy}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) send()
              }}
            />
            <button
              type="button"
              className="pg-btn pg-btn-primary"
              disabled={busy || !input.trim()}
              onClick={send}
            >
              送信
            </button>
          </div>
        </>
      )}

      {diffOpen && proposal && (
        <div className="ai-overlay" role="dialog" aria-label="修正案の差分">
          <div className="ai-diffbox">
            <div className="ai-diffbar">
              <span>修正案の差分 (左: 現在 / 右: AI 提案)</span>
              <span className="pg-tb-fill" />
              <button type="button" className="pg-btn pg-btn-primary" onClick={apply}>
                適用
              </button>
              <button type="button" className="pg-btn" onClick={closeDiff}>
                閉じる
              </button>
            </div>
            <div className="ai-diffeditor">
              <DiffEditor
                height="100%"
                language={format === 'yaml' ? 'yaml' : 'javascript'}
                original={code}
                modified={proposal}
                onMount={(editor) => {
                  diffRef.current = editor
                }}
                options={{ readOnly: true, renderSideBySide: true, minimap: { enabled: false }, fontSize: 12 }}
              />
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <AiSettingsDialog
          initial={settings}
          onSave={(s) => {
            setSettings(s)
            saveAiSettings(s)
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------- 設定ダイアログ

function AiSettingsDialog({
  initial,
  onSave,
  onClose,
}: {
  initial: AiSettings | null
  onSave: (s: AiSettings | null) => void
  onClose: () => void
}) {
  const [provider, setProvider] = useState<AiSettings['provider']>(initial?.provider ?? 'openai')
  const [baseUrl, setBaseUrl] = useState(initial?.baseUrl ?? '')
  const [apiKey, setApiKey] = useState(initial?.apiKey ?? '')
  const [model, setModel] = useState(initial?.model ?? '')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  const current = (): AiSettings => ({
    provider,
    baseUrl: baseUrl.trim() || DEFAULT_BASE_URLS[provider],
    apiKey: apiKey.trim(),
    model: model.trim(),
  })

  const test = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      await sendChat(current(), 'You are a connectivity test. Reply briefly.', [{ role: 'user', content: 'ping' }], 16)
      setTestResult('✓ 接続 OK')
    } catch (e) {
      setTestResult(`✗ ${e instanceof Error ? e.message : e}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="ai-overlay" role="dialog" aria-label="AI 設定">
      <div className="ai-settings">
        <h2 className="ai-settings-title">AI アシストの設定</h2>
        <label className="ai-field">
          <span>プロバイダ</span>
          <select value={provider} onChange={(e) => setProvider(e.target.value as AiSettings['provider'])}>
            <option value="openai">OpenAI 互換 (OpenAI / Ollama / LM Studio など)</option>
            <option value="anthropic">Anthropic 互換</option>
          </select>
        </label>
        <label className="ai-field">
          <span>BASE-URL</span>
          <input
            value={baseUrl}
            placeholder={DEFAULT_BASE_URLS[provider]}
            onChange={(e) => setBaseUrl(e.target.value)}
          />
        </label>
        <label className="ai-field">
          <span>API キー</span>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </label>
        <label className="ai-field">
          <span>モデル名</span>
          <input
            value={model}
            placeholder={provider === 'anthropic' ? 'claude-sonnet-4-6' : 'gpt-4o-mini'}
            onChange={(e) => setModel(e.target.value)}
          />
        </label>
        <p className="ai-note">
          設定はこのブラウザの LocalStorage にのみ保存されます (共有 PC では保存に注意)。
          API キーは選択したエンドポイント以外には送信されません。
        </p>
        {testResult && <p className={`ai-testresult${testResult.startsWith('✓') ? '' : ' ai-error'}`}>{testResult}</p>}
        <div className="ai-settings-actions">
          <button type="button" className="pg-btn" disabled={testing || !apiKey || !model} onClick={test}>
            {testing ? 'テスト中…' : '接続テスト'}
          </button>
          <button
            type="button"
            className="pg-btn"
            onClick={() => {
              onSave(null)
              onClose()
            }}
          >
            設定を削除
          </button>
          <span className="pg-tb-fill" />
          <button
            type="button"
            className="pg-btn pg-btn-primary"
            disabled={!apiKey.trim() || !model.trim()}
            onClick={() => {
              onSave(current())
              onClose()
            }}
          >
            保存
          </button>
          <button type="button" className="pg-btn" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
