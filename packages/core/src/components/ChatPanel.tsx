import { marked } from 'marked'
import type { RendererProps } from '../types'
import { cx } from '../utils'
import { PanelShell } from './Panel'

export interface ChatMessage {
  // 'user' は右寄せ、それ以外 ('bot' など) は左寄せで表示する
  from?: string
  // 送信者名 (バルーンの上に小さく表示)
  name?: string
  // 本文。Markdown として描画される
  text?: string
  // 時刻などの補足 (バルーンの下に小さく表示)
  time?: string
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.from === 'user'
  return (
    <div className={cx('sx-chat-msg', isUser && 'sx-chat-user')}>
      <span className="sx-chat-avatar" aria-hidden>
        {isUser ? '🙂' : '🤖'}
      </span>
      <div className="sx-chat-col">
        {msg.name && <span className="sx-chat-name">{msg.name}</span>}
        <div
          className="sx-chat-bubble"
          dangerouslySetInnerHTML={{ __html: marked.parse(msg.text ?? '', { async: false }) }}
        />
        {msg.time && <span className="sx-chat-time">{msg.time}</span>}
      </div>
    </div>
  )
}

/**
 * xtype: 'chatpanel' | 'chat' — チャット画面 (ExtJS にはない独自拡張)。
 * messages: [{ from: 'user' | 'bot', name, text, time }] の会話バルーンを表示する。
 * from: 'user' は右寄せ・アクセント色、それ以外は左寄せで、text は Markdown として描画。
 * typing: true で末尾に入力中インジケーター (・・・) を表示。
 * 入力欄が必要なら bbar に textfield + button を置いて組み合わせる。
 */
export function ChatPanel({ config }: RendererProps) {
  const messages = Array.isArray(config.messages) ? (config.messages as ChatMessage[]) : []
  return (
    <PanelShell config={config} bodyClassName="sx-chat-body">
      <div className="sx-chat" role="log">
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}
        {config.typing === true && (
          <div className="sx-chat-msg">
            <span className="sx-chat-avatar" aria-hidden>
              🤖
            </span>
            <div className="sx-chat-col">
              <div className="sx-chat-bubble sx-chat-typing" aria-label="入力中">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
      </div>
    </PanelShell>
  )
}
