import { useState } from 'react'
import type { RendererProps } from '../types'
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

/**
 * xtype: 'treepanel' | 'tree' — 階層ツリー。
 * ExtJS の TreeStore 同様、root: { children: [...] } 形式のノードを描画する。
 * ノード: { text, leaf, expanded, children }
 */
export function TreePanel({ config }: RendererProps) {
  const root = (config.root as TreeNode | undefined) ?? { children: config.children as TreeNode[] | undefined }
  const rootVisible = config.rootVisible === true
  const nodes = rootVisible ? [root] : root.children ?? []
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
