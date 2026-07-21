#!/usr/bin/env node --experimental-strip-types
/**
 * uivolve DSL の検証スクリプト。
 * DSL ファイル (.yaml / .json5 / .uivolve) または Markdown / MDX
 * (```uivolve フェンスを抽出) を受け取り、以下をチェックする:
 *
 * 1. parseDsl で構文解析できること
 * 2. xtype / layout が登録済みのものであること (meta.ts と照合)
 * 3. itemId の付与漏れ (警告のみ — 仕様書から部品を参照するための推奨規約)
 *
 * 使い方:
 *   npm run validate -- <file...>
 *   node --experimental-strip-types scripts/validate-dsl.mjs <file...>
 *
 * config キー単位の厳密な検証には reference/dsl.schema.json (JSON Schema) を使う。
 */
import fs from 'node:fs'
import { allLayoutNames, allXtypeNames } from '../packages/core/src/meta.ts'
import { parseDsl } from '../packages/core/src/parser.ts'

const XTYPES = new Set(allXtypeNames())
const LAYOUTS = new Set(allLayoutNames())
// 列専用の xtype (GridPanel / TreePanel 内部で処理されレジストリには載らない)
const COLUMN_XTYPES = new Set(['checkcolumn', 'actioncolumn', 'widgetcolumn', 'treecolumn'])
const FENCE_LANGS = new Set(['uivolve', 'extjs', 'sx'])
// 子コンポーネントを持ちうるキー (columns は checkcolumn など xtype 付きの列のみ検証)
const CHILD_KEYS = ['items', 'tbar', 'bbar', 'columns']

/** Markdown / MDX から ```uivolve フェンスを抽出する。[{ code, line }] を返す */
function extractFences(source) {
  const fences = []
  const lines = source.split('\n')
  let open = null // { marker, lang, start, buf }
  for (let i = 0; i < lines.length; i++) {
    const m = /^ {0,3}(`{3,}|~{3,})\s*(\S*)/.exec(lines[i])
    if (!open && m && FENCE_LANGS.has(m[2].split(/\s/)[0])) {
      open = { marker: m[1][0], start: i + 2, buf: [] }
    } else if (open && m && m[1][0] === open.marker) {
      fences.push({ code: open.buf.join('\n'), line: open.start })
      open = null
    } else if (open) {
      open.buf.push(lines[i])
    }
  }
  return fences
}

/** config ツリーを歩いて問題を集める */
function walk(node, path, errors, warnings) {
  if (node == null || typeof node === 'string') return // '->' '-' などのショートハンド
  if (Array.isArray(node)) {
    node.forEach((child, i) => walk(child, `${path}[${i}]`, errors, warnings))
    return
  }
  if (typeof node !== 'object') return

  const xtype = node.xtype
  if (typeof xtype === 'string' && !XTYPES.has(xtype)) {
    errors.push(`${path}: 未知の xtype '${xtype}'`)
  }
  const layout = typeof node.layout === 'object' && node.layout ? node.layout.type : node.layout
  if (typeof layout === 'string' && !LAYOUTS.has(layout)) {
    errors.push(`${path}: 未知の layout '${layout}'`)
  }
  if (typeof xtype === 'string' && !node.itemId && path !== '$') {
    warnings.push(`${path}: itemId がない (xtype: '${xtype}') — 仕様書からの参照用に付与を推奨`)
  }
  for (const key of CHILD_KEYS) {
    if (key === 'columns') {
      // 列定義は xtype を持つもの (checkcolumn 等) だけ xtype 検証する
      if (Array.isArray(node.columns)) {
        node.columns.forEach((col, i) => {
          if (
            col &&
            typeof col === 'object' &&
            typeof col.xtype === 'string' &&
            !COLUMN_XTYPES.has(col.xtype) &&
            !XTYPES.has(col.xtype)
          ) {
            errors.push(`${path}.columns[${i}]: 未知の xtype '${col.xtype}'`)
          }
        })
      }
    } else if (node[key] !== undefined) {
      walk(node[key], `${path}.${key}`, errors, warnings)
    }
  }
}

function validateDsl(code, label, lineOffset = 0) {
  const errors = []
  const warnings = []
  let config
  try {
    config = parseDsl(code)
  } catch (e) {
    const line = e.line != null ? ` (${e.line + lineOffset} 行目付近)` : ''
    errors.push(`構文エラー${line}: ${e.message}`)
    return { label, errors, warnings }
  }
  walk(config, '$', errors, warnings)
  return { label, errors, warnings }
}

const files = process.argv.slice(2)
if (!files.length) {
  console.error('使い方: npm run validate -- <file.yaml|file.json5|file.mdx> ...')
  process.exit(2)
}

let failed = false
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  const results = /\.(md|mdx|markdown)$/i.test(file)
    ? extractFences(source).map((f, i) =>
        validateDsl(f.code, `${file} フェンス#${i + 1} (${f.line} 行目〜)`, f.line - 1),
      )
    : [validateDsl(source, file)]

  if (!results.length) {
    console.log(`- ${file}: uivolve コードフェンスが見つからない`)
    continue
  }
  for (const { label, errors, warnings } of results) {
    const mark = errors.length ? '✕' : '✓'
    console.log(`${mark} ${label}`)
    for (const e of errors) console.log(`    エラー: ${e}`)
    for (const w of warnings) console.log(`    警告:   ${w}`)
    if (errors.length) failed = true
  }
}
process.exit(failed ? 1 : 0)
