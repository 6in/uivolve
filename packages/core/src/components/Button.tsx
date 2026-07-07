import type { ComponentConfig, RendererProps } from '../types'
import { cx, styleOf } from '../utils'
import { MenuTrigger } from './misc'

function normalizeMenu(menu: unknown): ComponentConfig | undefined {
  if (!menu) return undefined
  if (Array.isArray(menu)) return { xtype: 'menu', items: menu }
  return { xtype: 'menu', ...(menu as ComponentConfig) }
}

/** xtype: 'button' — menu 指定でドロップダウンメニュー付きになる */
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
          onClick={menu ? toggle : undefined}
          aria-expanded={menu ? open : undefined}
        >
          {config.iconCls && <span className={cx('sx-btn-icon', config.iconCls)} aria-hidden />}
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
