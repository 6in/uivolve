import { useState, type ReactNode } from 'react'
import { LayoutBody } from '../layouts'
import type { ComponentConfig, RendererProps } from '../types'
import { cx, styleOf, toCssBox } from '../utils'
import { Icon } from './Icon'
import { Toolbar } from './Toolbar'

function normalizeBar(
  bar: ComponentConfig['tbar'],
): ComponentConfig | undefined {
  if (!bar) return undefined
  if (Array.isArray(bar)) return { xtype: 'toolbar', items: bar }
  return { xtype: 'toolbar', ...bar }
}

export interface PanelShellProps {
  config: ComponentConfig
  /** body の中身。省略時は items を layout で描画する */
  children?: ReactNode
  bodyClassName?: string
  className?: string
  /** 折りたたみ状態を外部から制御する場合 (accordion レイアウトなど) */
  collapsed?: boolean
  onToggleCollapse?: () => void
  /** ヘッダー右端に追加する要素 (window の閉じるボタンなど) */
  headerExtra?: ReactNode
}

/**
 * パネルの共通ガワ(ヘッダー + ツールバー + 折りたたみ可能な body)。
 * gridpanel など Panel 派生コンポーネントからも再利用する。
 */
export function PanelShell({
  config,
  children,
  bodyClassName,
  className,
  collapsed: collapsedProp,
  onToggleCollapse,
  headerExtra,
}: PanelShellProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(!!config.collapsed)
  const collapsed = collapsedProp ?? internalCollapsed
  const toggle = onToggleCollapse ?? (() => setInternalCollapsed((c) => !c))
  const collapsible = !!config.collapsible || collapsedProp !== undefined
  const hasHeader =
    config.title !== undefined || config.header === true || collapsible || headerExtra !== undefined
  const tbar = normalizeBar(config.tbar)
  const bbar = normalizeBar(config.bbar)

  const rootStyle = styleOf(config)
  if (collapsed) {
    // 折りたたみ時はヘッダーのみの高さへ
    delete rootStyle.height
    delete rootStyle.flex
  }

  return (
    <section
      className={cx(
        'sx-panel',
        config.frame && 'sx-panel-framed',
        collapsed && 'sx-collapsed',
        className,
        config.cls,
      )}
      style={rootStyle}
      aria-expanded={collapsible ? !collapsed : undefined}
    >
      {hasHeader && (
        <header
          className={cx('sx-panel-header', collapsible && 'sx-clickable')}
          onClick={collapsible ? toggle : undefined}
        >
          <Icon iconCls={config.iconCls as string | undefined} />
          <span className="sx-panel-title">{config.title}</span>
          {collapsible && (
            <span className="sx-tool" aria-hidden>
              {collapsed ? '▸' : '▾'}
            </span>
          )}
          {headerExtra}
        </header>
      )}
      <div className="sx-panel-bodywrap">
        <div className="sx-panel-inner">
          {tbar && <Toolbar config={tbar} />}
          <div
            className={cx('sx-panel-body', bodyClassName)}
            style={{ padding: toCssBox(config.bodyPadding) }}
          >
            {children ?? (
              <>
                {typeof config.html === 'string' && (
                  <div
                    className="sx-html"
                    dangerouslySetInnerHTML={{ __html: config.html }}
                  />
                )}
                <LayoutBody config={config} />
              </>
            )}
          </div>
          {bbar && <Toolbar config={bbar} />}
        </div>
      </div>
    </section>
  )
}

/**
 * xtype: 'panel' | 'form' — タイトルバー付きの基本パネル。
 * collapsible / collapsed(折りたたみ)、tbar / bbar(ツールバー)、
 * bodyPadding / html / iconCls に対応。form は body がフォームスタイルになる。
 */
export function Panel({ config }: RendererProps) {
  const isForm = config.xtype === 'form'
  return (
    <PanelShell
      config={isForm && config.bodyPadding === undefined ? { ...config, bodyPadding: 12 } : config}
      bodyClassName={isForm ? 'sx-form-body' : undefined}
    />
  )
}

/** xtype: 'container' | 'fieldcontainer' — ヘッダーなしの汎用コンテナ。layout と items で子を配置する。 */
export function Container({ config }: RendererProps) {
  return (
    <div
      className={cx('sx-container', config.cls)}
      style={{ ...styleOf(config), padding: toCssBox(config.padding) }}
    >
      <LayoutBody config={config} />
    </div>
  )
}

/** xtype: 'component' | 'box' — html / text をそのまま描画 */
export function RawComponent({ config }: RendererProps) {
  return (
    <div className={cx('sx-component', config.cls)} style={styleOf(config)}>
      {typeof config.html === 'string' ? (
        <span dangerouslySetInnerHTML={{ __html: config.html }} />
      ) : (
        <span>{config.text ?? (config.value as string | undefined)}</span>
      )}
    </div>
  )
}
