import type { ComponentType } from 'react'

/** フェンスの meta 部 (```echarts height=320 theme=dark sort=false) を解釈した値。値なしのキーは true */
export type FenceOptions = Record<string, string | true>

export interface FenceRendererProps {
  /** フェンス本文 (そのまま) */
  source: string
  /** kind: 'data' のとき JSON5 / YAML として解釈した値。'text' では undefined */
  data: unknown
  options: FenceOptions
  /** 実際に書かれた言語名 (別名で登録したものは別名のまま) */
  lang: string
}

export interface FenceDefinition {
  /** 'text': 本文を DSL としてそのまま渡す / 'data': JSON5・YAML として解釈してから渡す */
  kind: 'text' | 'data'
  /** エラー表示などで使う表示名 (例: 'Mermaid') */
  label: string
  component: ComponentType<FenceRendererProps>
}

const fences = new Map<string, FenceDefinition>()

/** フェンス言語名 → 描画コンポーネントを登録する。配列で別名もまとめて登録できる */
export function registerFence(langs: string | string[], def: FenceDefinition): void {
  for (const lang of Array.isArray(langs) ? langs : [langs]) {
    fences.set(lang.toLowerCase(), def)
  }
}

export function resolveFence(lang: string | undefined): FenceDefinition | undefined {
  return lang ? fences.get(lang.toLowerCase()) : undefined
}

/** 登録済みのフェンス言語名 (別名を含む) */
export function registeredFences(): string[] {
  return [...fences.keys()]
}
