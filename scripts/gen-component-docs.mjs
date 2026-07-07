#!/usr/bin/env node
/**
 * reference/components.md を packages/core のソースコードから自動生成する。
 *
 * 生成元:
 * - registerComponent() / registerLayout() の登録情報 (xtype / layout type と実装の対応)
 * - 各実装関数の直前にある JSDoc コメント (説明文)
 *
 * 使い方: npm run docs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const coreSrc = path.join(root, 'packages/core/src')
const outFile = path.join(root, 'reference/components.md')

// ---------------------------------------------------------------- 収集

/** ディレクトリ以下の .ts / .tsx を再帰的に列挙 */
function listSources(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return listSources(p)
    return /\.tsx?$/.test(e.name) ? [p] : []
  })
}

/** ソース中の JSDoc を関数/定数名 → 説明文のマップとして抽出 */
function extractJsdocs(source) {
  const map = new Map()
  const re = /\/\*\*([\s\S]*?)\*\/\s*(?:export\s+)?(?:function\s+(\w+)|const\s+(\w+))/g
  for (const m of source.matchAll(re)) {
    const name = m[2] ?? m[3]
    const text = m[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, '').trim())
      .filter((l) => l && !l.startsWith('@'))
      .join(' ')
    map.set(name, text)
  }
  return map
}

/** registerComponent / registerLayout の呼び出しから (登録名[], 実装名) を抽出 */
function extractRegistrations(source, fnName) {
  const list = []
  const re = new RegExp(`${fnName}\\(\\s*(\\[[^\\]]*\\]|'[^']+')\\s*,\\s*(\\w+)\\s*\\)`, 'g')
  for (const m of source.matchAll(re)) {
    const names = JSON.parse(m[1].replace(/'/g, '"'))
    list.push({ names: Array.isArray(names) ? names : [names], impl: m[2] })
  }
  return list
}

const sources = listSources(coreSrc).map((p) => ({ path: p, text: fs.readFileSync(p, 'utf8') }))

const jsdocs = new Map()
for (const s of sources) {
  for (const [name, text] of extractJsdocs(s.text)) {
    if (!jsdocs.has(name)) jsdocs.set(name, text)
  }
}

const components = sources.flatMap((s) => extractRegistrations(s.text, 'registerComponent'))
const layouts = sources.flatMap((s) => extractRegistrations(s.text, 'registerLayout'))

// ---------------------------------------------------------------- 整形

/** JSDoc 先頭の「xtype: '...' —」「fit:」のような登録名の繰り返しを除去 */
function cleanDescription(text) {
  if (!text) return '(JSDoc なし)'
  return text
    .replace(/^xtype:\s*'[^']*'(\s*\|\s*'[^']*')*\s*[—–-]?\s*/, '')
    .replace(/^[\w/ ]{1,24}:\s*/, '')
    .replace(/\|/g, '\\|')
    .trim()
}

function table(header, rows) {
  return [`| ${header.join(' | ')} |`, `|${header.map(() => '---').join('|')}|`, ...rows].join('\n')
}

const componentRows = components.map(({ names, impl }) => {
  const xtypes = names.map((n) => `\`${n}\``).join(' / ')
  return `| ${xtypes} | ${impl} | ${cleanDescription(jsdocs.get(impl))} |`
})

const layoutRows = layouts.map(({ names, impl }) => {
  const types = names.map((n) => `\`${n}\``).join(' / ')
  return `| ${types} | ${impl} | ${cleanDescription(jsdocs.get(impl))} |`
})

// ---------------------------------------------------------------- 出力

const md = `# コンポーネント / レイアウト リファレンス

> ⚠️ このファイルは \`npm run docs\` により packages/core のソースコード (JSDoc と
> registerComponent / registerLayout の登録) から**自動生成**されます。直接編集しないでください。
> 説明を変更したい場合は、実装ファイルの JSDoc を編集して再生成してください。

## コンポーネント (xtype)

${table(['xtype', '実装', '説明'], componentRows)}

## レイアウト (layout type)

${table(['type', '実装', '説明'], layoutRows)}

## 共通 config

すべてのコンポーネントで利用できる config:

| config | 説明 |
|---|---|
| \`width\` / \`height\` | サイズ (数値は px) |
| \`minWidth\` / \`minHeight\` | 最小サイズ |
| \`flex\` | hbox / vbox / border center などでの比率分配 |
| \`margin\` / \`padding\` | 余白。ExtJS 形式のスペース区切り (\`'5 10 5 10'\`) に対応 |
| \`hidden\` | 非表示 |
| \`disabled\` | 無効化 (入力系・ボタン系) |
| \`cls\` | 追加 CSS クラス |
| \`style\` | インラインスタイル (オブジェクト形式) |
| \`iconCls\` | アイコン。Font Awesome クラス対応 (\`'x-fa fa-plus'\` は ExtJS 互換で読み替え) |
| \`id\` / \`itemId\` | 識別子 (React の key にも利用) |

コンテナ系はさらに \`layout\` / \`items\` / \`defaults\` / \`tbar\` / \`bbar\` / \`bodyPadding\` / \`html\` が使える。

関連資料: [ExtJS レイアウト一覧と対応状況](extjs-layouts.md) / [README の DSL リファレンス](../README.md)
`

fs.writeFileSync(outFile, md)
console.log(
  `generated ${path.relative(root, outFile)}: ${components.length} component entries, ${layouts.length} layout entries`,
)
