import type * as React from 'react'
import type { ComponentConfig } from './types'

/** 数値なら px を付与 */
export function toCssSize(v: number | string | undefined): string | undefined {
  if (v === undefined) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

/** ExtJS の margin: '5 10 5 10' のようなスペース区切り数値を CSS 表記へ */
export function toCssBox(v: number | string | undefined): string | undefined {
  if (v === undefined) return undefined
  if (typeof v === 'number') return `${v}px`
  return v
    .split(/\s+/)
    .map((p) => (/^-?\d+(\.\d+)?$/.test(p) ? `${p}px` : p))
    .join(' ')
}

/** width / height / margin / style などコンポーネント共通のスタイルを算出 */
export function styleOf(config: ComponentConfig): React.CSSProperties {
  const style: React.CSSProperties = {}
  const width = toCssSize(config.width)
  const height = toCssSize(config.height)
  const minWidth = toCssSize(config.minWidth)
  const minHeight = toCssSize(config.minHeight)
  const margin = toCssBox(config.margin)
  if (width !== undefined) style.width = width
  if (height !== undefined) style.height = height
  if (minWidth !== undefined) style.minWidth = minWidth
  if (minHeight !== undefined) style.minHeight = minHeight
  if (margin !== undefined) style.margin = margin
  if (config.flex !== undefined) {
    style.flex = `${config.flex} 1 0`
    style.minWidth = style.minWidth ?? 0
    style.minHeight = style.minHeight ?? 0
  }
  if (typeof config.style === 'object' && config.style !== null) {
    Object.assign(style, config.style)
  }
  return style
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
