import { useRef, useState, type ReactNode } from 'react'
import { XRender } from '../XRender'
import type { ComponentConfig, RendererProps } from '../types'
import { cx, styleOf, toCssSize } from '../utils'
import { Icon } from './Icon'

// ---------------------------------------------------------------- menu

function normalizeMenu(menu: unknown): ComponentConfig | undefined {
  if (!menu) return undefined
  if (Array.isArray(menu)) return { xtype: 'menu', items: menu }
  return { xtype: 'menu', ...(menu as ComponentConfig) }
}

/**
 * xtype: 'menu' — メニューリスト。
 * items: { text, iconCls, menu(サブメニューは矢印表示のみ) } または '-'(区切り線)。
 */
export function Menu({ config }: RendererProps) {
  const items = Array.isArray(config.items) ? config.items : []
  return (
    <div className={cx('sx-menu', config.cls)} style={styleOf(config)} role="menu">
      {items.map((it, i) => {
        if (it === '-' || (typeof it === 'object' && it?.xtype === 'menuseparator')) {
          return <div key={i} className="sx-menu-sep" role="separator" />
        }
        if (typeof it === 'string') {
          return (
            <div key={i} className="sx-menu-item" role="menuitem">
              <span className="sx-menu-text">{it}</span>
            </div>
          )
        }
        return (
          <div key={i} className={cx('sx-menu-item', it.disabled && 'sx-menu-disabled')} role="menuitem">
            <span className="sx-menu-iconslot">
              <Icon iconCls={it.iconCls} />
            </span>
            <span className="sx-menu-text">{it.text}</span>
            {it.checked !== undefined && <span aria-hidden>{it.checked ? '✓' : ''}</span>}
            {it.menu !== undefined && <span className="sx-menu-arrow" aria-hidden>▸</span>}
          </div>
        )
      })}
    </div>
  )
}

/**
 * ボタン類に menu ドロップダウンを付けるラッパー。
 * Popover API (top layer) で描画するため、パネルの overflow にクリップされず、
 * 外側クリックで自動的に閉じる (light dismiss)。
 */
export function MenuTrigger({
  menu,
  children,
}: {
  menu: ComponentConfig | undefined
  children: (open: boolean, toggle: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const popRef = useRef<HTMLDivElement>(null)

  if (!menu) return <>{children(false, () => {})}</>

  const toggle = () => {
    const pop = popRef.current
    const wrap = wrapRef.current
    if (!pop || !wrap) return
    if (pop.matches(':popover-open')) {
      pop.hidePopover()
      return
    }
    const rect = wrap.getBoundingClientRect()
    pop.style.top = `${rect.bottom + 2}px`
    pop.style.left = `${rect.left}px`
    pop.showPopover()
  }

  return (
    <span className="sx-menu-trigger" ref={wrapRef}>
      {children(open, toggle)}
      <div
        ref={popRef}
        popover="auto"
        className="sx-menu-popover"
        onToggle={(e) => setOpen(e.nativeEvent.newState === 'open')}
      >
        <XRender config={menu} />
      </div>
    </span>
  )
}

// ---------------------------------------------------------------- splitbutton

/** xtype: 'splitbutton' — 本体と矢印部が分かれたボタン。menu でドロップダウンを表示。 */
export function SplitButton({ config }: RendererProps) {
  const menu = normalizeMenu(config.menu)
  return (
    <MenuTrigger menu={menu}>
      {(open, toggle) => (
        <span className={cx('sx-btn', 'sx-splitbtn', config.ui === 'primary' && 'sx-btn-primary', config.cls)} style={styleOf(config)}>
          <button type="button" className="sx-splitbtn-main" disabled={config.disabled}>
            <Icon iconCls={config.iconCls} />
            {config.text}
          </button>
          <button
            type="button"
            className="sx-splitbtn-arrow"
            disabled={config.disabled}
            onClick={toggle}
            aria-expanded={open}
            aria-label="メニュー"
          >
            ▾
          </button>
        </span>
      )}
    </MenuTrigger>
  )
}

// ---------------------------------------------------------------- progressbar

/** xtype: 'progressbar' — 進捗バー。value(0〜1)で進捗、text でラベルを上書き。 */
export function ProgressBar({ config }: RendererProps) {
  const value = Math.min(Math.max((config.value as number | undefined) ?? 0, 0), 1)
  return (
    <div
      className={cx('sx-progress', config.cls)}
      style={styleOf(config)}
      role="progressbar"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="sx-progress-fill" style={{ inlineSize: `${value * 100}%` }} />
      <span className="sx-progress-text">
        {(config.text as string | undefined) ?? `${Math.round(value * 100)}%`}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------- slider

/** xtype: 'slider' | 'sliderfield' — スライダー。value / minValue / maxValue / increment に対応。 */
export function Slider({ config }: RendererProps) {
  const slider = (
    <input
      type="range"
      className="sx-slider"
      min={(config.minValue as number | undefined) ?? 0}
      max={(config.maxValue as number | undefined) ?? 100}
      step={(config.increment as number | undefined) ?? 1}
      defaultValue={(config.value as number | undefined) ?? 0}
      disabled={config.disabled}
    />
  )
  if (config.fieldLabel === undefined) {
    return (
      <span className={cx('sx-field', config.cls)} style={styleOf(config)}>
        <span className="sx-field-body">{slider}</span>
      </span>
    )
  }
  return (
    <label className={cx('sx-field', config.cls)} style={styleOf(config)}>
      <span className="sx-field-label" style={{ inlineSize: toCssSize(config.labelWidth) ?? 'var(--sx-label-width)' }}>
        {config.fieldLabel}:
      </span>
      <span className="sx-field-body">{slider}</span>
    </label>
  )
}

// ------------------------------------------------- radiogroup / checkboxgroup

/**
 * xtype: 'radiogroup' | 'checkboxgroup'
 * items の boxLabel を columns 列に並べる。
 */
export function CheckGroup({ config }: RendererProps) {
  const isRadio = config.xtype === 'radiogroup'
  const items = (config.items ?? []).filter(
    (it): it is ComponentConfig => typeof it === 'object' && it !== null,
  )
  const columns = typeof config.columns === 'number' ? config.columns : items.length
  return (
    <label className={cx('sx-field', config.cls)} style={styleOf(config)}>
      {config.fieldLabel !== undefined && (
        <span className="sx-field-label" style={{ inlineSize: toCssSize(config.labelWidth) ?? 'var(--sx-label-width)' }}>
          {config.fieldLabel}:
        </span>
      )}
      <span
        className="sx-field-body sx-checkgroup"
        style={{ gridTemplateColumns: `repeat(${columns}, auto)` }}
      >
        {items.map((it, i) => (
          <span key={i} className="sx-checkitem">
            <input
              type={isRadio ? 'radio' : 'checkbox'}
              name={(it.name ?? config.name) as string | undefined}
              defaultChecked={it.checked}
              disabled={it.disabled ?? config.disabled}
            />
            {it.boxLabel && <span className="sx-boxlabel">{it.boxLabel}</span>}
          </span>
        ))}
      </span>
    </label>
  )
}
