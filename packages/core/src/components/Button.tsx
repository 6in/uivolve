import { useState } from 'react'
import type { ComponentConfig, RendererProps } from '../types'
import { cx, styleOf } from '../utils'
import { Icon } from './Icon'
import { MenuTrigger } from './misc'

function normalizeMenu(menu: unknown): ComponentConfig | undefined {
  if (!menu) return undefined
  if (Array.isArray(menu)) return { xtype: 'menu', items: menu }
  return { xtype: 'menu', ...(menu as ComponentConfig) }
}

/**
 * xtype: 'button' — menu 指定でドロップダウンメニュー付きになる。
 * handler ('onSaveClick' のような参照名) は実行はせずツールチップに表示する
 * (モックの動線を AI・レビュアーへ伝えるための宣言)。
 * clipboard (独自拡張のユーティリティ): true でクリック時に自分の iconCls 定義
 * (iconCls: 'x-fa fa-plus' 形式) を、文字列なら任意のテキストをクリップボードへコピーする。
 * アイコンカタログやデザイントークン一覧のサンプル向け。
 */
export function Button({ config }: RendererProps) {
  const menu = normalizeMenu(config.menu)
  const [copied, setCopied] = useState(false)

  const clipText =
    config.clipboard === true
      ? config.iconCls
        ? `iconCls: '${config.iconCls}'`
        : String(config.text ?? '')
      : typeof config.clipboard === 'string'
        ? config.clipboard
        : undefined

  const copy = async () => {
    if (!clipText) return
    await navigator.clipboard.writeText(clipText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const title = copied
    ? 'コピーしました'
    : config.handler
      ? `handler: ${config.handler}`
      : clipText
        ? `クリックでコピー: ${clipText}`
        : undefined

  return (
    <MenuTrigger menu={menu}>
      {(open, toggle) => (
        <button
          type="button"
          className={cx(
            'sx-btn',
            config.ui === 'primary' && 'sx-btn-primary',
            config.cls,
          )}
          disabled={config.disabled}
          style={styleOf(config)}
          title={title}
          onClick={menu ? toggle : clipText ? copy : undefined}
          aria-expanded={menu ? open : undefined}
        >
          <Icon iconCls={copied ? 'fa fa-check' : config.iconCls} />
          {config.text}
          {menu && (
            <span className="sx-btn-arrow" aria-hidden>
              ▾
            </span>
          )}
        </button>
      )}
    </MenuTrigger>
  )
}
