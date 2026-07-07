import JSON5 from 'json5'
import YAML from 'yaml'
import type { ComponentConfig } from './types'

export type DslFormat = 'json5' | 'yaml'

export class DslParseError extends Error {
  line?: number
  column?: number
  constructor(message: string, line?: number, column?: number) {
    super(message)
    this.name = 'DslParseError'
    this.line = line
    this.column = column
  }
}

/**
 * DSL の記法を判別する。
 * 先頭の空行・コメント行を読み飛ばし、`{` で始まれば JSON5、
 * それ以外 (xtype: panel など) は YAML とみなす。
 * コメント記法自体も判別材料になる (`//` `/*` は JSON5、`#` は YAML)。
 */
export function detectFormat(source: string): DslFormat {
  for (const line of source.split('\n')) {
    const t = line.trim()
    if (!t) continue
    if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return 'json5'
    if (t.startsWith('#')) return 'yaml'
    return t.startsWith('{') ? 'json5' : 'yaml'
  }
  return 'json5'
}

/**
 * ExtJS 互換 DSL をパースして ComponentConfig を返す。
 * JSON5 (ExtJS の config をほぼコピペ可能) と YAML (手書き向け) の両記法に対応し、
 * format 省略時は detectFormat() で自動判別する。
 */
export function parseDsl(source: string, format?: DslFormat): ComponentConfig {
  const fmt = format ?? detectFormat(source)
  let value: unknown

  if (fmt === 'json5') {
    try {
      value = JSON5.parse(source)
    } catch (e) {
      const err = e as { message: string; lineNumber?: number; columnNumber?: number }
      throw new DslParseError(err.message, err.lineNumber, err.columnNumber)
    }
  } else {
    try {
      value = YAML.parse(source)
    } catch (e) {
      const err = e as { message: string; linePos?: Array<{ line: number; col: number }> }
      throw new DslParseError(err.message, err.linePos?.[0]?.line, err.linePos?.[0]?.col)
    }
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new DslParseError(
      fmt === 'json5'
        ? 'DSL のルートはオブジェクト { ... } である必要があります'
        : 'DSL のルートはマッピング (xtype: panel など) である必要があります',
    )
  }
  return value as ComponentConfig
}

/**
 * config を DSL 文字列に変換する (JSON5 ⇄ YAML の相互変換に使う)。
 * コメントは保持されない点に注意。
 */
export function stringifyDsl(config: ComponentConfig, format: DslFormat = 'json5'): string {
  if (format === 'yaml') {
    return YAML.stringify(config, { indent: 2, lineWidth: 0 })
  }
  return `${JSON5.stringify(config, { space: 2, quote: "'" })}\n`
}
