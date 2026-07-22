/**
 * remark プラグイン: Markdown / MDX 内の ```extjs コードフェンスを
 * <ExtMockup code="..." /> (React コンポーネント) に変換する。
 * Mermaid.js のコードフェンスと同じ書き心地で画面モックを埋め込める。
 *
 * ```extjs height=420
 * { xtype: 'panel', title: 'Hello' }
 * ```
 *
 * meta 部の height=<数値|CSS長さ> で表示高さ、theme=<neptune|classic|gray|dark> で
 * テーマを指定できる (height 省略時は defaultHeight)。
 * 必要な import (ExtMockup) は自動で注入される。
 *
 * @param {object} [options]
 * @param {string[]} [options.langs] 対象のフェンス言語 (default: ['uivolve', 'extjs', 'sx'])
 * @param {string} [options.componentName] 出力する JSX コンポーネント名 (default: 'ExtMockup')
 * @param {string} [options.importSource] import 元 (default: '@uivolve/core')
 * @param {number|string} [options.defaultHeight] height 未指定時の高さ (default: 360)
 * @param {boolean} [options.clientLoad] Astro の client:load 属性を付ける (default: true)
 * @param {boolean} [options.injectImport] import 文を自動注入する (default: true)。
 *   ブラウザ内で mdx の evaluate() を使う場合は false にして components prop で渡す
 */
export default function remarkUivolve(options = {}) {
  const {
    langs = ['uivolve', 'extjs', 'sx'],
    componentName = 'ExtMockup',
    importSource = '@uivolve/core',
    defaultHeight = 360,
    clientLoad = true,
    injectImport = true,
  } = options

  return (tree) => {
    let used = false

    walk(tree, (node, index, parent) => {
      if (node.type !== 'code' || !langs.includes(node.lang)) return
      used = true

      const heightMatch = /height=(\S+)/.exec(node.meta ?? '')
      const height = normalizeHeight(heightMatch?.[1] ?? defaultHeight)
      const themeMatch = /theme=(\S+)/.exec(node.meta ?? '')

      const attributes = [
        { type: 'mdxJsxAttribute', name: 'code', value: node.value },
        { type: 'mdxJsxAttribute', name: 'height', value: height },
      ]
      if (themeMatch) {
        attributes.push({ type: 'mdxJsxAttribute', name: 'theme', value: themeMatch[1] })
      }
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
    if (injectImport && used && !hasImport(tree, componentName)) {
      tree.children.unshift(buildImportNode(componentName, importSource))
    }
  }
}

/**
 * MDX が構文エラーにする HTML コメント (<!-- -->) を除去するユーティリティ。
 * 素の Markdown をブラウザ内 evaluate() でコンパイルする前の救済に使う
 * (MDX Playground / VSCode 拡張のプレビュー)。
 * コードフェンス内とインラインコード内のコメントはそのまま残し、
 * エラー位置がずれないよう除去したコメント内の改行は残す。
 *
 * @param {string} source
 * @returns {string}
 */
export function stripHtmlComments(source) {
  const out = []
  let buffer = []
  let fenceMarker = null

  const flush = () => {
    if (!buffer.length) return
    out.push(
      // インラインコード (`...`) は保持し、HTML コメントだけ改行を残して除去する
      buffer.join('\n').replace(/(`+)[\s\S]*?\1|<!--[\s\S]*?-->/g, (m) =>
        m.startsWith('`') ? m : '\n'.repeat(m.split('\n').length - 1),
      ),
    )
    buffer = []
  }

  for (const line of source.split('\n')) {
    const fence = /^ {0,3}(`{3,}|~{3,})/.exec(line)
    if (fenceMarker === null && fence) {
      flush()
      fenceMarker = fence[1][0]
      out.push(line)
    } else if (fenceMarker !== null) {
      out.push(line)
      if (fence && fence[1][0] === fenceMarker) fenceMarker = null
    } else {
      buffer.push(line)
    }
  }
  flush()
  return out.join('\n')
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
