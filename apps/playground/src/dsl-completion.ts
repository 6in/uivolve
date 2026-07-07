/**
 * Monaco 向けの DSL 入力補完。
 *
 * - xtype の値位置       → 登録済み xtype 一覧
 * - layout の値位置      → レイアウト一覧
 * - オブジェクトのキー位置 → 囲んでいる xtype に応じた config 名 +
 *                          基本プロパティ入りのコンポーネントスニペット (Tab 移動対応)
 *
 * JSON5 (language: javascript) と YAML の両方に対応。
 * 候補・スニペットは @similar-extjs/core の XTYPE_META / LAYOUT_META から生成する。
 */
import {
  COMMON_PROPS,
  LAYOUT_META,
  XTYPE_META,
  getXtypeMeta,
} from '@similar-extjs/core'
import type * as Monaco from 'monaco-editor'

type Format = 'json5' | 'yaml'

// ---------------------------------------------------------------- スニペット生成

/** monaco スニペット構文のメタ文字をエスケープ */
function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\$/g, '\\$').replace(/\}/g, '\\}')
}

class TabStops {
  n = 0
  next(value: string): string {
    this.n += 1
    return `\${${this.n}:${esc(value)}}`
  }
}

/** defaults オブジェクトを JSON5 のスニペット文字列へ (スカラー値がタブストップになる) */
function toJson5Snippet(value: unknown, stops: TabStops, indent: string): string {
  if (typeof value === 'string') return `'${stops.next(value)}'`
  if (typeof value === 'number' || typeof value === 'boolean') return stops.next(String(value))
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const inner = value.map((v) => `${indent}  ${toJson5Snippet(v, stops, `${indent}  `)},`)
    return `[\n${inner.join('\n')}\n${indent}]`
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    const inner = entries.map(
      ([k, v]) => `${indent}  ${k}: ${toJson5Snippet(v, stops, `${indent}  `)},`,
    )
    return `{\n${inner.join('\n')}\n${indent}}`
  }
  return String(value)
}

/** defaults オブジェクトを YAML のスニペット文字列へ */
function toYamlSnippet(value: unknown, stops: TabStops, indent: string): string {
  if (typeof value === 'string') return `'${stops.next(value)}'`
  if (typeof value === 'number' || typeof value === 'boolean') return stops.next(String(value))
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `\n${value
      .map((v) => {
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          const entries = Object.entries(v)
          const [first, ...rest] = entries
          const lines = [
            `${indent}- ${first[0]}: ${toYamlSnippet(first[1], stops, `${indent}    `)}`,
            ...rest.map(([k, val]) => `${indent}  ${k}: ${toYamlSnippet(val, stops, `${indent}    `)}`),
          ]
          return lines.join('\n')
        }
        return `${indent}- ${toYamlSnippet(v, stops, `${indent}  `)}`
      })
      .join('\n')}`
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    return `\n${entries
      .map(([k, v]) => `${indent}${k}: ${toYamlSnippet(v, stops, `${indent}  `)}`)
      .join('\n')}`
  }
  return String(value)
}

/** xtype のコンポーネントスニペット全体を作る */
function buildComponentSnippet(xtype: string, format: Format): string {
  const meta = getXtypeMeta(xtype)
  const defaults = meta?.defaults ?? {}
  const stops = new TabStops()
  if (format === 'json5') {
    const body = Object.entries(defaults)
      .map(([k, v]) => `  ${k}: ${toJson5Snippet(v, stops, '  ')},`)
      .join('\n')
    // 末尾カンマは JSON5 で常に合法なので、配列への挿入で構文が壊れないよう付けておく
    return `{\n  xtype: '${xtype}',\n${body}\n},`
  }
  const body = Object.entries(defaults)
    .map(([k, v]) => `${k}: ${toYamlSnippet(v, stops, '  ')}`)
    .join('\n')
  return `xtype: ${xtype}\n${body}`
}

// ---------------------------------------------------------------- 文脈判定

/** カーソル位置を囲んでいるオブジェクトの xtype を推定する */
function findEnclosingXtype(textBefore: string, format: Format): string | undefined {
  if (format === 'json5') {
    // 囲んでいる '{' を後方走査で探す
    let depth = 0
    let start = -1
    for (let i = textBefore.length - 1; i >= 0; i--) {
      const c = textBefore[i]
      if (c === '}' || c === ']') depth++
      else if (c === '{' || c === '[') {
        if (depth === 0 && c === '{') {
          start = i
          break
        }
        if (depth > 0) depth--
      }
    }
    if (start < 0) return undefined
    // そのオブジェクト直下 (ネスト深度 0) の xtype を探す
    const scope = textBefore.slice(start + 1)
    for (const m of scope.matchAll(/xtype\s*:\s*['"]?([\w-]+)/g)) {
      const upto = scope.slice(0, m.index)
      const depthAt =
        (upto.match(/[{[]/g)?.length ?? 0) - (upto.match(/[}\]]/g)?.length ?? 0)
      if (depthAt === 0) return m[1]
    }
    return undefined
  }

  // YAML: 現在行のインデント以浅の行を遡ってブロック開始を探し、その中の xtype を拾う
  const lines = textBefore.split('\n')
  const currentLine = lines.pop() ?? ''
  const currentIndent = /^\s*/.exec(currentLine)![0].length
  let blockStart = 0
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]
    if (!line.trim()) continue
    const indent = /^\s*/.exec(line)![0].length
    const isListItem = /^\s*-\s/.test(line)
    if (indent < currentIndent || (isListItem && indent <= currentIndent)) {
      blockStart = i
      break
    }
  }
  for (let i = blockStart; i < lines.length; i++) {
    const m = /^\s*(?:-\s+)?xtype\s*:\s*['"]?([\w-]+)/.exec(lines[i])
    if (m) return m[1]
  }
  return undefined
}

// ---------------------------------------------------------------- 候補生成

function xtypeSuggestions(
  monaco: typeof Monaco,
  range: Monaco.IRange,
  format: Format,
  hasQuote: boolean,
): Monaco.languages.CompletionItem[] {
  return Object.entries(XTYPE_META).flatMap(([name, meta]) =>
    [name, ...(meta.aliases ?? [])].map((xtype) => ({
      label: xtype,
      kind: monaco.languages.CompletionItemKind.EnumMember,
      detail: meta.description,
      insertText: format === 'json5' && !hasQuote ? `'${xtype}'` : xtype,
      range,
      sortText: `0${xtype}`,
    })),
  )
}

function layoutSuggestions(
  monaco: typeof Monaco,
  range: Monaco.IRange,
  format: Format,
  hasQuote: boolean,
): Monaco.languages.CompletionItem[] {
  return Object.entries(LAYOUT_META).flatMap(([name, meta]) =>
    [name, ...(meta.aliases ?? [])].map((layout) => ({
      label: layout,
      kind: monaco.languages.CompletionItemKind.EnumMember,
      detail: meta.description,
      insertText: format === 'json5' && !hasQuote ? `'${layout}'` : layout,
      range,
      sortText: `0${layout}`,
    })),
  )
}

function propSuggestions(
  monaco: typeof Monaco,
  range: Monaco.IRange,
  xtype: string | undefined,
): Monaco.languages.CompletionItem[] {
  const meta = xtype ? getXtypeMeta(xtype) : undefined
  const specific = meta?.props ?? []
  const all = [...new Set([...specific, ...COMMON_PROPS])]
  return all.map((prop) => ({
    label: prop,
    kind: monaco.languages.CompletionItemKind.Property,
    detail: specific.includes(prop) ? `${xtype} の config` : '共通 config',
    insertText: `${prop}: `,
    range,
    // xtype 固有の config を上位に
    sortText: specific.includes(prop) ? `1${prop}` : `2${prop}`,
  }))
}

function componentSnippetSuggestions(
  monaco: typeof Monaco,
  range: Monaco.IRange,
  format: Format,
): Monaco.languages.CompletionItem[] {
  return Object.entries(XTYPE_META).map(([name, meta]) => ({
    label: `${name} コンポーネント`,
    filterText: name,
    kind: monaco.languages.CompletionItemKind.Snippet,
    detail: meta.description,
    documentation: '基本プロパティ入りのテンプレートを挿入 (Tab で入力箇所を移動)',
    insertText: buildComponentSnippet(name, format),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    range,
    sortText: `3${name}`,
  }))
}

// ---------------------------------------------------------------- 登録

export function registerDslCompletion(monaco: typeof Monaco): void {
  for (const language of ['javascript', 'yaml'] as const) {
    const format: Format = language === 'yaml' ? 'yaml' : 'json5'
    monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ["'", '"', ':', ' '],
      provideCompletionItems(model, position) {
        const line = model
          .getLineContent(position.lineNumber)
          .slice(0, position.column - 1)
        const word = model.getWordUntilPosition(position)
        const range: Monaco.IRange = {
          startLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endLineNumber: position.lineNumber,
          endColumn: word.endColumn,
        }

        // xtype: の値位置
        const xtypeValue = /xtype\s*:\s*(['"]?)[\w-]*$/.exec(line)
        if (xtypeValue) {
          return { suggestions: xtypeSuggestions(monaco, range, format, xtypeValue[1] !== '') }
        }

        // layout: の値位置 (layout: { type: ... } も対象)
        const layoutValue = /(?:layout|type)\s*:\s*(['"]?)[\w-]*$/.exec(line)
        if (layoutValue) {
          return { suggestions: layoutSuggestions(monaco, range, format, layoutValue[1] !== '') }
        }

        // キー位置 (行頭 / '{' ',' の後 / YAML の '- ' の後)
        const keyPosition =
          format === 'json5'
            ? /(?:^\s*|[{,]\s*)[\w$]*$/.test(line)
            : /^\s*(?:-\s+)?[\w]*$/.test(line)
        if (keyPosition) {
          const before = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          })
          const xtype = findEnclosingXtype(before, format)
          return {
            suggestions: [
              ...propSuggestions(monaco, range, xtype),
              ...componentSnippetSuggestions(monaco, range, format),
            ],
          }
        }

        return { suggestions: [] }
      },
    })
  }
}
