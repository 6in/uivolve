import JSON5 from 'json5'
import type { ComponentConfig } from './types'

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
 * ExtJS 互換 DSL (JSON5) をパースして ComponentConfig を返す。
 * ExtJS の config オブジェクトをほぼコピペできるよう、
 * クォートなしキー・シングルクォート・末尾カンマ・コメントを許容する。
 */
export function parseDsl(source: string): ComponentConfig {
  let value: unknown
  try {
    value = JSON5.parse(source)
  } catch (e) {
    const err = e as { message: string; lineNumber?: number; columnNumber?: number }
    throw new DslParseError(err.message, err.lineNumber, err.columnNumber)
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new DslParseError('DSL のルートはオブジェクト { ... } である必要があります')
  }
  return value as ComponentConfig
}
