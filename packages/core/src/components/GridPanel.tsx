import { useState, type MouseEvent } from 'react'
import { XRender } from '../XRender'
import type { ColumnConfig, ComponentConfig, RendererProps } from '../types'
import { cx } from '../utils'
import { Icon } from './Icon'
import { PanelShell } from './Panel'

/**
 * セルの中身を列種別に応じて描画する (treepanel のツリーグリッドと共用)。
 * checkcolumn / actioncolumn / widgetcolumn / editor 付き通常列に対応。
 * セル内の操作は行選択のクリックと干渉しないよう伝播を止める。
 */
export function GridCellValue({
  col,
  row,
}: {
  col: ColumnConfig
  row: Record<string, unknown>
}) {
  const value = row[col.dataIndex ?? '']
  const stop = (e: MouseEvent) => e.stopPropagation()

  switch (col.xtype) {
    case 'checkcolumn':
      return <input type="checkbox" defaultChecked={!!value} onClick={stop} />
    case 'actioncolumn': {
      const actions = col.items?.length ? col.items : [{ iconCls: 'fa fa-pen' }]
      return (
        <>
          {actions.map((a, i) => (
            <button
              key={i}
              type="button"
              className="sx-grid-actionbtn"
              title={a.tooltip ?? (a.handler ? `handler: ${a.handler}` : undefined)}
              onClick={stop}
            >
              <Icon iconCls={a.iconCls} />
            </button>
          ))}
        </>
      )
    }
    case 'widgetcolumn': {
      const widget = col.widget ?? { xtype: 'progressbar' }
      return <XRender config={{ ...widget, value: widget.value ?? value }} />
    }
    default: {
      if (col.editor) {
        const editor: ComponentConfig = col.editor === true ? { xtype: 'textfield' } : col.editor
        if (editor.xtype === 'combobox' || editor.xtype === 'combo') {
          const options = Array.isArray(editor.options) ? editor.options : []
          return (
            <select
              className="sx-input sx-grid-editor"
              defaultValue={value === undefined ? undefined : String(value)}
              onClick={stop}
            >
              {options.map((o, i) =>
                typeof o === 'object' && o !== null ? (
                  <option key={i} value={String(o.value)}>
                    {o.text}
                  </option>
                ) : (
                  <option key={i}>{String(o)}</option>
                ),
              )}
            </select>
          )
        }
        const type =
          editor.xtype === 'numberfield' ? 'number' : editor.xtype === 'datefield' ? 'date' : 'text'
        return (
          <input
            className="sx-input sx-grid-editor"
            type={type}
            defaultValue={value as string | number | undefined}
            placeholder={editor.emptyText}
            onClick={stop}
          />
        )
      }
      return <>{String(value ?? '')}</>
    }
  }
}

/** checkcolumn / actioncolumn は既定で中央揃え */
export function cellAlign(col: ColumnConfig): 'left' | 'center' | 'right' | undefined {
  if (col.align) return col.align
  return col.xtype === 'checkcolumn' || col.xtype === 'actioncolumn' ? 'center' : undefined
}

/**
 * xtype: 'grid' | 'gridpanel' — データグリッド。
 * columns / store(または data)から表を描画する。
 * columnLines: true でカラム区切り線を表示 (ExtJS 互換)。
 * 列の xtype で checkcolumn (チェックボックス) / actioncolumn (アイコンボタン。items で複数) /
 * widgetcolumn (widget: { xtype: 'progressbar' } 等を埋め込み) が使える。
 * 通常列に editor: true (textfield) や editor: { xtype: 'numberfield' | 'combobox' } を
 * 指定するとセル内で入力できる (モックとして常時編集表示)。
 * CSS Grid + subgrid で列揃え・行ホバー・行選択を実現。
 */
export function GridPanel({ config }: RendererProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const columns: ColumnConfig[] = Array.isArray(config.columns) ? config.columns : []
  const data: Array<Record<string, unknown>> = Array.isArray(config.data)
    ? config.data
    : Array.isArray(config.store)
      ? config.store
      : config.store?.data ?? []

  const template = columns
    .map((c) => {
      if (c.width !== undefined) {
        return typeof c.width === 'number' ? `${c.width}px` : c.width
      }
      return `${c.flex ?? 1}fr`
    })
    .join(' ')

  return (
    <PanelShell config={config} bodyClassName="sx-gridpanel-body">
      <div
        className={cx('sx-grid', config.columnLines === true && 'sx-grid-columnlines')}
        style={{ gridTemplateColumns: template }}
        role="table"
      >
        <div className="sx-grid-row sx-grid-headrow" role="row">
          {columns.map((c, i) => (
            <div key={i} className={cx('sx-grid-cell', 'sx-grid-head')} role="columnheader">
              {c.text}
            </div>
          ))}
        </div>
        {data.map((row, r) => (
          <div
            key={r}
            className={cx('sx-grid-row', selected === r && 'sx-grid-selected')}
            role="row"
            onClick={() => setSelected((cur) => (cur === r ? null : r))}
          >
            {columns.map((c, i) => (
              <div
                key={i}
                className="sx-grid-cell"
                style={{ textAlign: cellAlign(c) }}
                role="cell"
              >
                <GridCellValue col={c} row={row} />
              </div>
            ))}
          </div>
        ))}
        {data.length === 0 && <div className="sx-grid-empty">データがありません</div>}
      </div>
    </PanelShell>
  )
}
