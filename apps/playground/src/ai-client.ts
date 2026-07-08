/**
 * AI アシストのクライアント。
 * OpenAI 互換 / Anthropic 互換 API をブラウザから直接呼ぶ薄いラッパーと、
 * 設定の LocalStorage 永続化、プロンプト組み立てを提供する。
 *
 * 設計方針 (ステートレス方式):
 * 会話履歴にコードを持たせず、毎回「現在のエディタ内容 + 今回の指示」を送る。
 * これにより手動編集を挟んでも AI が古い版を修正する事故が起きない。
 */
import { buildAiReference, parseDsl, type DslFormat } from '@uivolve/core'

export interface AiSettings {
  provider: 'openai' | 'anthropic'
  baseUrl: string
  apiKey: string
  model: string
}

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

const LS_KEY = 'uivolve.ai.settings'

/** プロバイダごとの既定 BASE-URL */
export const DEFAULT_BASE_URLS: Record<AiSettings['provider'], string> = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com',
}

export function loadAiSettings(): AiSettings | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as AiSettings
    return s.apiKey && s.model ? s : null
  } catch {
    return null
  }
}

export function saveAiSettings(settings: AiSettings | null): void {
  if (settings) localStorage.setItem(LS_KEY, JSON.stringify(settings))
  else localStorage.removeItem(LS_KEY)
}

/** チャット 1 回分を送って応答テキストを返す (非ストリーミング) */
export async function sendChat(
  settings: AiSettings,
  system: string,
  turns: ChatTurn[],
  maxTokens = 8192,
): Promise<string> {
  const base = (settings.baseUrl || DEFAULT_BASE_URLS[settings.provider]).replace(/\/+$/, '')

  if (settings.provider === 'anthropic') {
    const res = await fetch(`${base}/v1/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
        // ブラウザからの直接アクセスを明示的に許可する (Anthropic 公式ヘッダー)
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: settings.model,
        max_tokens: maxTokens,
        system,
        messages: turns,
      }),
    })
    if (!res.ok) throw new Error(await errorText(res))
    const json = await res.json()
    return (json.content ?? [])
      .map((c: { text?: string }) => c.text ?? '')
      .join('')
  }

  // OpenAI 互換 (api.openai.com / Ollama / LM Studio / vLLM など)
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: maxTokens,
      messages: [{ role: 'system', content: system }, ...turns],
    }),
  })
  if (!res.ok) throw new Error(await errorText(res))
  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

async function errorText(res: Response): Promise<string> {
  const body = await res.text().catch(() => '')
  return `HTTP ${res.status}: ${body.slice(0, 300) || res.statusText}`
}

/** 修正依頼用の system プロンプト。現在のコードから使用部品のリファレンスを組み込む */
export function buildSystemPrompt(code: string, format: DslFormat): string {
  let reference = ''
  try {
    reference = buildAiReference(parseDsl(code))
  } catch {
    // 構文エラー中はリファレンスなしで送る (修正依頼自体は可能)
  }
  return [
    'あなたは uivolve (ExtJS 互換の画面モック DSL) のコード編集アシスタントです。',
    `ユーザーの指示に従って DSL を修正し、修正後の DSL 全体を必ず 1 つの \`\`\`${format} コードフェンスで返してください。`,
    '',
    'ルール:',
    '- 部分的な差分ではなく、修正後のコード全体を返す',
    `- 記法は現在と同じ ${format === 'yaml' ? 'YAML' : 'JSON5'} を維持する`,
    '- 既存の itemId とコメントはできる限り維持し、新規コンポーネントには itemId を付ける',
    '- コードフェンス外の説明は 2 文以内で簡潔に',
    '',
    reference,
  ].join('\n')
}

/** 今回の指示のユーザーメッセージ (現在のコードを毎回添付する) */
export function buildUserTurn(code: string, format: DslFormat, instruction: string): string {
  return `現在の DSL:\n\`\`\`${format}\n${code}\n\`\`\`\n\n指示: ${instruction}`
}

/** 応答からコードフェンスを抽出する。コード部と説明部に分ける */
export function extractCode(reply: string): { code: string | null; commentary: string } {
  const matches = [...reply.matchAll(/```[\w-]*\n?([\s\S]*?)```/g)]
  // 複数フェンスがある場合は最長のものを採用 (before/after を並べる応答対策)
  const best = matches.map((m) => m[1]).sort((a, b) => b.length - a.length)[0]
  const commentary = reply.replace(/```[\w-]*\n?[\s\S]*?```/g, '').trim()
  return { code: best?.trim() || null, commentary }
}
