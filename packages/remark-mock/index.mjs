/**
 * remark プラグイン: Markdown / MDX 内の ```extjs コードフェンスを
 * <ExtMockup code="..." /> (React コンポーネント) に変換する。
 * Mermaid.js のコードフェンスと同じ書き心地で画面モックを埋め込める。
 *
 * ```extjs height=420
 * { xtype: 'panel', title: 'Hello' }
 * ```
 *
 * meta 部の height=<数値|CSS長さ> で表示高さを指定できる (省略時は defaultHeight)。
 * 必要な import (ExtMockup) は自動で注入される。
 *
 * @param {object} [options]
 * @param {string[]} [options.langs] 対象のフェンス言語 (default: ['extjs', 'similar-extjs', 'sx'])
 * @param {string} [options.componentName] 出力する JSX コンポーネント名 (default: 'ExtMockup')
 * @param {string} [options.importSource] import 元 (default: '@similar-extjs/core')
 * @param {number|string} [options.defaultHeight] height 未指定時の高さ (default: 360)
 * @param {boolean} [options.clientLoad] Astro の client:load 属性を付ける (default: true)
 */
export default function remarkSimilarExtjs(options = {}) {
  const {
    langs = ['extjs', 'similar-extjs', 'sx'],
    componentName = 'ExtMockup',
    importSource = '@similar-extjs/core',
    defaultHeight = 360,
    clientLoad = true,
  } = options

  return (tree) => {
    let used = false

    walk(tree, (node, index, parent) => {
      if (node.type !== 'code' || !langs.includes(node.lang)) return
      used = true

      const heightMatch = /height=(\S+)/.exec(node.meta ?? '')
      const height = normalizeHeight(heightMatch?.[1] ?? defaultHeight)

      const attributes = [
        { type: 'mdxJsxAttribute', name: 'code', value: node.value },
        { type: 'mdxJsxAttribute', name: 'height', value: height },
      ]
      if (clientLoad) {
        // Astro でのハイドレーション (折りたたみ・タブ切替などを有効化)
        attributes.push({ type: 'mdxJsxAttribute', name: 'client:load', value: null })
      }

      parent.children[index] = {
        type: 'mdxJsxFlowElement',
        name: componentName,
        attributes,
        children: [],
      }
    })

    // 使われたページにだけ import を注入 (手書きの import があればスキップ)
    if (used && !hasImport(tree, componentName)) {
      tree.children.unshift(buildImportNode(componentName, importSource))
    }
  }
}

function normalizeHeight(v) {
  return /^\d+$/.test(String(v)) ? `${v}px` : String(v)
}

function walk(node, fn) {
  if (!Array.isArray(node.children)) return
  node.children.forEach((child, i) => {
    fn(child, i, node)
    walk(child, fn)
  })
}

function hasImport(tree, name) {
  return tree.children.some(
    (n) => n.type === 'mdxjsEsm' && typeof n.value === 'string' && n.value.includes(name),
  )
}

function buildImportNode(name, source) {
  return {
    type: 'mdxjsEsm',
    value: `import { ${name} } from '${source}'`,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name },
                local: { type: 'Identifier', name },
              },
            ],
            source: { type: 'Literal', value: source, raw: `'${source}'` },
          },
        ],
      },
    },
  }
}
