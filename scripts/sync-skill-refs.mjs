#!/usr/bin/env node --experimental-strip-types
/**
 * 配布用スキル (skills/uivolve-mock/references/) にリファレンス類を同期する。
 * npm run docs / npm run schema の後段で自動実行される (単体実行も可):
 *
 *   node --experimental-strip-types scripts/sync-skill-refs.mjs
 *
 * 同期内容:
 * 1. reference/components.md と reference/dsl.schema.json のコピー
 * 2. samples/ — Playground の全サンプル (apps/playground/src/samples.ts) を
 *    1 サンプル 1 ファイルの Markdown (```uivolve フェンス入り) に展開。
 *    MDX Playground にそのまま貼り付けてプレビューできる
 * 3. samples/doc-*.md — apps/mdx-demo の MDX 仕様書のフル例
 * 4. samples/INDEX.md — 一覧 + xtype / layout 逆引きの索引
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { samples } from '../apps/playground/src/samples.ts'
import { parseDsl } from '../packages/core/src/parser.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const refDir = path.join(root, 'skills/uivolve-mock/references')
const samplesDir = path.join(refDir, 'samples')

// ---------------------------------------------------- 1. リファレンスのコピー
fs.mkdirSync(refDir, { recursive: true })
for (const rel of ['reference/components.md', 'reference/dsl.schema.json']) {
  fs.copyFileSync(path.join(root, rel), path.join(refDir, path.basename(rel)))
  console.log(`synced: ${rel}`)
}

// ------------------------------------------------ 2. サンプルの展開と分析

/** config ツリーから使用 xtype / layout を収集する */
function collectUsage(node, acc) {
  if (node == null || typeof node !== 'object') return acc
  if (Array.isArray(node)) {
    for (const child of node) collectUsage(child, acc)
    return acc
  }
  if (typeof node.xtype === 'string') acc.xtypes.add(node.xtype)
  const layout = typeof node.layout === 'object' && node.layout ? node.layout.type : node.layout
  if (typeof layout === 'string') acc.layouts.add(layout)
  for (const key of ['items', 'tbar', 'bbar', 'buttons', 'columns']) {
    if (node[key] !== undefined) collectUsage(node[key], acc)
  }
  return acc
}

const CATEGORY_SLUG = {
  基本: 'basic',
  業務画面: 'business',
  コンポーネントカタログ: 'catalog',
}

fs.rmSync(samplesDir, { recursive: true, force: true })
fs.mkdirSync(samplesDir, { recursive: true })

const counters = {}
const entries = []
for (const sample of samples) {
  const slug = CATEGORY_SLUG[sample.category] ?? 'sample'
  counters[slug] = (counters[slug] ?? 0) + 1
  const file = `${slug}-${String(counters[slug]).padStart(2, '0')}.md`

  const acc = { xtypes: new Set(), layouts: new Set() }
  try {
    collectUsage(parseDsl(sample.code), acc)
  } catch (e) {
    throw new Error(`サンプル '${sample.name}' のパースに失敗: ${e.message}`)
  }
  const xtypes = [...acc.xtypes].sort()
  const layouts = [...acc.layouts].sort()

  const body = [
    `# ${sample.name}`,
    '',
    `- カテゴリ: ${sample.category}`,
    `- 使用 layout: ${layouts.map((l) => `\`${l}\``).join(', ') || '(なし)'}`,
    `- 使用 xtype: ${xtypes.map((x) => `\`${x}\``).join(', ') || '(なし)'}`,
    '',
    'このファイルごと MDX Playground (https://6in.github.io/uivolve/mdx-playground/) に',
    '貼り付けるとプレビューできる。',
    '',
    '```uivolve height=480',
    sample.code.replace(/\n$/, ''),
    '```',
    '',
  ].join('\n')
  fs.writeFileSync(path.join(samplesDir, file), body)
  entries.push({ file, name: sample.name, category: sample.category, xtypes, layouts })
}
console.log(`synced: samples/ に ${entries.length} サンプルを展開`)

// -------------------------------------------- 3. MDX 仕様書のフル例をコピー
const docs = [
  {
    src: 'apps/mdx-demo/src/pages/index.mdx',
    file: 'doc-order-spec.md',
    name: '受注管理システム 画面仕様書',
    note: '画面モック + itemId 対応表で構成する仕様書のフル例',
  },
  {
    src: 'apps/mdx-demo/src/pages/runbook.mdx',
    file: 'doc-incident-runbook.md',
    name: '障害対応報告書',
    note: 'chart / mermaid / terminal / diffeditor / networkgraph を使うリッチドキュメント例',
  },
]
for (const doc of docs) {
  const raw = fs
    .readFileSync(path.join(root, doc.src), 'utf8')
    // Astro 固有の frontmatter (layout) はスキル利用時には不要なので落とす
    .replace(/^layout: .*\n/m, '')
  fs.writeFileSync(path.join(samplesDir, doc.file), raw)
}
console.log(`synced: samples/ に MDX 仕様書のフル例 ${docs.length} 本をコピー`)

// ------------------------------------------------------------ 4. INDEX.md
const byCategory = new Map()
for (const e of entries) {
  if (!byCategory.has(e.category)) byCategory.set(e.category, [])
  byCategory.get(e.category).push(e)
}
const reverse = (key) => {
  const map = new Map()
  for (const e of entries) {
    for (const v of e[key]) {
      if (!map.has(v)) map.set(v, [])
      map.get(v).push(e.file.replace(/\.md$/, ''))
    }
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
}

const lines = [
  '# サンプル索引',
  '',
  'Playground の全サンプルを 1 ファイル 1 画面で収録したもの。生成したい画面に近い',
  'サンプルを 1〜2 本読んでから DSL を書くこと。各ファイルは MDX Playground に',
  'そのまま貼り付けてプレビューできる。',
  '',
  '> このディレクトリは `scripts/sync-skill-refs.mjs` が apps/playground/src/samples.ts と',
  '> apps/mdx-demo から自動生成する。直接編集しない。',
  '',
]

for (const [category, list] of byCategory) {
  lines.push(`## ${category}`, '', '| ファイル | 画面 | layout | 使用 xtype |', '|---|---|---|---|')
  for (const e of list) {
    const xs = e.xtypes.length > 10 ? `${e.xtypes.slice(0, 10).join(', ')}, …` : e.xtypes.join(', ')
    lines.push(`| [${e.file}](${e.file}) | ${e.name} | ${e.layouts.join(', ')} | ${xs} |`)
  }
  lines.push('')
}

lines.push('## MDX 仕様書のフル例 (文書構成の参考)', '', '| ファイル | 内容 | 補足 |', '|---|---|---|')
for (const doc of docs) {
  lines.push(`| [${doc.file}](${doc.file}) | ${doc.name} | ${doc.note} |`)
}
lines.push('')

lines.push('## xtype 逆引き (この xtype の実例が見たい)', '', '| xtype | サンプル |', '|---|---|')
for (const [xtype, files] of reverse('xtypes')) {
  lines.push(`| \`${xtype}\` | ${files.join(', ')} |`)
}
lines.push('', '## layout 逆引き', '', '| layout | サンプル |', '|---|---|')
for (const [layout, files] of reverse('layouts')) {
  lines.push(`| \`${layout}\` | ${files.join(', ')} |`)
}
lines.push('')

fs.writeFileSync(path.join(samplesDir, 'INDEX.md'), lines.join('\n'))
console.log('synced: samples/INDEX.md (一覧 + xtype/layout 逆引き)')
