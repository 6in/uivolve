/**
 * remark プラグイン: Markdown / MDX 内の ```uivolve コードフェンス、および
 * <uivolve src="./dsl/foo.yaml" /> タグを <ExtMockup code="..." /> (React コンポーネント)
 * に変換する。Mermaid.js のコードフェンスと同じ書き心地で画面モックを埋め込める。
 *
 * ```uivolve height=420
 * { xtype: 'panel', title: 'Hello' }
 * ```
 *
 * meta 部の height=<数値|CSS長さ> で表示高さ、theme=<neptune|classic|gray|dark> で
 * テーマを指定できる (height 省略時は defaultHeight)。
 *
 * DSL を別ファイルに置く場合はタグで参照する (MDX のみ。パスは MDX ファイル相対):
 *
 * <uivolve src="./dsl/order-main.yaml" height={440} theme="dark" />
 *
 * 参照先はコンパイル時に読み込んで code 属性へインライン展開するので、
 * 描画側 (ExtMockup) はフェンスと同じ扱いになる。src 以外の属性はそのまま引き継ぐ。
 * 必要な import (ExtMockup) は自動で注入される。
 *
 * @param {object} [options]
 * @param {string[]} [options.langs] 対象のフェンス言語 (default: ['uivolve', 'extjs', 'sx'])
 * @param {string[]} [options.tagNames] src 参照に使うタグ名 (default: ['uivolve'])。
 *   componentName (ExtMockup) に src 属性を付けた場合も同様に展開される
 * @param {string} [options.componentName] 出力する JSX コンポーネント名 (default: 'ExtMockup')
 * @param {string} [options.importSource] import 元 (default: '@uivolve/core')
 * @param {number|string} [options.defaultHeight] height 未指定時の高さ (default: 360)
 * @param {boolean} [options.clientLoad] Astro の client:load 属性を付ける (default: true)
 * @param {boolean} [options.injectImport] import 文を自動注入する (default: true)。
 *   ブラウザ内で mdx の evaluate() を使う場合は false にして components prop で渡す
 * @param {(src: string, ctx: { path?: string, dirname?: string, cwd?: string }) =>
 *   string | null | undefined | Promise<string | null | undefined>} [options.readFile]
 *   src 参照の読み込み。既定は Node の fs (MDX ファイルのディレクトリ基準で解決、
 *   http(s) URL は fetch)。ブラウザ内 evaluate() では必ず指定する。
 *   null / undefined を返すと code なしの <ExtMockup src="..." /> を出力する (描画側が
 *   components で ExtMockup をラップしてプレースホルダを描画できる。MDX は小文字の
 *   独自タグを components で差し替えられないため)。例外を投げるとコンパイルエラーになる
 */
export default function remarkUivolve(options = {}) {
  const {
    langs = ['uivolve', 'extjs', 'sx'],
    tagNames = ['uivolve'],
    componentName = 'ExtMockup',
    importSource = '@uivolve/core',
    defaultHeight = 360,
    clientLoad = true,
    injectImport = true,
    readFile = defaultReadFile,
  } = options

  const isSrcTag = (node) =>
    (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
    (tagNames.includes(node.name) || (node.name === componentName && findAttr(node, 'src')))

  return async (tree, file) => {
    let used = false
    const pending = []

    walk(tree, (node, index, parent) => {
      if (node.type === 'code' && langs.includes(node.lang)) {
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
        return
      }

      if (isSrcTag(node)) {
        pending.push(expandSrcTag(node, index, parent))
      }
    })

    // src 参照は非同期に読み込み、全部そろってからツリーを差し替える
    for (const replaced of await Promise.all(pending)) {
      if (replaced) used = true
    }

    // 使われたページにだけ import を注入 (手書きの import があればスキップ)
    if (injectImport && used && !hasImport(tree, componentName)) {
      tree.children.unshift(buildImportNode(componentName, importSource))
    }

    /** <uivolve src> を <ExtMockup code> に置き換える (解決できなければ <ExtMockup src>)。常に true */
    async function expandSrcTag(node, index, parent) {
      const srcAttr = findAttr(node, 'src')
      const src = srcAttr?.value
      if (typeof src !== 'string' || !src) {
        fail(file, `<${node.name}> には src="<DSL ファイルのパス>" を文字列で指定してください`, node)
      }

      let code
      try {
        code = await readFile(src, { path: file?.path, dirname: file?.dirname, cwd: file?.cwd })
      } catch (e) {
        fail(file, `<${node.name} src="${src}"> の読み込みに失敗: ${e?.message ?? e}`, node)
      }
      // 解決できない環境 (null): code を付けず src を残して渡し、描画側のプレースホルダに任せる
      const attributes =
        code == null ? [] : [{ type: 'mdxJsxAttribute', name: 'code', value: String(code) }]
      let hasHeight = false
      let hasClientLoad = false
      for (const attr of node.attributes ?? []) {
        if (attr.type !== 'mdxJsxAttribute') continue
        if (attr.name === 'src' && code != null) continue
        if (attr.name === 'height') {
          hasHeight = true
          // height="440" は px に正規化。height={440} などの式はそのまま渡す
          attributes.push(
            typeof attr.value === 'string' ? { ...attr, value: normalizeHeight(attr.value) } : attr,
          )
          continue
        }
        if (attr.name === 'client:load') hasClientLoad = true
        attributes.push(attr)
      }
      if (!hasHeight) {
        attributes.push({
          type: 'mdxJsxAttribute',
          name: 'height',
          value: normalizeHeight(defaultHeight),
        })
      }
      if (clientLoad && !hasClientLoad) {
        attributes.push({ type: 'mdxJsxAttribute', name: 'client:load', value: null })
      }

      parent.children[index] = {
        type: node.type,
        name: componentName,
        attributes,
        children: [],
        position: node.position,
      }
      return true
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

/**
 * src 参照の既定の読み込み。http(s) は fetch、それ以外は Node の fs で
 * MDX ファイルのディレクトリ (なければ cwd) 基準に解決する。
 * ブラウザ (process.getBuiltinModule がない環境) では相対パスを解決できないので、
 * readFile オプションで差し替えることを促すエラーにする。
 * node:fs を import しないのは、ブラウザ向けバンドル (Vite / esbuild) を壊さないため。
 *
 * @param {string} src
 * @param {{ dirname?: string, cwd?: string }} [ctx]
 * @returns {Promise<string>}
 */
export async function defaultReadFile(src, { dirname, cwd } = {}) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src)
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    return res.text()
  }
  const builtin = globalThis.process?.getBuiltinModule
  if (typeof builtin !== 'function') {
    throw new Error(
      'この環境では相対パスの src を解決できません (remarkUivolve の readFile オプションを指定してください)',
    )
  }
  const fs = builtin('node:fs/promises')
  const path = builtin('node:path')
  return fs.readFile(path.resolve(dirname ?? cwd ?? process.cwd(), src), 'utf8')
}

function normalizeHeight(v) {
  return /^\d+$/.test(String(v)) ? `${v}px` : String(v)
}

function findAttr(node, name) {
  return (node.attributes ?? []).find((a) => a.type === 'mdxJsxAttribute' && a.name === name)
}

/** VFile があれば行・列付きのエラー (VFileMessage) にする */
function fail(file, message, node) {
  if (file && typeof file.fail === 'function') file.fail(message, node)
  throw new Error(message)
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
