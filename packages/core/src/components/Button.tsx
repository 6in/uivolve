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
 */
export function Button({ config }: RendererProps) {
  const menu = normalizeMenu(config.menu)
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
          title={config.handler ? `handler: ${config.handler}` : undefined}
          onClick={menu ? toggle : undefined}
          aria-expanded={menu ? open : undefined}
        >
          <Icon iconCls={config.iconCls} />
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
