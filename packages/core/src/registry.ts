import type * as React from 'react'
import type { RendererProps } from './types'

export type XtypeRenderer = React.ComponentType<RendererProps>

const componentRegistry = new Map<string, XtypeRenderer>()

/** xtype に React コンポーネントを登録する(上書き可・拡張ポイント) */
export function registerComponent(xtype: string | string[], renderer: XtypeRenderer): void {
  for (const t of Array.isArray(xtype) ? xtype : [xtype]) {
    componentRegistry.set(t, renderer)
  }
}

export function resolveComponent(xtype: string): XtypeRenderer | undefined {
  return componentRegistry.get(xtype)
}

export function registeredXtypes(): string[] {
  return [...componentRegistry.keys()].sort()
}
