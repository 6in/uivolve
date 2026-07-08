import { useEffect, useMemo, useRef, useState } from 'react'
import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

interface TermLine {
  key: number
  text: string
}

/** 行の内容から意味色のクラスを推定する */
function classify(text: string): string | undefined {
  if (/^[$>]/.test(text)) return 'sx-terminal-prompt'
  if (/✗|error|fail/i.test(text)) return 'sx-terminal-err'
  if (/⚠|warn/i.test(text)) return 'sx-terminal-warn'
  if (/✓|success|passed|done/i.test(text)) return 'sx-terminal-ok'
  return undefined
}

/**
 * xtype: 'terminal' — コンソールログ風アニメーション (ExtJS にはない独自拡張)。
 * lines のテキストを speed ms 間隔 (±ランダムな揺らぎ付き) で 1 行ずつ流し、
 * 末尾まで行ったら先頭からサイクリックに繰り返す。maxLines (既定 100) で
 * 保持行数を制限し、常に最下部へ自動スクロールする。
 * '$' / '>' 始まりはプロンプト色、✓ / ✗ / ⚠ / WARN / ERROR は意味色で自動ハイライト。
 * title を指定すると macOS 風のウィンドウバーを表示する。
 */
export function Terminal({ config }: RendererProps) {
  const lines = useMemo(
    () => (Array.isArray(config.lines) ? config.lines.map(String) : []),
    [config.lines],
  )
  const speed = config.speed ?? 500
  const maxLines = config.maxLines ?? 100
  const [buf, setBuf] = useState<TermLine[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lines.length === 0) return
    let timer: ReturnType<typeof setTimeout>
    let index = 0
    let key = 0
    const push = () => {
      const text = lines[index % lines.length]
      index++
      setBuf((b) => [...b, { key: key++, text }].slice(-maxLines))
      // 揺らぎ (0.4〜1.6 倍) を付けてランダムに流れている感を出す
      timer = setTimeout(push, speed * (0.4 + Math.random() * 1.2))
    }
    push()
    return () => {
      clearTimeout(timer)
      setBuf([])
    }
  }, [lines, speed, maxLines])

  // 追記のたびに最下部へスクロール
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [buf])

  return (
    <div className={cx('sx-terminal', config.cls)} style={styleOf(config)}>
      {config.title !== undefined && (
        <div className="sx-terminal-bar">
          <span className="sx-terminal-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="sx-terminal-title">{config.title}</span>
        </div>
      )}
      <div className="sx-terminal-body" ref={bodyRef} role="log">
        {buf.map((l) => (
          <div key={l.key} className={cx('sx-terminal-line', classify(l.text))}>
            {l.text}
          </div>
        ))}
        <span className="sx-terminal-cursor" aria-hidden />
      </div>
    </div>
  )
}
