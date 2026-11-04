import type { FenceOptions } from './registry'

// データ型フェンスの本文の解釈は validate-dsl (Node) からも使うので parser.ts に置く
export { parseData as parseFenceData } from '../parser'

/**
 * フェンスの meta 文字列を解釈する。
 * `height=320 theme=dark title="月次 売上" sort=false filter` →
 * { height: '320', theme: 'dark', title: '月次 売上', sort: 'false', filter: true }
 */
export function parseFenceMeta(meta: string | undefined): FenceOptions {
  const options: FenceOptions = {}
  if (!meta) return options
  const re = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g
  for (const m of meta.matchAll(re)) {
    options[m[1]] = m[2] ?? m[3] ?? m[4] ?? true
  }
  return options
}

/** meta の真偽値。未指定なら fallback、'false' / 'no' / '0' は false */
export function optionFlag(options: FenceOptions, key: string, fallback: boolean): boolean {
  const v = options[key]
  if (v === undefined) return fallback
  if (v === true) return true
  return !/^(false|no|off|0)$/i.test(v)
}

/** height=320 → '320px'。CSS 長さ (20rem / 50vh) はそのまま */
export function fenceHeight(v: string | number | true | undefined): string | undefined {
  if (v === undefined || v === true) return undefined
  return /^\d+(\.\d+)?$/.test(String(v)) ? `${v}px` : String(v)
}
