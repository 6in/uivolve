import { marked } from 'marked'
import { useMemo } from 'react'
import type { RendererProps } from '../types'
import { cx, styleOf } from '../utils'

/**
 * xtype: 'markdown' — Markdown を描画する (ExtJS にはない独自拡張)。
 * value に Markdown テキストを指定 (YAML 記法ならブロックスカラー `value: |` が書きやすい)。
 * 見出し・リスト・表・コードブロック・引用などに対応 (marked で HTML 化)。
 * 画面内の説明文や、モックに仕様メモを添える用途を想定。
 */
export function Markdown({ config }: RendererProps) {
  const html = useMemo(
    () => marked.parse((config.value as string | undefined) ?? '', { async: false }),
    [config.value],
  )
  return (
    <div
      className={cx('sx-markdown', config.cls)}
      style={styleOf(config)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
