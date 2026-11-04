#!/usr/bin/env node --experimental-strip-types
/**
 * uivolve DSL の検証スクリプト。
 * DSL ファイル (.yaml / .json5 / .uivolve) または Markdown / MDX
 * (```uivolve フェンスと <uivolve src="..."> の参照先を抽出) を受け取り、以下をチェックする:
 *
 * 1. parseDsl で構文解析できること
 * 2. xtype / layout が登録済みのものであること (meta.ts と照合)
 * 3. itemId の付与漏れ (警告のみ — 仕様書から部品を参照するための推奨規約)
 *
 * MDX の図・表フェンス (remark-mock の DEFAULT_FENCE_LANGS) は次を検証する:
 * - データ型 (echarts / vega-lite / table / wavedrom): JSON5 / YAML の構文とルートの形
 * - csv / tsv: 閉じていないダブルクォートと、見出し行との列数の不一致
 * - それ以外 (mermaid / dbml / dot / math など) はブラウザでの描画時に検証されるのでスキップ
 *
 * 使い方:
 *   npm run validate -- <file...>
 *   node --experimental-strip-types scripts/validate-dsl.mjs <file...>
 *
 * config キー単位の厳密な検証には reference/dsl.schema.json (JSON Schema) を使う。
 */
import fs from 'node:fs'
import path from 'node:path'
import { allLayoutNames, allXtypeNames } from '../packages/core/src/meta.ts'
import { parseCsv } from '../packages/core/src/blocks/csv.ts'
import { checkFenceData, DATA_FENCE_LANGS } from '../packages/core/src/blocks/shapes.ts'
import { parseData, parseDsl } from '../packages/core/src/parser.ts'
import { DEFAULT_FENCE_LANGS } from '../packages/remark-mock/index.mjs'

const XTYPES = new Set(allXtypeNames())
const LAYOUTS = new Set(allLayoutNames())
// 列専用の xtype (GridPanel / TreePanel 内部で処理されレジストリには載らない)
const COLUMN_XTYPES = new Set(['checkcolumn', 'actioncolumn', 'widgetcolumn', 'treecolumn'])
const UIVOLVE_LANGS = new Set(['uivolve', 'extjs', 'sx'])
// 図・表フェンス (FenceBlock に変換されるもの)
const BLOCK_LANGS = new Set(DEFAULT_FENCE_LANGS)
// 子コンポーネントを持ちうるキー (columns は checkcolumn など xtype 付きの列のみ検証)
const CHILD_KEYS = ['items', 'tbar', 'bbar', 'buttons', 'columns']

/**
 * Markdown / MDX から ```uivolve と図・表のフェンスを抽出する。[{ lang, code, line, miscased }] を返す。
 * 言語名の扱いは remark-mock と同じ: uivolve / extjs / sx は大文字小文字を区別し、
 * 図・表フェンスは区別しない。```Uivolve のように描画されない書き方は miscased として返す。
 * 対象外のフェンス (````md など) も開閉を追跡し、その中に例示されたフェンスは拾わない
 */
function extractFences(source) {
  const fences = []
  const lines = source.split('\n')
  let open = null // { marker, fence, raw, start, buf }
  for (let i = 0; i < lines.length; i++) {
    const m = /^ {0,3}(`{3,}|~{3,})\s*(\S*)/.exec(lines[i])
    if (!open && m) {
      open = { marker: m[1][0], fence: m[1], raw: m[2].split(/\s/)[0], start: i + 2, buf: [] }
    } else if (open && m && m[1][0] === open.marker && m[1].length >= open.fence.length && !m[2]) {
      const { raw } = open
      const lower = raw.toLowerCase()
      const code = open.buf.join('\n')
      if (UIVOLVE_LANGS.has(raw) || BLOCK_LANGS.has(lower)) {
        fences.push({ lang: UIVOLVE_LANGS.has(raw) ? raw : lower, code, line: open.start })
      } else if (UIVOLVE_LANGS.has(lower)) {
        fences.push({ lang: raw, code, line: open.start, miscased: true })
      }
      open = null
    } else if (open) {
      open.buf.push(lines[i])
    }
  }
  return fences
}

/** 図・表フェンスの検証。テキスト型 (mermaid など) は skipped を返す */
function validateBlock(lang, code, label, lineOffset) {
  const errors = []
  if (lang === 'csv' || lang === 'tsv') {
    let rows
    try {
      rows = parseCsv(code, lang === 'tsv' ? '\t' : ',')
    } catch (e) {
      return { label, errors: [`構文エラー: フェンス内 ${e.message}`], warnings: [] }
    }
    const width = rows[0]?.length ?? 0
    rows.forEach((row, i) => {
      if (i > 0 && row.length !== width) {
        errors.push(`フェンス内 ${i + 1} 行目の列数 (${row.length}) が見出し行 (${width}) と一致しない`)
      }
    })
    return { label, errors, warnings: [] }
  }
  if (!DATA_FENCE_LANGS.includes(lang)) {
    return { label, errors, warnings: [], skipped: true }
  }
  let data
  try {
    data = parseData(code)
  } catch (e) {
    const line = e.line != null ? ` (${e.line + lineOffset} 行目付近)` : ''
    return { label, errors: [`構文エラー${line}: ${e.message}`], warnings: [] }
  }
  // 形の条件は描画側 (FenceBlock) と同じ shapes.ts を使う
  const problem = checkFenceData(lang, data)
  if (problem) errors.push(problem)
  return { label, errors, warnings: [] }
}

/**
 * コードフェンスの中身とインラインコード (`...`) を空白にする (行番号は維持)。
 * 本文中のタグの例示を抽出対象から外す
 */
function blankCode(source) {
  let marker = null
  return source
    .split('\n')
    .map((line) => {
      const m = /^ {0,3}(`{3,}|~{3,})/.exec(line)
      if (marker === null && m) marker = m[1][0]
      else if (marker !== null && m && m[1][0] === marker) marker = null
      else if (marker !== null) return ''
      return marker === null ? line.replace(/`[^`]*`/g, (c) => ' '.repeat(c.length)) : ''
    })
    .join('\n')
}

/** MDX から <uivolve src="..."> / <ExtMockup src="..."> タグを抽出する。[{ src, line }] を返す */
function extractSrcRefs(source) {
  const refs = []
  const re = /<(?:uivolve|ExtMockup)\b[^>]*?\bsrc=(?:"([^"]*)"|'([^']*)')/g
  const text = blankCode(source)
  let m
  while ((m = re.exec(text))) {
    refs.push({ src: m[1] ?? m[2], line: text.slice(0, m.index).split('\n').length })
  }
  return refs
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
    ? [
        ...extractFences(source).map((f, i) => {
          const label = `${file} フェンス#${i + 1} ${f.lang} (${f.line} 行目〜)`
          if (f.miscased) {
            const msg = `言語名は小文字で書く (\`\`\`${f.lang.toLowerCase()})。このままでは画面モックとして描画されない`
            return { label, errors: [msg], warnings: [] }
          }
          return UIVOLVE_LANGS.has(f.lang)
            ? validateDsl(f.code, label, f.line - 1)
            : validateBlock(f.lang, f.code, label, f.line - 1)
        }),
        // <uivolve src> は MDX ファイル相対で参照先を読んで検証する (URL はスキップ)
        ...extractSrcRefs(source).map((r) => {
          const label = `${file} ${r.line} 行目 <uivolve src="${r.src}">`
          if (/^https?:\/\//.test(r.src)) {
            return { label, errors: [], warnings: ['URL 参照は検証をスキップ'] }
          }
          const target = path.resolve(path.dirname(file), r.src)
          if (!fs.existsSync(target)) {
            return { label, errors: [`参照先が見つからない: ${target}`], warnings: [] }
          }
          return validateDsl(fs.readFileSync(target, 'utf8'), label)
        }),
      ]
    : [validateDsl(source, file)]

  if (!results.length) {
    console.log(`- ${file}: uivolve / 図・表のコードフェンス、<uivolve src> が見つからない`)
    continue
  }
  for (const { label, errors, warnings, skipped } of results) {
    if (skipped) {
      console.log(`- ${label}: 検証対象外 (ブラウザでの描画時に検証)`)
      continue
    }
    const mark = errors.length ? '✕' : '✓'
    console.log(`${mark} ${label}`)
    for (const e of errors) console.log(`    エラー: ${e}`)
    for (const w of warnings) console.log(`    警告:   ${w}`)
    if (errors.length) failed = true
  }
}
process.exit(failed ? 1 : 0)
