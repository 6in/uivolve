/**
 * データ型フェンス (本文を JSON5 / YAML として解釈するもの) の本文に求める形。
 * 描画 (FenceBlock) と validate-dsl (Node) の両方から使うので、React にも
 * 相対 import にも依存しない (validate-dsl が strip-types で直接 import する)
 */

// ルートがオブジェクトであることを求めるフェンスと、違ったときの説明
const OBJECT_FENCES: Record<string, string> = {
  echarts: 'ECharts の option はオブジェクト ({ xAxis: ..., series: [...] }) で書いてください',
  'vega-lite': 'Vega-Lite の spec はオブジェクト ({ mark: ..., encoding: ... }) で書いてください',
  wavedrom: 'WaveJSON はオブジェクト ({ signal: [...] } / { reg: [...] }) で書いてください',
}

/** データ型フェンスの言語名 (csv / tsv は本文を自前で解釈するので含まない) */
export const DATA_FENCE_LANGS = ['table', ...Object.keys(OBJECT_FENCES)]

const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)

/**
 * ```table の行の配列。行の配列そのもの、data: [...]、または grid と同じ store.data / store (配列)。
 * 見つからなければ undefined
 */
export function tableRows(data: unknown): unknown[] | undefined {
  if (Array.isArray(data)) return data
  if (!isObject(data)) return undefined
  const store = data.store
  const rows = data.data ?? (Array.isArray(store) ? store : isObject(store) ? store.data : undefined)
  return Array.isArray(rows) ? rows : undefined
}

/** 解釈済みのデータがそのフェンスの求める形か。問題があれば説明文、なければ null */
export function checkFenceData(lang: string, data: unknown): string | null {
  if (lang in OBJECT_FENCES) return isObject(data) ? null : OBJECT_FENCES[lang]
  if (lang === 'table' && !tableRows(data)) {
    return 'table には行の配列 (data: [...]) か、行の配列そのものを書いてください'
  }
  return null
}
