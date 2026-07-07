import { useState } from 'react'
import type { ColumnConfig, ComponentConfig, RendererProps } from '../types'
import { cx } from '../utils'
import { PanelShell } from './Panel'

interface TreeNode {
  text?: string
  leaf?: boolean
  expanded?: boolean
  iconCls?: string
  children?: TreeNode[]
  [key: string]: unknown
}

/** config から表示対象のトップレベルノード一覧を取り出す */
function rootNodesOf(config: ComponentConfig): TreeNode[] {
  const root =
    (config.root as TreeNode | undefined) ?? { children: config.children as TreeNode[] | undefined }
  return config.rootVisible === true ? [root] : root.children ?? []
}

/**
 * xtype: 'treepanel' | 'tree' — 階層ツリー。
 * ExtJS の TreeStore 同様、root: { children: [...] } 形式のノードを描画する。
 * ノード: { text, leaf, expanded, children }
 * columns (先頭または xtype: 'treecolumn' の列が階層表示になる) を指定すると
 * **ツリーグリッド**になり、各ノードの任意のフィールドを列として表示できる。
 * columnLines はグリッド同様にカラム区切り線を表示する。
 */
export function TreePanel({ config }: RendererProps) {
  if (Array.isArray(config.columns)) return <TreeGrid config={config} columns={config.columns} />
  const nodes = rootNodesOf(config)
  return (
    <PanelShell config={config} bodyClassName="sx-tree-body">
      <ul className="sx-tree" role="tree">
        {nodes.map((n, i) => (
          <TreeNodeRow key={i} node={n} depth={0} />
        ))}
      </ul>
    </PanelShell>
  )
}

function TreeNodeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const [expanded, setExpanded] = useState(node.expanded === true)
  const isLeaf = node.leaf === true || !node.children?.length
  return (
    <li role="treeitem" aria-expanded={isLeaf ? undefined : expanded}>
      <div
        className={cx('sx-tree-node', !isLeaf && 'sx-clickable')}
        style={{ paddingInlineStart: depth * 18 + 6 }}
        onClick={isLeaf ? undefined : () => setExpanded((e) => !e)}
      >
        <span className="sx-tree-expander" aria-hidden>
          {isLeaf ? '' : expanded ? '▾' : '▸'}
        </span>
        <span className="sx-tree-icon" aria-hidden>
          {isLeaf ? '📄' : expanded ? '📂' : '📁'}
        </span>
        <span className="sx-tree-text">{node.text}</span>
      </div>
      {!isLeaf && expanded && (
        <ul className="sx-tree" role="group">
          {node.children!.map((c, i) => (
            <TreeNodeRow key={i} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

// ---------------------------------------------------------- ツリーグリッド

interface FlatRow {
  node: TreeNode
  depth: number
  // ツリー内の位置から作る一意キー ('0/2/1' 形式)
  key: string
  isLeaf: boolean
}

/**
 * treepanel の columns 指定時の描画。
 * subgrid の列揃えを効かせるため、展開状態のノードをフラットな行列に
 * 変換してから GridPanel と同じ構造で描画する (行のネストはしない)。
 */
function TreeGrid({ config, columns }: { config: ComponentConfig; columns: ColumnConfig[] }) {
  const nodes = rootNodesOf(config)

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    const keys = new Set<string>()
    const walk = (list: TreeNode[], prefix: string) =>
      list.forEach((n, i) => {
        const key = prefix + i
        if (n.expanded === true) keys.add(key)
        if (n.children) walk(n.children, key + '/')
      })
    walk(nodes, '')
    return keys
  })
  const [selected, setSelected] = useState<string | null>(null)

  const toggle = (key: string) =>
    setExpandedKeys((cur) => {
      const next = new Set(cur)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const rows: FlatRow[] = []
  const collect = (list: TreeNode[], depth: number, prefix: string) =>
    list.forEach((n, i) => {
      const key = prefix + i
      const isLeaf = n.leaf === true || !n.children?.length
      rows.push({ node: n, depth, key, isLeaf })
      if (!isLeaf && expandedKeys.has(key)) collect(n.children!, depth + 1, key + '/')
    })
  collect(nodes, 0, '')

  const treeColIndex = Math.max(0, columns.findIndex((c) => c.xtype === 'treecolumn'))
  const template = columns
    .map((c) => {
      if (c.width !== undefined) return typeof c.width === 'number' ? `${c.width}px` : c.width
      return `${c.flex ?? 1}fr`
    })
    .join(' ')

  return (
    <PanelShell config={config} bodyClassName="sx-gridpanel-body">
      <div
        className={cx(
          'sx-grid',
          'sx-treegrid',
          config.columnLines === true && 'sx-grid-columnlines',
        )}
        style={{ gridTemplateColumns: template }}
        role="treegrid"
      >
        <div className="sx-grid-row sx-grid-headrow" role="row">
          {columns.map((c, i) => (
            <div key={i} className={cx('sx-grid-cell', 'sx-grid-head')} role="columnheader">
              {c.text}
            </div>
          ))}
        </div>
        {rows.map(({ node, depth, key, isLeaf }) => (
          <div
            key={key}
            className={cx('sx-grid-row', selected === key && 'sx-grid-selected')}
            role="row"
            aria-expanded={isLeaf ? undefined : expandedKeys.has(key)}
            onClick={() => setSelected((cur) => (cur === key ? null : key))}
          >
            {columns.map((c, i) =>
              i === treeColIndex ? (
                <div
                  key={i}
                  className="sx-grid-cell sx-treecell"
                  style={{ paddingInlineStart: depth * 18 + 8 }}
                  role="gridcell"
                >
                  <span
                    className={cx('sx-tree-expander', !isLeaf && 'sx-clickable')}
                    aria-hidden
                    onClick={
                      isLeaf
                        ? undefined
                        : (e) => {
                            e.stopPropagation()
                            toggle(key)
                          }
                    }
                  >
                    {isLeaf ? '' : expandedKeys.has(key) ? '▾' : '▸'}
                  </span>
                  <span className="sx-tree-icon" aria-hidden>
                    {isLeaf ? '📄' : expandedKeys.has(key) ? '📂' : '📁'}
                  </span>
                  <span className="sx-tree-text">
                    {String(node[c.dataIndex ?? 'text'] ?? node.text ?? '')}
                  </span>
                </div>
              ) : (
                <div
                  key={i}
                  className="sx-grid-cell"
                  style={{ textAlign: c.align }}
                  role="gridcell"
                >
                  {String(node[c.dataIndex ?? ''] ?? '')}
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </PanelShell>
  )
}
